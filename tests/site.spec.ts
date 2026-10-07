import { expect, test } from './fixtures';
import { filePath, indexablePages, type Locale, type PageName } from './support/public-pages';

test('Romanian home is delivered as complete HTML, regardless of browser language', async ({ page }) => {
  const response = await page.goto('/index.html');
  expect(response?.status()).toBe(200);
  expect(response?.request().redirectedFrom()).toBeNull();
  await expect(page.locator('html')).toHaveAttribute('lang', 'ro');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Programări la salon, în ritmul tău.');
  await expect(page.getByRole('main')).toContainText('Găsește un salon');
});

const content = {
  ro: {
    home: { heading: 'Programări la salon, în ritmul tău.', section: 'Găsește un salon' },
    privacy: { heading: 'Politica de confidențialitate', section: 'Confidențialitatea copiilor' },
    terms: { heading: 'Condiții de utilizare', section: 'Legea aplicabilă' },
    'delete-account': { heading: 'Șterge contul tău BookMe', section: 'Ce date pot fi păstrate' },
  },
  en: {
    home: { heading: 'Beauty appointments, at your pace.', section: 'Find a salon' },
    privacy: { heading: 'Privacy Policy', section: "Children's Privacy" },
    terms: { heading: 'Terms of Use', section: 'Governing Law' },
    'delete-account': { heading: 'Delete Your BookMe Account', section: 'What data may be retained' },
  },
} satisfies Record<Locale, Record<PageName, { heading: string; section: string }>>;

for (const { locale, page: name } of indexablePages) {
  const path = filePath(locale, name);
  const entry = content[locale][name];
  test(`visitor can open the complete page at ${path} directly`, async ({ page }) => {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    expect(response?.request().redirectedFrom()).toBeNull();
    await expect(page.locator('html')).toHaveAttribute('lang', locale);
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(entry.heading);
    await expect(page.getByRole('main')).toContainText(entry.section);
    await expect(page.getByRole('contentinfo')).toBeVisible();
    expect(await response?.text()).toContain(entry.heading);
  });
}
