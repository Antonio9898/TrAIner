import { useEffect, useRef } from "react";

function calendarDate(value: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((item) => item.type === type)?.value ?? "";
  return `${part("year")}-${part("month")}-${part("day")}`;
}

export function useWorkoutFeedbackDate(acceptedAt: string) {
  const formRef = useRef<HTMLFormElement>(null);

  function updateDateBounds() {
    const form = formRef.current;
    const date = form?.elements.namedItem("performedDate");
    const zone = form?.elements.namedItem("timeZone");
    if (!(date instanceof HTMLInputElement) || !(zone instanceof HTMLInputElement)) return;

    try {
      if (!zone.value.trim()) throw new Error("Time zone is required");
      date.min = calendarDate(new Date(acceptedAt), zone.value.trim());
      date.max = calendarDate(new Date(), zone.value.trim());
    } catch {
      date.removeAttribute("min");
      date.removeAttribute("max");
    }
  }

  useEffect(() => {
    const form = formRef.current;
    const date = form?.elements.namedItem("performedDate");
    const zone = form?.elements.namedItem("timeZone");
    if (!(date instanceof HTMLInputElement) || !(zone instanceof HTMLInputElement)) return;

    // Detect the zone automatically while preserving a date entered before hydration.
    try {
      zone.value = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
      date.min = calendarDate(new Date(acceptedAt), zone.value.trim());
      date.max = calendarDate(new Date(), zone.value.trim());
      if (!date.value) date.value = date.max;
    } catch {
      // Keep the UTC fallback and allow manual date entry if detection fails.
    }
  }, [acceptedAt]);

  return { formRef, updateDateBounds };
}
