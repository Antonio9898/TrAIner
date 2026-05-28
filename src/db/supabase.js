import { createClient } from "@supabase/supabase-js";
import { SUPABASE_KEY, SUPABASE_URL } from "astro:env/server";

if (!SUPABASE_URL || !SUPABASE_KEY) {
  throw new Error("SUPABASE_URL and SUPABASE_KEY are required");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
