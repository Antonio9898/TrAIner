declare namespace App {
  interface Locals {
    planOperation?: import("@/lib/plan-operation").PlanOperation;
    planSupabase?: NonNullable<ReturnType<typeof import("@/lib/supabase").createClient>>;
    user: import("@supabase/supabase-js").User | null;
  }
}
