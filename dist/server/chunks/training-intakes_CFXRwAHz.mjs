globalThis.process ??= {};
globalThis.process.env ??= {};
import { bm as object, bq as preprocess, bx as _enum, bl as string } from "./runtime_GlVtDbC7.mjs";
const TRAINING_EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"];
const INTAKE_COLUMNS = "id,user_id,goal,experience_level,health_constraints,notes,created_at,updated_at";
const formTextField = preprocess((value) => typeof value === "string" ? value : "", string());
const requiredTrimmedText = (message) => formTextField.transform((value) => value.trim()).pipe(string().min(1, message));
const trainingIntakeFormSchema = object({
  goal: requiredTrimmedText("Training goal is required"),
  experienceLevel: preprocess(
    (value) => typeof value === "string" ? value : "",
    _enum(TRAINING_EXPERIENCE_LEVELS, { message: "Choose a valid experience level" })
  ),
  healthConstraints: requiredTrimmedText("Health constraints are required"),
  notes: formTextField.transform((value) => {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  })
});
function parseTrainingIntakeFormData(formData) {
  return trainingIntakeFormSchema.parse({
    goal: formData.get("goal"),
    experienceLevel: formData.get("experienceLevel"),
    healthConstraints: formData.get("healthConstraints"),
    notes: formData.get("notes")
  });
}
function mapTrainingIntakeRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    goal: row.goal,
    experienceLevel: row.experience_level,
    healthConstraints: row.health_constraints,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at
  };
}
async function readLatestTrainingIntake(supabase, userId) {
  const row = await readLatestTrainingIntakeRow(supabase, userId);
  return row ? mapTrainingIntakeRow(row) : null;
}
async function readTrainingIntake(supabase, userId, intakeId) {
  const { data, error } = await supabase.from("training_intakes").select(INTAKE_COLUMNS).eq("user_id", userId).eq("id", intakeId).limit(1).maybeSingle().overrideTypes();
  if (error) {
    throw new Error(`Failed to read training intake: ${error.message}`);
  }
  return data ? mapTrainingIntakeRow(data) : null;
}
async function readLatestEditableTrainingIntake(supabase, userId) {
  const row = await readLatestTrainingIntakeRow(supabase, userId);
  if (!row) return null;
  const editable = await isTrainingIntakeEditable(supabase, userId, row.id);
  return editable ? mapTrainingIntakeRow(row) : null;
}
async function isTrainingIntakeEditable(supabase, userId, intakeId) {
  return !await hasTrainingPlanForIntake(supabase, userId, intakeId);
}
async function saveTrainingIntake(supabase, userId, input) {
  const latest = await readLatestTrainingIntakeRow(supabase, userId);
  const payload = {
    goal: input.goal,
    experience_level: input.experienceLevel,
    health_constraints: input.healthConstraints,
    notes: input.notes
  };
  if (latest && await isTrainingIntakeEditable(supabase, userId, latest.id)) {
    const { data: data2, error: error2 } = await supabase.from("training_intakes").update(payload).eq("user_id", userId).eq("id", latest.id).select(INTAKE_COLUMNS).single().overrideTypes();
    if (error2) {
      throw new Error(`Failed to update training intake: ${error2.message}`);
    }
    return mapTrainingIntakeRow(data2);
  }
  const { data, error } = await supabase.from("training_intakes").insert({ ...payload, user_id: userId }).select(INTAKE_COLUMNS).single().overrideTypes();
  if (error) {
    throw new Error(`Failed to create training intake: ${error.message}`);
  }
  return mapTrainingIntakeRow(data);
}
async function readLatestTrainingIntakeRow(supabase, userId) {
  const { data, error } = await supabase.from("training_intakes").select(INTAKE_COLUMNS).eq("user_id", userId).order("created_at", { ascending: false }).order("updated_at", { ascending: false }).limit(1).overrideTypes();
  if (error) {
    throw new Error(`Failed to read latest training intake: ${error.message}`);
  }
  return data.length > 0 ? data[0] : null;
}
async function hasTrainingPlanForIntake(supabase, userId, intakeId) {
  const { data, error } = await supabase.from("training_plans").select("id").eq("user_id", userId).eq("intake_id", intakeId).limit(1).maybeSingle().overrideTypes();
  if (error) {
    throw new Error(`Failed to read training plan for intake: ${error.message}`);
  }
  return data !== null;
}
export {
  readLatestEditableTrainingIntake as a,
  readTrainingIntake as b,
  isTrainingIntakeEditable as i,
  parseTrainingIntakeFormData as p,
  readLatestTrainingIntake as r,
  saveTrainingIntake as s
};
