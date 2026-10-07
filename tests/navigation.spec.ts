import { expect, test, waitForFonts } from './fixtures';
import { defaultLocale, filePath, hasPage, homePath, indexablePages, indexablePaths, languageNames, linkLocale, linkPath, locales, pagePath, pages, prefixedLocales, switchPath, type Locale } from './support/public-pages';

const switcherName = { ro: 'Limba paginii', ru: 'Язык страницы', en: 'Page language' } satisfies Record<Locale, string>;

for (const { locale, page: name, path } of indexablePages) {
  test(`language switcher offers RO / RU / EN on ${path}`, async ({ page }) => {
    await page.goto(path);
    const links = page.getByRole('navigation', { name: switcherName[locale], exact: true }).getByRole('link');
    await expect(links).toHaveText(['RO', 'RU', 'EN']);
    for (const [index, language] of locales.entries()) {
      const link = links.nth(index);
      await expect(link).toHaveAccessibleName(languageNames[language]);
      await expect(link).toHaveAttribute('lang', language);
      await expect(link).toHaveAttribute('hreflang', language);
      // The same page in that language, or that language's homepage until the page is translated.
      await expect(link).toHaveAttribute('href', switchPath(language, name));
    }
  });
}

for (const name of pages) {
  test(`language switch keeps the visitor on ${filePath(defaultLocale, name).slice(1)} wherever it is translated`, async ({ page }) => {
    for (const locale of prefixedLocales) {
      await page.goto(filePath(defaultLocale, name));
      await page.getByRole('link', { name: languageNames[locale], exact: true }).click();
      await expect(page).toHaveURL(switchPath(locale, name));
      await expect(page.locator('html')).toHaveAttribute('lang', locale);
      await expect(page.getByRole('link', { name: languageNames[locale], exact: true })).toHaveAttribute('aria-current', 'page');

      const current = hasPage(locale, name) ? name : 'home';
      await page.getByRole('link', { name: languageNames[defaultLocale], exact: true }).click();
      await expect(page).toHaveURL(pagePath(defaultLocale, current));
      await expect(page.locator('html')).toHaveAttribute('lang', defaultLocale);
      await expect(page.getByRole('link', { name: languageNames[defaultLocale], exact: true })).toHaveAttribute('aria-current', 'page');
    }
  });
}

const navigationText = {
  ro: { nav: 'Navigare principală', skip: 'Sari la conținut', how: 'Cum funcționează', features: 'Funcționalități', contact: 'Contact', privacy: 'Confidențialitate', terms: 'Condiții', privacyTitle: 'Politica de confidențialitate', termsTitle: 'Condiții de utilizare', deletion: 'Ștergerea contului' },
  ru: { nav: 'Основная навигация', skip: 'Перейти к содержимому', how: 'Как это работает', features: 'Возможности', contact: 'Контакты', privacy: 'Конфиденциальность', terms: 'Условия', privacyTitle: 'Политика конфиденциальности', termsTitle: 'Условия использования', deletion: 'Удаление аккаунта' },
  en: { nav: 'Main navigation', skip: 'Skip to content', how: 'How it works', features: 'Features', contact: 'Contact', privacy: 'Privacy', terms: 'Terms', privacyTitle: 'Privacy Policy', termsTitle: 'Terms of Use', deletion: 'Delete your account' },
} satisfies Record<Locale, Record<string, string>>;

for (const locale of locales) {
  const text = navigationText[locale];
  // Start on a legal page where the language has one, so the section links lead back to the homepage.
  const start = hasPage(locale, 'privacy') ? pagePath(locale, 'privacy') : homePath(locale);

  test(`navigation reaches homepage sections and all legal pages in ${homePath(locale)}`, async ({ page }) => {
    await page.goto(start);
    const navigation = page.getByRole('navigation', { name: text.nav });
    for (const [name, id] of [[text.how, 'how-it-works'], [text.features, 'features'], [text.contact, 'contact']]) {
      await navigation.getByRole('link', { name, exact: true }).click();
      await expect(page).toHaveURL(`${homePath(locale)}#${id}`);
      await expect(page.locator(`#${id}`)).toBeInViewport();
    }
    for (const [area, name, target] of [
      ['navigation', text.privacy, 'privacy'], ['navigation', text.terms, 'terms'],
      ['footer', text.privacyTitle, 'privacy'], ['footer', text.termsTitle, 'terms'], ['footer', text.deletion, 'delete-account'],
    ] as const) {
      await page.goto(start);
      const links = area === 'navigation' ? page.getByRole('navigation', { name: text.nav }) : page.getByRole('contentinfo');
      await links.getByRole('link', { name, exact: true }).click();
      // A page the language has not published yet opens in the default language.
      await expect(page).toHaveURL(linkPath(locale, target));
      await expect(page.locator('html')).toHaveAttribute('lang', linkLocale(locale, target));
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
    await page.goto(start);
    await page.getByRole('link', { name: 'BookMe', exact: true }).click();
    await expect(page).toHaveURL(homePath(locale));
  });

  test(`keyboard users can skip to content and follow visible menu links in ${homePath(locale)}`, async ({ page, tabKey }) => {
    await page.goto(start);
    await page.keyboard.press(tabKey);
    const skip = page.getByRole('link', { name: text.skip });
    await expect(skip).toBeFocused();
    await expect(skip).toBeInViewport();
    await expect(skip).toHaveCSS('outline-style', 'solid');
    await expect(skip).toHaveCSS('outline-width', '3px');
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();

    await page.goto(start);
    await page.keyboard.press(tabKey);
    await page.keyboard.press(tabKey);
    await page.keyboard.press(tabKey);
    const how = page.getByRole('navigation', { name: text.nav }).getByRole('link', { name: text.how });
    await expect(how).toBeFocused();
    await expect(how).toBeInViewport();
    await expect(how).toHaveCSS('outline-style', 'solid');
    await page.keyboard.press('Enter');
    await expect(page).toHaveURL(`${homePath(locale)}#how-it-works`);
  });
}

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
