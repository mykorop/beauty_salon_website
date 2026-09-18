# Client-preferred orange accent

Ticket: [13 — orange accent](../../.scratch/bookme-website-refresh/issues/13-client-preferred-orange-accent.md).
Reference: [client-supplied button](../../.scratch/bookme-website-refresh/references/client-preferred-orange.png).

Reviewed by Codex on 2026-09-18 on macOS 26.6.2, Chromium 153.0.8010.12, against
the production build based on `44e7428` plus this ticket's CSS changes.
Node 24.20.0 / npm 11.19.0. Screenshots use reduced motion and loaded local fonts.

## Visual comparison

The filled CTA matches the reference's `#F59E0C`; graphite surfaces and dark
button text remain. The reference guides the color, not the button's content.
Existing secondary App Store buttons retain their outline treatment. Both locales
remain readable at desktop and mobile widths, without horizontal overflow.

| Locale / viewport | Main CTAs | Downloads |
| --- | --- | --- |
| RO / 1440 × 1000 | [Screenshot](ro-1440-cta.png) | [Screenshot](ro-1440-downloads.png) |
| EN / 1440 × 1000 | [Screenshot](en-1440-cta.png) | [Screenshot](en-1440-downloads.png) |
| RO / 393 × 1000 | [Screenshot](ro-393-cta.png) | [Screenshot](ro-393-downloads.png) |
| EN / 393 × 1000 | [Screenshot](en-393-cta.png) | [Screenshot](en-393-downloads.png) |

Screenshots are section crops, so their image dimensions differ from the viewport.
The [computed-style record](verification.json) confirms the shared palette on all
eight pages and identical computed foreground/background/border/fill/stroke colors
inside both phone screens when switching between the old and new accent at both
widths and in both languages. The phone interfaces and branding assets are unchanged.

## Contrast and focus inspection

Relative-luminance ratios calculated from the final sRGB colors:

| Accent state | Color | On `#181A1D` | On `#1E2024` | On `#25282D` |
| --- | --- | --- | --- | --- |
| Default / focus | `#F59E0C` | 8.12:1 | 7.60:1 | 6.89:1 |
| Hover | `#FFB52E` | 9.88:1 | 9.25:1 | 8.38:1 |
| Active | `#DC8908` | 6.33:1 | 5.92:1 | 5.37:1 |

Dark text and arrow icons on filled buttons use `#181A1D`; their ratios are the
first contrast column. Accent text, invalid-field borders and focus rings remain
distinct on the graphite surfaces. The hero's faint tint remains darker than the
lightest surface in the table. Its translucent decorative border is not a control
or the only boundary identifying an interactive element.

The main CTA was reached with native Tab presses. The [focus screenshot](en-1440-focus.png)
shows the complete 3px solid outline separated from the button by a 4px gap;
the shape makes focus visible independently of hue. [Hover](en-1440-hover.png)
lifts the CTA by 1px; [active](en-1440-active.png) lowers it by 1px. Secondary CTAs
use the same positional cues. Navigation/language/footer hover adds an underline,
and the outlined web-app link retains that cue while pressed. Form submission
adds a 1px hover lift and keeps its pressed scale cue; disabled pending submission
retains its default fill and existing localized status text. Playback controls
outside the phone screens gain a hover underline and a 1px pressed movement.
Pressed captures: [contact submit](en-1440-contact-active.png),
[playback](en-1440-playback-active.png).

Codex visually inspected the RO/EN CTA and download screenshots against the supplied
reference and inspected the focus/pressed captures. This records screenshot review
and calculated contrast, not a human assistive-technology session. Broader VoiceOver,
400% browser zoom and OS-level checks remain recorded separately in ticket 12.

## Validation

- `npm run check`: 0 errors, warnings or hints.
- `npm run build`: 8 indexable pages plus 404.
- `npm test -- tests/home.spec.ts --project=chromium`: 16 passed, including
  both locales, store destinations, responsive layouts and axe at 320/768/1440px.
- `npm test -- tests/contact.spec.ts --project=chromium`: 12 passed after review,
  including pending, success, failure and validation states with intercepted replies.
- `npm test` on the final build: **1,046 passed, 142 intentional skips**,
  zero failures or flaky results. Chromium, Firefox and WebKit desktop/mobile,
  no-JavaScript, keyboard focus, responsive/reduced-motion and axe checks pass.
- Gzip budgets: homepage **1,409 B JavaScript / 6,750 B CSS**; legal pages
  **0 B JavaScript / 2,248 B CSS**, below the unchanged 20,000 / 40,000 B limits.
- `npm run package:site`: all 39 archived files match `dist/` byte for byte.
  SHA-256: `6b15d2d61851ae9835c222bc99ae1be3a837fd402a66f87d5447c990d75d0f87`.
- `npm run test:lighthouse`: **48/48 runs pass**. Performance medians **98–100**;
  Accessibility, Best Practices and SEO **100 in every run**. Maximum medians:
  LCP **1,654 ms**, CLS **0.07935**, TBT **0 ms**. Raw reports remain in
  `reports/lighthouse/`; the ticket records the final result.

Existing behavioral/accessibility tests cover this palette-only change; no new
test seams, test fixtures, dependencies or production JavaScript were introduced.

## Standards

Independent review from `44e7428`: no documented-standard violations or actionable
baseline code smells, including the final contact/playback state changes.

## Spec

Review found a color-only hover cue on contact/playback controls. Adding the
movement/underline cues resolved it; independent re-review found no remaining issues.

Review totals: Standards — 0 findings; Spec — 0 unresolved findings.
