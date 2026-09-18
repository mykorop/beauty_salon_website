import type { Locale } from '../i18n';

// Fixed fictional fixture, deliberately independent of today's date or availability.
export const bookingExample = {
  salon: 'Studio Luma', master: 'Mara Luca', client: 'Ana Demo',
  address: 'Strada Exemplu 15, Chișinău', city: 'Chișinău',
  price: '300 MDL', duration: '1 h', time: '14:30',
  date: '2026-10-15', timezone: 'Europe/Chisinau',
  slots: ['14:30', '16:00', '17:30'],
};

interface BookingDemoText {
  label: string; description: string; caption: string; account: string; stepsTitle: string;
  controls: { pause: string; resume: string; replay: string; next: string; finished: string };
  steps: readonly string[];
  service: string; selectService: string; chooseService: string;
  selectMaster: string; chooseMaster: string; selectDateTime: string; chooseDate: string;
  selectDate: string; selectTime: string; book: string; cancel: string; noReviews: string;
  awaitingPhoto: string; month: string; date: string; weekdays: readonly string[];
  success: string; confirmed: string; bookings: string; upcoming: string; history: string;
  reschedule: string; search: string; profile: string;
}

export const bookingDemoContent = {
  ro: {
    label: 'Demonstrație de programare',
    description: 'Exemplu ilustrativ BookMe cu date fictive. Ana Demo este deja conectată: caută o manichiură la Studio Luma, alege serviciul și specialista Mara Luca, apoi 15 octombrie 2026 la 14:30, ora Chișinăului. Confirmă o programare de o oră, la 300 MDL, și o vede în programările viitoare.',
    caption: 'Date fictive. Acest exemplu nu creează o programare și nu arată disponibilitatea reală.',
    account: 'Ana Demo · deja conectată', stepsTitle: 'Toți pașii, pe scurt',
    controls: { pause: 'Pauză', resume: 'Continuă', replay: 'Repetă', next: 'Pasul următor', finished: 'Încheiat' },
    steps: [
      'Caută o manichiură și găsește Studio Luma în Chișinău.',
      'Deschide formularul de programare din rezultatul căutării.',
      'Alege Manichiură: o oră, 300 MDL.',
      'Alege specialista Mara Luca.',
      'Alege 15 octombrie 2026 în calendar.',
      'Alege ora 14:30, ora Chișinăului, dintre orele demonstrative.',
      'Verifică serviciul, specialista, data și ora, apoi confirmă.',
      'Programare confirmată. Cardul apare în programările viitoare.',
    ],
    service: 'Manichiură', selectService: 'Alege serviciul', chooseService: 'Alege serviciul',
    selectMaster: 'Alege specialistul', chooseMaster: 'Alege specialistul',
    selectDateTime: 'Alege data și ora', chooseDate: 'Alege data', selectDate: 'Alege data', selectTime: 'Alege ora',
    book: 'Programează-te', cancel: 'Anulează', noReviews: 'Încă nu există recenzii', awaitingPhoto: 'Fotografia urmează',
    month: 'Octombrie 2026', date: '15 octombrie 2026', weekdays: ['L', 'Ma', 'Mi', 'J', 'V', 'S', 'D'],
    success: 'Programare confirmată cu succes!', confirmed: 'Confirmată', bookings: 'Programări', upcoming: 'Viitoare', history: 'Istoric',
    reschedule: 'Reprogramează', search: 'Căutare', profile: 'Profil',
  },
  en: {
    label: 'Booking demo',
    description: 'Illustrative BookMe example with fictional data. Ana Demo is already signed in: she finds a manicure at Studio Luma, selects the service and specialist Mara Luca, then 15 October 2026 at 14:30, Chișinău time. She confirms a one-hour appointment for 300 MDL and sees it in her upcoming bookings.',
    caption: 'Fictional demo data. This example creates no booking and shows no real availability.',
    account: 'Ana Demo · already signed in', stepsTitle: 'Read all the steps',
    controls: { pause: 'Pause', resume: 'Resume', replay: 'Replay', next: 'Next step', finished: 'Finished' },
    steps: [
      'Search for a manicure and find Studio Luma in Chișinău.',
      'Open the booking form from the search result.',
      'Choose Manicure: one hour, 300 MDL.',
      'Select specialist Mara Luca.',
      'Choose 15 October 2026 in the calendar.',
      'Pick 14:30, Chișinău time, from the demonstration times.',
      'Check the service, specialist, date and time, then confirm.',
      'Booking confirmed. The card appears in upcoming bookings.',
    ],
    service: 'Manicure', selectService: 'Select Service', chooseService: 'Choose a service',
    selectMaster: 'Select Master', chooseMaster: 'Choose Master',
    selectDateTime: 'Select Date & Time', chooseDate: 'Choose Date', selectDate: 'Select date', selectTime: 'Select time',
    book: 'Book Now', cancel: 'Cancel', noReviews: 'No reviews yet', awaitingPhoto: 'Awaiting photo',
    month: 'October 2026', date: '15 October 2026', weekdays: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    success: 'Booking confirmed successfully!', confirmed: 'Confirmed', bookings: 'Bookings', upcoming: 'Upcoming', history: 'History',
    reschedule: 'Reschedule', search: 'Search', profile: 'Profile',
  },
} satisfies Record<Locale, BookingDemoText>;

export const bookingFrames = [
  { name: 'search', duration: 2400 },
  { name: 'booking', duration: 2200 },
  { name: 'service', duration: 2200 },
  { name: 'master', duration: 2400 },
  { name: 'calendar', duration: 2600 },
  { name: 'time', duration: 2200 },
  { name: 'confirm', duration: 2600 },
  { name: 'success', duration: 0 },
] as const;
