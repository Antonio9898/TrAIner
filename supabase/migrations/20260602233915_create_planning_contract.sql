create extension if not exists "pgcrypto" with schema extensions;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.training_intakes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  goal text not null,
  experience_level text not null,
  health_constraints text not null,
  notes text,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  constraint training_intakes_owner_id_key unique (user_id, id),
  constraint training_intakes_goal_not_empty check (length(btrim(goal)) > 0),
  constraint training_intakes_experience_level_check check (
    experience_level in ('beginner', 'intermediate', 'advanced')
  ),
  constraint training_intakes_health_constraints_not_empty check (
    length(btrim(health_constraints)) > 0
  ),
  constraint training_intakes_notes_not_empty check (
    notes is null or length(btrim(notes)) > 0
  )
);

create table public.training_plans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  intake_id uuid not null,
  status text not null default 'draft',
  plan_content jsonb not null,
  explanation text not null,
  notes text,
  revision_count integer not null default 0,
  last_revision_requested_at timestamp with time zone,
  last_revision_note text,
  accepted_at timestamp with time zone,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  constraint training_plans_owner_id_key unique (user_id, id),
  constraint training_plans_one_current_plan_per_intake unique (user_id, intake_id),
  constraint training_plans_owner_intake_fkey foreign key (user_id, intake_id)
    references public.training_intakes(user_id, id)
    on delete cascade,
  constraint training_plans_status_check check (status in ('draft', 'accepted')),
  constraint training_plans_plan_content_object_check check (
    jsonb_typeof(plan_content) = 'object'
  ),
  constraint training_plans_explanation_not_empty check (
    length(btrim(explanation)) > 0
  ),
  constraint training_plans_notes_not_empty check (
    notes is null or length(btrim(notes)) > 0
  ),
  constraint training_plans_revision_count_check check (revision_count >= 0),
  constraint training_plans_last_revision_note_not_empty check (
    last_revision_note is null or length(btrim(last_revision_note)) > 0
  ),
  constraint training_plans_accepted_at_status_check check (
    (status = 'draft' and accepted_at is null)
    or (status = 'accepted' and accepted_at is not null)
  )
);

create table public.workout_feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_id uuid not null,
  workout_key text not null,
  workout_label text,
  difficulty_rating smallint not null,
  satisfaction_rating smallint,
  notes text,
  performed_at timestamp with time zone not null default now(),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  constraint workout_feedback_owner_plan_fkey foreign key (user_id, plan_id)
    references public.training_plans(user_id, id)
    on delete cascade,
  constraint workout_feedback_workout_key_not_empty check (
    length(btrim(workout_key)) > 0
  ),
  constraint workout_feedback_workout_label_not_empty check (
    workout_label is null or length(btrim(workout_label)) > 0
  ),
  constraint workout_feedback_difficulty_rating_check check (
    difficulty_rating between 1 and 10
  ),
  constraint workout_feedback_satisfaction_rating_check check (
    satisfaction_rating is null or satisfaction_rating between 1 and 5
  ),
  constraint workout_feedback_notes_not_empty check (
    notes is null or length(btrim(notes)) > 0
  )
);

comment on column public.workout_feedback.workout_key is
  'Stable workout/day key from training_plans.plan_content used to match feedback to a scheduled plan entry.';
comment on column public.workout_feedback.difficulty_rating is
  'Required 1-10 perceived difficulty rating for the performed workout.';
comment on column public.workout_feedback.satisfaction_rating is
  'Optional 1-5 user satisfaction rating for the performed workout.';

create index training_plans_owner_intake_idx
  on public.training_plans(user_id, intake_id);
create index workout_feedback_owner_plan_idx
  on public.workout_feedback(user_id, plan_id);
create index workout_feedback_owner_performed_at_idx
  on public.workout_feedback(user_id, performed_at desc);

create trigger set_training_intakes_updated_at
before update on public.training_intakes
for each row
execute function public.set_updated_at();

create trigger set_training_plans_updated_at
before update on public.training_plans
for each row
execute function public.set_updated_at();

create trigger set_workout_feedback_updated_at
before update on public.workout_feedback
for each row
execute function public.set_updated_at();

alter table public.training_intakes enable row level security;
alter table public.training_plans enable row level security;
alter table public.workout_feedback enable row level security;

create policy "Users can select their own training intakes"
on public.training_intakes
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own training intakes"
on public.training_intakes
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own training intakes"
on public.training_intakes
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own training intakes"
on public.training_intakes
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Users can select their own training plans"
on public.training_plans
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own training plans"
on public.training_plans
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own training plans"
on public.training_plans
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own training plans"
on public.training_plans
for delete
to authenticated
using (auth.uid() = user_id);

create policy "Users can select their own workout feedback"
on public.workout_feedback
for select
to authenticated
using (auth.uid() = user_id);

create policy "Users can insert their own workout feedback"
on public.workout_feedback
for insert
to authenticated
with check (auth.uid() = user_id);

create policy "Users can update their own workout feedback"
on public.workout_feedback
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete their own workout feedback"
on public.workout_feedback
for delete
to authenticated
using (auth.uid() = user_id);
