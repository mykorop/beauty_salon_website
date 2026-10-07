import { expect, test, waitForFonts } from './fixtures';
import { defaultLocale, filePath, homePath, indexablePaths, languageNames, locales, pagePath, pages, prefixedLocales, type Locale } from './support/public-pages';

for (const name of pages) {
  test(`language switch keeps the visitor on ${filePath(defaultLocale, name).slice(1)}`, async ({ page }) => {
    await page.goto(filePath(defaultLocale, name));
    for (const locale of prefixedLocales) {
      await page.getByRole('link', { name: languageNames[locale], exact: true }).click();
      await expect(page).toHaveURL(pagePath(locale, name));
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('link', { name: languageNames[locale], exact: true })).toHaveAttribute('aria-current', 'page');

      await page.getByRole('link', { name: languageNames[defaultLocale], exact: true }).click();
      await expect(page).toHaveURL(pagePath(defaultLocale, name));
      await expect(page.locator('html')).toHaveAttribute('lang', defaultLocale);
      await expect(page.getByRole('link', { name: languageNames[defaultLocale], exact: true })).toHaveAttribute('aria-current', 'page');
    }
  });
}

const navigationText = {
  ro: { nav: 'Navigare principală', how: 'Cum funcționează', features: 'Funcționalități', privacy: 'Confidențialitate', terms: 'Condiții', deletion: 'Ștergerea contului' },
  en: { nav: 'Main navigation', how: 'How it works', features: 'Features', privacy: 'Privacy', terms: 'Terms', deletion: 'Delete your account' },
} satisfies Record<Locale, Record<string, string>>;

for (const locale of locales) {
  const text = navigationText[locale];
  test(`navigation reaches homepage sections and all legal pages in ${homePath(locale)}`, async ({ page }) => {
    await page.goto(pagePath(locale, 'privacy'));
    const navigation = page.getByRole('navigation', { name: text.nav });
    for (const [name, id] of [[text.how, 'how-it-works'], [text.features, 'features'], ['Contact', 'contact']]) {
      await navigation.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(`${homePath(locale)}#${id}`);
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
    await navigation.getByRole('link', { name: text.privacy, exact: true }).click();
    await expect(page).toHaveURL(pagePath(locale, 'privacy'));
    await navigation.getByRole('link', { name: text.terms, exact: true }).click();
    await expect(page).toHaveURL(pagePath(locale, 'terms'));
    await page.getByRole('contentinfo').getByRole('link', { name: text.deletion }).click();
    await expect(page).toHaveURL(pagePath(locale, 'delete-account'));
    await page.getByRole('link', { name: 'BookMe', exact: true }).click();
    await expect(page).toHaveURL(homePath(locale));
  });
}

test('keyboard users can skip to content and follow visible menu links', async ({ page, tabKey }) => {
  await page.goto('/terms.html');
  await page.keyboard.press(tabKey);
  const skip = page.getByRole('link', { name: 'Sari la conținut' });
  await expect(skip).toBeFocused();
  await expect(skip).toBeInViewport();
  await expect(skip).toHaveCSS('outline-style', 'solid');
  await expect(skip).toHaveCSS('outline-width', '3px');
  await page.keyboard.press('Enter');
  await expect(page.getByRole('main')).toBeFocused();

  await page.goto('/terms.html');
  await page.keyboard.press(tabKey);
  await page.keyboard.press(tabKey);
  await page.keyboard.press(tabKey);
  const how = page.getByRole('navigation', { name: 'Navigare principală' }).getByRole('link', { name: 'Cum funcționează' });
  await expect(how).toBeFocused();
  await expect(how).toBeInViewport();
  await expect(how).toHaveCSS('outline-style', 'solid');
  await page.keyboard.press('Enter');
  await expect(page).toHaveURL('/#how-it-works');
});

test('pages fit a 320px screen and load Romanian fonts from the same origin', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 740 });
  const fontRequests: string[] = [];
  page.on('request', (request) => {
    if (request.resourceType() === 'font') fontRequests.push(request.url());
  });
  for (const path of indexablePaths) {
    await page.goto(path);
    await waitForFonts(page);
    const widths = await page.evaluate(() => {
      return { content: document.documentElement.scrollWidth, viewport: window.innerWidth };
    });
    expect(widths.content, path).toBeLessThanOrEqual(widths.viewport);
  }
  expect(fontRequests.some((url) => url.includes('dm-sans-latin-ext'))).toBe(true);
  expect(fontRequests.some((url) => url.includes('instrument-serif-latin-ext'))).toBe(true);
  for (const url of fontRequests) expect(new URL(url).origin).toBe('http://127.0.0.1:4329');
});
