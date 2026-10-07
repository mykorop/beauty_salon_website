import { bookingDemoContent, bookingExample } from './booking-demo';
import type { Locale } from '../i18n';

// Today is fixed at 15 October 2026 in Europe/Chisinau, as in the app references.
export const calendarAppointments = [
  { ...bookingExample, service: 'manicure', day: 'today', period: 'today' },
  { client: 'Daria Demo', master: 'Mara Luca', service: 'haircut', day: 'tomorrow', period: 'week', date: '2026-10-16', time: '10:00', durationMinutes: 30, price: '200 MDL' },
  { client: 'Irina Demo', master: 'Mara Luca', service: 'pedicure', day: 'later', period: 'month', date: '2026-10-22', time: '11:00', durationMinutes: 45, price: '250 MDL' },
] as const;

export const calendarFrames = [
  { name: 'today', period: 'today', search: '', duration: 2600 },
  { name: 'week', period: 'week', search: '', duration: 2800 },
  { name: 'month', period: 'month', search: '', duration: 3200 },
  { name: 'search', period: 'month', search: bookingExample.client, duration: 2600 },
  { name: 'details', period: 'month', search: bookingExample.client, duration: 3800 },
  { name: 'cleared', period: 'month', search: '', duration: 0 },
] as const;

interface CalendarDemoText {
  label: string; description: string; caption: string; account: string; stepsTitle: string;
  controls: typeof bookingDemoContent.en.controls; units: typeof bookingDemoContent.en.units;
  steps: readonly string[];
  periods: Record<'today' | 'week' | 'month', string>;
  titles: Record<'today' | 'week' | 'month', string>;
  dates: Record<'today' | 'tomorrow' | 'later', string>;
  services: Record<'manicure' | 'haircut' | 'pedicure', string>;
  search: string; confirmed: string; calendar: string; servicesLabel: string; masters: string; settings: string;
}

export const calendarDemoContent = {
  ro: {
    label: 'Demonstrație de calendar Business',
    description: 'Exemplu ilustrativ BookMe Business cu date fictive. Calendarul arată o programare astăzi, două în săptămână și trei în lună. Căutarea Ana Demo găsește Manichiură cu Mara Luca, pe 15 octombrie 2026 la 14:30, ora Chișinăului: o oră, 300 MDL, Confirmată. După ștergerea căutării reapar toate cele trei programări.',
    caption: 'Date fictive pentru un salon sau un specialist independent. Telefoanele arată același exemplu, fără sincronizare în timp real.',
    account: 'Studio Luma · 15 octombrie 2026 · ora Chișinăului',
    stepsTitle: bookingDemoContent.ro.stepsTitle, controls: bookingDemoContent.ro.controls, units: bookingDemoContent.ro.units,
    steps: [
      'Astăzi, 15 octombrie 2026: programarea Anei Demo la 14:30.',
      'Treci la Săptămână: apare și Daria Demo, pe 16 octombrie.',
      'Treci la Lună: apare și Irina Demo, pe 22 octombrie.',
      'Caută Ana Demo: rămâne doar programarea ei.',
      'Verifică pe card: Manichiură, Mara Luca, 14:30, o oră, 300 MDL, Confirmată.',
      'Șterge căutarea: toate cele trei programări ale lunii reapar.',
    ],
    periods: { today: 'Astăzi', week: 'Săptămână', month: 'Lună' },
    titles: { today: 'Astăzi', week: 'Săptămâna aceasta', month: 'Luna aceasta' },
    dates: { today: 'Astăzi', tomorrow: 'Mâine', later: 'joi, 22 oct.' },
    services: { manicure: bookingDemoContent.ro.service, haircut: 'Tunsoare', pedicure: 'Pedichiură' },
    search: 'Client, specialist, serviciu', confirmed: 'Confirmată', calendar: 'Calendar', servicesLabel: 'Servicii', masters: 'Specialiști', settings: 'Setări',
  },
  ru: {
    label: 'Демонстрация календаря Business',
    description: 'Иллюстративный пример BookMe Business с вымышленными данными. Календарь показывает одну запись на сегодня, две на этой неделе и три в этом месяце. Поиск Ana Demo находит «Маникюр» у Mara Luca 15 октября 2026 года в 14:30 по времени Кишинёва: один час, 300 MDL, «Подтверждено». После очистки поиска снова видны все три записи.',
    caption: 'Вымышленные данные для салона или независимого мастера. Телефоны показывают один и тот же пример без синхронизации в реальном времени.',
    account: 'Studio Luma · 15 октября 2026 · время Кишинёва',
    stepsTitle: bookingDemoContent.ru.stepsTitle, controls: bookingDemoContent.ru.controls, units: bookingDemoContent.ru.units,
    steps: [
      'Сегодня, 15 октября 2026: запись Ana Demo на 14:30.',
      'Переключитесь на «Неделя»: появляется Daria Demo, 16 октября.',
      'Переключитесь на «Месяц»: появляется Irina Demo, 22 октября.',
      'Найдите Ana Demo: остаётся только её запись.',
      'Проверьте карточку: «Маникюр», Mara Luca, 14:30, один час, 300 MDL, «Подтверждено».',
      'Очистите поиск: снова видны все три записи месяца.',
    ],
    // Screen labels from the BookMe app's Russian dictionary (calendar.*, admin.tabs.*, appointment.searchPlaceholderCompact, booking.status.*).
    periods: { today: 'Сегодня', week: 'Неделя', month: 'Месяц' },
    titles: { today: 'Сегодня', week: 'Эта неделя', month: 'Этот месяц' },
    dates: { today: 'Сегодня', tomorrow: 'Завтра', later: 'четверг, 22 окт.' },
    services: { manicure: bookingDemoContent.ru.service, haircut: 'Стрижка', pedicure: 'Педикюр' },
    search: 'Клиент, мастер, услуга', confirmed: 'Подтверждено', calendar: 'Календарь', servicesLabel: 'Услуги', masters: 'Мастера', settings: 'Настройки',
  },
  en: {
    label: 'Business calendar demo',
    description: 'Illustrative BookMe Business example with fictional data. The calendar shows one appointment today, two this week and three this month. Searching for Ana Demo finds Manicure with Mara Luca on 15 October 2026 at 14:30, Chișinău time: one hour, 300 MDL, Confirmed. Clearing search restores all three appointments.',
    caption: 'Fictional data for a salon or an independent specialist. The phones show the same example; they are not live-synced.',
    account: 'Studio Luma · 15 October 2026 · Chișinău time',
    stepsTitle: bookingDemoContent.en.stepsTitle, controls: bookingDemoContent.en.controls, units: bookingDemoContent.en.units,
    steps: [
      'Today, 15 October 2026: Ana Demo’s appointment at 14:30.',
      'Switch to Week: Daria Demo on 16 October joins the list.',
      'Switch to Month: Irina Demo on 22 October joins the list.',
      'Search for Ana Demo: only her appointment remains.',
      'Read the card: Manicure, Mara Luca, 14:30, one hour, 300 MDL, Confirmed.',
      'Clear search: all three appointments for the month return.',
    ],
    periods: { today: 'Today', week: 'Week', month: 'Month' },
    titles: { today: 'Today', week: 'This week', month: 'This month' },
    dates: { today: 'Today', tomorrow: 'Tomorrow', later: 'Thursday, Oct 22' },
    services: { manicure: bookingDemoContent.en.service, haircut: 'Haircut', pedicure: 'Pedicure' },
    search: 'Client, master, service', confirmed: 'Confirmed', calendar: 'Calendar', servicesLabel: 'Services', masters: 'Masters', settings: 'Settings',
  },
} satisfies Record<Locale, CalendarDemoText>;
