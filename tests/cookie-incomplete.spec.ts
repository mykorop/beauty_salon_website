import { expect, test } from './fixtures';
import { consentText } from './support/consent-text';
import { homePath, locales } from './support/public-pages';

for (const locale of locales) {
  const path = homePath(locale);
  const text = consentText[locale];
  test(`incomplete provider information blocks opt-in on ${path}`, async ({ page, javaScriptEnabled }) => {
    const requests: string[] = [];
    page.on('request', (request) => { if (request.url().includes('consent-test.invalid')) requests.push(request.url()); });
    await page.goto(path);
    const banner = page.getByRole('region', { name: text.banner });
    await expect(banner).toContainText(text.intro);
    // No language's opt-in may appear, whatever the page language.
    for (const { allow } of Object.values(consentText)) await expect(page.getByRole('button', { name: allow })).toHaveCount(0);
    if (javaScriptEnabled) {
      await banner.getByRole('button', { name: text.details, exact: true }).click();
      await expect(page.getByRole('checkbox')).toBeDisabled();
      await page.getByRole('button', { name: text.save }).click();
    }
    await page.waitForTimeout(1100);
    expect(requests).toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem('bookme.test-analytics'))).toBeNull();
  });
}
