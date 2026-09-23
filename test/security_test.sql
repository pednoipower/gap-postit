\set ON_ERROR_STOP off
\pset pager off
\echo '=============================================='
\echo 'SECURITY TESTS — acting as an ordinary participant'
\echo '=============================================='

-- board is closed
select public.room_control('CANDO','change-this-to-a-long-random-phrase', p_open := false);

set role anon;
\echo ''
\echo '[1] Post a note while the board is CLOSED  -> must FAIL'
insert into public.concerns(room_code,prompt_id,body,role,discipline)
values ('CANDO','p1','should not get through','doctor','nephro');

reset role;
select public.room_control('CANDO','change-this-to-a-long-random-phrase', p_open := true);
set role anon;

\echo ''
\echo '[2] Post a note while the board is OPEN    -> must SUCCEED'
insert into public.concerns(room_code,prompt_id,body,role,discipline)
values ('CANDO','p1','Nobody told the family dialysis could stop','doctor','nephro');

\echo ''
\echo '[3] Edit someone elses note                -> must FAIL'
update public.concerns set body='hacked' where room_code='CANDO';

\echo ''
\echo '[4] Delete a note                          -> must FAIL'
delete from public.concerns where room_code='CANDO';

\echo ''
\echo '[5] Skip to another slide                  -> must FAIL'
update public.rooms set current_slide=99 where code='CANDO';

\echo ''
\echo '[6] Drive the session without the token    -> must FAIL'
select public.room_control('CANDO','guessing','wrong');

\echo ''
\echo '[7] Fake a problem group                   -> must FAIL'
insert into public.groups(id,room_code,label,problem_statement) values ('g9','CANDO','x','y');

\echo ''
\echo '[8] Peek at internal counters              -> must FAIL'
select * from public.room_counters;

\echo ''
\echo '[9] Post a note to a room that does not exist -> must FAIL'
insert into public.concerns(room_code,prompt_id,body,role,discipline)
values ('ZZZZ','p1','ghost room','nurse','palliative');

\echo ''
\echo '[10] Post an absurdly long note            -> must FAIL'
insert into public.concerns(room_code,prompt_id,body,role,discipline)
values ('CANDO','p1',repeat('x',500),'nurse','palliative');

reset role;
\echo ''
\echo '--- what actually survived ---'
select ref, body, role, discipline from public.concerns where room_code='CANDO' order by ref;
select current_slide, board_open from public.rooms where code='CANDO';
