import { test, expect } from "@playwright/test";
import path from "path";
import { snapshot } from "../../helpers/screenshot";

const SCREENSHOT_DIR = path.join("tests", "e2e", "generator", "screenshots");

test.describe("Generator Feature", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
    await page.evaluate(() => {
      localStorage.setItem("auto-cert-tutorial-completed", "true");
    });
    await page.reload();
    await page.waitForLoadState("networkidle");
  });

  test("opens generator via sidebar when data and template exist", async ({ page }) => {
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

    await expect(
      page.getByText("Generator Certyfikatów", { exact: false }).first(),
    ).toBeVisible();
    await expect(page.getByText("Podgląd Certyfikatu")).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Generuj Certyfikaty" }),
    ).toBeVisible();

    await page.evaluate(() => window.scrollTo(0, 0));
    await snapshot(page, `${SCREENSHOT_DIR}/generator-view.png`);
  });
});
