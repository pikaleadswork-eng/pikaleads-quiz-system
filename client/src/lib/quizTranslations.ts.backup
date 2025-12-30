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
          question: "Jaka jest średnia wartość zamówienia?",
          options: ["Do $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Jaki jest Twój budżet reklamowy?",
          options: ["Do $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Jaki jest Twój główny cel?",
          options: ["Leady", "Telefony", "Wizyty w salonie"],
        },
      ],
    },
    de: {
      title: "Möchten Sie täglich 30+ Möbelanfragen erhalten?",
      subtitle: "Machen Sie ein kurzes Quiz – wir berechnen Ihre Strategie und Lead-Kosten",
      bonus: "Kostenloser Audit Ihrer Werbung + Startstrategie",
      description: "Erhalten Sie täglich 30+ hochwertige Leads für Ihr Möbelgeschäft",
      questions: [
        {
          question: "Was verkaufen Sie genau?",
          options: ["Küchen", "Polstermöbel", "Schränke / Garderoben", "Korpusmöbel", "Alles oben Genannte"],
        },
        {
          question: "Was ist Ihr durchschnittlicher Bestellwert?",
          options: ["Bis $200", "$200–$700", "$700–$2000", "$2000+"],
        },
        {
          question: "Was ist Ihr Werbebudget?",
          options: ["Bis $500", "$500–$1500", "$1500–$3000", "$3000+"],
        },
        {
          question: "Was ist Ihr Hauptziel?",
          options: ["Leads", "Telefonanrufe", "Showroom-Besuche"],
        },
      ],
    },
  },
};

// Helper function to get quiz translation
export function getQuizTranslation(quizId: string, language: Language): QuizTranslation | null {
  return quizTranslations[quizId]?.[language] || quizTranslations[quizId]?.["en"] || null;
}
