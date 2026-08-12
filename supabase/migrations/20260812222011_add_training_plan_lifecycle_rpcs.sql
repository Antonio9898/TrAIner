create or replace function public.revise_training_plan(
  p_plan_id uuid,
  p_expected_updated_at timestamp with time zone,
  p_revision_note text,
  p_health_constraints text,
  p_plan_content jsonb,
  p_explanation text
)
returns setof public.training_plans
language plpgsql
security invoker
set search_path = ''
as $$
declare
  locked_plan public.training_plans%rowtype;
  locked_health_constraints text;
  revised_plan public.training_plans%rowtype;
begin
  if p_revision_note is null or length(btrim(p_revision_note)) = 0 then
    raise exception using
      errcode = '22023',
      message = 'Revision note must not be blank.';
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

create or replace function public.accept_training_plan(
  p_plan_id uuid,
  p_expected_updated_at timestamp with time zone
)
returns setof public.training_plans
language plpgsql
security invoker
set search_path = ''
as $$
declare
  locked_plan public.training_plans%rowtype;
  accepted_plan public.training_plans%rowtype;
begin
  select training_plan.*
  into locked_plan
  from public.training_plans as training_plan
  where training_plan.id = p_plan_id
    and training_plan.user_id = auth.uid()
  for update;

  if not found then
    return;
  end if;

  if locked_plan.status = 'accepted' then
    return next locked_plan;
    return;
  end if;

  if locked_plan.updated_at is distinct from p_expected_updated_at then
    return;
  end if;

  update public.training_plans as training_plan
  set status = 'accepted',
      accepted_at = now()
  where training_plan.id = locked_plan.id
    and training_plan.user_id = auth.uid()
    and training_plan.status = 'draft'
    and training_plan.updated_at = locked_plan.updated_at
  returning training_plan.* into accepted_plan;

  if not found then
    return;
  end if;

  return next accepted_plan;
end;
$$;

revoke execute on function public.revise_training_plan(
  uuid,
  timestamp with time zone,
  text,
  text,
  jsonb,
  text
) from public, anon, service_role;

revoke execute on function public.accept_training_plan(
  uuid,
  timestamp with time zone
) from public, anon, service_role;

grant execute on function public.revise_training_plan(
  uuid,
  timestamp with time zone,
  text,
  text,
  jsonb,
  text
) to authenticated;

grant execute on function public.accept_training_plan(
  uuid,
  timestamp with time zone
) to authenticated;
