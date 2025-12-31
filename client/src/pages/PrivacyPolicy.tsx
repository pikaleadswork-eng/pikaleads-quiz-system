import { useLanguage } from "@/contexts/LanguageContext";
import { translations } from "@/lib/translations";

export default function PrivacyPolicy() {
  const { language } = useLanguage();
  const t = translations[language];

  const content = {
    uk: {
      title: "Політика конфіденційності",
      lastUpdated: "Остання редакція: 18 грудня 2025",
      sections: [
        {
          title: "1. Загальні положення",
          content: `Ця Політика конфіденційності (далі — «Політика») визначає порядок збору, обробки, зберігання, використання та захисту персональних даних користувачів веб-сайту pika-leads.com (далі — «Сайт»), який належить та управляється ФОП "Грибук Роман Миколайович" (далі — «Компанія», «ми», «нас»).

Використовуючи наш Сайт, ви підтверджуєте, що прочитали, зрозуміли та погоджуєтесь з умовами цієї Політики конфіденційності. Якщо ви не згодні з будь-якими положеннями цієї Політики, будь ласка, не використовуйте наш Сайт та не надавайте нам свої персональні дані.

Ми серйозно ставимося до захисту вашої приватності та зобов'язуємося забезпечити безпеку ваших персональних даних відповідно до чинного законодавства України, зокрема Закону України «Про захист персональних даних», а також вимог Загального регламенту захисту даних (GDPR) Європейського Союзу, якщо це застосовно.

Ця Політика застосовується до всіх користувачів Сайту, незалежно від їхнього географічного розташування, способу доступу до Сайту (через комп'ютер, мобільний пристрій, планшет тощо) та мети використання наших послуг.`
        },
        {
          title: "2. Визначення термінів",
          content: `У цій Політиці конфіденційності використовуються наступні терміни:

**Персональні дані** — будь-яка інформація, що стосується ідентифікованої фізичної особи або фізичної особи, яку можна ідентифікувати. До персональних даних відносяться, зокрема: ім'я, прізвище, адреса електронної пошти, номер телефону, IP-адреса, дані про місцезнаходження, ідентифікатори пристроїв, cookie-файли та інша інформація, яка може бути використана для ідентифікації особи.

**Обробка персональних даних** — будь-яка дія або сукупність дій, що здійснюються з персональними даними, включаючи збір, реєстрацію, накопичення, зберігання, адаптування, зміну, поновлення, використання, поширення, знеособлення, знищення персональних даних, у тому числі з використанням інформаційних (автоматизованих) систем.

**Користувач** — будь-яка фізична особа, яка відвідує Сайт, використовує його функціонал, заповнює форми зворотного зв'язку, проходить квізи, підписується на розсилку або іншим чином взаємодіє з Сайтом.

**Суб'єкт персональних даних** — фізична особа, персональні дані якої обробляються Компанією.

**Володілець персональних даних** — ФОП "Грибук Роман Миколайович", який визначає мету обробки персональних даних, встановлює склад цих даних та процедури їх обробки.

**Cookie-файли** — невеликі текстові файли, які зберігаються на пристрої користувача під час відвідування Сайту та містять інформацію про дії користувача на Сайті.`
        },
        {
          title: "3. Які персональні дані ми збираємо",
          content: `Ми можемо збирати та обробляти наступні категорії персональних даних:

**3.1. Дані, які ви надаєте добровільно:**
- Ім'я та прізвище
- Адреса електронної пошти
- Номер телефону
- Назва компанії та посада (якщо застосовно)
- Інформація про ваш бізнес та маркетингові потреби
- Відповіді на питання в квізах та опитувальниках
- Повідомлення, які ви надсилаєте через форми зворотного зв'язку
- Інша інформація, яку ви вирішите надати нам

**3.2. Дані, які збираються автоматично:**
- IP-адреса та географічне розташування
- Тип браузера та операційної системи
- Дата та час відвідування Сайту
- Сторінки, які ви переглядаєте на Сайті
- Час, проведений на кожній сторінці
- Посилання, на які ви натискаєте
- Джерело переходу на Сайт (реферер)
- Параметри пристрою (розмір екрану, роздільна здатність тощо)
- Ідентифікатори пристроїв та cookie-файли

**3.3. Дані з аналітичних сервісів:**
Ми використовуємо сервіси веб-аналітики, такі як Google Analytics, Meta Pixel (Facebook Pixel), Microsoft Clarity та інші, які збирають знеособлені дані про поведінку користувачів на Сайті для покращення якості наших послуг.

**3.4. Дані з соціальних мереж:**
Якщо ви взаємодієте з нами через соціальні мережі (Facebook, Instagram, LinkedIn тощо), ми можемо отримати доступ до вашого публічного профілю та іншої інформації, яку ви дозволили передавати відповідно до налаштувань приватності соціальної мережі.`
        },
        {
          title: "4. Мета обробки персональних даних",
          content: `Ми обробляємо ваші персональні дані виключно для наступних законних цілей:

**4.1. Надання послуг:**
- Обробка ваших запитів та звернень
- Надання консультацій з питань маркетингу та реклами
- Проведення аудиту рекламних кампаній
- Розробка та впровадження маркетингових стратегій
- Підготовка комерційних пропозицій

**4.2. Комунікація:**
- Відповіді на ваші запитання та повідомлення
- Надсилання інформації про наші послуги
- Інформування про акції, знижки та спеціальні пропозиції
- Надсилання новин та корисних матеріалів (за вашою згодою)

**4.3. Покращення Сайту та послуг:**
- Аналіз поведінки користувачів на Сайті
- Виявлення та усунення технічних проблем
- Тестування нових функцій та можливостей
- Персоналізація контенту та рекомендацій
- Оптимізація користувацького досвіду

**4.4. Маркетинг та реклама:**
- Проведення маркетингових досліджень
- Таргетування рекламних кампаній
- Аналіз ефективності маркетингових активностей
- Ретаргетинг та ремаркетинг

**4.5. Виконання юридичних зобов'язань:**
- Дотримання вимог законодавства України
- Захист прав та законних інтересів Компанії
- Запобігання шахрайству та зловживанням
- Співпраця з правоохоронними органами (у випадках, передбачених законом)`
        },
        {
          title: "5. Правові підстави обробки персональних даних",
          content: `Обробка ваших персональних даних здійснюється на наступних правових підставах:

**5.1. Згода суб'єкта персональних даних:**
Ви надаєте нам явну та усвідомлену згоду на обробку ваших персональних даних, заповнюючи форми на Сайті, підписуючись на розсилку або іншим чином взаємодіючи з нами. Ви маєте право відкликати свою згоду в будь-який момент.

**5.2. Виконання договору:**
Обробка персональних даних необхідна для укладення та виконання договору на надання послуг між вами та Компанією.

**5.3. Законні інтереси Компанії:**
Ми можемо обробляти персональні дані для захисту наших законних інтересів, зокрема для покращення якості послуг, забезпечення безпеки Сайту, запобігання шахрайству, проведення маркетингових досліджень.

**5.4. Виконання юридичних зобов'язань:**
Обробка персональних даних може бути необхідною для виконання наших юридичних зобов'язань, передбачених законодавством України.

Ми не обробляємо персональні дані без законних підстав та не використовуємо їх для цілей, не зазначених у цій Політиці.`
        },
        {
          title: "6. Передача персональних даних третім особам",
          content: `Ми не продаємо, не здаємо в оренду та не передаємо ваші персональні дані третім особам без вашої згоди, за винятком випадків, передбачених цією Політикою та законодавством України.

**6.1. Передача даних постачальникам послуг:**
Ми можемо передавати ваші персональні дані довіреним постачальникам послуг, які допомагають нам в роботі Сайту та наданні послуг, зокрема:
- Хостинг-провайдерам для розміщення Сайту
- Сервісам електронної пошти для розсилок
- Аналітичним сервісам (Google Analytics, Meta Pixel тощо)
- CRM-системам для управління клієнтською базою
- Платіжним системам для обробки платежів

Усі постачальники послуг зобов'язані дотримуватися конфіденційності ваших даних та використовувати їх виключно для виконання своїх функцій.

**6.2. Передача даних за вимогою закону:**
Ми можемо розкривати ваші персональні дані, якщо це необхідно для:
- Виконання вимог законодавства України
- Захисту прав та безпеки Компанії, користувачів або третіх осіб
- Запобігання шахрайству та зловживанням
- Співпраці з правоохоронними органами

**6.3. Міжнародна передача даних:**
Деякі наші постачальники послуг можуть знаходитися за межами України. У таких випадках ми забезпечуємо належний рівень захисту ваших персональних даних відповідно до міжнародних стандартів та вимог GDPR.`
        },
        {
          title: "7. Зберігання та захист персональних даних",
          content: `**7.1. Строки зберігання:**
Ми зберігаємо ваші персональні дані тільки протягом періоду, необхідного для досягнення цілей, зазначених у цій Політиці, або протягом строку, встановленого законодавством України. Зокрема:
- Дані з форм зворотного зв'язку — 3 роки
- Дані про відвідування Сайту — 2 роки
- Дані про підписку на розсилку — до моменту відписки
- Дані про укладені договори — 5 років після закінчення договору

Після закінчення строку зберігання персональні дані знищуються або знеособлюються.

**7.2. Заходи безпеки:**
Ми вживаємо всіх необхідних організаційних та технічних заходів для захисту ваших персональних даних від несанкціонованого доступу, зміни, розкриття або знищення, зокрема:
- Шифрування даних при передачі (SSL/TLS)
- Обмеження доступу до персональних даних
- Регулярне резервне копіювання
- Використання захищених серверів та баз даних
- Моніторинг безпеки та виявлення загроз
- Навчання співробітників принципам захисту даних

**7.3. Відповідальність користувача:**
Ви несете відповідальність за збереження конфіденційності ваших облікових даних (логін, пароль) та не повинні передавати їх третім особам. Будь ласка, негайно повідомте нас, якщо ви підозрюєте несанкціонований доступ до вашого облікового запису.`
        },
        {
          title: "8. Ваші права як суб'єкта персональних даних",
          content: `Відповідно до законодавства України та GDPR, ви маєте наступні права щодо ваших персональних даних:

**8.1. Право на доступ:**
Ви маєте право отримати підтвердження того, чи обробляються ваші персональні дані, а також отримати доступ до цих даних та інформацію про умови їх обробки.

**8.2. Право на виправлення:**
Ви маєте право вимагати виправлення неточних або неповних персональних даних.

**8.3. Право на видалення («право на забуття»):**
Ви маєте право вимагати видалення ваших персональних даних у випадках, передбачених законодавством, зокрема якщо дані більше не потрібні для цілей обробки або ви відкликали свою згоду.

**8.4. Право на обмеження обробки:**
Ви маєте право вимагати обмеження обробки ваших персональних даних у певних випадках, наприклад, якщо ви оскаржуєте точність даних.

**8.5. Право на переносимість даних:**
Ви маєте право отримати ваші персональні дані у структурованому, загальновживаному та машиночитаному форматі та передати їх іншому володільцю даних.

**8.6. Право на заперечення:**
Ви маєте право заперечувати проти обробки ваших персональних даних, зокрема для цілей прямого маркетингу.

**8.7. Право на відкликання згоди:**
Ви маєте право відкликати свою згоду на обробку персональних даних в будь-який момент, не впливаючи на законність обробки, що здійснювалася до відкликання згоди.

**8.8. Право на скаргу:**
Ви маєте право подати скаргу до Уповноваженого Верховної Ради України з прав людини або іншого компетентного органу, якщо вважаєте, що обробка ваших персональних даних порушує законодавство.

Для реалізації ваших прав, будь ласка, зверніться до нас за контактами, вказаними в розділі 12 цієї Політики.`
        },
        {
          title: "9. Cookie-файли та технології відстеження",
          content: `**9.1. Що таке cookie-файли:**
Cookie-файли — це невеликі текстові файли, які зберігаються на вашому пристрої під час відвідування Сайту. Вони допомагають нам покращити функціональність Сайту, аналізувати його використання та персоналізувати ваш досвід.

**9.2. Типи cookie-файлів, які ми використовуємо:**
- **Необхідні cookie:** забезпечують базову функціональність Сайту
- **Функціональні cookie:** запам'ятовують ваші налаштування та вподобання
- **Аналітичні cookie:** допомагають нам аналізувати відвідуваність та поведінку користувачів
- **Маркетингові cookie:** використовуються для показу релевантної реклами

Детальну інформацію про cookie-файли ви можете знайти в нашій Політиці кукіс.

**9.3. Управління cookie-файлами:**
Ви можете керувати cookie-файлами через налаштування вашого браузера. Однак відключення cookie-файлів може вплинути на функціональність Сайту.

**9.4. Інші технології відстеження:**
Крім cookie-файлів, ми можемо використовувати інші технології відстеження, такі як веб-маяки (web beacons), пікселі відстеження, локальне сховище (local storage) тощо.`
        },
        {
          title: "10. Посилання на сторонні сайти",
          content: `Наш Сайт може містити посилання на сторонні веб-сайти, які не контролюються Компанією. Ця Політика конфіденційності не поширюється на сторонні сайти. Ми не несемо відповідальності за політику конфіденційності та практики збору даних на сторонніх сайтах.

Ми рекомендуємо вам ознайомитися з політикою конфіденційності кожного сайту, який ви відвідуєте, особливо якщо ви надаєте там свої персональні дані.

Включення посилань на сторонні сайти не означає нашого схвалення або рекомендації цих сайтів, їхніх продуктів або послуг.`
        },
        {
          title: "11. Зміни до Політики конфіденційності",
          content: `Ми залишаємо за собою право вносити зміни до цієї Політики конфіденційності в будь-який час. Усі зміни набувають чинності з моменту їх публікації на Сайті.

Про суттєві зміни в Політиці ми повідомимо вас одним із наступних способів:
- Розміщення повідомлення на головній сторінці Сайту
- Надсилання електронного листа на вашу адресу (якщо ви підписані на розсилку)
- Показ спливаючого повідомлення при відвідуванні Сайту

Дата останньої редакції Політики вказана на початку цього документа. Ми рекомендуємо вам регулярно переглядати цю Політику, щоб бути в курсі того, як ми захищаємо ваші персональні дані.

Продовження використання Сайту після внесення змін до Політики означає вашу згоду з оновленими умовами.`
        },
        {
          title: "12. Контактна інформація",
          content: `Якщо у вас виникли питання щодо цієї Політики конфіденційності, обробки ваших персональних даних або ви хочете реалізувати свої права як суб'єкта персональних даних, будь ласка, зв'яжіться з нами:

**ФОП "Грибук Роман Миколайович"**

**Електронна пошта:** support@pika-leads.com

**Телефон:** +38 099 23 77 117

**Веб-сайт:** https://pika-leads.com

Ми зобов'язуємося розглянути ваше звернення протягом 30 календарних днів з моменту його отримання та надати вам вичерпну відповідь.

Якщо ви вважаєте, що ваші права порушено, ви також можете звернутися до:

**Уповноважений Верховної Ради України з прав людини**
Адреса: 01008, м. Київ, вул. Інститутська, 21/8
Телефон: +38 (044) 253-80-51
Веб-сайт: https://ombudsman.gov.ua

Дякуємо за довіру до PIKALEADS. Ми цінуємо вашу приватність та докладаємо всіх зусиль для захисту ваших персональних даних.`
        }
      ]
    },
    en: {
      title: "Privacy Policy",
      lastUpdated: "Last updated: December 18, 2025",
      sections: [
        {
          title: "1. General Provisions",
          content: `This Privacy Policy (hereinafter referred to as the "Policy") defines the procedure for collecting, processing, storing, using, and protecting personal data of users of the website pika-leads.com (hereinafter referred to as the "Website"), which is owned and operated by FOP "Hrybuk Roman Mykolaiovych" (hereinafter referred to as the "Company", "we", "us").

By using our Website, you confirm that you have read, understood, and agree to the terms of this Privacy Policy. If you do not agree with any provisions of this Policy, please do not use our Website or provide us with your personal data.

We take your privacy seriously and are committed to ensuring the security of your personal data in accordance with the current legislation of Ukraine, in particular the Law of Ukraine "On Personal Data Protection", as well as the requirements of the General Data Protection Regulation (GDPR) of the European Union, where applicable.

This Policy applies to all users of the Website, regardless of their geographical location, method of access to the Website (via computer, mobile device, tablet, etc.), and purpose of using our services.`
        },
        {
          title: "2. Definitions",
          content: `The following terms are used in this Privacy Policy:

**Personal Data** — any information relating to an identified natural person or a natural person who can be identified. Personal data includes, in particular: name, surname, email address, phone number, IP address, location data, device identifiers, cookies, and other information that can be used to identify a person.

**Processing of Personal Data** — any action or set of actions performed with personal data, including collection, registration, accumulation, storage, adaptation, modification, renewal, use, distribution, depersonalization, destruction of personal data, including using information (automated) systems.

**User** — any natural person who visits the Website, uses its functionality, fills out feedback forms, takes quizzes, subscribes to newsletters, or otherwise interacts with the Website.

**Data Subject** — a natural person whose personal data is processed by the Company.

**Data Controller** — FOP "Hrybuk Roman Mykolaiovych", who determines the purpose of personal data processing, establishes the composition of this data and procedures for its processing.

**Cookies** — small text files that are stored on the user's device when visiting the Website and contain information about the user's actions on the Website.`
        },
        {
          title: "3. What Personal Data We Collect",
          content: `We may collect and process the following categories of personal data:

**3.1. Data you provide voluntarily:**
- Name and surname
- Email address
- Phone number
- Company name and position (if applicable)
- Information about your business and marketing needs
- Answers to questions in quizzes and surveys
- Messages you send through feedback forms
- Other information you choose to provide to us

**3.2. Data collected automatically:**
- IP address and geographical location
- Browser type and operating system
- Date and time of Website visit
- Pages you view on the Website
- Time spent on each page
- Links you click
- Referral source to the Website
- Device parameters (screen size, resolution, etc.)
- Device identifiers and cookies

**3.3. Data from analytical services:**
We use web analytics services such as Google Analytics, Meta Pixel (Facebook Pixel), Microsoft Clarity, and others that collect anonymized data about user behavior on the Website to improve the quality of our services.

**3.4. Data from social networks:**
If you interact with us through social networks (Facebook, Instagram, LinkedIn, etc.), we may gain access to your public profile and other information that you have allowed to be shared according to the privacy settings of the social network.`
        },
        {
          title: "4. Purpose of Personal Data Processing",
          content: `We process your personal data exclusively for the following legitimate purposes:

**4.1. Service provision:**
- Processing your requests and inquiries
- Providing consultations on marketing and advertising
- Conducting audits of advertising campaigns
- Developing and implementing marketing strategies
- Preparing commercial proposals

**4.2. Communication:**
- Responding to your questions and messages
- Sending information about our services
- Informing about promotions, discounts, and special offers
- Sending news and useful materials (with your consent)

**4.3. Website and service improvement:**
- Analyzing user behavior on the Website
- Identifying and resolving technical issues
- Testing new features and capabilities
- Personalizing content and recommendations
- Optimizing user experience

**4.4. Marketing and advertising:**
- Conducting marketing research
- Targeting advertising campaigns
- Analyzing the effectiveness of marketing activities
- Retargeting and remarketing

**4.5. Fulfillment of legal obligations:**
- Compliance with the requirements of Ukrainian legislation
- Protection of the rights and legitimate interests of the Company
- Prevention of fraud and abuse
- Cooperation with law enforcement agencies (in cases provided by law)`
        },
        {
          title: "5. Legal Basis for Personal Data Processing",
          content: `The processing of your personal data is carried out on the following legal grounds:

**5.1. Consent of the data subject:**
You provide us with explicit and informed consent to process your personal data by filling out forms on the Website, subscribing to newsletters, or otherwise interacting with us. You have the right to withdraw your consent at any time.

**5.2. Contract performance:**
Processing of personal data is necessary for the conclusion and performance of a contract for the provision of services between you and the Company.

**5.3. Legitimate interests of the Company:**
We may process personal data to protect our legitimate interests, in particular to improve the quality of services, ensure Website security, prevent fraud, and conduct marketing research.

**5.4. Fulfillment of legal obligations:**
Processing of personal data may be necessary to fulfill our legal obligations provided by Ukrainian legislation.

We do not process personal data without legal grounds and do not use it for purposes not specified in this Policy.`
        },
        {
          title: "6. Transfer of Personal Data to Third Parties",
          content: `We do not sell, rent, or transfer your personal data to third parties without your consent, except in cases provided by this Policy and Ukrainian legislation.

**6.1. Transfer of data to service providers:**
We may transfer your personal data to trusted service providers who assist us in operating the Website and providing services, in particular:
- Hosting providers for Website placement
- Email services for newsletters
- Analytical services (Google Analytics, Meta Pixel, etc.)
- CRM systems for customer base management
- Payment systems for payment processing

All service providers are obliged to maintain the confidentiality of your data and use it exclusively to perform their functions.

**6.2. Transfer of data as required by law:**
We may disclose your personal data if necessary to:
- Comply with the requirements of Ukrainian legislation
- Protect the rights and security of the Company, users, or third parties
- Prevent fraud and abuse
- Cooperate with law enforcement agencies

**6.3. International data transfer:**
Some of our service providers may be located outside Ukraine. In such cases, we ensure an appropriate level of protection of your personal data in accordance with international standards and GDPR requirements.`
        },
        {
          title: "7. Storage and Protection of Personal Data",
          content: `**7.1. Storage periods:**
We store your personal data only for the period necessary to achieve the purposes specified in this Policy, or for the period established by Ukrainian legislation. In particular:
- Data from feedback forms — 3 years
- Data about Website visits — 2 years
- Data about newsletter subscription — until unsubscription
- Data about concluded contracts — 5 years after the end of the contract

After the expiration of the storage period, personal data is destroyed or anonymized.

**7.2. Security measures:**
We take all necessary organizational and technical measures to protect your personal data from unauthorized access, modification, disclosure, or destruction, in particular:
- Data encryption during transmission (SSL/TLS)
- Restriction of access to personal data
- Regular backup
- Use of secure servers and databases
- Security monitoring and threat detection
- Training employees on data protection principles

**7.3. User responsibility:**
You are responsible for maintaining the confidentiality of your account data (login, password) and should not transfer them to third parties. Please notify us immediately if you suspect unauthorized access to your account.`
        },
        {
          title: "8. Your Rights as a Data Subject",
          content: `In accordance with Ukrainian legislation and GDPR, you have the following rights regarding your personal data:

**8.1. Right of access:**
You have the right to obtain confirmation of whether your personal data is being processed, as well as to gain access to this data and information about the conditions of its processing.

**8.2. Right to rectification:**
You have the right to demand the correction of inaccurate or incomplete personal data.

**8.3. Right to erasure ("right to be forgotten"):**
You have the right to demand the deletion of your personal data in cases provided by law, in particular if the data is no longer needed for processing purposes or you have withdrawn your consent.

**8.4. Right to restriction of processing:**
You have the right to demand restriction of processing of your personal data in certain cases, for example, if you contest the accuracy of the data.

**8.5. Right to data portability:**
You have the right to receive your personal data in a structured, commonly used, and machine-readable format and to transfer it to another data controller.

**8.6. Right to object:**
You have the right to object to the processing of your personal data, in particular for direct marketing purposes.

**8.7. Right to withdraw consent:**
You have the right to withdraw your consent to the processing of personal data at any time, without affecting the lawfulness of processing carried out before the withdrawal of consent.

**8.8. Right to lodge a complaint:**
You have the right to lodge a complaint with the Commissioner of the Verkhovna Rada of Ukraine for Human Rights or another competent authority if you believe that the processing of your personal data violates legislation.

To exercise your rights, please contact us using the contact information provided in Section 12 of this Policy.`
        },
        {
          title: "9. Cookies and Tracking Technologies",
          content: `**9.1. What are cookies:**
Cookies are small text files that are stored on your device when you visit the Website. They help us improve the functionality of the Website, analyze its use, and personalize your experience.

**9.2. Types of cookies we use:**
- **Necessary cookies:** ensure the basic functionality of the Website
- **Functional cookies:** remember your settings and preferences
- **Analytical cookies:** help us analyze traffic and user behavior
- **Marketing cookies:** used to display relevant advertising

Detailed information about cookies can be found in our Cookie Policy.

**9.3. Cookie management:**
You can manage cookies through your browser settings. However, disabling cookies may affect the functionality of the Website.

**9.4. Other tracking technologies:**
In addition to cookies, we may use other tracking technologies such as web beacons, tracking pixels, local storage, etc.`
        },
        {
          title: "10. Links to Third-Party Websites",
          content: `Our Website may contain links to third-party websites that are not controlled by the Company. This Privacy Policy does not apply to third-party websites. We are not responsible for the privacy policies and data collection practices of third-party websites.

We recommend that you review the privacy policy of each website you visit, especially if you provide your personal data there.

The inclusion of links to third-party websites does not imply our endorsement or recommendation of these websites, their products, or services.`
        },
        {
          title: "11. Changes to the Privacy Policy",
          content: `We reserve the right to make changes to this Privacy Policy at any time. All changes take effect from the moment of their publication on the Website.

We will notify you of significant changes to the Policy in one of the following ways:
- Posting a notice on the main page of the Website
- Sending an email to your address (if you are subscribed to the newsletter)
- Displaying a pop-up message when visiting the Website

The date of the last revision of the Policy is indicated at the beginning of this document. We recommend that you regularly review this Policy to stay informed about how we protect your personal data.

Continued use of the Website after changes to the Policy means your agreement with the updated terms.`
        },
        {
          title: "12. Contact Information",
          content: `If you have questions about this Privacy Policy, the processing of your personal data, or you want to exercise your rights as a data subject, please contact us:

**FOP "Hrybuk Roman Mykolaiovych"**

**Email:** support@pika-leads.com

**Phone:** +38 099 23 77 117

**Website:** https://pika-leads.com

We are committed to reviewing your inquiry within 30 calendar days of its receipt and providing you with a comprehensive response.

If you believe your rights have been violated, you can also contact:

**Commissioner of the Verkhovna Rada of Ukraine for Human Rights**
Address: 01008, Kyiv, Institutska St., 21/8
Phone: +38 (044) 253-80-51
Website: https://ombudsman.gov.ua

Thank you for trusting PIKALEADS. We value your privacy and make every effort to protect your personal data.`
        }
      ]
    }
  };

  const currentContent = content[language as keyof typeof content] || content.uk;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">{currentContent.title}</h1>
        <p className="text-muted-foreground mb-8">{currentContent.lastUpdated}</p>
        
        <div className="space-y-8">
          {currentContent.sections.map((section: { title: string; content: string }, index: number) => (
            <section key={index} className="prose prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">{section.title}</h2>
              <div className="text-muted-foreground whitespace-pre-line leading-relaxed">
                {section.content}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
