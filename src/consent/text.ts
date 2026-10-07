import { linkLocale, pageUrl, type Locale, type PageLocale } from '../i18n';

export const consentText = {
  en: {
    title: 'Cookies and your privacy', settings: 'Cookie settings', details: 'Details',
    intro: 'Analytics is not connected. We only store your acknowledgement on this site for 180 days, using localStorage, not a cookie.',
    enabledIntro: 'Optional analytics helps us understand use of this website. It stays off unless you allow it. We store your choice for 180 days.',
    understood: 'Understood', allow: 'Allow analytics', deny: 'Necessary only', configure: 'Settings',
    necessary: 'Necessary storage', necessaryDescription: 'BookMe uses localStorage (bookme.cookie-consent) to remember your acknowledgement or explicit choice for 180 days from your action. It contains versions, your choice and dates, without a visitor identifier. This product retention period is not a legal requirement. Reading it does not extend it; expired records are removed on your next visit or check.',
    analytics: 'Analytics', disconnected: 'Analytics is not connected. Acknowledging this notice does not allow a future provider.',
    scope: 'Your choice applies to this browser and site origin, across all language versions of this site. It is not shared with the mobile apps, your account or other subdomains, including the web versions app.bookme.md and business.bookme.md. Clearing browser data resets it.',
    withdrawal: 'Save with analytics off to withdraw consent. This stops new collection and removes known, accessible analytics storage. It cannot recall requests already sent, erase provider-held data or remove inaccessible third-party or HttpOnly cookies. The website and contact form remain available.',
    policy: 'Cookies in the Privacy Policy', save: 'Save choice', close: 'Close without saving',
    noJs: 'Without JavaScript, analytics stays off and no choice is stored. You can still use this site and the contact form.',
    error: 'We could not save or read your choice. Analytics is off on this page. You may need to choose again after navigating.',
    dismiss: 'Dismiss for this page', pending: 'No saved choice', acknowledged: 'Notice acknowledged',
    allowed: 'Analytics allowed', denied: 'Necessary only', current: 'Saved choice:',
    provider: 'Provider', purpose: 'Purpose', data: 'Data and technologies', retention: 'Retention',
  },
  ro: {
    title: 'Cookies și confidențialitatea ta', settings: 'Setări cookie', details: 'Detalii',
    intro: 'Analiza nu este conectată. Păstrăm doar confirmarea ta pe acest site timp de 180 de zile, în localStorage, nu într-un cookie.',
    enabledIntro: 'Analiza opțională ne ajută să înțelegem utilizarea acestui site. Rămâne oprită până o permiți. Păstrăm alegerea ta timp de 180 de zile.',
    understood: 'Am înțeles', allow: 'Permite analiza', deny: 'Doar necesare', configure: 'Setări',
    necessary: 'Stocare necesară', necessaryDescription: 'BookMe folosește localStorage (bookme.cookie-consent) pentru a păstra confirmarea sau alegerea ta explicită timp de 180 de zile de la acțiune. Înregistrarea conține versiuni, alegerea și datele calendaristice, fără un identificator de vizitator. Acest termen este o decizie de produs, nu o cerință legală. Citirea nu îl prelungește; înregistrările expirate sunt șterse la următoarea vizită sau verificare.',
    analytics: 'Analiză', disconnected: 'Analiza nu este conectată. Confirmarea acestui mesaj nu permite un furnizor viitor.',
    scope: 'Alegerea se aplică acestui browser și originii site-ului, pe toate versiunile lingvistice ale acestui site. Nu se transmite aplicațiilor mobile, contului tău sau altor subdomenii, inclusiv versiunilor web app.bookme.md și business.bookme.md. Ștergerea datelor browserului o resetează.',
    withdrawal: 'Salvează cu analiza oprită pentru a retrage consimțământul. Astfel oprim colectarea nouă și ștergem stocarea de analiză cunoscută și accesibilă. Nu putem retrage cererile deja trimise, șterge datele deținute de furnizor sau cookies terțe inaccesibile ori HttpOnly. Site-ul și formularul de contact rămân disponibile.',
    policy: 'Cookies în politica de confidențialitate', save: 'Salvează alegerea', close: 'Închide fără salvare',
    noJs: 'Fără JavaScript, analiza rămâne oprită și nicio alegere nu este stocată. Poți folosi în continuare site-ul și formularul de contact.',
    error: 'Nu am putut salva sau citi alegerea ta. Analiza este oprită pe această pagină. Poate fi necesar să alegi din nou după navigare.',
    dismiss: 'Ascunde pe această pagină', pending: 'Nicio alegere salvată', acknowledged: 'Mesaj confirmat',
    allowed: 'Analiză permisă', denied: 'Doar necesare', current: 'Alegere salvată:',
    provider: 'Furnizor', purpose: 'Scop', data: 'Date și tehnologii', retention: 'Durată de păstrare',
  },
  ru: {
    title: 'Файлы cookie и ваша конфиденциальность', settings: 'Настройки cookie', details: 'Подробнее',
    intro: 'Аналитика не подключена. Сайт хранит только ваше подтверждение: 180 дней в localStorage, а не в cookie.',
    enabledIntro: 'Необязательная аналитика помогает нам понять, как используется этот сайт. Она остаётся выключенной, пока вы её не разрешите. Мы храним ваш выбор 180 дней.',
    understood: 'Понятно', allow: 'Разрешить аналитику', deny: 'Только необходимые', configure: 'Настройки',
    necessary: 'Необходимое хранилище', necessaryDescription: 'BookMe использует localStorage (bookme.cookie-consent), чтобы помнить ваше подтверждение или явный выбор в течение 180 дней с момента действия. Запись содержит версии, ваш выбор и даты, без идентификатора посетителя. Этот срок — решение продукта, а не требование закона. Чтение записи его не продлевает; просроченные записи удаляются при следующем посещении или проверке.',
    analytics: 'Аналитика', disconnected: 'Аналитика не подключена. Подтверждение этого уведомления не даёт разрешения будущему поставщику.',
    scope: 'Выбор действует в этом браузере и для источника (origin) этого сайта, во всех его языковых версиях. Он не передаётся мобильным приложениям, вашему аккаунту или другим поддоменам, включая веб-версии app.bookme.md и business.bookme.md. Очистка данных браузера сбрасывает его.',
    withdrawal: 'Чтобы отозвать согласие, сохраните выбор с выключенной аналитикой. Так мы прекращаем новый сбор и удаляем известное и доступное хранилище аналитики. Мы не можем отозвать уже отправленные запросы, удалить данные, хранящиеся у поставщика, или недоступные сторонние либо HttpOnly cookie. Сайт и контактная форма остаются доступными.',
    policy: 'Файлы cookie в политике конфиденциальности', save: 'Сохранить выбор', close: 'Закрыть без сохранения',
    noJs: 'Без JavaScript аналитика остаётся выключенной, и выбор не сохраняется. Вы по-прежнему можете пользоваться сайтом и контактной формой.',
    error: 'Не удалось сохранить или прочитать ваш выбор. Аналитика на этой странице выключена. После перехода на другую страницу может понадобиться выбрать снова.',
    dismiss: 'Скрыть на этой странице', pending: 'Выбор не сохранён', acknowledged: 'Уведомление подтверждено',
    allowed: 'Аналитика разрешена', denied: 'Только необходимые', current: 'Сохранённый выбор:',
    provider: 'Поставщик', purpose: 'Цель', data: 'Данные и технологии', retention: 'Срок хранения',
  },
} satisfies Record<Locale, Record<string, string>>;

// The cookie section of each published privacy policy.
const policySection = { en: 'cookies-and-similar-technologies', ro: 'cookies-și-tehnologii-similare' } satisfies Record<PageLocale<'privacy'>, string>;

// The policy's cookie section that cookie links lead to from a page in this language, in the default language until the policy is translated.
export function cookiePolicyUrl(locale: Locale): string {
  return `${pageUrl(locale, 'privacy')}#${policySection[linkLocale(locale, 'privacy')]}`;
}
