// Risk: context/foundation/test-plan.md #4 — anonymous access (UI smoke coverage only).
// Seed: this file is the project's first reference test.
import { test, expect } from "@playwright/test";

test.describe("Ochrona dostępu do dashboardu", () => {
  test("niezalogowany użytkownik trafia z dashboardu do formularza logowania", async ({ page }) => {
    // Wejdź na chronioną stronę w nowym, niezalogowanym kontekście przeglądarki.
    await page.goto("/dashboard");

    // Sprawdź przekierowanie oraz formularz, z którego użytkownik może się zalogować.
    await expect(page).toHaveURL("/auth/signin");
    await expect(page.getByRole("heading", { name: "Zaloguj się", exact: true })).toBeVisible();
    await expect(page.getByRole("textbox", { name: "Email", exact: true })).toBeVisible();
    await expect(page.getByLabel("Hasło", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Zaloguj się", exact: true })).toBeVisible();
    // Test nie tworzy danych; Playwright automatycznie usuwa kontekst i ciasteczka.
  });
});
