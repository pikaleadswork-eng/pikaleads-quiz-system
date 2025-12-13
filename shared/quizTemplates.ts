/**
 * Quiz Template Library
 * Ready-to-use quiz templates for different niches
 */

export interface QuizTemplate {
  id: string;
  niche: string;
  platform: 'meta' | 'google';
  title: {
    ua: string;
    ru: string;
    en: string;
  };
  subtitle: {
    ua: string;
    ru: string;
    en: string;
  };
  questions: Array<{
    text: {
      ua: string;
      ru: string;
      en: string;
    };
    type: 'text' | 'number' | 'email' | 'phone' | 'single_choice' | 'multiple_choice' | 'slider' | 'date' | 'file' | 'rating';
    required: boolean;
    placeholder?: {
      ua: string;
      ru: string;
      en: string;
    };
    options?: Array<{
      ua: string;
      ru: string;
      en: string;
      score?: number;
    }>;
    min?: number;
    max?: number;
    step?: number;
  }>;
  scoring: {
    method: 'sum' | 'average' | 'weighted';
    ranges: Array<{
      min: number;
      max: number;
      label: {
        ua: string;
        ru: string;
        en: string;
      };
      recommendation: {
        ua: string;
        ru: string;
        en: string;
      };
    }>;
  };
}

export const quizTemplates: QuizTemplate[] = [
  // META ADS TEMPLATES
  {
    id: 'furniture-meta',
    niche: 'furniture',
    platform: 'meta',
    title: {
      ua: 'Хочете отримувати 30+ лідів на меблі щодня?',
      ru: 'Хотите получать 30+ лидов на мебель ежедневно?',
      en: 'Want to Get 30+ Furniture Leads Daily?'
    },
    subtitle: {
      ua: 'Пройдіть короткий квіз і ми розрахуємо вартість ліда та стратегію',
      ru: 'Пройдите короткий квиз и мы рассчитаем стоимость лида и стратегию',
      en: 'Take a short quiz and we\'ll calculate your lead cost and strategy'
    },
    questions: [
      {
        text: {
          ua: 'Який ваш щомісячний бюджет на рекламу?',
          ru: 'Какой ваш ежемесячный бюджет на рекламу?',
          en: 'What is your monthly advertising budget?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $500', ru: 'До $500', en: 'Up to $500', score: 1 },
          { ua: '$500-$1000', ru: '$500-$1000', en: '$500-$1000', score: 2 },
          { ua: '$1000-$3000', ru: '$1000-$3000', en: '$1000-$3000', score: 3 },
          { ua: '$3000-$5000', ru: '$3000-$5000', en: '$3000-$5000', score: 4 },
          { ua: 'Більше $5000', ru: 'Более $5000', en: 'More than $5000', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Яка ваша ціль по лідам на місяць?',
          ru: 'Какая ваша цель по лидам в месяц?',
          en: 'What is your monthly lead goal?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: '10-30 лідів', ru: '10-30 лидов', en: '10-30 leads', score: 1 },
          { ua: '30-50 лідів', ru: '30-50 лидов', en: '30-50 leads', score: 2 },
          { ua: '50-100 лідів', ru: '50-100 лидов', en: '50-100 leads', score: 3 },
          { ua: '100-200 лідів', ru: '100-200 лидов', en: '100-200 leads', score: 4 },
          { ua: 'Більше 200 лідів', ru: 'Более 200 лидов', en: 'More than 200 leads', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Чи є у вас досвід з Meta Ads (Facebook/Instagram)?',
          ru: 'Есть ли у вас опыт с Meta Ads (Facebook/Instagram)?',
          en: 'Do you have experience with Meta Ads (Facebook/Instagram)?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'Ні, я новачок', ru: 'Нет, я новичок', en: 'No, I\'m a beginner', score: 1 },
          { ua: 'Трохи експериментував', ru: 'Немного экспериментировал', en: 'Some experimentation', score: 2 },
          { ua: 'Запускав кілька кампаній', ru: 'Запускал несколько кампаний', en: 'Launched a few campaigns', score: 3 },
          { ua: 'Досвідчений користувач', ru: 'Опытный пользователь', en: 'Experienced user', score: 4 },
          { ua: 'Професіонал', ru: 'Профессионал', en: 'Professional', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Іван Петренко',
          ru: 'Иван Петренко',
          en: 'John Doe'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'ivan@example.com',
          ru: 'ivan@example.com',
          en: 'john@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 5,
          label: { ua: 'Початковий рівень', ru: 'Начальный уровень', en: 'Beginner Level' },
          recommendation: {
            ua: 'Рекомендуємо почати з невеликого бюджету $500-1000 та базової стратегії таргетингу',
            ru: 'Рекомендуем начать с небольшого бюджета $500-1000 и базовой стратегии таргетинга',
            en: 'We recommend starting with a small budget of $500-1000 and basic targeting strategy'
          }
        },
        {
          min: 6,
          max: 10,
          label: { ua: 'Середній рівень', ru: 'Средний уровень', en: 'Intermediate Level' },
          recommendation: {
            ua: 'Ви готові до масштабування. Бюджет $1000-3000 з оптимізацією кампаній',
            ru: 'Вы готовы к масштабированию. Бюджет $1000-3000 с оптимизацией кампаний',
            en: 'You\'re ready to scale. Budget $1000-3000 with campaign optimization'
          }
        },
        {
          min: 11,
          max: 15,
          label: { ua: 'Високий рівень', ru: 'Высокий уровень', en: 'Advanced Level' },
          recommendation: {
            ua: 'Агресивне масштабування з бюджетом $3000+ та A/B тестуванням',
            ru: 'Агрессивное масштабирование с бюджетом $3000+ и A/B тестированием',
            en: 'Aggressive scaling with $3000+ budget and A/B testing'
          }
        }
      ]
    }
  },

  {
    id: 'renovation-meta',
    niche: 'renovation',
    platform: 'meta',
    title: {
      ua: 'Отримуйте 5-15 гарячих лідів на ремонт щодня',
      ru: 'Получайте 5-15 горячих лидов на ремонт ежедневно',
      en: 'Get 5-15 Hot Leads Daily for Apartment Renovations'
    },
    subtitle: {
      ua: 'Розрахуємо вартість ліда та стратегію для вашого ремонтного бізнесу',
      ru: 'Рассчитаем стоимость лида и стратегию для вашего ремонтного бизнеса',
      en: 'Calculate lead cost and strategy for your renovation business'
    },
    questions: [
      {
        text: {
          ua: 'Який середній чек вашого проекту?',
          ru: 'Какой средний чек вашего проекта?',
          en: 'What is your average project value?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $3000', ru: 'До $3000', en: 'Up to $3000', score: 1 },
          { ua: '$3000-$10000', ru: '$3000-$10000', en: '$3000-$10000', score: 2 },
          { ua: '$10000-$30000', ru: '$10000-$30000', en: '$10000-$30000', score: 3 },
          { ua: '$30000-$50000', ru: '$30000-$50000', en: '$30000-$50000', score: 4 },
          { ua: 'Більше $50000', ru: 'Более $50000', en: 'More than $50000', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Скільки проектів ви можете виконувати одночасно?',
          ru: 'Сколько проектов вы можете выполнять одновременно?',
          en: 'How many projects can you handle simultaneously?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: '1-2 проекти', ru: '1-2 проекта', en: '1-2 projects', score: 1 },
          { ua: '3-5 проектів', ru: '3-5 проектов', en: '3-5 projects', score: 2 },
          { ua: '5-10 проектів', ru: '5-10 проектов', en: '5-10 projects', score: 3 },
          { ua: '10-20 проектів', ru: '10-20 проектов', en: '10-20 projects', score: 4 },
          { ua: 'Більше 20 проектів', ru: 'Более 20 проектов', en: 'More than 20 projects', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Ваш регіон роботи',
          ru: 'Ваш регион работы',
          en: 'Your service area'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Київ та область',
          ru: 'Киев и область',
          en: 'Kyiv and region'
        }
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Олександр Коваленко',
          ru: 'Александр Коваленко',
          en: 'Alexander Kovalenko'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'alex@example.com',
          ru: 'alex@example.com',
          en: 'alex@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 4,
          label: { ua: 'Малий бізнес', ru: 'Малый бизнес', en: 'Small Business' },
          recommendation: {
            ua: 'Фокус на локальному таргетингу з бюджетом $300-500/міс',
            ru: 'Фокус на локальном таргетинге с бюджетом $300-500/мес',
            en: 'Focus on local targeting with $300-500/month budget'
          }
        },
        {
          min: 5,
          max: 8,
          label: { ua: 'Середній бізнес', ru: 'Средний бизнес', en: 'Medium Business' },
          recommendation: {
            ua: 'Розширений таргетинг + ретаргетинг з бюджетом $500-1500/міс',
            ru: 'Расширенный таргетинг + ретаргетинг с бюджетом $500-1500/мес',
            en: 'Extended targeting + retargeting with $500-1500/month budget'
          }
        },
        {
          min: 9,
          max: 15,
          label: { ua: 'Великий бізнес', ru: 'Крупный бизнес', en: 'Large Business' },
          recommendation: {
            ua: 'Повномасштабна кампанія з бюджетом $1500+ та командою менеджерів',
            ru: 'Полномасштабная кампания с бюджетом $1500+ и командой менеджеров',
            en: 'Full-scale campaign with $1500+ budget and manager team'
          }
        }
      ]
    }
  },

  {
    id: 'ecommerce-meta',
    niche: 'ecommerce',
    platform: 'meta',
    title: {
      ua: 'Хочете масштабувати свій E-Commerce? Отримуйте 30-120 лідів щодня',
      ru: 'Хотите масштабировать свой E-Commerce? Получайте 30-120 лидов ежедневно',
      en: 'Want to Scale Your E-Commerce? Get 30-120 Leads Daily'
    },
    subtitle: {
      ua: 'Розрахуємо стратегію масштабування для вашого інтернет-магазину',
      ru: 'Рассчитаем стратегию масштабирования для вашего интернет-магазина',
      en: 'Calculate scaling strategy for your online store'
    },
    questions: [
      {
        text: {
          ua: 'Який ваш поточний місячний оборот?',
          ru: 'Какой ваш текущий месячный оборот?',
          en: 'What is your current monthly revenue?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $5000', ru: 'До $5000', en: 'Up to $5000', score: 1 },
          { ua: '$5000-$20000', ru: '$5000-$20000', en: '$5000-$20000', score: 2 },
          { ua: '$20000-$50000', ru: '$20000-$50000', en: '$20000-$50000', score: 3 },
          { ua: '$50000-$100000', ru: '$50000-$100000', en: '$50000-$100000', score: 4 },
          { ua: 'Більше $100000', ru: 'Более $100000', en: 'More than $100000', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Скільки товарів у вашому асортименті?',
          ru: 'Сколько товаров в вашем ассортименте?',
          en: 'How many products do you have?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: '1-10 товарів', ru: '1-10 товаров', en: '1-10 products', score: 1 },
          { ua: '10-50 товарів', ru: '10-50 товаров', en: '10-50 products', score: 2 },
          { ua: '50-200 товарів', ru: '50-200 товаров', en: '50-200 products', score: 3 },
          { ua: '200-1000 товарів', ru: '200-1000 товаров', en: '200-1000 products', score: 4 },
          { ua: 'Більше 1000 товарів', ru: 'Более 1000 товаров', en: 'More than 1000 products', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Чи використовуєте ви Pixel Facebook?',
          ru: 'Используете ли вы Pixel Facebook?',
          en: 'Do you use Facebook Pixel?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'Ні, не встановлений', ru: 'Нет, не установлен', en: 'No, not installed', score: 1 },
          { ua: 'Встановлений, але не налаштований', ru: 'Установлен, но не настроен', en: 'Installed but not configured', score: 2 },
          { ua: 'Налаштований базово', ru: 'Настроен базово', en: 'Basic setup', score: 3 },
          { ua: 'Повністю налаштований', ru: 'Полностью настроен', en: 'Fully configured', score: 4 },
          { ua: 'Налаштований + Conversions API', ru: 'Настроен + Conversions API', en: 'Configured + Conversions API', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Марія Шевченко',
          ru: 'Мария Шевченко',
          en: 'Maria Shevchenko'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'maria@example.com',
          ru: 'maria@example.com',
          en: 'maria@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 5,
          label: { ua: 'Стартап', ru: 'Стартап', en: 'Startup' },
          recommendation: {
            ua: 'Базова стратегія з бюджетом $500-1000 та фокусом на бестселери',
            ru: 'Базовая стратегия с бюджетом $500-1000 и фокусом на бестселлеры',
            en: 'Basic strategy with $500-1000 budget focusing on bestsellers'
          }
        },
        {
          min: 6,
          max: 10,
          label: { ua: 'Зростаючий бізнес', ru: 'Растущий бизнес', en: 'Growing Business' },
          recommendation: {
            ua: 'Масштабування з бюджетом $1000-3000 та динамічною рекламою',
            ru: 'Масштабирование с бюджетом $1000-3000 и динамической рекламой',
            en: 'Scaling with $1000-3000 budget and dynamic ads'
          }
        },
        {
          min: 11,
          max: 15,
          label: { ua: 'Великий e-commerce', ru: 'Крупный e-commerce', en: 'Large E-commerce' },
          recommendation: {
            ua: 'Повне масштабування з бюджетом $3000+ та автоматизацією',
            ru: 'Полное масштабирование с бюджетом $3000+ и автоматизацией',
            en: 'Full scaling with $3000+ budget and automation'
          }
        }
      ]
    }
  },

  {
    id: 'products-meta',
    niche: 'products',
    platform: 'meta',
    title: {
      ua: 'Масштабуйте продажі товарів з Meta Ads',
      ru: 'Масштабируйте продажи товаров с Meta Ads',
      en: 'Scale Your Product Sales with Meta Ads'
    },
    subtitle: {
      ua: 'Отримайте персональну стратегію для вашого продукту',
      ru: 'Получите персональную стратегию для вашего продукта',
      en: 'Get personalized strategy for your product'
    },
    questions: [
      {
        text: {
          ua: 'Яка ціна вашого продукту?',
          ru: 'Какая цена вашего продукта?',
          en: 'What is your product price?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $20', ru: 'До $20', en: 'Up to $20', score: 1 },
          { ua: '$20-$50', ru: '$20-$50', en: '$20-$50', score: 2 },
          { ua: '$50-$100', ru: '$50-$100', en: '$50-$100', score: 3 },
          { ua: '$100-$300', ru: '$100-$300', en: '$100-$300', score: 4 },
          { ua: 'Більше $300', ru: 'Более $300', en: 'More than $300', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Яка ваша маржа на продукті?',
          ru: 'Какая ваша маржа на продукте?',
          en: 'What is your product margin?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До 20%', ru: 'До 20%', en: 'Up to 20%', score: 1 },
          { ua: '20-40%', ru: '20-40%', en: '20-40%', score: 2 },
          { ua: '40-60%', ru: '40-60%', en: '40-60%', score: 3 },
          { ua: '60-80%', ru: '60-80%', en: '60-80%', score: 4 },
          { ua: 'Більше 80%', ru: 'Более 80%', en: 'More than 80%', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Скільки продажів ви робите зараз на місяць?',
          ru: 'Сколько продаж вы делаете сейчас в месяц?',
          en: 'How many sales do you make per month now?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: '0-10 продажів', ru: '0-10 продаж', en: '0-10 sales', score: 1 },
          { ua: '10-50 продажів', ru: '10-50 продаж', en: '10-50 sales', score: 2 },
          { ua: '50-100 продажів', ru: '50-100 продаж', en: '50-100 sales', score: 3 },
          { ua: '100-500 продажів', ru: '100-500 продаж', en: '100-500 sales', score: 4 },
          { ua: 'Більше 500 продажів', ru: 'Более 500 продаж', en: 'More than 500 sales', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Дмитро Іваненко',
          ru: 'Дмитрий Иваненко',
          en: 'Dmitry Ivanenko'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'dmitry@example.com',
          ru: 'dmitry@example.com',
          en: 'dmitry@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 5,
          label: { ua: 'Початковий етап', ru: 'Начальный этап', en: 'Early Stage' },
          recommendation: {
            ua: 'Тестування аудиторій з бюджетом $300-700/міс',
            ru: 'Тестирование аудиторий с бюджетом $300-700/мес',
            en: 'Audience testing with $300-700/month budget'
          }
        },
        {
          min: 6,
          max: 10,
          label: { ua: 'Активне зростання', ru: 'Активный рост', en: 'Active Growth' },
          recommendation: {
            ua: 'Масштабування переможців з бюджетом $700-2000/міс',
            ru: 'Масштабирование победителей с бюджетом $700-2000/мес',
            en: 'Scaling winners with $700-2000/month budget'
          }
        },
        {
          min: 11,
          max: 15,
          label: { ua: 'Масове масштабування', ru: 'Массовое масштабирование', en: 'Mass Scaling' },
          recommendation: {
            ua: 'Агресивне масштабування з бюджетом $2000+ та автоматизацією',
            ru: 'Агрессивное масштабирование с бюджетом $2000+ и автоматизацией',
            en: 'Aggressive scaling with $2000+ budget and automation'
          }
        }
      ]
    }
  },

  {
    id: 'telegram-meta',
    niche: 'telegram',
    platform: 'meta',
    title: {
      ua: 'Отримуйте 200-1200 нових підписників Telegram щотижня',
      ru: 'Получайте 200-1200 новых подписчиков Telegram еженедельно',
      en: 'Get 200-1200 New Telegram Subscribers Weekly'
    },
    subtitle: {
      ua: 'Розрахуємо стратегію зростання вашого Telegram-каналу',
      ru: 'Рассчитаем стратегию роста вашего Telegram-канала',
      en: 'Calculate growth strategy for your Telegram channel'
    },
    questions: [
      {
        text: {
          ua: 'Скільки підписників у вашому каналі зараз?',
          ru: 'Сколько подписчиков в вашем канале сейчас?',
          en: 'How many subscribers do you have now?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: '0-100 підписників', ru: '0-100 подписчиков', en: '0-100 subscribers', score: 1 },
          { ua: '100-500 підписників', ru: '100-500 подписчиков', en: '100-500 subscribers', score: 2 },
          { ua: '500-2000 підписників', ru: '500-2000 подписчиков', en: '500-2000 subscribers', score: 3 },
          { ua: '2000-10000 підписників', ru: '2000-10000 подписчиков', en: '2000-10000 subscribers', score: 4 },
          { ua: 'Більше 10000 підписників', ru: 'Более 10000 подписчиков', en: 'More than 10000 subscribers', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Яка тематика вашого каналу?',
          ru: 'Какая тематика вашего канала?',
          en: 'What is your channel topic?'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Маркетинг, бізнес, фінанси...',
          ru: 'Маркетинг, бизнес, финансы...',
          en: 'Marketing, business, finance...'
        }
      },
      {
        text: {
          ua: 'Який ваш бюджет на просування?',
          ru: 'Какой ваш бюджет на продвижение?',
          en: 'What is your promotion budget?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $200', ru: 'До $200', en: 'Up to $200', score: 1 },
          { ua: '$200-$500', ru: '$200-$500', en: '$200-$500', score: 2 },
          { ua: '$500-$1000', ru: '$500-$1000', en: '$500-$1000', score: 3 },
          { ua: '$1000-$3000', ru: '$1000-$3000', en: '$1000-$3000', score: 4 },
          { ua: 'Більше $3000', ru: 'Более $3000', en: 'More than $3000', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Андрій Сидоренко',
          ru: 'Андрей Сидоренко',
          en: 'Andrew Sidorenko'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'andrew@example.com',
          ru: 'andrew@example.com',
          en: 'andrew@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 5,
          label: { ua: 'Новий канал', ru: 'Новый канал', en: 'New Channel' },
          recommendation: {
            ua: 'Базова стратегія з бюджетом $200-500 та таргетингом на зацікавлену аудиторію',
            ru: 'Базовая стратегия с бюджетом $200-500 и таргетингом на заинтересованную аудиторию',
            en: 'Basic strategy with $200-500 budget targeting interested audience'
          }
        },
        {
          min: 6,
          max: 10,
          label: { ua: 'Зростаючий канал', ru: 'Растущий канал', en: 'Growing Channel' },
          recommendation: {
            ua: 'Активне просування з бюджетом $500-1500 та lookalike аудиторіями',
            ru: 'Активное продвижение с бюджетом $500-1500 и lookalike аудиториями',
            en: 'Active promotion with $500-1500 budget and lookalike audiences'
          }
        },
        {
          min: 11,
          max: 15,
          label: { ua: 'Великий канал', ru: 'Крупный канал', en: 'Large Channel' },
          recommendation: {
            ua: 'Масове масштабування з бюджетом $1500+ та автоматизацією',
            ru: 'Массовое масштабирование с бюджетом $1500+ и автоматизацией',
            en: 'Mass scaling with $1500+ budget and automation'
          }
        }
      ]
    }
  },

  // GOOGLE ADS TEMPLATES
  {
    id: 'furniture-google',
    niche: 'furniture',
    platform: 'google',
    title: {
      ua: 'Отримуйте якісні ліди на меблі з Google Ads',
      ru: 'Получайте качественные лиды на мебель с Google Ads',
      en: 'Get Quality Furniture Leads from Google Ads'
    },
    subtitle: {
      ua: 'Розрахуємо вартість кліка та стратегію для Google пошуку',
      ru: 'Рассчитаем стоимость клика и стратегию для Google поиска',
      en: 'Calculate CPC and strategy for Google Search'
    },
    questions: [
      {
        text: {
          ua: 'Який ваш місячний бюджет на Google Ads?',
          ru: 'Какой ваш месячный бюджет на Google Ads?',
          en: 'What is your monthly Google Ads budget?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $300', ru: 'До $300', en: 'Up to $300', score: 1 },
          { ua: '$300-$700', ru: '$300-$700', en: '$300-$700', score: 2 },
          { ua: '$700-$1500', ru: '$700-$1500', en: '$700-$1500', score: 3 },
          { ua: '$1500-$3000', ru: '$1500-$3000', en: '$1500-$3000', score: 4 },
          { ua: 'Більше $3000', ru: 'Более $3000', en: 'More than $3000', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Чи є у вас досвід з Google Ads?',
          ru: 'Есть ли у вас опыт с Google Ads?',
          en: 'Do you have Google Ads experience?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'Ні, новачок', ru: 'Нет, новичок', en: 'No, beginner', score: 1 },
          { ua: 'Трохи експериментував', ru: 'Немного экспериментировал', en: 'Some experimentation', score: 2 },
          { ua: 'Запускав кілька кампаній', ru: 'Запускал несколько кампаний', en: 'Launched a few campaigns', score: 3 },
          { ua: 'Досвідчений користувач', ru: 'Опытный пользователь', en: 'Experienced user', score: 4 },
          { ua: 'Професіонал', ru: 'Профессионал', en: 'Professional', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Які ключові слова ви хочете використовувати?',
          ru: 'Какие ключевые слова вы хотите использовать?',
          en: 'What keywords do you want to use?'
        },
        type: 'text',
        required: false,
        placeholder: {
          ua: 'купити меблі, меблі київ...',
          ru: 'купить мебель, мебель киев...',
          en: 'buy furniture, furniture kyiv...'
        }
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Петро Мельник',
          ru: 'Петр Мельник',
          en: 'Peter Melnyk'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'peter@example.com',
          ru: 'peter@example.com',
          en: 'peter@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 4,
          label: { ua: 'Початковий рівень', ru: 'Начальный уровень', en: 'Beginner Level' },
          recommendation: {
            ua: 'Почніть з Search кампанії з бюджетом $300-700 та точним відповідністю',
            ru: 'Начните с Search кампании с бюджетом $300-700 и точным соответствием',
            en: 'Start with Search campaign with $300-700 budget and exact match'
          }
        },
        {
          min: 5,
          max: 8,
          label: { ua: 'Середній рівень', ru: 'Средний уровень', en: 'Intermediate Level' },
          recommendation: {
            ua: 'Search + Display з бюджетом $700-1500 та ремаркетингом',
            ru: 'Search + Display с бюджетом $700-1500 и ремаркетингом',
            en: 'Search + Display with $700-1500 budget and remarketing'
          }
        },
        {
          min: 9,
          max: 15,
          label: { ua: 'Високий рівень', ru: 'Высокий уровень', en: 'Advanced Level' },
          recommendation: {
            ua: 'Повний комплекс (Search, Display, Shopping) з бюджетом $1500+',
            ru: 'Полный комплекс (Search, Display, Shopping) с бюджетом $1500+',
            en: 'Full suite (Search, Display, Shopping) with $1500+ budget'
          }
        }
      ]
    }
  },

  {
    id: 'renovation-google',
    niche: 'renovation',
    platform: 'google',
    title: {
      ua: 'Отримуйте ліди на ремонт з Google пошуку',
      ru: 'Получайте лиды на ремонт из Google поиска',
      en: 'Get Renovation Leads from Google Search'
    },
    subtitle: {
      ua: 'Стратегія для залучення клієнтів через Google Ads',
      ru: 'Стратегия для привлечения клиентов через Google Ads',
      en: 'Strategy for attracting clients through Google Ads'
    },
    questions: [
      {
        text: {
          ua: 'Який середній чек вашого проекту?',
          ru: 'Какой средний чек вашего проекта?',
          en: 'What is your average project value?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $3000', ru: 'До $3000', en: 'Up to $3000', score: 1 },
          { ua: '$3000-$10000', ru: '$3000-$10000', en: '$3000-$10000', score: 2 },
          { ua: '$10000-$30000', ru: '$10000-$30000', en: '$10000-$30000', score: 3 },
          { ua: '$30000-$50000', ru: '$30000-$50000', en: '$30000-$50000', score: 4 },
          { ua: 'Більше $50000', ru: 'Более $50000', en: 'More than $50000', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Яка максимальна вартість ліда для вас прийнятна?',
          ru: 'Какая максимальная стоимость лида для вас приемлема?',
          en: 'What is your maximum acceptable cost per lead?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $10', ru: 'До $10', en: 'Up to $10', score: 1 },
          { ua: '$10-$30', ru: '$10-$30', en: '$10-$30', score: 2 },
          { ua: '$30-$50', ru: '$30-$50', en: '$30-$50', score: 3 },
          { ua: '$50-$100', ru: '$50-$100', en: '$50-$100', score: 4 },
          { ua: 'Більше $100', ru: 'Более $100', en: 'More than $100', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Ваш регіон роботи',
          ru: 'Ваш регион работы',
          en: 'Your service area'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Київ та область',
          ru: 'Киев и область',
          en: 'Kyiv and region'
        }
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Сергій Бондаренко',
          ru: 'Сергей Бондаренко',
          en: 'Sergey Bondarenko'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'sergey@example.com',
          ru: 'sergey@example.com',
          en: 'sergey@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 4,
          label: { ua: 'Локальний бізнес', ru: 'Локальный бизнес', en: 'Local Business' },
          recommendation: {
            ua: 'Локальна Search кампанія з геотаргетингом, бюджет $300-500',
            ru: 'Локальная Search кампания с геотаргетингом, бюджет $300-500',
            en: 'Local Search campaign with geo-targeting, $300-500 budget'
          }
        },
        {
          min: 5,
          max: 8,
          label: { ua: 'Регіональний бізнес', ru: 'Региональный бизнес', en: 'Regional Business' },
          recommendation: {
            ua: 'Search + Local Services Ads з бюджетом $500-1200',
            ru: 'Search + Local Services Ads с бюджетом $500-1200',
            en: 'Search + Local Services Ads with $500-1200 budget'
          }
        },
        {
          min: 9,
          max: 15,
          label: { ua: 'Великий бізнес', ru: 'Крупный бизнес', en: 'Large Business' },
          recommendation: {
            ua: 'Повний комплекс (Search, Display, YouTube) з бюджетом $1200+',
            ru: 'Полный комплекс (Search, Display, YouTube) с бюджетом $1200+',
            en: 'Full suite (Search, Display, YouTube) with $1200+ budget'
          }
        }
      ]
    }
  },

  {
    id: 'ecommerce-google',
    niche: 'ecommerce',
    platform: 'google',
    title: {
      ua: 'Масштабуйте свій E-Commerce з Google Ads',
      ru: 'Масштабируйте свой E-Commerce с Google Ads',
      en: 'Scale Your E-Commerce with Google Ads'
    },
    subtitle: {
      ua: 'Розрахуємо ROAS та стратегію для вашого магазину',
      ru: 'Рассчитаем ROAS и стратегию для вашего магазина',
      en: 'Calculate ROAS and strategy for your store'
    },
    questions: [
      {
        text: {
          ua: 'Який ваш поточний місячний оборот?',
          ru: 'Какой ваш текущий месячный оборот?',
          en: 'What is your current monthly revenue?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $5000', ru: 'До $5000', en: 'Up to $5000', score: 1 },
          { ua: '$5000-$20000', ru: '$5000-$20000', en: '$5000-$20000', score: 2 },
          { ua: '$20000-$50000', ru: '$20000-$50000', en: '$20000-$50000', score: 3 },
          { ua: '$50000-$100000', ru: '$50000-$100000', en: '$50000-$100000', score: 4 },
          { ua: 'Більше $100000', ru: 'Более $100000', en: 'More than $100000', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Чи налаштований у вас Google Merchant Center?',
          ru: 'Настроен ли у вас Google Merchant Center?',
          en: 'Do you have Google Merchant Center set up?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'Ні, не налаштований', ru: 'Нет, не настроен', en: 'No, not set up', score: 1 },
          { ua: 'Налаштований, але не активний', ru: 'Настроен, но не активен', en: 'Set up but not active', score: 2 },
          { ua: 'Активний, базовий фід', ru: 'Активен, базовый фид', en: 'Active, basic feed', score: 3 },
          { ua: 'Оптимізований фід', ru: 'Оптимизированный фид', en: 'Optimized feed', score: 4 },
          { ua: 'Повністю оптимізований + додаткові фіди', ru: 'Полностью оптимизирован + дополнительные фиды', en: 'Fully optimized + supplemental feeds', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Який ваш цільовий ROAS (Return on Ad Spend)?',
          ru: 'Какой ваш целевой ROAS (Return on Ad Spend)?',
          en: 'What is your target ROAS (Return on Ad Spend)?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: '2x (200%)', ru: '2x (200%)', en: '2x (200%)', score: 1 },
          { ua: '3x (300%)', ru: '3x (300%)', en: '3x (300%)', score: 2 },
          { ua: '4x (400%)', ru: '4x (400%)', en: '4x (400%)', score: 3 },
          { ua: '5x (500%)', ru: '5x (500%)', en: '5x (500%)', score: 4 },
          { ua: '6x+ (600%+)', ru: '6x+ (600%+)', en: '6x+ (600%+)', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Олена Ткаченко',
          ru: 'Елена Ткаченко',
          en: 'Elena Tkachenko'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'elena@example.com',
          ru: 'elena@example.com',
          en: 'elena@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 5,
          label: { ua: 'Стартап', ru: 'Стартап', en: 'Startup' },
          recommendation: {
            ua: 'Shopping кампанія з Smart Bidding, бюджет $500-1000',
            ru: 'Shopping кампания с Smart Bidding, бюджет $500-1000',
            en: 'Shopping campaign with Smart Bidding, $500-1000 budget'
          }
        },
        {
          min: 6,
          max: 10,
          label: { ua: 'Зростаючий бізнес', ru: 'Растущий бизнес', en: 'Growing Business' },
          recommendation: {
            ua: 'Shopping + Performance Max з бюджетом $1000-3000',
            ru: 'Shopping + Performance Max с бюджетом $1000-3000',
            en: 'Shopping + Performance Max with $1000-3000 budget'
          }
        },
        {
          min: 11,
          max: 15,
          label: { ua: 'Великий e-commerce', ru: 'Крупный e-commerce', en: 'Large E-commerce' },
          recommendation: {
            ua: 'Повний комплекс (Shopping, Performance Max, Display, YouTube) з бюджетом $3000+',
            ru: 'Полный комплекс (Shopping, Performance Max, Display, YouTube) с бюджетом $3000+',
            en: 'Full suite (Shopping, Performance Max, Display, YouTube) with $3000+ budget'
          }
        }
      ]
    }
  },

  {
    id: 'products-google',
    niche: 'products',
    platform: 'google',
    title: {
      ua: 'Продавайте більше товарів з Google Ads',
      ru: 'Продавайте больше товаров с Google Ads',
      en: 'Sell More Products with Google Ads'
    },
    subtitle: {
      ua: 'Отримайте персональну стратегію для Google Shopping',
      ru: 'Получите персональную стратегию для Google Shopping',
      en: 'Get personalized strategy for Google Shopping'
    },
    questions: [
      {
        text: {
          ua: 'Яка середня ціна вашого товару?',
          ru: 'Какая средняя цена вашего товара?',
          en: 'What is your average product price?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $20', ru: 'До $20', en: 'Up to $20', score: 1 },
          { ua: '$20-$50', ru: '$20-$50', en: '$20-$50', score: 2 },
          { ua: '$50-$100', ru: '$50-$100', en: '$50-$100', score: 3 },
          { ua: '$100-$300', ru: '$100-$300', en: '$100-$300', score: 4 },
          { ua: 'Більше $300', ru: 'Более $300', en: 'More than $300', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Скільки товарів у вашому каталозі?',
          ru: 'Сколько товаров в вашем каталоге?',
          en: 'How many products in your catalog?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: '1-10 товарів', ru: '1-10 товаров', en: '1-10 products', score: 1 },
          { ua: '10-50 товарів', ru: '10-50 товаров', en: '10-50 products', score: 2 },
          { ua: '50-200 товарів', ru: '50-200 товаров', en: '50-200 products', score: 3 },
          { ua: '200-1000 товарів', ru: '200-1000 товаров', en: '200-1000 products', score: 4 },
          { ua: 'Більше 1000 товарів', ru: 'Более 1000 товаров', en: 'More than 1000 products', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Яка ваша конверсія на сайті зараз?',
          ru: 'Какая ваша конверсия на сайте сейчас?',
          en: 'What is your current website conversion rate?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'Менше 1%', ru: 'Менее 1%', en: 'Less than 1%', score: 1 },
          { ua: '1-2%', ru: '1-2%', en: '1-2%', score: 2 },
          { ua: '2-3%', ru: '2-3%', en: '2-3%', score: 3 },
          { ua: '3-5%', ru: '3-5%', en: '3-5%', score: 4 },
          { ua: 'Більше 5%', ru: 'Более 5%', en: 'More than 5%', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Віктор Романенко',
          ru: 'Виктор Романенко',
          en: 'Victor Romanenko'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'victor@example.com',
          ru: 'victor@example.com',
          en: 'victor@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 5,
          label: { ua: 'Початковий етап', ru: 'Начальный этап', en: 'Early Stage' },
          recommendation: {
            ua: 'Standard Shopping кампанія з бюджетом $300-700',
            ru: 'Standard Shopping кампания с бюджетом $300-700',
            en: 'Standard Shopping campaign with $300-700 budget'
          }
        },
        {
          min: 6,
          max: 10,
          label: { ua: 'Активне зростання', ru: 'Активный рост', en: 'Active Growth' },
          recommendation: {
            ua: 'Smart Shopping + ремаркетинг з бюджетом $700-2000',
            ru: 'Smart Shopping + ремаркетинг с бюджетом $700-2000',
            en: 'Smart Shopping + remarketing with $700-2000 budget'
          }
        },
        {
          min: 11,
          max: 15,
          label: { ua: 'Масове масштабування', ru: 'Массовое масштабирование', en: 'Mass Scaling' },
          recommendation: {
            ua: 'Performance Max + Display + YouTube з бюджетом $2000+',
            ru: 'Performance Max + Display + YouTube с бюджетом $2000+',
            en: 'Performance Max + Display + YouTube with $2000+ budget'
          }
        }
      ]
    }
  },

  {
    id: 'telegram-google',
    niche: 'telegram',
    platform: 'google',
    title: {
      ua: 'Розвивайте свій Telegram-канал з Google Ads',
      ru: 'Развивайте свой Telegram-канал с Google Ads',
      en: 'Grow Your Telegram Channel with Google Ads'
    },
    subtitle: {
      ua: 'Стратегія залучення підписників через Google',
      ru: 'Стратегия привлечения подписчиков через Google',
      en: 'Strategy for attracting subscribers through Google'
    },
    questions: [
      {
        text: {
          ua: 'Скільки підписників у вашому каналі зараз?',
          ru: 'Сколько подписчиков в вашем канале сейчас?',
          en: 'How many subscribers do you have now?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: '0-100 підписників', ru: '0-100 подписчиков', en: '0-100 subscribers', score: 1 },
          { ua: '100-500 підписників', ru: '100-500 подписчиков', en: '100-500 subscribers', score: 2 },
          { ua: '500-2000 підписників', ru: '500-2000 подписчиков', en: '500-2000 subscribers', score: 3 },
          { ua: '2000-10000 підписників', ru: '2000-10000 подписчиков', en: '2000-10000 subscribers', score: 4 },
          { ua: 'Більше 10000 підписників', ru: 'Более 10000 подписчиков', en: 'More than 10000 subscribers', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Яка вартість підписника для вас прийнятна?',
          ru: 'Какая стоимость подписчика для вас приемлема?',
          en: 'What is your acceptable cost per subscriber?'
        },
        type: 'single_choice',
        required: true,
        options: [
          { ua: 'До $0.50', ru: 'До $0.50', en: 'Up to $0.50', score: 1 },
          { ua: '$0.50-$1', ru: '$0.50-$1', en: '$0.50-$1', score: 2 },
          { ua: '$1-$2', ru: '$1-$2', en: '$1-$2', score: 3 },
          { ua: '$2-$5', ru: '$2-$5', en: '$2-$5', score: 4 },
          { ua: 'Більше $5', ru: 'Более $5', en: 'More than $5', score: 5 }
        ]
      },
      {
        text: {
          ua: 'Яка тематика вашого каналу?',
          ru: 'Какая тематика вашего канала?',
          en: 'What is your channel topic?'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Технології, криптовалюта, інвестиції...',
          ru: 'Технологии, криптовалюта, инвестиции...',
          en: 'Technology, cryptocurrency, investments...'
        }
      },
      {
        text: {
          ua: 'Ваше ім\'я',
          ru: 'Ваше имя',
          en: 'Your name'
        },
        type: 'text',
        required: true,
        placeholder: {
          ua: 'Тарас Григоренко',
          ru: 'Тарас Григоренко',
          en: 'Taras Grigorenko'
        }
      },
      {
        text: {
          ua: 'Ваш телефон',
          ru: 'Ваш телефон',
          en: 'Your phone'
        },
        type: 'phone',
        required: true,
        placeholder: {
          ua: '+380501234567',
          ru: '+380501234567',
          en: '+380501234567'
        }
      },
      {
        text: {
          ua: 'Ваш email',
          ru: 'Ваш email',
          en: 'Your email'
        },
        type: 'email',
        required: true,
        placeholder: {
          ua: 'taras@example.com',
          ru: 'taras@example.com',
          en: 'taras@example.com'
        }
      }
    ],
    scoring: {
      method: 'sum',
      ranges: [
        {
          min: 0,
          max: 5,
          label: { ua: 'Новий канал', ru: 'Новый канал', en: 'New Channel' },
          recommendation: {
            ua: 'Display кампанія з таргетингом на інтереси, бюджет $200-500',
            ru: 'Display кампания с таргетингом на интересы, бюджет $200-500',
            en: 'Display campaign with interest targeting, $200-500 budget'
          }
        },
        {
          min: 6,
          max: 10,
          label: { ua: 'Зростаючий канал', ru: 'Растущий канал', en: 'Growing Channel' },
          recommendation: {
            ua: 'Display + YouTube з бюджетом $500-1500',
            ru: 'Display + YouTube с бюджетом $500-1500',
            en: 'Display + YouTube with $500-1500 budget'
          }
        },
        {
          min: 11,
          max: 15,
          label: { ua: 'Великий канал', ru: 'Крупный канал', en: 'Large Channel' },
          recommendation: {
            ua: 'Performance Max + YouTube + Display з бюджетом $1500+',
            ru: 'Performance Max + YouTube + Display с бюджетом $1500+',
            en: 'Performance Max + YouTube + Display with $1500+ budget'
          }
        }
      ]
    }
  }
];

// Helper function to get template by ID
export function getTemplateById(id: string): QuizTemplate | undefined {
  return quizTemplates.find(t => t.id === id);
}

// Helper function to get templates by niche
export function getTemplatesByNiche(niche: string): QuizTemplate[] {
  return quizTemplates.filter(t => t.niche === niche);
}

// Helper function to get templates by platform
export function getTemplatesByPlatform(platform: 'meta' | 'google'): QuizTemplate[] {
  return quizTemplates.filter(t => t.platform === platform);
}

// Helper function to get all niches
export function getAllNiches(): string[] {
  return Array.from(new Set(quizTemplates.map(t => t.niche)));
}
