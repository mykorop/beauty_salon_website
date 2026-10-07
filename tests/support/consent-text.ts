import type { Locale, PublishedLocale } from './public-pages';

// Visible cookie notice and settings text that the consent tests look for in each language.
export const consentText = {
  ro: {
    banner: 'Cookies și confidențialitatea ta', intro: 'Analiza nu este conectată', noJs: /^Fără JavaScript/,
    understood: 'Am înțeles', details: 'Detalii', configure: 'Setări', allow: 'Permite analiza', deny: 'Doar necesare',
    settings: 'Setări cookie', acknowledged: 'Mesaj confirmat', save: 'Salvează alegerea', error: /^Nu am putut salva/,
    policyLink: /Cookies în/,
    // Where the choice applies, said the same way in the settings and the policy.
    scope: 'toate versiunile lingvistice ale acestui site', notShared: 'aplicațiilor mobile, contului tău sau altor subdomenii, inclusiv versiunilor web app.bookme.md și business.bookme.md',
  },
  ru: {
    banner: 'Файлы cookie и ваша конфиденциальность', intro: 'Аналитика не подключена', noJs: /^Без JavaScript/,
    understood: 'Понятно', details: 'Подробнее', configure: 'Настройки', allow: 'Разрешить аналитику', deny: 'Только необходимые',
    settings: 'Настройки cookie', acknowledged: 'Уведомление подтверждено', save: 'Сохранить выбор', error: /^Не удалось сохранить/,
    policyLink: /Файлы cookie в/,
    // Where the choice applies, said the same way in the settings and the policy.
    scope: 'во всех его языковых версиях', notShared: 'мобильным приложениям, вашему аккаунту или другим поддоменам, включая веб-версии app.bookme.md и business.bookme.md',
  },
  en: {
    banner: 'Cookies and your privacy', intro: 'Analytics is not connected', noJs: /^Without JavaScript/,
    understood: 'Understood', details: 'Details', configure: 'Settings', allow: 'Allow analytics', deny: 'Necessary only',
    settings: 'Cookie settings', acknowledged: 'Notice acknowledged', save: 'Save choice', error: /^We could not save/,
    policyLink: /Cookies in/,
    // Where the choice applies, said the same way in the settings and the policy.
    scope: 'all language versions of this site', notShared: 'the mobile apps, your account or other subdomains, including the web versions app.bookme.md and business.bookme.md',
  },
} satisfies Record<Locale, Record<string, string | RegExp>>;

// The cookie section heading of each published privacy policy, where cookie links lead.
export const policyHeading = { ro: 'Cookies și tehnologii similare', ru: 'Файлы cookie и аналогичные технологии', en: 'Cookies and similar technologies' } satisfies Record<PublishedLocale<'privacy'>, string>;
