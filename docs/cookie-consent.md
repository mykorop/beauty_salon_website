# Website consent inventory and verification

Scope: the static website, issue [01](../.scratch/website-cookie-consent/issues/01-cookie-banner-and-analytics-consent.md). Audit date: 18 September 2026. The source baseline was `e7a56b6b38a669138cce1ffae1a6d31dfd8e0f16`.

## Technology inventory

| Technology / provider | Purpose and data | Storage / lifetime | Stop or cleanup |
| --- | --- | --- | --- |
| Astro HTML, local CSS, local DM Sans / Instrument Serif and their Cyrillic companions Manrope / Noto Serif Display, BookMe contact and phone-demo scripts | Render the site and provide user interactions. Asset requests to the current host expose ordinary HTTP request metadata to that host. | No application cookies or persistent identifiers in the audited build. Browser HTTP caching depends on hosting headers. | No optional analytics to stop. |
| BookMe consent controller | Remember acknowledgement or explicit analytics choice. Record fields: `schemaVersion`, `noticeVersion`, `choice`, `actedAt`, `expiresAt`. No visitor ID, IP, email or page history. | One origin-local localStorage key, `bookme.cookie-consent`. 180 days from an explicit action; reads do not renew. Expiry is checked on visits, lifecycle events, before collection and by a timer in an open document. No automatic deletion while the browser is away. | Browser-data clearing resets it; invalid or expired records are removed at the next check. It is necessary choice storage, not a cookie or a server consent ledger. |
| FormBold (`https://formbold.com/s/oD7mJ`) | Name, email and optional message, sent only by explicit form submission. | The website adds no FormBold SDK, cookies or browser storage. Provider-side handling is separate support processing; no retention period is inferred from this code audit. | Refusal/withdrawal of analytics does not disable the form. Tests intercept every submission. |
| App Store, Google Play, app.bookme.md, business.bookme.md, mailto and CNPDCP links | User-directed navigation only; no embed, tracking pixel or preconnect. | No website storage for these links. Destination handling is outside this origin. | Nothing loaded until navigation. |
| Optional website analytics | No real provider configured. No advertising, marketing, replay, tag manager or other optional categories. | None in the normal production build. | Disabled. Acknowledgement never enables a later provider. |

The audit examined `src/`, `public/`, Astro configuration, CI and deployment documentation, built HTML/JavaScript and browser requests/storage. The automated per-page inventory of every indexable page is saved under `reports/consent-inventory/`: requests, executable/metadata script URLs, localStorage, sessionStorage, cookies and connection hints/iframes. Every fresh production-build page is required to make only same-origin resource requests and start with empty browser storage. The artifact test also scans emitted JavaScript and HTML for test-provider markers.

## Hosting boundary and publication condition

No hosting/CDN control-plane configuration or access is present in this repository. `docs/deployment.md` describes an operator-managed static upload; CI packages files without deployment. This audit is of the production **build served locally**, not an audit of the live production host. Host-injected scripts, response cookies, edge analytics, logs and tag injection remain **unverified**. The controller cannot block code injected independently by the host.

Before publishing the “no analytics connected” message, the operator must inspect actual production responses, network activity, cookies/storage and hosting/CDN settings. Any independently injected optional analytics must be removed/disabled or integrated behind this controller. An uncontrolled injection is an unresolved publication condition, not something this change claims to block. No deployment, DNS/CDN changes or hosting settings were changed here.

## Provider contract

`src/consent/provider.ts` deliberately exports `null`. A future real provider needs a separate reviewed inventory, purpose/provider/data/technology/retention disclosures in every site language, policy changes and a consent-confirmation process. `createAdapter()` and module imports must be inert. The controller validates the full disclosure for every language in the locale list (RO, RU and EN) before offering opt-in; incomplete configuration behaves as disconnected.

`start({ signal, mayCollect })` is the sole entry for collection. The adapter must check `mayCollect()` and the abort signal before every SDK request, event, optional write and asynchronous continuation. No preconnect, cookieless ping or event queue may exist before consent. `stop()` must cancel supported pending work and listeners; `clear()` must remove only inventoried, accessible provider data using the original cookie path/domain parameters. Cleanup failures must not prevent other accessible entries from being cleared. Browser abort cannot recall requests already sent, and the UI never promises deletion at a provider or of third-party/HttpOnly cookies.

The controller keeps one active permission generation, aborts it before persistence on withdrawal, and rejects stale async continuations. Storage failures block collection on the current document until a new explicit action can be saved and read back. An unsuccessful withdrawal also tries to remove the previous stored grant. If the browser forbids both writing and removal, the UI explicitly makes no persistence promise for the next page.

The record's `noticeVersion` combines the notice date, provider ID and provider revision. Increment the notice or provider revision whenever notices, purposes, data, technologies or retention change. Old/incompatible records never grant permission. No choice is shared with a subdomain, account or app. Clarifying where the choice applies is not such a change when purpose, technology, provider, retention and origin stay the same: on 7 October 2026 the scope text began naming all language versions of this site and excluding the web versions `app.bookme.md` and `business.bookme.md`, and `noticeVersion` stayed `2026-09-18`, so existing records remain valid.

## Isolated browser fixtures

`npm run test:consent` builds `dist-consent-test/` with a build-time Vite alias to `tests/support/analytics-provider.ts`. It uses the same controller/adapter contract. Its SDK-resource fetch and synthetic POSTs use `https://consent-test.invalid/`, intercepted by Playwright. It creates only `bookme.test-analytics` localStorage, `bookme.test-session` sessionStorage, and a host-only `bookme_test_analytics` cookie (`Path=/`, `SameSite=Lax`, maximum 180 days). Withdrawal clears these exact entries. Nothing reaches a real analytics service.

`npm run test:consent-incomplete` builds the fixture with a missing retention disclosure. Both test builds remain separate from `dist/`; normal builds cannot select a provider through a URL, browser storage or runtime flag. `package:site` always packages `dist/`. CI runs all three suites and retains separate reports without relaxing budgets or existing accessibility/Lighthouse gates.

## Legal sources and limits

The existing policy context was checked against [CNPDCP's explanation of Law 195/2024](https://datepersonale.md/wp-content/uploads/2026/04/GDPR.pdf), in particular its discussion of informed affirmative consent, inactivity and withdrawal (pages 3–4), and [CNPDCP's commencement announcement](https://datepersonale.md/indrumari-explicatii-in-vederea-aplicarii-corecte-a-legii-nr-195-2024-privind-protectia-datelor-cu-caracter-personal/) confirming 23 August 2026. The 180-day term is a BookMe product decision. This implementation makes no claim of complete legal compliance for BookMe.

## Acceptance record

Browser screenshots at 320/768/1440 CSS px are produced by `cookie-accessibility.spec.ts` under each suite's `test-results/` directory. Codex inspected mobile screenshots from Chromium headless on macOS on 18 September 2026. The banner is in normal document flow, and long settings scroll vertically. Visual inspection caught a storage-error insertion pushing the focused Save button out of view; a failing browser assertion confirmed it, and the fix keeps the initiating control focused and visible without animation.

Human VoiceOver/screen-reader interaction and actual browser zoom at 400% are **pending**. Headless keyboard/axe checks and 320 CSS px reflow do not establish those manual results. Live hosting inspection above is also pending. These limits must remain visible in release acceptance.

Verified with Node 24.20.0, npm 11.19.0 and the repository's pinned Playwright browsers:

- `npm run check`: 64 files, zero errors, warnings or hints. Fresh normal production build passed.
- The full normal suite ran all 1,320 cases: 1,127 passed, 168 intentional skips, 25 failures. Twenty-four failures came from a no-JavaScript assertion whose parent text matcher excludes `noscript`; the test now checks the visible explanation itself. Firefox measured one 44px homepage link fractionally below its minimum; its minimum height was increased to 45px without relaxing the gate. All affected cases passed in the subsequent 324-case recheck (258 passed, 66 intentional skips).
- After the final storage-error focus fix, the production consent, accessibility and budget files passed again in all projects: 114 passed, 66 intentional skips. All eight pages have an attached network/storage inventory. There are no third-party initial requests, cookies, connection hints or optional storage in the normal build. The artifact scan finds no test-provider code or metadata.
- The final complete provider suite passed: 93 passed, 57 intentional no-JavaScript skips. It covers explicit grants/refusals, unchanged terms on reads, RO↔EN/reload, late SDK completion, cancellation/cleanup, expiry in an open document, incompatible/corrupt storage, inaccessible storage, cross-tab decisions and real history navigation. A synthetic persisted-page lifecycle case complements real reload/history tests; it is not a claim that every browser used its back-forward cache.
- The incomplete-disclosure build passed all 12 checks across the six browser projects.
- Both modes exercise initial, acknowledged/refused, allowed and storage-error settings as applicable, keyboard focus/trapping/return, axe, print and no-JavaScript behavior at 320/768/1440 CSS px in RO/EN. Contact replies and all analytics requests are intercepted. No real analytics event or FormBold submission was made.
- Final per-page normalized gzip maxima: **4,770 bytes JavaScript**, **7,086 bytes CSS**, against unchanged 20,000/40,000-byte gates. Legal pages load 3,361 bytes of JavaScript and 2,548 bytes of CSS; playback code remains absent there.
- `npm run test:lighthouse`: all configured gates passed across 48 runs (eight pages × two profiles × three runs). Per-URL median performance was 99–100 mobile and 100 desktop; accessibility, best practices and SEO were 100 in every run. Maximum per-URL median LCP was 1,654.24ms mobile / 404.39ms desktop, CLS 0.042 / 0.0087 and TBT 0ms. Raw runs and aggregates remain in `reports/lighthouse/`.
- `npm run package:site` produced `artifacts/bookme-website.tar.gz` from the normal `dist/` build. It has not been deployed.

The initial full-suite JSON is retained at `reports/playwright-site-full.json`; final consent reports are `reports/playwright-site.json`, `reports/playwright-consent-provider.json` and `reports/playwright-consent-incomplete.json`. Earlier passing provider coverage is also retained at `reports/playwright-consent-provider-full.json`. CI always executes the complete normal suite followed by both isolated provider variants.

## Standards

No documented-standard breaches. The review identified one minor duplication in the analytics test's request interception; it now uses the existing helper. No open Standards findings.

## Spec

The review identified one P2 issue: inaccessible localStorage could prevent cleanup of otherwise accessible sessionStorage/cookies. Each mechanism is now attempted independently, and a browser regression verified the failure before the fix. Follow-up review found this resolved and no new findings, including the subsequent lifecycle and focus fixes. No unrequested scope was found. Manual accessibility acceptance and live-host inspection remain the explicit limits above.

Review totals: Standards — 1 minor finding resolved, 0 open; Spec — 1 P2 finding resolved, 0 open implementation findings.
