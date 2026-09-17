# BookMe website

Static Astro website in Romanian (default) and English (`/en/`). The mobile apps,
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
npx playwright install chromium
npm run check
npm run build
npm test
```

`npm test` starts its own production preview server on `127.0.0.1:4329` and tests
the existing `dist/` build. Rebuild after source changes; do not leave another
server on that port. Run a single test file with `npm test -- tests/site.spec.ts`.
CI runs type checking, the static build, and the same browser smoke tests, including
a mobile browser with JavaScript disabled. Tests never submit a real contact message.
`tests/home.spec.ts` checks both audience journeys and the four exact store links,
plus visible content and overflow at 320, 768, and 1440 CSS pixels. It also scans
both homepages with axe at those widths in the JavaScript-enabled browser project.

To inspect the build manually, run `npm run preview`. Deploy the **contents of
`dist/`** at the domain root on a static host that serves directory `index.html`
files and direct `.html` URLs. No Node server or SPA fallback is needed in production.

| Page | Romanian | English |
| --- | --- | --- |
| Home | `/` or `/index.html` | `/en/` or `/en/index.html` |
| Privacy | `/privacy.html` | `/en/privacy.html` |
| Terms | `/terms.html` | `/en/terms.html` |
| Account deletion | `/delete-account.html` | `/en/delete-account.html` |

Astro's [`build.format: 'preserve'`](https://docs.astro.build/en/reference/configuration-reference/#buildformat)
produces exactly eight HTML files while retaining existing public URLs. There is
no browser-language detection or automatic language redirect.

## Editing

- `src/i18n.ts`: shared labels and page URL mapping.
- `src/content/home.ts`: localized homepage copy.
- `src/content/legal/{ro,en}/`: legal document bodies; shared metadata lives in
  `src/content/legal.ts`.
- `src/layouts/`: shared document shell and legal layout.
- `src/components/`: shared navigation, footer, language links, homepage, and form.
- `src/styles/global.css`: graphite/gold palette, responsive layout, and focus styles.

Legal wording and original update dates are carried over from the previous site.
The homepage describes the free BookMe platform for Moldova, with separate paths
for clients and for salons or independent professionals. `DownloadApps.astro`
contains the exact client/business store URLs and explains the BookMe Salon name
on the App Store. `AppPreview.astro` renders labeled fictional search/calendar
illustrations as responsive HTML/CSS, with localized accessible descriptions and
no personal data or image downloads. All homepage content is rendered in the
static HTML; it does not depend on JavaScript or an entrance animation.

DM Sans and Instrument Serif are bundled locally from the pinned Fontsource
packages with Latin and Latin Extended subsets, including Romanian diacritics.
Their OFL license files are shipped in `public/licenses/`. No Google Fonts requests
are made by the website.

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
the account deletion instructions in the current language.

`tests/faq.spec.ts` checks both languages and keyboard interaction with and without
JavaScript. `tests/contact.spec.ts` intercepts FormBold to cover the exact POST
contract, validation, delayed responses, duplicate prevention, success, server
and network failures, retry, and sending another message. Axe scans cover the
expanded FAQ and the idle, invalid, pending, successful, and failed form states.
