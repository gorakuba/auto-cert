import { test, expect } from "@playwright/test";
import path from "path";
import { snapshot } from "../../helpers/screenshot";

const SCREENSHOT_DIR = path.join("tests", "e2e", "export", "screenshots");

test.describe("Export Feature", () => {
  test.beforeEach(async ({ page, context, request }) => {
    // 1. Skip tutorial via localStorage
    await context.addInitScript(() => {
      window.localStorage.setItem("auto-cert-tutorial-completed", "true");
    });

    // 2. Clear data
    await request.delete("/api/participants");
    await request.put("/api/settings/auto-cert-recent-projects", { data: { value: "" } });
    await request.put("/api/settings/auto-cert-custom-templates", { data: { value: "[]" } });

    await page.goto("/");
    await page.waitForLoadState("networkidle");
  });

  test("opens export modal from generator", async ({ page, request }) => {
    // Seed data
    await request.post("/api/participants/bulk", {
      data: [{ id: "1", name: "Jan Testowy" }]
    });

    await request.put("/api/settings/auto-cert-selected-template", {
      data: {
        value: JSON.stringify({
          id: "t1",
          name: "Test T",
          path: "/templates/template1.svg",
        })
      }
    });

    await page.reload();
    await page.waitForLoadState("networkidle");

    await page.getByRole("button", { name: "Generator" }).click();

    const exportBtn = page.getByRole("button", { name: "Eksportuj ZIP" });
    await expect(exportBtn).toBeVisible();
    await exportBtn.click();

    await expect(
      page.getByRole("heading", { name: "Eksportowanie do ZIP" }),
    ).toBeVisible();
    await expect(page.getByText("Postęp")).toBeVisible();
    await expect(page.getByText("Proszę czekać")).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/export-modal.png`);
  });
});
