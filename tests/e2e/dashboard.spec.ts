import { test, expect } from "@playwright/test";

test.describe("Dashboard", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        // Skip tutorial
        const tutorialBtn = page.getByRole("button", { name: "Rozpocznij" });
        if (await tutorialBtn.isVisible()) {
            await tutorialBtn.click();
        }
    });

    test("displays all main feature tiles", async ({ page }) => {
        await expect(page.getByText("Generator Certyfikatów")).toBeVisible();

        // Check for tile titles or key text
        await expect(page.getByText("Zarządzanie Uczestnikami")).toBeVisible();
        await expect(page.getByText("Wybierz Szablon Certyfikatu")).toBeVisible();
        await expect(page.getByText("Generuj Certyfikaty")).toBeVisible();
        await expect(page.getByText("Eksportuj Wszystkie do ZIP")).toBeVisible();

        // Screenshot
        await page.screenshot({ path: "test-results/screenshots/dashboard-tiles.png" });
    });
});
