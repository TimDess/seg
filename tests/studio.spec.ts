import { test, expect } from "@playwright/test";

test("Studio supports nested routes, stays noindex and hides the public navigation", async ({ page }) => {
  for (const path of ["/studio", "/studio/structure/project"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", "noindex, nofollow");
    await expect(page.locator(".seg-studio")).toBeVisible();
    await expect(page.locator(".site-header")).toBeHidden();
    await expect(page.locator("body > footer")).toBeHidden();
    await page.setViewportSize({ width: 390, height: 844 });
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
  }
  await page.goto("/");
  await expect(page.locator(".site-header")).toBeVisible();
});
