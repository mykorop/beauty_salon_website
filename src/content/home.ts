import type { Locale } from '../i18n';

interface Feature {
  title: string;
  body: string;
}

interface AudienceContent {
  tag: string;
  title: string;
  intro: string;
  features: Feature[];
  download: string;
}

interface HomeContent {
  title: string;
  description: string;
  heading: string;
  intro: string;
  eyebrow: string;
  clientLink: string;
  businessLink: string;
  howLink: string;
  stepsTitle: string;
  stepsIntro: string;
  steps: Feature[];
  featuresTitle: string;
  featuresIntro: string;
  client: AudienceContent;
  business: AudienceContent;
  preview: {
    searchLabel: string;
    searchCaption: string;
    searchTitle: string;
    searchPlaceholder: string;
    location: string;
    services: [string, string, string];
    exampleSalon: string;
    exampleProfessional: string;
    salonType: string;
    professionalType: string;
    availability: string;
    calendarLabel: string;
    calendarCaption: string;
    calendarTitle: string;
    day: string;
    team: [string, string];
    appointment: string;
    available: string;
  };
  downloads: {
    title: string;
    intro: string;
    clientAudience: string;
    clientDescription: string;
    businessAudience: string;
    businessDescription: string;
    googlePlay: string;
    appStore: string;
  };
  contactTitle: string;
  contactIntro: string;
  name: string;
  email: string;
  message: string;
  send: string;
  sending: string;
  sent: string;
  error: string;
  formNote: string;
}

export const homeContent: Record<Locale, HomeContent> = {
  ro: {
    title: 'BookMe — Programări la salon în Moldova',
    description: 'BookMe este platforma gratuită de programări la servicii de înfrumusețare din Moldova. Găsește un salon sau organizează-ți afacerea cu BookMe Business.',
    heading: 'Programări la salon, în ritmul tău.',
    intro: 'Descoperă saloane și specialiști din Moldova, alege serviciul și găsește un loc în agendă. Ai o afacere? Organizează-ți programările, serviciile și echipa cu BookMe Business.',
    eyebrow: 'Platformă gratuită · Moldova',
    clientLink: 'Vreau o programare',
    businessLink: 'Îmi organizez afacerea',
    howLink: 'Vezi cum funcționează',
    stepsTitle: 'De la căutare la programare. În 3 pași.',
    stepsIntro: 'Următoarea vizită începe în aplicația BookMe pentru clienți.',
    steps: [
      { title: 'Găsește un salon', body: 'Caută saloane și specialiști independenți din Moldova. Explorează serviciile și profilurile lor.' },
      { title: 'Alege serviciul și specialistul', body: 'Consultă serviciile oferite și alege specialistul potrivit pentru vizita ta.' },
      { title: 'Alege ora și confirmă', body: 'Selectează o oră disponibilă și confirmă programarea. Revino în aplicație pentru a vedea detaliile vizitei.' },
    ],
    featuresTitle: 'De ambele părți ale programării.',
    featuresIntro: 'O aplicație pentru timpul tău. O aplicație pentru afacerea ta.',
    client: {
      tag: '01 / Pentru clienți',
      title: 'Un loc pentru rutina ta de îngrijire.',
      intro: 'De la prima căutare până la următoarea vizită, BookMe aduce opțiunile și programările tale în același loc.',
      features: [
        { title: 'Caută în Moldova', body: 'Descoperă saloane și specialiști independenți și explorează serviciile disponibile.' },
        { title: 'Alege ce ți se potrivește', body: 'Alege serviciul, specialistul și o oră disponibilă, direct în aplicație.' },
        { title: 'Gestionează-ți programările', body: 'Consultă vizitele viitoare, verifică detaliile și anulează o programare când planurile se schimbă.' },
      ],
      download: 'Descarcă BookMe pentru clienți',
    },
    business: {
      tag: '02 / Pentru afaceri',
      title: 'Agenda ta. Echipa ta. În același loc.',
      intro: 'Un salon cu o echipă sau un specialist independent: BookMe Business îți oferă un loc pentru organizarea activității de zi cu zi.',
      features: [
        { title: 'Calendarul de lucru', body: 'Vezi programările și gestionează orele de lucru și disponibilitatea din calendar.' },
        { title: 'Serviciile tale', body: 'Organizează lista de servicii, durata și prețurile, astfel încât clienții să știe ce pot alege.' },
        { title: 'În echipă sau independent', body: 'Gestionează specialiștii și programul echipei. Lucrezi pe cont propriu? Folosește aplicația pentru propria agendă și propriile servicii.' },
      ],
      download: 'Descarcă BookMe Business',
    },
    preview: {
      searchLabel: 'Exemplu ilustrativ de căutare în BookMe: servicii, un salon și un specialist independent fictivi.',
      searchCaption: 'Machetă ilustrativă · Exemple fictive, fără date personale.',
      searchTitle: 'Ce îți rezervi astăzi?',
      searchPlaceholder: 'Caută un serviciu sau un salon',
      location: 'Moldova',
      services: ['Tunsoare', 'Manichiură', 'Îngrijire'],
      exampleSalon: 'Salon demonstrativ',
      exampleProfessional: 'Specialist demonstrativ',
      salonType: 'Salon de înfrumusețare',
      professionalType: 'Specialist independent',
      availability: 'Exemplu de ore disponibile',
      calendarLabel: 'Exemplu ilustrativ de calendar BookMe Business: două coloane de specialiști, programări și ore libere fictive.',
      calendarCaption: 'Calendar ilustrativ · Programări și specialiști fictivi.',
      calendarTitle: 'O privire asupra zilei',
      day: 'Luni · Zi demonstrativă',
      team: ['Specialist A', 'Specialist B'],
      appointment: 'Programare',
      available: 'Timp disponibil',
    },
    downloads: {
      title: 'Următorul pas începe aici.',
      intro: 'Două aplicații. O platformă gratuită pentru programări la servicii de înfrumusețare în Moldova.',
      clientAudience: 'Pentru clienți',
      clientDescription: 'Găsește un salon sau un specialist independent și gestionează-ți programările în aplicația BookMe pentru clienți.',
      businessAudience: 'Pentru saloane și specialiști independenți',
      businessDescription: 'Gestionează calendarul, serviciile și echipa cu BookMe Business. În App Store, aceeași aplicație pentru afaceri se numește BookMe Salon.',
      googlePlay: 'Descarcă din Google Play',
      appStore: 'Descarcă din App Store',
    },
    contactTitle: 'Contactează-ne',
    contactIntro: 'Întrebări despre aplicație, propuneri de parteneriat sau orice altceva — ne-ar face plăcere să ne scrii.',
    name: 'Numele tău',
    email: 'Adresa de e-mail',
    message: 'Cum te putem ajuta?',
    send: 'Trimite mesajul',
    sending: 'Se trimite...',
    sent: 'Trimis!',
    error: 'Eroare — Încearcă din nou',
    formNote: 'Mesajul tău ajunge la echipa BookMe.',
  },
  en: {
    title: 'BookMe — Beauty appointments in Moldova',
    description: 'BookMe is the free platform for beauty appointments in Moldova. Find a salon or organize your business with BookMe Business.',
    heading: 'Beauty appointments, at your pace.',
    intro: 'Discover salons and beauty professionals in Moldova, choose a service and find a time that fits. Running a business? Organize your appointments, services and team with BookMe Business.',
    eyebrow: 'Free platform · Moldova',
    clientLink: 'Find my next appointment',
    businessLink: 'Organize my business',
    howLink: 'See how it works',
    stepsTitle: 'From search to appointment. In 3 steps.',
    stepsIntro: 'Your next visit starts in the BookMe client app.',
    steps: [
      { title: 'Find a salon', body: 'Search for salons and independent beauty professionals in Moldova. Explore their services and profiles.' },
      { title: 'Choose a service and professional', body: 'Browse the services on offer and choose the right professional for your visit.' },
      { title: 'Pick a time and confirm', body: 'Select an available time and confirm your appointment. Come back to the app to check your visit details.' },
    ],
    featuresTitle: 'Both sides of an appointment.',
    featuresIntro: 'One app for your time. One app for your business.',
    client: {
      tag: '01 / For clients',
      title: 'A place for your beauty routine.',
      intro: 'From the first search to your next visit, BookMe brings your options and appointments together.',
      features: [
        { title: 'Search in Moldova', body: 'Discover salons and independent beauty professionals and explore their available services.' },
        { title: 'Choose what suits you', body: 'Pick your service, professional and an available time, directly in the app.' },
        { title: 'Manage your appointments', body: 'See upcoming visits, check the details and cancel an appointment when your plans change.' },
      ],
      download: 'Download BookMe for clients',
    },
    business: {
      tag: '02 / For businesses',
      title: 'Your calendar. Your team. Together.',
      intro: 'Whether you run a salon with a team or work as an independent professional, BookMe Business gives you a place to organize your day.',
      features: [
        { title: 'Your working calendar', body: 'See appointments and manage working hours and availability in your calendar.' },
        { title: 'Your services', body: 'Organize your services, durations and prices so clients know what they can choose.' },
        { title: 'With a team or on your own', body: 'Manage professionals and team schedules. Working independently? Use the app for your own calendar and services.' },
      ],
      download: 'Download BookMe Business',
    },
    preview: {
      searchLabel: 'Illustrative BookMe search preview with services, a fictional salon and an independent professional.',
      searchCaption: 'Interface illustration · Fictional examples, no personal data.',
      searchTitle: 'What will you book today?',
      searchPlaceholder: 'Search for a service or salon',
      location: 'Moldova',
      services: ['Haircut', 'Manicure', 'Beauty care'],
      exampleSalon: 'Example salon',
      exampleProfessional: 'Example professional',
      salonType: 'Beauty salon',
      professionalType: 'Independent professional',
      availability: 'Example available times',
      calendarLabel: 'Illustrative BookMe Business calendar with two professional columns, fictional appointments and available times.',
      calendarCaption: 'Calendar illustration · Fictional appointments and professionals.',
      calendarTitle: 'Your day at a glance',
      day: 'Monday · Example day',
      team: ['Professional A', 'Professional B'],
      appointment: 'Appointment',
      available: 'Available time',
    },
    downloads: {
      title: 'Your next step starts here.',
      intro: 'Two apps. One free platform for beauty appointments in Moldova.',
      clientAudience: 'For clients',
      clientDescription: 'Find a salon or an independent beauty professional and manage your appointments in the BookMe client app.',
      businessAudience: 'For salons & independent professionals',
      businessDescription: 'Manage your calendar, services and team with BookMe Business. On the App Store, the same business app is called BookMe Salon.',
      googlePlay: 'Get it on Google Play',
      appStore: 'Download on the App Store',
    },
    contactTitle: 'Get in touch',
    contactIntro: "Questions about the app, partnership inquiries, or anything else — we'd love to hear from you.",
    name: 'Your name',
    email: 'Email address',
    message: 'How can we help?',
    send: 'Send message',
    sending: 'Sending...',
    sent: 'Sent!',
    error: 'Error — Try again',
    formNote: 'Your message goes to the BookMe team.',
  },
};
