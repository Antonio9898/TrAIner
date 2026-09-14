export const planPayload = {
  planContent: {
    overview: "Testowy tydzień treningowy.",
    scheduledWorkouts: [
      { key: "workout-1", label: "Trening A", exercises: [{ name: "Przysiad do ławki", sets: 2, reps: "10" }] },
      { key: "workout-2", label: "Trening B", exercises: [{ name: "Wiosłowanie gumą", sets: 2, reps: "12" }] },
    ],
    progressionGuidance: "Zwiększaj obciążenie stopniowo.",
    safetyNotes: ["Przerwij ćwiczenie przy bólu i skonsultuj się ze specjalistą."],
  },
  explanation: "Dwa treningi dopasowane do początkującej osoby.",
};
