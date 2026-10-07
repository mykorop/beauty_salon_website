import { expect, test, waitForFonts } from './fixtures';
import AxeBuilder from '@axe-core/playwright';
import { legalPages, linkPath, pageLocales, pages, webApps, type AnyLegalLocale, type PublishedLocale } from './support/public-pages';

const documents = {
  ro: { contents: 'Cuprins', updated: 'Ultima actualizare: 7 octombrie 2026', sameAccounts: 'cu aceleași conturi și date' },
  ru: { contents: 'Содержание', updated: 'Последнее обновление: 7 октября 2026 г.', sameAccounts: 'с теми же аккаунтами и данными' },
  en: { contents: 'Contents', updated: 'Last updated: October 7, 2026', sameAccounts: 'with the same accounts and data' },
} satisfies Record<AnyLegalLocale, Record<string, string>>;

const privacy = {
  ro: {
    deletionInstructions: 'Instrucțiuni de ștergere a contului', deletionPage: 'pagina de ștergere',
    browserPermissions: 'browserul cere accesul la locație în BookMe pentru clienți și la cameră în ambele aplicații',
    browserSettings: 'acest acces este controlat din setările site-ului în browser',
    webUnavailable: 'Alegerea unui contact din agendă, căutarea vocală, notificările push și salvarea imaginii QR în galerie nu sunt disponibile acolo',
    webAlternatives: 'Introdu manual datele clientului, tastează căutarea și urmărește noutățile în lista de notificări din aplicație',
    webStorageLocation: 'în stocarea browserului pentru propriul domeniu', webStorageContents: 'starea autentificării și setări precum limba, filtrele, orașul selectat și preferințele configurării inițiale',
    webStoragePurpose: 'este necesară pentru funcționarea lor și nu este folosită pentru analiză',
    clearSiteData: 'Ștergerea datelor site-ului unei versiuni web din browser te deconectează, dar nu șterge contul tău sau informațiile deținute de BookMe ori de furnizorii săi',
    law: 'Legea nr. 195/2024 privind protecția datelor cu caracter personal', guidance: 'ghidul oficial CNPDCP privind Legea nr. 195/2024',
    support: '30 de zile', backups: '90 de zile', consent: '180 de zile', clientAge: 'cel puțin 16 ani', businessAge: 'cel puțin 18 ani',
  },
  ru: {
    deletionInstructions: 'Инструкции по удалению аккаунта', deletionPage: 'странице удаления',
    browserPermissions: 'браузер запрашивает доступ к местоположению в BookMe для клиентов и к камере в обоих приложениях',
    browserSettings: 'этим доступом управляют настройки сайта в браузере',
    webUnavailable: 'Выбор контакта из адресной книги, голосовой поиск, push-уведомления и сохранение QR-изображения в галерею там недоступны',
    webAlternatives: 'Вводите данные клиента вручную, набирайте запрос текстом и следите за новостями в списке уведомлений в приложении',
    webStorageLocation: 'в хранилище браузера своего домена', webStorageContents: 'состояние входа и параметры, такие как язык, фильтры, выбранный город и предпочтения при первом запуске',
    webStoragePurpose: 'нужно для их работы и не используется для аналитики',
    clearSiteData: 'Очистка данных сайта веб-версии в браузере выполняет выход из аккаунта, но не удаляет ни аккаунт, ни информацию, которая хранится у BookMe или его поставщиков',
    law: 'Закон № 195/2024 о защите персональных данных', guidance: 'официальное разъяснение CNPDCP о Законе № 195/2024',
    support: '30 дней', backups: '90 дней', consent: '180 дней', clientAge: 'не младше 16 лет', businessAge: 'не младше 18 лет',
  },
  en: {
    deletionInstructions: 'Account deletion instructions', deletionPage: 'deletion page',
    browserPermissions: 'the browser asks for location in BookMe for clients and for the camera in both apps',
    browserSettings: "your browser's site settings control that access",
    webUnavailable: 'Choosing a contact from the address book, voice search, push notifications and saving a QR image to the gallery are not available there',
    webAlternatives: 'Enter client details manually, type your search and follow updates in the in-app inbox',
    webStorageLocation: 'in the browser storage of their own domain', webStorageContents: 'sign-in state and settings such as language, filters, the selected city and onboarding preferences',
    webStoragePurpose: 'is needed for them to work and is not used for analytics',
    clearSiteData: "Clearing a web version's site data in your browser signs you out but does not delete your account or the information held by BookMe or its providers",
    law: 'Law No. 195/2024 on personal data protection', guidance: "CNPDCP's official guidance on Law No. 195/2024",
    support: '30 days', backups: '90 days', consent: '180 days', clientAge: '16 or older', businessAge: '18 or older',
  },
} satisfies Record<PublishedLocale<'privacy'>, Record<string, string>>;

const deletion = {
  ro: {
    request: 'Solicită ștergerea prin e-mail', subject: 'Cerere de ștergere a contului BookMe',
    clientPath: 'Profil → Șterge contul', salonPath: 'Setările administratorului → Șterge contul', specialistPath: 'Setările specialistului → Șterge contul',
    thirtyDays: '30 de zile', ninetyDays: '90 de zile',
    webRoutes: 'Aceleași trasee funcționează și în versiunile web app.bookme.md și business.bookme.md',
    notDeletion: 'Dezinstalarea aplicației, deconectarea, închiderea filei din browser sau ștergerea datelor browserului nu șterge contul',
    salonRefused: 'Ștergerea este refuzată cât timp în salon lucrează cel puțin un specialist în afară de proprietar',
    salonList: 'după confirmare, aplicația afișează lista acestor specialiști: încheie colaborarea cu fiecare',
    invitations: 'Invitațiile neacceptate nu blochează ștergerea și sunt revocate automat',
    otherAccounts: 'Ștergerea contului unui salon nu șterge conturile celorlalți specialiști',
  },
  en: {
    request: 'Request deletion by email', subject: 'BookMe account deletion request',
    clientPath: 'Profile → Delete account', salonPath: 'Administrator settings → Delete account', specialistPath: 'Specialist settings → Delete account',
    thirtyDays: '30 days', ninetyDays: '90 days',
    webRoutes: 'The same routes work in the web versions at app.bookme.md and business.bookme.md',
    notDeletion: 'Uninstalling the app, signing out, closing the browser tab or clearing browser data does not delete your account',
    salonRefused: 'Deletion is refused while at least one specialist other than the owner still works at the salon',
    salonList: 'after you confirm, the app lists those specialists: end the cooperation with each of them',
    invitations: 'Invitations that have not been accepted do not block deletion and are revoked automatically',
    otherAccounts: "Removing a salon account does not delete other specialists' accounts",
  },
} satisfies Record<PublishedLocale<'delete-account'>, Record<string, string>>;

for (const locale of pageLocales('privacy')) {
  const path = linkPath(locale, 'privacy');
  const text = privacy[locale];
  test(`privacy reader can identify the operator and exercise rights in ${locale}`, async ({ page }) => {
    await page.goto(path);
    const main = page.getByRole('main');
    await expect(main).toContainText('BOOKME HUB, SRL');
    await expect(main).toContainText('str. Glinka 4, ap./of. 10, Bălți, Moldova');
    await expect(main).toContainText('BookMe Business');
    await expect(main).toContainText('BookMe Salon');
    await expect(main).toContainText(text.law);
    await expect(main.getByRole('link', { name: text.guidance, exact: true })).toHaveAttribute('href', 'https://datepersonale.md/wp-content/uploads/2026/04/GDPR.pdf');
    await expect(main.getByRole('link', { name: 'support@bookme.md', exact: true }).first()).toHaveAttribute('href', 'mailto:support@bookme.md');
    await expect(main.getByRole('link', { name: 'centru@datepersonale.md', exact: true })).toHaveAttribute('href', 'mailto:centru@datepersonale.md');
    await expect(main).toContainText('Centrul Național pentru Protecția Datelor cu Caracter Personal (CNPDCP)');
    await expect(main).toContainText('+373 22 820 801');
    await expect(main).toContainText('str. Serghei Lazo 48, MD-2004, Chișinău, Republica Moldova');
    // Deletion instructions open in this language once it has published them, in the default language until then.
    const deletionPage = await main.getByRole('link', { name: text.deletionPage, exact: true }).getAttribute('href');
    expect(new URL(deletionPage!, page.url()).pathname).toBe(linkPath(locale, 'delete-account'));
    await main.getByRole('link', { name: text.deletionInstructions, exact: true }).click();
    await expect(page).toHaveURL(linkPath(locale, 'delete-account'));
  });
  test(`privacy reader finds the same periods and age rules in ${locale}`, async ({ page }) => {
    await page.goto(path);
    const main = page.getByRole('main');
    for (const claim of [text.support, text.backups, text.consent, text.clientAge, text.businessAge]) await expect(main).toContainText(claim);
    await expect(main).toContainText('bookme.cookie-consent');
  });
  test(`privacy reader learns which permissions the browser asks for in the web versions in ${locale}`, async ({ page }) => {
    await page.goto(path);
    const main = page.getByRole('main');
    await expect(main).toContainText(text.browserPermissions);
    await expect(main).toContainText(text.browserSettings);
    await expect(main).toContainText(text.webUnavailable);
    await expect(main).toContainText(text.webAlternatives);
  });
  test(`privacy reader learns what the web versions keep in the browser in ${locale}`, async ({ page }) => {
    await page.goto(path);
    const main = page.getByRole('main');
    await expect(main).toContainText(text.webStorageLocation);
    await expect(main).toContainText(text.webStorageContents);
    await expect(main).toContainText(text.webStoragePurpose);
    await expect(main).toContainText(text.clearSiteData);
  });
}

for (const locale of pageLocales('delete-account')) {
  const path = linkPath(locale, 'delete-account');
  const text = deletion[locale];
  test(`visitor can request deletion without an account at ${path}`, async ({ page }) => {
    await page.goto(path);
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
    await page.goto(path);
    const main = page.getByRole('main');
    await expect(main).toContainText(text.salonRefused);
    await expect(main).toContainText(text.salonList);
    await expect(main).toContainText(text.invitations);
    await expect(main).toContainText(text.otherAccounts);
  });
}

for (const document of legalPages) {
  for (const locale of pageLocales(document)) {
    const path = linkPath(locale, document);
    const text = documents[locale];
    test(`${path} also covers both web versions`, async ({ page }) => {
      await page.goto(path);
      const main = page.getByRole('main');
      await expect(main).toContainText(text.sameAccounts);
      // Each web version is linked under its bare host name.
      for (const href of Object.values(webApps)) {
        await expect(main.getByRole('link', { name: new URL(href).host, exact: true }).first()).toHaveAttribute('href', href);
      }
    });

    for (const width of [320, 768, 1440]) {
      test(`${path} is readable and accessible at ${width}px`, async ({ page, javaScriptEnabled }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(path);
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

    test(`${path} has working local links in its language and printable content`, async ({ page, request }) => {
      await page.goto(path);
      const links = await page.getByRole('main').getByRole('link').evaluateAll((anchors) => anchors.map((a) => (a as HTMLAnchorElement).href));
      const origin = new URL(page.url()).origin;
      const localPages = new Set(links.filter((link) => new URL(link).origin === origin).map((link) => link.split('#')[0]));
      // A page this language has published opens in it; any other page opens in the default language.
      const ownPages = pages.map((name) => origin + linkPath(locale, name));
      for (const url of localPages) {
        expect(ownPages, url).toContain(url);
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

    test(`reader can navigate every section of ${path}`, async ({ page }) => {
      await page.goto(path);
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
