import { expect, test, waitForFonts } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { homePath, legalPages, locales, webApps, type Locale } from './support/public-pages';

const legal = {
  ro: {
    deletionInstructions: 'Instrucțiuni de ștergere a contului', request: 'Solicită ștergerea prin e-mail', subject: 'Cerere de ștergere a contului BookMe',
    clientPath: 'Profil → Șterge contul', salonPath: 'Setările administratorului → Șterge contul', specialistPath: 'Setările specialistului → Șterge contul',
    thirtyDays: '30 de zile', ninetyDays: '90 de zile', contents: 'Cuprins', updated: 'Ultima actualizare: 7 octombrie 2026',
    sameAccounts: 'cu aceleași conturi și date',
    browserPermissions: 'browserul cere accesul la locație în BookMe pentru clienți și la cameră în ambele aplicații',
    browserSettings: 'acest acces este controlat din setările site-ului în browser',
    webUnavailable: 'Alegerea unui contact din agendă, căutarea vocală, notificările push și salvarea imaginii QR în galerie nu sunt disponibile acolo',
    webAlternatives: 'Introdu manual datele clientului, tastează căutarea și urmărește noutățile în lista de notificări din aplicație',
    webStorageLocation: 'în stocarea browserului pentru propriul domeniu', webStorageContents: 'starea autentificării și setări precum limba, filtrele, orașul selectat și preferințele configurării inițiale',
    webStoragePurpose: 'este necesară pentru funcționarea lor și nu este folosită pentru analiză',
    clearSiteData: 'Ștergerea datelor site-ului unei versiuni web din browser te deconectează, dar nu șterge contul tău sau informațiile deținute de BookMe ori de furnizorii săi',
    webRoutes: 'Aceleași trasee funcționează și în versiunile web app.bookme.md și business.bookme.md',
    notDeletion: 'Dezinstalarea aplicației, deconectarea, închiderea filei din browser sau ștergerea datelor browserului nu șterge contul',
    salonRefused: 'Ștergerea este refuzată cât timp în salon lucrează cel puțin un specialist în afară de proprietar',
    salonList: 'după confirmare, aplicația afișează lista acestor specialiști: încheie colaborarea cu fiecare',
    invitations: 'Invitațiile neacceptate nu blochează ștergerea și sunt revocate automat',
    otherAccounts: 'Ștergerea contului unui salon nu șterge conturile celorlalți specialiști',
  },
  en: {
    deletionInstructions: 'Account deletion instructions', request: 'Request deletion by email', subject: 'BookMe account deletion request',
    clientPath: 'Profile → Delete account', salonPath: 'Administrator settings → Delete account', specialistPath: 'Specialist settings → Delete account',
    thirtyDays: '30 days', ninetyDays: '90 days', contents: 'Contents', updated: 'Last updated: October 7, 2026',
    sameAccounts: 'with the same accounts and data',
    browserPermissions: 'the browser asks for location in BookMe for clients and for the camera in both apps',
    browserSettings: "your browser's site settings control that access",
    webUnavailable: 'Choosing a contact from the address book, voice search, push notifications and saving a QR image to the gallery are not available there',
    webAlternatives: 'Enter client details manually, type your search and follow updates in the in-app inbox',
    webStorageLocation: 'in the browser storage of their own domain', webStorageContents: 'sign-in state and settings such as language, filters, the selected city and onboarding preferences',
    webStoragePurpose: 'is needed for them to work and is not used for analytics',
    clearSiteData: "Clearing a web version's site data in your browser signs you out but does not delete your account or the information held by BookMe or its providers",
    webRoutes: 'The same routes work in the web versions at app.bookme.md and business.bookme.md',
    notDeletion: 'Uninstalling the app, signing out, closing the browser tab or clearing browser data does not delete your account',
    salonRefused: 'Deletion is refused while at least one specialist other than the owner still works at the salon',
    salonList: 'after you confirm, the app lists those specialists: end the cooperation with each of them',
    invitations: 'Invitations that have not been accepted do not block deletion and are revoked automatically',
    otherAccounts: "Removing a salon account does not delete other specialists' accounts",
  },
} satisfies Record<Locale, Record<string, string>>;

for (const locale of locales) {
  const prefix = homePath(locale);
  const text = legal[locale];
  test(`privacy reader can identify the operator and exercise rights in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}privacy.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText('BOOKME HUB, SRL');
    await expect(main).toContainText('str. Glinka 4, ap./of. 10, Bălți, Moldova');
    await expect(main).toContainText('BookMe Business');
    await expect(main).toContainText('BookMe Salon');
    await expect(main).toContainText('195/2024');
    await expect(main.getByRole('link', { name: 'support@bookme.md', exact: true }).first()).toHaveAttribute('href', 'mailto:support@bookme.md');
    await expect(main.getByRole('link', { name: 'centru@datepersonale.md', exact: true })).toHaveAttribute('href', 'mailto:centru@datepersonale.md');
    await main.getByRole('link', { name: text.deletionInstructions, exact: true }).click();
    await expect(page).toHaveURL(`${prefix}delete-account.html`);
  });
  test(`privacy reader learns which permissions the browser asks for in the web versions in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}privacy.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText(text.browserPermissions);
    await expect(main).toContainText(text.browserSettings);
    await expect(main).toContainText(text.webUnavailable);
    await expect(main).toContainText(text.webAlternatives);
  });
  test(`privacy reader learns what the web versions keep in the browser in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}privacy.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText(text.webStorageLocation);
    await expect(main).toContainText(text.webStorageContents);
    await expect(main).toContainText(text.webStoragePurpose);
    await expect(main).toContainText(text.clearSiteData);
  });
  test(`visitor can request deletion without an account at ${prefix}delete-account.html`, async ({ page }) => {
    await page.goto(`${prefix}delete-account.html`);
    const request = page.getByRole('link', { name: text.request, exact: true });
    await expect(request).toBeVisible();
    const href = new URL((await request.getAttribute('href'))!);
    expect(href.protocol).toBe('mailto:');
    expect(href.pathname).toBe('support@bookme.md');
    expect(href.searchParams.get('subject')).toBe(text.subject);
    const main = page.getByRole('main');
    await expect(main).toContainText('BookMe Business');
    await expect(main).toContainText('BookMe Salon');
    await expect(main).toContainText(text.clientPath);
    await expect(main).toContainText(text.salonPath);
    await expect(main).toContainText(text.specialistPath);
    await expect(main).toContainText('DELETE');
    await expect(main).toContainText(text.thirtyDays);
    await expect(main).toContainText(text.ninetyDays);
    await expect(main).toContainText(text.webRoutes);
    await expect(main).toContainText(text.notDeletion);
  });
  test(`salon owner learns to end every cooperation before deleting the salon account in ${locale}`, async ({ page }) => {
    await page.goto(`${prefix}delete-account.html`);
    const main = page.getByRole('main');
    await expect(main).toContainText(text.salonRefused);
    await expect(main).toContainText(text.salonList);
    await expect(main).toContainText(text.invitations);
    await expect(main).toContainText(text.otherAccounts);
  });
  for (const document of legalPages) {
    test(`${prefix}${document}.html also covers both web versions`, async ({ page }) => {
      await page.goto(`${prefix}${document}.html`);
      const main = page.getByRole('main');
      await expect(main).toContainText(text.sameAccounts);
      // Each web version is linked under its bare host name.
      for (const href of Object.values(webApps)) {
        await expect(main.getByRole('link', { name: new URL(href).host, exact: true }).first()).toHaveAttribute('href', href);
      }
    });

    for (const width of [320, 768, 1440]) {
      test(`${prefix}${document}.html is readable and accessible at ${width}px`, async ({ page, javaScriptEnabled }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`${prefix}${document}.html`);
        await waitForFonts(page);
        const dimensions = await page.evaluate(() => {
          return { content: window.document.documentElement.scrollWidth, viewport: window.innerWidth };
        });
        expect(dimensions.content).toBeLessThanOrEqual(dimensions.viewport);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
        if (javaScriptEnabled) {
          const results = await new AxeBuilder({ page }).analyze();
          expect(results.violations).toEqual([]);
        }
      });
    }

    test(`${prefix}${document}.html has working local links and printable content`, async ({ page, request }) => {
      await page.goto(`${prefix}${document}.html`);
      const links = await page.getByRole('main').getByRole('link').evaluateAll((anchors) => anchors.map((a) => (a as HTMLAnchorElement).href));
      const origin = new URL(page.url()).origin;
      const localPages = new Set(links.filter((link) => new URL(link).origin === origin).map((link) => link.split('#')[0]));
      for (const url of localPages) {
        const response = await request.get(url);
        expect(response.status(), url).toBe(200);
      }
      await page.emulateMedia({ media: 'print' });
      await expect(page.getByRole('banner')).toBeHidden();
      await expect(page.getByRole('contentinfo')).toBeHidden();
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
      await expect(page.locator('body')).toHaveCSS('background-color', 'rgb(255, 255, 255)');
      await expect(page.getByRole('heading', { level: 2 }).last()).toHaveCSS('color', 'rgb(0, 0, 0)');
      await expect(page.getByRole('main').getByRole('link', { name: 'support@bookme.md', exact: true }).first()).toBeVisible();
    });

    test(`reader can navigate every section of ${prefix}${document}.html`, async ({ page }) => {
      await page.goto(`${prefix}${document}.html`);
      const contents = page.getByRole('navigation', { name: text.contents, exact: true });
      await expect(contents).toBeVisible();
      const links = contents.getByRole('link');
      const headings = page.getByRole('main').getByRole('heading', { level: 2 });
      expect(await links.count()).toBeGreaterThan(0);
      await expect(links).toHaveCount(await headings.count());
      await links.first().focus();
      await expect(links.first()).toHaveCSS('outline-style', 'solid');
      await page.keyboard.press('Enter');
      await expect(headings.first()).toBeInViewport();
      for (const link of await links.all()) {
        const href = await link.getAttribute('href');
        expect(href).toMatch(/^#.+/);
        await link.click();
        const target = page.locator(href!);
        await expect(target).toHaveCount(1);
        await expect(target).toBeInViewport();
        await expect(target).toHaveText((await link.textContent())!);
      }
      // Every document was revised together, so each language shows the same date.
      await expect(page.getByRole('main')).toContainText(text.updated);
    });
  }
}
