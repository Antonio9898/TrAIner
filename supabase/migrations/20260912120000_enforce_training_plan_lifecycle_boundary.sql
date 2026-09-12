-- Existing lifecycle functions explicitly scope every read/write to auth.uid()
-- and use an empty search_path. Preserve their locks and optimistic concurrency
-- checks while allowing them to write after direct owner UPDATE is revoked.
alter function public.revise_training_plan(uuid, timestamptz, text, text, text, jsonb, text)
security definer;

alter function public.accept_training_plan(uuid, timestamptz)
security definer;

revoke all on function public.revise_training_plan(uuid, timestamptz, text, text, text, jsonb, text)
from public, anon, authenticated, service_role;

revoke all on function public.accept_training_plan(uuid, timestamptz)
from public, anon, authenticated, service_role;

grant execute on function public.revise_training_plan(uuid, timestamptz, text, text, text, jsonb, text)
to authenticated;

grant execute on function public.accept_training_plan(uuid, timestamptz)
to authenticated;

drop policy "Users can update their own training plans" on public.training_plans;
revoke update on table public.training_plans from public, anon, authenticated;

-- Generation still inserts directly, but cannot invent acceptance or revision
-- history. Later state transitions must go through the lifecycle functions.
alter policy "Users can insert their own training plans"
on public.training_plans
with check (
  auth.uid() = user_id
  and status = 'draft'
  and accepted_at is null
  and revision_count = 0
  and last_revision_requested_at is null
  and last_revision_note is null
  and last_revision_summary is null
);
