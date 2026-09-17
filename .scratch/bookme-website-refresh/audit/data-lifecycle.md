# Дані, постачальники та життєвий цикл акаунтів

Навігація: [межі аудиту, магазини й підтримка](README.md) · [дозволи та мобільні виклики](permissions.md).

Дата аудиту: **2026-09-17**. Завдання: [02 — дозволи й дані](../issues/02-permissions-data-audit.md).
Джерело: локальний `bookme-backend`, commit **`8b5ad7df67cb51ac8e1da1a0066c38e022d7019a`**; на початку перевірки дерево чисте.
Мобільні докази upload у D06: `bookme_mobile`, commit **`bcbc1c6d44b49311da2a345ac69af79f8d1e4e9f`**.
Backend читався без змін; хмарні API, production-дані, секрети та `.env` не читалися.
Посилання нижче ведуть до сусіднього checkout цього commit; без нього їх потрібно відкрити в відповідному репозиторії.

Позначення: **C** — прямо підтверджено локальним кодом; **I** — висновок із простеженого шляху;
**O** — продуктове підтвердження власника, записане в ticket; **U** — не перевірено.
C не означає перевірку розгорнутого сервера: версія релізу, cloud-конфігурація, фактичний трафік,
бінарні дозволи Android/iOS та поведінка фізичного пристрою залишаються U.

Ключовий результат: серверне «видалення акаунта» вимикає профіль і запускає часткове очищення.
Воно **не виконує повного стирання** профілю, бронювань, відгуків, бізнес-даних чи Cloudinary-файлів.
Це видно з повного [deleteAccountForUser](../../../../bookme-backend/packages/shared/src/services/account-deletion.service.ts#L24)
і трьох role-specific шляхів, наведених нижче. Наслідок: текст політики має пояснювати залишки та зовнішній процес.
Рекомендація: окремо реалізувати й перевірити повне очищення до обіцянки автоматичного стирання.

## Категорії даних і користувацькі дії

### D01. Ідентичність та клієнтський профіль — C

Після входу Cognito API створення профілю приймає email, ім'я/прізвище, телефон, URL аватара та мову;
ім'я, прізвище, телефон і аватар у цій серверній схемі необов'язкові.
`createProfile` зберігає надані поля, Cognito user ID у ключах, час створення/зміни, email-index та phone lookup за наявності телефону.
Джерела: [createProfileSchema](../../../../bookme-backend/services/client-api/src/schemas/profile.schema.ts#L6),
[createProfile](../../../../bookme-backend/services/client-api/src/services/profile.service.ts#L45),
[assertRegistrationEmailMatchesIdentity у handler](../../../../bookme-backend/services/client-api/src/handlers/profile/create.ts#L25).
Наслідок: це облікові та контактні дані, пов'язані з конкретним акаунтом; URL аватара теж зберігається сервером.
Рекомендація: описати Cognito/DynamoDB та мету зв'язку телефону з бронюванням; не називати профіль анонімним.

### D02. Салон, незалежний майстер та майстер у салоні — C

Бізнес-профілі містять назву/ім'я, опис, email, телефон, адресу, координати закладу, фото-URL,
мову, розклад/послуги й рейтинг; салон додатково може зберігати fiscalCode/vatCode.
Власник салону отримує окремий owner-master зв'язок із його ім'ям/email; це не другий Cognito-акаунт.
Джерела: [SalonEntityModel](../../../../bookme-backend/services/salon-api/src/models/salon-entity.model.ts#L12),
[MasterEntityModel](../../../../bookme-backend/services/master-api/src/models/master-entity.model.ts#L12),
[buildOwnerMasterEntities](../../../../bookme-backend/services/salon-api/src/services/salon.service.ts#L181).
Наслідок: бізнес-дані також можуть ідентифікувати фізичну особу; збереження в іншому partition важливе для видалення.
Рекомендація: окремо пояснити приватні облікові й публічні бізнес-поля та всі пов'язані записи.

### D03. Публічність бізнес-профілів і сертифікатів — C

Клієнтський DTO повертає назву, адресу, телефон, email, фото, послуги, години й сертифікати активного бізнесу.
Для сертифіката повертаються title, issuer, issuedAt/expiresAt, credentialId, verificationUrl, fileUrl і notes.
Джерела: [mapSalonDetailToResponse / mapIndependentMasterSalonToResponse](../../../../bookme-backend/services/client-api/src/mappers/salon-detail.mapper.ts#L36),
[mapCertificateToResponse](../../../../bookme-backend/services/client-api/src/mappers/certificate.mapper.ts#L7),
[getSalonById: active-фільтри](../../../../bookme-backend/services/client-api/src/services/salon.service.ts#L360).
Наслідок: скан і його примітки можуть бути доступні клієнтам; це не лише внутрішній доказ кваліфікації.
Рекомендація: перед завантаженням пояснити публічність, запропонувати приховувати зайві дані на скані та переглянути публічність notes.

### D04. Бронювання, включно з вибраним контактом бізнесу — C / I

API бізнесу приймає `clientName`, `clientPhone`, майстра, послуги, час і необов'язкові notes.
Запис зберігає ці поля разом з IDs учасників, статусом, сумою/валютою й знімком послуг; телефон використовується для пошуку активного client ID.
Клієнтський запис також зберігає ім'я/телефон, бізнес, час, послугу, ціну й notes.
Джерела: [createAppointmentSchema](../../../../bookme-backend/services/salon-api/src/schemas/appointment.schema.ts#L10),
[create appointment: phone lookup](../../../../bookme-backend/services/salon-api/src/services/appointment.service.ts#L310),
[запис entity](../../../../bookme-backend/services/salon-api/src/services/appointment.service.ts#L384),
[клієнтський appointment](../../../../bookme-backend/services/client-api/src/services/booking.service.ts#L1454).
Наслідок: після збереження вибране ім'я/телефон контакту стає серверними даними бронювання, доступними його учасникам.
I: ці поля самі не доводять завантаження всієї адресної книги або запис у контакти пристрою; спосіб вибору перевіряється в mobile-аудиті.
Рекомендація: описати вибір окремого контакту та передачу при збереженні; не прирівнювати WRITE_CONTACTS до серверного збору всіх контактів.

### D05. Відгуки та автор — C

`submitAppointmentReview` зберігає client ID, знімок clientName, appointment ID, оцінки, текст і час.
У цьому writer `images: []`: саме поле в моделі не доводить реалізоване завантаження фото до відгуку.
Публічний DTO повертає clientName, clientAvatar, comment, дату й оцінки; аватар дочитується з профілю автора.
Джерела: [submitAppointmentReview](../../../../bookme-backend/services/client-api/src/services/appointment-review.service.ts#L460),
[public review handler](../../../../bookme-backend/services/client-api/src/handlers/review/get-salon-reviews.ts#L10),
[mapReviewToResponse](../../../../bookme-backend/services/client-api/src/mappers/salon-detail.mapper.ts#L166).
Наслідок: відгук є публікацією з іменем/аватаром; видалення акаунта не анонімізує його автоматично — див. L06.
Рекомендація: пояснити авторство при публікації й визначити окремий процес стирання/анонімізації автора.

### D06. Фото та сертифікати — C / I

Мобільний [CloudinaryService.uploadImage](../../../../bookme_mobile/src/app/services/cloudinary.service.ts#L23)
надсилає файл як data URL, upload preset і folder безпосередньо до Cloudinary `/image/upload`.
У [PhotoPickerComponent.takePicture → uploadPending](../../../../bookme_mobile/src/app/shared/photo-picker/photo-picker.component.ts#L117)
завантаження починається одразу після вибору/зйомки, ще до збереження батьківської форми;
у форму повертається `secure_url`. Відмова від збереження форми не означає, що файл не покидав пристрій.
Backend зберігає URL; самостійні image-delete endpoints викликають Cloudinary destroy з перевіркою owner namespace.
Сертифікат зберігається під `SALON#…/CERTIFICATE#…` або `MASTER#…/CERTIFICATE#…` разом із URL файлу й метаданими.
Окреме видалення сертифіката спочатку стирає запис DynamoDB, потім best-effort файл; видалення скану очищує fileUrl.
Джерела: [destroyOwnedCloudinaryAsset](../../../../bookme-backend/packages/shared/src/services/cloudinary.service.ts#L189),
[salon create/deleteCertificate](../../../../bookme-backend/services/salon-api/src/services/certificate.service.ts#L6),
[master create/deleteMasterCertificate](../../../../bookme-backend/services/master-api/src/services/certificate.service.ts#L9).
Наслідок: можливий файл без запису після невдалого cleanup; видалення окремого сертифіката не тотожне видаленню акаунта.
Рекомендація: включити Cloudinary та залишкові файли в процедуру остаточного очищення; не обіцяти видалення лише на підставі зміни URL.

### D07. Пошук, голосовий текст і геолокація — C / I

`POST /client/search` приймає текст query, `source: typed|voice`, locale, deviceTimezone і фільтри,
включно з latitude/longitude. Endpoint публічний; parser працює з текстом та локальними правилами.
`GET /client/discovery/nearby` приймає координати у query string; обидва сценарії мають шлях без координат.
Джерела: [searchRequestSchema](../../../../bookme-backend/services/client-api/src/schemas/search.schema.ts#L19),
[search handler](../../../../bookme-backend/services/client-api/src/handlers/search/post.ts#L5),
[executeSearch](../../../../bookme-backend/services/client-api/src/services/search.service.ts#L291),
[nearbyDiscoveryQuerySchema](../../../../bookme-backend/services/client-api/src/schemas/salon.schema.ts#L21),
[nearby без координат](../../../../bookme-backend/services/client-api/src/services/salon.service.ts#L187).
Наслідок: розпізнаний голосовий текст і точні координати можуть надійти в AWS API; source=voice не означає аудіофайл.
I: у простеженому search-шляху немає поля аудіо, зовнішнього STT/LLM-виклику чи запису історії query/координат користувача.
Це не перевірка платформного розпізнавача або access logs поза application-кодом.
Рекомендація: окремо описати текст у BookMe та обробку мовлення ОС; перевірити query-string access logs і зберегти пошук без геолокації.

### D08. Push та inbox — C

Реєстрація пристрою зберігає raw push token, його hash, user ID, роль, платформу, enabled, lastSeenAt і timestamps.
Inbox містить текст, тип, ID пов'язаної події/бронювання та isRead. FCM отримує token, title/body і data.
Текст бізнес-сповіщення може містити ім'я клієнта, послугу й час візиту; iOS payload має APNs-конфігурацію.
Джерела: [claimPushToken](../../../../bookme-backend/packages/shared/src/services/notification.service.ts#L335),
[createUserNotification](../../../../bookme-backend/packages/shared/src/services/notification.service.ts#L261),
[businessBody](../../../../bookme-backend/packages/shared/src/services/appointment-notification.service.ts#L110),
[sendToDevice](../../../../bookme-backend/packages/shared/src/services/firebase-push.service.ts#L385).
Наслідок: push-провайдер обробляє ідентифікатор пристрою та вміст повідомлення, а не тільки факт доставки.
Рекомендація: відобразити це в політиці й деклараціях; перевірити доцільність імен/послуг на екрані блокування.

### D09. Діагностика — C / U

Logger передає request ID, function/service/stage, помилки та контекст; `safeLogData` застосовує redaction.
Sentry запускається лише за непорожнього SENTRY_DSN; має `sendDefaultPii: false`, error/transaction/span/breadcrumb hooks.
Список маскує email, phone, імена, query/transcript/speech, latitude/longitude, токени й чутливі DB-key prefixes.
Джерела: [createRequestLogger](../../../../bookme-backend/packages/shared/src/utils/logger.ts#L52),
[errorMiddleware](../../../../bookme-backend/packages/shared/src/middleware/errorMiddleware.ts#L44),
[initSentry](../../../../bookme-backend/packages/shared/src/monitoring/sentry.ts#L37),
[DEFAULT_SENSITIVE_LOG_FIELDS](../../../../bookme-backend/packages/shared/src/monitoring/privacy.ts#L17).
Наслідок: існують технічні журнали й умовна інтеграція Sentry; redaction не доводить відсутності всіх персональних даних у довільному тексті.
U: значення DSN у production, retention/access у CloudWatch/Sentry, фактичні payload-и та IP-логування інфраструктурою не перевірено.
Рекомендація: перевірити конфігурацію/зразки без персональних даних; не брати коментар про порожній DSN за доказ поточного production.

### D10. Підтримка та вікові умови — O / C / U

O: tickets передбачають підтримку email/FormBold та правила «клієнти 16+, представники бізнесу 18+».
Джерела: [ticket04: підтримка](../issues/04-faq-contact-support.md#L11), [ticket06: вік](../issues/06-terms-of-use.md#L14).
C: `createProfileSchema`, `createSalonSchema`, `createMasterSchema` не містять DOB/age чи підтвердження віку;
registration handlers перевіряють identity email і делегують створення без age gate.
Джерела: [client schema](../../../../bookme-backend/services/client-api/src/schemas/profile.schema.ts#L6),
[salon schema](../../../../bookme-backend/services/salon-api/src/schemas/salon.schema.ts#L29),
[master schema](../../../../bookme-backend/services/master-api/src/schemas/master.schema.ts#L32),
[salon handler](../../../../bookme-backend/services/salon-api/src/handlers/salon/create-account.ts#L72),
[master handler](../../../../bookme-backend/services/master-api/src/handlers/profile/create-master-account.ts#L24).
Наслідок: вікові правила є умовою користування, не перевіреною технічною гарантією.
U: обробка поштової скриньки та FormBold retention не встановлюються цим backend; frontend-шлях описаний в загальному аудиті.
Рекомендація: пояснити фактичні канали підтримки й відсутність технічної перевірки віку; не додавати неіснуючий backend support endpoint.

## Ролі постачальників

Кожний рядок описує технічну роль, а не встановлює юридичний статус сторін чи країни всіх субпроцесорів.

| Постачальник / рівень | Дані та підтверджений шлях | Наслідок і подальша дія |
| --- | --- | --- |
| AWS: Lambda, API Gateway, DynamoDB, Cognito — C | API, профілі, бронювання, inbox та авторизація; [provider/config](../../../../bookme-backend/services/client-api/serverless.yml#L5), D01–D08. У конфігурації region=eu-central-1. | Описати хостинг/сховище/авторизацію; U для фактичної production-топології, реплік і backups, не обіцяти виключно одну країну обробки. |
| AWS Amazon Location — C | Адреса бізнесу: вулиця, будинок, місто, postal code, країна передаються `GeocodeCommand` з `IntendedUse: Storage`; [geocodeInput](../../../../bookme-backend/packages/shared/src/services/moldova-geocoding.service.ts#L102), [виклик при створенні салону](../../../../bookme-backend/services/salon-api/src/services/salon.service.ts#L229). | Координати бізнесу обчислюються з адреси, це інший потік, ніж GPS клієнта; включити геокодування в список цілей/отримувачів. |
| AWS SES / Cognito email — C / U | SES передає email одержувача й зміст запрошення майстру: [sendInviteEmail](../../../../bookme-backend/services/salon-api/src/handlers/master/create-invite.ts#L71), [sendEmail](../../../../bookme-backend/packages/shared/src/services/ses.service.ts#L108). Cognito має [custom-message trigger](../../../../bookme-backend/services/salon-api/src/handlers/cognito/custom-message.ts#L1). | Описати службові листи; U для фактичної console-прив'язки trigger та доставки Cognito, перевірити її окремо. |
| AWS S3 — C конфігурація, U активний потік | IAM/config та [s3Service](../../../../bookme-backend/packages/shared/src/services/s3.service.ts#L66) існують; bounded search не знайшов активного service caller для upload фото, лише приклад у test handler. | Наявність SDK/дозволів не доводить використання S3 для нинішніх фото; перевірити bucket inventory перед такою заявою. |
| Cloudinary — C | Фото/скани, URL, owner namespace; [destroyOwnedCloudinaryAsset](../../../../bookme-backend/packages/shared/src/services/cloudinary.service.ts#L189), D06. | Описати окреме медіасховище; включити файли, CDN і невдалі cleanup у процес видалення. |
| Firebase Cloud Messaging / APNs — C шлях, U delivery | Backend надсилає raw token і payload до FCM, включає `apns.payload`; [sendToDevice](../../../../bookme-backend/packages/shared/src/services/firebase-push.service.ts#L385). | Firebase — транспорт push; APNs — iOS-гілка доставки, не окремий backend endpoint. Перевірити production credentials/delivery й retention провайдерів. |
| Google / Apple sign-in — C | Cognito pre-signup розпізнає Google/SignInWithApple, email/email_verified і provider subject; пов'язує з native identity: [SOCIAL_PROVIDER_NAMES](../../../../bookme-backend/services/salon-api/src/handlers/cognito/pre-signup.ts#L34), [linking](../../../../bookme-backend/services/salon-api/src/handlers/cognito/pre-signup.ts#L113). | Це провайдери входу, а не доказ передачі їм усіх бронювань. Видалення Cognito не видаляє Google/Apple акаунт; перевірити відв'язування/revocation у мобільному потоці. |
| Sentry — C умовна інтеграція, U увімкнення | Помилки/trace-контекст із redaction, D09. | Не заявляти безумовний збір або повну відсутність діагностики без конфігурації релізу. |
| FormBold / email підтримки — O для контракту, U backend retention | [ticket04](../issues/04-faq-contact-support.md#L11) задає name/email/message; backend не є підтвердженим обробником цієї форми. | Дані звернення мають окремого отримувача й mailbox; звірити frontend, доступ персоналу й процедуру очищення окремо. |

## Видалення трьох ролей

### L01. Спільна послідовність — C

Усі три auth-only handlers викликають `deleteAccountForUser` і після повернення відповідають `noContent()`:
[client handler](../../../../bookme-backend/services/client-api/src/handlers/profile/delete-account.ts#L4),
[salon handler](../../../../bookme-backend/services/salon-api/src/handlers/salon/delete-account.ts#L4),
[master handler](../../../../bookme-backend/services/master-api/src/handlers/profile/delete-account.ts#L4).

1. `await softDelete(userId)` — рольові зміни з таблиці нижче.
2. `await purgeUserNotificationData(userId)` — сторінками стирає лише `USER#/NOTIFICATION#` та `USER#/PUSH_DEVICE#`.
3. Інвалідує локальний account-status cache; намагається Cognito global sign-out, потім AdminDeleteUser.
4. Після успішного Cognito cleanup звільняє email-lock, якщо отримав email з профілю.
5. Для salon/master best-effort звільняє всі short links/handles.

Джерела: [deleteAccountForUser](../../../../bookme-backend/packages/shared/src/services/account-deletion.service.ts#L24),
[purgeUserNotificationData](../../../../bookme-backend/packages/shared/src/services/notification.service.ts#L468),
[purgeUserItemsByPrefix](../../../../bookme-backend/packages/shared/src/services/notification.service.ts#L553),
[deleteCognitoUser](../../../../bookme-backend/packages/shared/src/services/cognito.service.ts#L137).
Наслідок: процес складається з окремих операцій і не є однією атомарною транзакцією.
Рекомендація: фіксувати результат кожного етапу й дати підтримці безпечний повторний cleanup.

### L02–L04. Рольові зміни та залишки — C для операцій, I для висновку про повноту

| Роль / маршрут | Що змінюється | Що цей шлях не стирає | Наслідок / наступна дія |
| --- | --- | --- | --- |
| L02 Client — DELETE `/client/account` | `USER#/PROFILE`: isActive=false, deletedAt; видаляє належний цьому user phone lookup. [softDeleteProfileByUserId](../../../../bookme-backend/services/client-api/src/services/profile.service.ts#L187); [route](../../../../bookme-backend/services/client-api/serverless.yml#L272). | Сам профіль з email, телефоном, ім'ям, avatarUrl/email-index; APPT, REVIEW, Cloudinary-файли та повідомлення в чужих inbox. | Зупинка акаунта не є анонімізацією; потрібне очищення цих копій за узгодженими правилами. |
| L03 Salon — DELETE `/salon/account` | Вимикає `SALON#/PROFILE` та наявний `USER#/PROFILE`, виставляє deletedAt; позначає search index dirty. [softDeleteSalonAccountByUser](../../../../bookme-backend/services/salon-api/src/services/salon.service.ts#L405); [route](../../../../bookme-backend/services/salon-api/serverless.yml#L213). | Профілі, owner-master/інші salon-master зв'язки, послуги, години, сертифікати, APPT/REVIEW, файли; не видаляє Cognito інших майстрів. | Не заявляти каскадне видалення всіх майстрів/історії. Окремо узгодити долю активних зв'язків, записів і копій даних. |
| L04 Master — DELETE `/master/account` | Вимикає наявні `USER#/PROFILE` і `MASTER#/PROFILE`; якщо є активний salon-link, транзакційно ставить INACTIVE, звільняє link-lock і позначає index dirty. [softDeleteMasterAccountByUser](../../../../bookme-backend/services/master-api/src/services/master.service.ts#L797); [route](../../../../bookme-backend/services/master-api/serverless.yml#L218). | Профілі, неактивний salon-link з даними майстра, послуги, години, сертифікати, APPT/REVIEW, Cloudinary-файли. Немає автоматичного скасування майбутніх записів у цьому шляху. | Відокремити видалення акаунта від завершення співпраці; узгодити залишковий розклад і дані салону. |

Для L03 існуюча функція `deleteSalon` є rollback незавершеної реєстрації,
а не callback видалення акаунта: [deleteSalon](../../../../bookme-backend/services/salon-api/src/services/salon.service.ts#L440).
Для L04 `DELETE /worker/account` означає завершення співпраці, а не повне видалення профілю;
account-delete навмисно не надсилає MASTER_LEFT_SALON: [коментар і окремий callback](../../../../bookme-backend/services/master-api/src/services/master.service.ts#L791).
Наслідок: назва схожої функції/маршруту не доводить cascade. Рекомендація: пояснити користувачу саме його дію.

### L05. Часткове очищення та авторизація — C / I

| Доказ | Практичний наслідок | Рекомендоване виправлення |
| --- | --- | --- |
| C: `purgeUserNotificationData` не перехоплюється до Cognito-кроку; [порядок](../../../../bookme-backend/packages/shared/src/services/account-deletion.service.ts#L29). | I: помилка purge після soft-delete може залишити Cognito й частину даних; наступний auth-запит може вже відхилятися як deleted. | Черга/reconciliation зі станами й retry поза видаленим user session. |
| C: Cognito/email/short-link помилки ловляться та логуються; email-lock знімається лише після успішного Cognito delete. [cleanup](../../../../bookme-backend/packages/shared/src/services/account-deletion.service.ts#L33). | Успішна HTTP-відповідь не доводить успіх усіх зовнішніх cleanup; адреса може лишитися зайнятою. | Операційний контроль невдалих кроків; не обіцяти гарантоване повторне використання email одразу. |
| C: `isAccountSoftDeleted` перевіряється middleware; account-status cache має 30s TTL, read error повертає null. [auth](../../../../bookme-backend/packages/shared/src/middleware/authMiddleware.ts#L135), [cache/read](../../../../bookme-backend/packages/shared/src/services/account-status.service.ts#L53). | I: локальна інвалідація одного Lambda не гарантує миттєве блокування всіх інших; fail-open читання не є доказом абсолютної негайності. | Перевірити відкликання чинних сесій/кеші та політику відмови при read error. |
| C: notification purge охоплює тільки USER-prefixes, а `PUSH_TOKEN#hash/OWNER` має userId/role. [purge](../../../../bookme-backend/packages/shared/src/services/notification.service.ts#L468), [owner row](../../../../bookme-backend/packages/shared/src/services/notification.service.ts#L350). | Залишається global pointer токена; це не raw-token device row, але все ще зв'язок із user ID. | Умовно видаляти pointer, якщо він досі належить користувачу; перевірити гонку переприв'язування пристрою. |
| C: client retry одразу повертає email, якщо профіль уже deleted; phone lookup очищується нижче. [softDeleteProfileByUserId](../../../../bookme-backend/services/client-api/src/services/profile.service.ts#L193). | I: якщо видалення lookup впало після зміни профілю, цей повтор не повторить очищення lookup. | Включити phone lookup у reconciliation та перевірку завершеності. |

### L06. Публічний автор після видалення клієнта — C / I

Client soft-delete зберігає avatarUrl; відгук зберігає clientName.
`loadAvatarUrlByClientId` читає профілі без перевірки isActive/deletedAt, після чого public review DTO повертає аватар та ім'я.
Джерела: [soft-delete](../../../../bookme-backend/services/client-api/src/services/profile.service.ts#L199),
[avatar enrichment](../../../../bookme-backend/services/client-api/src/utils/client-avatar.util.ts#L12),
[public DTO](../../../../bookme-backend/services/client-api/src/mappers/salon-detail.mapper.ts#L166).
Наслідок I: на активній сторінці бізнесу автор видаленого акаунта може залишитися публічно впізнаваним; production не відтворювався.
Рекомендація: окреме privacy-виправлення публічного enrichment та очищення/анонімізації review snapshots; визначити правила збереження тексту відгуку.

### L07. Файли та зовнішнє остаточне очищення — C / O / U

C: account-delete не викликає Cloudinary. Фраза «Cloudinary, etc.» у
[accounts playbook](../../../../bookme-backend/project-constitution/playbooks/accounts.md#L8) не відповідає простеженому
[deleteAccountForUser](../../../../bookme-backend/packages/shared/src/services/account-deletion.service.ts#L24).
Окремий [cleanup-orphaned-certificate-scans](../../../../bookme-backend/tools/cleanup-orphaned-certificate-scans.mjs#L11)
є операторським dry-run/apply tool для файлів, на які вже немає CERTIFICATE reference; він не є account purge.
Оскільки account-delete лишає сертифікати, сам цей tool не доводить очищення їхніх сканів після видалення акаунта.
Наслідок: для остаточного очищення потрібен зовнішній процес, що охопить DynamoDB-копії, Cloudinary, auth-залишки,
повідомлення/журнали, звернення підтримки й резервні копії; backend не підтверджує існування повного runbook.
Рекомендація: виправити playbook окремою задачею, погодити оператора/ідентифікацію запиту, список сховищ і доказ завершення.

O: «запит підтримці — до 30 днів» та «резервні копії — до 90 днів» є підтвердженнями власника,
зафіксованими в [ticket05](../issues/05-privacy-account-deletion.md#L14), а не перевіреною автоматизацією.
U: backup policy, snapshots, логи виконання purge та реальний строк відновлюваності не перевірено.
Джерело межі C: account-delete не встановлює purge deadline/TTL;
[scheduled jobs](../../../../bookme-backend/services/client-api/serverless.yml#L391) обслуговують індекс/вітрину/курси, не account purge.
Наслідок: ці строки не можна подавати як гарантію перевіреного коду або переносити на всі категорії логів/звернень.
Рекомендація: підтвердити runbook та retention кожного сховища з власником, зокрема поведінку при відновленні backup.

## Межі перевірки та наступні докази

Перевірено статичні handler → service → storage/provider шляхи, DTO, схеми й конфігурацію трьох сервісів.
Обмежений пошук `birth|dateOfBirth|dob|age|minor|adult` у registration schemas/handlers не знайшов age gate;
пошук `s3Service` не знайшов активного business caller; пошук support/FormBold у server sources не встановив support ingestion.
Це обмежені негативні результати, не твердження про все production-середовище.
Не запускалися backfill/cleanup scripts, deploy, cloud console або реальні видалення/повідомлення.

Подальша перевірка: зіставити commit з розгорнутим кодом; відтворити три видалення на тестових акаунтах із
профілем, фото, сертифікатом, відгуком та майбутнім записом; перевірити часткові відмови й всі сховища після операції.
Окремо отримати evidence backup/retention, конфігурації провайдерів та завершення support-request.
До цього результати C/I придатні для точного опису локальної реалізації та планування виправлень,
а гарантії релізу/строків/повного стирання залишаються O/U.
