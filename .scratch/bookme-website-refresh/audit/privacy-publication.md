# Privacy and account-deletion editorial evidence

Prepared 17 September 2026 for [ticket 05](../issues/05-privacy-account-deletion.md).
This record concerns the four website documents and their presentation, not a mobile/backend deployment or a certification of store compliance.

## Claim-by-claim check

The Romanian and English versions have matching section order, categories, recipients, alternatives, periods and qualifications. Read the source documents together with the linked audit sections; C describes inspected source, O a recorded owner statement, and U an unverified operation.

| Public claim (both languages) | Evidence / editorial boundary |
| --- | --- |
| BOOKME HUB, SRL; str. Glinka 4, ap./of. 10, Bălți, Moldova; support@bookme.md | Exact operator details required by ticket 05 (O). No company-registration lookup claimed. |
| Website, BookMe, BookMe Business / BookMe Salon | Ticket 05; [audit W07/store table](README.md). BookMe Salon naming comes from approved store links, not a newly verified storefront. |
| Identity, credentials, email/name/phone/avatar/language/timestamps | [D01](data-lifecycle.md#d01-ідентичність-та-клієнтський-профіль--c); Cognito is distinguished from the stored profile. |
| Business contacts/address/location/services/hours/fiscal data and professional links | D02–D03; certificate fields and scans can be visible to clients. No claim that certificates are private verification documents. |
| Booking participants/name/phone/time/service/status/price/currency/notes; phone account association | D04; business-created records can concern non-account holders. A business must have its own lawful basis; permission on its device is not consent from its client. |
| Selected contact fills form; name/phone sent on save | D04 and [permissions matrix](permissions.md#матриця-користувацьких-дій-і-даних). Android READ/WRITE belong to current plugin; iOS can read more fields of the selected contact locally. No whole-address-book upload claimed for that flow. |
| Public review name/avatar/text/rating; remaining authorship after account deletion | D05 and L06. No automatic anonymity promise. |
| Photo uploads precede parent-form save; Cloudinary stores files | D06 and permissions matrix. Cancelled form does not imply cancelled upload; no unsupported S3 photo flow. |
| Typed/voice text, locale/time zone/filters/coordinates; local coordinate cache | D07 and permissions matrix. Recognised text reaches BookMe; audio is handled by the platform recogniser, potentially remotely. No all-local speech promise. |
| Location timing and precise-only limitation; manual city/text alternatives | Permissions matrix and P-02/P-03. Does not claim every prompt follows an explanatory screen or deliberate button click. |
| Microphone/speech, contacts, camera, photo selection, QR saving and push; denial alternatives | Each row in permissions matrix. Preserves OS differences and iOS limited-photo caveat. Permissions are distinct from legal bases. |
| Push token/account/platform and message contents; possible lock-screen display | D08 and permissions matrix. Firebase/APNs are delivery services, not analytics labels. |
| Sentry conditional, diagnostics not necessarily anonymous | D09 and W03; does not claim production DSNs/events or all-field redaction are verified. |
| FormBold fields and optional message; direct email alternative | W05 and current ContactForm.astro. No invented mailbox processor, retention period or automatic support-ticket purge. |
| AWS roles, including Amazon Location and SES; Google/Apple sign-in | Provider table in data-lifecycle.md. Technical purpose is described without declaring every recipient a legally contracted processor. |
| International handling; no single-country guarantee | Provider table and audit limitations. Actual production topology, subprocessors and safeguards remain U; no SCC/adequacy agreement or completed transfer assessment is asserted. |
| Security and device storage | W02, D01, D09, L01/L05; HTTPS contact action in ContactForm.astro and Cloudinary upload in D06. No blanket encryption-at-rest/backup guarantee. |
| Retention criteria: account/appointment/publication/support/diagnostic purpose | Purposes above and existing policy's necessary-purpose criterion. Not presented as a verified scheduled expiry; missing per-system retention settings remain U. |
| Three role-specific in-app deletion paths; DELETE confirmation; error/support route | W01 and L01–L05. English/Romanian reader-facing names preserve the role distinction. |
| Deactivation vs automatic partial cleanup vs separate final removal | L01–L07 and W06. Inactive records, notification cleanup, best-effort Cognito removal, independent failures and remaining media are explicit. |
| Salon deletion does not delete other specialists; master link deactivated; appointments not guaranteed cancelled | L03/L04. No cascade or auto-cancellation promise. |
| Local preferences may remain; Google/Apple accounts not deleted | W02 and provider table. No claim of complete local-storage erasure or verified Apple token revocation. |
| Review authorship and provider records can remain identifiable | L02–L06; no automatic anonymisation or invented retention exemption. |
| Up to 30 days for support, up to 90 days for backup copies | W06/L07 and ticket 05 (O). These are operator commitments, not tested timers or proof of full operational cleanup. No fixed expiry assigned to all logs/support data. |
| Rights, response period, authority and Law 195/2024 | Official sources below. The statutory one-month response rule is separated from the owner's 30-day deletion commitment. |
| Clients 16+, business 18+, no technical age verification | W04/D10 and product rule recorded in ticket 06 (O). Does not equate the product age with the statutory child-consent threshold. |

## Official requirements checked on 17 September 2026

- [CNPDCP guidance on Law 195/2024](https://datepersonale.md/wp-content/uploads/2026/04/GDPR.pdf), pp. 1–6: legal bases, transparency, rights, one-month response and explained extensions. [Ministry of Justice effective-date notice](https://www.justice.gov.md/ro/content/noua-lege-privind-protectia-datelor-cu-caracter-personal-reprezinta-un-pas-esential?month=2025-07) states 23 August 2026. The official legis.md statute download could not be fetched (403); guidance and the authority's [law listing](https://datepersonale.md/legislation/national-legislation/legi/) were accessible. No claim of a full statutory legal opinion.
- [CNPDCP contact page](https://datepersonale.md/about/contacts/): email, telephone and postal address reproduced in both languages.
- [Google Play User Data](https://support.google.com/googleplay/android-developer/answer/10144311?rd=1): identity/contact, actual categories/purposes/recipients, secure handling, retention/deletion and permissions/disclosures. The ordinary hl=en URL failed; the rd=1 official page was accessible.
- [Google Play deletion requirements](https://support.google.com/googleplay/android-developer/answer/13327111?hl=en): accessible external route, app/developer identity, prominent request path; an email route is supported. Deactivation alone does not satisfy deletion.
- [Apple App Review Guidelines 5.1.1](https://developer.apple.com/app-store/review/guidelines/#privacy) and [account deletion guidance](https://developer.apple.com/support/offering-account-deletion-in-your-app): in-app initiation, associated content deletion, timing/confirmation, and Sign in with Apple token revocation.

The website now documents the audited behaviour honestly. It does **not** make the current app deletion implementation compliant merely by describing its limits. Full associated-data cleanup, an in-app flow that does not require a separate support request to finish ordinary deletion, Apple token revocation, provider agreements/equal protection, actual consent disclosures and accurate release-specific store questionnaires remain operational/mobile/backend work identified in ticket 02. These were not changed or exercised here.

## Pending owner/legal confirmation

The audit establishes purposes and technical flows but does not establish an approved legal-basis register or legitimate-interest assessment. An owner question is pending in the implementation conversation. Proposed mapping for review:

| Purpose | Proposed basis, not yet asserted as confirmed |
| --- | --- |
| Account, bookings and requested service support | Contract / steps at the person's request |
| Optional location, voice, contact selection, photos and push | Consent for optional access/use; does not cover unrelated reuse or another person's data |
| Security and technical diagnostics | Legitimate interest, subject to a documented balancing assessment |
| Privacy-rights requests | Legal obligation |

A source-code path or OS permission cannot confirm any of those legal conclusions. Public legal-basis wording and the corresponding acceptance criterion must remain pending until that confirmation arrives. No response is not approval.

Production countries and applicable transfer safeguards, exact diagnostic/FormBold/mail retention, vendor contracts and a complete external deletion runbook also remain unverified, as recorded in ticket 02. Public wording must not invent them. Any actual retention exception requires its category, legal reason and period; none is asserted here.

## Validation

Recorded in ticket 05 after the final check and independent Standards/Spec review. Browser tests do not exercise app permissions, production deletion, providers or email delivery. No real support request is sent.
