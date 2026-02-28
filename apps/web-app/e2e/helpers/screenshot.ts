import type { Page } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

export async function snapshot(page: Page, filePath: string): Promise<void> {
  const absolutePath = path.resolve(filePath);

  if (fs.existsSync(absolutePath)) {
    return;
  }

  fs.mkdirSync(path.dirname(absolutePath), { recursive: true });
  process.stdout.write(`📸 New snapshot: ${filePath}\n`);
  await page.screenshot({ path: absolutePath, fullPage: true });
}
