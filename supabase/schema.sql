-- ============================================================================
-- THE MISSING PIECE — database setup
-- ----------------------------------------------------------------------------
-- HOW TO USE THIS FILE
--   1. Open your Supabase project
--   2. Click "SQL Editor" in the left sidebar
--   3. Click "New query"
--   4. Paste this entire file in and press Run
--   5. Scroll to the bottom of this file for the one line you must customise
--
-- It is safe to run this more than once. Nothing is deleted. Re-running it is
-- also how you upgrade an existing database when this file gains columns.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- TABLE: rooms
-- One row per workshop. Holds "where are we right now" — which slide is up,
-- whether the board is accepting submissions, which problem is spotlighted.
-- ----------------------------------------------------------------------------
create table if not exists public.rooms (
  code              text primary key,
  title             text not null default 'The Missing Piece',
  phase             text not null default 'lobby',
  current_slide     int  not null default 0,
  board_open        boolean not null default false,
  active_prompt_id  text,
  spotlight_group   text,
  control_token     text not null,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);


-- ----------------------------------------------------------------------------
-- TABLE: participants
-- One row per person who joins. No names — we only ever store role+discipline,
-- so a concern can never be traced back to an individual.
-- ----------------------------------------------------------------------------
create table if not exists public.participants (
  id          uuid primary key default gen_random_uuid(),
  room_code   text not null references public.rooms(code) on delete cascade,
  role        text not null,
  discipline  text not null,
  joined_at   timestamptz not null default now(),
  last_seen   timestamptz not null default now()
);
create index if not exists participants_room_idx on public.participants(room_code);


-- ----------------------------------------------------------------------------
-- TABLE: room_counters
-- Internal bookkeeping so every note gets a stable, human-readable label
-- (C-001, C-002, S-001 ...). These labels are what makes the AI round-trip
-- traceable: the AI refers to them, and we can always find the original.
-- ----------------------------------------------------------------------------
create table if not exists public.room_counters (
  room_code text not null,
  kind      text not null,
  n         bigint not null default 0,
  primary key (room_code, kind)
);


-- ----------------------------------------------------------------------------
-- TABLE: groups
-- The problem statements that come back from the AI after grouping.
-- Created by the facilitator on re-import, never by participants.
-- ----------------------------------------------------------------------------
create table if not exists public.groups (
  id                text not null,
  room_code         text not null references public.rooms(code) on delete cascade,
  label             text not null,
  problem_statement text not null,
  rationale         text,
  color_index       int not null default 0,
  sort_order        int not null default 0,
  created_at        timestamptz not null default now(),
  primary key (room_code, id)
);


-- ----------------------------------------------------------------------------
-- TABLE: concerns
-- Phase 1. What participants say is missing or broken.
-- `ref` is the stable label (C-001). `group_id` is filled in after AI grouping.
-- ----------------------------------------------------------------------------
create table if not exists public.concerns (
  id             uuid primary key default gen_random_uuid(),
  room_code      text not null references public.rooms(code) on delete cascade,
  ref            text,
  prompt_id      text not null,
  body           text not null,
  role           text not null,
  discipline     text not null,
  participant_id uuid,
  group_id       text,
  created_at     timestamptz not null default now()
);
create index if not exists concerns_room_idx    on public.concerns(room_code, created_at);
create index if not exists concerns_group_idx   on public.concerns(room_code, group_id);


-- ----------------------------------------------------------------------------
-- TABLE: solutions
-- Phase 3. How participants propose to fill each gap.
-- Always attached to a group — that is the "many people, one problem" link.
-- ----------------------------------------------------------------------------
create table if not exists public.solutions (
  id             uuid primary key default gen_random_uuid(),
  room_code      text not null references public.rooms(code) on delete cascade,
  ref            text,
  group_id       text not null,
  body           text not null,
  role           text not null,
  discipline     text not null,
  participant_id uuid,
  created_at     timestamptz not null default now()
);
create index if not exists solutions_room_idx  on public.solutions(room_code, created_at);
create index if not exists solutions_group_idx on public.solutions(room_code, group_id);


-- ----------------------------------------------------------------------------
-- Added for the 45-minute format. Safe on an existing database: each line
-- does nothing if the column is already there.
--
--   participants.setting  where they mainly work (dialysis unit, ward, ...)
--   concerns.situation    when the gap happens most (optional tap)
--   groups.proposal       the one concrete thing the program proposes for
--                         this gap — what the room reacts to
--   solutions.kind        'facilitator' (what would help) | 'barrier' (what
--                         would get in the way) | 'idea' (their own theory)
--   solutions.reason      the HOW (facilitator) or WHY (barrier), or the
--                         "because" of their own theory. Required on the phone.
--   solutions.outcome     the "then" of their own theory
-- ----------------------------------------------------------------------------
alter table public.participants add column if not exists setting   text;
alter table public.concerns     add column if not exists situation text;
alter table public.groups       add column if not exists proposal  text;
alter table public.groups       add column if not exists stat      text;   -- the survey number for this gap
alter table public.solutions    add column if not exists kind      text not null default 'idea';
alter table public.solutions    add column if not exists reason    text;
alter table public.solutions    add column if not exists outcome   text;
create index if not exists solutions_kind_idx on public.solutions(room_code, kind);


-- ----------------------------------------------------------------------------
-- Stable label generator
-- Takes a lock on one counter row, so even if 150 phones submit in the same
-- second, every note still gets its own number with no gaps and no duplicates.
-- ----------------------------------------------------------------------------
create or replace function public.next_ref(p_room text, p_kind text, p_prefix text)
returns text
language plpgsql
-- `security definer` means: run this with the database owner's permissions,
-- not the participant's. Participants are deliberately locked out of the
-- counter table, but their note still needs a number, so the numbering
-- happens on their behalf rather than by them.
security definer
set search_path = public
as $$
declare
  v_n bigint;
begin
  insert into public.room_counters(room_code, kind, n)
  values (p_room, p_kind, 0)
  on conflict (room_code, kind) do nothing;

  update public.room_counters
     set n = n + 1
   where room_code = p_room and kind = p_kind
  returning n into v_n;

  return p_prefix || '-' || lpad(v_n::text, 3, '0');
end;
$$;

create or replace function public.tg_concern_ref() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.ref is null then
    new.ref := public.next_ref(new.room_code, 'concern', 'C');
  end if;
  return new;
end;
$$;

create or replace function public.tg_solution_ref() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.ref is null then
    new.ref := public.next_ref(new.room_code, 'solution', 'S');
  end if;
  return new;
end;
$$;

drop trigger if exists concerns_ref on public.concerns;
create trigger concerns_ref before insert on public.concerns
  for each row execute function public.tg_concern_ref();

drop trigger if exists solutions_ref on public.solutions;
create trigger solutions_ref before insert on public.solutions
  for each row execute function public.tg_solution_ref();


-- ============================================================================
-- SECURITY
-- ----------------------------------------------------------------------------
-- The anon key in config.js is public — anyone who opens the page has it.
-- So the rules below are the real protection. In plain English:
--
--   Participants CAN : join, and add notes while the board is open
--   Participants CANNOT : edit or delete anything, including their own notes,
--                         or change which slide is showing
--   Only the facilitator (who holds the control token) can drive the session
--   or import the AI groupings.
-- ============================================================================

alter table public.rooms         enable row level security;
alter table public.participants  enable row level security;
alter table public.concerns      enable row level security;
alter table public.solutions     enable row level security;
alter table public.groups        enable row level security;
alter table public.room_counters enable row level security;

-- Everyone may look at the room, the notes and the groups.
-- (There are no names anywhere, so there is nothing private to leak.)
drop policy if exists read_rooms on public.rooms;
create policy read_rooms on public.rooms for select using (true);

drop policy if exists read_participants on public.participants;
create policy read_participants on public.participants for select using (true);

drop policy if exists read_concerns on public.concerns;
create policy read_concerns on public.concerns for select using (true);

drop policy if exists read_solutions on public.solutions;
create policy read_solutions on public.solutions for select using (true);

drop policy if exists read_groups on public.groups;
create policy read_groups on public.groups for select using (true);

-- Anyone may join a room that exists.
drop policy if exists join_room on public.participants;
create policy join_room on public.participants for insert with check (
  exists (select 1 from public.rooms r where r.code = room_code)
);

-- Notes may only be added while the facilitator has the board open.
-- This is what stops someone posting to the board at 3am next Tuesday.
drop policy if exists add_concern on public.concerns;
create policy add_concern on public.concerns for insert with check (
  exists (select 1 from public.rooms r where r.code = room_code and r.board_open = true)
  and char_length(body) between 1 and 400
);

drop policy if exists add_solution on public.solutions;
create policy add_solution on public.solutions for insert with check (
  exists (select 1 from public.rooms r where r.code = room_code and r.board_open = true)
  and char_length(body) between 1 and 400
  and char_length(coalesce(reason,  '')) <= 400
  and char_length(coalesce(outcome, '')) <= 400
  and kind in ('idea', 'facilitator', 'barrier')
  and exists (select 1 from public.groups g where g.room_code = room_code and g.id = group_id)
);

-- Nothing above grants UPDATE or DELETE to anybody, which means participants
-- cannot tamper with the board. Facilitator actions go through the functions
-- below instead, which check the control token first.


-- ----------------------------------------------------------------------------
-- Second lock: participants are only ever GRANTED the ability to look and to
-- add. Even if a rule above were misconfigured, the database itself will still
-- refuse an attempt to edit or delete a note.
-- ----------------------------------------------------------------------------
grant usage on schema public to anon;

-- Start from nothing and grant back only what participants need. Supabase
-- grants new tables to `anon` by default, and a table-wide grant is NOT
-- cancelled by adding a narrower column grant afterwards — so the revoke has
-- to come first or the column restriction below silently does nothing.
revoke all on public.rooms, public.participants, public.concerns,
               public.solutions, public.groups, public.room_counters from anon;

-- IMPORTANT: the room's control password lives in this table, and the key in
-- config.js is public — anyone who opens the join page has it. Participants
-- therefore get the specific columns they need and NOT `control_token`.
-- Granting the whole table here would hand every participant the password
-- that drives your session.
grant select (code, title, phase, current_slide, board_open,
              active_prompt_id, spotlight_group, created_at, updated_at)
  on public.rooms to anon;

grant select on public.participants, public.concerns,
                public.solutions, public.groups to anon;
grant insert on public.participants, public.concerns, public.solutions to anon;
-- room_counters stays revoked above: it is internal bookkeeping, written only
-- by the numbering function, never by a participant.


-- ----------------------------------------------------------------------------
-- FACILITATOR: drive the session
-- ----------------------------------------------------------------------------
create or replace function public.room_control(
  p_room     text,
  p_token    text,
  p_phase    text default null,
  p_slide    int  default null,
  p_open     boolean default null,
  p_prompt   text default null,
  p_spot     text default null
) returns jsonb          -- deliberately NOT the whole row: that would echo the
                         -- control password back over the network on every call
language plpgsql
security definer
set search_path = public
as $$
declare
  v_room public.rooms;
begin
  select * into v_room from public.rooms where code = p_room;
  if not found then
    raise exception 'No such room';
  end if;
  if v_room.control_token is distinct from p_token then
    raise exception 'Wrong control token';
  end if;

  update public.rooms set
    phase            = coalesce(p_phase,  phase),
    current_slide    = coalesce(p_slide,  current_slide),
    board_open       = coalesce(p_open,   board_open),
    active_prompt_id = case when p_prompt = '__null__' then null
                            else coalesce(p_prompt, active_prompt_id) end,
    spotlight_group  = case when p_spot   = '__null__' then null
                            else coalesce(p_spot, spotlight_group) end,
    updated_at       = now()
  where code = p_room
  returning * into v_room;

  return jsonb_build_object(
    'code',             v_room.code,
    'title',            v_room.title,
    'phase',            v_room.phase,
    'current_slide',    v_room.current_slide,
    'board_open',       v_room.board_open,
    'active_prompt_id', v_room.active_prompt_id,
    'spotlight_group',  v_room.spotlight_group
  );
end;
$$;


-- ----------------------------------------------------------------------------
-- FACILITATOR: import the AI's groupings
-- ----------------------------------------------------------------------------
-- This is the safety net on the whole AI round-trip. It refuses the import
-- unless EVERY concern label the AI mentions actually exists in this room.
-- If the AI invented a C-999 that was never said out loud, nothing is written
-- and you get told exactly which labels were wrong.
-- ----------------------------------------------------------------------------
create or replace function public.import_groups(
  p_room   text,
  p_token  text,
  p_groups jsonb
) returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  v_token   text;
  v_bad     text[];
  v_group   jsonb;
  v_ref     text;
  v_idx     int := 0;
  v_count   int := 0;
  v_linked  int := 0;
begin
  select control_token into v_token from public.rooms where code = p_room;
  if not found then raise exception 'No such room'; end if;
  if v_token is distinct from p_token then raise exception 'Wrong control token'; end if;

  -- Collect every concern label the AI referenced that we do not recognise.
  select array_agg(distinct r) into v_bad
  from (
    select jsonb_array_elements_text(g->'source_ids') as r
    from jsonb_array_elements(p_groups) as g
  ) refs
  where not exists (
    select 1 from public.concerns c where c.room_code = p_room and c.ref = refs.r
  );

  if v_bad is not null and array_length(v_bad, 1) > 0 then
    return jsonb_build_object(
      'ok', false,
      'error', 'unknown_refs',
      'unknown', to_jsonb(v_bad),
      'message', 'The AI referred to notes that do not exist in this room. Nothing was imported.'
    );
  end if;

  -- Passed validation. Replace any previous grouping.
  delete from public.groups where room_code = p_room;
  update public.concerns set group_id = null where room_code = p_room;

  for v_group in select * from jsonb_array_elements(p_groups)
  loop
    insert into public.groups(id, room_code, label, problem_statement, rationale, proposal, stat, color_index, sort_order)
    values (
      v_group->>'id',
      p_room,
      coalesce(v_group->>'label', v_group->>'id'),
      coalesce(v_group->>'problem_statement', ''),
      v_group->>'rationale',
      v_group->>'proposal',
      v_group->>'stat',
      v_idx,
      v_idx
    );
    v_count := v_count + 1;

    for v_ref in select jsonb_array_elements_text(v_group->'source_ids')
    loop
      update public.concerns
         set group_id = v_group->>'id'
       where room_code = p_room and ref = v_ref;
      v_linked := v_linked + 1;
    end loop;

    v_idx := v_idx + 1;
  end loop;

  return jsonb_build_object(
    'ok', true,
    'groups', v_count,
    'linked', v_linked,
    'ungrouped', (select count(*) from public.concerns where room_code = p_room and group_id is null)
  );
end;
$$;


-- ----------------------------------------------------------------------------
-- FACILITATOR: wipe the board (for a dry run, or to reuse the room)
-- ----------------------------------------------------------------------------
create or replace function public.reset_room(p_room text, p_token text)
returns jsonb
language plpgsql security definer set search_path = public
as $$
declare v_token text;
begin
  select control_token into v_token from public.rooms where code = p_room;
  if not found then raise exception 'No such room'; end if;
  if v_token is distinct from p_token then raise exception 'Wrong control token'; end if;

  delete from public.solutions    where room_code = p_room;
  delete from public.concerns     where room_code = p_room;
  delete from public.groups       where room_code = p_room;
  delete from public.participants where room_code = p_room;
  delete from public.room_counters where room_code = p_room;
  update public.rooms set phase='lobby', current_slide=0, board_open=false,
         active_prompt_id=null, spotlight_group=null, updated_at=now()
   where code = p_room;

  return jsonb_build_object('ok', true);
end;
$$;

grant execute on function public.room_control(text,text,text,int,boolean,text,text) to anon;
grant execute on function public.import_groups(text,text,jsonb) to anon;
grant execute on function public.reset_room(text,text) to anon;


-- ----------------------------------------------------------------------------
-- Live updates — lets the projector screen react the instant a note arrives
-- ----------------------------------------------------------------------------
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
end $$;

do $$
declare t text;
begin
  foreach t in array array['rooms','concerns','solutions','groups','participants']
  loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end $$;


-- ============================================================================
-- >>> THE ONE LINE YOU MUST CHANGE <<<
-- ----------------------------------------------------------------------------
-- Pick your room code and a control token. The control token is your password
-- for the facilitator screen — make it something nobody will guess, and do not
-- put it in config.js. You will type it into control.html on the day.
-- ============================================================================

insert into public.rooms (code, title, control_token)
values ('PZKT', 'The Missing Piece', 'change-this-to-a-long-random-phrase')
on conflict (code) do nothing;

-- Done. Check it worked:
select code, title, phase, board_open from public.rooms;
