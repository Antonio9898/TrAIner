import { readTrainingPlan } from "@/lib/services/training-plans";
import type { createClient } from "@/lib/supabase";
import type { TrainingPlan, TrainingPlanScheduledWorkout, WorkoutFeedback } from "@/types";
import { z } from "zod";

type SupabaseSsrClient = NonNullable<ReturnType<typeof createClient>>;

interface WorkoutFeedbackRow {
  id: string;
  user_id: string;
  plan_id: string;
  workout_key: string;
  workout_label: string | null;
  difficulty_rating: number;
  satisfaction_rating: number | null;
  notes: string | null;
  performed_at: string;
  created_at: string;
  updated_at: string;
}

interface SupabaseErrorLike {
  code?: string;
}

const WORKOUT_FEEDBACK_COLUMNS =
  "id,user_id,plan_id,workout_key,workout_label,difficulty_rating,satisfaction_rating,notes,performed_at,created_at,updated_at";
const WORKOUT_HISTORY_LIMIT = 50;
const WORKOUT_KEY_MAX_LENGTH = 200;
const TIME_ZONE_MAX_LENGTH = 100;
const NOTES_MAX_LENGTH = 2_000;
const UNIQUE_VIOLATION_CODE = "23505";
const INVALID_ARGUMENT_CODE = "22023";
const WORKOUT_KEY_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const formTextField = z.preprocess((value) => (typeof value === "string" ? value : ""), z.string());
const requiredTrimmedText = (message: string) =>
  formTextField.transform((value) => value.trim()).pipe(z.string().min(1, message));
const optionalTrimmedText = formTextField.transform((value) => {
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
});
const formInteger = z.preprocess((value) => {
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) {
    return Number(value);
  }
  return value;
}, z.number().int());
const optionalFormInteger = z.preprocess((value) => {
  if (value === null || value === undefined || (typeof value === "string" && value.trim() === "")) {
    return null;
  }
  if (typeof value === "string" && /^-?\d+$/.test(value.trim())) {
    return Number(value);
  }
  return value;
}, z.number().int().nullable());
const timeZoneSchema = requiredTrimmedText("Time zone is required")
  .pipe(z.string().max(TIME_ZONE_MAX_LENGTH, "Time zone is invalid"))
  .refine(isIanaTimeZone, "Time zone is invalid");

export const workoutFeedbackRouteIdentitySchema = z.object({
  planId: requiredTrimmedText("Training plan is required").pipe(z.uuid("Training plan is invalid")),
  workoutKey: requiredTrimmedText("Workout is required").pipe(
    z.string().max(WORKOUT_KEY_MAX_LENGTH, "Workout is invalid").regex(WORKOUT_KEY_PATTERN, "Workout is invalid"),
  ),
});

export const workoutFeedbackSubmissionSchema = workoutFeedbackRouteIdentitySchema.extend({
  submissionToken: requiredTrimmedText("Submission token is required").pipe(z.uuid("Submission token is invalid")),
  difficultyRating: formInteger.pipe(z.number().min(1).max(10)),
  satisfactionRating: optionalFormInteger.pipe(z.number().min(1).max(5).nullable()),
  notes: optionalTrimmedText.pipe(z.string().max(NOTES_MAX_LENGTH).nullable()),
  performedDate: requiredTrimmedText("Performed date is required").pipe(z.iso.date()),
  timeZone: timeZoneSchema,
});

export type WorkoutFeedbackRouteIdentity = z.infer<typeof workoutFeedbackRouteIdentitySchema>;
export type WorkoutFeedbackSubmissionInput = z.infer<typeof workoutFeedbackSubmissionSchema>;
export type WorkoutFeedbackPageState = "accepted-current" | "draft-current" | "historical-only" | "unavailable";

export interface WorkoutFeedbackPageContext {
  plan: TrainingPlan;
  currentWorkout: TrainingPlanScheduledWorkout | null;
  history: WorkoutFeedback[];
  state: WorkoutFeedbackPageState;
}

export class WorkoutFeedbackInvalidRequestError extends Error {
  constructor(message = "Workout feedback request is invalid") {
    super(message);
    this.name = "WorkoutFeedbackInvalidRequestError";
  }
}

export class WorkoutFeedbackUnavailableError extends Error {
  constructor(message = "Workout feedback is unavailable") {
    super(message);
    this.name = "WorkoutFeedbackUnavailableError";
  }
}

export class WorkoutFeedbackConflictError extends Error {
  constructor(message = "This feedback submission was already used") {
    super(message);
    this.name = "WorkoutFeedbackConflictError";
  }
}

export class WorkoutFeedbackPersistenceError extends Error {
  constructor(message = "Failed to save workout feedback") {
    super(message);
    this.name = "WorkoutFeedbackPersistenceError";
  }
}

export function parseWorkoutFeedbackRouteIdentity(input: unknown): WorkoutFeedbackRouteIdentity {
  return parseWorkoutFeedbackInput(workoutFeedbackRouteIdentitySchema, input);
}

export function parseWorkoutFeedbackSubmissionFormData(
  routeIdentity: unknown,
  formData: FormData,
): WorkoutFeedbackSubmissionInput {
  const identity = parseWorkoutFeedbackRouteIdentity(routeIdentity);

  return parseWorkoutFeedbackInput(workoutFeedbackSubmissionSchema, {
    ...identity,
    submissionToken: formData.get("submissionToken"),
    difficultyRating: formData.get("difficultyRating"),
    satisfactionRating: formData.get("satisfactionRating"),
    notes: formData.get("notes"),
    performedDate: formData.get("performedDate"),
    timeZone: formData.get("timeZone"),
  });
}

export async function submitWorkoutFeedback(
  supabase: SupabaseSsrClient,
  input: WorkoutFeedbackSubmissionInput,
): Promise<WorkoutFeedback> {
  const validatedInput = parseWorkoutFeedbackInput(workoutFeedbackSubmissionSchema, input);
  const { data, error } = (await supabase
    .rpc("submit_workout_feedback", {
      p_plan_id: validatedInput.planId,
      p_workout_key: validatedInput.workoutKey,
      p_difficulty_rating: validatedInput.difficultyRating,
      p_satisfaction_rating: validatedInput.satisfactionRating,
      p_notes: validatedInput.notes,
      p_performed_date: validatedInput.performedDate,
      p_time_zone: validatedInput.timeZone,
      p_submission_token: validatedInput.submissionToken,
    })
    .overrideTypes<WorkoutFeedbackRow[], { merge: false }>()) as {
    data: WorkoutFeedbackRow[] | null;
    error: SupabaseErrorLike | null;
  };

  if (error?.code === UNIQUE_VIOLATION_CODE) {
    throw new WorkoutFeedbackConflictError();
  }
  if (error?.code === INVALID_ARGUMENT_CODE) {
    throw new WorkoutFeedbackInvalidRequestError();
  }
  if (error) {
    throw new WorkoutFeedbackPersistenceError();
  }
  if (!data || data.length === 0) {
    throw new WorkoutFeedbackUnavailableError();
  }
  if (data.length !== 1) {
    throw new WorkoutFeedbackPersistenceError();
  }

  return mapWorkoutFeedbackRow(data[0]);
}

export async function readWorkoutFeedbackPageContext(
  supabase: SupabaseSsrClient,
  userId: string,
  routeIdentity: unknown,
): Promise<WorkoutFeedbackPageContext | null> {
  const identity = parseWorkoutFeedbackRouteIdentity(routeIdentity);
  let plan: TrainingPlan | null;

  try {
    plan = await readTrainingPlan(supabase, userId, identity.planId);
  } catch {
    throw new WorkoutFeedbackPersistenceError("Failed to load workout feedback");
  }

  if (!plan) {
    return null;
  }

  const history = await readWorkoutFeedbackHistory(supabase, userId, identity);
  const currentWorkout =
    plan.planContent.scheduledWorkouts.find((workout) => workout.key === identity.workoutKey) ?? null;

  return {
    plan,
    currentWorkout,
    history,
    state: resolvePageState(plan, currentWorkout, history),
  };
}

export async function readWorkoutFeedbackHistory(
  supabase: SupabaseSsrClient,
  userId: string,
  routeIdentity: unknown,
): Promise<WorkoutFeedback[]> {
  const identity = parseWorkoutFeedbackRouteIdentity(routeIdentity);
  const { data, error } = await supabase
    .from("workout_feedback")
    .select(WORKOUT_FEEDBACK_COLUMNS)
    .eq("user_id", userId)
    .eq("plan_id", identity.planId)
    .eq("workout_key", identity.workoutKey)
    .order("performed_at", { ascending: false })
    .order("created_at", { ascending: false })
    .limit(WORKOUT_HISTORY_LIMIT)
    .overrideTypes<WorkoutFeedbackRow[], { merge: false }>();

  if (error) {
    throw new WorkoutFeedbackPersistenceError("Failed to load workout feedback");
  }

  return data.map(mapWorkoutFeedbackRow);
}

function mapWorkoutFeedbackRow(row: WorkoutFeedbackRow): WorkoutFeedback {
  return {
    id: row.id,
    userId: row.user_id,
    planId: row.plan_id,
    workoutKey: row.workout_key,
    workoutLabel: row.workout_label,
    difficultyRating: row.difficulty_rating,
    satisfactionRating: row.satisfaction_rating,
    notes: row.notes,
    performedAt: row.performed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function resolvePageState(
  plan: TrainingPlan,
  currentWorkout: TrainingPlanScheduledWorkout | null,
  history: WorkoutFeedback[],
): WorkoutFeedbackPageState {
  if (currentWorkout) {
    return plan.status === "accepted" ? "accepted-current" : "draft-current";
  }

  return history.length > 0 ? "historical-only" : "unavailable";
}

function parseWorkoutFeedbackInput<T>(schema: z.ZodType<T>, input: unknown): T {
  const result = schema.safeParse(input);
  if (!result.success) {
    throw new WorkoutFeedbackInvalidRequestError();
  }

  return result.data;
}

function isIanaTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value }).format();
    return true;
  } catch {
    return false;
  }
}
