# Дозволи BookMe та BookMe Business

Дата: 2026-09-17. Мобільний commit: `bcbc1c6d44b49311da2a345ac69af79f8d1e4e9f`; checkout був чистим. `client` — BookMe (`md.bookme.client`), `salon` — BookMe Salon / Business (`md.bookme.business`), із ролями салону й майстра. [Огляд аудиту](README.md), [серверні дані та видалення](data-lifecycle.md).

Це статичне читання коду. Застосунки/бекенд не запускалися; native sync, встановлення залежностей і зміни production не виконувалися. **C** нижче означає підтверджений код застосунку або pinned-залежності; **I** — висновок із коду; **U** — не перевірено на пристрої/бінарнику. Декларація чи SDK у конфігурації не доводять фактичного збору даних. Рівні інших типів доказів визначені в [огляді](README.md).

## Відтворення native-доказів

`node_modules` мобільного checkout відсутній. Публічні npm-архіви нижче прочитано у тимчасовому каталозі; SHA-512 кожного звірено з `integrity` відповідного запису [package-lock.json][lock]. Скрипти пакетів не виконувалися. Посилання N ведуть на архів конкретної версії; наведені шляхи відносні до його `package/`. Для відтворення потрібні архів і lock, а не тимчасові файли цього сеансу. Решту транзитивних SDK повністю не досліджували.

| Доказ | Версія; файл, рядки та символи |
| --- | --- |
| [N-contacts][ncontacts] | `7.2.0`; `android/src/main/java/getcapacitor/community/contacts/ContactsPlugin.java:25–49,208–247` — alias, `pickContact`, `pickContactResult`; `ios/Sources/ContactsPlugin/ContactsPlugin.swift:35–79,196–232`; `ContactPayload.swift:63–171` — `fillData`. |
| [N-core][ncore] | `@capacitor/android 7.4.5`; `capacitor/src/main/java/com/getcapacitor/Bridge.java:1217–1261` — `getPermissionStates`. |
| [N-camera][ncamera] | `7.0.3`; `android/src/main/java/com/capacitorjs/plugins/camera/CameraPlugin.java:342–408,788–840` — picker, `requestPermissions`, `getPermissionStates`; `ios/Sources/CameraPlugin/CameraPlugin.swift:26–77,449–469,515–528` — permissions, `showPhotos`, PHPicker. |
| [N-media][nmedia] | `8.0.1`; `android/src/main/java/com/getcapacitor/community/media/MediaPlugin.java:80–162` — APIs, `isGalleryMode`, `isStoragePermissionGranted`; `ios/Plugin/MediaPlugin.swift:176–208,293–317` — add-only save/authorization. |
| [N-location][nlocation] | `7.1.8`; `android/src/main/kotlin/com/capacitorjs/plugins/geolocation/GeolocationPlugin.kt:25–42` — fine/coarse aliases; `ios/Sources/GeolocationPlugin/GeolocationPlugin.swift:102–138` — `requestPermissions`, `.whenInUse`. |
| [N-push][npush] | `7.0.6`; `android/src/main/java/com/capacitorjs/plugins/pushnotifications/PushNotificationsPlugin.java:26–28,79–100` — POST_NOTIFICATIONS/API-level handling; `ios/Sources/PushNotificationsPlugin/PushNotificationsHandler.swift:8–16` — `UNUserNotificationCenter`. |
| [Vendored speech][speech-package] | `7.0.1-bookme.2`; native-файли включені у мобільний commit; посилання на конкретні символи нижче. |

**C:** джерела застосунку й pinned-пакетів доступні для повторного читання. **U:** це не inventory SDK поточного магазинного бінарника. **Наслідок:** підтвердження конфігурації не можна видавати за перевірку релізу. **Дія:** зіставити release APK/AAB/IPA, merged manifests і підписані entitlements окремо.

## Native-декларації та підключення

| Застосунок / ОС | Заявлено і підключено | Рівень, наслідок, наступна дія |
| --- | --- | --- |
| BookMe / Android | [Manifest][client-manifest]: INTERNET, POST_NOTIFICATIONS, ACCESS_COARSE_LOCATION, ACCESS_FINE_LOCATION і GPS feature. RECORD_AUDIO надходить із [speech manifest][speech-manifest]. [Allowlist][client-config] та [Gradle settings][client-gradle]: camera/media/push, client-only location/speech; contacts відсутній. | **C.** Не приписувати клієнту контакти бізнесу. Звірити merged manifest: дозволи решти транзитивних бібліотек тут не оголошені перевіреними. |
| BookMe / iOS | [Info.plist][client-plist]: camera, microphone, speech, photo-library read/add, location WhenInUse **і** AlwaysAndWhenInUse, рядок user notifications; background `remote-notification`. [Podfile][client-pods] і [lock][client-pods-lock]: camera/media/push/location/speech, FirebaseMessaging. | **C.** Purpose string не дорівнює фактичному запиту. N-location просить `.whenInUse`; Always-ключ не доводить фонового GPS. Перевірити його необхідність перед зміною декларацій. |
| Business / Android | [Manifest][salon-manifest]: INTERNET, POST_NOTIFICATIONS, READ_CONTACTS, WRITE_CONTACTS. [Allowlist][salon-config] і [Gradle settings][salon-gradle]: contacts/camera/media/push; location/speech відсутні. | **C.** WRITE пояснюється alias плагіна, не знайденим app-записом у телефонну книгу. Перевірити merged manifest і обидві бізнес-ролі. |
| Business / iOS | [Info.plist][salon-plist]: camera, contacts, photo-library read/add, user notifications; `remote-notification`. [Podfile][salon-pods] містить contacts/camera/media/push та FirebaseMessaging; location/speech немає. **Contacts відсутній у [Podfile.lock][salon-pods-lock].** | **C; бінарник U.** Намір конфігурації й зафіксоване CocoaPods-розв’язання розходяться. Окремим виправленням синхронізувати native-проєкт та перевірити склад збірки. |

Обидва apps використовують [commonPlugins/sharedPlugins][shared-config], зокрема Browser, Share, Clipboard, Badge, Sentry і CapacitorHttp. У manifests пакетів N-camera/N-contacts/N-media немає CAMERA/contact/storage dangerous permissions; камера містить query для зовнішньої camera activity. N-media має storage/media aliases лише для опційного `androidGalleryMode`; поточний shared config його не вмикає, а default плагіна — `false`. **C; наслідок:** alias READ_MEDIA_IMAGES/VIDEO у класі плагіна не є доказом такого дозволу у програмі. **Дія:** перевірити повний релізний manifest; не виводити збір даних із самого переліку SDK.

Точні iOS-ключі: в обох [client][client-plist] / [business][salon-plist] є `NSCameraUsageDescription`, `NSPhotoLibraryUsageDescription`, `NSPhotoLibraryAddUsageDescription`, `NSUserNotificationsUsageDescription`; у client додатково `NSMicrophoneUsageDescription`, `NSSpeechRecognitionUsageDescription`, `NSLocationWhenInUseUsageDescription`, `NSLocationAlwaysAndWhenInUseUsageDescription`; у business — `NSContactsUsageDescription`. `UIBackgroundModes = remote-notification` стосується push, не GPS. **C; наслідок:** рядок `NSUserNotificationsUsageDescription` сам не надає дозвіл — фактичний виклик `UNUserNotificationCenter` наведено нижче. **Дія:** звіряти ключі разом із native API та артефактом релізу.

`INTERNET` в обох Android manifests забезпечує мережеві API/upload/push-шляхи, наведені нижче; окремого користувацького `requestPermissions(INTERNET)` у цих flows немає. **C / I:** відсутність мережі або помилка запиту не є відмовою в небезпечному runtime-дозволі; офлайн-повнота застосунку тут не перевірялася. Передані дані залежать від дії, а не самого `INTERNET`. **Дія:** перевіряти мережеві помилки окремо від OS-denial UX. GPS `uses-feature` у client manifest — декларація обладнання, не додатковий дозвіл на дані.

## Матриця користувацьких дій і даних

Декларації кожного рядка наведено вище. Спільні рядки явно охоплюють обидва застосунки. Усі описані виклики — **C**, очікувані native-наслідки позначено **I**, фактична поведінка магазинних бінарників — **U**.

| Застосунок / ОС / можливість | Фактичний виклик і момент запиту | Відмова й альтернатива | Дані, практичний наслідок і наступна дія |
| --- | --- | --- | --- |
| BookMe / Android / location | [GeolocationService][geo]: checkPermissions → requestPermissions → getCurrentPosition; app приймає лише **fine** alias `location`. Search викликає [explainer][explainer] за потреби координат; [city-кнопка][city] — пряма користувацька дія. Головна має окремий ранній запит, P-02. | Без fine grant — `null`; approximate-only не приймається. Лишаються ручне місто й текстовий пошук; city-кнопка пропонує settings. | Координати кешуються у [clientLastCoordinates][coords], можуть надходити у [nearby][nearby] → [GET discovery/nearby][nearby-api] та [search filters][search-location]. **Наслідок:** nearby/radius залежать від fix; **дія:** підтримати coarse-only і перевірити відкликання. |
| BookMe / iOS / location | Ті самі JS-виклики; N-location просить `.whenInUse`. У перевіреному app-шляху одиничний fix, не watchPosition. | Відмова/помилка → `null`; місто, текст і settings доступні. | Ті самі координати, кеш і API. **Наслідок:** Always purpose string не доводить фонове відстеження; **дія:** перевірити purpose strings і перезапуск після відкликання. |
| BookMe / Android / microphone + speech | Кнопка мікрофона → explainer → [requestPermissionsWithUX][speech-service]; [native alias][speech-android] `speechRecognition` = RECORD_AUDIO, перевірений перед `startListening`. Окремого OS speech permission у цій реалізації немає. | Explainer можна закрити; denial → settings-alert; unavailable → toast. Лишається звичайний текстовий пошук. | Аудіо йде у системний SpeechRecognizer; конкретний провайдер/зовнішній трафік **U**. [runSearch][voice-search] передає transcript як `query`, `source: voice`, locale, deviceTimezone у [POST /client/search][search-api]. Власний BookMe audio-upload у цьому шляху не знайдений. **Дія:** розділити ОС-розпізнавання і передачу тексту в описі даних. |
| BookMe / iOS / microphone | [Plugin requestPermissions][speech-ios-permission] після speech authorization просить `AVAudioSession.requestRecordPermission`; [start][speech-ios-start] теж перевіряє mic. | Denial уніфікований у `speechRecognition: denied`; JS [isMicrophoneDenied][speech-denial] уточнює його через Permissions API / getUserMedia(audio), потім alert. Текстовий пошук доступний. | AVAudioEngine передає буфери recognizer. **Наслідок:** уточнення denial саме може запросити mic; **дія:** окремі native-статуси microphone/speech, без активного захоплення для діагностики (P-06). |
| BookMe / iOS / speech recognition | SFSpeechRecognizer.requestAuthorization — окремо від mic. [checkPermissions][speech-ios-permission] перевіряє лише speech. [SpeechService.start][speech-service] обмежує захоплення таймером 15 с; [beginRecognition][speech-ios-start] встановлює `requiresOnDeviceRecognition=false`. | Відмова speech блокує voice-modal; mic grant її не замінює. Лишається текстовий пошук. | Аудіобуфери/локаль — у Apple framework, transcript — у BookMe search. **I:** не можна обіцяти тільки локальне розпізнавання; конкретний network transfer **U**. **Дія:** перевірити обидва дозволи, online/offline й уточнити privacy-текст. |
| Business / Android / contacts | [Салонна][contact-form] / [майстерська][contact-master] кнопка `onPickFromContacts` → [ContactPickerService][contact-service] check/request alias `contacts` → pickContact з projection `{name:true,phones:true}`. N-contacts alias включає READ **і WRITE**; N-core вимагає grant обох. | Denied → settings-alert; plugin error → toast. Ручні name/phone лишаються. Кілька підтриманих номерів → вибір одного; невалідні/непідтримані номери не імпортуються як валідні. | Android застосовує projection до вибраного контакту; native metadata/contactId не включаються у `{name,phone}` сервісу. [Save][contact-save] надсилає clientName/clientPhone разом із записом. Запису у телефонну книгу чи завантаження всієї книги app-кодом не знайдено. **Дія:** замінити broad alias вузьким picker; WRITE не видаляти без зміни плагіна. |
| Business / iOS / contacts | Ті самі кнопки; N-contacts викликає CNContactStore.requestAccess і CNContactPickerViewController, приймає authorized/limited. **pickContact ігнорує projection** (P-01). | Відмова → settings, error → toast, ручний ввід доступний. Немає cancel callback; promise може не завершитися, app свідомо не ставить busy-lock [service][contact-service]. | Форма використовує/відправляє name/phone, але plugin може передати в JS інші доступні поля **одного вибраного контакту**. **Наслідок:** «ніколи не читаємо інші поля» не доведено; **дія:** виправити projection/cancel, перевірити limited contacts. |
| Обидва / Android / camera | «Зробити фото» у [PhotoCaptureService][photo] → checkPermissions → getPhoto(Camera). CAMERA не заявлений у app/plugin manifests; N-camera повертає camera granted, коли permission не declared, і відкриває зовнішню camera activity. | Поточний source-конфіг не вимагає app CAMERA prompt; cancel → cancelled. Альтернативи: готове фото або поточне зображення. | Отриманий DataUrl йде у [Cloudinary upload][cloudinary] через photo-picker/галерею. **Наслідок:** camera prompt не однаковий на двох ОС; **дія:** перевірити merged manifest та зовнішню камеру. |
| Обидва / iOS / camera | Та сама дія → Camera.requestPermissions(camera); N-camera → AVCaptureDevice.requestAccess(video), далі getPhoto. Purpose strings є в обох plist. | Denied → [settings-alert][denied], результат cancelled. Можна вибрати готове фото або лишити поточне. | В upload-flow надходить отримане фото; відеозапис цим шляхом не викликається. **Дія:** перевірити denial і повернення з settings на фізичному пристрої. |
| Обидва / Android / photo selection | «Галерея» → getPhoto(Photos) або pickImages для бізнес-batch [photo][photo]. N-camera повертає photos granted, використовує PickVisualMedia / PickMultipleVisualMedia. READ_MEDIA/storage permissions для цього source-шляху не declared. | Cancel нічого не змінює; є камера/поточне фото. Бізнес-вибір обмежується app-лімітом. | Читаються вибрані файли → DataUrl → Cloudinary; автоматичного імпорту всієї бібліотеки не знайдено. **Дія:** перевірити picker і ліміти на підтриманих Android. |
| Обидва / iOS / photo selection | App явно просить photos; N-camera викликає PHPhotoLibrary.requestAuthorization(readWrite) перед PHPicker. App приймає limited, native showPhotos очікує authorized. | Denied → alert до picker; limited може пройти app gate, але отримати plugin error (**I**, P-04). Є камера/поточне фото. | Передаються вибрані картинки, не вся бібліотека. **Наслідок:** permission gate ширший за простий вибір; **дія:** перевірити/переробити picker та full/limited/denied сценарії. |
| Обидва / Android / photo saving | Save у [QR modal][qr-ui] → [saveQrToGallery][qr] → Media.getAlbums/createAlbum/savePhoto(DataUrl,albumIdentifier,fileName). N-media default androidGalleryMode=false не просить storage permission. | Будь-яка помилка → загальний saveFailed і скидання cached album id; settings-alert немає. Є QR/share/copy link. | Згенерована QR-картка записується локально; сам save-шлях не завантажує її на сервер. **Дія:** перевірити видимість альбому і розрізнити permission/technical failures. |
| Обидва / iOS / photo saving | Та сама кнопка → Media.savePhoto(DataUrl), без getAlbums. N-media просить PHPhotoLibrary **addOnly**; AddUsageDescription є в обох apps. | Відмова → загальний saveFailed; лишаються QR/share/copy. | Додавання згенерованого фото, не читання альбому цим шляхом. **Дія:** пояснювати accessDenied й перевірити prompt/DataUrl на пристрої (P-08). |
| Обидва / Android / push | Startup [init][push] лише перевіряє вже наданий дозвіл. `enableFromUserGesture` просить після onboarding CTA, settings toggle чи booking prompt. N-push: POST_NOTIFICATIONS prompt на Android 13+; нижче 13 check/request повертає granted без такого dialog. | Denial не блокує onboarding/booking; вже denied → settings. Лишаються in-app inbox, записи/календар. | FCM token/platform → рольовий notifications/devices API; [push handler][push-data] обробляє title/body, appointmentId/notificationId/role. **Дія:** перевірити Android 12/13+, відкликання й OS-level вимкнення. |
| Обидва / iOS / push | Ті самі user gestures; N-push → UNUserNotificationCenter.requestAuthorization(alert,sound,badge). [Client AppDelegate][client-delegate] / [salon][salon-delegate] передають APNs token FirebaseMessaging і повертають FCM token у Capacitor. | Denial не блокує основну функцію; settings і «Не зараз» доступні. In-app inbox не залежить від доставки push. | APNs/Firebase routing tokens + повідомлення, FCM token у backend. Source [client entitlement][client-entitlements] / [salon][salon-entitlements] має development, production-підпис **U**. **Дія:** перевірити distribution entitlement і доставку; не називати source development доказом поломки. |

**Момент upload відрізняється від контактів. C:** [PhotoPickerComponent.takePicture/uploadPending][photo-picker] завантажує фото одразу після вибору, до Save батьківської форми. [BusinessImagesListComponent][business-images] також спершу uploads, потім зберігає список URL. [CloudinaryService.uploadImage][cloudinary] надсилає multipart `file`, preset, folder; значення конфігурації тут не відтворюються. Контакт лише заповнює форму, а clientName/clientPhone надсилаються на Save. **Наслідок:** скасування редагування форми не означає, що фото ніколи не передавалося. **Дія:** пояснювати цей timing і перевіряти cleanup незбережених uploads; серверний життєвий цикл — у [data-lifecycle.md](data-lifecycle.md).

Функціональне використання фото — аватари клієнта/бізнес-профілів, портфоліо та сертифікати через спільний photo-picker/бізнес-галерею. **C:** дозвіл ОС, локальне захоплення, upload файлу Cloudinary і збереження URL у BookMe — різні етапи. **Дія:** описувати їх окремо від загального дозволу на бібліотеку; не стверджувати читання всіх фото.

**C:** добровільні push-запити простежені у [onboarding client][client-onboarding], [business][salon-onboarding], [NotificationPromptService][post-booking], [EnableNotificationsModal][push-modal]. Вимкнення preference/sign-out запускає unregister; deletion cleanup пропускає повторний backend unregister після account purge [cleanupBeforeSignOut][push-cleanup]. **Наслідок:** OS permission, app preference, FCM/APNs token та backend registration — окремі стани. **Дія:** перевіряти всі під час logout/delete; опис видалення в огляді та серверному аудиті не замінює тест доставки.

## Знахідки для окремих мобільних виправлень

| ID / рівень | Доказ і знахідка | Наслідок | Подальше виправлення/перевірка |
| --- | --- | --- | --- |
| P-01 / C; payload на пристрої U | [ContactPickerService][contact-service] просить name/phones, але N-contacts iOS `ContactsPlugin.swift:216` не читає projection; `ContactPayload.fillData:63` умовно серіалізує available organization, birthday, note, emails, URLs, addresses, image, contactId. | Додаткові поля вибраного контакту можуть потрапити у JS, хоча форма передає лише name/phone. Це не доказ серверного збереження цих полів чи збору всієї книги. | Виправити projection; перевірити synthetic-контакт; скоригувати коментар «never reads» і майбутню політику. |
| P-02 / C | [SpecialistsComponent constructor/loadNearbyListings][nearby] при першому завантаженні без city викликає loadCurrentPosition → getCurrentPosition → permission; [explainer][explainer] у цей шлях не включений. | Головна може показати OS location prompt без explainer і без натискання. | Узгодити timing із search/city, перевірити fresh install/denial/повторний вхід. |
| P-03 / C | [GeolocationService][geo] перевіряє тільки location=granted; N-location має окремий coarseLocation alias. | Android approximate-only не використовується, хоча менш точний fix міг би бути достатнім. | Підтримати coarse-only для відповідних сценаріїв, перевірити nearby/radius. |
| P-04 / C + I | [PhotoCaptureService][photo] приймає limited; N-camera iOS `showPhotos:449` і callback очікують authorized, хоча далі відкривають PHPicker. | Limited може пройти app gate і завершитися plugin error; native результат U. | Узгодити обидва permission gates; перевірити full/limited/denied для single/multi фото. |
| P-05 / C; бінарник U | [Salon Podfile][salon-pods] включає contacts, [Podfile.lock][salon-pods-lock] — ні. | Наявність contacts у останній native-збірці не доведена; можливий plugin unavailable. | Native sync/pod resolution окремою зміною, узгоджений lock, перевірка артефакту. |
| P-06 / C | [isMicrophoneDenied][speech-denial] використовує getUserMedia(audio); [iOS checkPermissions][speech-ios-permission] повертає лише speech, request поєднує speech/mic. | Діагностика відмови може сама запросити mic; speech grant не доводить mic grant. | Окремі native-статуси без активного захоплення для діагностики. |
| P-07 / C | N-contacts Android pickContactResult не завершує call на cancel; iOS contactPickerDidCancel відсутній. [App service][contact-service] враховує це відсутністю busy-lock. | Форма зберігає ручний ввід, але promise/callback може лишитися pending. | Явний cancel-result у fork/оновленні, перевірка повторного відкриття. |
| P-08 / C | [QR save catch][qr] показує той самий saveFailed для accessDenied і технічних збоїв; [settings-alert][denied] тут не використаний. | Немає ясного шляху повернути photo-add permission. | Класифікувати denial, запропонувати settings/share/copy. |
| P-09 / C | [Client plist][client-plist] має AlwaysAndWhenInUse, N-location просить whenInUse; [salon plist][salon-plist] уже має photo keys, хоча [playbook][cap-playbook] ще каже їх додати. | Декларації/документація можуть спотворити privacy-опис. | З’ясувати вимогу Always purpose string pinned-плагіна, актуалізувати playbook; не заявляти доведений background GPS. |
| P-10 / C; реліз U | [Client][client-entitlements] / [salon][salon-entitlements] entitlements мають development; source/native lock не є release archive. | Production push і повний набір бінарних дозволів не доведені; source development не доводить помилки підписаного IPA. | Inspection distribution entitlements, merged manifest, SDK inventory та device denial/success матриця. |

## Межі майбутніх тверджень

Код підтверджує вибір/створення фото й upload Cloudinary, заповнення бізнес-форми контактом, координати та текст у BookMe search API, push registration і native speech framework. Він не підтверджує тотожність поточному магазинному релізу, весь merged permissions inventory, фактичний speech-трафік чи строки зберігання у провайдерів. **Практичний наслідок:** формулювання політики мають зберігати ці умови. **Наступний крок:** власник релізу надає артефакти та результати цільового device-аудиту на synthetic-даних; у цій роботі їх не створювали.

[lock]: ../../../../bookme_mobile/package-lock.json#L4097
[speech-package]: ../../../../bookme_mobile/plugins/speech-recognition/package.json#L1
[ncontacts]: https://registry.npmjs.org/@capacitor-community/contacts/-/contacts-7.2.0.tgz
[ncore]: https://registry.npmjs.org/@capacitor/android/-/android-7.4.5.tgz
[ncamera]: https://registry.npmjs.org/@capacitor/camera/-/camera-7.0.3.tgz
[nmedia]: https://registry.npmjs.org/@capacitor-community/media/-/media-8.0.1.tgz
[nlocation]: https://registry.npmjs.org/@capacitor/geolocation/-/geolocation-7.1.8.tgz
[npush]: https://registry.npmjs.org/@capacitor/push-notifications/-/push-notifications-7.0.6.tgz
[client-manifest]: ../../../../bookme_mobile/android/client/app/src/main/AndroidManifest.xml#L49
[salon-manifest]: ../../../../bookme_mobile/android/salon/app/src/main/AndroidManifest.xml#L49
[speech-manifest]: ../../../../bookme_mobile/plugins/speech-recognition/android/src/main/AndroidManifest.xml#L2
[client-config]: ../../../../bookme_mobile/capacitor.client.config.ts#L4
[salon-config]: ../../../../bookme_mobile/capacitor.salon.config.ts#L4
[shared-config]: ../../../../bookme_mobile/capacitor.shared.ts#L7
[client-gradle]: ../../../../bookme_mobile/android/client/capacitor.settings.gradle#L5
[salon-gradle]: ../../../../bookme_mobile/android/salon/capacitor.settings.gradle#L5
[client-plist]: ../../../../bookme_mobile/ios/client/App/App/Info.plist#L36
[salon-plist]: ../../../../bookme_mobile/ios/salon/App/App/Info.plist#L36
[client-pods]: ../../../../bookme_mobile/ios/client/App/Podfile#L11
[salon-pods]: ../../../../bookme_mobile/ios/salon/App/Podfile#L11
[client-pods-lock]: ../../../../bookme_mobile/ios/client/App/Podfile.lock#L8
[salon-pods-lock]: ../../../../bookme_mobile/ios/salon/App/Podfile.lock#L93
[geo]: ../../../../bookme_mobile/src/app/services/geolocation.service.ts#L68
[explainer]: ../../../../bookme_mobile/projects/client/src/app/services/permission-explainer.service.ts#L27
[city]: ../../../../bookme_mobile/projects/client/src/app/shared/components/city-picker-button/city-picker-button.component.ts#L265
[coords]: ../../../../bookme_mobile/src/app/services/coordinates-storage.service.ts#L5
[nearby]: ../../../../bookme_mobile/projects/client/src/app/pages/main-page/components/specialists/specialists.component.ts#L199
[nearby-api]: ../../../../bookme_mobile/src/app/services/client-api.service.ts#L168
[search-location]: ../../../../bookme_mobile/projects/client/src/app/pages/search/search-page.component.ts#L601
[speech-service]: ../../../../bookme_mobile/src/app/services/speech.service.ts#L62
[speech-android]: ../../../../bookme_mobile/plugins/speech-recognition/android/src/main/java/com/getcapacitor/community/speechrecognition/SpeechRecognition.java#L28
[speech-ios-permission]: ../../../../bookme_mobile/plugins/speech-recognition/ios/Plugin/Plugin.swift#L408
[speech-ios-start]: ../../../../bookme_mobile/plugins/speech-recognition/ios/Plugin/Plugin.swift#L101
[speech-denial]: ../../../../bookme_mobile/src/app/services/speech.service.ts#L270
[voice-search]: ../../../../bookme_mobile/projects/client/src/app/pages/main-page/components/speech-textarea/speech-textarea.component.ts#L378
[search-api]: ../../../../bookme_mobile/src/app/services/client-api.service.ts#L116
[contact-service]: ../../../../bookme_mobile/src/app/services/contact-picker.service.ts#L28
[contact-form]: ../../../../bookme_mobile/projects/salon/src/app/admin/pages/admin-appointment-form/admin-appointment-form.component.ts#L598
[contact-master]: ../../../../bookme_mobile/projects/salon/src/app/master/pages/master-appointment-form/master-appointment-form.component.ts#L475
[contact-save]: ../../../../bookme_mobile/projects/salon/src/app/admin/pages/admin-appointment-form/admin-appointment-form.component.ts#L363
[photo]: ../../../../bookme_mobile/src/app/services/photo-capture.service.ts#L83
[denied]: ../../../../bookme_mobile/src/app/services/permission-alert.service.ts#L19
[cloudinary]: ../../../../bookme_mobile/src/app/services/cloudinary.service.ts#L23
[qr]: ../../../../bookme_mobile/src/app/services/profile-share.service.ts#L193
[qr-ui]: ../../../../bookme_mobile/src/app/shared/components/qr-share-modal/qr-share-modal.component.ts#L137
[photo-picker]: ../../../../bookme_mobile/src/app/shared/photo-picker/photo-picker.component.ts#L117
[business-images]: ../../../../bookme_mobile/projects/salon/src/app/shared/components/business-images-list/business-images-list.component.ts#L138
[push]: ../../../../bookme_mobile/src/app/services/push-notification.service.ts#L121
[push-data]: ../../../../bookme_mobile/src/app/services/push-notification.service.ts#L441
[client-delegate]: ../../../../bookme_mobile/ios/client/App/App/AppDelegate.swift#L11
[salon-delegate]: ../../../../bookme_mobile/ios/salon/App/App/AppDelegate.swift#L11
[client-entitlements]: ../../../../bookme_mobile/ios/client/App/App/App.entitlements#L5
[salon-entitlements]: ../../../../bookme_mobile/ios/salon/App/App/App.entitlements#L5
[client-onboarding]: ../../../../bookme_mobile/projects/client/src/app/pages/onboarding/onboarding-page.component.ts#L104
[salon-onboarding]: ../../../../bookme_mobile/projects/salon/src/app/pages/onboarding/onboarding-page.component.ts#L93
[post-booking]: ../../../../bookme_mobile/src/app/services/notification-prompt.service.ts#L14
[push-modal]: ../../../../bookme_mobile/src/app/shared/components/enable-notifications-modal/enable-notifications-modal.component.ts#L28
[push-cleanup]: ../../../../bookme_mobile/src/app/services/push-notification.service.ts#L570
[cap-playbook]: ../../../../bookme_mobile/project-constitution/playbooks/capacitor.md#L75
