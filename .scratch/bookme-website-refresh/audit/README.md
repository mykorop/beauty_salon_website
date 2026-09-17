# Аудит дозволів і даних BookMe

Дата перевірки: **17 вересня 2026 року**. Підстава: [задача 02](../issues/02-permissions-data-audit.md). Матеріал для власника продукту, задачі про політику конфіденційності та окремих мобільних/серверних виправлень.

## Як читати докази

- [Дозволи Android та iOS](permissions.md): декларації, плагіни, виклики, момент запиту, відмова, альтернативи та передані дані для обох застосунків.
- [Дані, постачальники й серверне видалення](data-lifecycle.md): облікові записи, бронювання, відгуки, бізнес-профілі, фото, сертифікати, AWS, Cloudinary, Firebase/APNs, Sentry, Google/Apple та залишкові дані.
- Цей файл: межі доказів, локальні дані й користувацькі шляхи видалення, FormBold, зіставлення магазинів та передача результатів наступним задачам.

Рівні підтвердження в аудиті:

| Рівень | Що він означає |
| --- | --- |
| **C — код** | Безпосередньо перевірений локальний код/конфігурація; не доказ виконання у production. |
| **P — публічне джерело** | Доступна сторінка магазину або офіційна документація, прочитана в дату аудиту. Декларація розробника не є вимірюванням застосунку. |
| **I — висновок** | Наслідок простеженого коду; зазначено межі висновку. |
| **O — власник** | Підтвердження власника, зафіксоване в задачах; не перевірена автоматизація. |
| **U — неперевірено** | Доказ недоступний або перевірка виходить за межі цього аудиту. |

Сам дозвіл у manifest/Info.plist не доводить отримання чи передачу даних. Відсутність виклику в дослідженому шляху також не доводить відсутності будь-якої обробки всередині SDK або сервісу.

## Зафіксований стан і межі перевірки

| Репозиторій | Перевірена ревізія | Стан на початку |
| --- | --- | --- |
| `bookme_mobile` | `bcbc1c6d44b49311da2a345ac69af79f8d1e4e9f` | Чистий робочий каталог. Один workspace, клієнт `md.bookme.client`, бізнес `md.bookme.business`; бізнес має ролі салону й майстра. |
| `bookme-backend` | `8b5ad7df67cb51ac8e1da1a0066c38e022d7019a` | Чистий робочий каталог; API клієнта, салону, майстра та shared-пакет. |
| `bookme_website` | `44b73acdffb8b296ee396fd39cc44e2c1044dbcd` | `main`; задачі 02–09 уже існували як untracked. У цій роботі змінено лише аудит і задачу 02. |

Посилання на код відносні до цієї папки та працюють у спільному workspace з трьома сусідніми репозиторіями. `#L…` позначає рядок у зазначеній ревізії; назви функцій у тексті допомагають знайти доказ після зсуву рядків. Поза цим workspace потрібно отримати відповідні репозиторії на наведених SHA. Це не публічні посилання на персональні записи.

Перевірено tracked native-проєкти Android/iOS, конфігурації й списки плагінів, TypeScript/Swift/Java-код, серверні handlers/services/schemas та вебформу. Не запускали мобільні застосунки, provisioned E2E, серверні операції чи запити видалення. Не читали секретні змінні середовища, облікові записи користувачів, production-логи або бази даних. Приклади полів і ключів у звітах є назвами зі схем, а не значеннями користувачів.

**U:** немає APK/AAB/IPA, merged release manifests, фактичних системних діалогів на пристроях, мережевих трас релізу, доступу до Play Console/App Store Connect чи конфігурацій хмарних акаунтів. Збіг локального коду з опублікованими версіями не встановлено. Декларації в native source не можна називати перевіреним набором дозволів бінарника. Відомості про регіони, договори обробників, строки їхніх журналів і резервних копій потребують доказів власника/постачальника.

**Наслідок / наступний крок:** перед зміною магазинних анкет прив'язати цей аудит до version/build number та SHA кожного з чотирьох релізів, перевірити їхні злиті manifests/entitlements/privacy manifests і відмови на реальних пристроях. Ця робота готує перелік перевірок; самі анкети й релізи не змінює.

## Мобільний інтерфейс, локальні дані та підтримка

### W01. Де користувач видаляє обліковий запис — C

| Роль | Шлях і доказ | Що викликається |
| --- | --- | --- |
| Клієнт BookMe | Вкладка «Профіль» → «Видалити акаунт»: [client-profile.component.html](../../../../bookme_mobile/projects/client/src/app/pages/profile/client-profile.component.html#L83) | [`deleteClientAccount()` → `DELETE /client/account`](../../../../bookme_mobile/src/app/services/client-api.service.ts#L112) |
| Салон BookMe Business / BookMe Salon | Налаштування адміністратора → «Видалити акаунт»: [admin-settings.component.html](../../../../bookme_mobile/projects/salon/src/app/admin/pages/admin-settings/admin-settings.component.html#L80) | [`deleteSalonAccount()` → `DELETE /salon/account`](../../../../bookme_mobile/src/app/services/salon-api.service.ts#L200) |
| Майстер у бізнес-застосунку | Налаштування майстра → «Видалити акаунт»: [master-settings.component.html](../../../../bookme_mobile/projects/salon/src/app/master/pages/master-settings/master-settings.component.html#L125) | [`deleteMasterAccount()` → `DELETE /master/account`](../../../../bookme_mobile/src/app/services/master-api.service.ts#L144) |

[Спільна кнопка](../../../../bookme_mobile/src/app/shared/components/delete-account-button/delete-account-button.component.ts#L43) просить ввести `DELETE`, дозволяє скасування, обирає API за роллю, чекає успіху backend, очищає локальну сесію й переходить на вхід. Невірний код не запускає видалення; помилка API показується користувачу. Це текстове підтвердження дії, а не повторна перевірка пароля/віку.

**Наслідок:** успіх діалогу підтверджує завершення наявного backend-flow, але не повне стирання всіх даних. **Далі:** у задачі 05 зберегти три шляхи та описати серверні межі з [аудиту життєвого циклу](data-lifecycle.md); мобільний текст успіху погодити з фактичним очищенням окремою задачею.

### W02. Локальне очищення є вибірковим і best effort — C / I

[AuthService.clearSessionAfterBackendDeletion](../../../../bookme_mobile/src/app/services/auth.service.ts#L401) запускає hooks, очищення Amplify tokens/credentials і стану auth; помилки локального очищення не скасовують успішне серверне видалення. [clearSessionArtifacts](../../../../bookme_mobile/src/app/services/auth.service.ts#L587) прибирає OAuth intent, кеш останніх координат і social-profile drafts. [PushNotificationService.cleanupBeforeSignOut](../../../../bookme_mobile/src/app/services/push-notification.service.ts#L570) після видалення пропускає authenticated backend unregister, пробує native unregister і прибирає listeners/token зі стану. [Notification facade](../../../../bookme_mobile/src/app/notifications/notifications-facade.base.ts#L63) реєструє hook скидання inbox-стану.

Окремо зберігаються [мова](../../../../bookme_mobile/src/app/i18n/i18n.service.ts#L32), [вибір push](../../../../bookme_mobile/src/app/services/push-notification.service.ts#L663), [фільтри пошуку](../../../../bookme_mobile/projects/client/src/app/services/search-filters-storage.service.ts#L6), [місто](../../../../bookme_mobile/projects/client/src/app/services/search-city-storage.service.ts#L4), [стан onboarding](../../../../bookme_mobile/src/app/services/onboarding-storage.service.ts#L4) і [показані пояснення дозволів](../../../../bookme_mobile/projects/client/src/app/services/permission-explainer-storage.service.ts#L4). У простеженому account-deletion flow немає загального стирання цих сховищ. Guest [pending booking](../../../../bookme_mobile/projects/client/src/app/services/pending-booking.service.ts#L48) має власний save/consume flow; account deletion не є універсальним очищенням localStorage.

**Наслідок:** обіцянка «всі налаштування застосунку видалено» не підтверджена; native unregister теж не гарантований за будь-яких помилок. **Далі:** визначити, які налаштування мають переживати зміну акаунта, а які очищатися, і перевірити на пристроях повторний вхід після часткового збою. Не описувати бажану поведінку як уже реалізовану.

### W03. Sentry обох застосунків — C / U

[Client bootstrap](../../../../bookme_mobile/projects/client/src/main.ts#L10) і [salon bootstrap](../../../../bookme_mobile/projects/salon/src/main.ts#L10) викликають `initSentry`. [Конфігурація](../../../../bookme_mobile/src/app/monitoring/sentry.config.ts#L101) вмикає SDK за наявності enabled/DSN: native crash handling, logs, browser tracing, release/dist/environment/app tags; production trace sampling — `0.2`. [Фільтри](../../../../bookme_mobile/src/app/monitoring/sentry.config.ts#L29) редагують поля й URL з ключами query/search/transcript/utterance/speech у request/extra/contexts/breadcrumbs.

**Наслідок:** є технічна діагностика; фільтр пошукових полів не доводить видалення будь-яких імен, телефонів, координат, довільних exception messages або всіх native/log/trace payloads. Фактичні SDK events, налаштування організації та retention — **U**. **Далі:** на тестових даних перевірити кожен канал SDK, запровадити мінімізацію полів і підтвердити строки/регіон; згадати Sentry у політиці та оцінці магазинних категорій. Серверний Sentry розглянуто [окремо](data-lifecycle.md).

### W04. Технічної перевірки віку не виявлено — C / I / O

[Форма клієнта](../../../../bookme_mobile/src/app/auth/sign-up/sign-up.component.ts#L64), [форма салону](../../../../bookme_mobile/projects/salon/src/app/auth/salon-form.util.ts#L53), [форма та complete-profile майстра](../../../../bookme_mobile/projects/salon/src/app/master/master-form.util.ts#L57) збирають імена, email, пароль та відповідні бізнес-контакти/адресу; поля віку/дати народження й age validator відсутні. Пошук `birth`, `birthday`, `date.of.birth`, `dob`, `age`, `minimumAge` у спільній auth-області та client/business registration і перевірка цих форм не виявили age gate; серверні схеми перевірено в [data-lifecycle](data-lifecycle.md). Це обмежений висновок про досліджені шляхи, а не перевірка всіх зовнішніх identity-provider flows.

Клієнти **16+**, представники бізнесу **18+** — правило продукту зі [задачі 06](../issues/06-terms-of-use.md), рівень **O**, а не реалізована перевірка. **Наслідок:** чинне [«under 13»](../../../src/content/legal/en/privacy.md#L51) не узгоджене з цим правилом. **Далі:** задача 05/06 має виправити вікові умови без заяви про перевірку; рішення про окремий age gate належить мобільній/backend задачі.

### W05. Сайт передає звернення у FormBold — C / U

[ContactForm.astro](../../../src/components/ContactForm.astro#L8) має зовнішній HTTPS POST до FormBold з полями `name`, `email`, `message`. Ім'я та email обов'язкові; повідомлення не має `required`. З JavaScript надсилається `FormData` з `Accept: application/json`; без JavaScript — звичайний POST. Дані отримує FormBold, а не API BookMe. Поштова альтернатива для підтримки/видалення вказана на [сторінці видалення](../../../src/content/legal/en/delete-account.md#L13).

**Наслідок:** політика має охоплювати сайт і отримувача звернень. Код не показує фактичне пересилання у поштову скриньку, доступ співробітників, retention FormBold, поштового провайдера чи автоматичне видалення звернень разом з акаунтом (**U**). **Далі:** власнику зафіксувати ці операції та строки; у задачі 04/05 описати поля/ціль/отримувача й email-альтернативу. Тестові перевірки сайту перехоплюють FormBold-запити: реальних звернень під час аудиту не надсилали.

### W06. Строки 30/90 днів і зовнішнє остаточне очищення — O / U

За [задачею 02](../issues/02-permissions-data-audit.md) та [задачею 05](../issues/05-privacy-account-deletion.md), **до 30 днів для запиту підтримці** й **до 90 днів для резервних копій** — підтвердження власника. Джерело цього рівня — самі задачі; окремого операційного журналу чи доказу backup lifecycle не надано. Ці числа не виведені з TTL/cron/коду видалення й не є перевіреною гарантією. Твердження про шифрування всіх backup-копій також не перевірене.

Після програмного flow потрібен зовнішній процес для залишкових записів, медіа, технічних журналів і копій. [Серверний звіт](data-lifecycle.md) розрізняє те, що очищається зараз, і необхідний подальший процес. **Наслідок:** не можна називати account deletion миттєвим повним стиранням або автоматичною анонімізацією обліку салону. **Далі:** власнику надати відповідального, runbook, перелік систем і доказ виконання строків; затверджені винятки зі зберігання документувати окремо, не виводити правову підставу з факту залишення даних у коді.

## Магазинні декларації: що вдалося зіставити

Перевірка публічних сторінок — **17.09.2026**, без авторизації. Помилка інструмента доступу не означає, що застосунку або декларації немає в магазині.

| Застосунок / платформа | Джерело і результат | Рівень, наслідок і наступний крок |
| --- | --- | --- |
| BookMe / Android | [Google Play, md.bookme.client](https://play.google.com/store/apps/details?id=md.bookme.client): доступний Data Safety summary. Видно персональну інформацію, фото/відео й ще дві нерозкриті категорії; заявлено відсутність передачі третім сторонам, шифрування під час передачі та можливість запиту видалення. Сторінка показувала оновлення 02.08.2026; копія пошукового інструмента була кешована, тому це не live-перевірка релізу. | **P.** Назви профільних полів і фото відповідають наявним flows; дві інші категорії, підкатегорії та цілі не встановлені. Отримати export анкети та зіставити його з конкретним release SHA. |
| BookMe / Android, деталі | [Data Safety details](https://play.google.com/store/apps/datasafety?id=md.bookme.client): інструмент не зміг відкрити сторінку (`not safe to open`). | **U.** Не приписувати прихованим двом категоріям конкретні назви. Власнику експортувати повну анкету. |
| BookMe Business / Android | [Google Play, md.bookme.business](https://play.google.com/store/apps/details?id=md.bookme.business): `Cache miss`; варіант `&hl=en` також недоступний. | **U.** Зіставити фактичні Contacts, personal info, photos, identifiers, diagnostics і booking content після отримання анкети; зараз відповідність не підтверджена. |
| BookMe / iOS | [App Store, id6779576243](https://apps.apple.com/us/app/bookme/id6779576243): `Cache miss`; варіант `?l=en` також недоступний. | **U.** App Privacy не прочитано; отримати чинні data types, purposes, linked-to-user/tracking answers із App Store Connect. |
| BookMe Salon / iOS | [App Store, id6779576340](https://apps.apple.com/ua/app/bookme-salon/id6779576340?l=uk): `not safe to open`; URL без `?l=uk` повернув `Cache miss`. | **U.** Назву BookMe Salon пов'язано з BookMe Business за [затвердженими посиланнями задачі 03](../issues/03-client-business-homepage.md), а не за прочитаною storefront-сторінкою. Потрібна анкета цього застосунку. |

### W07. «No data shared» не означає відсутність мережевих отримувачів — P / C / I

У клієнтській декларації видно «No data shared with third parties». Код передає дані AWS, Cloudinary, push-інфраструктурі та діагностичним сервісам, а бронювання — виконавцю: [серверні потоки](data-lifecycle.md). Це **не автоматичний доказ неправильної анкети**: [визначення Google Play](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) передбачає винятки з категорії sharing для обробників, що діють від імені розробника, та певних дій, ініційованих користувачем. Застосовність винятку до кожного отримувача/договору не перевірена.

**Наслідок:** у політиці не можна перетворити магазинний ярлик на обіцянку «ми нікому не передаємо дані». **Далі:** звірити фактичні ролі й договори та задокументувати причину кожного checkbox у Play Console. Для Apple окремо оцінити практики SDK, зв'язок з акаунтом і tracking за [App Privacy Details](https://developer.apple.com/app-store/app-privacy-details/); відповіді Google не переносяться механічно в Apple.

### W08. Частковий збіг доступної анкети з кодом — P / C / U

| Видиме твердження клієнтського Google Play | Зіставлення з локальним кодом | Практичний наслідок / подальша дія |
| --- | --- | --- |
| Персональна інформація | Accounts, booking contact snapshots та review authors реально є: [data-lifecycle](data-lifecycle.md). **C/P** | Збіг на рівні категорії; перевірити підкатегорії name/email/phone/user ID, required/optional і цілі. |
| Фото/відео | Фото профілю та Cloudinary upload підтверджені; наявність слова «відео» в назві групи не доводить upload відео. **C/P** | Перевірити підкатегорії й не додавати в політику вигадану функцію відеозапису. |
| Ще дві категорії | Повні назви не отримані. **U** | З коду випливають кандидати для перевірки: location, push/device identifiers, diagnostics, search/user content. Наявність/відсутність їх в анкеті зараз невідома. |
| Шифрування під час передачі | HTTPS у FormBold/Cloudinary та мережеві інтеграції не є перевіркою всього трафіку мобільного релізу й SDK. **P/U** | Перевірити release endpoints та traffic; не переносити цю заяву на шифрування всіх даних у спокої/backup. |
| Можна запросити видалення | Є кнопки, рольові backend handlers і email-шлях. **C/P** | Збіг щодо можливості запиту; повнота стирання окремо не підтверджується цим ярликом. |

### W09. Черга перевірки категорій для кожного релізу — I / U

Це перелік для зіставлення, **не готові відповіді магазинних анкет**. Правила категоризації, передачу поза пристроєм і retention треба оцінювати для кожного отримувача за [Google Data Safety](https://support.google.com/googleplay/android-developer/answer/10787469?hl=en) та [Apple App Privacy](https://developer.apple.com/app-store/app-privacy-details/).

| Потік, підтверджений в аудиті | Релізи | Що потрібно звірити в export |
| --- | --- | --- |
| Акаунт, бронювання, контакти виконавця, reviews | Клієнт і бізнес, Android/iOS | Personal/contact info, user IDs, user content; зв'язок з акаунтом та цілі. Доказ: [data-lifecycle](data-lifecycle.md). |
| Координати пристрою / вибране місто | Клієнт, Android/iOS | Location, точність, optional collection; бізнес-адреса має інше походження. Доказ: [permissions](permissions.md). |
| Мікрофон → OS speech → редагований текст пошуку | Клієнт, Android/iOS | Розділити аудіо в системному recognizer та transcript у BookMe API; перевірити retention/постачальника до відповіді про audio/search data. Доказ: [permissions](permissions.md), [backend](data-lifecycle.md). |
| Вибраний контакт → ім'я/телефон у бронюванні | Бізнес, Android/iOS | Contacts і contact info. Підстава — передані вибрані поля, а не сам `WRITE_CONTACTS`. Доказ: [permissions](permissions.md). |
| Аватари, галереї, сертифікати | Обидва; бізнес має додаткові медіа | Photos/user content, Cloudinary як отримувач. Доказ: [data-lifecycle](data-lifecycle.md). |
| Push token, inbox/payload, Sentry | Клієнт і бізнес, Android/iOS | Identifiers, diagnostics, crash/performance data, можливий зв'язок з користувачем. Доказ: [permissions](permissions.md), W03 і [backend](data-lifecycle.md). |
| Вебзвернення FormBold | Сайт; не приписувати автоматично mobile-бінарнику | Поля/отримувачі/строки у політиці сайту; окремо перевірити, чи фактичний mobile-flow вбудовує цю форму. Доказ: W05. |

## Передача результатів у наступні задачі

1. **Задача 05 — першочергово:** замінити твердження про миттєве повне видалення, розрізнити деактивацію/очищення/зовнішній процес; описати отримувачів, contacts, voice, location і локальні залишки за цим аудитом. [Поточний текст видалення](../../../src/content/legal/en/delete-account.md#L11) перелічує знищення історії, reviews, фото й налаштувань, якого простежений flow не забезпечує. Джерела: W01/W02/W06 та [data-lifecycle](data-lifecycle.md); **C/I**. Юридичні підстави й винятки мають бути окремо підтверджені, не виведені з OS-дозволів.
2. **Окремі backend/mobile виправлення:** повнота deletion і повторне виконання після часткового збою, залишкові review author/avatar та медіа, push ownership, мінімізація контактних/фото/location дозволів, покриття діагностики фільтрами. Конкретні докази, наслідки й рекомендації — у [двох](permissions.md) [детальних звітах](data-lifecycle.md); **C/I**, без зміни коду в цій задачі.
3. **Власник/release перевірка:** чинні анкети чотирьох релізів, бінарні дозволи, фактичний OS-denial UX, договори/регіони/retention постачальників та зовнішній deletion runbook. Джерела: межі аудиту, W06–W09; **O/U**. Недоступний доказ залишено явною прогалиною, а не вигаданим підтвердженням.
4. **Задачі 04 і 06:** FormBold та підтримка за W05, вікові умови за W04. **C/O/U**. Аудит не публікує нові юридичні тексти й не змінює магазинні декларації.
