# Favicon and social previews

The selected imagegen master and existing app-icon reference live here alongside
the exact [generation prompts](prompts.md). Production assets live in `public/`;
the source images and review sheets are not deployed.

Regenerate the exports locally after installing the pinned project dependencies
and Playwright Chromium:

```sh
node scripts/generate-branding.mjs
npm run check
npm run build
npm test -- tests/branding.spec.ts
```

The script uses the saved master, browser canvas for icon downsampling, and
HTML/CSS with the bundled DM Sans / Instrument Serif fonts for precise bilingual
card typography. It needs no image-generation service or network requests.
Changing the master requires a separate imagegen run; regeneration does not
replace the master. The generated assets are committed, so ordinary site builds
do not run this script or require a browser.

| Export | Size | Purpose |
| --- | --- | --- |
| `/favicon.ico` | 16, 32, 48 px PNG frames | Stable browser/bookmark fallback |
| `/favicon-96x96.png` | 96 × 96 | PNG favicon |
| `/apple-touch-icon.png` | 180 × 180 | Apple home screen |
| `/web-app-manifest-192x192.png` | 192 × 192 | Manifest icon |
| `/web-app-manifest-512x512.png` | 512 × 512 | Manifest icon |
| `/social/bookme-ro.png` | 1200 × 630 | Romanian social card |
| `/social/bookme-en.png` | 1200 × 630 | English social card |

`/site.webmanifest` uses the language-neutral BookMe name and `display: browser`:
it supplies home-screen artwork for this informational website. The eight pages
share one set of icon links, localized per-page titles/descriptions, RO/EN image
URLs, and translated image descriptions. Absolute social URLs use the production
origin configured in `astro.config.mjs`.

Visual checks on 2026-09-17:

- [Favicon sheet](favicon-size-check.png): rendered at 1×, with the actual
  16/32/48 px exports against light and dark tab backgrounds. The pin silhouette
  and B remain distinguishable at 16 px; the two B counters are clearer at 32/48.
- [Social sheet](social-size-check.png): both cards at 600 × 315, a typical preview
  size. Headlines, brand name and Romanian diacritics remain readable. Copy comes
  from the current homepage; it includes no statistics or new product promises.

Production checks cover the HTTP status and MIME type, PNG signatures/dimensions,
all three ICO frames, parsed manifest contents, and unique localized metadata and
icon links on all eight pages, including the JavaScript-disabled browser project.
The repository ships no robots exclusion for these assets, service worker,
offline behavior or advertising integration. Deployment must serve the committed
files with the same MIME types and allow crawlers to fetch the image URLs. Remote
social-platform caches are outside these local production-build checks.
