import { expect, test } from './fixtures';

for (const path of ['/', '/en/']) {
  test(`incomplete provider information blocks opt-in on ${path}`, async ({ page, javaScriptEnabled }) => {
    const requests: string[] = [];
    page.on('request', (request) => { if (request.url().includes('consent-test.invalid')) requests.push(request.url()); });
    await page.goto(path);
    const english = path === '/en/';
    const banner = page.getByRole('region', { name: english ? 'Cookies and your privacy' : 'Cookies și confidențialitatea ta' });
    await expect(banner).toContainText(english ? 'Analytics is not connected' : 'Analiza nu este conectată');
    await expect(page.getByRole('button', { name: /Allow analytics|Permite analiza/ })).toHaveCount(0);
    if (javaScriptEnabled) {
      await banner.getByRole('button', { name: english ? 'Details' : 'Detalii', exact: true }).click();
      await expect(page.getByRole('checkbox')).toBeDisabled();
      await page.getByRole('button', { name: english ? 'Save choice' : 'Salvează alegerea' }).click();
    }
    await page.waitForTimeout(1100);
    expect(requests).toEqual([]);
    expect(await page.evaluate(() => localStorage.getItem('bookme.test-analytics'))).toBeNull();
  });
}
