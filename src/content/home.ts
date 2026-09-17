import type { Locale } from '../i18n';

interface HomeContent {
  title: string;
  description: string;
  heading: string;
  intro: string;
  download: string;
  howLink: string;
  stepsTitle: string;
  stepsIntro: string;
  steps: { title: string; body: string }[];
  featuresTitle: string;
  featuresIntro: string;
  features: { icon: string; title: string; body: string }[];
  businessTag: string;
  businessTitle: string;
  businessIntro: string;
  benefits: string[];
  contactTitle: string;
  contactIntro: string;
  reviews: string;
  services: string[];
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
  en: {
    title: 'BookMe — Beauty Salon Booking App',
    description: 'BookMe lets you instantly book appointments at beauty salons near you. Browse masters, check real-time availability, and confirm your booking in seconds.',
    heading: 'Book beauty appointments, instantly.',
    intro: 'BookMe connects you with top beauty salons and masters near you. Browse, pick, and confirm your appointment in seconds — no calls, no waiting.',
    download: 'Download on the App Store',
    howLink: 'See how it works',
    stepsTitle: 'Book an appointment in 3 steps',
    stepsIntro: 'No account required for browsing. Booking takes under a minute.',
    steps: [
      { title: 'Find a salon', body: 'Browse beauty salons in your area. Filter by service type, rating, or distance.' },
      { title: 'Choose your master', body: 'View master profiles, specializations, portfolios, and real customer reviews.' },
      { title: 'Pick a time', body: 'See live availability and confirm your appointment instantly. Get a reminder before your visit.' },
    ],
    featuresTitle: 'Everything you need for your beauty routine',
    featuresIntro: 'BookMe is built around simplicity — so you spend less time scheduling and more time enjoying.',
    features: [
      { icon: '📍', title: 'Salons near you', body: 'Discover vetted beauty salons in your neighborhood, sorted by proximity and popularity.' },
      { icon: '👤', title: 'Choose your master', body: 'Every master has a profile with photos of their work, services offered, and client ratings.' },
      { icon: '📅', title: 'Real-time availability', body: "Slots update instantly — no double-bookings, no surprises. What you see is what's free." },
      { icon: '🔔', title: 'Smart reminders', body: 'Automatic push notifications remind you before your appointment so you never miss a visit.' },
      { icon: '⭐', title: 'Ratings & reviews', body: 'Leave feedback after every visit. Honest reviews help the community find the best masters.' },
      { icon: '💬', title: 'No phone calls needed', body: 'Everything happens in the app. Browse, book, and manage appointments without a single call.' },
    ],
    businessTag: 'For businesses',
    businessTitle: 'Grow your salon with BookMe',
    businessIntro: 'Join hundreds of beauty salons already using BookMe to fill their schedules. Our platform connects you with clients who are actively looking to book — no marketing budget required.',
    benefits: [
      "Manage your team's availability in one place",
      'Reduce no-shows with automatic client reminders',
      'Build your online reputation through verified reviews',
      'Get discovered by new clients in your area',
    ],
    contactTitle: 'Get in touch',
    contactIntro: "Questions about the app, partnership inquiries, or anything else — we'd love to hear from you.",
    reviews: '4.9 · 132 reviews',
    services: ['Haircut', 'Color', 'Manicure', 'Pedicure'],
    name: 'Your name',
    email: 'Email address',
    message: 'How can we help?',
    send: 'Send message',
    sending: 'Sending...',
    sent: 'Sent!',
    error: 'Error — Try again',
    formNote: 'We respond within one business day. No spam, ever.',
  },
  ro: {
    title: 'BookMe — Programări la saloane de înfrumusețare',
    description: 'BookMe îți permite să te programezi instant la saloanele de înfrumusețare din apropiere. Descoperă specialiști, verifică disponibilitatea în timp real și confirmă programarea în câteva secunde.',
    heading: 'Programează-te la salon, instant.',
    intro: 'BookMe te conectează cu saloane de înfrumusețare și specialiști de top din apropiere. Descoperă, alege și confirmă programarea în câteva secunde — fără apeluri, fără așteptare.',
    download: 'Descarcă din App Store',
    howLink: 'Vezi cum funcționează',
    stepsTitle: 'Programează-te în 3 pași',
    stepsIntro: 'Nu ai nevoie de cont pentru a explora. Programarea durează mai puțin de un minut.',
    steps: [
      { title: 'Găsește un salon', body: 'Descoperă saloanele de înfrumusețare din zona ta. Filtrează după tipul serviciului, evaluare sau distanță.' },
      { title: 'Alege specialistul', body: 'Vezi profilurile specialiștilor, specializările, portofoliile și recenziile clienților reali.' },
      { title: 'Alege ora', body: 'Verifică disponibilitatea în timp real și confirmă programarea instant. Primește un memento înainte de vizită.' },
    ],
    featuresTitle: 'Tot ce ai nevoie pentru rutina ta de îngrijire',
    featuresIntro: 'BookMe pune simplitatea pe primul loc — ca să petreci mai puțin timp planificând și mai mult timp bucurându-te de rezultat.',
    features: [
      { icon: '📍', title: 'Saloane în apropiere', body: 'Descoperă saloane de înfrumusețare verificate din cartierul tău, ordonate după apropiere și popularitate.' },
      { icon: '👤', title: 'Alege specialistul', body: 'Fiecare specialist are un profil cu fotografii ale lucrărilor, servicii oferite și evaluări de la clienți.' },
      { icon: '📅', title: 'Disponibilitate în timp real', body: 'Orele disponibile se actualizează instant — fără programări suprapuse, fără surprize. Ceea ce vezi este disponibil.' },
      { icon: '🔔', title: 'Mementouri inteligente', body: 'Notificările push automate îți amintesc de programare, ca să nu ratezi nicio vizită.' },
      { icon: '⭐', title: 'Evaluări și recenzii', body: 'Lasă o recenzie după fiecare vizită. Recenziile sincere ajută comunitatea să găsească cei mai buni specialiști.' },
      { icon: '💬', title: 'Fără apeluri telefonice', body: 'Totul se întâmplă în aplicație. Explorează, rezervă și gestionează programările fără niciun apel.' },
    ],
    businessTag: 'Pentru afaceri',
    businessTitle: 'Dezvoltă-ți salonul cu BookMe',
    businessIntro: 'Alătură-te sutelor de saloane de înfrumusețare care folosesc deja BookMe pentru a-și completa agenda. Platforma noastră te conectează cu clienți care caută activ o programare — fără buget de marketing.',
    benefits: [
      'Gestionează disponibilitatea echipei într-un singur loc',
      'Redu absențele cu mementouri automate pentru clienți',
      'Construiește-ți reputația online prin recenzii verificate',
      'Fii descoperit de clienți noi din zona ta',
    ],
    contactTitle: 'Contactează-ne',
    contactIntro: 'Întrebări despre aplicație, propuneri de parteneriat sau orice altceva — ne-ar face plăcere să ne scrii.',
    reviews: '4,9 · 132 de recenzii',
    services: ['Tunsoare', 'Vopsire', 'Manichiură', 'Pedichiură'],
    name: 'Numele tău',
    email: 'Adresa de e-mail',
    message: 'Cum te putem ajuta?',
    send: 'Trimite mesajul',
    sending: 'Se trimite...',
    sent: 'Trimis!',
    error: 'Eroare — Încearcă din nou',
    formNote: 'Răspundem în termen de o zi lucrătoare. Fără spam, niciodată.',
  },
};
