-- ============================================================================
-- Open a room. Run this in the Supabase SQL editor.
-- ----------------------------------------------------------------------------
-- The room code here must match `roomCode` in assets/config.js, and the
-- control token is the password you type into control.html. Rooms cannot be
-- created from the web pages — that is deliberate, and it is why nobody who
-- finds the site can open a room of their own.
-- ============================================================================

insert into public.rooms (code, title, control_token)
values ('CANDO', 'The Missing Piece', 'ckm')
on conflict (code) do update set control_token = excluded.control_token;

-- what rooms exist now
select code, title, phase, board_open from public.rooms order by code;
