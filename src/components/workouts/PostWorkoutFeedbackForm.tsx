import React, { useState } from "react";
import { CalendarDays, CircleAlert, Send } from "lucide-react";
import { cn } from "@/lib/utils";
import { useWorkoutFeedbackDate } from "@/components/hooks/useWorkoutFeedbackDate";

const MAX_NOTES_LENGTH = 2_000;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const characterCountFormatter = new Intl.NumberFormat("pl-PL");

interface PostWorkoutFeedbackFormProps {
  action: string;
  acceptedAt: string;
  submissionToken: string;
}

interface FieldErrors {
  difficultyRating?: string;
  satisfactionRating?: string;
  notes?: string;
  performedDate?: string;
}

export default function PostWorkoutFeedbackForm({ action, acceptedAt, submissionToken }: PostWorkoutFeedbackFormProps) {
  const [notes, setNotes] = useState("");
  const { formRef, updateDateBounds } = useWorkoutFeedbackDate(acceptedAt);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearError(field: keyof FieldErrors) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(form: HTMLFormElement): boolean {
    const data = new FormData(form);
    const field = (name: string) => {
      const value = data.get(name);
      return typeof value === "string" ? value : "";
    };
    const next: FieldErrors = {};
    const difficulty = Number(field("difficultyRating"));
    const satisfaction = field("satisfactionRating") === "" ? null : Number(field("satisfactionRating"));
    const performedDate = field("performedDate");
    const dateInput = form.elements.namedItem("performedDate");
    const acceptedDate = dateInput instanceof HTMLInputElement ? dateInput.min : "";
    const today = dateInput instanceof HTMLInputElement ? dateInput.max : "";

    if (!Number.isInteger(difficulty) || difficulty < 1 || difficulty > 10) {
      next.difficultyRating = "Wybierz poziom trudności od 1 do 10";
    }
    if (satisfaction !== null && (!Number.isInteger(satisfaction) || satisfaction < 1 || satisfaction > 5)) {
      next.satisfactionRating = "Wybierz ocenę zadowolenia od 1 do 5 albo pozostaw pole puste";
    }
    if (field("notes").trim().length > MAX_NOTES_LENGTH) {
      next.notes = `Uwagi mogą mieć maksymalnie ${characterCountFormatter.format(MAX_NOTES_LENGTH)} znaków`;
    }
    if (!DATE_PATTERN.test(performedDate)) {
      next.performedDate = "Wybierz datę ukończenia treningu";
    } else if ((acceptedDate && performedDate < acceptedDate) || (today && performedDate > today)) {
      next.performedDate = "Wybierz datę między zaakceptowaniem planu a dzisiaj";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    updateDateBounds();
    if (!validate(event.currentTarget)) {
      event.preventDefault();
      return;
    }

    setIsSubmitting(true);
  }

  return (
    <form ref={formRef} method="POST" action={action} className="space-y-6" onSubmit={handleSubmit}>
      <input type="hidden" name="submissionToken" value={submissionToken} />
      <input type="hidden" name="timeZone" defaultValue="UTC" />

      <RatingGroup
        legend="Jak trudny był trening?"
        hint="1 oznacza bardzo łatwy trening, a 10 — maksymalnie odczuwaną trudność."
        name="difficultyRating"
        count={10}
        required
        error={errors.difficultyRating}
        onChange={() => {
          clearError("difficultyRating");
        }}
      />

      <RatingGroup
        legend="Na ile jesteś zadowolony/a?"
        hint="Opcjonalnie: 1 oznacza duże niezadowolenie, a 5 — pełne zadowolenie."
        name="satisfactionRating"
        count={5}
        allowUnset
        error={errors.satisfactionRating}
        onChange={() => {
          clearError("satisfactionRating");
        }}
      />

      <div>
        <label htmlFor="performedDate" className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-100/85">
          <CalendarDays className="size-4 text-white/45" aria-hidden="true" />
          Data ukończenia
        </label>
        <input
          id="performedDate"
          name="performedDate"
          type="date"
          required
          onChange={() => {
            clearError("performedDate");
          }}
          aria-invalid={Boolean(errors.performedDate)}
          aria-describedby={errors.performedDate ? "performedDate-error" : "performedDate-hint"}
          className={cn(
            "w-full rounded-lg border bg-white/10 px-3 py-2 text-white scheme-dark transition-colors focus:ring-2 focus:outline-none",
            errors.performedDate ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-cyan-300",
          )}
        />
        {errors.performedDate ? (
          <FieldError id="performedDate-error" message={errors.performedDate} />
        ) : (
          <p id="performedDate-hint" className="mt-1 text-xs leading-5 text-blue-100/60">
            Użyj lokalnej daty. Możesz ją zmienić, jeśli zapisujesz trening później.
          </p>
        )}
      </div>

      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-blue-100/85">
          Uwagi <span className="font-normal text-blue-100/55">(opcjonalnie)</span>
        </label>
        <textarea
          id="notes"
          name="notes"
          rows={5}
          maxLength={MAX_NOTES_LENGTH}
          onChange={(event) => {
            setNotes(event.target.value);
            clearError("notes");
          }}
          placeholder="Co poszło dobrze, było trudne lub warto to zapamiętać?"
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? "notes-error" : "notes-hint"}
          className={cn(
            "w-full resize-y rounded-lg border bg-white/10 px-3 py-2 text-white placeholder-white/40 transition-colors focus:ring-2 focus:outline-none",
            errors.notes ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-cyan-300",
          )}
        />
        {errors.notes ? (
          <FieldError id="notes-error" message={errors.notes} />
        ) : (
          <p id="notes-hint" className="mt-1 text-xs text-blue-100/60">
            {notes.length > 0 ? `${characterCountFormatter.format(notes.length)} / ` : "Maksymalnie "}
            {characterCountFormatter.format(MAX_NOTES_LENGTH)} znaków
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200 focus-visible:ring-2 focus-visible:ring-cyan-100 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            <span className="size-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
            Zapisywanie opinii...
          </>
        ) : (
          <>
            <Send className="size-4" aria-hidden="true" />
            Zapisz opinię o treningu
          </>
        )}
      </button>
    </form>
  );
}

interface RatingGroupProps {
  legend: string;
  hint: string;
  name: string;
  count: number;
  required?: boolean;
  allowUnset?: boolean;
  error?: string;
  onChange: () => void;
}

function RatingGroup({
  legend,
  hint,
  name,
  count,
  required = false,
  allowUnset = false,
  error,
  onChange,
}: RatingGroupProps) {
  const hintId = `${name}-hint`;
  const errorId = `${name}-error`;

  return (
    <fieldset aria-invalid={Boolean(error)} aria-describedby={error ? errorId : hintId}>
      <legend className="text-sm font-medium text-blue-100/85">
        {legend} {!required && <span className="font-normal text-blue-100/55">(opcjonalnie)</span>}
      </legend>
      <p id={hintId} className="mt-1 text-xs leading-5 text-blue-100/60">
        {hint}
      </p>
      <div className={cn("mt-3 grid gap-2", count > 5 ? "grid-cols-5 sm:grid-cols-10" : "grid-cols-3 sm:grid-cols-6")}>
        {allowUnset && (
          <label className="col-span-2 cursor-pointer sm:col-span-1">
            <input type="radio" name={name} value="" defaultChecked onChange={onChange} className="peer sr-only" />
            <span className="flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 px-2 text-xs font-medium text-blue-100/80 transition-colors peer-checked:border-cyan-200 peer-checked:bg-cyan-300 peer-checked:text-slate-950 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-200 peer-focus-visible:outline-none">
              Brak oceny
            </span>
          </label>
        )}
        {Array.from({ length: count }, (_, index) => String(index + 1)).map((rating) => (
          <label key={rating} className="cursor-pointer">
            <input
              type="radio"
              name={name}
              value={rating}
              required={required}
              onChange={onChange}
              className="peer sr-only"
            />
            <span className="flex min-h-11 items-center justify-center rounded-lg border border-white/20 bg-white/5 text-sm font-semibold text-white transition-colors peer-checked:border-cyan-200 peer-checked:bg-cyan-300 peer-checked:text-slate-950 peer-focus-visible:ring-2 peer-focus-visible:ring-cyan-200 peer-focus-visible:outline-none">
              {rating}
            </span>
          </label>
        ))}
      </div>
      {error && <FieldError id={errorId} message={error} />}
    </fieldset>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-2 flex items-center gap-1 text-xs text-red-300" role="alert">
      <CircleAlert className="size-3 shrink-0" aria-hidden="true" />
      {message}
    </p>
  );
}
