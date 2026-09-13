import { defineMiddleware } from "astro:middleware";
import { createClient } from "@/lib/supabase";
import { isAuthApiError, isAuthSessionMissingError } from "@supabase/supabase-js";
import { PlanOperation, PlanOperationError, planErrorResponse } from "@/lib/plan-operation";
import { isCrossOriginFormRequest, isSameOriginRequest } from "@/lib/request-security";

const PROTECTED_ROUTES = ["/dashboard"];

export const onRequest = defineMiddleware(async (context, next) => {
  const isCurrent = context.url.pathname === "/api/training-plans/current" && context.request.method === "GET";
  const isMutation =
    ["/api/training-plans/generate", "/api/training-plans/revise"].includes(context.url.pathname) &&
    context.request.method === "POST";
  if (isCurrent || isMutation) {
    const operation = new PlanOperation(context.request.signal, isCurrent ? 10_000 : 85_000);
    context.locals.planOperation = operation;
    context.locals.user = null;
    try {
      return await operation.run(
        "operation",
        async () => {
          if (isMutation && !isSameOriginRequest(context.request)) {
            return planErrorResponse(context, "request-not-allowed");
          }
          const supabase = createClient(context.request.headers, context.cookies, operation);
          if (!supabase) return planErrorResponse(context, "supabase-not-configured");
          context.locals.planSupabase = supabase;
          const {
            data: { user },
            error,
          } = await operation.run("auth", () => supabase.auth.getUser());
          if (error) {
            const missingSession =
              isAuthSessionMissingError(error) ||
              (isAuthApiError(error) &&
                [
                  "bad_jwt",
                  "session_not_found",
                  "refresh_token_not_found",
                  "refresh_token_already_used",
                  "user_not_found",
                ].includes(error.code ?? ""));
            return planErrorResponse(context, missingSession ? "signin-required" : "dependency-unavailable");
          }
          if (!user) return planErrorResponse(context, "signin-required");
          context.locals.user = user;
          return next();
        },
        isCurrent ? 10_000 : 85_000,
      );
    } catch (error) {
      return planErrorResponse(context, error instanceof PlanOperationError ? error.code : "dependency-unavailable");
    } finally {
      operation.dispose();
    }
  }

  if (!context.isPrerendered && isCrossOriginFormRequest(context.request)) {
    return new Response("Cross-site form submissions are forbidden", {
      status: 403,
      headers: { "Cache-Control": "no-store" },
    });
  }

  const supabase = createClient(context.request.headers, context.cookies);

  if (supabase) {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    context.locals.user = user ?? null;
  } else {
    context.locals.user = null;
  }

  if (context.url.pathname === "/") {
    return context.redirect(context.locals.user ? "/dashboard" : "/auth/signin");
  }

  if (PROTECTED_ROUTES.some((route) => context.url.pathname.startsWith(route))) {
    if (!context.locals.user) {
      return context.redirect("/auth/signin");
    }
  }

  return next();
});
