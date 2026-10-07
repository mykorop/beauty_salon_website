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

interface BusinessContent extends AudienceContent {
  webLink: string;
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
  business: BusinessContent;
  downloads: {
    title: string;
    intro: string;
    browserTitle: string;
    browserDescription: string;
    clientAudience: string;
    clientDescription: string;
    businessAudience: string;
    businessDescription: string;
    googlePlay: string;
    appStore: string;
    openInBrowser: string;
  };
  faq: {
    title: string;
    intro: string;
    items: { question: string; answer: string }[];
    deletionLink: string;
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
  formHint: string;
  invalid: string;
  nameError: string;
  emailError: string;
  formNote: string;
  supportAlternative: string;
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
      webLink: 'Deschide BookMe Business în browser',
    },
    downloads: {
      title: 'Următorul pas începe aici.',
      intro: 'Două aplicații. O platformă gratuită pentru programări la servicii de înfrumusețare în Moldova.',
      browserTitle: 'Folosește BookMe în browser',
      browserDescription: 'Ambele aplicații funcționează și în browser, pe telefon sau computer. Deschide versiunea pentru contul tău: contul de afaceri funcționează în BookMe Business, nu în aplicația pentru clienți. Pentru instalare, alege mai jos aplicația potrivită.',
      clientAudience: 'Pentru clienți',
      clientDescription: 'Găsește un salon sau un specialist independent și gestionează-ți programările în aplicația BookMe pentru clienți.',
      businessAudience: 'Pentru saloane și specialiști independenți',
      businessDescription: 'Gestionează calendarul, serviciile și echipa cu BookMe Business. În App Store, aceeași aplicație pentru afaceri se numește BookMe Salon.',
      googlePlay: 'Descarcă din Google Play',
      appStore: 'Descarcă din App Store',
      openInBrowser: 'Deschide în browser',
    },
    faq: {
      title: 'Întrebări frecvente',
      intro: 'Despre aplicații, programări și contul tău.',
      items: [
        { question: 'Ce aplicație să aleg?', answer: 'Alege BookMe pentru a găsi servicii și a face programări. Dacă ai un salon sau lucrezi independent, folosește BookMe Business pentru calendar, servicii și echipă. Poți instala aplicația sau o poți deschide în browser, la business.bookme.md. Contul de afaceri funcționează în BookMe Business, nu în aplicația pentru clienți. În App Store, aplicația pentru afaceri se numește BookMe Salon.' },
        { question: 'Unde pot folosi BookMe?', answer: 'BookMe este o platformă pentru Moldova. În aplicație poți explora saloanele, specialiștii și serviciile disponibile, apoi alege o oră pentru programare.' },
        { question: 'BookMe este gratuit?', answer: 'Da. Platforma BookMe este gratuită pentru clienți, saloane și specialiști independenți. Serviciile rezervate se plătesc separat, direct prestatorului.' },
        { question: 'Cum plătesc serviciile rezervate?', answer: 'Plătești serviciile direct salonului sau specialistului care le oferă. Verifică prețul și modalitatea de plată cu prestatorul. BookMe este platforma de programări; serviciul este oferit de salon sau specialist.' },
        { question: 'Am nevoie de un cont?', answer: 'Un cont îți permite să faci și să gestionezi programările în aplicație. Păstrează datele de conectare confidențiale. Dacă ai nevoie de ajutor cu accesul la cont, scrie-ne la support@bookme.md.' },
        { question: 'Cum îmi șterg contul și datele?', answer: 'Poți solicita ștergerea din aplicație sau ne poți scrie la support@bookme.md dacă nu mai ai acces. Consultă pașii pentru contul tău și informațiile despre datele care se șterg sau pot fi păstrate.' },
      ],
      deletionLink: 'Vezi pașii pentru ștergerea contului',
    },
    contactTitle: 'Contactează-ne',
    contactIntro: 'Întrebări despre aplicație, propuneri de parteneriat sau orice altceva — ne-ar face plăcere să ne scrii.',
    name: 'Numele tău',
    email: 'Adresa de e-mail',
    message: 'Cum te putem ajuta?',
    send: 'Trimite mesajul',
    sending: 'Se trimite mesajul…',
    sent: 'Mesajul tău a fost trimis. Îți mulțumim că ne-ai scris!',
    error: 'Nu am putut confirma trimiterea mesajului. Datele introduse au fost păstrate. Încearcă din nou sau scrie la support@bookme.md.',
    formHint: 'Numele și adresa de e-mail sunt obligatorii. Mesajul este opțional.',
    invalid: 'Verifică numele și adresa de e-mail înainte de a trimite.',
    nameError: 'Introdu numele tău.',
    emailError: 'Introdu o adresă de e-mail validă.',
    formNote: 'Numele, adresa de e-mail și mesajul sunt transmise prin FormBold echipei BookMe pentru a răspunde solicitării tale.',
    supportAlternative: 'Preferi e-mailul sau formularul nu funcționează? Scrie-ne la',
  },
  ru: {
    title: 'BookMe — запись в салоны красоты в Молдове',
    description: 'BookMe — бесплатная платформа для записи на услуги красоты в Молдове. Найдите салон или управляйте своим бизнесом в BookMe Business.',
    // Non-breaking spaces keep the short prepositions and the dash with their words.
    heading: 'Запись в\u00a0салон\u00a0— в\u00a0вашем ритме.',
    intro: 'Находите салоны и мастеров в Молдове, выбирайте услугу и удобное время. У вас свой бизнес? Ведите записи, услуги и команду в BookMe Business.',
    eyebrow: 'Бесплатная платформа · Молдова',
    clientLink: 'Хочу записаться',
    businessLink: 'Управлять своим бизнесом',
    howLink: 'Посмотреть, как это работает',
    stepsTitle: 'От поиска до записи. За 3 шага.',
    stepsIntro: 'Ваш следующий визит начинается в клиентском приложении BookMe.',
    steps: [
      { title: 'Найдите салон', body: 'Ищите салоны и независимых мастеров в Молдове. Изучайте их услуги и профили.' },
      { title: 'Выберите услугу и мастера', body: 'Посмотрите, какие услуги предлагаются, и выберите подходящего мастера для визита.' },
      { title: 'Выберите время и подтвердите', body: 'Выберите свободное время и подтвердите запись. Детали визита можно посмотреть в приложении.' },
    ],
    featuresTitle: 'По обе стороны записи.',
    featuresIntro: 'Одно приложение — для вашего времени. Другое — для вашего бизнеса.',
    client: {
      tag: '01 / Для клиентов',
      title: 'Ваш уход за собой — всегда под рукой.',
      intro: 'От первого поиска до следующего визита BookMe собирает варианты и ваши записи в одном месте.',
      features: [
        { title: 'Поиск по Молдове', body: 'Находите салоны и независимых мастеров и изучайте доступные услуги.' },
        { title: 'Выбирайте то, что подходит', body: 'Выберите услугу, мастера и свободное время прямо в приложении.' },
        { title: 'Управляйте записями', body: 'Смотрите предстоящие визиты, проверяйте детали и отменяйте запись, если планы изменились.' },
      ],
      download: 'Скачать BookMe для клиентов',
    },
    business: {
      tag: '02 / Для бизнеса',
      title: 'Ваш календарь. Ваша команда. В одном месте.',
      intro: 'Салон с командой или независимый мастер: BookMe Business даёт одно место для организации рабочего дня.',
      features: [
        { title: 'Рабочий календарь', body: 'Смотрите записи, настраивайте рабочие часы и свободное время в календаре.' },
        { title: 'Ваши услуги', body: 'Ведите список услуг, их длительность и цены, чтобы клиенты знали, что можно выбрать.' },
        { title: 'В команде или самостоятельно', body: 'Управляйте мастерами и графиком команды. Работаете самостоятельно? Ведите в приложении свой календарь и свои услуги.' },
      ],
      download: 'Скачать BookMe Business',
      webLink: 'Открыть BookMe Business в браузере',
    },
    downloads: {
      title: 'Следующий шаг начинается здесь.',
      intro: 'Два приложения. Одна бесплатная платформа для записи на услуги красоты в Молдове.',
      browserTitle: 'Пользуйтесь BookMe в браузере',
      browserDescription: 'Оба приложения работают и в браузере, на телефоне или компьютере. Откройте версию для своего аккаунта: бизнес-аккаунт работает в BookMe Business, а не в клиентском приложении. Чтобы установить приложение, выберите подходящее ниже.',
      clientAudience: 'Для клиентов',
      clientDescription: 'Находите салон или независимого мастера и управляйте записями в клиентском приложении BookMe.',
      businessAudience: 'Для салонов и независимых мастеров',
      businessDescription: 'Управляйте календарём, услугами и командой в BookMe Business. В App Store это же бизнес-приложение называется BookMe Salon.',
      googlePlay: 'Доступно в Google Play',
      appStore: 'Загрузите в App Store',
      openInBrowser: 'Открыть в браузере',
    },
    faq: {
      title: 'Частые вопросы',
      intro: 'О приложениях, записях и вашем аккаунте.',
      items: [
        { question: 'Какое приложение выбрать?', answer: 'Выберите BookMe, чтобы находить услуги и записываться. Если у вас салон или вы работаете самостоятельно, используйте BookMe Business для календаря, услуг и команды. Его можно установить или открыть в браузере по адресу business.bookme.md. Бизнес-аккаунт работает в BookMe Business, а не в клиентском приложении. В App Store бизнес-приложение называется BookMe Salon.' },
        { question: 'Где можно пользоваться BookMe?', answer: 'BookMe — платформа для Молдовы. В приложении можно найти доступные салоны, мастеров и услуги, а затем выбрать время для записи.' },
        { question: 'BookMe бесплатный?', answer: 'Да. Платформа BookMe бесплатна для клиентов, салонов и независимых мастеров. Забронированные услуги оплачиваются отдельно, напрямую исполнителю.' },
        { question: 'Как оплатить забронированные услуги?', answer: 'Услуги оплачиваются напрямую салону или мастеру, который их оказывает. Уточните цену и способ оплаты у исполнителя. BookMe — платформа для записи; услугу оказывает салон или мастер.' },
        { question: 'Нужен ли аккаунт?', answer: 'Аккаунт позволяет записываться и управлять записями в приложении. Храните данные для входа в тайне. Если нужна помощь с доступом к аккаунту, напишите нам на support@bookme.md.' },
        { question: 'Как удалить аккаунт и данные?', answer: 'Удаление можно запросить в приложении или, если доступа больше нет, написать нам на support@bookme.md. Посмотрите шаги для вашего аккаунта и узнайте, какие данные удаляются, а какие могут сохраняться.' },
      ],
      deletionLink: 'Посмотреть шаги удаления аккаунта',
    },
    contactTitle: 'Свяжитесь с нами',
    contactIntro: 'Вопросы о приложении, предложения о партнёрстве или что-то ещё — будем рады вашему сообщению.',
    name: 'Ваше имя',
    email: 'Адрес электронной почты',
    message: 'Чем мы можем помочь?',
    send: 'Отправить сообщение',
    sending: 'Отправляем сообщение…',
    sent: 'Ваше сообщение отправлено. Спасибо, что написали нам!',
    error: 'Не удалось подтвердить отправку сообщения. Введённые данные сохранены. Попробуйте ещё раз или напишите на support@bookme.md.',
    formHint: 'Имя и адрес электронной почты обязательны. Сообщение — по желанию.',
    invalid: 'Проверьте имя и адрес электронной почты перед отправкой.',
    nameError: 'Введите ваше имя.',
    emailError: 'Введите действительный адрес электронной почты.',
    formNote: 'Имя, адрес электронной почты и сообщение передаются через FormBold команде BookMe, чтобы ответить на ваш запрос.',
    supportAlternative: 'Предпочитаете почту или форма не работает? Напишите нам на',
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
      webLink: 'Open BookMe Business in your browser',
    },
    downloads: {
      title: 'Your next step starts here.',
      intro: 'Two apps. One free platform for beauty appointments in Moldova.',
      browserTitle: 'Use BookMe in your browser',
      browserDescription: 'Both apps also work in your browser, on your phone or computer. Open the one for your account: business accounts work in BookMe Business, not in the client app. To install an app, choose the one that fits you below.',
      clientAudience: 'For clients',
      clientDescription: 'Find a salon or an independent beauty professional and manage your appointments in the BookMe client app.',
      businessAudience: 'For salons & independent professionals',
      businessDescription: 'Manage your calendar, services and team with BookMe Business. On the App Store, the same business app is called BookMe Salon.',
      googlePlay: 'Get it on Google Play',
      appStore: 'Download on the App Store',
      openInBrowser: 'Open in browser',
    },
    faq: {
      title: 'Frequently asked questions',
      intro: 'About the apps, appointments and your account.',
      items: [
        { question: 'Which app should I choose?', answer: 'Choose BookMe to find services and book appointments. If you run a salon or work independently, use BookMe Business for your calendar, services and team. You can install it or open it in your browser at business.bookme.md. Your business account works in BookMe Business, not in the client app. On the App Store, the business app is called BookMe Salon.' },
        { question: 'Where can I use BookMe?', answer: 'BookMe is a platform for Moldova. Explore available salons, professionals and services in the app, then choose a time for your appointment.' },
        { question: 'Is BookMe free?', answer: 'Yes. The BookMe platform is free for clients, salons and independent professionals. Booked services are paid for separately, directly to the provider.' },
        { question: 'How do I pay for booked services?', answer: 'Pay for services directly to the salon or professional providing them. Check the price and payment method with your provider. BookMe is the booking platform; the salon or professional provides the service.' },
        { question: 'Do I need an account?', answer: 'An account lets you book and manage appointments in the app. Keep your sign-in details confidential. If you need help accessing your account, email us at support@bookme.md.' },
        { question: 'How do I delete my account and data?', answer: 'You can request deletion in the app or email support@bookme.md if you no longer have access. Check the steps for your account and the information about data that is deleted or may be retained.' },
      ],
      deletionLink: 'See the account deletion steps',
    },
    contactTitle: 'Get in touch',
    contactIntro: "Questions about the app, partnership inquiries, or anything else — we'd love to hear from you.",
    name: 'Your name',
    email: 'Email address',
    message: 'How can we help?',
    send: 'Send message',
    sending: 'Sending your message…',
    sent: 'Your message has been sent. Thank you for contacting BookMe!',
    error: 'We could not confirm your message was sent. Your text has been kept. Try again or email support@bookme.md.',
    formHint: 'Name and email address are required. The message is optional.',
    invalid: 'Check your name and email address before sending.',
    nameError: 'Enter your name.',
    emailError: 'Enter a valid email address.',
    formNote: 'Your name, email address and message are sent through FormBold to the BookMe team to respond to your request.',
    supportAlternative: 'Prefer email or having trouble with the form? Write to',
  },
};
