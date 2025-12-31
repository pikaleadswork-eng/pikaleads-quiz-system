import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./drizzle/schema.ts";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL is not set");
  process.exit(1);
}

const connection = await mysql.createConnection(DATABASE_URL);
const db = drizzle(connection, { schema, mode: "default" });

console.log("🌱 Seeding quiz templates...");

const templates = [
  // Furniture Store Templates (3 variants)
  {
    name: "Меблі для вітальні - Класичний стиль",
    niche: "furniture",
    description: "Допоможіть клієнтам підібрати ідеальні меблі для вітальні в класичному стилі",
    previewImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Який розмір вашої вітальні?",
          type: "single",
          options: ["До 15 м²", "15-25 м²", "25-40 м²", "Більше 40 м²"]
        },
        {
          id: 2,
          text: "Який стиль вам подобається?",
          type: "single",
          options: ["Класичний", "Сучасний", "Скандинавський", "Лофт"]
        },
        {
          id: 3,
          text: "Який ваш бюджет?",
          type: "single",
          options: ["До 50 000 грн", "50 000 - 100 000 грн", "100 000 - 200 000 грн", "Більше 200 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "split",
      primaryColor: "#8B4513",
      accentColor: "#D2691E",
      fontFamily: "Playfair Display",
      titleText: "Підберіть ідеальні меблі для вашої вітальні",
      subtitleText: "Пройдіть тест за 2 хвилини та отримайте персональну підбірку меблів",
      buttonText: "Почати підбір",
      bonusText: "Знижка 15% на першу покупку"
    }),
  },
  {
    name: "Меблі для спальні - Мінімалізм",
    niche: "furniture",
    description: "Квіз для підбору меблів у спальню в стилі мінімалізм",
    previewImage: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Скільки людей буде спати в спальні?",
          type: "single",
          options: ["1 особа", "2 особи", "2+ дітей"]
        },
        {
          id: 2,
          text: "Потрібна система зберігання?",
          type: "multiple",
          options: ["Шафа", "Комод", "Тумбочки", "Не потрібно"]
        },
        {
          id: 3,
          text: "Ваш бюджет на спальню?",
          type: "single",
          options: ["До 40 000 грн", "40 000 - 80 000 грн", "80 000 - 150 000 грн", "Більше 150 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "background",
      primaryColor: "#E8E8E8",
      accentColor: "#333333",
      fontFamily: "Inter",
      titleText: "Створіть ідеальну спальню",
      subtitleText: "Мінімалізм, комфорт та функціональність",
      buttonText: "Розпочати",
      bonusText: "Безкоштовна доставка та збірка"
    }),
  },
  {
    name: "Кухонні меблі - Сучасний дизайн",
    niche: "furniture",
    description: "Підбір кухонних меблів під індивідуальні потреби",
    previewImage: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Тип кухні?",
          type: "single",
          options: ["Лінійна", "Кутова", "П-подібна", "Острівна"]
        },
        {
          id: 2,
          text: "Розмір кухні?",
          type: "single",
          options: ["До 6 м²", "6-10 м²", "10-15 м²", "Більше 15 м²"]
        },
        {
          id: 3,
          text: "Матеріал фасадів?",
          type: "single",
          options: ["МДФ", "Масив дерева", "Пластик", "Скло"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "split",
      primaryColor: "#FF6B35",
      accentColor: "#004E89",
      fontFamily: "Montserrat",
      titleText: "Кухня вашої мрії",
      subtitleText: "Індивідуальний дизайн та якісні матеріали",
      buttonText: "Підібрати кухню",
      bonusText: "3D візуалізація безкоштовно"
    }),
  },

  // Renovation Templates (3 variants)
  {
    name: "Ремонт квартири - Під ключ",
    niche: "renovation",
    description: "Розрахунок вартості ремонту квартири під ключ",
    previewImage: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Площа квартири?",
          type: "single",
          options: ["До 40 м²", "40-60 м²", "60-90 м²", "Більше 90 м²"]
        },
        {
          id: 2,
          text: "Тип ремонту?",
          type: "single",
          options: ["Косметичний", "Капітальний", "Євроремонт", "Дизайнерський"]
        },
        {
          id: 3,
          text: "Терміни виконання?",
          type: "single",
          options: ["1 місяць", "2 місяці", "3 місяці", "Не важливо"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "background",
      primaryColor: "#FFD700",
      accentColor: "#1E90FF",
      fontFamily: "Roboto",
      titleText: "Розрахуйте вартість ремонту за 2 хвилини",
      subtitleText: "Отримайте точну кошторисну вартість та план робіт",
      buttonText: "Розрахувати",
      bonusText: "Дизайн-проект у подарунок"
    }),
  },
  {
    name: "Ремонт ванної кімнати",
    niche: "renovation",
    description: "Спеціалізований квіз для ремонту ванної",
    previewImage: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Площа ванної?",
          type: "single",
          options: ["До 3 м²", "3-5 м²", "5-8 м²", "Більше 8 м²"]
        },
        {
          id: 2,
          text: "Що потрібно замінити?",
          type: "multiple",
          options: ["Плитка", "Сантехніка", "Електрика", "Вентиляція"]
        },
        {
          id: 3,
          text: "Бюджет на ремонт?",
          type: "single",
          options: ["До 50 000 грн", "50 000 - 100 000 грн", "100 000 - 200 000 грн", "Більше 200 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "center",
      primaryColor: "#00CED1",
      accentColor: "#FF69B4",
      fontFamily: "Poppins",
      titleText: "Ванна кімната мрії",
      subtitleText: "Сучасний дизайн та якісні матеріали",
      buttonText: "Почати",
      bonusText: "Знижка 10% на матеріали"
    }),
  },
  {
    name: "Ремонт офісу",
    niche: "renovation",
    description: "Комерційний ремонт офісних приміщень",
    previewImage: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Площа офісу?",
          type: "single",
          options: ["До 50 м²", "50-100 м²", "100-200 м²", "Більше 200 м²"]
        },
        {
          id: 2,
          text: "Кількість робочих місць?",
          type: "single",
          options: ["До 5", "5-15", "15-30", "Більше 30"]
        },
        {
          id: 3,
          text: "Потрібні переговорні?",
          type: "single",
          options: ["Так, 1", "Так, 2-3", "Так, більше 3", "Не потрібно"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "split",
      primaryColor: "#4169E1",
      accentColor: "#32CD32",
      fontFamily: "Open Sans",
      titleText: "Сучасний офіс для вашого бізнесу",
      subtitleText: "Функціональний дизайн та ергономіка",
      buttonText: "Отримати розрахунок",
      bonusText: "Безкоштовний замір та консультація"
    }),
  },

  // E-Commerce Templates (3 variants)
  {
    name: "Підбір ноутбука",
    niche: "ecommerce",
    description: "Допоможіть клієнтам вибрати ідеальний ноутбук",
    previewImage: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Для яких цілей потрібен ноутбук?",
          type: "single",
          options: ["Робота з документами", "Програмування", "Дизайн/Відео", "Ігри"]
        },
        {
          id: 2,
          text: "Діагональ екрану?",
          type: "single",
          options: ["13-14 дюймів", "15-16 дюймів", "17+ дюймів", "Не важливо"]
        },
        {
          id: 3,
          text: "Ваш бюджет?",
          type: "single",
          options: ["До 20 000 грн", "20 000 - 40 000 грн", "40 000 - 70 000 грн", "Більше 70 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "split",
      primaryColor: "#FACC15",
      accentColor: "#3B82F6",
      fontFamily: "Inter",
      titleText: "Підберіть ноутбук під ваші цілі",
      subtitleText: "Отримайте 30% знижку на засоби по догляду за гаджетами",
      buttonText: "Підібрати",
      bonusText: "Промокод з 30% знижкою"
    }),
  },
  {
    name: "Підбір смартфона",
    niche: "ecommerce",
    description: "Квіз для вибору смартфона",
    previewImage: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Операційна система?",
          type: "single",
          options: ["Android", "iOS", "Не важливо"]
        },
        {
          id: 2,
          text: "Пріоритет при виборі?",
          type: "single",
          options: ["Камера", "Продуктивність", "Батарея", "Дизайн"]
        },
        {
          id: 3,
          text: "Бюджет?",
          type: "single",
          options: ["До 10 000 грн", "10 000 - 20 000 грн", "20 000 - 40 000 грн", "Більше 40 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "background",
      primaryColor: "#10B981",
      accentColor: "#F59E0B",
      fontFamily: "Montserrat",
      titleText: "Знайдіть ідеальний смартфон",
      subtitleText: "Підбір за 1 хвилину з гарантією найкращої ціни",
      buttonText: "Знайти",
      bonusText: "Безкоштовна доставка"
    }),
  },
  {
    name: "Підбір навушників",
    niche: "ecommerce",
    description: "Допомога у виборі навушників",
    previewImage: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Тип навушників?",
          type: "single",
          options: ["Вкладиші (TWS)", "Накладні", "Повнорозмірні", "Спортивні"]
        },
        {
          id: 2,
          text: "Потрібне шумозаглушення?",
          type: "single",
          options: ["Так, обов'язково", "Бажано", "Не важливо"]
        },
        {
          id: 3,
          text: "Бюджет?",
          type: "single",
          options: ["До 2 000 грн", "2 000 - 5 000 грн", "5 000 - 10 000 грн", "Більше 10 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "center",
      primaryColor: "#8B5CF6",
      accentColor: "#EC4899",
      fontFamily: "Poppins",
      titleText: "Ідеальний звук для вас",
      subtitleText: "Підберемо навушники під ваш стиль життя",
      buttonText: "Підібрати",
      bonusText: "Подарунковий чохол"
    }),
  },

  // Professional Services Templates (3 variants)
  {
    name: "Юридична консультація",
    niche: "services",
    description: "Квіз для підбору юридичних послуг",
    previewImage: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Тип питання?",
          type: "single",
          options: ["Сімейне право", "Бізнес", "Нерухомість", "Кримінальне"]
        },
        {
          id: 2,
          text: "Термін вирішення?",
          type: "single",
          options: ["Терміново (1-3 дні)", "Звичайний (тиждень)", "Не терміново"]
        },
        {
          id: 3,
          text: "Бюджет на послуги?",
          type: "single",
          options: ["До 5 000 грн", "5 000 - 15 000 грн", "15 000 - 50 000 грн", "Більше 50 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "split",
      primaryColor: "#1E40AF",
      accentColor: "#D97706",
      fontFamily: "Roboto",
      titleText: "Професійна юридична допомога",
      subtitleText: "Безкоштовна консультація за результатами тесту",
      buttonText: "Отримати консультацію",
      bonusText: "Перша консультація безкоштовно"
    }),
  },
  {
    name: "Бухгалтерські послуги",
    niche: "services",
    description: "Підбір бухгалтерського обслуговування",
    previewImage: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Форма власності?",
          type: "single",
          options: ["ФОП", "ТОВ", "ПП", "Інше"]
        },
        {
          id: 2,
          text: "Система оподаткування?",
          type: "single",
          options: ["Загальна", "Спрощена", "Єдиний податок", "Не знаю"]
        },
        {
          id: 3,
          text: "Кількість працівників?",
          type: "single",
          options: ["Без працівників", "1-5", "5-20", "Більше 20"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "background",
      primaryColor: "#059669",
      accentColor: "#DC2626",
      fontFamily: "Open Sans",
      titleText: "Бухгалтерія без головного болю",
      subtitleText: "Повний супровід вашого бізнесу",
      buttonText: "Розрахувати вартість",
      bonusText: "Перший місяць зі знижкою 50%"
    }),
  },
  {
    name: "Маркетингові послуги",
    niche: "services",
    description: "Підбір маркетингової стратегії",
    previewImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Ваша ніша?",
          type: "single",
          options: ["E-commerce", "Послуги", "B2B", "Інше"]
        },
        {
          id: 2,
          text: "Які канали цікавлять?",
          type: "multiple",
          options: ["Google Ads", "Facebook/Instagram", "TikTok", "SEO", "Email"]
        },
        {
          id: 3,
          text: "Місячний бюджет?",
          type: "single",
          options: ["До 20 000 грн", "20 000 - 50 000 грн", "50 000 - 100 000 грн", "Більше 100 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "center",
      primaryColor: "#F97316",
      accentColor: "#8B5CF6",
      fontFamily: "Montserrat",
      titleText: "Збільште продажі в 3 рази",
      subtitleText: "Персональна маркетингова стратегія для вашого бізнесу",
      buttonText: "Отримати стратегію",
      bonusText: "Аудит рекламних кампаній безкоштовно"
    }),
  },

  // Real Estate Templates (3 variants)
  {
    name: "Підбір квартири",
    niche: "realestate",
    description: "Допомога у виборі квартири",
    previewImage: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Кількість кімнат?",
          type: "single",
          options: ["1-кімнатна", "2-кімнатна", "3-кімнатна", "4+ кімнати"]
        },
        {
          id: 2,
          text: "Район міста?",
          type: "single",
          options: ["Центр", "Спальний район", "Передмістя", "Не важливо"]
        },
        {
          id: 3,
          text: "Бюджет?",
          type: "single",
          options: ["До 1 млн грн", "1-2 млн грн", "2-3 млн грн", "Більше 3 млн грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "split",
      primaryColor: "#2563EB",
      accentColor: "#F59E0B",
      fontFamily: "Inter",
      titleText: "Знайдіть ідеальну квартиру",
      subtitleText: "Персональна підбірка з 1000+ варіантів",
      buttonText: "Підібрати квартиру",
      bonusText: "Юридичний супровід безкоштовно"
    }),
  },
  {
    name: "Оренда житла",
    niche: "realestate",
    description: "Квіз для пошуку житла в оренду",
    previewImage: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Тип житла?",
          type: "single",
          options: ["Квартира", "Будинок", "Кімната", "Студія"]
        },
        {
          id: 2,
          text: "Термін оренди?",
          type: "single",
          options: ["1-3 місяці", "3-6 місяців", "6-12 місяців", "Більше року"]
        },
        {
          id: 3,
          text: "Бюджет на місяць?",
          type: "single",
          options: ["До 10 000 грн", "10 000 - 20 000 грн", "20 000 - 30 000 грн", "Більше 30 000 грн"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "background",
      primaryColor: "#10B981",
      accentColor: "#6366F1",
      fontFamily: "Poppins",
      titleText: "Комфортне житло в оренду",
      subtitleText: "Знайдемо варіант за 24 години",
      buttonText: "Знайти житло",
      bonusText: "Без комісії для орендарів"
    }),
  },
  {
    name: "Комерційна нерухомість",
    niche: "realestate",
    description: "Підбір комерційної нерухомості",
    previewImage: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800",
    quizData: JSON.stringify({
      questions: [
        {
          id: 1,
          text: "Тип приміщення?",
          type: "single",
          options: ["Офіс", "Магазин", "Склад", "Виробництво"]
        },
        {
          id: 2,
          text: "Площа?",
          type: "single",
          options: ["До 50 м²", "50-100 м²", "100-300 м²", "Більше 300 м²"]
        },
        {
          id: 3,
          text: "Мета?",
          type: "single",
          options: ["Купівля", "Оренда", "Ще не вирішив"]
        }
      ]
    }),
    designPreset: JSON.stringify({
      layoutType: "center",
      primaryColor: "#DC2626",
      accentColor: "#0891B2",
      fontFamily: "Roboto",
      titleText: "Комерційна нерухомість для бізнесу",
      subtitleText: "Професійний підбір з урахуванням всіх вимог",
      buttonText: "Підібрати приміщення",
      bonusText: "Консультація експерта безкоштовно"
    }),
  },
];

// Insert templates
for (const template of templates) {
  await db.insert(schema.quizTemplates).values(template);
  console.log(`✅ Added template: ${template.name}`);
}

console.log(`\n🎉 Successfully seeded ${templates.length} quiz templates!`);
process.exit(0);
