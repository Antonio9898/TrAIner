-- Retention runs only when a new draft is committed, never on schema deployment.
create or replace function public.replace_training_plan(
  p_intake_id uuid,
  p_expected_intake_updated_at timestamptz,
  p_plan_content jsonb,
  p_explanation text
)
returns table (outcome text, plan jsonb)
language plpgsql
security definer
set search_path = ''
as $$
declare
  owner_id uuid := auth.uid();
  target public.training_intakes%rowtype;
  latest public.training_intakes%rowtype;
  saved public.training_plans%rowtype;
begin
  if owner_id is null then
    raise exception using errcode = '28000', message = 'Authentication is required.';
  end if;
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(owner_id::text, 0));
  select i.* into target from public.training_intakes i
  where i.id = p_intake_id and i.user_id = owner_id;
  if not found then
    return query select 'missing'::text, null::jsonb;
    return;
  end if;
  select i.* into latest from public.training_intakes i where i.user_id = owner_id
  order by i.created_at desc, i.updated_at desc limit 1;
  if latest.id <> target.id
    or target.updated_at is distinct from p_expected_intake_updated_at
    or (select count(*) from public.training_intakes i where i.user_id = owner_id
        and i.created_at = latest.created_at and i.updated_at = latest.updated_at) <> 1
  then
    return query select 'stale'::text, null::jsonb;
    return;
  end if;
  select p.* into saved from public.training_plans p
  where p.user_id = owner_id and p.intake_id = target.id;
  if found then
    return query select 'existing'::text, pg_catalog.to_jsonb(saved);
    return;
  end if;
  if p_plan_content is null or pg_catalog.jsonb_typeof(p_plan_content) is distinct from 'object'
    or p_explanation is null or pg_catalog.length(pg_catalog.btrim(p_explanation)) = 0 then
    raise exception using errcode = '22023', message = 'Invalid plan content or explanation.';
  end if;
  insert into public.training_plans (user_id, intake_id, status, plan_content, explanation)
  values (owner_id, target.id, 'draft', p_plan_content, pg_catalog.btrim(p_explanation))
  returning * into saved;
  delete from public.training_plans p where p.user_id = owner_id and p.id <> saved.id;
  return query select 'created'::text, pg_catalog.to_jsonb(saved);
end;
$$;

revoke all on function public.replace_training_plan(uuid, timestamptz, jsonb, text)
from public, anon, authenticated, service_role;
grant execute on function public.replace_training_plan(uuid, timestamptz, jsonb, text) to authenticated;

create index if not exists training_intakes_owner_latest_idx
on public.training_intakes(user_id, created_at desc, updated_at desc);

-- Separate from the existing plan/feedback timestamp trigger. Preserve exact
-- microsecond tokens even for repeated updates inside a single transaction.
create or replace function public.set_training_intake_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at := greatest(pg_catalog.clock_timestamp(), old.updated_at + interval '1 microsecond');
  return new;
end;
$$;
revoke all on function public.set_training_intake_updated_at() from public, anon, authenticated, service_role;
drop trigger if exists set_training_intakes_updated_at on public.training_intakes;
create trigger set_training_intakes_updated_at before update on public.training_intakes
for each row execute function public.set_training_intake_updated_at();

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
  return next saved;
end;
$$;
revoke all on function public.save_training_intake(text, text, text, text)
from public, anon, authenticated, service_role;
grant execute on function public.save_training_intake(text, text, text, text) to authenticated;

-- All application writes now pass through the owner-serialized RPC boundary.
-- Keep owner SELECT policies and historical data intact.
revoke insert on table public.training_plans from public, anon, authenticated;
revoke insert, update, delete on table public.training_intakes from public, anon, authenticated;

revoke all on function public.revise_training_plan(uuid, timestamptz, text, text, text, jsonb, text)
from public, anon, authenticated, service_role;
grant execute on function public.revise_training_plan(uuid, timestamptz, text, text, text, jsonb, text)
to authenticated;

create or replace function public.revise_training_plan(
  p_plan_id uuid,
  p_expected_updated_at timestamp with time zone,
  p_revision_note text,
  p_revision_summary text,
  p_health_constraints text,
  p_plan_content jsonb,
  p_explanation text
)
returns setof public.training_plans
language plpgsql
security definer
set search_path = ''
as $$
declare
  locked_plan public.training_plans%rowtype;
  locked_health_constraints text;
  revised_plan public.training_plans%rowtype;
begin
  if auth.uid() is null then
    raise exception using errcode = '28000', message = 'Authentication is required.';
  end if;
  -- Owner lock always precedes plan and intake row locks.
  perform pg_catalog.pg_advisory_xact_lock(pg_catalog.hashtextextended(auth.uid()::text, 0));
  if p_revision_note is null or length(btrim(p_revision_note)) = 0 then
    raise exception using
      errcode = '22023',
      message = 'Revision note must not be blank.';
  end if;

  if p_revision_summary is null
    or length(btrim(p_revision_summary)) = 0
    or length(p_revision_summary) > 600
  then
    raise exception using
      errcode = '22023',
      message = 'Revision summary must contain between 1 and 600 characters.';
  end if;

  if p_health_constraints is null or length(btrim(p_health_constraints)) = 0 then
    raise exception using
      errcode = '22023',
      message = 'Health constraints must not be blank.';
  end if;

  if p_plan_content is null or jsonb_typeof(p_plan_content) is distinct from 'object' then
    raise exception using
      errcode = '22023',
      message = 'Plan content must be a JSON object.';
  end if;

  if p_explanation is null or length(btrim(p_explanation)) = 0 then
    raise exception using
      errcode = '22023',
      message = 'Explanation must not be blank.';
  end if;

  select training_plan.*
  into locked_plan
  from public.training_plans as training_plan
  where training_plan.id = p_plan_id
    and training_plan.user_id = auth.uid()
  for update;

  if not found
    or locked_plan.updated_at is distinct from p_expected_updated_at
  then
    return;
  end if;

  select training_intake.health_constraints
  into locked_health_constraints
  from public.training_intakes as training_intake
  where training_intake.id = locked_plan.intake_id
    and training_intake.user_id = auth.uid()
  for update;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'Linked training intake is unavailable.';
  end if;

  if locked_health_constraints is distinct from btrim(p_health_constraints) then
    update public.training_intakes as training_intake
    set health_constraints = btrim(p_health_constraints)
    where training_intake.id = locked_plan.intake_id
      and training_intake.user_id = auth.uid();

    if not found then
      raise exception using
        errcode = 'P0001',
        message = 'Training intake revision could not be applied.';
    end if;
  end if;

  update public.training_plans as training_plan
  set plan_content = p_plan_content,
      explanation = btrim(p_explanation),
      revision_count = locked_plan.revision_count + 1,
      last_revision_requested_at = now(),
      last_revision_note = btrim(p_revision_note),
      last_revision_summary = btrim(p_revision_summary),
      status = 'draft',
      accepted_at = null
  where training_plan.id = locked_plan.id
    and training_plan.user_id = auth.uid()
    and training_plan.updated_at = locked_plan.updated_at
  returning training_plan.* into revised_plan;

  if not found then
    raise exception using
      errcode = 'P0001',
      message = 'Training plan revision could not be applied.';
  end if;

  return next revised_plan;
end;
$$;
