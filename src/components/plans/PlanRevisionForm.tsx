import React, { useState } from "react";
import { CircleAlert, HeartPulse, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_REVISION_NOTE_LENGTH = 2_000;
const characterCountFormatter = new Intl.NumberFormat("pl-PL");

interface PlanRevisionFormProps {
  planId: string;
  expectedUpdatedAt: string;
  initialHealthConstraints: string;
  accepted: boolean;
}

interface FieldErrors {
  revisionNote?: string;
  healthConstraints?: string;
}

const fieldBase =
  "w-full resize-y rounded-lg border bg-white/10 px-3 py-2 text-white placeholder-white/40 transition-colors focus:outline-none focus:ring-2";

export default function PlanRevisionForm({
  planId,
  expectedUpdatedAt,
  initialHealthConstraints,
  accepted,
}: PlanRevisionFormProps) {
  const [revisionNote, setRevisionNote] = useState("");
  const [healthConstraints, setHealthConstraints] = useState(initialHealthConstraints);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function clearError(field: keyof FieldErrors) {
    if (errors[field]) setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function validate(): boolean {
    const next: FieldErrors = {};

    if (!revisionNote.trim()) {
      next.revisionNote = "Opisz zmianę, której oczekujesz";
    } else if (revisionNote.trim().length > MAX_REVISION_NOTE_LENGTH) {
      next.revisionNote = `Opis zmiany może mieć maksymalnie ${characterCountFormatter.format(MAX_REVISION_NOTE_LENGTH)} znaków`;
    }

    if (!healthConstraints.trim()) {
      next.healthConstraints = "Ograniczenia zdrowotne są wymagane";
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  }

  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    if (!validate()) {
      event.preventDefault();
      return;
    }

    setIsSubmitting(true);
  }

  return (
    <form method="POST" action="/api/training-plans/revise" className="space-y-5" onSubmit={handleSubmit} noValidate>
      <input type="hidden" name="planId" value={planId} />
      <input type="hidden" name="expectedUpdatedAt" value={expectedUpdatedAt} />

      <div>
        <label htmlFor="revisionNote" className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-100/85">
          <RefreshCw className="size-4 text-white/45" />
          Co należy zmienić?
        </label>
        <textarea
          id="revisionNote"
          name="revisionNote"
          value={revisionNote}
          onChange={(event) => {
            setRevisionNote(event.target.value);
            clearError("revisionNote");
          }}
          rows={5}
          maxLength={MAX_REVISION_NOTE_LENGTH + 1}
          placeholder="Np. zmniejsz objętość treningu dolnej części ciała i zastąp ruchy nasilające ból kolana"
          aria-invalid={Boolean(errors.revisionNote)}
          aria-describedby={errors.revisionNote ? "revisionNote-error" : "revisionNote-hint"}
          className={cn(
            fieldBase,
            errors.revisionNote ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-cyan-300",
          )}
        />
        {errors.revisionNote ? (
          <FieldError id="revisionNote-error" message={errors.revisionNote} />
        ) : (
          <p id="revisionNote-hint" className="mt-1 text-xs text-blue-100/60">
            {characterCountFormatter.format(revisionNote.length)} /{" "}
            {characterCountFormatter.format(MAX_REVISION_NOTE_LENGTH)} znaków
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="healthConstraints"
          className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-100/85"
        >
          <HeartPulse className="size-4 text-white/45" />
          Ograniczenia zdrowotne
        </label>
        <textarea
          id="healthConstraints"
          name="healthConstraints"
          value={healthConstraints}
          onChange={(event) => {
            setHealthConstraints(event.target.value);
            clearError("healthConstraints");
          }}
          rows={5}
          placeholder="Opisz urazy, ból, ograniczenia zdrowotne lub ruchowe, które powinny wpłynąć na zmianę planu"
          aria-invalid={Boolean(errors.healthConstraints)}
          aria-describedby={errors.healthConstraints ? "healthConstraints-error" : "healthConstraints-hint"}
          className={cn(
            fieldBase,
            errors.healthConstraints ? "border-red-400/60 focus:ring-red-400" : "border-white/20 focus:ring-cyan-300",
          )}
        />
        {errors.healthConstraints ? (
          <FieldError id="healthConstraints-error" message={errors.healthConstraints} />
        ) : (
          <p id="healthConstraints-hint" className="mt-1 text-xs leading-5 text-blue-100/60">
            Zaktualizuj te informacje, jeśli zmieniły się ból, objawy, ograniczenia lub zalecenia specjalisty.
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-lg border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-50/90">
        <p>
          Zmiany planu nadal uwzględniają podane ograniczenia. TrAIner nie diagnozuje urazów ani nie zastępuje lekarza,
          fizjoterapeuty lub trenera medycznego.
        </p>
        {accepted && <p>Udana zmiana ponownie otworzy zaakceptowany plan jako wersję roboczą do sprawdzenia.</p>}
        <p>Wcześniejsze opinie o treningach pozostaną zapisane i mogą dotyczyć starszej wersji planu.</p>
      </div>

      {isSubmitting && (
        <p role="status" className="text-sm text-blue-100/75">
          Tworzenie kompletnej, zaktualizowanej wersji planu. Może to potrwać do 90 sekund.
        </p>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-cyan-200"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
            Zmienianie planu...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <RefreshCw className="size-4" />
            Zastosuj poprawkę
          </span>
        )}
      </Button>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message: string }) {
  return (
    <p id={id} className="mt-1 flex items-center gap-1 text-xs text-red-300" role="alert">
      <CircleAlert className="size-3 shrink-0" />
      {message}
    </p>
  );
}
