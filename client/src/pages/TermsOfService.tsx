import { useLanguage } from "@/contexts/LanguageContext";
import Footer from "@/components/Footer";
import CyberpunkNavigation from "@/components/CyberpunkNavigation";

export default function TermsOfService() {
  const { language } = useLanguage();

  const content = {
    uk: {
      title: "Умови використання (Terms of Service)",
      lastUpdated: "Останнє оновлення: 23 грудня 2025",
      intro: "Ці Умови використання регулюють ваше використання веб-сайту PIKA LEADS та наших послуг. Використовуючи наш сайт, ви погоджуєтесь з цими умовами.",
      sections: [
        {
          title: "1. Прийняття умов",
          content: [
            "Використовуючи веб-сайт pika-leads.com (далі — 'Сайт') та послуги PIKA LEADS (ФОП 'Грибук Роман Миколайович'), ви підтверджуєте, що:",
            "• Ви прочитали та зрозуміли ці Умови використання",
            "• Ви погоджуєтесь дотримуватися цих умов",
            "• Ви маєте право укладати юридично обов'язкову угоду",
            "• Ви досягли віку 18 років або маєте згоду батьків/опікунів",
            "Якщо ви не згодні з будь-якими положеннями цих Умов, будь ласка, не використовуйте наш Сайт та послуги."
          ]
        },
        {
          title: "2. Опис послуг",
          content: [
            "PIKA LEADS надає наступні послуги:",
            "• Налаштування та управління рекламними кампаніями (Meta Ads, Google Ads, TikTok Ads)",
            "• Генерація лідів через квізи та лендінги",
            "• Аналітика та оптимізація маркетингових кампаній",
            "• Консультації з цифрового маркетингу",
            "• Інтеграція CRM систем та автоматизація процесів",
            "• Аудит рекламних кампаній",
            "Ми залишаємо за собою право змінювати, призупиняти або припиняти будь-які послуги без попереднього повідомлення."
          ]
        },
        {
          title: "3. Реєстрація та облікові записи",
          content: [
            "Для доступу до деяких функцій Сайту може знадобитися реєстрація облікового запису. Ви зобов'язуєтесь:",
            "• Надавати точну та актуальну інформацію",
            "• Підтримувати безпеку вашого пароля",
            "• Негайно повідомляти нас про несанкціонований доступ",
            "• Нести відповідальність за всі дії, вчинені через ваш обліковий запис",
            "Ми залишаємо за собою право відмовити в реєстрації або припинити обліковий запис на власний розсуд."
          ]
        },
        {
          title: "4. Інтелектуальна власність",
          content: [
            "Весь контент на Сайті (тексти, графіка, логотипи, зображення, відео, програмне забезпечення) є власністю PIKA LEADS або наших ліцензіарів та захищений законами про авторське право.",
            "Ви не маєте права:",
            "• Копіювати, модифікувати, розповсюджувати або продавати будь-який контент Сайту",
            "• Використовувати наші торгові марки без письмового дозволу",
            "• Створювати похідні роботи на основі нашого контенту",
            "• Використовувати автоматизовані системи (боти, скрепери) для збору даних з Сайту"
          ]
        },
        {
          title: "5. Заборонена поведінка",
          content: [
            "Використовуючи Сайт, ви погоджуєтесь НЕ:",
            "• Порушувати будь-які закони України або міжнародні закони",
            "• Надсилати спам, шкідливе програмне забезпечення або віруси",
            "• Намагатися отримати несанкціонований доступ до Сайту або серверів",
            "• Втручатися в роботу Сайту або створювати надмірне навантаження",
            "• Видавати себе за іншу особу або організацію",
            "• Збирати персональні дані інших користувачів",
            "• Публікувати образливий, дискримінаційний або незаконний контент"
          ]
        },
        {
          title: "6. Умови оплати та повернення коштів",
          content: [
            "**6.1. Оплата послуг:**",
            "• Оплата здійснюється згідно з комерційною пропозицією",
            "• Ціни вказані в гривнях (UAH) або доларах США (USD)",
            "• Оплата може здійснюватися банківським переказом або онлайн-платежами",
            "",
            "**6.2. Повернення коштів:**",
            "• Повернення коштів можливе лише у випадках, передбачених договором",
            "• Запит на повернення коштів має бути поданий протягом 14 днів",
            "• Повернення не здійснюється за вже надані послуги",
            "• Рекламний бюджет, витрачений на платформах (Meta, Google), не підлягає поверненню"
          ]
        },
        {
          title: "7. Відповідальність та гарантії",
          content: [
            "**7.1. Обмеження відповідальності:**",
            "PIKA LEADS не несе відповідальності за:",
            "• Непрямі, випадкові або непередбачені збитки",
            "• Втрату прибутку або даних",
            "• Дії третіх сторін (Meta, Google, TikTok)",
            "• Технічні збої або перерви в роботі Сайту",
            "• Результати рекламних кампаній (ROI, ROAS, CPL не гарантуються)",
            "",
            "**7.2. Відмова від гарантій:**",
            "Сайт та послуги надаються 'як є' без будь-яких гарантій. Ми не гарантуємо:",
            "• Безперебійну роботу Сайту",
            "• Відсутність помилок або вірусів",
            "• Точність або повноту інформації",
            "• Конкретні результати від використання наших послуг"
          ]
        },
        {
          title: "8. Припинення дії",
          content: [
            "Ми залишаємо за собою право припинити або обмежити ваш доступ до Сайту та послуг у будь-який час без попереднього повідомлення у випадках:",
            "• Порушення цих Умов використання",
            "• Шахрайської або незаконної діяльності",
            "• Неоплати послуг",
            "• На власний розсуд з будь-якої іншої причини",
            "При припиненні дії ви зобов'язані припинити використання Сайту та видалити всі матеріали, отримані з нього."
          ]
        },
        {
          title: "9. Зміни до Умов",
          content: [
            "Ми залишаємо за собою право змінювати ці Умови використання в будь-який час. Про суттєві зміни ми повідомимо:",
            "• Розміщенням повідомлення на головній сторінці Сайту",
            "• Надсиланням електронного листа (якщо ви підписані)",
            "Продовження використання Сайту після внесення змін означає вашу згоду з оновленими Умовами."
          ]
        },
        {
          title: "10. Застосовне право та вирішення спорів",
          content: [
            "Ці Умови регулюються законодавством України. Будь-які спори, що виникають у зв'язку з цими Умовами, вирішуються шляхом переговорів.",
            "Якщо спір не може бути вирішений шляхом переговорів протягом 30 днів, він передається на розгляд до компетентного суду за місцезнаходженням PIKA LEADS (Київ, Україна)."
          ]
        },
        {
          title: "11. Контактна інформація",
          content: [
            "З питань щодо цих Умов використання зв'яжіться з нами:",
            "Email: support@pika-leads.com",
            "Телефон: +38 099 23 77 117",
            "Адреса: Україна, Київ",
            "ФОП 'Грибук Роман Миколайович'"
          ]
        }
      ]
    },
    en: {
      title: "Terms of Service",
      lastUpdated: "Last updated: December 23, 2025",
      intro: "These Terms of Service govern your use of the PIKA LEADS website and our services. By using our site, you agree to these terms.",
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: [
            "By using the website pika-leads.com (the 'Site') and PIKA LEADS services (FOP 'Hrybuk Roman Mykolaiovych'), you confirm that:",
            "• You have read and understood these Terms of Service",
            "• You agree to comply with these terms",
            "• You have the right to enter into a legally binding agreement",
            "• You are 18 years of age or have parental/guardian consent",
            "If you do not agree with any provisions of these Terms, please do not use our Site and services."
          ]
        },
        {
          title: "2. Description of Services",
          content: [
            "PIKA LEADS provides the following services:",
            "• Setup and management of advertising campaigns (Meta Ads, Google Ads, TikTok Ads)",
            "• Lead generation through quizzes and landing pages",
            "• Analytics and optimization of marketing campaigns",
            "• Digital marketing consultations",
            "• CRM system integration and process automation",
            "• Advertising campaign audits",
            "We reserve the right to change, suspend, or discontinue any services without prior notice."
          ]
        },
        {
          title: "3. Registration and Accounts",
          content: [
            "Access to some Site features may require account registration. You agree to:",
            "• Provide accurate and current information",
            "• Maintain the security of your password",
            "• Immediately notify us of unauthorized access",
            "• Be responsible for all actions taken through your account",
            "We reserve the right to refuse registration or terminate an account at our discretion."
          ]
        },
        {
          title: "4. Intellectual Property",
          content: [
            "All content on the Site (texts, graphics, logos, images, videos, software) is the property of PIKA LEADS or our licensors and is protected by copyright laws.",
            "You may not:",
            "• Copy, modify, distribute, or sell any Site content",
            "• Use our trademarks without written permission",
            "• Create derivative works based on our content",
            "• Use automated systems (bots, scrapers) to collect data from the Site"
          ]
        },
        {
          title: "5. Prohibited Conduct",
          content: [
            "By using the Site, you agree NOT to:",
            "• Violate any laws of Ukraine or international laws",
            "• Send spam, malware, or viruses",
            "• Attempt to gain unauthorized access to the Site or servers",
            "• Interfere with Site operation or create excessive load",
            "• Impersonate another person or organization",
            "• Collect personal data of other users",
            "• Post offensive, discriminatory, or illegal content"
          ]
        },
        {
          title: "6. Payment and Refund Terms",
          content: [
            "**6.1. Payment for Services:**",
            "• Payment is made according to the commercial proposal",
            "• Prices are in hryvnias (UAH) or US dollars (USD)",
            "• Payment can be made by bank transfer or online payments",
            "",
            "**6.2. Refunds:**",
            "• Refunds are only possible in cases provided by the contract",
            "• Refund requests must be submitted within 14 days",
            "• No refunds for services already provided",
            "• Advertising budget spent on platforms (Meta, Google) is non-refundable"
          ]
        },
        {
          title: "7. Liability and Warranties",
          content: [
            "**7.1. Limitation of Liability:**",
            "PIKA LEADS is not liable for:",
            "• Indirect, incidental, or unforeseen damages",
            "• Loss of profit or data",
            "• Actions of third parties (Meta, Google, TikTok)",
            "• Technical failures or Site interruptions",
            "• Advertising campaign results (ROI, ROAS, CPL not guaranteed)",
            "",
            "**7.2. Disclaimer of Warranties:**",
            "The Site and services are provided 'as is' without any warranties. We do not guarantee:",
            "• Uninterrupted Site operation",
            "• Absence of errors or viruses",
            "• Accuracy or completeness of information",
            "• Specific results from using our services"
          ]
        },
        {
          title: "8. Termination",
          content: [
            "We reserve the right to terminate or restrict your access to the Site and services at any time without prior notice in cases of:",
            "• Violation of these Terms of Service",
            "• Fraudulent or illegal activity",
            "• Non-payment for services",
            "• At our discretion for any other reason",
            "Upon termination, you must cease using the Site and delete all materials obtained from it."
          ]
        },
        {
          title: "9. Changes to Terms",
          content: [
            "We reserve the right to change these Terms of Service at any time. We will notify you of significant changes by:",
            "• Posting a notice on the Site's homepage",
            "• Sending an email (if you are subscribed)",
            "Continued use of the Site after changes means your agreement with the updated Terms."
          ]
        },
        {
          title: "10. Applicable Law and Dispute Resolution",
          content: [
            "These Terms are governed by the laws of Ukraine. Any disputes arising in connection with these Terms shall be resolved through negotiations.",
            "If a dispute cannot be resolved through negotiations within 30 days, it shall be submitted to a competent court at the location of PIKA LEADS (Kyiv, Ukraine)."
          ]
        },
        {
          title: "11. Contact Information",
          content: [
            "For questions regarding these Terms of Service, contact us:",
            "Email: support@pika-leads.com",
            "Phone: +38 099 23 77 117",
            "Address: Ukraine, Kyiv",
            "FOP 'Hrybuk Roman Mykolaiovych'"
          ]
        }
      ]
    },
    ru: {
      title: "Условия использования (Terms of Service)",
      lastUpdated: "Последнее обновление: 23 декабря 2025",
      intro: "Эти Условия использования регулируют ваше использование веб-сайта PIKA LEADS и наших услуг. Используя наш сайт, вы соглашаетесь с этими условиями.",
      sections: [
        {
          title: "1. Принятие условий",
          content: [
            "Используя веб-сайт pika-leads.com (далее — 'Сайт') и услуги PIKA LEADS (ФОП 'Грибук Роман Николаевич'), вы подтверждаете, что:",
            "• Вы прочитали и поняли эти Условия использования",
            "• Вы соглашаетесь соблюдать эти условия",
            "• Вы имеете право заключать юридически обязывающее соглашение",
            "• Вы достигли возраста 18 лет или имеете согласие родителей/опекунов",
            "Если вы не согласны с какими-либо положениями этих Условий, пожалуйста, не используйте наш Сайт и услуги."
          ]
        },
        {
          title: "2. Описание услуг",
          content: [
            "PIKA LEADS предоставляет следующие услуги:",
            "• Настройка и управление рекламными кампаниями (Meta Ads, Google Ads, TikTok Ads)",
            "• Генерация лидов через квизы и лендинги",
            "• Аналитика и оптимизация маркетинговых кампаний",
            "• Консультации по цифровому маркетингу",
            "• Интеграция CRM систем и автоматизация процессов",
            "• Аудит рекламных кампаний",
            "Мы оставляем за собой право изменять, приостанавливать или прекращать любые услуги без предварительного уведомления."
          ]
        },
        {
          title: "3. Регистрация и учетные записи",
          content: [
            "Для доступа к некоторым функциям Сайта может потребоваться регистрация учетной записи. Вы обязуетесь:",
            "• Предоставлять точную и актуальную информацию",
            "• Поддерживать безопасность вашего пароля",
            "• Немедленно уведомлять нас о несанкционированном доступе",
            "• Нести ответственность за все действия, совершенные через вашу учетную запись",
            "Мы оставляем за собой право отказать в регистрации или прекратить учетную запись по собственному усмотрению."
          ]
        },
        {
          title: "4. Интеллектуальная собственность",
          content: [
            "Весь контент на Сайте (тексты, графика, логотипы, изображения, видео, программное обеспечение) является собственностью PIKA LEADS или наших лицензиаров и защищен законами об авторском праве.",
            "Вы не имеете права:",
            "• Копировать, модифицировать, распространять или продавать любой контент Сайта",
            "• Использовать наши торговые марки без письменного разрешения",
            "• Создавать производные работы на основе нашего контента",
            "• Использовать автоматизированные системы (боты, скреперы) для сбора данных с Сайта"
          ]
        },
        {
          title: "5. Запрещенное поведение",
          content: [
            "Используя Сайт, вы соглашаетесь НЕ:",
            "• Нарушать любые законы Украины или международные законы",
            "• Отправлять спам, вредоносное программное обеспечение или вирусы",
            "• Пытаться получить несанкционированный доступ к Сайту или серверам",
            "• Вмешиваться в работу Сайта или создавать чрезмерную нагрузку",
            "• Выдавать себя за другое лицо или организацию",
            "• Собирать персональные данные других пользователей",
            "• Публиковать оскорбительный, дискриминационный или незаконный контент"
          ]
        },
        {
          title: "6. Условия оплаты и возврата средств",
          content: [
            "**6.1. Оплата услуг:**",
            "• Оплата осуществляется согласно коммерческому предложению",
            "• Цены указаны в гривнах (UAH) или долларах США (USD)",
            "• Оплата может осуществляться банковским переводом или онлайн-платежами",
            "",
            "**6.2. Возврат средств:**",
            "• Возврат средств возможен только в случаях, предусмотренных договором",
            "• Запрос на возврат средств должен быть подан в течение 14 дней",
            "• Возврат не осуществляется за уже предоставленные услуги",
            "• Рекламный бюджет, потраченный на платформах (Meta, Google), не подлежит возврату"
          ]
        },
        {
          title: "7. Ответственность и гарантии",
          content: [
            "**7.1. Ограничение ответственности:**",
            "PIKA LEADS не несет ответственности за:",
            "• Косвенные, случайные или непредвиденные убытки",
            "• Потерю прибыли или данных",
            "• Действия третьих сторон (Meta, Google, TikTok)",
            "• Технические сбои или перерывы в работе Сайта",
            "• Результаты рекламных кампаний (ROI, ROAS, CPL не гарантируются)",
            "",
            "**7.2. Отказ от гарантий:**",
            "Сайт и услуги предоставляются 'как есть' без каких-либо гарантий. Мы не гарантируем:",
            "• Бесперебойную работу Сайта",
            "• Отсутствие ошибок или вирусов",
            "• Точность или полноту информации",
            "• Конкретные результаты от использования наших услуг"
          ]
        },
        {
          title: "8. Прекращение действия",
          content: [
            "Мы оставляем за собой право прекратить или ограничить ваш доступ к Сайту и услугам в любое время без предварительного уведомления в случаях:",
            "• Нарушения этих Условий использования",
            "• Мошеннической или незаконной деятельности",
            "• Неоплаты услуг",
            "• По собственному усмотрению по любой другой причине",
            "При прекращении действия вы обязаны прекратить использование Сайта и удалить все материалы, полученные с него."
          ]
        },
        {
          title: "9. Изменения в Условиях",
          content: [
            "Мы оставляем за собой право изменять эти Условия использования в любое время. О существенных изменениях мы уведомим:",
            "• Размещением уведомления на главной странице Сайта",
            "• Отправкой электронного письма (если вы подписаны)",
            "Продолжение использования Сайта после внесения изменений означает ваше согласие с обновленными Условиями."
          ]
        },
        {
          title: "10. Применимое право и разрешение споров",
          content: [
            "Эти Условия регулируются законодательством Украины. Любые споры, возникающие в связи с этими Условиями, разрешаются путем переговоров.",
            "Если спор не может быть разрешен путем переговоров в течение 30 дней, он передается на рассмотрение в компетентный суд по местонахождению PIKA LEADS (Киев, Украина)."
          ]
        },
        {
          title: "11. Контактная информация",
          content: [
            "По вопросам, касающимся этих Условий использования, свяжитесь с нами:",
            "Email: support@pika-leads.com",
            "Телефон: +38 099 23 77 117",
            "Адрес: Украина, Киев",
            "ФОП 'Грибук Роман Николаевич'"
          ]
        }
      ]
    }
  };

  const t = content[language as keyof typeof content] || content.uk;

  return (
    <div className="min-h-screen bg-black flex flex-col">
      <CyberpunkNavigation />
      
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <h1 className="text-4xl md:text-5xl font-bold text-yellow-400 mb-4">
            {t.title}
          </h1>
          <p className="text-zinc-500 mb-8">{t.lastUpdated}</p>
          
          <div className="prose prose-invert prose-zinc max-w-none">
            <p className="text-zinc-300 leading-relaxed mb-8">
              {t.intro}
            </p>

            {t.sections.map((section, index) => (
              <div key={index} className="mb-8">
                <h2 className="text-2xl font-semibold text-yellow-400 mb-4">
                  {section.title}
                </h2>
                {section.content.map((paragraph, pIndex) => (
                  <p key={pIndex} className="text-zinc-300 leading-relaxed mb-2">
                    {paragraph}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
