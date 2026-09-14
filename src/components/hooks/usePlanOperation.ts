import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import type { PlanOperationErrorCode, PlanOperationResponse } from "@/types";

type Target = { kind: "generate"; intakeId: string } | { kind: "revise"; planId: string; expectedUpdatedAt: string };
type Phase = "idle" | "pending" | "saved" | "error" | "unknown" | "checking" | "checked";
interface OperationState {
  phase: Phase;
  message?: string;
  canRetry?: boolean;
  showPlan?: boolean;
  showDashboard?: boolean;
  signinRequired?: boolean;
  requestId?: string;
}
interface Attempt {
  controller: AbortController;
  deadline: number;
  timer: ReturnType<typeof setTimeout>;
  expire: () => void;
}

const errorMessages: Record<PlanOperationErrorCode, string> = {
  "invalid-request": "Sprawdź wpisane dane. Jeśli błąd się powtarza, otwórz aktualny panel.",
  "missing-intake": "Nie znaleziono danych do planu. Otwórz panel i sprawdź ankietę.",
  "stale-intake": "Te dane są już nieaktualne. Otwórz aktualny panel, aby kontynuować.",
  "signin-required": "Sesja wygasła. Zaloguj się w nowej karcie, aby zachować wpisane pola.",
  "request-not-allowed": "Nie udało się zweryfikować żądania. Otwórz aktualny panel.",
  "plan-conflict": "Wersja planu jest nieaktualna. Sprawdź aktualny plan przed dalszą zmianą.",
  "intake-already-planned": "Dla tych danych istnieje już plan. Sprawdź aktualny plan.",
  "operation-timeout": "Przekroczono czas oczekiwania. Ta próba nie rozpoczęła zapisu. Możesz spróbować ponownie.",
  "invalid-generation": "Nie udało się wygenerować poprawnego planu. Możesz spróbować ponownie.",
  "invalid-revision":
    "Nie udało się utworzyć poprawionej wersji. Ta próba nie zapisała zmiany. Możesz spróbować ponownie.",
  "dependency-unavailable": "Usługa jest chwilowo niedostępna. Spróbuj ponownie później.",
  "supabase-not-configured": "Operacje na planie są obecnie niedostępne. Spróbuj ponownie później.",
  "openrouter-not-configured": "Generowanie planu jest obecnie niedostępne. Spróbuj ponownie później.",
};
const unknownMessage =
  "Nie udało się potwierdzić wyniku. Plan mógł zostać zapisany. Sprawdź aktualny plan przed ponowieniem.";
const errorSchema = z.object({
  outcome: z.enum(["not-saved", "unknown"]),
  code: z.enum(Object.keys(errorMessages) as [PlanOperationErrorCode, ...PlanOperationErrorCode[]]),
  requestId: z.uuid().optional(),
});
const savedSchema = z.object({
  outcome: z.literal("saved"),
  planId: z.uuid(),
  intakeId: z.uuid(),
  updatedAt: z.iso.datetime({ offset: true }),
  requestId: z.uuid(),
});
const currentSchema = z.object({
  generationState: z.enum(["ready", "planned", "stale", "missing"]).optional(),
  plan: z
    .object({
      id: z.uuid(),
      intakeId: z.uuid(),
      updatedAt: z.iso.datetime({ offset: true }),
      revisionCount: z.number().int().nonnegative(),
      status: z.enum(["draft", "accepted"]),
    })
    .nullable(),
  requestId: z.uuid(),
});

async function readJson(response: Response): Promise<unknown> {
  if (response.redirected || !/^application\/json(?:;|$)/i.test(response.headers.get("Content-Type") ?? "")) {
    throw new Error("Unexpected response");
  }
  return response.json();
}

export function usePlanOperation(target: Target) {
  const [state, setState] = useState<OperationState>({ phase: "idle" });
  // Synchronous guards also cover repeated submits before React renders.
  const stateRef = useRef<OperationState>(state);
  const active = useRef<Attempt | null>(null);

  function transition(next: OperationState) {
    stateRef.current = next;
    setState(next);
  }

  function begin(checking: boolean): Attempt {
    const controller = new AbortController();
    const attempt: Attempt = {
      controller,
      deadline: Date.now() + (checking ? 15_000 : 90_000),
      timer: setTimeout(
        () => {
          attempt.expire();
        },
        checking ? 15_000 : 90_000,
      ),
      expire: () => {
        if (active.current !== attempt) return;
        active.current = null;
        clearTimeout(attempt.timer);
        controller.abort();
        transition({
          phase: "unknown",
          message: checking
            ? `Nie udało się sprawdzić planu. Spróbuj ponownie sprawdzić. ${unknownMessage}`
            : unknownMessage,
        });
      },
    };
    active.current = attempt;
    transition({ phase: checking ? "checking" : "pending" });
    return attempt;
  }

  function finish(attempt: Attempt, next: OperationState) {
    if (active.current !== attempt) return;
    if (Date.now() >= attempt.deadline) {
      attempt.expire();
      return;
    }
    clearTimeout(attempt.timer);
    active.current = null;
    transition(next);
  }

  useEffect(() => {
    const requireRecovery = () => {
      if (active.current || stateRef.current.phase === "saved") return;
      const next: OperationState = { phase: "unknown", message: unknownMessage };
      stateRef.current = next;
      setState(next);
    };
    const checkDeadline = () => {
      const attempt = active.current;
      if (attempt && Date.now() >= attempt.deadline) attempt.expire();
    };
    const pageHide = () => active.current?.expire();
    const pageShow = (event: PageTransitionEvent) => {
      checkDeadline();
      // A restored page may carry a stale token or a previous retry permission.
      if (event.persisted) requireRecovery();
    };
    window.addEventListener("pagehide", pageHide);
    window.addEventListener("pageshow", pageShow);
    window.addEventListener("focus", checkDeadline);
    document.addEventListener("visibilitychange", checkDeadline);
    // History can reload cached HTML instead of restoring a live BFCache page.
    // Its pageshow may precede hydration, so inspect the navigation entry too.
    const navigation = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (navigation?.type === "back_forward") requireRecovery();
    return () => {
      window.removeEventListener("pagehide", pageHide);
      window.removeEventListener("pageshow", pageShow);
      window.removeEventListener("focus", checkDeadline);
      document.removeEventListener("visibilitychange", checkDeadline);
      const attempt = active.current;
      active.current = null;
      if (attempt) {
        clearTimeout(attempt.timer);
        attempt.controller.abort();
      }
    };
  }, []);

  function maySubmit(current: OperationState) {
    return (
      current.phase === "idle" ||
      current.phase === "error" ||
      (current.phase === "checked" && current.canRetry === true)
    );
  }

  async function submit(data: FormData) {
    if (active.current || !maySubmit(stateRef.current)) return;
    const attempt = begin(false);
    try {
      // Keep the original identity/version even after recovery reads.
      if (target.kind === "generate") data.set("intakeId", target.intakeId);
      else {
        data.set("planId", target.planId);
        data.set("expectedUpdatedAt", target.expectedUpdatedAt);
      }
      const response = await fetch(`/api/training-plans/${target.kind}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
        credentials: "same-origin",
        redirect: "error",
        cache: "no-store",
        signal: attempt.controller.signal,
      });
      const body = await readJson(response);
      const result: PlanOperationResponse = response.status === 200 ? savedSchema.parse(body) : errorSchema.parse(body);
      if (response.ok !== (result.outcome === "saved")) throw new Error("Unexpected outcome");
      if (result.outcome === "saved") {
        if (target.kind === "generate" ? result.intakeId !== target.intakeId : result.planId !== target.planId) {
          throw new Error("Unexpected plan");
        }
        finish(attempt, {
          phase: "saved",
          message: "Plan został zapisany. Przejrzyj aktualny szkic przed akceptacją.",
          showPlan: true,
        });
      } else {
        if (result.outcome === "not-saved" && ["stale-intake", "missing-intake"].includes(result.code)) {
          finish(attempt, {
            phase: "checked",
            message: errorMessages[result.code],
            showDashboard: true,
            requestId: result.requestId,
          });
          return;
        }
        const needsCheck =
          result.outcome === "unknown" || result.code === "plan-conflict" || result.code === "intake-already-planned";
        finish(attempt, {
          phase: needsCheck ? "unknown" : "error",
          message: result.outcome === "unknown" ? unknownMessage : errorMessages[result.code],
          signinRequired: result.code === "signin-required",
          requestId: result.requestId,
        });
      }
    } catch {
      finish(attempt, { phase: "unknown", message: unknownMessage });
    }
  }

  async function checkCurrent() {
    if (active.current || stateRef.current.phase !== "unknown") return;
    const attempt = begin(true);
    try {
      const query = new URLSearchParams(
        target.kind === "generate" ? { intakeId: target.intakeId } : { planId: target.planId },
      );
      const response = await fetch(`/api/training-plans/current?${query.toString()}`, {
        headers: { Accept: "application/json" },
        credentials: "same-origin",
        redirect: "error",
        cache: "no-store",
        signal: attempt.controller.signal,
      });
      const body = await readJson(response);
      if (response.status !== 200) {
        const error = errorSchema.parse(body);
        finish(attempt, {
          phase: "unknown",
          message:
            error.code === "signin-required"
              ? `${errorMessages[error.code]} Po zalogowaniu ponów sprawdzenie.`
              : `Nie udało się sprawdzić planu. Ponów sprawdzenie. ${unknownMessage}`,
          signinRequired: error.code === "signin-required",
          requestId: error.requestId,
        });
        return;
      }
      const result = currentSchema.parse(body);
      const plan = result.plan;
      if (plan && (target.kind === "generate" ? plan.intakeId !== target.intakeId : plan.id !== target.planId)) {
        throw new Error("Unexpected plan");
      }
      if (target.kind === "generate") {
        // Older servers cannot establish that a missing plan is safe to retry.
        if (!result.generationState) throw new Error("Missing generation state");
        const generationState = result.generationState;
        if ((generationState === "ready" && plan) || (generationState === "planned" && !plan)) {
          throw new Error("Inconsistent generation state");
        }
        finish(attempt, {
          phase: "checked",
          canRetry: generationState === "ready",
          showPlan: generationState === "planned",
          showDashboard: generationState === "stale" || generationState === "missing",
          message:
            generationState === "stale"
              ? errorMessages["stale-intake"]
              : generationState === "missing"
                ? errorMessages["missing-intake"]
                : generationState === "planned"
                  ? "Dla tych danych istnieje już plan. Otwórz panel, aby go przejrzeć."
                  : "Nie znaleziono jeszcze planu. Poprzednia próba może nadal się kończyć. Możesz ręcznie ponowić tę próbę.",
        });
      } else if (plan?.updatedAt !== target.expectedUpdatedAt) {
        finish(attempt, {
          phase: "checked",
          showPlan: true,
          message: plan
            ? "Wersja planu zmieniła się. Przejrzyj aktualny plan w nowej karcie i świadomie rozpocznij tam nową poprawkę. Wpisany tutaj tekst pozostaje zachowany."
            : "Nie znaleziono dostępnego planu. Otwórz aktualny panel. Ta poprawka pozostaje zablokowana.",
        });
      } else {
        finish(attempt, {
          phase: "checked",
          canRetry: true,
          message:
            "Wersja planu nie zmieniła się. Poprzednia próba może nadal się kończyć. Możesz ręcznie ponowić tę próbę.",
        });
      }
    } catch {
      finish(attempt, {
        phase: "unknown",
        message: `Nie udało się sprawdzić planu. Ponów sprawdzenie. ${unknownMessage}`,
      });
    }
  }

  return { state, submit, checkCurrent, canSubmit: maySubmit(state), isPending: state.phase === "pending" };
}
