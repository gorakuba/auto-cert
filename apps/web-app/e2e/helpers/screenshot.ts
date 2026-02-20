import type { Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

/**
 * Takes a screenshot only if the file doesn't already exist.
 * Writes directly to stdout so the message is always visible in the terminal,
 * even when Playwright suppresses console.log from worker processes.
 * Skips silently when the snapshot is already up to date.
 */
export async function snapshot(page: Page, filePath: string): Promise<void> {
    const absolutePath = path.resolve(filePath);

    if (fs.existsSync(absolutePath)) {
        return; // already exists – skip silently
    }

    fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
    process.stdout.write(`📸 New snapshot: ${filePath}\n`);
    await page.screenshot({ path: absolutePath, fullPage: true });
}
