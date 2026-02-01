import { test, expect } from "@playwright/test";

test.describe("Participants Feature", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        const tutorialBtn = page.getByRole("button", { name: "Rozpocznij" });
        if (await tutorialBtn.isVisible()) {
            await tutorialBtn.click();
        }
    });

    test("opens import modal when clicking participant tile (empty state)", async ({ page }) => {
        // Click tile
        await page.getByText("Zarządzanie Uczestnikami").click();

        // Expect Import modal
        await expect(page.getByText("Importuj Uczestników")).toBeVisible();
        await expect(page.getByText("Przeciągnij i upuść")).toBeVisible();

        await page.screenshot({ path: "test-results/screenshots/participants-import-modal.png" });
    });

    test("shows participant manager when data exists", async ({ page }) => {
        // Inject data
        await page.evaluate(() => {
            localStorage.setItem("auto-cert-participants", JSON.stringify([
                { id: "1", name: "Jan Testowy", email: "jan@test.pl" }
            ]));
        });
        await page.reload();

        // Tile text changes
        await expect(page.getByText("Jan Testowy")).toBeVisible();

        // Click tile
        await page.getByText("Jan Testowy").click();

        // Expect Manager
        await expect(page.getByText("Zarządzanie Uczestnikami")).toBeVisible();
        // Check row
        await expect(page.getByRole("cell", { name: "Jan Testowy" })).toBeVisible();

        await page.screenshot({ path: "test-results/screenshots/participants-manager.png" });
    });
});
