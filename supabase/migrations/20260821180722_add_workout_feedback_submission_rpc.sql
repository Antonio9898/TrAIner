alter table public.workout_feedback
add column submission_token uuid;

update public.workout_feedback
set submission_token = extensions.gen_random_uuid()
where submission_token is null;

alter table public.workout_feedback
alter column submission_token set not null;

alter table public.workout_feedback
add constraint workout_feedback_owner_submission_token_key
unique (user_id, submission_token);

comment on column public.workout_feedback.submission_token is
  'Client-generated idempotency token. Unique per owner and intentionally has no database default.';

create function public.submit_workout_feedback(
  p_plan_id uuid,
  p_workout_key text,
  p_difficulty_rating integer,
  p_satisfaction_rating integer,
  p_notes text,
  p_performed_date date,
  p_time_zone text,
  p_submission_token uuid
)
returns setof public.workout_feedback
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  normalized_workout_key text;
  normalized_notes text;
  normalized_time_zone text;
  canonical_performed_at timestamp with time zone;
  acceptance_date date;
  current_date_in_zone date;
  matching_workout_count integer;
  current_workout_label text;
  locked_plan public.training_plans%rowtype;
  existing_feedback public.workout_feedback%rowtype;
  inserted_feedback public.workout_feedback%rowtype;
begin
  if current_user_id is null then
    raise exception using
      errcode = '28000',
      message = 'Authentication is required.';
  end if;

  if p_plan_id is null or p_submission_token is null or p_performed_date is null then
    raise exception using
      errcode = '22023',
      message = 'Feedback identity and performed date are required.';
  end if;

  normalized_workout_key := pg_catalog.btrim(p_workout_key);
  normalized_notes := nullif(pg_catalog.btrim(p_notes), '');
  normalized_time_zone := pg_catalog.btrim(p_time_zone);

  if normalized_workout_key is null or pg_catalog.length(normalized_workout_key) = 0 then
    raise exception using
      errcode = '22023',
      message = 'Workout key must not be blank.';
  end if;

  if p_difficulty_rating is null or p_difficulty_rating not between 1 and 10 then
    raise exception using
      errcode = '22023',
      message = 'Difficulty rating must be between 1 and 10.';
  end if;

  if p_satisfaction_rating is not null and p_satisfaction_rating not between 1 and 5 then
    raise exception using
      errcode = '22023',
      message = 'Satisfaction rating must be between 1 and 5.';
  end if;

  if normalized_notes is not null and pg_catalog.char_length(normalized_notes) > 2000 then
    raise exception using
      errcode = '22023',
      message = 'Feedback notes must be 2,000 characters or fewer.';
  end if;

  if normalized_time_zone is null
    or pg_catalog.length(normalized_time_zone) = 0
    or not exists (
      select 1
      from pg_catalog.pg_timezone_names as time_zone
      where time_zone.name = normalized_time_zone
    )
  then
    raise exception using
      errcode = '22023',
      message = 'Time zone is invalid.';
  end if;

  canonical_performed_at := p_performed_date::timestamp at time zone 'UTC';

  select feedback.*
  into existing_feedback
  from public.workout_feedback as feedback
  where feedback.user_id = current_user_id
    and feedback.submission_token = p_submission_token;

  if found then
    if existing_feedback.plan_id is not distinct from p_plan_id
      and existing_feedback.workout_key is not distinct from normalized_workout_key
      and existing_feedback.difficulty_rating is not distinct from p_difficulty_rating
      and existing_feedback.satisfaction_rating is not distinct from p_satisfaction_rating
      and existing_feedback.notes is not distinct from normalized_notes
      and existing_feedback.performed_at is not distinct from canonical_performed_at
    then
      return next existing_feedback;
      return;
    end if;

    raise unique_violation using
      constraint = 'workout_feedback_owner_submission_token_key',
      message = 'Submission token was already used with different feedback.';
  end if;

  select training_plan.*
  into locked_plan
  from public.training_plans as training_plan
  where training_plan.id = p_plan_id
    and training_plan.user_id = current_user_id
  for update;

  if not found
    or locked_plan.status is distinct from 'accepted'
    or locked_plan.accepted_at is null
  then
    return;
  end if;

  if pg_catalog.jsonb_typeof(locked_plan.plan_content -> 'scheduledWorkouts') is distinct from 'array' then
    return;
  end if;

  select
    pg_catalog.count(*)::integer,
    pg_catalog.max(pg_catalog.btrim(workout.value ->> 'label'))
  into matching_workout_count, current_workout_label
  from pg_catalog.jsonb_array_elements(locked_plan.plan_content -> 'scheduledWorkouts') as workout(value)
  where pg_catalog.jsonb_typeof(workout.value) = 'object'
    and pg_catalog.btrim(workout.value ->> 'key') = normalized_workout_key
    and pg_catalog.length(pg_catalog.btrim(workout.value ->> 'label')) > 0;

  if matching_workout_count <> 1 or current_workout_label is null then
    return;
  end if;

  acceptance_date := (locked_plan.accepted_at at time zone normalized_time_zone)::date;
  current_date_in_zone := (pg_catalog.statement_timestamp() at time zone normalized_time_zone)::date;

  if p_performed_date < acceptance_date or p_performed_date > current_date_in_zone then
    raise exception using
      errcode = '22023',
      message = 'Performed date must be between the plan acceptance date and today.';
  end if;

  insert into public.workout_feedback as feedback (
    user_id,
    plan_id,
    workout_key,
    workout_label,
    difficulty_rating,
    satisfaction_rating,
    notes,
    performed_at,
    submission_token
  )
  values (
    current_user_id,
    locked_plan.id,
    normalized_workout_key,
    current_workout_label,
    p_difficulty_rating,
    p_satisfaction_rating,
    normalized_notes,
    canonical_performed_at,
    p_submission_token
  )
  on conflict (user_id, submission_token) do nothing
  returning feedback.* into inserted_feedback;

  if found then
    return next inserted_feedback;
    return;
  end if;

  select feedback.*
  into existing_feedback
  from public.workout_feedback as feedback
  where feedback.user_id = current_user_id
    and feedback.submission_token = p_submission_token;

  if found
    and existing_feedback.plan_id is not distinct from p_plan_id
    and existing_feedback.workout_key is not distinct from normalized_workout_key
    and existing_feedback.difficulty_rating is not distinct from p_difficulty_rating
    and existing_feedback.satisfaction_rating is not distinct from p_satisfaction_rating
    and existing_feedback.notes is not distinct from normalized_notes
    and existing_feedback.performed_at is not distinct from canonical_performed_at
  then
    return next existing_feedback;
    return;
  end if;

  raise unique_violation using
    constraint = 'workout_feedback_owner_submission_token_key',
    message = 'Submission token was already used with different feedback.';
end;
$$;

drop policy if exists "Users can insert their own workout feedback"
on public.workout_feedback;

drop policy if exists "Users can update their own workout feedback"
on public.workout_feedback;

drop policy if exists "Users can delete their own workout feedback"
on public.workout_feedback;

revoke insert, update, delete on table public.workout_feedback from authenticated;

revoke all on function public.submit_workout_feedback(
  uuid,
  text,
  integer,
  integer,
  text,
  date,
  text,
  uuid
) from public, anon, authenticated, service_role;

grant execute on function public.submit_workout_feedback(
  uuid,
  text,
  integer,
  integer,
  text,
  date,
  text,
  uuid
) to authenticated;
