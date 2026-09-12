import type { APIContext, APIRoute } from "astro";
import { createClient } from "@/lib/supabase";
import {
  parseTrainingIntakeFormData,
  saveTrainingIntake,
  type TrainingIntakeFormInput,
} from "@/lib/services/training-intakes";

export const prerender = false;

const INTAKE_ROUTE = "/dashboard/intake";

export const POST: APIRoute = async (context) => {
  const supabase = createClient(context.request.headers, context.cookies);
  if (!supabase) {
    return redirectWithError(context, "Supabase nie jest skonfigurowany");
  }

  const user = context.locals.user ?? (await getAuthenticatedUser(supabase));
  if (!user) {
    return redirectWithError(context, "Zaloguj się, aby zapisać dane");
  }

  let input: TrainingIntakeFormInput;
  try {
    const formData = await context.request.formData();
    input = parseTrainingIntakeFormData(formData);
  } catch {
    return redirectWithError(context, "Uzupełnij wszystkie wymagane pola");
  }

  try {
    await saveTrainingIntake(supabase, user.id, input);
  } catch {
    return redirectWithError(context, "Nie udało się zapisać danych. Spróbuj ponownie");
  }

  return context.redirect("/dashboard?saved=intake");
};

function redirectWithError(context: APIContext, message: string) {
  return context.redirect(`${INTAKE_ROUTE}?error=${encodeURIComponent(message)}`);
}

async function getAuthenticatedUser(supabase: NonNullable<ReturnType<typeof createClient>>) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;
  return user;
}
