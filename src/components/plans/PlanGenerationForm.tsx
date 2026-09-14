import type React from "react";
import { usePlanOperation } from "@/components/hooks/usePlanOperation";
import PlanOperationStatus from "@/components/plans/PlanOperationStatus";
import { Button } from "@/components/ui/button";

export default function PlanGenerationForm({ intakeId }: { intakeId: string }) {
  const operation = usePlanOperation({ kind: "generate", intakeId });
  function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    void operation.submit(new FormData(event.currentTarget));
  }
  return (
    <form method="POST" action="/api/training-plans/generate" className="mt-4 space-y-4" onSubmit={handleSubmit}>
      <input type="hidden" name="intakeId" value={intakeId} />
      <p className="text-sm leading-6 break-words text-blue-100/75">
        Wygeneruj tygodniowy szkic planu dopasowany do zapisanego celu, poziomu doświadczenia i ograniczeń.
      </p>
      <PlanOperationStatus state={operation.state} checkCurrent={operation.checkCurrent} />
      <p className="text-sm leading-6 break-words text-blue-100/75">
        Poprzednie plany i powiązane opinie po treningach (feedback) są trwale usuwane przy zapisie ankiety. Nieudane
        generowanie nowego planu nie przywróci usuniętych danych.
      </p>
      <Button
        type="submit"
        disabled={!operation.canSubmit}
        className="w-full rounded-lg bg-cyan-300 px-4 py-2 text-sm font-semibold text-slate-950 transition-colors hover:bg-cyan-200"
      >
        {operation.isPending ? (
          <span className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-4 animate-spin rounded-full border-2 border-slate-950/30 border-t-slate-950"
            />
            Generowanie...
          </span>
        ) : (
          "Wygeneruj plan"
        )}
      </Button>
    </form>
  );
}
