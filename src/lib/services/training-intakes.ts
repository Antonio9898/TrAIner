import type { createClient } from "@/lib/supabase";
import type { TrainingExperienceLevel, TrainingIntake } from "@/types";
import { z } from "zod";

export const NO_KNOWN_CONSTRAINTS = "Brak znanych ograniczeń";
export const TRAINING_EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;

type SupabaseSsrClient = NonNullable<ReturnType<typeof createClient>>;

interface TrainingIntakeRow {
  id: string;
  user_id: string;
  goal: string;
  experience_level: TrainingExperienceLevel;
  health_constraints: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface TrainingPlanReferenceRow {
  id: string;
}

const INTAKE_COLUMNS = "id,user_id,goal,experience_level,health_constraints,notes,created_at,updated_at";

const formTextField = z.preprocess((value) => (typeof value === "string" ? value : ""), z.string());

const requiredTrimmedText = (message: string) =>
  formTextField.transform((value) => value.trim()).pipe(z.string().min(1, message));

export const trainingIntakeFormSchema = z.object({
  goal: requiredTrimmedText("Cel treningowy jest wymagany"),
  experienceLevel: z.preprocess(
    (value) => (typeof value === "string" ? value : ""),
    z.enum(TRAINING_EXPERIENCE_LEVELS, { message: "Wybierz prawidłowy poziom doświadczenia" }),
  ),
  healthConstraints: requiredTrimmedText("Ograniczenia zdrowotne są wymagane"),
  notes: formTextField.transform((value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }),
});

export type TrainingIntakeFormInput = z.infer<typeof trainingIntakeFormSchema>;

export function parseTrainingIntakeFormData(formData: FormData): TrainingIntakeFormInput {
  return trainingIntakeFormSchema.parse({
    goal: formData.get("goal"),
    experienceLevel: formData.get("experienceLevel"),
    healthConstraints: formData.get("healthConstraints"),
    notes: formData.get("notes"),
  });
}

export function mapTrainingIntakeRow(row: TrainingIntakeRow): TrainingIntake {
  return {
    id: row.id,
    userId: row.user_id,
    goal: row.goal,
    experienceLevel: row.experience_level,
    healthConstraints:
      row.health_constraints.trim().toLowerCase() === "no known constraints"
        ? NO_KNOWN_CONSTRAINTS
        : row.health_constraints,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function readLatestTrainingIntake(
  supabase: SupabaseSsrClient,
  userId: string,
): Promise<TrainingIntake | null> {
  const row = await readLatestTrainingIntakeRow(supabase, userId);
  return row ? mapTrainingIntakeRow(row) : null;
}

export async function isCurrentTrainingIntake(
  supabase: SupabaseSsrClient,
  userId: string,
  intake: TrainingIntake,
): Promise<boolean> {
  const rows = await readLatestTrainingIntakeRows(supabase, userId);
  return rows[0]?.id === intake.id && rows[0].updated_at === intake.updatedAt && !hasLatestTimestampTie(rows);
}

function hasLatestTimestampTie(rows: TrainingIntakeRow[]): boolean {
  return rows.length > 1 && rows[0].created_at === rows[1].created_at && rows[0].updated_at === rows[1].updated_at;
}

export async function readTrainingIntake(
  supabase: SupabaseSsrClient,
  userId: string,
  intakeId: string,
): Promise<TrainingIntake | null> {
  const { data, error } = await supabase
    .from("training_intakes")
    .select(INTAKE_COLUMNS)
    .eq("user_id", userId)
    .eq("id", intakeId)
    .limit(1)
    .maybeSingle()
    .overrideTypes<TrainingIntakeRow, { merge: false }>();

  if (error) {
    throw new Error(`Failed to read training intake: ${error.message}`);
  }

  return data ? mapTrainingIntakeRow(data) : null;
}

export async function readLatestEditableTrainingIntake(
  supabase: SupabaseSsrClient,
  userId: string,
): Promise<TrainingIntake | null> {
  const row = await readLatestTrainingIntakeRow(supabase, userId);
  if (!row) return null;

  const editable = await isTrainingIntakeEditable(supabase, userId, row.id);
  return editable ? mapTrainingIntakeRow(row) : null;
}

export async function isTrainingIntakeEditable(
  supabase: SupabaseSsrClient,
  userId: string,
  intakeId: string,
): Promise<boolean> {
  return !(await hasTrainingPlanForIntake(supabase, userId, intakeId));
}

export async function saveTrainingIntake(
  supabase: SupabaseSsrClient,
  userId: string,
  input: TrainingIntakeFormInput,
): Promise<TrainingIntake> {
  const { data, error } = (await supabase
    .rpc("save_training_intake", {
      p_goal: input.goal,
      p_experience_level: input.experienceLevel,
      p_health_constraints: input.healthConstraints,
      p_notes: input.notes,
    })
    .overrideTypes<TrainingIntakeRow[], { merge: false }>()) as {
    data: TrainingIntakeRow[] | null;
    error: { message: string } | null;
  };
  const row = data?.[0];
  if (error || row?.user_id !== userId) {
    throw new Error("Failed to save training intake");
  }
  return mapTrainingIntakeRow(row);
}

async function readLatestTrainingIntakeRow(
  supabase: SupabaseSsrClient,
  userId: string,
): Promise<TrainingIntakeRow | null> {
  const rows = await readLatestTrainingIntakeRows(supabase, userId);
  return hasLatestTimestampTie(rows) ? null : (rows[0] ?? null);
}

async function readLatestTrainingIntakeRows(supabase: SupabaseSsrClient, userId: string): Promise<TrainingIntakeRow[]> {
  const { data, error } = await supabase
    .from("training_intakes")
    .select(INTAKE_COLUMNS)
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .order("updated_at", { ascending: false })
    .limit(2)
    .overrideTypes<TrainingIntakeRow[], { merge: false }>();

  if (error) {
    throw new Error(`Failed to read latest training intake: ${error.message}`);
  }

  return data;
}

async function hasTrainingPlanForIntake(
  supabase: SupabaseSsrClient,
  userId: string,
  intakeId: string,
): Promise<boolean> {
  const { data, error } = await supabase
    .from("training_plans")
    .select("id")
    .eq("user_id", userId)
    .eq("intake_id", intakeId)
    .limit(1)
    .maybeSingle()
    .overrideTypes<TrainingPlanReferenceRow, { merge: false }>();

  if (error) {
    throw new Error(`Failed to read training plan for intake: ${error.message}`);
  }

  return data !== null;
}
