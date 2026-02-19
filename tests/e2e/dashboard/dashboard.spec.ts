import { test, expect } from "@playwright/test";
import path from "path";
import { snapshot } from "../../helpers/screenshot";

const SCREENSHOT_DIR = path.join("tests", "e2e", "dashboard", "screenshots");

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("auto-cert-tutorial-completed", "true");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("displays welcome message and stats", async ({ page }) => {
    await expect(page.getByText("Witaj!")).toBeVisible();
    await expect(page.getByText("Oto co dzieje się dzisiaj")).toBeVisible();

    await expect(page.getByText("Uczestnicy", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Wygenerowano", { exact: false }).first()).toBeVisible();
    await expect(page.getByText("Szablony", { exact: false }).first()).toBeVisible();

    await expect(page.getByText("Ostatnio Edytowane")).toBeVisible();
    await expect(page.getByRole("button", { name: "+ Nowy Projekt" })).toBeVisible();

    await expect(page.getByText("Ostatnia Aktywność")).toBeVisible();
    await expect(page.getByText("Witaj w nowym dashboardzie!")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/dashboard-welcome.png`);
  });
});
