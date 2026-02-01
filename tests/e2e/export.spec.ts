import { test, expect } from "@playwright/test";

test.describe("Export Feature", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("/");
        const tutorialBtn = page.getByRole("button", { name: "Rozpocznij" });
        if (await tutorialBtn.isVisible()) {
            await tutorialBtn.click();
        }
    });

    test("is disabled when no data/template", async ({ page }) => {
        const btn = page.getByRole("button", { name: "Eksportuj Wszystkie do ZIP" });
        await expect(btn).toBeDisabled();
    });

    test("opens export modal when ready", async ({ page }) => {
        // Inject state
        await page.evaluate(() => {
            localStorage.setItem("auto-cert-participants", JSON.stringify([
                { id: "1", name: "Jan Testowy" }
            ]));
            localStorage.setItem("auto-cert-selected-template", JSON.stringify(
                { id: "t1", name: "Test T", path: "/templates/template1.svg" }
            ));
        });
        await page.reload();

        const btn = page.getByRole("button", { name: "Eksportuj Wszystkie do ZIP" });
        await expect(btn).toBeEnabled();
        await btn.click();

        // Expect Export modal/view
        await expect(page.getByText("Eksport Certyfikatów")).toBeVisible();
        await expect(page.getByRole("button", { name: "Rozpocznij Generowanie" })).toBeVisible();

        await page.screenshot({ path: "test-results/screenshots/export-modal.png" });
    });
});
