import { test, expect } from "@playwright/test";

test.describe("Templates Feature", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        const tutorialBtn = page.getByRole("button", { name: "Rozpocznij" });
        if (await tutorialBtn.isVisible()) {
            await tutorialBtn.click();
        }
    });

    test("opens template selector", async ({ page }) => {
        await page.getByText("Wybierz Szablon Certyfikatu").click();
        await expect(page.getByText("Wybierz Szablon Certyfikatu").first()).toBeVisible(); // Modal title
        await expect(page.getByText("Szablon Klasyczny")).toBeVisible();

        await page.screenshot({ path: "test-results/screenshots/templates-selector.png" });
    });

    test("selects a template", async ({ page }) => {
        await page.getByText("Wybierz Szablon Certyfikatu").click();

        // Click on a template card
        await page.getByText("Szablon Klasyczny").click();

        // Verify selection in Dashboard
        await expect(page.getByText("Wybrany: Szablon Klasyczny")).toBeVisible();

        await page.screenshot({ path: "test-results/screenshots/templates-selected.png" });
    });
});
