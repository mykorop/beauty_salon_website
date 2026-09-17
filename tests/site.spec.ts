import { expect, test } from '@playwright/test';

test('Romanian home is delivered as complete HTML, regardless of browser language', async ({ page }) => {
  const response = await page.goto('/index.html');
  expect(response?.status()).toBe(200);
  expect(response?.request().redirectedFrom()).toBeNull();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Programează-te la salon, instant.');
  await expect(page.getByRole('main')).toContainText('Găsește un salon');
});

const pages = [
  { path: '/index.html', locale: 'ro', heading: 'Programează-te la salon, instant.', section: 'Găsește un salon' },
  { path: '/privacy.html', locale: 'ro', heading: 'Politica de confidențialitate', section: 'Confidențialitatea copiilor' },
  { path: '/terms.html', locale: 'ro', heading: 'Condiții de utilizare', section: 'Legea aplicabilă' },
  { path: '/delete-account.html', locale: 'ro', heading: 'Șterge contul tău BookMe', section: 'Ce date pot fi păstrate' },
  { path: '/en/index.html', locale: 'en', heading: 'Book beauty appointments, instantly.', section: 'Find a salon' },
  { path: '/en/privacy.html', locale: 'en', heading: 'Privacy Policy', section: "Children's Privacy" },
  { path: '/en/terms.html', locale: 'en', heading: 'Terms of Use', section: 'Governing Law' },
  { path: '/en/delete-account.html', locale: 'en', heading: 'Delete Your BookMe Account', section: 'What data may be retained' },
];

for (const entry of pages) {
  test(`visitor can open the complete page at ${entry.path} directly`, async ({ page }) => {
    const response = await page.goto(entry.path);
    expect(response?.status()).toBe(200);
    expect(response?.request().redirectedFrom()).toBeNull();
    await expect(page.locator('html')).toHaveAttribute('lang', entry.locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(entry.heading);
    await expect(page.getByRole('main')).toContainText(entry.section);
    await expect(page.getByRole('contentinfo')).toBeVisible();
    expect(await response?.text()).toContain(entry.heading);
  });
}
