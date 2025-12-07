import { Language } from "@/contexts/LanguageContext";

export interface QuizTranslation {
  title: string;
  subtitle: string;
  bonus: string;
  description: string;
  questions: {
    question: string;
    options: string[];
  }[];
}

type QuizTranslations = Record<string, Record<Language, QuizTranslation>>;

export const quizTranslations: QuizTranslations = {
  "meta-furniture": {
    uk: {
      title: "Хочете отримувати 30+ заявок на меблі щодня?",
      subtitle: "Пройдіть короткий квіз — розрахуємо вашу стратегію та вартість заявки",
      bonus: "Безкоштовний аудит вашої реклами + стратегія запуску",
      description: "Отримайте 30+ якісних лідів щодня для вашого меблевого бізнесу",
      questions: [
        {
          question: "Що саме ви продаєте?",
          options: ["Кухні", "М'які меблі", "Шафи / гардероби", "Корпусні меблі", "Все разом"],
        },
        {
          question: "Ваш середній чек?",
          options: ["До $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Ваш бюджет на рекламу?",
          options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Ключова ціль:",
          options: ["Заявки", "Дзвінки", "Візити у салон"],
        },
      ],
    },
    en: {
      title: "Want to Get 30+ Furniture Leads Daily?",
      subtitle: "Take a short quiz and we'll calculate your lead cost and strategy",
      bonus: "Free audit of your advertising + launch strategy",
      description: "Get 30+ quality leads daily for your furniture business",
      questions: [
        {
          question: "What exactly do you sell?",
          options: ["Kitchens", "Soft Furniture", "Wardrobes / Closets", "Case Furniture", "All of the Above"],
        },
        {
          question: "What's your average order value?",
          options: ["Up to $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "What's your advertising budget?",
          options: ["Up to $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "What's your main goal?",
          options: ["Leads", "Phone Calls", "Showroom Visits"],
        },
      ],
    },
    ru: {
      title: "Хотите получать 30+ заявок на мебель ежедневно?",
      subtitle: "Пройдите короткий квиз — рассчитаем вашу стратегию и стоимость заявки",
      bonus: "Бесплатный аудит вашей рекламы + стратегия запуска",
      description: "Получайте 30+ качественных лидов ежедневно для вашего мебельного бизнеса",
      questions: [
        {
          question: "Что именно вы продаёте?",
          options: ["Кухни", "Мягкая мебель", "Шкафы / гардеробы", "Корпусная мебель", "Всё вместе"],
        },
        {
          question: "Ваш средний чек?",
          options: ["До $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Ваш бюджет на рекламу?",
          options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Ключевая цель:",
          options: ["Заявки", "Звонки", "Визиты в салон"],
        },
      ],
    },
    pl: {
      title: "Chcesz otrzymywać 30+ zapytań o meble dziennie?",
      subtitle: "Wypełnij krótki quiz — obliczymy Twoją strategię i koszt leada",
      bonus: "Bezpłatny audyt Twojej reklamy + strategia uruchomienia",
      description: "Uzyskaj 30+ wysokiej jakości leadów dziennie dla Twojego biznesu meblowego",
      questions: [
        {
          question: "Co dokładnie sprzedajesz?",
          options: ["Kuchnie", "Meble tapicerowane", "Szafy / Garderoby", "Meble korpusowe", "Wszystko powyższe"],
        },
        {
          question: "Twoja średnia wartość zamówienia?",
          options: ["Do $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Twój budżet reklamowy?",
          options: ["Do $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Główny cel:",
          options: ["Leady", "Telefony", "Wizyty w salonie"],
        },
      ],
    },
    de: {
      title: "Möchten Sie täglich 30+ Möbel-Leads erhalten?",
      subtitle: "Machen Sie das kurze Quiz — wir berechnen Ihre Strategie und Lead-Kosten",
      bonus: "Kostenloser Audit Ihrer Werbung + Startstrategie",
      description: "Erhalten Sie täglich 30+ qualitativ hochwertige Leads für Ihr Möbelgeschäft",
      questions: [
        {
          question: "Was genau verkaufen Sie?",
          options: ["Küchen", "Polstermöbel", "Schränke / Kleiderschränke", "Kastenmöbel", "Alles zusammen"],
        },
        {
          question: "Ihr durchschnittlicher Bestellwert?",
          options: ["Bis $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Ihr Werbebudget?",
          options: ["Bis $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Was ist Ihr Hauptziel?",
          options: ["Leads", "Telefonanrufe", "Showroom-Besuche"],
        },
      ],
    },
  },
  "meta-repair": {
    uk: {
      title: "Отримуйте 5-15 гарячих лідів щодня на ремонт квартир",
      subtitle: "Пройдіть квіз і отримайте персональний план маркетингу",
      bonus: "Безкоштовний аудит вашої реклами + стратегія запуску",
      description: "5-15 гарячих лідів щодня на ремонтні послуги",
      questions: [
        {
          question: "Який тип ремонту ви пропонуєте?",
          options: ["Косметичний", "Капітальний ремонт", "Елітний ремонт", "Окремі роботи (стіни, електрика, сантехніка)"],
        },
        {
          question: "Ваш середній чек?",
          options: ["До $2000", "$2000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Ваш бюджет на рекламу?",
          options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Ключова ціль:",
          options: ["Заявки", "Дзвінки", "Візити на об'єкт"],
        },
      ],
    },
    en: {
      title: "Get 5-15 Hot Leads Daily for Apartment Renovations",
      subtitle: "Complete the quiz to get your personalized marketing plan",
      bonus: "Free audit of your advertising + launch strategy",
      description: "5-15 hot leads daily for renovation services",
      questions: [
        {
          question: "What type of renovation do you offer?",
          options: ["Cosmetic", "Major Renovation", "Luxury Renovation", "Specific Work (walls, electrical, plumbing)"],
        },
        {
          question: "Your average project value?",
          options: ["Up to $2000", "$2000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Your advertising budget?",
          options: ["Up to $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Main goal:",
          options: ["Leads", "Phone Calls", "Site Visits"],
        },
      ],
    },
    ru: {
      title: "Получайте 5-15 горячих лидов ежедневно на ремонт квартир",
      subtitle: "Пройдите квиз и получите персональный план маркетинга",
      bonus: "Бесплатный аудит вашей рекламы + стратегия запуска",
      description: "5-15 горячих лидов ежедневно на ремонтные услуги",
      questions: [
        {
          question: "Какой тип ремонта вы предлагаете?",
          options: ["Косметический", "Капитальный ремонт", "Элитный ремонт", "Отдельные работы (стены, электрика, сантехника)"],
        },
        {
          question: "Ваш средний чек?",
          options: ["До $2000", "$2000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Ваш бюджет на рекламу?",
          options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Ключевая цель:",
          options: ["Заявки", "Звонки", "Визиты на объект"],
        },
      ],
    },
    pl: {
      title: "Uzyskaj 5-15 gorących leadów dziennie na remonty mieszkań",
      subtitle: "Wypełnij quiz, aby otrzymać spersonalizowany plan marketingowy",
      bonus: "Bezpłatny audyt Twojej reklamy + strategia uruchomienia",
      description: "5-15 gorących leadów dziennie na usługi remontowe",
      questions: [
        {
          question: "Jaki rodzaj remontu oferujesz?",
          options: ["Kosmetyczny", "Generalny remont", "Luksusowy remont", "Konkretne prace (ściany, elektryka, hydraulika)"],
        },
        {
          question: "Twoja średnia wartość projektu?",
          options: ["Do $2000", "$2000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Twój budżet reklamowy?",
          options: ["Do $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Główny cel:",
          options: ["Leady", "Telefony", "Wizyty na miejscu"],
        },
      ],
    },
    de: {
      title: "Erhalten Sie täglich 5-15 heiße Leads für Wohnungsrenovierungen",
      subtitle: "Füllen Sie das Quiz aus, um Ihren personalisierten Marketingplan zu erhalten",
      bonus: "Kostenloser Audit Ihrer Werbung + Startstrategie",
      description: "5-15 heiße Leads täglich für Renovierungsdienstleistungen",
      questions: [
        {
          question: "Welche Art von Renovierung bieten Sie an?",
          options: ["Kosmetisch", "Großrenovierung", "Luxusrenovierung", "Spezifische Arbeiten (Wände, Elektrik, Sanitär)"],
        },
        {
          question: "Ihr durchschnittlicher Projektwert?",
          options: ["Bis $2000", "$2000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Ihr Werbebudget?",
          options: ["Bis $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Hauptziel:",
          options: ["Leads", "Telefonanrufe", "Standortbesuche"],
        },
      ],
    },
  },
  // Adding remaining 8 quizzes with minimal translations (can be expanded later)
  "meta-ecom": {
    uk: { title: "Масштабуйте свій інтернет-магазин з 30-120 лідами щодня", subtitle: "Пройдіть квіз для розрахунку стратегії", bonus: "Безкоштовний аудит + стратегія", description: "Масштабуйте свій онлайн-магазин з 30-120 лідами щодня", questions: [{ question: "Що ви продаєте?", options: ["Одяг/взуття", "Електроніка", "Товари для дому", "Інше"] }, { question: "Середній чек?", options: ["До $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Бюджет?", options: ["До $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Ціль?", options: ["Продажі", "Трафік", "Бренд"] }] },
    en: { title: "Scale Your Online Store with 30-120 Leads Daily", subtitle: "Take the quiz to calculate your strategy", bonus: "Free audit + strategy", description: "Scale your online store with 30-120 leads daily", questions: [{ question: "What do you sell?", options: ["Clothing/Shoes", "Electronics", "Home Goods", "Other"] }, { question: "Average order?", options: ["Up to $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budget?", options: ["Up to $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Goal?", options: ["Sales", "Traffic", "Brand"] }] },
    ru: { title: "Масштабируйте свой интернет-магазин с 30-120 лидами ежедневно", subtitle: "Пройдите квиз для расчёта стратегии", bonus: "Бесплатный аудит + стратегия", description: "Масштабируйте свой онлайн-магазин с 30-120 лидами ежедневно", questions: [{ question: "Что вы продаёте?", options: ["Одежда/обувь", "Электроника", "Товары для дома", "Другое"] }, { question: "Средний чек?", options: ["До $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Бюджет?", options: ["До $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Цель?", options: ["Продажи", "Трафик", "Бренд"] }] },
    pl: { title: "Skaluj swój sklep internetowy z 30-120 leadami dziennie", subtitle: "Wypełnij quiz, aby obliczyć strategię", bonus: "Bezpłatny audyt + strategia", description: "Skaluj swój sklep internetowy z 30-120 leadami dziennie", questions: [{ question: "Co sprzedajesz?", options: ["Odzież/Obuwie", "Elektronika", "Artykuły domowe", "Inne"] }, { question: "Średnie zamówienie?", options: ["Do $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budżet?", options: ["Do $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Cel?", options: ["Sprzedaż", "Ruch", "Marka"] }] },
    de: { title: "Skalieren Sie Ihren Online-Shop mit 30-120 Leads täglich", subtitle: "Machen Sie das Quiz, um Ihre Strategie zu berechnen", bonus: "Kostenloser Audit + Strategie", description: "Skalieren Sie Ihren Online-Shop mit 30-120 Leads täglich", questions: [{ question: "Was verkaufen Sie?", options: ["Kleidung/Schuhe", "Elektronik", "Haushaltswaren", "Anderes"] }, { question: "Durchschnittliche Bestellung?", options: ["Bis $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budget?", options: ["Bis $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Ziel?", options: ["Verkäufe", "Traffic", "Marke"] }] },
  },
  "meta-products": {
    uk: { title: "Продавайте більше товарів з Meta Ads", subtitle: "Отримайте персональну стратегію для ваших продуктів", bonus: "Безкоштовний аудит + стратегія", description: "Збільште продажі товарів з Meta Ads", questions: [{ question: "Тип товару?", options: ["Фізичні", "Цифрові", "Послуги", "Підписки"] }, { question: "Ціна?", options: ["До $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Бюджет?", options: ["До $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Досвід реклами?", options: ["Так, на Meta", "Так, на інших", "Ні", "Не впевнений"] }] },
    en: { title: "Sell More Products with Meta Ads", subtitle: "Get a tailored Meta Ads strategy for your products", bonus: "Free audit + strategy", description: "Increase product sales with Meta Ads", questions: [{ question: "Product type?", options: ["Physical", "Digital", "Services", "Subscriptions"] }, { question: "Price?", options: ["Up to $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budget?", options: ["Up to $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Ad experience?", options: ["Yes, on Meta", "Yes, elsewhere", "No", "Not sure"] }] },
    ru: { title: "Продавайте больше товаров с Meta Ads", subtitle: "Получите персональную стратегию для ваших продуктов", bonus: "Бесплатный аудит + стратегия", description: "Увеличьте продажи товаров с Meta Ads", questions: [{ question: "Тип товара?", options: ["Физические", "Цифровые", "Услуги", "Подписки"] }, { question: "Цена?", options: ["До $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Бюджет?", options: ["До $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Опыт рекламы?", options: ["Да, на Meta", "Да, на других", "Нет", "Не уверен"] }] },
    pl: { title: "Sprzedaj więcej produktów z Meta Ads", subtitle: "Otrzymaj spersonalizowaną strategię Meta Ads dla swoich produktów", bonus: "Bezpłatny audyt + strategia", description: "Zwiększ sprzedaż produktów z Meta Ads", questions: [{ question: "Typ produktu?", options: ["Fizyczne", "Cyfrowe", "Usługi", "Subskrypcje"] }, { question: "Cena?", options: ["Do $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budżet?", options: ["Do $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Doświadczenie reklamowe?", options: ["Tak, na Meta", "Tak, gdzie indziej", "Nie", "Nie jestem pewien"] }] },
    de: { title: "Verkaufen Sie mehr Produkte mit Meta Ads", subtitle: "Erhalten Sie eine maßgeschneiderte Meta Ads-Strategie für Ihre Produkte", bonus: "Kostenloser Audit + Strategie", description: "Steigern Sie den Produktverkauf mit Meta Ads", questions: [{ question: "Produkttyp?", options: ["Physisch", "Digital", "Dienstleistungen", "Abonnements"] }, { question: "Preis?", options: ["Bis $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budget?", options: ["Bis $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Werbeerfahrung?", options: ["Ja, auf Meta", "Ja, woanders", "Nein", "Nicht sicher"] }] },
  },
  "meta-telegram": {
    uk: { title: "Розвивайте свій Telegram-канал з Meta Ads", subtitle: "Отримайте цільових підписників з Facebook та Instagram", bonus: "Безкоштовний аудит + стратегія", description: "Отримайте цільових підписників для вашого Telegram-каналу", questions: [{ question: "Тип каналу?", options: ["Бізнес", "Аналітика", "Новини", "Продажі", "Інше"] }, { question: "Ціль?", options: ["Підписники", "Ліди", "Продажі", "Залучення"] }, { question: "Бюджет?", options: ["До $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Конкуренти?", options: ["Так, знаю", "Так, але не впевнений", "Немає", "Потрібна допомога"] }] },
    en: { title: "Grow Your Telegram Channel with Meta Ads", subtitle: "Get targeted subscribers from Facebook and Instagram", bonus: "Free audit + strategy", description: "Get targeted subscribers for your Telegram channel", questions: [{ question: "Channel type?", options: ["Business", "Analytics", "News", "Sales", "Other"] }, { question: "Goal?", options: ["Subscribers", "Leads", "Sales", "Engagement"] }, { question: "Budget?", options: ["Up to $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Competitors?", options: ["Yes, I know", "Yes, not sure", "No competitors", "Need help"] }] },
    ru: { title: "Развивайте свой Telegram-канал с Meta Ads", subtitle: "Получите целевых подписчиков из Facebook и Instagram", bonus: "Бесплатный аудит + стратегия", description: "Получите целевых подписчиков для вашего Telegram-канала", questions: [{ question: "Тип канала?", options: ["Бизнес", "Аналитика", "Новости", "Продажи", "Другое"] }, { question: "Цель?", options: ["Подписчики", "Лиды", "Продажи", "Вовлечение"] }, { question: "Бюджет?", options: ["До $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Конкуренты?", options: ["Да, знаю", "Да, но не уверен", "Нет", "Нужна помощь"] }] },
    pl: { title: "Rozwijaj swój kanał Telegram z Meta Ads", subtitle: "Uzyskaj docelowych subskrybentów z Facebooka i Instagrama", bonus: "Bezpłatny audyt + strategia", description: "Uzyskaj docelowych subskrybentów dla swojego kanału Telegram", questions: [{ question: "Typ kanału?", options: ["Biznes", "Analityka", "Wiadomości", "Sprzedaż", "Inne"] }, { question: "Cel?", options: ["Subskrybenci", "Leady", "Sprzedaż", "Zaangażowanie"] }, { question: "Budżet?", options: ["Do $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Konkurenci?", options: ["Tak, znam", "Tak, nie jestem pewien", "Brak", "Potrzebuję pomocy"] }] },
    de: { title: "Wachsen Sie Ihren Telegram-Kanal mit Meta Ads", subtitle: "Erhalten Sie gezielte Abonnenten von Facebook und Instagram", bonus: "Kostenloser Audit + Strategie", description: "Erhalten Sie gezielte Abonnenten für Ihren Telegram-Kanal", questions: [{ question: "Kanaltyp?", options: ["Geschäft", "Analytik", "Nachrichten", "Verkauf", "Anderes"] }, { question: "Ziel?", options: ["Abonnenten", "Leads", "Verkäufe", "Engagement"] }, { question: "Budget?", options: ["Bis $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Wettbewerber?", options: ["Ja, ich weiß", "Ja, nicht sicher", "Keine", "Brauche Hilfe"] }] },
  },
  "google-furniture": {
    uk: { title: "Отримуйте 30+ заявок на меблі з Google Ads", subtitle: "Персональна стратегія для вашого меблевого бізнесу", bonus: "Безкоштовний аудит + стратегія", description: "Отримайте 30+ якісних лідів щодня з Google", questions: [{ question: "Що продаєте?", options: ["Кухні", "М'які меблі", "Шафи", "Корпусні", "Все"] }, { question: "Середній чек?", options: ["До $200", "$200–$700", "$700–$2000", "$2000+"] }, { question: "Бюджет?", options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Досвід?", options: ["Так, Google", "Так, інші", "Ні", "Не впевнений"] }] },
    en: { title: "Get 30+ Furniture Leads from Google Ads", subtitle: "Personalized strategy for your furniture business", bonus: "Free audit + strategy", description: "Get 30+ quality leads daily from Google", questions: [{ question: "What do you sell?", options: ["Kitchens", "Soft Furniture", "Wardrobes", "Case Furniture", "All"] }, { question: "Average order?", options: ["Up to $200", "$200–$700", "$700–$2000", "$2000+"] }, { question: "Budget?", options: ["Up to $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Experience?", options: ["Yes, Google", "Yes, other", "No", "Not sure"] }] },
    ru: { title: "Получайте 30+ заявок на мебель с Google Ads", subtitle: "Персональная стратегия для вашего мебельного бизнеса", bonus: "Бесплатный аудит + стратегия", description: "Получайте 30+ качественных лидов ежедневно с Google", questions: [{ question: "Что продаёте?", options: ["Кухни", "Мягкая мебель", "Шкафы", "Корпусная", "Всё"] }, { question: "Средний чек?", options: ["До $200", "$200–$700", "$700–$2000", "$2000+"] }, { question: "Бюджет?", options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Опыт?", options: ["Да, Google", "Да, другие", "Нет", "Не уверен"] }] },
    pl: { title: "Uzyskaj 30+ zapytań o meble z Google Ads", subtitle: "Spersonalizowana strategia dla Twojego biznesu meblowego", bonus: "Bezpłatny audyt + strategia", description: "Uzyskaj 30+ wysokiej jakości leadów dziennie z Google", questions: [{ question: "Co sprzedajesz?", options: ["Kuchnie", "Meble tapicerowane", "Szafy", "Meble korpusowe", "Wszystko"] }, { question: "Średnie zamówienie?", options: ["Do $200", "$200–$700", "$700–$2000", "$2000+"] }, { question: "Budżet?", options: ["Do $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Doświadczenie?", options: ["Tak, Google", "Tak, inne", "Nie", "Nie jestem pewien"] }] },
    de: { title: "Erhalten Sie 30+ Möbel-Leads von Google Ads", subtitle: "Personalisierte Strategie für Ihr Möbelgeschäft", bonus: "Kostenloser Audit + Strategie", description: "Erhalten Sie täglich 30+ qualitativ hochwertige Leads von Google", questions: [{ question: "Was verkaufen Sie?", options: ["Küchen", "Polstermöbel", "Schränke", "Kastenmöbel", "Alles"] }, { question: "Durchschnittliche Bestellung?", options: ["Bis $200", "$200–$700", "$700–$2000", "$2000+"] }, { question: "Budget?", options: ["Bis $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Erfahrung?", options: ["Ja, Google", "Ja, andere", "Nein", "Nicht sicher"] }] },
  },
  "google-repair": {
    uk: { title: "Отримуйте 5-15 лідів на ремонт з Google Ads", subtitle: "Персональна стратегія для ремонтного бізнесу", bonus: "Безкоштовний аудит + стратегія", description: "5-15 гарячих лідів щодня з Google", questions: [{ question: "Тип ремонту?", options: ["Косметичний", "Капітальний", "Елітний", "Окремі роботи"] }, { question: "Середній чек?", options: ["До $2000", "$2000–$5000", "$5000–$15000", "$15000+"] }, { question: "Бюджет?", options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Досвід?", options: ["Так, Google", "Так, інші", "Ні", "Не впевнений"] }] },
    en: { title: "Get 5-15 Renovation Leads from Google Ads", subtitle: "Personalized strategy for renovation business", bonus: "Free audit + strategy", description: "5-15 hot leads daily from Google", questions: [{ question: "Renovation type?", options: ["Cosmetic", "Major", "Luxury", "Specific Work"] }, { question: "Average project?", options: ["Up to $2000", "$2000–$5000", "$5000–$15000", "$15000+"] }, { question: "Budget?", options: ["Up to $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Experience?", options: ["Yes, Google", "Yes, other", "No", "Not sure"] }] },
    ru: { title: "Получайте 5-15 лидов на ремонт с Google Ads", subtitle: "Персональная стратегия для ремонтного бизнеса", bonus: "Бесплатный аудит + стратегия", description: "5-15 горячих лидов ежедневно с Google", questions: [{ question: "Тип ремонта?", options: ["Косметический", "Капитальный", "Элитный", "Отдельные работы"] }, { question: "Средний чек?", options: ["До $2000", "$2000–$5000", "$5000–$15000", "$15000+"] }, { question: "Бюджет?", options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Опыт?", options: ["Да, Google", "Да, другие", "Нет", "Не уверен"] }] },
    pl: { title: "Uzyskaj 5-15 leadów na remonty z Google Ads", subtitle: "Spersonalizowana strategia dla biznesu remontowego", bonus: "Bezpłatny audyt + strategia", description: "5-15 gorących leadów dziennie z Google", questions: [{ question: "Typ remontu?", options: ["Kosmetyczny", "Generalny", "Luksusowy", "Konkretne prace"] }, { question: "Średni projekt?", options: ["Do $2000", "$2000–$5000", "$5000–$15000", "$15000+"] }, { question: "Budżet?", options: ["Do $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Doświadczenie?", options: ["Tak, Google", "Tak, inne", "Nie", "Nie jestem pewien"] }] },
    de: { title: "Erhalten Sie 5-15 Renovierungs-Leads von Google Ads", subtitle: "Personalisierte Strategie für Renovierungsgeschäft", bonus: "Kostenloser Audit + Strategie", description: "5-15 heiße Leads täglich von Google", questions: [{ question: "Renovierungstyp?", options: ["Kosmetisch", "Groß", "Luxus", "Spezifische Arbeiten"] }, { question: "Durchschnittliches Projekt?", options: ["Bis $2000", "$2000–$5000", "$5000–$15000", "$15000+"] }, { question: "Budget?", options: ["Bis $500", "$500–$1500", "$1500–$3000", "$3000+"] }, { question: "Erfahrung?", options: ["Ja, Google", "Ja, andere", "Nein", "Nicht sicher"] }] },
  },
  "google-ecom": {
    uk: { title: "Масштабуйте e-commerce з Google Ads", subtitle: "Отримайте стратегію для вашого інтернет-магазину", bonus: "Безкоштовний аудит + стратегія", description: "Масштабуйте свій онлайн-магазин з Google", questions: [{ question: "Що продаєте?", options: ["Одяг", "Електроніка", "Дім", "Інше"] }, { question: "Середній чек?", options: ["До $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Бюджет?", options: ["До $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Shopping Ads?", options: ["Так", "Не знаю", "Тільки пошук", "Консультація"] }] },
    en: { title: "Scale E-Commerce with Google Ads", subtitle: "Get strategy for your online store", bonus: "Free audit + strategy", description: "Scale your online store with Google", questions: [{ question: "What do you sell?", options: ["Clothing", "Electronics", "Home", "Other"] }, { question: "Average order?", options: ["Up to $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budget?", options: ["Up to $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Shopping Ads?", options: ["Yes", "Not sure", "Search only", "Need consultation"] }] },
    ru: { title: "Масштабируйте e-commerce с Google Ads", subtitle: "Получите стратегию для вашего интернет-магазина", bonus: "Бесплатный аудит + стратегия", description: "Масштабируйте свой онлайн-магазин с Google", questions: [{ question: "Что продаёте?", options: ["Одежда", "Электроника", "Дом", "Другое"] }, { question: "Средний чек?", options: ["До $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Бюджет?", options: ["До $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Shopping Ads?", options: ["Да", "Не знаю", "Только поиск", "Консультация"] }] },
    pl: { title: "Skaluj e-commerce z Google Ads", subtitle: "Otrzymaj strategię dla swojego sklepu internetowego", bonus: "Bezpłatny audyt + strategia", description: "Skaluj swój sklep internetowy z Google", questions: [{ question: "Co sprzedajesz?", options: ["Odzież", "Elektronika", "Dom", "Inne"] }, { question: "Średnie zamówienie?", options: ["Do $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budżet?", options: ["Do $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Shopping Ads?", options: ["Tak", "Nie jestem pewien", "Tylko wyszukiwanie", "Potrzebuję konsultacji"] }] },
    de: { title: "Skalieren Sie E-Commerce mit Google Ads", subtitle: "Erhalten Sie Strategie für Ihren Online-Shop", bonus: "Kostenloser Audit + Strategie", description: "Skalieren Sie Ihren Online-Shop mit Google", questions: [{ question: "Was verkaufen Sie?", options: ["Kleidung", "Elektronik", "Haus", "Anderes"] }, { question: "Durchschnittliche Bestellung?", options: ["Bis $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Budget?", options: ["Bis $500", "$500–$2000", "$2000–$5000", "$5000+"] }, { question: "Shopping Ads?", options: ["Ja", "Nicht sicher", "Nur Suche", "Beratung nötig"] }] },
  },
  "google-products": {
    uk: { title: "Продавайте більше товарів з Google Ads", subtitle: "Персональна стратегія Google Ads для ваших продуктів", bonus: "Безкоштовний аудит + стратегія", description: "Збільште продажі товарів з Google Ads", questions: [{ question: "Тип товару?", options: ["Фізичні", "Цифрові", "Послуги", "Підписки"] }, { question: "Ціна?", options: ["До $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Сайт?", options: ["Так, робочий", "Так, потрібні зміни", "Ні, потрібен", "Тільки лендінг"] }, { question: "Досвід?", options: ["Так, Google", "Так, інші", "Ні", "Не впевнений"] }] },
    en: { title: "Sell More Products with Google Ads", subtitle: "Get a tailored Google Ads strategy for your products", bonus: "Free audit + strategy", description: "Increase product sales with Google Ads", questions: [{ question: "Product type?", options: ["Physical", "Digital", "Services", "Subscriptions"] }, { question: "Price?", options: ["Up to $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Website?", options: ["Yes, functional", "Yes, needs work", "No, need one", "Landing only"] }, { question: "Experience?", options: ["Yes, Google", "Yes, other", "No", "Not sure"] }] },
    ru: { title: "Продавайте больше товаров с Google Ads", subtitle: "Получите персональную стратегию Google Ads для ваших продуктов", bonus: "Бесплатный аудит + стратегия", description: "Увеличьте продажи товаров с Google Ads", questions: [{ question: "Тип товара?", options: ["Физические", "Цифровые", "Услуги", "Подписки"] }, { question: "Цена?", options: ["До $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Сайт?", options: ["Да, рабочий", "Да, нужны изменения", "Нет, нужен", "Только лендинг"] }, { question: "Опыт?", options: ["Да, Google", "Да, другие", "Нет", "Не уверен"] }] },
    pl: { title: "Sprzedaj więcej produktów z Google Ads", subtitle: "Otrzymaj spersonalizowaną strategię Google Ads dla swoich produktów", bonus: "Bezpłatny audyt + strategia", description: "Zwiększ sprzedaż produktów z Google Ads", questions: [{ question: "Typ produktu?", options: ["Fizyczne", "Cyfrowe", "Usługi", "Subskrypcje"] }, { question: "Cena?", options: ["Do $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Strona?", options: ["Tak, działa", "Tak, wymaga pracy", "Nie, potrzebuję", "Tylko landing"] }, { question: "Doświadczenie?", options: ["Tak, Google", "Tak, inne", "Nie", "Nie jestem pewien"] }] },
    de: { title: "Verkaufen Sie mehr Produkte mit Google Ads", subtitle: "Erhalten Sie eine maßgeschneiderte Google Ads-Strategie für Ihre Produkte", bonus: "Kostenloser Audit + Strategie", description: "Steigern Sie den Produktverkauf mit Google Ads", questions: [{ question: "Produkttyp?", options: ["Physisch", "Digital", "Dienstleistungen", "Abonnements"] }, { question: "Preis?", options: ["Bis $50", "$50–$200", "$200–$500", "$500+"] }, { question: "Website?", options: ["Ja, funktional", "Ja, braucht Arbeit", "Nein, brauche eine", "Nur Landing"] }, { question: "Erfahrung?", options: ["Ja, Google", "Ja, andere", "Nein", "Nicht sicher"] }] },
  },
  "google-telegram": {
    uk: { title: "Розвивайте Telegram-канал з Google Ads", subtitle: "Отримайте цільових підписників з Google Search та YouTube", bonus: "Безкоштовний аудит + стратегія", description: "Отримайте цільових підписників для вашого Telegram-каналу", questions: [{ question: "Тип каналу?", options: ["Бізнес", "Аналітика", "Новини", "Продажі", "Інше"] }, { question: "Ціль?", options: ["Підписники", "Ліди", "Продажі", "Залучення"] }, { question: "Бюджет?", options: ["До $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Конкуренти?", options: ["Так, знаю", "Так, але не впевнений", "Немає", "Потрібна допомога"] }] },
    en: { title: "Grow Your Telegram Channel with Google Ads", subtitle: "Get targeted subscribers from Google Search and YouTube", bonus: "Free audit + strategy", description: "Get targeted subscribers for your Telegram channel", questions: [{ question: "Channel type?", options: ["Business", "Analytics", "News", "Sales", "Other"] }, { question: "Goal?", options: ["Subscribers", "Leads", "Sales", "Engagement"] }, { question: "Budget?", options: ["Up to $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Competitors?", options: ["Yes, I know", "Yes, not sure", "No competitors", "Need help"] }] },
    ru: { title: "Развивайте Telegram-канал с Google Ads", subtitle: "Получите целевых подписчиков из Google Search и YouTube", bonus: "Бесплатный аудит + стратегия", description: "Получите целевых подписчиков для вашего Telegram-канала", questions: [{ question: "Тип канала?", options: ["Бизнес", "Аналитика", "Новости", "Продажи", "Другое"] }, { question: "Цель?", options: ["Подписчики", "Лиды", "Продажи", "Вовлечение"] }, { question: "Бюджет?", options: ["До $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Конкуренты?", options: ["Да, знаю", "Да, но не уверен", "Нет", "Нужна помощь"] }] },
    pl: { title: "Rozwijaj swój kanał Telegram z Google Ads", subtitle: "Uzyskaj docelowych subskrybentów z Google Search i YouTube", bonus: "Bezpłatny audyt + strategia", description: "Uzyskaj docelowych subskrybentów dla swojego kanału Telegram", questions: [{ question: "Typ kanału?", options: ["Biznes", "Analityka", "Wiadomości", "Sprzedaż", "Inne"] }, { question: "Cel?", options: ["Subskrybenci", "Leady", "Sprzedaż", "Zaangażowanie"] }, { question: "Budżet?", options: ["Do $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Konkurenci?", options: ["Tak, znam", "Tak, nie jestem pewien", "Brak", "Potrzebuję pomocy"] }] },
    de: { title: "Wachsen Sie Ihren Telegram-Kanal mit Google Ads", subtitle: "Erhalten Sie gezielte Abonnenten von Google Search und YouTube", bonus: "Kostenloser Audit + Strategie", description: "Erhalten Sie gezielte Abonnenten für Ihren Telegram-Kanal", questions: [{ question: "Kanaltyp?", options: ["Geschäft", "Analytik", "Nachrichten", "Verkauf", "Anderes"] }, { question: "Ziel?", options: ["Abonnenten", "Leads", "Verkäufe", "Engagement"] }, { question: "Budget?", options: ["Bis $300", "$300–$1000", "$1000–$3000", "$3000+"] }, { question: "Wettbewerber?", options: ["Ja, ich weiß", "Ja, nicht sicher", "Keine", "Brauche Hilfe"] }] },
  },
  "furniture": {
    uk: {
      title: "Хочете отримувати 30+ заявок на меблі щодня?",
      subtitle: "Пройдіть короткий квіз — розрахуємо вашу стратегію та вартість заявки",
      bonus: "Безкоштовний аудит вашої реклами + стратегія запуску",
      description: "Отримайте 30+ якісних лідів щодня для вашого меблевого бізнесу",
      questions: [
        {
          question: "Що саме ви продаєте?",
          options: ["Кухні", "М'які меблі", "Шафи / гардероби", "Корпусні меблі", "Все разом"],
        },
        {
          question: "Ваш середній чек?",
          options: ["До $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Ваш бюджет на рекламу?",
          options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Ключова ціль:",
          options: ["Заявки", "Дзвінки", "Візити у салон"],
        },
      ],
    },
    en: {
      title: "Want to Get 30+ Furniture Leads Daily?",
      subtitle: "Take a short quiz and we'll calculate your lead cost and strategy",
      bonus: "Free audit of your advertising + launch strategy",
      description: "Get 30+ quality leads daily for your furniture business",
      questions: [
        {
          question: "What exactly do you sell?",
          options: ["Kitchens", "Soft Furniture", "Wardrobes / Closets", "Case Furniture", "All of the Above"],
        },
        {
          question: "What's your average order value?",
          options: ["Up to $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "What's your advertising budget?",
          options: ["Up to $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "What's your main goal?",
          options: ["Leads", "Phone Calls", "Showroom Visits"],
        },
      ],
    },
    ru: {
      title: "Хотите получать 30+ заявок на мебель ежедневно?",
      subtitle: "Пройдите короткий квиз — рассчитаем вашу стратегию и стоимость заявки",
      bonus: "Бесплатный аудит вашей рекламы + стратегия запуска",
      description: "Получайте 30+ качественных лидов ежедневно для вашего мебельного бизнеса",
      questions: [
        {
          question: "Что именно вы продаёте?",
          options: ["Кухни", "Мягкая мебель", "Шкафы / гардеробы", "Корпусная мебель", "Всё вместе"],
        },
        {
          question: "Ваш средний чек?",
          options: ["До $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Ваш бюджет на рекламу?",
          options: ["До $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Ключевая цель:",
          options: ["Заявки", "Звонки", "Визиты в салон"],
        },
      ],
    },
    pl: {
      title: "Chcesz otrzymywać 30+ zapytań o meble dziennie?",
      subtitle: "Wypełnij krótki quiz — obliczymy Twoją strategię i koszt leada",
      bonus: "Bezpłatny audyt Twojej reklamy + strategia uruchomienia",
      description: "Uzyskaj 30+ wysokiej jakości leadów dziennie dla Twojego biznesu meblowego",
      questions: [
        {
          question: "Co dokładnie sprzedajesz?",
          options: ["Kuchnie", "Meble tapicerowane", "Szafy / Garderoby", "Meble korpusowe", "Wszystko powyższe"],
        },
        {
          question: "Średnia wartość zamówienia?",
          options: ["Do $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Twój budżet reklamowy?",
          options: ["Do $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Główny cel:",
          options: ["Leady", "Telefony", "Wizyty w salonie"],
        },
      ],
    },
    de: {
      title: "Möchten Sie täglich 30+ Möbel-Leads erhalten?",
      subtitle: "Nehmen Sie an einem kurzen Quiz teil – wir berechnen Ihre Strategie und Lead-Kosten",
      bonus: "Kostenloser Audit Ihrer Werbung + Startstrategie",
      description: "Erhalten Sie täglich 30+ qualitativ hochwertige Leads für Ihr Möbelgeschäft",
      questions: [
        {
          question: "Was genau verkaufen Sie?",
          options: ["Küchen", "Polstermöbel", "Schränke / Garderoben", "Korpusmöbel", "Alles zusammen"],
        },
        {
          question: "Ihr durchschnittlicher Bestellwert?",
          options: ["Bis $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Ihr Werbebudget?",
          options: ["Bis $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Hauptziel:",
          options: ["Leads", "Anrufe", "Showroom-Besuche"],
        },
      ],
    },
  },
  "apartment-renovation": {
    uk: {
      title: "5-15 гарячих лідів щодня для ремонтних послуг",
      subtitle: "Пройдіть квіз — отримайте персональний маркетинговий план",
      bonus: "Безкоштовний аудит вашої реклами + стратегія запуску",
      description: "Отримайте 5-15 гарячих лідів щодня для ремонтних послуг",
      questions: [
        {
          question: "Який тип ремонту ви пропонуєте?",
          options: ["Косметичний", "Капітальний ремонт", "Елітний ремонт", "Окремі роботи (стіни, електрика, сантехніка)"],
        },
        {
          question: "Середня вартість проєкту?",
          options: ["До $1000", "$1000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Ваша зона обслуговування?",
          options: ["Місто", "Регіон", "По всій країні"],
        },
        {
          question: "Ціль реклами?",
          options: ["Дзвінки", "Заявки", "Запити на контакт"],
        },
      ],
    },
    en: {
      title: "Get 5-15 Hot Leads Daily for Apartment Renovations",
      subtitle: "Complete the quiz to get your personalized marketing plan",
      bonus: "Free audit of your advertising + launch strategy",
      description: "Get 5-15 hot leads daily for renovation services",
      questions: [
        {
          question: "What type of renovation do you offer?",
          options: ["Cosmetic", "Major Renovation", "Luxury Renovation", "Specific Work (walls, electrical, plumbing)"],
        },
        {
          question: "Average project cost?",
          options: ["Up to $1000", "$1000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Your service area?",
          options: ["City", "Region", "Nationwide"],
        },
        {
          question: "Advertising goal?",
          options: ["Phone Calls", "Leads", "Contact Requests"],
        },
      ],
    },
    ru: {
      title: "5-15 горячих лидов ежедневно для ремонтных услуг",
      subtitle: "Пройдите квиз — получите персональный маркетинговый план",
      bonus: "Бесплатный аудит вашей рекламы + стратегия запуска",
      description: "Получайте 5-15 горячих лидов ежедневно для ремонтных услуг",
      questions: [
        {
          question: "Какой тип ремонта вы предлагаете?",
          options: ["Косметический", "Капитальный ремонт", "Элитный ремонт", "Отдельные работы (стены, электрика, сантехника)"],
        },
        {
          question: "Средняя стоимость проекта?",
          options: ["До $1000", "$1000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Ваша зона обслуживания?",
          options: ["Город", "Регион", "По всей стране"],
        },
        {
          question: "Цель рекламы?",
          options: ["Звонки", "Заявки", "Запросы на контакт"],
        },
      ],
    },
    pl: {
      title: "5-15 gorących leadów dziennie dla usług remontowych",
      subtitle: "Wypełnij quiz — otrzymaj spersonalizowany plan marketingowy",
      bonus: "Bezpłatny audyt Twojej reklamy + strategia uruchomienia",
      description: "Uzyskaj 5-15 gorących leadów dziennie dla usług remontowych",
      questions: [
        {
          question: "Jaki typ remontu oferujesz?",
          options: ["Kosmetyczny", "Kapitalny remont", "Luksusowy remont", "Określone prace (ściany, elektryka, hydraulika)"],
        },
        {
          question: "Średni koszt projektu?",
          options: ["Do $1000", "$1000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Twój obszar usług?",
          options: ["Miasto", "Region", "Cały kraj"],
        },
        {
          question: "Cel reklamy?",
          options: ["Telefony", "Leady", "Prośby o kontakt"],
        },
      ],
    },
    de: {
      title: "5-15 heiße Leads täglich für Renovierungsdienste",
      subtitle: "Nehmen Sie am Quiz teil — erhalten Sie Ihren personalisierten Marketingplan",
      bonus: "Kostenloser Audit Ihrer Werbung + Startstrategie",
      description: "Erhalten Sie täglich 5-15 heiße Leads für Renovierungsdienste",
      questions: [
        {
          question: "Welche Art von Renovierung bieten Sie an?",
          options: ["Kosmetisch", "Großrenovierung", "Luxusrenovierung", "Spezifische Arbeiten (Wände, Elektrik, Sanitär)"],
        },
        {
          question: "Durchschnittliche Projektkosten?",
          options: ["Bis $1000", "$1000–$5000", "$5000–$15000", "$15000+"],
        },
        {
          question: "Ihr Servicebereich?",
          options: ["Stadt", "Region", "Landesweit"],
        },
        {
          question: "Werbeziel?",
          options: ["Anrufe", "Leads", "Kontaktanfragen"],
        },
      ],
    },
  },
  "e-commerce": {
    uk: {
      title: "Хочете масштабувати свій інтернет-магазин? Отримайте 30-120 лідів щодня",
      subtitle: "Відповідайте на кілька питань, щоб дізнатися свій потенціал зростання",
      bonus: "Безкоштовний аудит вашої реклами + стратегія запуску",
      description: "Масштабуйте свій інтернет-магазин з 30-120 лідами щодня",
      questions: [
        {
          question: "Категорія магазину?",
          options: ["Одяг", "Товари для дому", "Електроніка", "Краса та догляд", "Інше"],
        },
        {
          question: "Ваш середній чек?",
          options: ["До $50", "$50–$150", "$150–$500", "$500+"],
        },
        {
          question: "Ваш бюджет на рекламу?",
          options: ["До $500", "$500–$2000", "$2000–$5000", "$5000+"],
        },
        {
          question: "Чи є у вас воронка продажів?",
          options: ["Так, повністю налаштована", "Частково налаштована", "Ні, потрібна допомога", "Не впевнений"],
        },
      ],
    },
    en: {
      title: "Want to Scale Your E-Commerce? Get 30-120 Leads Daily",
      subtitle: "Answer a few questions to discover your growth potential",
      bonus: "Free audit of your advertising + launch strategy",
      description: "Scale your e-commerce with 30-120 leads daily",
      questions: [
        {
          question: "Store category?",
          options: ["Clothing", "Home Goods", "Electronics", "Beauty & Care", "Other"],
        },
        {
          question: "What's your average order value?",
          options: ["Up to $50", "$50–$150", "$150–$500", "$500+"],
        },
        {
          question: "What's your advertising budget?",
          options: ["Up to $500", "$500–$2000", "$2000–$5000", "$5000+"],
        },
        {
          question: "Do you have a sales funnel?",
          options: ["Yes, fully set up", "Partially set up", "No, need help", "Not sure"],
        },
      ],
    },
    ru: {
      title: "Хотите масштабировать свой интернет-магазин? Получайте 30-120 лидов ежедневно",
      subtitle: "Ответьте на несколько вопросов, чтобы узнать свой потенциал роста",
      bonus: "Бесплатный аудит вашей рекламы + стратегия запуска",
      description: "Масштабируйте свой интернет-магазин с 30-120 лидами ежедневно",
      questions: [
        {
          question: "Категория магазина?",
          options: ["Одежда", "Товары для дома", "Электроника", "Красота и уход", "Другое"],
        },
        {
          question: "Ваш средний чек?",
          options: ["До $50", "$50–$150", "$150–$500", "$500+"],
        },
        {
          question: "Ваш бюджет на рекламу?",
          options: ["До $500", "$500–$2000", "$2000–$5000", "$5000+"],
        },
        {
          question: "Есть ли у вас воронка продаж?",
          options: ["Да, полностью настроена", "Частично настроена", "Нет, нужна помощь", "Не уверен"],
        },
      ],
    },
    pl: {
      title: "Chcesz skalować swój e-commerce? Uzyskaj 30-120 leadów dziennie",
      subtitle: "Odpowiedz na kilka pytań, aby odkryć swój potencjał wzrostu",
      bonus: "Bezpłatny audyt Twojej reklamy + strategia uruchomienia",
      description: "Skaluj swój e-commerce z 30-120 leadami dziennie",
      questions: [
        {
          question: "Kategoria sklepu?",
          options: ["Odzież", "Artykuły domowe", "Elektronika", "Uroda i pielęgnacja", "Inne"],
        },
        {
          question: "Średnia wartość zamówienia?",
          options: ["Do $50", "$50–$150", "$150–$500", "$500+"],
        },
        {
          question: "Twój budżet reklamowy?",
          options: ["Do $500", "$500–$2000", "$2000–$5000", "$5000+"],
        },
        {
          question: "Czy masz lejek sprzedażowy?",
          options: ["Tak, w pełni skonfigurowany", "Częściowo skonfigurowany", "Nie, potrzebuję pomocy", "Nie jestem pewien"],
        },
      ],
    },
    de: {
      title: "Möchten Sie Ihren E-Commerce skalieren? Erhalten Sie 30-120 Leads täglich",
      subtitle: "Beantworten Sie einige Fragen, um Ihr Wachstumspotenzial zu entdecken",
      bonus: "Kostenloser Audit Ihrer Werbung + Startstrategie",
      description: "Skalieren Sie Ihren E-Commerce mit 30-120 Leads täglich",
      questions: [
        {
          question: "Shop-Kategorie?",
          options: ["Kleidung", "Haushaltswaren", "Elektronik", "Schönheit & Pflege", "Anderes"],
        },
        {
          question: "Ihr durchschnittlicher Bestellwert?",
          options: ["Bis $50", "$50–$150", "$150–$500", "$500+"],
        },
        {
          question: "Ihr Werbebudget?",
          options: ["Bis $500", "$500–$2000", "$2000–$5000", "$5000+"],
        },
        {
          question: "Haben Sie einen Verkaufstrichter?",
          options: ["Ja, vollständig eingerichtet", "Teilweise eingerichtet", "Nein, brauche Hilfe", "Nicht sicher"],
        },
      ],
    },
  },
};

// Helper function to get quiz translation
export function getQuizTranslation(quizId: string, language: Language): QuizTranslation | null {
  return quizTranslations[quizId]?.[language] || quizTranslations[quizId]?.["en"] || null;
}
