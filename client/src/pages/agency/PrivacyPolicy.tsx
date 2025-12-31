import { Link } from 'wouter';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-zinc-800">
        <div className="container mx-auto px-4 py-6">
          <Link href="/">
            <a className="inline-flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/pikachu-logo.png" alt="PIKALEADS" className="h-8" />
              <span className="text-xl font-bold text-yellow-400">PIKALEADS</span>
            </a>
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="container mx-auto px-4 py-12 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 text-yellow-400">
          Політика конфіденційності
        </h1>
        <p className="text-zinc-400 mb-8">
          Остання редакція: 23 грудня 2024 року
        </p>

        <div className="prose prose-invert prose-zinc max-w-none">
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">1. Загальні положення</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ця Політика конфіденційності (далі – «Політика») визначає порядок обробки та захисту персональних даних користувачів веб-сайту PIKALEADS (далі – «Сайт»), що належить ТОВ «ПІКАЛІДС» (далі – «Компанія», «ми», «нас»). Ми серйозно ставимося до захисту вашої конфіденційності та зобов'язуємося дотримуватися найвищих стандартів безпеки даних відповідно до Загального регламенту захисту даних ЄС (GDPR), Закону України «Про захист персональних даних» та інших застосовних нормативних актів.
            </p>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Використовуючи наш Сайт, подаючи заявки на консультації, заповнюючи квізи або взаємодіючи з нашими сервісами будь-яким іншим способом, ви підтверджуєте, що прочитали, зрозуміли та погоджуєтеся з умовами цієї Політики. Якщо ви не згодні з будь-якими положеннями цієї Політики, будь ласка, не використовуйте наш Сайт та не надавайте нам свої персональні дані.
            </p>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Компанія залишає за собою право вносити зміни до цієї Політики в будь-який час. Усі зміни набувають чинності з моменту їх публікації на Сайті. Ми рекомендуємо періодично переглядати цю Політику, щоб бути в курсі того, як ми захищаємо вашу інформацію. Дата останньої редакції завжди вказана на початку документа.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">2. Які дані ми збираємо</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми збираємо різні типи персональних даних залежно від способу вашої взаємодії з нашим Сайтом та сервісами. Нижче наведено вичерпний перелік категорій даних, які ми можемо збирати:
            </p>
            
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">2.1. Ідентифікаційні дані</h3>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Ім'я та прізвище</li>
              <li>Номер телефону</li>
              <li>Адреса електронної пошти</li>
              <li>Нікнейм у Telegram або інших месенджерах</li>
              <li>Назва компанії (для бізнес-клієнтів)</li>
              <li>Посада (для бізнес-клієнтів)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">2.2. Технічні дані</h3>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>IP-адреса пристрою</li>
              <li>Тип браузера та його версія</li>
              <li>Операційна система</li>
              <li>Тип пристрою (комп'ютер, планшет, смартфон)</li>
              <li>Дозвіл екрану</li>
              <li>Мовні налаштування</li>
              <li>Часовий пояс</li>
              <li>Cookies та інші ідентифікатори</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">2.3. Дані про поведінку на Сайті</h3>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Сторінки, які ви відвідуєте</li>
              <li>Час, проведений на кожній сторінці</li>
              <li>Послідовність переходів між сторінками</li>
              <li>Кліки по кнопках та посиланнях</li>
              <li>Заповнення форм та квізів</li>
              <li>Відповіді на питання у квізах</li>
              <li>Джерело переходу на Сайт (пошукова система, реклама, пряме посилання)</li>
              <li>UTM-мітки (utm_source, utm_medium, utm_campaign, utm_term, utm_content)</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">2.4. Маркетингові дані</h3>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Дані про рекламні кампанії, через які ви дізналися про нас</li>
              <li>Ідентифікатори рекламних платформ (Facebook Pixel ID, Google Analytics Client ID)</li>
              <li>Дані про взаємодію з рекламними матеріалами</li>
              <li>Історія комунікацій з нашою командою</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">2.5. Комерційні дані</h3>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Історія замовлень послуг</li>
              <li>Вартість послуг</li>
              <li>Статус угоди (новий лід, кваліфікований, виграно, програно)</li>
              <li>Коментарі менеджерів</li>
              <li>Записи дзвінків (за вашою згодою)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">3. Як ми збираємо дані</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми використовуємо різні методи збору даних для забезпечення найкращого досвіду користувачів та оптимізації наших послуг:
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">3.1. Дані, які ви надаєте безпосередньо</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Коли ви заповнюєте форми на нашому Сайті (форма консультації, форма стратегії, квізи), ви свідомо надаєте нам свої персональні дані. Ми збираємо лише ту інформацію, яку ви вводите добровільно. Обов'язкові поля завжди позначені зірочкою (*).
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">3.2. Автоматичний збір даних</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Під час вашого відвідування Сайту ми автоматично збираємо технічні дані за допомогою cookies, веб-маяків та аналогічних технологій. Це дозволяє нам аналізувати поведінку користувачів, покращувати функціональність Сайту та персоналізувати контент.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">3.3. Дані від третіх сторін</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми можемо отримувати додаткову інформацію про вас від рекламних платформ (Meta Ads, Google Ads, TikTok Ads), аналітичних сервісів (Google Analytics, Microsoft Clarity) та інших партнерів. Ці дані допомагають нам краще зрозуміти ефективність наших маркетингових кампаній та поліпшити якість обслуговування.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">3.4. Дані з публічних джерел</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              У деяких випадках ми можемо доповнювати ваші дані інформацією з публічних джерел (соціальні мережі, корпоративні веб-сайти, професійні бази даних) для кращого розуміння ваших потреб та надання більш релевантних пропозицій.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">4. Цілі обробки персональних даних</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми обробляємо ваші персональні дані виключно для законних цілей та на підставі відповідних правових підстав:
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.1. Надання послуг</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ваші дані необхідні для обробки ваших запитів, надання консультацій, розробки маркетингових стратегій, запуску рекламних кампаній та виконання інших послуг, які ви замовили. Правова підстава: виконання договору.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.2. Комунікація</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми використовуємо ваші контактні дані для зв'язку з вами через телефон, електронну пошту, Telegram або інші месенджери з метою надання інформації про наші послуги, відповіді на ваші запитання та підтримки клієнтів. Правова підстава: виконання договору та законний інтерес.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.3. Маркетинг та реклама</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              З вашої згоди ми можемо надсилати вам маркетингові повідомлення про наші нові послуги, спеціальні пропозиції, корисні матеріали та новини компанії. Ви завжди можете відмовитися від отримання таких повідомлень, скориставшись посиланням для відписки або зв'язавшись з нами напряму. Правова підстава: згода.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.4. Аналітика та покращення сервісів</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми аналізуємо дані про використання Сайту для виявлення проблем, покращення користувацького досвіду, оптимізації контенту та функціональності. Це допомагає нам створювати більш зручні та ефективні сервіси. Правова підстава: законний інтерес.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.5. Безпека та запобігання шахрайству</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми обробляємо технічні дані для захисту нашого Сайту від кібератак, виявлення та запобігання шахрайським діям, забезпечення безпеки наших систем та захисту прав інших користувачів. Правова підстава: законний інтерес та виконання законодавчих вимог.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.6. Дотримання законодавства</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              У деяких випадках ми зобов'язані обробляти та зберігати ваші дані для виконання вимог законодавства, судових рішень або запитів уповноважених органів. Правова підстава: виконання законодавчих вимог.
            </p>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">5. Правові підстави обробки даних (GDPR)</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Відповідно до GDPR, ми обробляємо ваші персональні дані на підставі наступних правових підстав:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li><strong className="text-white">Згода (Consent):</strong> Ви надали нам явну згоду на обробку ваших даних для конкретних цілей (наприклад, отримання маркетингових розсилок).</li>
              <li><strong className="text-white">Виконання договору (Contract):</strong> Обробка необхідна для виконання договору, стороною якого ви є, або для вжиття заходів на ваш запит перед укладенням договору.</li>
              <li><strong className="text-white">Законний інтерес (Legitimate Interest):</strong> Обробка необхідна для наших законних інтересів або інтересів третіх сторін, за винятком випадків, коли такі інтереси переважаються вашими інтересами або основними правами та свободами.</li>
              <li><strong className="text-white">Виконання законодавчих вимог (Legal Obligation):</strong> Обробка необхідна для виконання юридичних зобов'язань, що покладаються на нас.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">6. Хто має доступ до ваших даних</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми не продаємо, не здаємо в оренду та не передаємо ваші персональні дані третім сторонам без вашої згоди, за винятком випадків, описаних нижче:
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">6.1. Співробітники компанії</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Доступ до ваших даних мають лише ті співробітники, яким це необхідно для виконання їхніх робочих обов'язків (менеджери з продажу, маркетологи, технічна підтримка). Усі співробітники підписують угоди про нерозголошення та зобов'язуються дотримуватися політики конфіденційності.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">6.2. Постачальники послуг</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми можемо передавати ваші дані довіреним постачальникам послуг, які допомагають нам у веденні бізнесу:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Хостинг-провайдери (для розміщення Сайту та баз даних)</li>
              <li>Email-сервіси (для надсилання повідомлень)</li>
              <li>CRM-системи (для управління відносинами з клієнтами)</li>
              <li>Аналітичні платформи (Google Analytics, Microsoft Clarity)</li>
              <li>Рекламні платформи (Meta Ads, Google Ads, TikTok Ads)</li>
              <li>Платіжні системи (для обробки платежів)</li>
            </ul>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Усі постачальники послуг зобов'язані дотримуватися конфіденційності та використовувати ваші дані виключно для цілей, визначених нами.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">6.3. Державні органи</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми можемо розкривати ваші дані державним органам, якщо це вимагається законом, судовим рішенням або іншими нормативними актами.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">6.4. Бізнес-партнери</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              З вашої згоди ми можемо передавати ваші дані нашим бізнес-партнерам для надання вам спільних послуг або спеціальних пропозицій.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">7. Міжнародна передача даних</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Деякі з наших постачальників послуг можуть знаходитися за межами України або Європейського Союзу. У таких випадках ми вживаємо всіх необхідних заходів для забезпечення адекватного рівня захисту ваших даних відповідно до GDPR:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Використання стандартних договірних застережень ЄС (Standard Contractual Clauses)</li>
              <li>Перевірка наявності рішення Європейської Комісії про адекватність захисту даних у країні-отримувачі</li>
              <li>Використання сертифікованих механізмів передачі даних (наприклад, EU-US Privacy Shield для США)</li>
              <li>Отримання вашої явної згоди на міжнародну передачу даних</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">8. Як довго ми зберігаємо ваші дані</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми зберігаємо ваші персональні дані лише стільки, скільки це необхідно для досягнення цілей, для яких вони були зібрані, або відповідно до вимог законодавства:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li><strong className="text-white">Дані клієнтів:</strong> Протягом усього періоду надання послуг та 5 років після завершення співпраці (для бухгалтерської та податкової звітності).</li>
              <li><strong className="text-white">Дані лідів:</strong> 3 роки з моменту останньої взаємодії. Якщо ви не стали клієнтом, ваші дані будуть видалені після закінчення цього терміну.</li>
              <li><strong className="text-white">Маркетингові дані:</strong> До моменту відкликання згоди або 2 роки з моменту останньої взаємодії.</li>
              <li><strong className="text-white">Технічні дані (логи, cookies):</strong> Від 30 днів до 2 років залежно від типу даних та цілей обробки.</li>
              <li><strong className="text-white">Дані для виконання законодавчих вимог:</strong> Відповідно до термінів, встановлених законодавством (зазвичай 5-10 років).</li>
            </ul>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Після закінчення терміну зберігання ваші дані будуть безпечно видалені або анонімізовані таким чином, що їх неможливо буде ідентифікувати.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">9. Ваші права</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Відповідно до GDPR та Закону України «Про захист персональних даних», ви маєте наступні права щодо ваших персональних даних:
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">9.1. Право на доступ</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви маєте право отримати підтвердження того, чи обробляємо ми ваші персональні дані, та отримати доступ до цих даних разом з інформацією про цілі обробки, категорії даних, отримувачів даних та термін зберігання.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">9.2. Право на виправлення</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви маєте право вимагати виправлення неточних або неповних персональних даних. Ми зобов'язуємося внести виправлення протягом 30 днів з моменту отримання вашого запиту.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">9.3. Право на видалення («право на забуття»)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви маєте право вимагати видалення ваших персональних даних у наступних випадках: дані більше не потрібні для цілей, для яких вони збиралися; ви відкликали згоду; ви заперечуєте проти обробки; дані обробляються незаконно; дані повинні бути видалені для виконання законодавчих вимог.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">9.4. Право на обмеження обробки</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви маєте право вимагати обмеження обробки ваших даних у певних випадках (наприклад, якщо ви оскаржуєте точність даних або заперечуєте проти обробки).
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">9.5. Право на переносимість даних</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви маєте право отримати ваші персональні дані у структурованому, загальновживаному та машиночитаному форматі та передати ці дані іншому контролеру даних.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">9.6. Право на заперечення</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви маєте право заперечувати проти обробки ваших персональних даних, зокрема для цілей прямого маркетингу.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">9.7. Право на відкликання згоди</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Якщо обробка ваших даних здійснюється на підставі вашої згоди, ви маєте право відкликати цю згоду в будь-який час. Відкликання згоди не впливає на законність обробки, яка здійснювалася до відкликання.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">9.8. Право на подання скарги</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви маєте право подати скаргу до Уповноваженого Верховної Ради України з прав людини або до відповідного наглядового органу ЄС, якщо вважаєте, що обробка ваших персональних даних порушує законодавство.
            </p>

            <p className="text-zinc-300 mb-4 leading-relaxed">
              Для реалізації будь-якого з цих прав, будь ласка, зв'яжіться з нами за адресою: <a href="mailto:privacy@pikaleads.com" className="text-yellow-400 hover:underline">privacy@pikaleads.com</a> або за телефоном: <a href="tel:+380992377117" className="text-yellow-400 hover:underline">+380 99 23 77 117</a>. Ми розглянемо ваш запит протягом 30 днів.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">10. Безпека даних</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми вживаємо всіх необхідних технічних та організаційних заходів для захисту ваших персональних даних від несанкціонованого доступу, втрати, знищення, зміни або розголошення:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Шифрування даних при передачі (SSL/TLS сертифікати)</li>
              <li>Шифрування даних при зберіганні</li>
              <li>Регулярне резервне копіювання</li>
              <li>Обмеження доступу до даних (принцип найменших привілеїв)</li>
              <li>Двофакторна автентифікація для співробітників</li>
              <li>Регулярний аудит безпеки та тестування на проникнення</li>
              <li>Навчання співробітників з питань захисту даних</li>
              <li>Використання захищених дата-центрів з фізичним контролем доступу</li>
              <li>Моніторинг та виявлення інцидентів безпеки</li>
            </ul>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Незважаючи на всі вжиті заходи, жоден метод передачі даних через Інтернет або метод електронного зберігання не є на 100% безпечним. Тому ми не можемо гарантувати абсолютну безпеку ваших даних. У разі виявлення порушення безпеки даних ми зобов'язуємося повідомити вас та відповідні наглядові органи протягом 72 годин відповідно до вимог GDPR.
            </p>
          </section>

          {/* Section 11 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">11. Cookies та аналітичні технології</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Наш Сайт використовує cookies та аналогічні технології для покращення користувацького досвіду, аналізу трафіку та персоналізації контенту. Детальна інформація про використання cookies міститься в нашій <Link href="/cookies"><a className="text-yellow-400 hover:underline">Політиці використання cookies</a></Link>.
            </p>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви можете керувати налаштуваннями cookies у вашому браузері або скористатися нашим інструментом управління згодою, який з'являється при першому відвідуванні Сайту.
            </p>
          </section>

          {/* Section 12 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">12. Діти</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Наш Сайт та послуги не призначені для осіб віком до 18 років. Ми свідомо не збираємо персональні дані від дітей. Якщо ви є батьком або опікуном і знаєте, що ваша дитина надала нам персональні дані без вашої згоди, будь ласка, зв'яжіться з нами. Ми видалимо такі дані з наших систем протягом 30 днів.
            </p>
          </section>

          {/* Section 13 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">13. Зміни до Політики конфіденційності</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми залишаємо за собою право вносити зміни до цієї Політики в будь-який час. Про всі суттєві зміни ми повідомимо вас одним із наступних способів:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Розміщення повідомлення на головній сторінці Сайту</li>
              <li>Надсилання електронного листа на вашу адресу (якщо ви надали її)</li>
              <li>Відображення спливаючого повідомлення при наступному відвідуванні Сайту</li>
            </ul>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Дата останньої редакції завжди вказана на початку цього документа. Ми рекомендуємо періодично переглядати цю Політику, щоб бути в курсі того, як ми захищаємо вашу інформацію. Продовження використання Сайту після внесення змін означає вашу згоду з оновленою Політикою.
            </p>
          </section>

          {/* Section 14 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">14. Контактна інформація</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Якщо у вас виникли запитання щодо цієї Політики конфіденційності, ви хочете реалізувати свої права або маєте скарги щодо обробки ваших персональних даних, будь ласка, зв'яжіться з нами:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <p className="text-white mb-2"><strong>ТОВ «ПІКАЛІДС»</strong></p>
              <p className="text-zinc-300 mb-2">Адреса: Україна, м. Київ</p>
              <p className="text-zinc-300 mb-2">Email: <a href="mailto:privacy@pikaleads.com" className="text-yellow-400 hover:underline">privacy@pikaleads.com</a></p>
              <p className="text-zinc-300 mb-2">Телефон: <a href="tel:+380992377117" className="text-yellow-400 hover:underline">+380 99 23 77 117</a></p>
              <p className="text-zinc-300 mb-2">Telegram: <a href="https://t.me/pikaleads" className="text-yellow-400 hover:underline">@pikaleads</a></p>
              <p className="text-zinc-300">Години роботи: Пн-Пт 9:00-18:00 (за київським часом)</p>
            </div>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми зобов'язуємося розглянути ваш запит протягом 30 днів з моменту отримання. У складних випадках цей термін може бути продовжений до 60 днів з обов'язковим повідомленням вас про причини затримки.
            </p>
          </section>

          {/* Footer */}
          <div className="border-t border-zinc-800 pt-8 mt-12">
            <p className="text-zinc-400 text-sm mb-4">
              Ця Політика конфіденційності складена відповідно до вимог:
            </p>
            <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1 ml-4">
              <li>Загального регламенту захисту даних ЄС (GDPR) 2016/679</li>
              <li>Закону України «Про захист персональних даних» від 01.06.2010 № 2297-VI</li>
              <li>Закону України «Про інформацію» від 02.10.1992 № 2657-XII</li>
              <li>Закону України «Про захист інформації в інформаційно-телекомунікаційних системах» від 05.07.1994 № 80/94-ВР</li>
            </ul>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 mt-12">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-zinc-400 text-sm">
              © 2024 PIKALEADS. Всі права захищені.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/privacy">
                <a className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Політика конфіденційності
                </a>
              </Link>
              <Link href="/cookies">
                <a className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Політика cookies
                </a>
              </Link>
              <Link href="/terms">
                <a className="text-zinc-400 hover:text-yellow-400 transition-colors">
                  Умови використання
                </a>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
