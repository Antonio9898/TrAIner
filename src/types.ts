export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonObject | JsonValue[];

export interface JsonObject {
  [key: string]: JsonValue;
}

export type TrainingExperienceLevel = "beginner" | "intermediate" | "advanced";

export type TrainingPlanStatus = "draft" | "accepted";

export interface TrainingPlanExerciseEntry {
  name: string;
  sets?: number;
  reps?: string;
  loadGuidance?: string;
  restSeconds?: number;
  notes?: string;
  metadata?: JsonObject;
}

export interface TrainingPlanScheduledWorkout {
  key: string;
  label: string;
  focus?: string;
  exercises: TrainingPlanExerciseEntry[];
  instructions?: string;
  safetyNotes?: string[];
  metadata?: JsonObject;
}

export interface TrainingPlanContent {
  overview: string;
  scheduledWorkouts: TrainingPlanScheduledWorkout[];
  progressionGuidance: string;
  safetyNotes: string[];
  metadata?: JsonObject;
}

export interface TrainingIntake {
  id: string;
  userId: string;
  goal: string;
  experienceLevel: TrainingExperienceLevel;
  healthConstraints: string;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface TrainingPlanBase {
  id: string;
  userId: string;
  intakeId: string;
  planContent: TrainingPlanContent;
  explanation: string;
  notes: string | null;
  revisionCount: number;
  lastRevisionRequestedAt: string | null;
  lastRevisionNote: string | null;
  lastRevisionSummary: string | null;
  createdAt: string;
  updatedAt: string;
}

export type TrainingPlan =
  | (TrainingPlanBase & {
      status: "draft";
      acceptedAt: null;
    })
  | (TrainingPlanBase & {
      status: "accepted";
      acceptedAt: string;
    });

export interface WorkoutFeedback {
  id: string;
  userId: string;
  planId: string;
  workoutKey: string;
  workoutLabel: string | null;
  difficultyRating: number;
  satisfactionRating: number | null;
  notes: string | null;
  performedAt: string;
  createdAt: string;
  updatedAt: string;
}
