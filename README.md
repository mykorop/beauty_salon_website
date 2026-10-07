# BookMe website

Static Astro website in Romanian (default), Russian (`/ru/`) and English (`/en/`). The mobile apps,
APIs, and backend are separate projects.

## Local development

Use the exact Node version in `.nvmrc` (24.20.0) and npm 11.19.0. Dependencies are
pinned in `package.json` and `package-lock.json`.

```sh
nvm install
nvm use
npm ci
npm run dev
```

## Build and checks

```sh
npx playwright install --with-deps chromium firefox webkit
npm run check
npm run build
npm test
npm run test:lighthouse
npm run package:site
```

`npm test` starts its own production preview server on `127.0.0.1:4329` and tests
the existing `dist/` build. Rebuild after source changes; do not leave another
server on that port. Run a single test file with `npm test -- tests/site.spec.ts`.
`tests/support/public-pages.ts` lists the public languages, the pages each language has
published, their URLs and both web-app addresses once for the test tables, Lighthouse and
demo captures, independently of `src/i18n.ts` and `src/content/apps.ts`.
Run `npm run test:seo` to rebuild and check SEO on the production HTML, including
metadata, language alternatives, sitemap, JSON-LD, links and HTTP 404 behavior.
CI runs type checking, the static build, Chromium/Firefox/WebKit tests (including
mobile viewports without JavaScript), axe, per-page gzip budgets and 72 Lighthouse
runs. Tests block non-local traffic and never submit a real contact message.
Reports, failure screenshots/traces and the static archive are retained as CI
artifacts. See [quality gates and manual acceptance](docs/quality-gates.md),
[recorded results](docs/quality-report.md), and the [deployment handoff](docs/deployment.md).
`tests/home.spec.ts` checks both audience journeys and the four exact store links,
plus visible content and overflow at 320, 768, and 1440 CSS pixels. It also scans
all three homepages with axe at those widths in the JavaScript-enabled browser projects.
`tests/web-app.spec.ts` checks the exact client web-app links in navigation, the
homepage introduction and the browser-access block, and the BookMe Business web-app
links in the business section, its download card and that block. It covers mouse and
keyboard activation, responsive layout and no-JavaScript access. External navigation
is intercepted locally.

To inspect the build manually, run `npm run preview`. Deploy the **contents of
`dist/`** at the domain root on a static host that serves directory `index.html`
files and direct `.html` URLs. Configure the host's error document as `404.html`
with HTTP status **404** for unknown URLs. No Node server or SPA fallback is needed
in production. See the [SEO guide and future production checks](docs/seo.md).

| Page | Romanian | Russian | English |
| --- | --- | --- | --- |
| Home | `/` or `/index.html` | `/ru/` or `/ru/index.html` | `/en/` or `/en/index.html` |
| Privacy | `/privacy.html` | `/ru/privacy.html` | `/en/privacy.html` |
| Terms | `/terms.html` | `/ru/terms.html` | `/en/terms.html` |
| Account deletion | `/delete-account.html` | `/ru/delete-account.html` | `/en/delete-account.html` |

Astro's [`build.format: 'preserve'`](https://docs.astro.build/en/reference/configuration-reference/#buildformat)
produces twelve indexable HTML pages plus `404.html` while retaining existing public URLs. There is
no browser-language detection or automatic language redirect. Romanian is the default language
and `x-default`. A page another language has not published yet is linked from that
language's pages in Romanian; its language switcher, `hreflang` and sitemap name only the
published versions, and the switcher leads to that language's homepage instead. Adding the
page to the language's entry in `src/i18n.ts` publishes it and moves those links to it.
Links written inside legal Markdown name their target path directly: a document links to the
Romanian page until its language publishes the target, and must then be changed to that
language's page. `tests/legal.spec.ts` fails while such a link points to the wrong language.

## Editing

Favicon sources, imagegen prompts, export instructions, and visual review sheets
are documented in [design/branding](design/branding/README.md). Icons and RO/RU/EN
social cards are committed static files in `public/`; normal builds need no image
service. `tests/branding.spec.ts` checks their production formats and dimensions,
the web manifest, and localized Open Graph/Twitter metadata on every indexable page.
The production origin is `siteOrigin` in `src/i18n.ts`, also used by `site` in
`astro.config.mjs`, canonical URLs, social URLs and the generated sitemap/robots files.

- `src/i18n.ts`: the locale list, language names, shared labels, production origin, the
  canonical public page map and the pages each language has published.
- `src/content/apps.ts`: app identities, store links and the two web addresses shared by
  navigation, downloads and JSON-LD: the client app at `https://app.bookme.md/` and
  BookMe Business at `https://business.bookme.md/`.
- `src/content/home.ts`: localized homepage copy.
- `src/content/booking-demo.ts`: fixed fictional booking data, RO/RU/EN demo copy and frame timing.
- `src/content/calendar-demo.ts`: Business period/search fixtures, RO/RU/EN copy and frame timing.
  The Russian screen labels come from the BookMe app's Russian dictionary.
- `src/content/legal/{ro,ru,en}/`: legal document bodies; shared metadata lives in `src/content/legal.ts`.
  The Russian deletion routes use the labels of the BookMe app's Russian dictionary.
- `src/layouts/`: shared document shell and legal layout.
- `src/components/`: shared navigation, footer, language links, homepage, and form.
- `src/styles/global.css`: graphite/orange palette, font stacks, responsive layout, and focus styles.
- `src/styles/cyrillic-fonts.css`: the Cyrillic-only faces of the bundled Cyrillic fonts.

Privacy and account-deletion wording in Romanian and English follows the
[data audit](.scratch/bookme-website-refresh/audit/README.md). The
[editorial evidence record](.scratch/bookme-website-refresh/audit/privacy-publication.md)
maps claims to evidence and records outstanding operational/legal confirmations.
The Russian privacy policy translates the current Romanian/English text section by
section; the same record compares it claim by claim and tracks its pending proofreading.
The terms follow the confirmed free-platform/provider model, client/business age
rules and mandatory user protections. Their [evidence record](.scratch/bookme-website-refresh/audit/terms-publication.md)
maps the Romanian and English text to product decisions and official legal guidance,
including the limits of the source check. The Russian terms translate the current
Romanian/English text section by section; the same record compares them claim by claim
and tracks their pending proofreading. The Russian account-deletion page translates the
current Romanian/English page section by section; the privacy record compares it claim by claim,
names the app labels its routes use and tracks its pending proofreading. `tests/terms.spec.ts`
covers the operator, provider, pricing, eligibility, protected rights and localized
privacy/deletion/support links.
The legal layout generates section navigation from Markdown headings and includes
print styles. `tests/legal.spec.ts` covers all nine legal URLs, rights
and email-request links, local links in the page's language (or Romanian until that
language publishes the target), keyboard section navigation, print output, 320/768/1440px
layouts, and axe checks. Content and navigation also run without JavaScript;
axe runs in the JavaScript-enabled projects. No deletion email is sent by tests.
The introductions of all three documents name the web versions at
`https://app.bookme.md/` and `https://business.bookme.md/`. The privacy policy also
describes their browser permissions, the features unavailable in a browser and their
browser storage; the deletion page describes the same routes in the browser and the
salon's precondition of ending every specialist's cooperation. `tests/legal.spec.ts`
and `tests/terms.spec.ts` check those claims, and `tests/cookie-consent.spec.ts` checks
that the cookie settings and policy apply the choice to all language versions of this
site and not to the web versions.
The homepage describes the free BookMe platform for Moldova, with separate paths
for clients and for salons or independent professionals. `DownloadApps.astro`
contains the exact client/business store URLs and explains the BookMe Salon name
on the App Store. Its browser-access block separates the two web versions by
audience: clients at `https://app.bookme.md/`, salons and professionals at
`https://business.bookme.md/`, because a business account does not work in the
client app. The business section and the BookMe Business card also open
`https://business.bookme.md/`; the navigation and introduction keep the client
web-app link. All are plain same-tab links without language parameters.
The hero's `ClientBookingDemo.astro` shows an eight-step fictional booking inside
the reusable `PhoneDemo.astro`. Its small local playback controller
handles pause, replay, visibility and reduced motion; a confirmed card and full
step description are available without JavaScript. App comparison screenshots,
capture commands and acceptance evidence are in [design/booking-demo](design/booking-demo/README.md).
`BusinessCalendarDemo.astro` reuses that phone and controller for a six-step
calendar scenario: Today, Week, Month, client search, card details and clearing
search. Its fixed appointment agrees with the client example, with no live sync.
The [combined phone report](design/calendar-demo/README.md) contains final-build
screenshots, app comparisons, quality results and pending manual acceptance.
All homepage content is rendered in static HTML, with no app framework runtime,
personal data or image downloads required by the illustrations.

DM Sans and Instrument Serif are bundled locally from the pinned Fontsource
packages with Latin and Latin Extended subsets, including Romanian diacritics.
Neither has Cyrillic glyphs, so Russian text falls back to two bundled companions:
Manrope (text, Cyrillic 400/500/600) and the variable Noto Serif Display (headings,
Cyrillic, set to a condensed width close to Instrument Serif). Their faces cover only
the Cyrillic range, so Romanian and English pages never download them.
`tests/fonts.spec.ts` checks both through the network and `document.fonts`. The
choice and RU/RO/EN screenshots are recorded in [design/typography](design/typography/README.md).
All four OFL license files are shipped in `public/licenses/`. No Google Fonts or other
font-service requests are made by the website.

The contact form retains the FormBold endpoint `https://formbold.com/s/oD7mJ`,
`POST`, and fields `name`, `email`, and `message`. With JavaScript it sends
`FormData` with `Accept: application/json`; without JavaScript it submits through
the native form action. Name and email are required; the message is optional.
JavaScript adds localized inline validation with focus on the first invalid field,
and a live region announces validation, sending, success, and failure. Sending
disables repeat submissions; only an HTTP success clears the form, and failures
preserve all fields for retry. A localized privacy link and `support@bookme.md`
are always available beside the form.

`Faq.astro` renders six localized questions using native `details`/`summary`, so
answers can be opened with the keyboard and without JavaScript. The FAQ links to
the account deletion instructions in the current language, or in Romanian until that
language publishes them.

`tests/faq.spec.ts` checks all three languages and keyboard interaction with and without
JavaScript. `tests/contact.spec.ts` intercepts FormBold to cover the exact POST
contract, validation, delayed responses, duplicate prevention, success, server
and network failures, retry, and sending another message. Axe scans cover the
expanded FAQ and the idle, invalid, pending, successful, and failed form states.
