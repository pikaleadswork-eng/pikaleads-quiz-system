import { Language } from "@/contexts/LanguageContext";

export interface Translations {
  // Common
  startQuiz: string;
  step: string;
  of: string;
  submit: string;
  submitting: string;
  
  // Landing page
  freeBonus: string;
  freeBonusText: string;
  whyChooseUs: string;
  
  // Form
  formTitle: string;
  formSubtitle: string;
  yourName: string;
  phoneNumber: string;
  telegramUsername: string;
  optional: string;
  getAnalysis: string;
  
  // Thank you page
  thankYouTitle: string;
  thankYouMessage: string;
  contactTime: string;
  goToTelegram: string;
  returnToQuizzes: string;
  
  // Home page
  homeTitle: string;
  homeSubtitle: string;
  metaAdsTitle: string;
  metaAdsSubtitle: string;
  googleAdsTitle: string;
  googleAdsSubtitle: string;
  // Quiz descriptions
  metaFurnitureDesc: string;
  metaRepairDesc: string;
  metaEcomDesc: string;
  metaProductsDesc: string;
  metaTelegramDesc: string;
  googleFurnitureDesc: string;
  googleRepairDesc: string;
  googleEcomDesc: string;
  googleProductsDesc: string;
  googleTelegramDesc: string;
  learnMore: string;
}

export const translations: Record<Language, Translations> = {
  uk: {
    startQuiz: "Почати квіз",
    step: "Крок",
    of: "з",
    submit: "Отримати",
    submitting: "Відправка...",
    
    freeBonus: "🎁 БОНУС",
    freeBonusText: "Безкоштовний аудит вашої реклами + персональна стратегія запуску",
    whyChooseUs: "Чому обирають нас",
    
    formTitle: "Отримайте безкоштовний аналіз",
    formSubtitle: "Наш спеціаліст зв'яжеться з вами протягом 10-15 хвилин",
    yourName: "Ваше ім'я",
    phoneNumber: "Номер телефону",
    telegramUsername: "Telegram (необов'язково)",
    optional: "необов'язково",
    getAnalysis: "Отримати безкоштовний аналіз →",
    
    thankYouTitle: "Дякуємо! Заявку прийнято!",
    thankYouMessage: "Наш спеціаліст зв'яжеться з вами протягом 10-15 хвилин та надасть персональний план запуску.",
    contactTime: "Ми вже аналізуємо вашу нішу та готуємо прогноз результатів.",
    goToTelegram: "Перейти в Telegram →",
    returnToQuizzes: "Повернутися до вибору квізів",
    
    homeTitle: "PIKALEADS Lead Engine",
    homeSubtitle: "Оберіть свою нішу та платформу для безкоштовного маркетингового аналізу",
    metaAdsTitle: "META ADS Квізи",
    metaAdsSubtitle: "Отримуйте стабільний потік від 30+ заявок щодня з точним таргетингом",
    googleAdsTitle: "GOOGLE ADS Квізи",
    googleAdsSubtitle: "Отримуйте 20-50 якісних заявок щодня з Google Search та YouTube",
    metaFurnitureDesc: "Отримуйте 30+ якісних лідів щодня для вашого меблевого бізнесу",
    metaRepairDesc: "5-15 гарячих лідів щодня для ремонтних послуг",
    metaEcomDesc: "Масштабуйте свій інтернет-магазин з 30-120 лідами щодня",
    metaProductsDesc: "Збільште продажі ваших товарів за допомогою таргетованої реклами",
    metaTelegramDesc: "200-1200 нових підписників Telegram щотижня",
    googleFurnitureDesc: "Якісні ліди на меблі з Google Пошуку",
    googleRepairDesc: "Ліди на ремонт з Google Пошуку",
    googleEcomDesc: "Розвивайте свій магазин за допомогою Google Ads і Shopping",
    googleProductsDesc: "Продавайте більше товарів за допомогою Google Ads",
    googleTelegramDesc: "Розвивайте свій канал за допомогою Google і YouTube",
  learnMore: "Дізнатись більше →",
  },
  
  ru: {
    startQuiz: "Начать квиз",
    step: "Шаг",
    of: "из",
    submit: "Получить",
    submitting: "Отправка...",
    
    freeBonus: "🎁 БОНУС",
    freeBonusText: "Бесплатный аудит вашей рекламы + персональная стратегия запуска",
    whyChooseUs: "Почему выбирают нас",
    
    formTitle: "Получите бесплатный анализ",
    formSubtitle: "Наш специалист свяжется с вами в течение 10-15 минут",
    yourName: "Ваше имя",
    phoneNumber: "Номер телефона",
    telegramUsername: "Telegram (необязательно)",
    optional: "необязательно",
    getAnalysis: "Получить бесплатный анализ →",
    
    thankYouTitle: "Спасибо! Заявка принята!",
    thankYouMessage: "Наш специалист свяжется с вами в течение 10-15 минут и предоставит персональный план запуска.",
    contactTime: "Мы уже анализируем вашу нишу и готовим прогноз результатов.",
    goToTelegram: "Перейти в Telegram →",
    returnToQuizzes: "Вернуться к выбору квизов",
    
    homeTitle: "PIKALEADS Lead Engine",
    homeSubtitle: "Выберите свою нишу и платформу для бесплатного маркетингового анализа",
    metaAdsTitle: "META ADS Квизы",
    metaAdsSubtitle: "Получайте стабильный поток от 30+ заявок ежедневно с точным таргетингом",
    googleAdsTitle: "GOOGLE ADS Квизы",
    googleAdsSubtitle: "Получайте 20-50 качественных заявок ежедневно из Google Search и YouTube",
    metaFurnitureDesc: "Получайте 30+ качественных лидов ежедневно для вашего мебельного бизнеса",
    metaRepairDesc: "5-15 горячих лидов ежедневно для ремонтных услуг",
    metaEcomDesc: "Масштабируйте свой интернет-магазин с 30-120 лидами ежедневно",
    metaProductsDesc: "Увеличьте продажи ваших товаров с помощью таргетированной рекламы",
    metaTelegramDesc: "200-1200 новых подписчиков Telegram еженедельно",
    googleFurnitureDesc: "Качественные лиды на мебель из Google Поиска",
    googleRepairDesc: "Лиды на ремонт из Google Поиска",
    googleEcomDesc: "Развивайте свой магазин с помощью Google Ads и Shopping",
    googleProductsDesc: "Продавайте больше товаров с помощью Google Ads",
    googleTelegramDesc: "Развивайте свой канал с помощью Google и YouTube",
  learnMore: "Узнать больше →",
  },
  
  en: {
    startQuiz: "Start Quiz",
    step: "Step",
    of: "of",
    submit: "Get",
    submitting: "Submitting...",
    
    freeBonus: "🎁 BONUS",
    freeBonusText: "Free audit of your advertising + personalized launch strategy",
    whyChooseUs: "Why choose us",
    
    formTitle: "Get Your Free Analysis",
    formSubtitle: "Our specialist will contact you within 10-15 minutes",
    yourName: "Your Name",
    phoneNumber: "Phone Number",
    telegramUsername: "Telegram (optional)",
    optional: "optional",
    getAnalysis: "Get My Free Analysis →",
    
    thankYouTitle: "Thank You! Application Received!",
    thankYouMessage: "Our specialist will contact you within 10-15 minutes and provide a personalized launch plan.",
    contactTime: "We are already analyzing your niche and preparing a results forecast.",
    goToTelegram: "Go to Telegram →",
    returnToQuizzes: "Return to quiz selection",
    
    homeTitle: "PIKALEADS Lead Engine",
    homeSubtitle: "Choose your niche and platform to get started with a free marketing analysis",
    metaAdsTitle: "META ADS Quizzes",
    metaAdsSubtitle: "Get stable flow of 30+ leads daily with precise targeting and optimization",
    googleAdsTitle: "GOOGLE ADS Quizzes",
    googleAdsSubtitle: "Get 20-50 quality leads daily from Google Search and YouTube",
    metaFurnitureDesc: "Get 30+ quality leads daily for your furniture business",
    metaRepairDesc: "5-15 hot leads daily for renovation services",
    metaEcomDesc: "Scale your online store with 30-120 leads daily",
    metaProductsDesc: "Boost your product sales with targeted advertising",
    metaTelegramDesc: "200-1200 new Telegram subscribers weekly",
    googleFurnitureDesc: "Quality furniture leads from Google Search",
    googleRepairDesc: "Renovation leads from Google Search",
    googleEcomDesc: "Grow your store with Google Ads & Shopping",
    googleProductsDesc: "Sell more products with Google Ads",
    googleTelegramDesc: "Grow your channel with Google & YouTube",
  learnMore: "Learn More →",
  },
  
  pl: {
    startQuiz: "Rozpocznij quiz",
    step: "Krok",
    of: "z",
    submit: "Otrzymać",
    submitting: "Wysyłanie...",
    
    freeBonus: "🎁 BONUS",
    freeBonusText: "Bezpłatny audyt Twojej reklamy + spersonalizowana strategia uruchomienia",
    whyChooseUs: "Dlaczego nas wybierają",
    
    formTitle: "Otrzymaj bezpłatną analizę",
    formSubtitle: "Nasz specjalista skontaktuje się z Tobą w ciągu 10-15 minut",
    yourName: "Twoje imię",
    phoneNumber: "Numer telefonu",
    telegramUsername: "Telegram (opcjonalnie)",
    optional: "opcjonalnie",
    getAnalysis: "Otrzymaj bezpłatną analizę →",
    
    thankYouTitle: "Dziękujemy! Wniosek przyjęty!",
    thankYouMessage: "Nasz specjalista skontaktuje się z Tobą w ciągu 10-15 minut i przedstawi spersonalizowany plan uruchomienia.",
    contactTime: "Już analizujemy Twoją niszę i przygotowujemy prognozę wyników.",
    goToTelegram: "Przejdź do Telegram →",
    returnToQuizzes: "Powrót do wyboru quizów",
    
    homeTitle: "PIKALEADS Lead Engine",
    homeSubtitle: "Wybierz swoją niszę i platformę, aby rozpocząć bezpłatną analizę marketingową",
    metaAdsTitle: "META ADS Quizy",
    metaAdsSubtitle: "Uzyskaj stabilny przepływ ponad 30 leadów dziennie z precyzyjnym targetowaniem",
    googleAdsTitle: "GOOGLE ADS Quizy",
    googleAdsSubtitle: "Uzyskaj 20-50 wysokiej jakości leadów dziennie z Google Search i YouTube",
    metaFurnitureDesc: "Zdobądź 30+ jakościowych leadów dziennie dla swojego biznesu meblowego",
    metaRepairDesc: "5-15 gorących leadów dziennie dla usług remontowych",
    metaEcomDesc: "Skaluj swój sklep internetowy z 30-120 leadami dziennie",
    metaProductsDesc: "Zwiększ sprzedaż swoich produktów dzięki ukierunkowanej reklamie",
    metaTelegramDesc: "200-1200 nowych subskrybentów Telegram tygodniowo",
    googleFurnitureDesc: "Jakościowe leady na meble z Google Search",
    googleRepairDesc: "Leady na remont z Google Search",
    googleEcomDesc: "Rozwijaj swój sklep za pomocą Google Ads i Shopping",
    googleProductsDesc: "Sprzedawaj więcej produktów za pomocą Google Ads",
    googleTelegramDesc: "Rozwijaj swój kanał za pomocą Google i YouTube",
  },
  
  de: {
    startQuiz: "Quiz starten",
    step: "Schritt",
    of: "von",
    submit: "Erhalten",
    submitting: "Senden...",
    
    freeBonus: "🎁 BONUS",
    freeBonusText: "Kostenloser Audit Ihrer Werbung + personalisierte Startstrategie",
    whyChooseUs: "Warum uns wählen",
    
    formTitle: "Erhalten Sie Ihre kostenlose Analyse",
    formSubtitle: "Unser Spezialist wird Sie innerhalb von 10-15 Minuten kontaktieren",
    yourName: "Ihr Name",
    phoneNumber: "Telefonnummer",
    telegramUsername: "Telegram (optional)",
    optional: "optional",
    getAnalysis: "Meine kostenlose Analyse erhalten →",
    
    thankYouTitle: "Vielen Dank! Antrag erhalten!",
    thankYouMessage: "Unser Spezialist wird Sie innerhalb von 10-15 Minuten kontaktieren und einen personalisierten Startplan bereitstellen.",
    contactTime: "Wir analysieren bereits Ihre Nische und bereiten eine Ergebnisprognose vor.",
    goToTelegram: "Zu Telegram gehen →",
    returnToQuizzes: "Zurück zur Quiz-Auswahl",
    
    homeTitle: "PIKALEADS Lead Engine",
    homeSubtitle: "Wählen Sie Ihre Nische und Plattform für eine kostenlose Marketing-Analyse",
    metaAdsTitle: "META ADS Quiz",
    metaAdsSubtitle: "Erhalten Sie einen stabilen Fluss von über 30 Leads täglich mit präzisem Targeting",
    googleAdsTitle: "GOOGLE ADS Quiz",
    googleAdsSubtitle: "Erhalten Sie täglich 20-50 hochwertige Leads von Google Search und YouTube",
    metaFurnitureDesc: "Erhalten Sie täglich 30+ qualitativ hochwertige Leads für Ihr Möbelgeschäft",
    metaRepairDesc: "5-15 heiße Leads täglich für Renovierungsdienstleistungen",
    metaEcomDesc: "Skalieren Sie Ihren Online-Shop mit 30-120 Leads täglich",
    metaProductsDesc: "Steigern Sie Ihre Produktverkäufe mit gezielter Werbung",
    metaTelegramDesc: "200-1200 neue Telegram-Abonnenten wöchentlich",
    googleFurnitureDesc: "Qualitativ hochwertige Möbel-Leads aus der Google-Suche",
    googleRepairDesc: "Renovierungs-Leads aus der Google-Suche",
    googleEcomDesc: "Erweitern Sie Ihren Shop mit Google Ads & Shopping",
    googleProductsDesc: "Verkaufen Sie mehr Produkte mit Google Ads",
    googleTelegramDesc: "Erweitern Sie Ihren Kanal mit Google und YouTube",
  },
};

export function useTranslation() {
  // This will be replaced with actual language context
  return (key: keyof Translations, lang: Language = "en") => {
    return translations[lang][key] || key;
  };
}
