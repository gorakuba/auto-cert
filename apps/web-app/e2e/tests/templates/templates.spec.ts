import { test, expect } from "@playwright/test";
import path from "path";
import { snapshot } from "../../helpers/screenshot";

const SCREENSHOT_DIR = path.join("tests", "e2e", "templates", "screenshots");

test.describe("Templates Feature", () => {
  test.beforeEach(async ({ page, request }) => {
    // Skip tutorial
    await request.put("/api/settings/auto-cert-tutorial-completed", {
      data: { value: "true" }
    });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("navigates to templates page", async ({ page }) => {
    await page.getByRole("button", { name: "Szablony" }).click();

    await expect(
      page.getByRole("heading", { name: "Szablony Certyfikatów" }),
    ).toBeVisible();
    await expect(page.getByText("Szablon Klasyczny")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/templates-page.png`);
  });

  test("selects a template", async ({ page }) => {
    await page.getByRole("button", { name: "Szablony" }).click();

    await expect(page.locator(".grid")).toBeVisible();

    const templateBtn = page.getByRole("button", { name: /Szablon/ }).first();
    await expect(templateBtn).toBeVisible();
    await templateBtn.click();

    await expect(page.getByText("Wybrany", { exact: false })).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/template-selected.png`);
  });
});
