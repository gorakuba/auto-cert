import { test, expect } from "@playwright/test";
import path from "path";
import { snapshot } from "../../helpers/screenshot";

const SCREENSHOT_DIR = path.join("tests", "e2e", "tutorial", "screenshots");

test.describe("Tutorial Flow", () => {
  test.beforeEach(async ({ page, request }) => {
    // Reset state via API
    await request.delete("/api/participants");
    // Set tutorial completed to empty string to force tutorial to show
    await request.put("/api/settings/auto-cert-tutorial-completed", {
      data: { value: "" }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("completes the full tutorial walkthrough", async ({ page, request }) => {
    // 1. Welcome Screen
    await expect(
      page.getByRole("heading", { name: "Witaj w AutoCert!" }),
    ).toBeVisible();
    await expect(page.getByText("Krok 1 z 3")).toBeVisible();
    await expect(
      page.getByRole("heading", { name: "Krok 1: Importuj Uczestników" }),
    ).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/tutorial-step1.png`);

    // 2. Import Step
    const buffer = Buffer.from("name,email\nJan Kowalski,jan@test.pl");
    await page.setInputFiles("input#file-upload", {
      name: "test.csv",
      mimeType: "text/csv",
      buffer,
    });

    await expect(page.getByText("Zaimportowano pomyślnie!")).toBeVisible();
    await expect(page.getByText("Jan Kowalski")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/tutorial-step1-imported.png`);

    await page.getByRole("button", { name: "Dalej" }).click();

    // 3. Template Selection
    await expect(
      page.getByRole("heading", { name: "Krok 2: Wybierz Szablon" }),
    ).toBeVisible();

    await page.locator('button:has-text("Szablon")').first().click();
    await expect(page.getByText("Wybrano szablon:")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/tutorial-step2.png`);

    await page.getByRole("button", { name: "Dalej" }).click();

    // 4. Summary
    await expect(
      page.getByRole("heading", { name: "Gotowe! Wszystko skonfigurowane" }),
    ).toBeVisible();
    await expect(page.getByText("1 osób")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/tutorial-step3-summary.png`);

    await page.getByRole("button", { name: "Zakończ Tutorial" }).click();

    await expect(page.getByText("Witaj!")).toBeVisible();

    const tutorialCompleted = await page.evaluate(() =>
      localStorage.getItem("auto-cert-tutorial-completed"),
    );
    expect(tutorialCompleted).toBe("true");

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/tutorial-completed.png`);
  });
});
