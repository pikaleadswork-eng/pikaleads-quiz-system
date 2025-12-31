import { useLanguage } from "@/contexts/LanguageContext";
import QuizLayout from "@/components/QuizLayout";
import { Link } from "wouter";

const privacyTranslations = {
  uk: {
    title: "Політика конфіденційності",
    lastUpdated: "Остання оновлена: 7 грудня 2025",
    intro: "ФОП 'Грибук Роман Миколайович' (далі - 'ми', 'наша компанія') поважає вашу конфіденційність і зобов'язується захищати ваші персональні дані. Ця політика конфіденційності пояснює, як ми збираємо, використовуємо та захищаємо вашу інформацію.",
    section1Title: "1. Інформація, яку ми збираємо",
    section1Content: "Ми збираємо наступну інформацію, коли ви заповнюєте наші квізи:\n• Ім'я\n• Номер телефону\n• Telegram username (необов'язково)\n• Відповіді на питання квізу\n• Мова інтерфейсу\n• IP-адреса та дані про браузер (автоматично)",
    section2Title: "2. Як ми використовуємо вашу інформацію",
    section2Content: "Ваша інформація використовується для:\n• Зв'язку з вами щодо наших послуг\n• Надання персоналізованих рекомендацій\n• Покращення наших послуг\n• Аналізу ефективності маркетингових кампаній",
    section3Title: "3. Cookies та відстеження",
    section3Content: "Ми використовуємо cookies для:\n• Збереження мовних налаштувань\n• Аналітики (Google Analytics, Meta Pixel)\n• Покращення користувацького досвіду\n\nВи можете відмовитися від cookies через налаштування браузера.",
    section4Title: "4. Захист даних",
    section4Content: "Ми вживаємо відповідних технічних та організаційних заходів для захисту ваших персональних даних від несанкціонованого доступу, втрати або розкриття.",
    section5Title: "5. Ваші права (GDPR)",
    section5Content: "Ви маєте право:\n• Отримати доступ до своїх даних\n• Виправити неточні дані\n• Видалити свої дані\n• Обмежити обробку даних\n• Заперечити проти обробки\n• Перенести дані",
    section6Title: "6. Контактна інформація",
    section6Content: "Якщо у вас є питання щодо цієї політики конфіденційності, зв'яжіться з нами:",
    backToHome: "Повернутися на головну",
  },
  ru: {
    title: "Политика конфиденциальности",
    lastUpdated: "Последнее обновление: 7 декабря 2025",
    intro: "ФОП 'Грибук Роман Николаевич' (далее - 'мы', 'наша компания') уважает вашу конфиденциальность и обязуется защищать ваши персональные данные. Эта политика конфиденциальности объясняет, как мы собираем, используем и защищаем вашу информацию.",
    section1Title: "1. Информация, которую мы собираем",
    section1Content: "Мы собираем следующую информацию, когда вы заполняете наши квизы:\n• Имя\n• Номер телефона\n• Telegram username (необязательно)\n• Ответы на вопросы квиза\n• Язык интерфейса\n• IP-адрес и данные о браузере (автоматически)",
    section2Title: "2. Как мы используем вашу информацию",
    section2Content: "Ваша информация используется для:\n• Связи с вами по поводу наших услуг\n• Предоставления персонализированных рекомендаций\n• Улучшения наших услуг\n• Анализа эффективности маркетинговых кампаний",
    section3Title: "3. Cookies и отслеживание",
    section3Content: "Мы используем cookies для:\n• Сохранения языковых настроек\n• Аналитики (Google Analytics, Meta Pixel)\n• Улучшения пользовательского опыта\n\nВы можете отказаться от cookies через настройки браузера.",
    section4Title: "4. Защита данных",
    section4Content: "Мы принимаем соответствующие технические и организационные меры для защиты ваших персональных данных от несанкционированного доступа, потери или раскрытия.",
    section5Title: "5. Ваши права (GDPR)",
    section5Content: "Вы имеете право:\n• Получить доступ к своим данным\n• Исправить неточные данные\n• Удалить свои данные\n• Ограничить обработку данных\n• Возразить против обработки\n• Перенести данные",
    section6Title: "6. Контактная информация",
    section6Content: "Если у вас есть вопросы по поводу этой политики конфиденциальности, свяжитесь с нами:",
    backToHome: "Вернуться на главную",
  },
  en: {
    title: "Privacy Policy",
    lastUpdated: "Last updated: December 7, 2025",
    intro: "FOP 'Hrybuk Roman Mykolayovych' (hereinafter - 'we', 'our company') respects your privacy and is committed to protecting your personal data. This privacy policy explains how we collect, use, and protect your information.",
    section1Title: "1. Information We Collect",
    section1Content: "We collect the following information when you complete our quizzes:\n• Name\n• Phone number\n• Telegram username (optional)\n• Quiz answers\n• Interface language\n• IP address and browser data (automatically)",
    section2Title: "2. How We Use Your Information",
    section2Content: "Your information is used for:\n• Contacting you about our services\n• Providing personalized recommendations\n• Improving our services\n• Analyzing marketing campaign effectiveness",
    section3Title: "3. Cookies and Tracking",
    section3Content: "We use cookies for:\n• Storing language preferences\n• Analytics (Google Analytics, Meta Pixel)\n• Improving user experience\n\nYou can opt-out of cookies through your browser settings.",
    section4Title: "4. Data Protection",
    section4Content: "We take appropriate technical and organizational measures to protect your personal data from unauthorized access, loss, or disclosure.",
    section5Title: "5. Your Rights (GDPR)",
    section5Content: "You have the right to:\n• Access your data\n• Correct inaccurate data\n• Delete your data\n• Restrict data processing\n• Object to processing\n• Data portability",
    section6Title: "6. Contact Information",
    section6Content: "If you have questions about this privacy policy, contact us:",
    backToHome: "Return to Home",
  },
  pl: {
    title: "Polityka prywatności",
    lastUpdated: "Ostatnia aktualizacja: 7 grudnia 2025",
    intro: "FOP 'Hrybuk Roman Mykolayovych' (dalej - 'my', 'nasza firma') szanuje Twoją prywatność i zobowiązuje się chronić Twoje dane osobowe. Ta polityka prywatności wyjaśnia, jak zbieramy, wykorzystujemy i chronimy Twoje informacje.",
    section1Title: "1. Informacje, które zbieramy",
    section1Content: "Zbieramy następujące informacje, gdy wypełniasz nasze quizy:\n• Imię\n• Numer telefonu\n• Telegram username (opcjonalnie)\n• Odpowiedzi na pytania quizu\n• Język interfejsu\n• Adres IP i dane przeglądarki (automatycznie)",
    section2Title: "2. Jak wykorzystujemy Twoje informacje",
    section2Content: "Twoje informacje są wykorzystywane do:\n• Kontaktu z Tobą w sprawie naszych usług\n• Dostarczania spersonalizowanych rekomendacji\n• Ulepszania naszych usług\n• Analizy skuteczności kampanii marketingowych",
    section3Title: "3. Pliki cookie i śledzenie",
    section3Content: "Używamy plików cookie do:\n• Przechowywania preferencji językowych\n• Analityki (Google Analytics, Meta Pixel)\n• Poprawy doświadczenia użytkownika\n\nMożesz zrezygnować z plików cookie w ustawieniach przeglądarki.",
    section4Title: "4. Ochrona danych",
    section4Content: "Podejmujemy odpowiednie środki techniczne i organizacyjne w celu ochrony Twoich danych osobowych przed nieautoryzowanym dostępem, utratą lub ujawnieniem.",
    section5Title: "5. Twoje prawa (RODO)",
    section5Content: "Masz prawo do:\n• Dostępu do swoich danych\n• Poprawiania nieprawidłowych danych\n• Usunięcia swoich danych\n• Ograniczenia przetwarzania danych\n• Sprzeciwu wobec przetwarzania\n• Przenoszenia danych",
    section6Title: "6. Informacje kontaktowe",
    section6Content: "Jeśli masz pytania dotyczące tej polityki prywatności, skontaktuj się z nami:",
    backToHome: "Powrót do strony głównej",
  },
  de: {
    title: "Datenschutzerklärung",
    lastUpdated: "Zuletzt aktualisiert: 7. Dezember 2025",
    intro: "FOP 'Hrybuk Roman Mykolayovych' (im Folgenden - 'wir', 'unser Unternehmen') respektiert Ihre Privatsphäre und verpflichtet sich, Ihre persönlichen Daten zu schützen. Diese Datenschutzerklärung erklärt, wie wir Ihre Informationen sammeln, verwenden und schützen.",
    section1Title: "1. Informationen, die wir sammeln",
    section1Content: "Wir sammeln die folgenden Informationen, wenn Sie unsere Quizze ausfüllen:\n• Name\n• Telefonnummer\n• Telegram-Benutzername (optional)\n• Quiz-Antworten\n• Schnittstellensprache\n• IP-Adresse und Browserdaten (automatisch)",
    section2Title: "2. Wie wir Ihre Informationen verwenden",
    section2Content: "Ihre Informationen werden verwendet für:\n• Kontaktaufnahme bezüglich unserer Dienstleistungen\n• Bereitstellung personalisierter Empfehlungen\n• Verbesserung unserer Dienstleistungen\n• Analyse der Wirksamkeit von Marketingkampagnen",
    section3Title: "3. Cookies und Tracking",
    section3Content: "Wir verwenden Cookies für:\n• Speicherung von Spracheinstellungen\n• Analytik (Google Analytics, Meta Pixel)\n• Verbesserung der Benutzererfahrung\n\nSie können Cookies über Ihre Browsereinstellungen ablehnen.",
    section4Title: "4. Datenschutz",
    section4Content: "Wir ergreifen angemessene technische und organisatorische Maßnahmen zum Schutz Ihrer persönlichen Daten vor unbefugtem Zugriff, Verlust oder Offenlegung.",
    section5Title: "5. Ihre Rechte (DSGVO)",
    section5Content: "Sie haben das Recht:\n• Auf Zugang zu Ihren Daten\n• Auf Berichtigung ungenauer Daten\n• Auf Löschung Ihrer Daten\n• Auf Einschränkung der Verarbeitung\n• Auf Widerspruch gegen die Verarbeitung\n• Auf Datenübertragbarkeit",
    section6Title: "6. Kontaktinformationen",
    section6Content: "Wenn Sie Fragen zu dieser Datenschutzerklärung haben, kontaktieren Sie uns:",
    backToHome: "Zurück zur Startseite",
  },
};

export default function Privacy() {
  const { language } = useLanguage();
  const t = privacyTranslations[language];

  return (
    <QuizLayout>
      <div className="min-h-screen bg-black text-gray-100 py-12 px-4">
        <div className="container mx-auto max-w-4xl">
          <Link href="/" className="text-yellow-400 hover:text-yellow-300 mb-6 inline-block">
            ← {t.backToHome}
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t.title}
          </h1>
          <p className="text-gray-400 mb-8">{t.lastUpdated}</p>

          <div className="space-y-8">
            <section>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {t.intro}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">{t.section1Title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {t.section1Content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">{t.section2Title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {t.section2Content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">{t.section3Title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {t.section3Content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">{t.section4Title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {t.section4Content}
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">{t.section5Title}</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">
                {t.section5Content}
              </p>
            </section>

            <section className="bg-gray-900 p-6 rounded-lg border border-purple-500/30">
              <h2 className="text-2xl font-bold text-white mb-4">{t.section6Title}</h2>
              <p className="text-gray-300 mb-4">{t.section6Content}</p>
              <div className="space-y-2 text-gray-300">
                <p><strong>ФОП "Грибук Роман Миколайович"</strong></p>
                <p>📞 Тел.: <a href="tel:+380992377117" className="text-yellow-400 hover:text-yellow-300">+380 99 237 71 17</a></p>
                <p>📧 Email: <a href="mailto:info@pika-leads.com" className="text-yellow-400 hover:text-yellow-300">info@pika-leads.com</a></p>
                <p>📍 Адреса: вул. Незалежності 44а., м.Ківерці, Волинська обл., Україна</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </QuizLayout>
  );
}
