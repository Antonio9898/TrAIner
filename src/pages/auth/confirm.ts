import type { APIRoute } from "astro";
import { createClient } from "@/lib/supabase";

export const prerender = false;

function getSafeNextPath(next: string | null) {
  if (!next || !next.startsWith("/") || next.startsWith("//")) {
    return "/dashboard";
  }

  return next;
}

export const GET: APIRoute = async (context) => {
  const tokenHash = context.url.searchParams.get("token_hash");
  const type = context.url.searchParams.get("type");
  const next = getSafeNextPath(context.url.searchParams.get("next"));

  if (!tokenHash || !type) {
    return context.redirect(`/auth/signin?error=${encodeURIComponent("Invalid confirmation link")}`);
  }

  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return context.redirect(`/auth/signin?error=${encodeURIComponent("Supabase is not configured")}`);
  }

  const { error } = await supabase.auth.verifyOtp({
    token_hash: tokenHash,
    type,
  });

  if (error) {
    return context.redirect(`/auth/signin?error=${encodeURIComponent(error.message)}`);
  }

  return context.redirect(next);
};
