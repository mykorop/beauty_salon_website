# Client booking phone demo

Ticket: [11 — client booking phone demo](../../.scratch/bookme-website-refresh/issues/11-client-booking-phone-demo.md).

The hero depicts an already signed-in fictional client, **Ana Demo**, booking
**Manicure / Manichiură** at **Studio Luma** with **Mara Luca**, on
**15 October 2026 at 14:30 Europe/Chisinau**, for **one hour / 300 MDL**.
The appointment is confirmed. Names, address and times are fixed demonstration
data; the website cannot submit the form, request permissions or create a booking.

## App comparison

Before constructing the scenario, the local mobile source, dictionaries and
design tokens were inspected, and the client booking screens were run with
intercepted fictional data. Both apps were captured locally on 18 September 2026
from mobile commit `bcbc1c6d44b49311da2a345ac69af79f8d1e4e9f` in Chromium on macOS.
The final Salon capture shows the same appointment and its Confirmed status.

The reference harness uses the actual Angular/Ionic views with a synthetic
in-memory signed-in state. Every external request is fulfilled with a fixture or
aborted, including the booking POST. This is visual comparison evidence, not a
claim that the backend accepted a booking. The mobile repository is unchanged.

| State | Current local app | Website demo | Source under `bookme_mobile/` |
| --- | --- | --- | --- |
| Search result | [Capture](references/client-search.png) | [Frame 1](website/en-1440-step-1.png) | `projects/client/src/app/pages/search/components/salon-item/` |
| Booking form | [Capture](references/client-booking.png) | [Frame 2](website/en-1440-step-2.png) | `projects/client/src/app/pages/salon-details/modals/booking-modal/` |
| Service action sheet | [Capture](references/client-service.png) | [Frame 3](website/en-1440-step-3.png) | `booking-modal.component.html`: service select with action-sheet interface |
| Specialist sheet | [Capture](references/client-master.png) | [Frame 4](website/en-1440-step-4.png) | `projects/client/src/app/pages/salon-details/modals/booking-masters-modal/` |
| Calendar and available time | [Capture](references/client-calendar.png) | [Frame 5](website/en-1440-step-5.png), [frame 6](website/en-1440-step-6.png) | `projects/client/src/app/pages/salon-details/modals/booking-calendar-modal/` |
| Confirmation | [Capture](references/client-confirm.png) | [Frame 7](website/en-1440-step-7.png) | `booking-modal.component.html` and `confirm()` |
| Success | [Capture](references/client-success.png) | [Frame 8](website/en-1440-step-8.png) | `toast.bookingConfirmed` in `src/app/i18n/translations/{ro,en}.ts` |
| Upcoming card | [Capture](references/client-upcoming.png) | [Frame 8](website/en-1440-step-8.png) | `projects/client/src/app/pages/bookings/components/booking-upcoming-list/components/upcoming-booking-card/` |
| Salon appointment / status | [Capture](references/salon-calendar.png) | Same fixture | `projects/salon/src/app/shared/appointments/` |

The demo retains the app's rounded cards, light surfaces, dark pill controls,
underlined booking fields, sheet ordering, Monday-first calendar, and outline
icons. RO/EN field and action labels follow the app dictionaries. The app's
no-photo monogram is reproduced with CSS and no reviews are invented.

Deliberate presentation adjustments:

- The smaller marketing viewport compresses spacing; the screen uses a system
  sans-serif rather than redistributing the app's Proxima Nova font.
- The currency is written explicitly as **MDL** (the app formats it as **lei**).
- The success toast uses the app's darker success shade `#167e47`, passing 4.5:1
  contrast for smaller text. It stays with the final card so the result remains
  understandable without motion. In the app the toast disappears and the user
  opens the Bookings tab to view the card.
- The calendar uses a fixed demonstration month; only the 15th is available.
  The chosen time is held briefly before returning to the confirmation form.
- Unavailable dates and the inactive booking action use the app's darker medium
  gray `#6c6c72` so their illustrated text remains legible. The blurred form
  underneath each open picker is inert, matching its inactive state in the app.
- Outline icons are locally authored SVG geometry; there are no imported photos,
  avatar portraits or external image assets. A generic silhouette substitutes for
  a missing avatar in the reference harness only.

[Banco Plata](https://bancoplata.mx/en) was consulted for the device composition.
Its assets, branding and code were not copied.

## Playback and accessibility

`PhoneDemo.astro` provides the reusable frame, localized controls, caption and
native step disclosure. `phone-playback.ts` owns each instance's playback.
`ClientBookingDemo.astro` supplies static frames; `booking-demo.ts` supplies the
shared RO/EN content, data and dwell durations.

One 16.6-second sequence starts when at least 60% of the phone enters the viewport.
Meaningful frames last 2.2–2.6 seconds; transitions take 280ms. The final card
remains indefinitely. Pause preserves the remaining frame time. Visibility and
tab hiding pause automatically, while a manual pause survives both. Replaying
cancels the previous schedule before starting from the first frame.

Initial HTML contains the final card and all eight textual steps. Without JS,
playback buttons stay hidden and the native disclosure still works. Reduced
motion starts on the static final card; Replay and Next step provide a manual
walkthrough with no animation. Enabling reduced motion mid-playback stops it and
shows the result; switching the preference back does not restart automatically.

The screen is one image with a stable, localized scenario description. Its
illustrated controls are inert, with no input or tab stops. Changes are not live
announcements. The real playback controls and step disclosure have at least
44px targets, visible focus, and keyboard operation. When a focused Pause control
is removed by a motion-preference change, focus moves to Replay.

## Visual acceptance

Codex inspected the app captures and the rendered production demo in Chromium
153 on macOS on 18 September 2026. Search, picker, calendar, confirmation and
final-card layouts were compared; the phone frame does not cover content.
Both languages remain legible on phone, tablet and desktop, and the controls
and fictional-data caption fit without horizontal scrolling.

| Width | Romanian | English |
| --- | --- | --- |
| 320px | [Final and controls](website/ro-320-final.png) | [Final and controls](website/en-320-final.png) |
| 768px | [Final and controls](website/ro-768-final.png) | [Final and controls](website/en-768-final.png) |
| 1440px | [Hero](website/ro-hero.png) | [Hero](website/en-hero.png) |

The `website/` directory also contains all eight 320px frames in both languages
and all eight English desktop frames. These are repository evidence, not page
assets, and do not add website transfer weight.

## Reproduce the evidence

For current app references, start the sibling mobile workspace's client and Salon
development servers on ports 4200 and 4201, then run from this website repository:

```sh
node scripts/capture-booking-reference.mjs
```

The harness is intended for this source revision; selectors and fixture contracts
should be revisited when the mobile apps change. It never provisions accounts or
contacts live APIs. It expands the real Ionic calendar sheet to show its times.

For website captures, build and run a preview on port 4328, then capture:

```sh
npm run build
npm run preview -- --host 127.0.0.1 --port 4328 --ignore-lock
# In another terminal:
node scripts/capture-booking-demo.mjs
```

Automated acceptance uses the production preview on port 4329:

```sh
npm run check
npm run build
npm test -- tests/booking-demo.spec.ts
npm test
npm run test:lighthouse
```

The browser tests use public visible text and controls, a controlled clock,
real scrolling, reduced-motion emulation, and a controlled browser visibility
event. No test treats internal classes or timer counts as its contract. They
cover all eight states, data consistency, lifecycle controls, no-JS fallback,
reduced motion from load and during playback, keyboard use, no API/permission
requests, every frame's text bounds on all three widths, and axe on all eight
frames, including initial, paused and final states. The existing site tests cover links, navigation, target
sizes, focus, accessibility and transfer budgets.

Native VoiceOver pronunciation and 400% OS/browser zoom have not been manually
audited in this task. Accessibility-tree inspection, keyboard tests, axe and
320px reflow checks are recorded separately; they are not a WCAG certification.

### Manual acceptance record

Tester: Codex. Date: 18 September 2026. Host: macOS 26.6.2, Chromium
153.0.8010.12. Build reference: website baseline
`4e522cb1649908c150cf9951626895e37bcf0a82` plus ticket 11's staged source changes.
The records below cover this demo; the site-wide manual checklist in
`docs/quality-gates.md` remains separate.

| Manual check | Result and scope |
| --- | --- |
| App similarity, desktop/mobile text and captions | Pass: inspected the reference and website screenshots linked above, RO/EN at 320/768/1440px. |
| Contrast, controls and decorative surfaces | Pass for visual inspection of the demo: dark text on light screens, white text on the darker success toast, gold captions and visible focus. Axe additionally verifies all eight frames and paused playback. Blurred inactive forms behind pickers are inert. |
| Screen-reader description | Pass for inspection of the [Romanian](accessibility-ro.txt) and [English](accessibility-en.txt) accessibility trees: stable full scenario description, explicit fictional data and signed-in context, ordered steps, no fake form fields or live frame announcements. Native VoiceOver pronunciation/interaction: **pending**. |
| Manual keyboard-only session | **Pending**. Automated native Tab/Enter/Space interaction, focus outlines and obstruction checks pass separately in Chromium, Firefox and WebKit. |
| Manual browser zoom at 400% | **Pending**. Every frame passes 320px text-bounds and page-reflow checks; this is not a manual zoom result. |
| Manual OS reduced-motion toggle | **Pending**. Browser preference emulation passes from load and during playback, with no animation and no automatic restart. |
| Native background-tab/window interaction | **Pending**: this workstation's Playwright-launched Chromium continued reporting visible after tab changes/minimizing, even with focus emulation disabled. The controlled browser visibility-event test passes in all three engines, including preservation of manual pause. |

## Validation results

Measured on 18 September 2026, Node 24.20.0 / npm 11.19.0:

- `npm run check`: no errors, warnings or hints.
- `npm run build`: nine static HTML pages, including the separate 404.
- Demo tests: 84 passed across six browser projects; 36 expected skips for
  JavaScript-dependent motion checks in the no-JS projects.
- Final `npm test`: **962 passed, 112 expected skips**, no failures or retries.
- Keyboard regression check: all 48 page/browser combinations pass. The old
  traversal counted hidden/disabled controls and continued into browser chrome;
  its bound now counts visible enabled controls, retaining native Tab and all
  outline, viewport and obstruction assertions.
- Both homepages: **1,409 bytes JavaScript / 6,854 bytes CSS gzip**, including
  existing resources, against 20,000 / 40,000 byte limits. No framework runtime
  or raster image is loaded by the demo.
- `npm run test:lighthouse`: **all 48 audits pass**, across eight URLs, two
  profiles and three cold runs. Performance medians are 98–100; accessibility,
  best practices and SEO are 100 in every run. The largest median LCP is
  1,654ms, CLS is 0.0794, and TBT is 0ms. Both desktop homepages score 100 in
  every category; mobile homepages score 99 (RO) and 98 (EN) for performance.
  Raw results remain in the ignored `reports/lighthouse/` directory.
- `npm run package:site`: local static archive built in `artifacts/`.

### Standards

Independent review of the staged diff against the starting website commit:
one documentation finding (incomplete manual acceptance record) was corrected
and rechecked. No remaining documented-standard violations or actionable code
smells. The keyboard traversal correction and final contrast/inert-state
adjustments were also independently reviewed.

### Spec

Independent review found no actionable requirement gaps, incorrect behavior or
material scope creep. The reviewer inspected representative mobile frames
against the app references, as well as playback and fallback behavior.

Review totals: Standards — 0 remaining findings; Spec — 0 findings.
