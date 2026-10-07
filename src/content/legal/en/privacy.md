This policy explains how **BOOKME HUB, SRL** processes personal data for the **bookme.md website**, **BookMe** for clients and **BookMe Business** for salons and specialists, listed as **BookMe Salon** on the App Store. Both apps also work in a browser, with the same accounts and data: BookMe at [app.bookme.md](https://app.bookme.md/) and BookMe Business at [business.bookme.md](https://business.bookme.md/). This policy covers these web versions too.

Our address is **str. Glinka 4, ap./of. 10, Bălți, Moldova**. For privacy questions and requests, contact [support@bookme.md](mailto:support@bookme.md). BOOKME HUB, SRL is the operator responsible for the BookMe processing described here.

Looking to leave BookMe? [Account deletion instructions](delete-account.html) explain the in-app steps and how to request deletion by email without signing in.

## Data we process and why

### Accounts and sign-in

We process account identifiers, email, name, phone number, profile-photo links, language and account timestamps to create and manage your profile and connect you with your appointments. The fields depend on your role and what you provide. AWS Cognito handles BookMe sign-in credentials and identities. If you choose Google or Apple sign-in, the provider supplies identity information such as its account identifier and email to the BookMe sign-in service.

### Appointments and selected contacts

Appointment records contain the participants, client name and phone, salon or specialist, services, date and time, status, price and currency, and any notes provided. We use them to create and coordinate appointments and their history. Salons and specialists involved in a booking can access the information needed to manage it. A phone number can be used to associate a booking made by a business with an existing client account.

A business can enter a client's name and phone manually or select a contact from its device. The selected name and number fill the appointment form and are sent to BookMe when the business saves the appointment. This can include information about someone who has not created a BookMe account. The business must have a lawful basis to provide another person's details; its device permission is not that person's consent. You may contact us about such data even if you have no account.

### Business profiles, photos, certificates and reviews

Business profiles include contact details, address and location, description, photos, services, working hours and professional links. Salon records can also contain fiscal or VAT information. We use these data to operate business accounts and present providers to clients. Business addresses are sent to AWS Amazon Location to obtain map coordinates.

Business contact details, services, hours, photos and certificates can be visible to clients. Certificate details can include the issuer, dates, credential identifier, verification link, uploaded scan and notes. Only upload material suitable for this visibility. Photos selected or taken in the upload flow are sent to Cloudinary immediately after selection, before you save the surrounding form; cancelling that form does not undo the upload.

Reviews contain ratings, text, appointment references and authorship. Published reviews can show your name and avatar. These are not anonymous submissions, and in-app account deletion does not automatically remove the review or its authorship.

### Search and location

BookMe processes the text you type or dictate, language, device time zone and search filters to find providers. Nearby search can send your device coordinates to the BookMe API and cache the last coordinates on your device. You can search by text and choose a city without location access. Voice search sends recognised text to BookMe; speech recognition itself uses your device platform's speech service, which may process audio remotely. We do not describe it as exclusively on-device recognition.

### Notifications, diagnostics and support

For notifications, we process a device delivery token, platform, account association and notification content/read status. Push messages may contain appointment details such as a client's name, service and visit time. Delivery providers process the token and message content; these details can also appear on a device's lock screen.

Technical diagnostics can include errors, request identifiers, application version, device/app context and performance traces. Sentry is used where enabled, alongside server logging. Filters remove selected sensitive fields, but diagnostics should not be assumed to be entirely anonymous.

The website contact form sends your name, email and message to **FormBold** to handle your enquiry. Name and email are required; the message is optional. You can instead email support directly. Support correspondence is separate from your app profile and is not automatically erased by the in-app deletion button.

## Cookies and similar technologies

The public website currently has **no analytics provider connected**. Its cookie settings use **localStorage**, which is browser storage, not a cookie. BOOKME HUB, SRL stores one necessary record, `bookme.cookie-consent`, to remember that you acknowledged the notice or made an explicit analytics choice. It contains the schema and notice/purpose/provider versions, the acknowledgement or choice, the time of your action and its expiry. It contains no visitor identifier, IP address, email or browsing history and is not a complete server-side proof of consent.

The record is valid for **180 days from your explicit action**. This is a product decision, not a statutory retention requirement. Reading the record does not renew it. localStorage does not automatically delete it while you are away; we remove expired records on the next check. Clearing browser data resets the choice. If storage is unavailable, we show an error and keep analytics off on the current page; dismissing that message does not promise a saved choice for your next page.

The choice applies only to the **current origin in this browser**, shared by all language versions of this site. It does not carry over to the mobile apps, your account or other subdomains, including the web versions app.bookme.md and business.bookme.md. Necessary choice storage is separate from optional analytics. Acknowledging a notice when no provider is connected never authorises a future provider. A changed notice, purpose or provider requires a new choice.

If analytics is connected in future, its purpose, provider, data, technologies and retention must first be disclosed in settings and this policy, with a separate process for confirming consent. Analytics must stay off until you voluntarily allow it. Silence, scrolling, navigation, opening this policy and closing settings do not give consent. Use **Cookie settings** in the footer, turn analytics off and **Save choice** to withdraw. This stops new collection, cancels supported pending sends and clears known, accessible analytics cookies/storage. It cannot recall requests already sent, erase data held by a provider, or delete inaccessible third-party or HttpOnly cookies. No analytics consent is required to read the site, use links or send the contact form. FormBold receives form data only when you submit the form; this support processing is separate from analytics consent.

Without JavaScript, the static site and native contact form remain available, analytics does not start and no consent record is written. For questions or requests about these technologies, contact **BOOKME HUB, SRL** at [support@bookme.md](mailto:support@bookme.md).

## Device permissions and your choices

A device permission controls access to a device feature. It does not, on its own, establish the legal basis for every later use of the data, including another person's contact details. You can refuse permissions or change them in system settings; the alternatives below remain available.

- **Location — BookMe client:** used for nearby discovery and search. A request can appear when nearby listings first load without a selected city, or when you use location in search or city selection. The current Android flow expects precise location; approximate-only access may not work for this feature. On iOS, the described flow requests location while using the app. Choose a city or type a search instead.
- **Microphone and speech recognition — BookMe client:** used when you start voice search. iOS has separate microphone and speech permissions; Android uses microphone access through its speech recogniser. Audio goes to the platform recogniser and the resulting text goes to BookMe search. If access is refused or recognition is unavailable, type your search.
- **Contacts — BookMe Business / BookMe Salon:** requested when you choose a contact for an appointment. The Android component currently requests read and write access together, although BookMe's appointment flow uses selection rather than writing to the address book. On iOS, additional available fields of the selected contact may be read locally, while the appointment form uses and sends its name and phone. This flow does not upload the whole address book. You can enter the details manually.
- **Camera and photo selection — both apps:** used for profile images, business galleries and certificates where available. iOS can request camera or photo-library access. Android uses the camera application or a system photo picker in the current flow. Selected images are uploaded, not the entire library. If access is refused, retain the existing image or use another available selection method. Limited photo access on iOS may not work in every selection flow.
- **Saving a QR image — both apps:** adds a generated image to the device's gallery; iOS can ask for permission to add photos. This save action does not upload the QR image. If it fails, use the displayed QR code or the share/copy-link options.
- **Push notifications — both apps:** offered during onboarding, in settings or after a booking prompt. iOS and Android 13 or later can ask for a system permission. You can decline or disable push and still use appointments, the calendar and the in-app inbox.

**In the web versions**, the browser asks for location in BookMe for clients and for the camera in both apps, and your browser's site settings control that access. Photos are chosen with the browser's file picker. Choosing a contact from the address book, voice search, push notifications and saving a QR image to the gallery are not available there. Enter client details manually, type your search and follow updates in the in-app inbox; the browser downloads a QR image as a file, and the share/copy-link options remain.

Revoking a permission stops future access controlled by that permission. It does not delete information already saved with BookMe or its providers. Use a privacy or deletion request for existing data.

## Recipients and service providers

We use the following services for the stated technical purposes:

- **AWS:** hosting and APIs, profile and booking storage in DynamoDB, sign-in with Cognito, business-address geocoding through Amazon Location, and service emails including specialist invitations through SES.
- **Cloudinary:** upload, storage and delivery of selected photos and certificate images.
- **Google Firebase Cloud Messaging and Apple Push Notification service (APNs):** delivery of push tokens and notification content, with APNs used for iOS delivery.
- **Sentry, where enabled:** error and performance diagnostics from the apps and backend.
- **Google and Apple:** optional sign-in providers. Sign-in integration does not mean we send all your bookings to these providers.
- **Platform speech services:** Apple speech recognition on iOS and the configured speech-recognition provider on Android, which can vary by device, process audio for voice search.
- **FormBold:** the name, email and message submitted through the website contact form. Email enquiries also pass through the email services used to send and receive them.

These are technical roles; providers' handling of their own accounts and platform services is also governed by their terms. Salons and specialists receive booking data to deliver and manage your appointment and may hold their own records. Published business information and reviews are accessible to other users. A store label about data sharing should not be read as a promise that no data reaches any recipient.

## International processing

The providers above operate internationally, so processing may take place outside Moldova. We do not promise that all data, replicas, support access or backups stay in one country. Ask [support@bookme.md](mailto:support@bookme.md) for the countries, recipients and applicable transfer safeguards for your data. A provider's name or a server-region setting alone does not establish which transfer safeguard applies.

## Security and local storage

Account functions use authenticated access with AWS Cognito. The website contact form and photo uploads use HTTPS. Diagnostic filters redact selected sensitive fields. These measures do not make all stored records or diagnostic messages anonymous.

The apps keep some information on your device, including sign-in state, language, notification choices, search filters, selected city and onboarding preferences. These support the app's operation and your choices. Clearing local app data is separate from a request to remove information held by BookMe or its providers.

The web versions keep sign-in state and settings such as language, filters, the selected city and onboarding preferences in the browser storage of their own domain. This storage is needed for them to work and is not used for analytics; the cookie settings of this website do not apply there. Clearing a web version's site data in your browser signs you out but does not delete your account or the information held by BookMe or its providers.

## Retention and account deletion

The purpose of each record determines how long it is needed: operating your account, coordinating an appointment, displaying a publication you submitted, resolving a support request or investigating a technical problem. The current account-deletion process does not give every category an automatic expiry date.

**In-app deletion first deactivates the account and performs partial cleanup.** It removes the account's notification history and push-device registrations and attempts sign-in cleanup. Profile details, appointments, reviews, business records, uploaded media and other references can remain. Reviews may continue to identify their author, and a provider's appointment records are not automatically anonymised.

Remaining personal data requires a separate support process. The operator's commitments are **up to 30 days for a support deletion request** and **up to 90 days for residual backup copies**. These are separate periods, not a promise of immediate complete erasure or a universal expiry for logs and correspondence. See the [deletion page](delete-account.html) for how to request final removal and confirmation, including when you no longer have app access.

A remaining record is not a legal justification to retain it. We do not claim a blanket accounting or fraud-prevention exception. Ask support to identify the specific reason, category and retention period if data cannot be removed. Device settings such as language or saved filters can remain locally after account deletion; clearing app data is separate from deleting server records.

## Your rights and how to contact us

Moldovan **Law No. 195/2024 on personal data protection**, applicable from **23 August 2026**, provides rights to information, access, correction, erasure, restriction, portability and objection, subject to its conditions. You can withdraw consent where processing relies on it, without affecting prior lawful processing, and request safeguards against solely automated decisions with significant effects. See [CNPDCP's official guidance on Law No. 195/2024](https://datepersonale.md/wp-content/uploads/2026/04/GDPR.pdf).

Write to [support@bookme.md](mailto:support@bookme.md), tell us your request and the account or booking concerned, and identify your role if relevant. You do not need an installed app. We may need proportionate information to verify your identity; do not send passwords or sign-in codes. The statutory response period is one month; a legally permitted extension for complexity must be explained within that month. The support deletion commitment above remains distinct from that legal response rule.

You may complain to **Centrul Național pentru Protecția Datelor cu Caracter Personal (CNPDCP)**: [centru@datepersonale.md](mailto:centru@datepersonale.md), **+373 22 820 801**, **str. Serghei Lazo 48, MD-2004, Chișinău, Republica Moldova**. See the [official CNPDCP contact page](https://datepersonale.md/about/contacts/) for current contact and complaint information.

## Children's Privacy

BookMe client accounts are for people aged **16 or older**; business users must be **18 or older**. These are product eligibility rules. The registration flows do not technically verify age. If you believe a child below the applicable age has provided personal data, contact support so we can address the account and data concerned.

## Changes to this policy

We publish revisions on this page and update the revision date above. For questions about a change or about the handling of your data, write to [support@bookme.md](mailto:support@bookme.md).
