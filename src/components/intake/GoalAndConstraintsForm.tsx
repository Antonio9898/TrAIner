import React, { useState } from "react";
import { Activity, Check, CircleAlert, FileText, HeartPulse, Send, Target } from "lucide-react";
import { ServerError } from "@/components/auth/ServerError";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { cn } from "@/lib/utils";
import type { TrainingExperienceLevel, TrainingIntake } from "@/types";

const NO_KNOWN_CONSTRAINTS = "Brak znanych ograniczeń";

const EXPERIENCE_OPTIONS: {
  value: TrainingExperienceLevel;
  label: string;
  description: string;
}[] = [
  {
    value: "beginner",
    label: "Początkujący",
    description: "Dopiero zaczynasz regularny trening siłowy.",
  },
  {
    value: "intermediate",
    label: "Średniozaawansowany",
    description: "Swobodnie wykonujesz popularne ćwiczenia i trenujesz co tydzień.",
  },
  {
    value: "advanced",
    label: "Zaawansowany",
    description: "Masz doświadczenie z progresją i większą objętością treningową.",
  },
];

interface GoalAndConstraintsFormProps {
  initialIntake?: TrainingIntake | null;
  serverError?: string | null;
}

interface FieldErrors {
  goal?: string;
  experienceLevel?: string;
  healthConstraints?: string;
}

const fieldBase =
  "w-full rounded-lg border bg-white/10 px-3 py-2 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2";

export default function GoalAndConstraintsForm({ initialIntake, serverError }: GoalAndConstraintsFormProps) {
  const [goal, setGoal] = useState(initialIntake?.goal ?? "");
  const [experienceLevel, setExperienceLevel] = useState<TrainingExperienceLevel | "">(
    initialIntake?.experienceLevel ?? "",
  );
  const [healthConstraints, setHealthConstraints] = useState(initialIntake?.healthConstraints ?? "");
  const [notes, setNotes] = useState(initialIntake?.notes ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});

  function validate() {
    const next: FieldErrors = {};

    if (!goal.trim()) {
      next.goal = "Cel treningowy jest wymagany";
    }

    if (!EXPERIENCE_OPTIONS.some((option) => option.value === experienceLevel)) {
      next.experienceLevel = "Wybierz poziom doświadczenia";
    }

    if (!healthConstraints.trim()) {
      next.healthConstraints = "Ograniczenia zdrowotne są wymagane";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function clearError(field: keyof FieldErrors) {
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    if (!validate()) {
      event.preventDefault();
    }
  }

  return (
    <form method="POST" action="/api/training-intakes" className="space-y-5" onSubmit={handleSubmit} noValidate>
      <TextAreaField
        id="goal"
        label="Cel treningowy"
        value={goal}
        onChange={(value) => {
          setGoal(value);
          clearError("goal");
        }}
        placeholder="Zbudować siłę podczas trzech treningów całego ciała tygodniowo"
        error={errors.goal}
        icon={<Target className="size-4" />}
        rows={4}
      />

      <fieldset>
        <legend className="mb-2 flex items-center gap-2 text-sm text-blue-100/80">
          <Activity className="size-4 text-white/45" />
          Poziom doświadczenia
        </legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {EXPERIENCE_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={cn(
                "flex min-h-28 cursor-pointer flex-col justify-between rounded-lg border px-3 py-3 transition-colors",
                experienceLevel === option.value
                  ? "border-cyan-300/70 bg-cyan-400/15 text-white"
                  : "border-white/15 bg-white/5 text-blue-100/80 hover:border-white/30 hover:bg-white/10",
              )}
            >
              <span className="flex items-start justify-between gap-2">
                <span className="text-sm font-semibold">{option.label}</span>
                <input
                  className="mt-0.5 size-4 accent-cyan-300"
                  type="radio"
                  name="experienceLevel"
                  value={option.value}
                  checked={experienceLevel === option.value}
                  onChange={() => {
                    setExperienceLevel(option.value);
                    clearError("experienceLevel");
                  }}
                />
              </span>
              <span className="mt-3 text-xs leading-5 text-blue-100/65">{option.description}</span>
            </label>
          ))}
        </div>
        <FieldError message={errors.experienceLevel} />
      </fieldset>

      <div>
        <TextAreaField
          id="healthConstraints"
          label="Ograniczenia zdrowotne"
          value={healthConstraints}
          onChange={(value) => {
            setHealthConstraints(value);
            clearError("healthConstraints");
          }}
          placeholder="Czy masz urazy, ból, ograniczenia zdrowotne lub ruchowe, które powinny wpłynąć na plan? Opisz je własnymi słowami."
          error={errors.healthConstraints}
          icon={<HeartPulse className="size-4" />}
          rows={5}
          hint={
            <p className="mt-2 text-xs leading-5 text-blue-100/60">
              Przykłady: ból kolana podczas przysiadów, powrót do sprawności barku, unikanie wyciskania nad głowę,
              zalecenie lekarza, by unikać ćwiczeń o dużej intensywności uderzeń.
            </p>
          }
        />

        <button
          type="button"
          className="mt-3 inline-flex items-center gap-2 rounded-lg border border-emerald-300/40 bg-emerald-400/10 px-3 py-2 text-sm font-medium text-emerald-100 transition-colors hover:bg-emerald-400/20"
          onClick={() => {
            setHealthConstraints(NO_KNOWN_CONSTRAINTS);
            clearError("healthConstraints");
          }}
        >
          <Check className="size-4" />
          Brak znanych ograniczeń
        </button>
      </div>

      <TextAreaField
        id="notes"
        label="Dodatkowe uwagi"
        value={notes}
        onChange={setNotes}
        placeholder="Harmonogram, sprzęt, preferencje ćwiczeń lub wszystko, co pomoże dopasować plan"
        icon={<FileText className="size-4" />}
        rows={4}
      />

      <div className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-50">
        TrAIner może pomóc dostosować plan do podanych ograniczeń, ale nie diagnozuje urazów ani nie zastępuje porady
        lekarza, fizjoterapeuty lub trenera medycznego. Jeśli odczuwasz ból, masz objawy, chorobę lub wątpliwości
        dotyczące treningu, skonsultuj się z wykwalifikowanym specjalistą.
      </div>

      <ServerError message={serverError} />

      <SubmitButton pendingText="Zapisywanie danych..." icon={<Send className="size-4" />}>
        Zapisz dane
      </SubmitButton>
    </form>
  );
}

interface TextAreaFieldProps {
  id: string;
  name?: string | null;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon: React.ReactNode;
  rows: number;
  error?: string;
  hint?: React.ReactNode;
  readOnly?: boolean;
}

function TextAreaField({
  id,
  name,
  label,
  value,
  onChange,
  placeholder,
  icon,
  rows,
  error,
  hint,
  readOnly = false,
}: TextAreaFieldProps) {
  const textareaName = name === undefined ? id : name;

  return (
    <div>
      <label htmlFor={id} className="mb-1 flex items-center gap-2 text-sm text-blue-100/80">
        <span className="text-white/45">{icon}</span>
        {label}
      </label>
      <textarea
        id={id}
        name={textareaName ?? undefined}
        value={value}
        onChange={(event) => {
          onChange(event.target.value);
        }}
        placeholder={placeholder}
        rows={rows}
        readOnly={readOnly}
        className={cn(
          fieldBase,
          "resize-y leading-6 read-only:cursor-default read-only:text-emerald-50",
          error ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-cyan-300",
        )}
      />
      {error ? <FieldError message={error} /> : hint}
    </div>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;

  return (
    <p className="mt-1 flex items-center gap-1 text-xs text-red-300">
      <CircleAlert className="size-3 shrink-0" />
      {message}
    </p>
  );
}
