-- A successful intake save retires all prior plans and cascaded feedback.
-- The owner lock, intake write and deletion share one transaction.
create or replace function public.save_training_intake(
  p_goal text, p_experience_level text, p_health_constraints text, p_notes text
)
returns setof public.training_intakes
language plpgsql security definer set search_path = '' as $$
declare
  owner_id uuid := auth.uid();
  latest public.training_intakes%rowtype;
  saved public.training_intakes%rowtype;
  new_time timestamptz;
  latest_is_unique boolean;
begin
  if owner_id is null then
    raise exception using errcode = '28000', message = 'Authentication is required.';
  end if;
  if p_goal is null or pg_catalog.length(pg_catalog.btrim(p_goal)) = 0
    or p_experience_level is null or p_experience_level not in ('beginner', 'intermediate', 'advanced')
    or p_health_constraints is null or pg_catalog.length(pg_catalog.btrim(p_health_constraints)) = 0 then
    raise exception using errcode = '22023', message = 'Invalid intake.';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(owner_id::text, 0));
  select i.* into latest from public.training_intakes i where i.user_id = owner_id
  order by i.created_at desc, i.updated_at desc limit 1;
  select count(*) = 1 into latest_is_unique from public.training_intakes i
  where i.user_id = owner_id and i.created_at = latest.created_at and i.updated_at = latest.updated_at;
  if latest.id is not null and latest_is_unique and not exists (
    select 1 from public.training_plans p where p.user_id = owner_id and p.intake_id = latest.id
  ) then
    update public.training_intakes i
    set goal = pg_catalog.btrim(p_goal), experience_level = p_experience_level,
        health_constraints = pg_catalog.btrim(p_health_constraints), notes = nullif(pg_catalog.btrim(p_notes), '')
    where i.id = latest.id and i.user_id = owner_id returning i.* into saved;
  else
    new_time := greatest(pg_catalog.clock_timestamp(), latest.created_at + interval '1 microsecond');
    insert into public.training_intakes (user_id, goal, experience_level, health_constraints, notes, created_at, updated_at)
    values (owner_id, pg_catalog.btrim(p_goal), p_experience_level, pg_catalog.btrim(p_health_constraints),
            nullif(pg_catalog.btrim(p_notes), ''), new_time, new_time)
    returning * into saved;
  end if;
  delete from public.training_plans p where p.user_id = owner_id;
  return next saved;
end;
$$;
revoke all on function public.save_training_intake(text, text, text, text)
from public, anon, authenticated, service_role;
grant execute on function public.save_training_intake(text, text, text, text) to authenticated;
