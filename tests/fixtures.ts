import { test as base, expect, type Page } from '@playwright/test';

// Tests may override this at the external boundary with synthetic responses.
// An accidental click/submission must never reach a real service or inbox.
export const test = base.extend<{ tabKey: string }>({
  // Option-Tab includes links with macOS WebKit's default keyboard settings.
  tabKey: async ({ browserName }, use) => {
    await use(browserName === 'webkit' && process.platform === 'darwin' ? 'Alt+Tab' : 'Tab');
  },
  page: async ({ page }, use) => {
    await page.route('**/*', (route) => {
      const url = new URL(route.request().url());
      return url.origin === 'http://127.0.0.1:4329' ? route.continue() : route.abort();
    });
    await use(page);
  },
});

export { expect };

export async function waitForFonts(page: Page) {
  // Firefox with page JavaScript disabled can stall on the fonts.ready promise.
  await expect.poll(() => page.evaluate(() => document.fonts.status)).toBe('loaded');
}
