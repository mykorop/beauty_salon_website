import type { Locale } from './public-pages';

// Visible cookie notice and settings text that the consent tests look for in each language.
export const consentText = {
  ro: {
    banner: 'Cookies și confidențialitatea ta', intro: 'Analiza nu este conectată', noJs: /^Fără JavaScript/,
    understood: 'Am înțeles', details: 'Detalii', configure: 'Setări', allow: 'Permite analiza', deny: 'Doar necesare',
    settings: 'Setări cookie', acknowledged: 'Mesaj confirmat', save: 'Salvează alegerea', error: /^Nu am putut salva/,
    policyLink: /Cookies în/, policyHeading: 'Cookies și tehnologii similare',
  },
  en: {
    banner: 'Cookies and your privacy', intro: 'Analytics is not connected', noJs: /^Without JavaScript/,
    understood: 'Understood', details: 'Details', configure: 'Settings', allow: 'Allow analytics', deny: 'Necessary only',
    settings: 'Cookie settings', acknowledged: 'Notice acknowledged', save: 'Save choice', error: /^We could not save/,
    policyLink: /Cookies in/, policyHeading: 'Cookies and similar technologies',
  },
} satisfies Record<Locale, Record<string, string | RegExp>>;
