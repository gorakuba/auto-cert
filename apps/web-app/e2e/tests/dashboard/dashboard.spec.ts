import { test, expect } from "@playwright/test";
import path from "path";
import { snapshot } from "../../helpers/screenshot";

const SCREENSHOT_DIR = path.join("tests", "e2e", "dashboard", "screenshots");

test.describe("Dashboard", () => {
  test.beforeEach(async ({ page, request }) => {
    // 1. Skip tutorial via API
    await request.put("/api/settings/auto-cert-tutorial-completed", {
      data: { value: "true" }
    });

    // 2. Clear and seed participants via API
    await request.delete("/api/participants");
    await request.post("/api/participants/bulk", {
      data: [
        { id: "1", name: "Jan Kowalski", email: "jan@example.com", status: "completed" },
        { id: "2", name: "Anna Nowak", email: "anna@example.com", status: "pending" },
        { id: "3", name: "Piotr Zieliński", email: "piotr@example.com", status: "completed" },
      ]
    });

    // 3. Optional: set generation count
    await request.put("/api/settings/auto-cert-generated-count", {
      data: { value: "125" }
    });

    await page.goto("/");
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
