import React, { useState } from "react";
import { CircleAlert, HeartPulse, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const MAX_REVISION_NOTE_LENGTH = 2_000;

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
      next.revisionNote = "Describe the correction you want";
    } else if (revisionNote.trim().length > MAX_REVISION_NOTE_LENGTH) {
      next.revisionNote = `Correction requests must be ${MAX_REVISION_NOTE_LENGTH.toLocaleString()} characters or fewer`;
    }

    if (!healthConstraints.trim()) {
      next.healthConstraints = "Health constraints are required";
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
          What should change?
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
          placeholder="For example: reduce lower-body volume and replace movements that aggravate my knee"
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
            {revisionNote.length.toLocaleString()} / {MAX_REVISION_NOTE_LENGTH.toLocaleString()} characters
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="healthConstraints"
          className="mb-1 flex items-center gap-2 text-sm font-medium text-blue-100/85"
        >
          <HeartPulse className="size-4 text-white/45" />
          Health constraints
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
          placeholder="Describe injuries, pain, health constraints, or movement limitations that should shape the revision"
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
            Update this durable context if pain, symptoms, limitations, or professional guidance changed.
          </p>
        )}
      </div>

      <div className="space-y-2 rounded-lg border border-amber-300/25 bg-amber-300/10 px-4 py-3 text-sm leading-6 text-amber-50/90">
        <p>
          Revisions still respect the constraints you provide. TrAIner does not diagnose injuries or replace a doctor,
          physiotherapist, or medical trainer.
        </p>
        {accepted && <p>A successful revision will reopen this accepted plan as a draft for another review.</p>}
        <p>Earlier workout feedback stays attached and may describe content from an older version of this plan.</p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-lg bg-cyan-300 px-4 py-2 font-semibold text-slate-950 transition-colors hover:bg-cyan-200"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <span className="size-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950" />
            Revising plan...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <RefreshCw className="size-4" />
            Request complete revision
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
