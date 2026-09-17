import { expect, test } from './fixtures';

const paths = ['/', '/privacy.html', '/terms.html', '/delete-account.html', '/en/', '/en/privacy.html', '/en/terms.html', '/en/delete-account.html'];

for (const path of paths) {
  test(`interactive targets are at least 44px and reflow at 320px on ${path}`, async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);
    // Expand native disclosures so links in answers are checked too.
    for (const summary of await page.locator('summary').all()) await summary.click();
    const failures = await page.locator('a, button, input, textarea, summary').evaluateAll((elements) => elements.flatMap((element) => {
      const { width, height } = element.getBoundingClientRect();
      if (!width || !height) return [];
      return width < 44 || height < 44 ? [{ text: element.textContent?.trim(), width, height }] : [];
    }));
    expect(failures).toEqual([]);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(320);
  });

  test(`keyboard focus stays visible and unobscured on ${path}`, async ({ page, tabKey }) => {
    await page.setViewportSize({ width: 320, height: 800 });
    await page.goto(path);
    const targets = await page.locator('a, button, input, textarea, summary').count();
    for (let index = 0; index < targets; index += 1) {
      await page.keyboard.press(tabKey);
      const focused = page.locator(':focus');
      await expect(focused).toHaveCSS('outline-style', 'solid');
      await expect(focused).toHaveCSS('outline-width', '3px');
      await expect(focused).toBeInViewport();
      expect(await focused.evaluate((element) => {
        const box = element.getBoundingClientRect();
        // Firefox may leave a wrapped link partly beyond the viewport edge.
        // Check its visible portion without scrolling on the user's behalf.
        const x = (Math.max(0, box.left) + Math.min(innerWidth, box.right)) / 2;
        const y = (Math.max(0, box.top) + Math.min(innerHeight, box.bottom)) / 2;
        const hit = document.elementFromPoint(x, y);
        return hit !== null && element.contains(hit);
      })).toBe(true);
    }
  });

  test(`reduced motion preserves visible content on ${path}`, async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto(path);
    await expect(page.locator('html')).toHaveCSS('scroll-behavior', 'auto');
    await expect(page.getByRole('main')).toHaveCSS('opacity', '1');
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    const moving = await page.locator('body, body *').evaluateAll((elements) => elements.filter((element) => {
      const style = getComputedStyle(element);
      return style.animationName !== 'none' || style.transitionDuration.split(',').some((duration) => parseFloat(duration) > 0);
    }).map((element) => element.tagName));
    expect(moving).toEqual([]);
  });
}
