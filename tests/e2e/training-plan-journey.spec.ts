// Risk: context/foundation/test-plan.md §6.5 — revision/acceptance survives SSR reload.
// Seed: tests/e2e/seed.spec.ts. Scenario: training-plan-journey.prompt.md.
import { randomUUID } from "node:crypto";
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { parseEnv } from "node:util";
import { createClient } from "@supabase/supabase-js";
import { test, expect, type Page } from "@playwright/test";

async function waitForHydration(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForFunction(() =>
    Array.from(document.getElementsByTagName("astro-island")).every((island) => !island.hasAttribute("ssr")),
  );
}

async function openCurrentPlan(page: Page) {
  const popup = page.waitForEvent("popup");
  await page.getByRole("link", { name: "Zobacz aktualny plan (nowa karta)", exact: true }).click();
  const current = await popup;
  await waitForHydration(current);
  return current;
}

test.describe("Logowanie → generowanie → poprawka → akceptacja", () => {
  test("zaakceptowany plan zachowuje poprawione ćwiczenie po odświeżeniu", async ({ page }) => {
    // Przygotuj osobnego użytkownika i wywiad w rzeczywistej lokalnej bazie.
    const local = JSON.parse(
      execFileSync("node_modules/.bin/supabase", ["status", "-o", "json"], {
        encoding: "utf8",
        stdio: ["ignore", "pipe", "pipe"],
      }),
    ) as { API_URL: string; SERVICE_ROLE_KEY: string };
    const appEnv = parseEnv(readFileSync(".dev.vars", "utf8"));
    expect(local.API_URL).toBe("http://127.0.0.1:54321");
    expect(appEnv.SUPABASE_URL).toBe(local.API_URL);
    const admin = createClient(local.API_URL, local.SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const email = `e2e-plan-${Date.now()}-${randomUUID()}@example.com`;
    const password = `E2e!${randomUUID()}`;
    const { data, error } = await admin.auth.admin.createUser({ email, password, email_confirm: true });
    expect(error).toBeNull();
    const user = data.user;
    if (!user) throw new Error("Test user was not created");
    try {
      const { error: intakeError } = await admin.from("training_intakes").insert({
        user_id: user.id,
        goal: `Regularny trening ${randomUUID()}`,
        experience_level: "beginner",
        health_constraints: "Brak znanych ograniczeń",
      });
      expect(intakeError).toBeNull();

      // Zaloguj się formularzem: logowanie jest częścią zleconego scenariusza.
      await page.goto("/auth/signin");
      // SSR fields are visible before React attaches its controlled input handlers.
      await waitForHydration(page);
      await page.getByRole("textbox", { name: "Email", exact: true }).fill(email);
      await page.getByLabel("Hasło", { exact: true }).fill(password);
      await page.getByRole("button", { name: "Zaloguj się", exact: true }).click();
      await expect(page).toHaveURL("/dashboard");
      await waitForHydration(page);

      // Wygeneruj szkic; tylko zewnętrzne HTTP do LLM otrzymuje odpowiedź mocka.
      await page.getByRole("button", { name: "Wygeneruj plan", exact: true }).click();
      page = await openCurrentPlan(page);
      await expect(page.getByText("Przysiad do ławki", { exact: true })).toBeVisible();
      await expect(page.getByText("draft", { exact: true })).toBeVisible();

      // Poproś o poprawkę i sprawdź zastąpienie starego ćwiczenia.
      await page.getByText("Zmień lub zaakceptuj plan", { exact: true }).click();
      await page.getByRole("textbox", { name: "Co należy zmienić?" }).fill("Zamień przysiady na most biodrowy");
      await page.getByRole("button", { name: "Zastosuj poprawkę" }).click();
      page = await openCurrentPlan(page);
      await expect(page.getByRole("heading", { name: "Zmieniony szkic planu", exact: true })).toBeVisible();
      await expect(page.getByText("Most biodrowy", { exact: true })).toBeVisible();
      await expect(page.getByText("Przysiad do ławki", { exact: true })).toHaveCount(0);

      // Zaakceptuj zmienioną wersję, a następnie odczytaj ją ponownie przez SSR.
      await page.getByText("Zmień lub zaakceptuj plan", { exact: true }).click();
      await page.getByRole("button", { name: "Zaakceptuj plan", exact: true }).click();
      await expect(page.getByRole("heading", { name: "Zaakceptowany plan treningowy", exact: true })).toBeVisible();
      await page.goto("/dashboard");
      await page.reload();
      await expect(page.getByRole("heading", { name: "Zaakceptowany plan treningowy", exact: true })).toBeVisible();
      await expect(page.getByText("accepted", { exact: true })).toBeVisible();
      await expect(page.getByText("Most biodrowy", { exact: true })).toBeVisible();
      await expect(page.getByText("Wiosłowanie gumą", { exact: true })).toBeVisible();
      await expect(page.getByText("Przysiad do ławki", { exact: true })).toHaveCount(0);
    } finally {
      // Usuń użytkownika tej próby; FK CASCADE usuwa jego wywiad i plan.
      const { error: cleanupError } = await admin.auth.admin.deleteUser(user.id);
      expect(cleanupError).toBeNull();
    }
  });
});
