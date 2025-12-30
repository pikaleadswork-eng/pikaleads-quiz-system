import { Link } from 'wouter';

export default function CookiePolicy() {
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
          Політика використання cookies
        </h1>
        <p className="text-zinc-400 mb-8">
          Остання редакція: 23 грудня 2024 року
        </p>

        <div className="prose prose-invert prose-zinc max-w-none">
          {/* Section 1 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">1. Що таке cookies</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Cookies (куки, файли cookie) – це невеликі текстові файли, які зберігаються на вашому пристрої (комп'ютері, планшеті, смартфоні) під час відвідування веб-сайтів. Cookies містять інформацію про ваші налаштування, дії на сайті та інші дані, які допомагають покращити ваш досвід використання веб-ресурсу.
            </p>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Cookies не можуть виконувати програмний код, передавати віруси або отримувати доступ до вашого жорсткого диска. Вони створені виключно для зберігання інформації про вашу взаємодію з веб-сайтом та не становлять загрози для безпеки вашого пристрою.
            </p>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ця Політика використання cookies (далі – «Політика») пояснює, які типи cookies використовує веб-сайт PIKALEADS (далі – «Сайт»), для яких цілей, як ви можете керувати налаштуваннями cookies та які наслідки матиме відмова від їх використання.
            </p>
          </section>

          {/* Section 2 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">2. Типи cookies за терміном дії</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">2.1. Сесійні cookies (Session Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Сесійні cookies є тимчасовими і зберігаються на вашому пристрої лише під час активної сесії перегляду. Вони автоматично видаляються після закриття браузера. Ці cookies необхідні для базового функціонування Сайту, зокрема для:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Збереження вашого прогресу при заповненні багатосторінкових форм та квізів</li>
              <li>Підтримки вашого статусу авторизації під час перегляду різних сторінок</li>
              <li>Запам'ятовування товарів у кошику (якщо застосовно)</li>
              <li>Забезпечення безпеки вашої сесії</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">2.2. Постійні cookies (Persistent Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Постійні cookies зберігаються на вашому пристрої протягом визначеного періоду часу або до моменту їх ручного видалення. Термін зберігання може варіюватися від кількох днів до кількох років залежно від призначення cookie. Ці cookies використовуються для:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Запам'ятовування ваших налаштувань (мова інтерфейсу, тема оформлення)</li>
              <li>Розпізнавання вас як постійного відвідувача при повторних візитах</li>
              <li>Аналізу вашої поведінки на Сайті протягом тривалого періоду</li>
              <li>Персоналізації контенту та рекламних повідомлень</li>
              <li>Вимірювання ефективності маркетингових кампаній</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">3. Типи cookies за походженням</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">3.1. Власні cookies (First-Party Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Власні cookies встановлюються безпосередньо нашим Сайтом (домен pikaleads.com) і можуть бути прочитані лише нашим Сайтом. Ми використовуємо власні cookies для:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Забезпечення базової функціональності Сайту</li>
              <li>Збереження ваших налаштувань та уподобань</li>
              <li>Аналізу використання Сайту</li>
              <li>Покращення безпеки та запобігання шахрайству</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">3.2. Сторонні cookies (Third-Party Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Сторонні cookies встановлюються доменами, відмінними від нашого Сайту. Це cookies від зовнішніх сервісів, інтегрованих у наш Сайт, таких як:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Аналітичні платформи (Google Analytics, Microsoft Clarity)</li>
              <li>Рекламні мережі (Meta Pixel, Google Ads, TikTok Pixel)</li>
              <li>Соціальні мережі (кнопки «Поділитися», віджети)</li>
              <li>Відеоплатформи (YouTube, Vimeo)</li>
              <li>Чат-боти та системи підтримки клієнтів</li>
            </ul>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми не контролюємо сторонні cookies та не несемо відповідальності за політику конфіденційності третіх сторін. Рекомендуємо ознайомитися з політиками конфіденційності відповідних сервісів.
            </p>
          </section>

          {/* Section 4 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">4. Категорії cookies за призначенням</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.1. Необхідні cookies (Strictly Necessary Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ці cookies є критично важливими для функціонування Сайту і не можуть бути відключені в наших системах. Вони зазвичай встановлюються у відповідь на ваші дії, такі як налаштування конфіденційності, вхід в систему або заповнення форм. Без цих cookies деякі частини Сайту не зможуть працювати належним чином.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <p className="text-white font-semibold mb-2">Приклади необхідних cookies:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-1 ml-4">
                <li><code className="text-yellow-400">session_id</code> – ідентифікатор сесії користувача</li>
                <li><code className="text-yellow-400">csrf_token</code> – токен захисту від міжсайтової підробки запитів</li>
                <li><code className="text-yellow-400">cookie_consent</code> – збереження ваших налаштувань згоди на cookies</li>
                <li><code className="text-yellow-400">load_balancer</code> – розподіл навантаження між серверами</li>
              </ul>
              <p className="text-zinc-400 text-sm mt-3">Термін зберігання: від сесії до 1 року</p>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.2. Функціональні cookies (Functional Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Функціональні cookies дозволяють Сайту запам'ятовувати ваші вибори та налаштування для надання більш персоналізованого досвіду. Вони можуть зберігати інформацію про вибрану мову, регіон, розмір шрифту та інші налаштування інтерфейсу.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <p className="text-white font-semibold mb-2">Приклади функціональних cookies:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-1 ml-4">
                <li><code className="text-yellow-400">language</code> – вибрана мова інтерфейсу (UA/RU/EN/PL/DE)</li>
                <li><code className="text-yellow-400">theme</code> – вибрана тема оформлення (світла/темна)</li>
                <li><code className="text-yellow-400">quiz_progress</code> – прогрес проходження квізу</li>
                <li><code className="text-yellow-400">user_preferences</code> – інші налаштування користувача</li>
              </ul>
              <p className="text-zinc-400 text-sm mt-3">Термін зберігання: від 30 днів до 1 року</p>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.3. Аналітичні cookies (Analytics Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Аналітичні cookies допомагають нам зрозуміти, як відвідувачі взаємодіють з Сайтом, збираючи та повідомляючи інформацію анонімно. Ці дані використовуються для покращення структури Сайту, оптимізації контенту та виявлення технічних проблем.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <p className="text-white font-semibold mb-2">Використовувані аналітичні сервіси:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>
                  <strong className="text-white">Google Analytics 4:</strong> Збирає дані про відвідування, джерела трафіку, поведінку користувачів, конверсії.
                  <br />
                  <span className="text-zinc-400 text-sm">Cookies: _ga, _ga_*, _gid, _gat</span>
                  <br />
                  <span className="text-zinc-400 text-sm">Термін: від 1 дня до 2 років</span>
                </li>
                <li>
                  <strong className="text-white">Microsoft Clarity:</strong> Записує сесії користувачів (рухи миші, кліки, прокрутка) для аналізу UX.
                  <br />
                  <span className="text-zinc-400 text-sm">Cookies: _clck, _clsk, CLID, ANONCHK, MR, MUID, SM</span>
                  <br />
                  <span className="text-zinc-400 text-sm">Термін: від 1 дня до 1 року</span>
                </li>
                <li>
                  <strong className="text-white">Google Tag Manager:</strong> Керує тегами аналітики та маркетингу без зміни коду Сайту.
                  <br />
                  <span className="text-zinc-400 text-sm">Cookies: _dc_gtm_*, _gcl_au</span>
                  <br />
                  <span className="text-zinc-400 text-sm">Термін: від сесії до 90 днів</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.4. Маркетингові cookies (Marketing/Advertising Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Маркетингові cookies використовуються для відстеження відвідувачів на різних веб-сайтах з метою показу релевантної та привабливої реклами. Вони також допомагають вимірювати ефективність рекламних кампаній та запобігати повторному показу одних і тих же оголошень.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <p className="text-white font-semibold mb-2">Використовувані рекламні платформи:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-2 ml-4">
                <li>
                  <strong className="text-white">Meta Pixel (Facebook/Instagram):</strong> Відстежує конверсії, створює аудиторії для ретаргетингу, оптимізує рекламу.
                  <br />
                  <span className="text-zinc-400 text-sm">Cookies: _fbp, _fbc, fr, datr, sb, c_user</span>
                  <br />
                  <span className="text-zinc-400 text-sm">Термін: від сесії до 2 років</span>
                </li>
                <li>
                  <strong className="text-white">Google Ads:</strong> Відстежує конверсії з Google Ads, створює аудиторії ремаркетингу.
                  <br />
                  <span className="text-zinc-400 text-sm">Cookies: _gcl_aw, _gcl_dc, IDE, DSID, 1P_JAR, NID</span>
                  <br />
                  <span className="text-zinc-400 text-sm">Термін: від 24 годин до 2 років</span>
                </li>
                <li>
                  <strong className="text-white">TikTok Pixel:</strong> Відстежує дії користувачів для оптимізації рекламних кампаній у TikTok.
                  <br />
                  <span className="text-zinc-400 text-sm">Cookies: _ttp, _tt_enable_cookie, _tta_id</span>
                  <br />
                  <span className="text-zinc-400 text-sm">Термін: від 13 місяців до 2 років</span>
                </li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">4.5. Cookies соціальних мереж (Social Media Cookies)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ці cookies встановлюються соціальними мережами через інтегровані на Сайті кнопки «Поділитися» та віджети. Соціальні мережі можуть відстежувати ваш перегляд інших сайтів та створювати профіль ваших інтересів.
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <p className="text-white font-semibold mb-2">Інтегровані соціальні мережі:</p>
              <ul className="list-disc list-inside text-zinc-300 space-y-1 ml-4">
                <li>Facebook (Meta)</li>
                <li>Instagram (Meta)</li>
                <li>LinkedIn</li>
                <li>Twitter (X)</li>
                <li>YouTube (Google)</li>
              </ul>
            </div>
          </section>

          {/* Section 5 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">5. Детальна таблиця cookies</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Нижче наведено детальну інформацію про всі cookies, які використовуються на нашому Сайті:
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border border-zinc-800 mb-6">
                <thead className="bg-zinc-900">
                  <tr>
                    <th className="border border-zinc-800 px-4 py-3 text-left text-yellow-400">Назва</th>
                    <th className="border border-zinc-800 px-4 py-3 text-left text-yellow-400">Постачальник</th>
                    <th className="border border-zinc-800 px-4 py-3 text-left text-yellow-400">Призначення</th>
                    <th className="border border-zinc-800 px-4 py-3 text-left text-yellow-400">Термін</th>
                    <th className="border border-zinc-800 px-4 py-3 text-left text-yellow-400">Тип</th>
                  </tr>
                </thead>
                <tbody className="text-zinc-300 text-sm">
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>session_id</code></td>
                    <td className="border border-zinc-800 px-4 py-2">PIKALEADS</td>
                    <td className="border border-zinc-800 px-4 py-2">Ідентифікація сесії користувача</td>
                    <td className="border border-zinc-800 px-4 py-2">Сесія</td>
                    <td className="border border-zinc-800 px-4 py-2">Необхідний</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>csrf_token</code></td>
                    <td className="border border-zinc-800 px-4 py-2">PIKALEADS</td>
                    <td className="border border-zinc-800 px-4 py-2">Захист від CSRF-атак</td>
                    <td className="border border-zinc-800 px-4 py-2">Сесія</td>
                    <td className="border border-zinc-800 px-4 py-2">Необхідний</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>cookie_consent</code></td>
                    <td className="border border-zinc-800 px-4 py-2">PIKALEADS</td>
                    <td className="border border-zinc-800 px-4 py-2">Збереження налаштувань згоди на cookies</td>
                    <td className="border border-zinc-800 px-4 py-2">1 рік</td>
                    <td className="border border-zinc-800 px-4 py-2">Необхідний</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>language</code></td>
                    <td className="border border-zinc-800 px-4 py-2">PIKALEADS</td>
                    <td className="border border-zinc-800 px-4 py-2">Збереження вибраної мови</td>
                    <td className="border border-zinc-800 px-4 py-2">1 рік</td>
                    <td className="border border-zinc-800 px-4 py-2">Функціональний</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>_ga</code></td>
                    <td className="border border-zinc-800 px-4 py-2">Google Analytics</td>
                    <td className="border border-zinc-800 px-4 py-2">Розрізнення унікальних користувачів</td>
                    <td className="border border-zinc-800 px-4 py-2">2 роки</td>
                    <td className="border border-zinc-800 px-4 py-2">Аналітичний</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>_gid</code></td>
                    <td className="border border-zinc-800 px-4 py-2">Google Analytics</td>
                    <td className="border border-zinc-800 px-4 py-2">Розрізнення унікальних користувачів</td>
                    <td className="border border-zinc-800 px-4 py-2">24 години</td>
                    <td className="border border-zinc-800 px-4 py-2">Аналітичний</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>_clck</code></td>
                    <td className="border border-zinc-800 px-4 py-2">Microsoft Clarity</td>
                    <td className="border border-zinc-800 px-4 py-2">Збереження унікального ID користувача</td>
                    <td className="border border-zinc-800 px-4 py-2">1 рік</td>
                    <td className="border border-zinc-800 px-4 py-2">Аналітичний</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>_fbp</code></td>
                    <td className="border border-zinc-800 px-4 py-2">Meta Pixel</td>
                    <td className="border border-zinc-800 px-4 py-2">Відстеження відвідувачів для реклами</td>
                    <td className="border border-zinc-800 px-4 py-2">3 місяці</td>
                    <td className="border border-zinc-800 px-4 py-2">Маркетинговий</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>_gcl_aw</code></td>
                    <td className="border border-zinc-800 px-4 py-2">Google Ads</td>
                    <td className="border border-zinc-800 px-4 py-2">Відстеження конверсій з Google Ads</td>
                    <td className="border border-zinc-800 px-4 py-2">90 днів</td>
                    <td className="border border-zinc-800 px-4 py-2">Маркетинговий</td>
                  </tr>
                  <tr>
                    <td className="border border-zinc-800 px-4 py-2"><code>_ttp</code></td>
                    <td className="border border-zinc-800 px-4 py-2">TikTok Pixel</td>
                    <td className="border border-zinc-800 px-4 py-2">Відстеження конверсій з TikTok Ads</td>
                    <td className="border border-zinc-800 px-4 py-2">13 місяців</td>
                    <td className="border border-zinc-800 px-4 py-2">Маркетинговий</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 6 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">6. Інші технології відстеження</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">6.1. Веб-маяки (Web Beacons)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Веб-маяки (також відомі як пікселі відстеження) – це невеликі невидимі зображення, вбудовані в веб-сторінки або електронні листи. Вони використовуються для відстеження відкриття листів, переходів по посиланнях та взаємодії з контентом.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">6.2. Local Storage та Session Storage</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми використовуємо технології Local Storage та Session Storage для зберігання даних безпосередньо у вашому браузері. На відміну від cookies, ці дані не передаються на сервер з кожним запитом. Вони використовуються для:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Збереження прогресу проходження квізів</li>
              <li>Кешування даних для швидшого завантаження</li>
              <li>Збереження тимчасових налаштувань</li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">6.3. UTM-мітки</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              UTM-мітки – це параметри, додані до URL-адрес для відстеження джерел трафіку. Вони не є cookies, але допомагають нам зрозуміти, звідки приходять відвідувачі (пошукові системи, соціальні мережі, рекламні кампанії). Приклад: <code className="text-yellow-400">?utm_source=facebook&utm_medium=cpc&utm_campaign=summer2024</code>
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">6.4. Fingerprinting (Цифровий відбиток)</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми НЕ використовуємо технології fingerprinting для ідентифікації користувачів на основі конфігурації їхніх пристроїв. Ми поважаємо вашу конфіденційність і покладаємося виключно на cookies та аналогічні технології з вашої згоди.
            </p>
          </section>

          {/* Section 7 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">7. Як керувати cookies</h2>
            
            <h3 className="text-xl font-semibold mb-3 text-yellow-400">7.1. Налаштування згоди на Сайті</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              При першому відвідуванні нашого Сайту ви побачите банер згоди на використання cookies. Ви можете:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Прийняти всі cookies (рекомендовано для найкращого досвіду)</li>
              <li>Відхилити необов'язкові cookies (залишити лише необхідні)</li>
              <li>Налаштувати cookies за категоріями (вибрати, які типи дозволити)</li>
            </ul>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви можете змінити свої налаштування в будь-який час, натиснувши на кнопку «Налаштування cookies» у футері Сайту.
            </p>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">7.2. Налаштування браузера</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Більшість браузерів дозволяють керувати cookies через налаштування. Ви можете:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li>Блокувати всі cookies</li>
              <li>Блокувати лише сторонні cookies</li>
              <li>Видалити існуючі cookies</li>
              <li>Налаштувати виключення для конкретних сайтів</li>
            </ul>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <p className="text-white font-semibold mb-3">Інструкції для популярних браузерів:</p>
              <ul className="text-zinc-300 space-y-2">
                <li><strong className="text-white">Google Chrome:</strong> Налаштування → Конфіденційність та безпека → Файли cookie та інші дані сайтів</li>
                <li><strong className="text-white">Mozilla Firefox:</strong> Налаштування → Приватність і захист → Файли cookie та дані сайтів</li>
                <li><strong className="text-white">Safari:</strong> Налаштування → Конфіденційність → Керування даними веб-сайтів</li>
                <li><strong className="text-white">Microsoft Edge:</strong> Налаштування → Файли cookie та дозволи сайтів → Керування файлами cookie</li>
                <li><strong className="text-white">Opera:</strong> Налаштування → Конфіденційність і безпека → Файли cookie</li>
              </ul>
            </div>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">7.3. Відмова від рекламних cookies</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ви можете відмовитися від персоналізованої реклами, скориставшись наступними інструментами:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li><a href="https://www.youronlinechoices.com/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Your Online Choices</a> (Європа)</li>
              <li><a href="https://optout.aboutads.info/" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Digital Advertising Alliance</a> (США)</li>
              <li><a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Google Ads Settings</a></li>
              <li><a href="https://www.facebook.com/ads/preferences" target="_blank" rel="noopener noreferrer" className="text-yellow-400 hover:underline">Facebook Ad Preferences</a></li>
            </ul>

            <h3 className="text-xl font-semibold mb-3 text-yellow-400">7.4. Режим приватного перегляду</h3>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Більшість браузерів пропонують режим приватного перегляду (Incognito в Chrome, Private Browsing у Firefox/Safari), який автоматично видаляє cookies після закриття вікна. Однак це не забезпечує повної анонімності в Інтернеті.
            </p>
          </section>

          {/* Section 8 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">8. Наслідки відмови від cookies</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Якщо ви вирішите заблокувати або видалити cookies, це може вплинути на функціональність Сайту:
            </p>
            <ul className="list-disc list-inside text-zinc-300 mb-4 space-y-2 ml-4">
              <li><strong className="text-white">Необхідні cookies:</strong> Без них деякі функції Сайту не працюватимуть (форми, квізи, авторизація).</li>
              <li><strong className="text-white">Функціональні cookies:</strong> Ваші налаштування (мова, тема) не збережуться між візитами.</li>
              <li><strong className="text-white">Аналітичні cookies:</strong> Ми не зможемо покращувати Сайт на основі даних про використання.</li>
              <li><strong className="text-white">Маркетингові cookies:</strong> Ви побачите менш релевантну рекламу, але її кількість не зменшиться.</li>
            </ul>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми рекомендуємо дозволити принаймні необхідні та функціональні cookies для оптимальної роботи Сайту.
            </p>
          </section>

          {/* Section 9 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">9. Оновлення Політики cookies</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Ми можемо періодично оновлювати цю Політику для відображення змін у наших практиках використання cookies або відповідно до законодавчих вимог. Дата останньої редакції завжди вказана на початку документа.
            </p>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Про суттєві зміни ми повідомимо вас через банер на Сайті або електронною поштою (якщо ви надали її). Рекомендуємо періодично переглядати цю Політику.
            </p>
          </section>

          {/* Section 10 */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4 text-white">10. Контактна інформація</h2>
            <p className="text-zinc-300 mb-4 leading-relaxed">
              Якщо у вас є запитання щодо використання cookies на нашому Сайті, будь ласка, зв'яжіться з нами:
            </p>
            <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-6 mb-4">
              <p className="text-white mb-2"><strong>ТОВ «ПІКАЛІДС»</strong></p>
              <p className="text-zinc-300 mb-2">Email: <a href="mailto:privacy@pikaleads.com" className="text-yellow-400 hover:underline">privacy@pikaleads.com</a></p>
              <p className="text-zinc-300 mb-2">Телефон: <a href="tel:+380992377117" className="text-yellow-400 hover:underline">+380 99 23 77 117</a></p>
              <p className="text-zinc-300 mb-2">Telegram: <a href="https://t.me/pikaleads" className="text-yellow-400 hover:underline">@pikaleads</a></p>
            </div>
          </section>

          {/* Footer */}
          <div className="border-t border-zinc-800 pt-8 mt-12">
            <p className="text-zinc-400 text-sm mb-4">
              Ця Політика використання cookies складена відповідно до вимог:
            </p>
            <ul className="list-disc list-inside text-zinc-400 text-sm space-y-1 ml-4">
              <li>Загального регламенту захисту даних ЄС (GDPR) 2016/679</li>
              <li>Директиви ЄС про конфіденційність та електронні комунікації (ePrivacy Directive) 2002/58/EC</li>
              <li>Закону України «Про захист персональних даних»</li>
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
