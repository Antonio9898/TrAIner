import React, { useRef, useState } from "react";
import { Activity, Check, CircleAlert, FileText, HeartPulse, Send, Target, Trash2, X } from "lucide-react";
import { ServerError } from "@/components/auth/ServerError";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { cn } from "@/lib/utils";
import type { TrainingExperienceLevel, TrainingIntake } from "@/types";

const NO_KNOWN_CONSTRAINTS = "Brak znanych ograniczeń";
const RETENTION_WARNING =
  "Zapisanie ankiety trwale usunie wszystkie poprzednie plany i powiązane z nimi opinie po treningach (feedback). Nie będzie można ich odzyskać, również jeśli generowanie nowego planu się nie powiedzie.";

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
  hasActivePlan: boolean;
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

export default function GoalAndConstraintsForm({
  initialIntake,
  serverError,
  hasActivePlan,
}: GoalAndConstraintsFormProps) {
  const [goal, setGoal] = useState(initialIntake?.goal ?? "");
  const [experienceLevel, setExperienceLevel] = useState<TrainingExperienceLevel | "">(
    initialIntake?.experienceLevel ?? "",
  );
  const [healthConstraints, setHealthConstraints] = useState(initialIntake?.healthConstraints ?? "");
  const [notes, setNotes] = useState(initialIntake?.notes ?? "");
  const [errors, setErrors] = useState<FieldErrors>({});
  const confirmationRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const confirmedRef = useRef(false);
  const submittingRef = useRef(false);
  const [submitting, setSubmitting] = useState(false);

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
    if (submittingRef.current) {
      event.preventDefault();
      return;
    }
    if (!validate()) {
      event.preventDefault();
      confirmedRef.current = false;
      return;
    }

    if (hasActivePlan && !confirmedRef.current) {
      event.preventDefault();
      confirmationRef.current?.showModal();
      cancelRef.current?.focus();
      return;
    }
    confirmedRef.current = false;
    submittingRef.current = true;
    setSubmitting(true);
  }

  return (
    <form
      ref={formRef}
      method="POST"
      action="/api/training-intakes"
      className="space-y-5"
      onSubmit={handleSubmit}
      noValidate
    >
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

      {hasActivePlan && (
        <p className="rounded-lg border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-50">
          {RETENTION_WARNING}
        </p>
      )}

      <SubmitButton pendingText="Zapisywanie danych..." icon={<Send className="size-4" />}>
        Zapisz dane
      </SubmitButton>

      {hasActivePlan && (
        <dialog
          ref={confirmationRef}
          aria-labelledby="retention-dialog-title"
          aria-describedby="retention-dialog-description"
          className="fixed inset-0 m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-lg overflow-y-auto rounded-3xl border border-white/15 bg-slate-950 p-0 text-white shadow-2xl shadow-black/50 backdrop:bg-slate-950/75 backdrop:backdrop-blur-sm"
          onCancel={(event) => {
            if (submittingRef.current) event.preventDefault();
          }}
        >
          <div className="relative overflow-hidden p-6 sm:p-8">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-24 -right-20 size-64 rounded-full bg-rose-500/10 blur-3xl"
            />
            <button
              type="button"
              aria-label="Zamknij ostrzeżenie"
              disabled={submitting}
              onClick={() => confirmationRef.current?.close()}
              className="absolute top-4 right-4 rounded-full p-2 text-slate-400 transition hover:bg-white/10 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:opacity-50"
            >
              <X aria-hidden="true" className="size-5" />
            </button>
            <div className="mb-6 flex size-14 items-center justify-center rounded-2xl border border-rose-300/20 bg-rose-400/10 text-rose-300">
              <Trash2 aria-hidden="true" className="size-6" />
            </div>
            <p className="mb-2 text-xs font-semibold tracking-widest text-rose-300 uppercase">Zanim zapiszesz</p>
            <h2 id="retention-dialog-title" className="pr-4 text-2xl font-semibold tracking-tight sm:text-3xl">
              Nowa ankieta zastąpi Twój plan
            </h2>
            <p id="retention-dialog-description" className="mt-4 text-sm leading-7 text-slate-300">
              Zapisanie ankiety trwale usunie wszystkie poprzednie plany i powiązane z nimi opinie po treningach
              (feedback). Twoje ankiety pozostaną zapisane.
            </p>
            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-amber-300/15 bg-amber-300/5 p-4 text-sm leading-6 text-amber-100">
              <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-amber-300" />
              <p>Tej operacji nie można cofnąć. Błąd generowania nowego planu nie przywróci usuniętych danych.</p>
            </div>
            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
              <button
                ref={cancelRef}
                type="button"
                disabled={submitting}
                onClick={() => confirmationRef.current?.close()}
                className="min-h-12 rounded-xl border border-white/15 px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:opacity-50"
              >
                Anuluj
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={() => {
                  confirmedRef.current = true;
                  formRef.current?.requestSubmit();
                }}
                className="min-h-12 flex-1 rounded-xl bg-rose-500 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-rose-950/30 transition hover:bg-rose-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-300 disabled:cursor-wait disabled:opacity-60"
              >
                {submitting ? "Zapisywanie ankiety…" : "Zapisz ankietę i usuń plany"}
              </button>
            </div>
          </div>
        </dialog>
      )}
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
