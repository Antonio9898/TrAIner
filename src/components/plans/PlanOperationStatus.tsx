import { useEffect, useRef } from "react";
import type { usePlanOperation } from "@/components/hooks/usePlanOperation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Props = Pick<ReturnType<typeof usePlanOperation>, "state" | "checkCurrent">;

export default function PlanOperationStatus({ state, checkCurrent }: Props) {
  const messageRef = useRef<HTMLParagraphElement>(null);
  const isError = state.phase === "error" || state.phase === "unknown";
  useEffect(() => {
    if (isError) messageRef.current?.focus();
  }, [isError, state.message]);

  if (state.phase === "idle") return null;
  const message =
    state.phase === "pending"
      ? "Tworzenie kompletnego szkicu planu. Może to potrwać do 90 sekund."
      : state.phase === "checking"
        ? "Sprawdzanie aktualnego planu. Może to potrwać do 15 sekund."
        : state.message;

  return (
    <div className="space-y-3">
      <p
        ref={messageRef}
        role={isError ? "alert" : "status"}
        tabIndex={-1}
        className={cn(
          "rounded-lg border px-4 py-3 text-sm leading-6 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200",
          isError
            ? "border-amber-300/30 bg-amber-300/10 text-amber-50"
            : "border-cyan-200/30 bg-cyan-300/10 text-cyan-50",
        )}
      >
        {message}
      </p>
      {state.phase === "unknown" && (
        <Button type="button" variant="outline" className="w-full" onClick={() => void checkCurrent()}>
          Sprawdź aktualny plan
        </Button>
      )}
      {state.showPlan && (
        <a
          href="/dashboard"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded text-sm font-semibold text-cyan-100 underline focus-visible:ring-2 focus-visible:ring-cyan-200"
        >
          Zobacz aktualny plan <span className="font-normal">(nowa karta)</span>
        </a>
      )}
      {state.signinRequired && (
        <a
          href="/auth/signin"
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded text-sm font-semibold text-cyan-100 underline focus-visible:ring-2 focus-visible:ring-cyan-200"
        >
          Zaloguj się (nowa karta)
        </a>
      )}
      {state.requestId && (
        <p className="text-xs break-all text-blue-100/60">Identyfikator zgłoszenia: {state.requestId}</p>
      )}
    </div>
  );
}
