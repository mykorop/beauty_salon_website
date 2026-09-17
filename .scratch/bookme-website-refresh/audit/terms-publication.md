# Terms publication evidence

Checked **17 September 2026** for [ticket 06](../issues/06-terms-of-use.md). The public documents are [Romanian](../../../src/content/legal/ro/terms.md) and [English](../../../src/content/legal/en/terms.md), using the existing legal layout and public URLs `/terms.html` and `/en/terms.html`.

## Product decisions and bilingual comparison

Each row was checked in both languages. Contractual duties below describe the rules of use, not new automated app features.

| Topic in both documents | Source and editorial decision |
| --- | --- |
| Operator, address, email and Moldovan law | Ticket 06 supplies BOOKME HUB, SRL; str. Glinka 4, ap./of. 10, Bălți, Moldova; support@bookme.md. No registration number or phone number is invented. |
| Platform versus provider | Ticket 06 and the existing homepage/FAQ: BookMe supplies booking and management tools; the salon or independent professional delivers the service. BookMe remains responsible for its own obligations. |
| Free platform and direct service payment | Ticket 06 and `src/content/home.ts`: free for clients and businesses, payment directly to the provider. No subscription, commission, payment collection, deposit handling or refund mechanism is introduced. |
| Accounts and age | Ticket 06 and audit [W04](README.md#w04-технічної-перевірки-віку-не-виявлено--c--i--o): clients 16+, business representatives 18+, no technical age verification. Legal representative agreement is conditional on applicable law, not asserted as an implemented registration step. |
| Bookings, cancellation and rescheduling | Existing homepage/FAQ and audit [D04](data-lifecycle.md): appointments, provider calendar and client cancellation. Rescheduling is arranged with the provider; no unverified client rescheduling button or universal cancellation deadline is promised. No BookMe cancellation fee is created. |
| Conduct, reviews, uploaded materials and intellectual property | Ticket 06; audit D03/D05/D06 and L06 in [data lifecycle](data-lifecycle.md). Honest reviews, lawful uploads, retained user rights and a limited service-purpose licence. Visible author identity and remaining content after account deletion match the audit. Moderation/review uses support, not an invented in-app workflow. |
| Client contacts | Audit D04 and the [permissions matrix](permissions.md), plus CNPDCP guidance below: lawful basis, transparency, minimal necessary data, security and data rights. OS contact access is distinct from the client's consent; manual entry has the same obligations. No blanket consent to marketing is inferred. |
| Availability and liability | No unconditional warranty waiver, zero-value liability cap or blanket user indemnity. Each party retains its legal obligations; mandatory remedies and liability that cannot lawfully be excluded are preserved. |
| Suspension, ending use and changes | Defined reasons, proportionality, reasonable notice/opportunity to correct where possible, urgent exceptions and support review. Voluntary departure, accrued rights and data rights remain. Changes have reasons and notice, not unlimited retroactive effect. These are contractual commitments, not claims of automated notice/moderation tooling. |
| Privacy, deletion and support | Same-language privacy/deletion links and homepage contact anchor, plus mailto. Deactivation does not imply automatic appointment cancellation or complete erasure, consistent with the published deletion page and audit L01–L07. |

Both versions have the same 13 sections, rules, qualifications and support routes. Neither translation is declared to override mandatory consumer protections. The revision date is 17 September 2026 in each locale.

## Official sources checked

- [ISSPNPC guidance on clear terms and unfair clauses](https://consumator.gov.md/ro/comunicate-de-presa/lansarea-campaniei-de-informare-consumatorilor-privind-clauzele-abuzive-si), published 2 May 2023, updated 10 June 2025: prior access to clear terms and protection against unfair clauses. Applied to the readable section structure and preservation of consumer rights.
- [ISSPNPC examples of unfair clauses](https://old.consumator.gov.md/rom/comunicate-de-presa/cele-mai-uzuale-clauze-abuzive-intr-un-contract-de-credit), 8 June 2021: the authority identifies unrestricted unilateral changes, exclusions of legal responsibility/remedies, disproportionate penalties, termination without reasonable notice and imposed exclusive arbitration as problematic. This is credit-sector guidance; applying those fairness principles to the platform wording is an editorial inference, not a claim that BookMe offers credit. The new terms avoid those restrictions.
- [Chișinău commerce authority guidance on electronic commerce](https://comert.chisinau.md/informatii-utile/comertul-electronic/comertul-electronic/), 16 December 2025: identifies Law 284/2004 on information society services, the Civil Code and Law 105/2003 on consumer protection, and explains provider identification and prior consent for commercial emails. Used to keep the operator/provider identities clear and prohibit treating booking contacts as marketing consent.
- [CNPDCP guidance on Law 195/2024](https://datepersonale.md/wp-content/uploads/2026/04/GDPR.pdf), pp. 1–6: lawful processing, purpose limitation, minimisation, information and data rights. Used for the business contact obligations; OS permission and acceptance of terms are not substituted for a lawful basis or separate consent. Product ages are not described as statutory consent thresholds.

The official registry's [Civil Code link](https://www.legis.md/cautare/getResults?doc_id=150498&lang=ro), reached from [ARCOM's current legislation list](https://www.anrceti.md/legislatie), and [Law 284/2004 link](https://www.legis.md/cautare/getResults?doc_id=150486&lang=ro), reached from the commerce authority, could not be retrieved (403/fetch errors, including PDF endpoints). The accessible official guidance above was read; this record does not claim a line-by-line review of the latest consolidated statutes or exhaustive legal certification.

The privacy legal-basis register and operational questions recorded in [ticket 05](../issues/05-privacy-account-deletion.md) remain separate. These terms do not turn unconfirmed processing bases or deletion operations into verified facts, and do not change the apps, backend or store declarations.

## Verification boundary

Playwright checks the production HTML in desktop and mobile-without-JavaScript projects. Terms-specific tests cover operator/provider/pricing, eligibility and protected rights, and navigation to the matching privacy, deletion and support pages. Shared legal-page tests cover each contents anchor, keyboard focus, revision date, local links, print styling and 320/768/1440px layouts; axe runs with JavaScript enabled. The existing navigation suite checks switching between the two terms URLs. Tests do not send support messages or perform bookings, payments or account deletion.
