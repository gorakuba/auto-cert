import { test, expect } from "@playwright/test";
import path from "path";
import { snapshot } from "../../helpers/screenshot";

const SCREENSHOT_DIR = path.join("tests", "e2e", "participants", "screenshots");

test.describe("Participants Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("auto-cert-tutorial-completed", "true");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("navigates to participants page via sidebar", async ({ page }) => {
    await page.getByRole("button", { name: "Uczestnicy" }).click();

    await expect(
      page.getByRole("heading", { name: "Zarządzaj Uczestnikami" }),
    ).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/participants-page.png`);
  });

  test("shows participants in table when data exists", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "auto-cert-participants",
        JSON.stringify([{ id: "1", name: "Jan Testowy", email: "jan@test.pl" }]),
      );
    });
    await page.reload();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Uczestnicy" }).click();

    await expect(page.getByText("Jan Testowy")).toBeVisible();
    await expect(page.getByText("jan@test.pl")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/participants-table.png`);
  });

  test("opens import modal from participants page", async ({ page }) => {
    await page.getByRole("button", { name: "Uczestnicy" }).click();
    await page.getByRole("button", { name: "Dodaj uczestników" }).click();

    await expect(
      page.getByRole("heading", { name: "Dodaj uczestników" }),
    ).toBeVisible();

    await page.locator("button").filter({ hasText: /^Z pliku/ }).click();

    await expect(
      page.getByRole("heading", { name: "Importuj Uczestników" }),
    ).toBeVisible({ timeout: 5000 });

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/import-modal.png`);
  });
});
