import { test, expect } from "@playwright/test";
import path from "path";
import { snapshot } from "../../helpers/screenshot";

const SCREENSHOT_DIR = path.join("tests", "e2e", "export", "screenshots");

test.describe("Export Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("auto-cert-tutorial-completed", "true");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("opens export modal from generator", async ({ page }) => {
    await page.evaluate(() => {
      localStorage.setItem(
        "auto-cert-participants",
        JSON.stringify([{ id: "1", name: "Jan Testowy" }]),
      );
      localStorage.setItem(
        "auto-cert-selected-template",
        JSON.stringify({
          id: "t1",
          name: "Test T",
          path: "/templates/template1.svg",
        }),
      );
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
