import { test, expect } from '@playwright/test';

test.describe('Authentication Flow', () => {

    test('Redirects to login when accessing protected route', async ({ page }) => {
        await page.goto('/dashboard');
        await expect(page).toHaveURL(/.*\/login/);
        await expect(page.locator('h1')).toContainText('Witaj ponownie!');
        // Screenshot of the login page layout after redirect
        await page.screenshot({ path: 'e2e/test-results/screenshots/login-page-redirected.png' });
    });

    test('Registration page shows errors for invalid data and redirects on success', async ({ page }) => {
        await page.goto('/register');
        await page.waitForLoadState('networkidle');

        // Screenshot of clear form
        await page.screenshot({ path: 'e2e/test-results/screenshots/register-form-empty.png' });

        // Test password mismatch
        await page.fill('input[type="email"]', 'test.newuser@example.com');
        await page.fill('input[placeholder="Min. 8 znaków"]', 'Password123!');
        await page.fill('input[placeholder="••••••••"]', 'DifferentPassword!');
        await page.screenshot({ path: 'e2e/test-results/screenshots/register-form-filled-mismatch.png' });

        await page.click('button[type="submit"]');

        await expect(page.locator('text=Hasła nie pasują do siebie.')).toBeVisible();
        await page.screenshot({ path: 'e2e/test-results/screenshots/register-form-error-mismatch.png' });

        // Test success redirect
        await page.fill('input[placeholder="••••••••"]', 'Password123!');
        await page.screenshot({ path: 'e2e/test-results/screenshots/register-form-ready.png' });

        await page.click('button[type="submit"]');

        await expect(page).toHaveURL(/.*\/verify-email-pending/);
        await expect(page.locator('h1')).toContainText('Zweryfikuj swój adres email');

        // Screenshot of pending verification page
        await page.screenshot({ path: 'e2e/test-results/screenshots/register-verify-pending.png' });
    });

    test('Login page shows error for invalid credentials', async ({ page }) => {
        await page.goto('/login');
        await page.waitForLoadState('networkidle');

        await page.screenshot({ path: 'e2e/test-results/screenshots/login-form-empty.png' });

        await page.fill('input[type="email"]', 'invalid@example.com');
        await page.fill('input[type="password"]', 'wrongpassword');
        await page.screenshot({ path: 'e2e/test-results/screenshots/login-form-filled-invalid.png' });

        await page.click('button[type="submit"]');

        await expect(page.locator('text=Podałeś nieprawidłowy email lub hasło.')).toBeVisible();
        await page.screenshot({ path: 'e2e/test-results/screenshots/login-form-error.png' });
    });

    test('Forgot password flow', async ({ page }) => {
        await page.goto('/forgot-password');
        await page.waitForLoadState('networkidle');

        await page.screenshot({ path: 'e2e/test-results/screenshots/forgot-password-empty.png' });

        await page.fill('input[type="email"]', 'test.user@example.com');
        await page.screenshot({ path: 'e2e/test-results/screenshots/forgot-password-filled.png' });

        await page.click('button[type="submit"]');

        await expect(page.locator('h1')).toContainText('Sprawdź swoją skrzynkę');
        await page.screenshot({ path: 'e2e/test-results/screenshots/forgot-password-success.png' });
    });

});
