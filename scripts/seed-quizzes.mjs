/**
 * Seed script to create 16 quizzes (8 Meta Ads + 8 Google Ads)
 * with multilingual support (UK, RU, EN, PL, DE) using DeepL API
 * Uses batch translation to avoid rate limits
 */

import mysql from 'mysql2/promise';

const DEEPL_API_KEY = '78370d4e-12d1-411d-9ede-2a198c76dd28:fx';
const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate';

// Parse DATABASE_URL properly
function parseDbUrl(url) {
  if (!url) return null;
  const match = url.match(/mysql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/([^?]+)/);
  if (match) {
    return {
      user: match[1],
      password: decodeURIComponent(match[2]),
      host: match[3],
      port: parseInt(match[4]),
      database: match[5],
      ssl: { rejectUnauthorized: true }
    };
  }
  return null;
}

// Sleep function
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Batch translate texts using DeepL API
async function translateBatch(texts, targetLang) {
  if (!texts || texts.length === 0) return texts;
  
  // Filter out empty texts
  const validTexts = texts.filter(t => t && t.trim() !== '');
  if (validTexts.length === 0) return texts;
  
  // Map our language codes to DeepL codes
  const langMap = {
    'ru': 'RU',
    'en': 'EN',
    'pl': 'PL',
    'de': 'DE'
  };
  
  const deeplLang = langMap[targetLang];
  if (!deeplLang) return texts;
  
  try {
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: validTexts,
        source_lang: 'UK',
        target_lang: deeplLang
      })
    });
    
    if (!response.ok) {
      if (response.status === 429) {
        console.log(`    Rate limited, waiting 5s...`);
        await sleep(5000);
        return translateBatch(texts, targetLang); // Retry
      }
      console.error(`DeepL error: ${response.status}`);
      return texts;
    }
    
    const data = await response.json();
    
    // Map back translations to original array positions
    let translationIdx = 0;
    return texts.map(t => {
      if (!t || t.trim() === '') return t;
      return data.translations?.[translationIdx++]?.text || t;
    });
  } catch (error) {
    console.error('Translation error:', error.message);
    return texts;
  }
}

// Collect all texts from a quiz for batch translation
function collectQuizTexts(quiz) {
  const texts = [quiz.title, quiz.subtitle];
  for (const q of quiz.questions) {
    texts.push(q.text);
    for (const opt of q.options || []) {
      texts.push(opt);
    }
  }
  return texts;
}

// Distribute translated texts back to quiz structure
function distributeTranslatedTexts(quiz, translatedTexts) {
  let idx = 0;
  const translated = {
    title: translatedTexts[idx++],
    subtitle: translatedTexts[idx++],
    questions: []
  };
  
  for (const q of quiz.questions) {
    const translatedQ = {
      text: translatedTexts[idx++],
      options: []
    };
    for (const _ of q.options || []) {
      translatedQ.options.push(translatedTexts[idx++]);
    }
    translated.questions.push(translatedQ);
  }
  
  return translated;
}

// Quiz data based on TZ
const QUIZZES = [
  // 1. Інтернет-магазини - Meta
  {
    name: 'Інтернет-магазин без продажів — це зламаний таргет',
    slug: 'ecommerce-meta',
    platform: 'meta_ads',
    niche: 'ecommerce',
    image: '/quiz-images/ecommerce-bg.png',
    title: 'Інтернет-магазин без продажів — це зламаний таргет',
    subtitle: 'Запускаємо Meta рекламу для e-commerce з фокусом на продажі та окупність, а не охоплення',
    questions: [
      { text: 'Що зараз не працює в рекламі?', type: 'text_options', options: ['Продажів мало', 'Продажі нестабільні', 'Бюджет зливається', 'Результату немає'] },
      { text: 'Чи була реклама в Meta?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Формат продажів:', type: 'text_options', options: ['Власний сайт', 'Каталог / соцмережі', 'Маркетплейс'] },
      { text: 'Основна ціль:', type: 'text_options', options: ['Продажі', 'Масштаб', 'Стабільність'] }
    ]
  },
  // 2. Інтернет-магазини - Google
  {
    name: 'Google Ads для інтернет-магазину — не трафік, а продажі',
    slug: 'ecommerce-google',
    platform: 'google_ads',
    niche: 'ecommerce',
    image: '/quiz-images/ecommerce-bg.png',
    title: 'Google Ads для інтернет-магазину — не трафік, а продажі',
    subtitle: 'Налаштовуємо Search і Shopping рекламу з контролем окупності та реального результату',
    questions: [
      { text: 'Яка головна проблема зараз?', type: 'text_options', options: ['Немає продажів', 'Низька окупність', 'Дорогі заявки'] },
      { text: 'Які кампанії запускались?', type: 'text_options', options: ['Search', 'Shopping', 'Performance Max', 'Не запускались'] },
      { text: 'Чи є аналітика продажів?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ключова ціль:', type: 'text_options', options: ['Продажі', 'ROAS', 'Масштаб'] }
    ]
  },
  // 3. Ремонт квартир - Meta
  {
    name: 'Ремонт без заявок — значить реклама налаштована криво',
    slug: 'renovation-meta',
    platform: 'meta_ads',
    niche: 'renovation',
    image: '/quiz-images/renovation-bg.png',
    title: 'Ремонт без заявок — значить реклама налаштована криво',
    subtitle: 'Беремо Meta рекламу для ремонту квартир під контроль: заявки, стабільність, масштаб',
    questions: [
      { text: 'Основна проблема:', type: 'text_options', options: ['Мало заявок', 'Неякісні заявки', 'Дорога реклама'] },
      { text: 'Місто роботи:', type: 'custom_input', options: [] },
      { text: 'Чи була реклама в Meta?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ціль:', type: 'text_options', options: ['Більше заявок', 'Стабільний потік'] }
    ]
  },
  // 4. Ремонт квартир - Google
  {
    name: 'Google Ads для ремонту квартир — заявки з пошуку',
    slug: 'renovation-google',
    platform: 'google_ads',
    niche: 'renovation',
    image: '/quiz-images/renovation-bg.png',
    title: 'Google Ads для ремонту квартир — заявки з пошуку',
    subtitle: 'Налаштовуємо Google рекламу для ремонтних компаній з фокусом на реальних клієнтів',
    questions: [
      { text: 'Основна проблема з Google Ads:', type: 'text_options', options: ['Немає заявок', 'Дорогі кліки', 'Низька конверсія'] },
      { text: 'Які послуги рекламуєте?', type: 'custom_input', options: [] },
      { text: 'Чи є сайт?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Чи ведеться облік заявок?', type: 'text_options', options: ['Так', 'Ні'] }
    ]
  },
  // 5. Меблі - Meta
  {
    name: 'Меблева реклама без заявок — проблема не в ринку',
    slug: 'furniture-meta',
    platform: 'meta_ads',
    niche: 'furniture',
    image: '/quiz-images/furniture-bg.png',
    title: 'Меблева реклама без заявок — проблема не в ринку',
    subtitle: 'Запускаємо Meta Ads для меблевих компаній з фокусом на заявки',
    questions: [
      { text: 'Що не працює?', type: 'text_options', options: ['Мало заявок', 'Дорогі заявки', 'Немає продажів'] },
      { text: 'Тип меблів:', type: 'text_options', options: ['Корпусні меблі', "М'яка частина", 'Кухні', 'Офісні меблі', 'Інше'] },
      { text: 'Чи була реклама?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Потрібний результат:', type: 'text_options', options: ['Більше заявок', 'Якісніші заявки', 'Масштабування'] }
    ]
  },
  // 6. Меблі - Google
  {
    name: 'Google Ads для меблів — клієнти з пошуку',
    slug: 'furniture-google',
    platform: 'google_ads',
    niche: 'furniture',
    image: '/quiz-images/furniture-bg.png',
    title: 'Google Ads для меблів — клієнти з пошуку',
    subtitle: 'Беремо під контроль пошукову рекламу для меблевого бізнесу',
    questions: [
      { text: 'Проблема з Google Ads:', type: 'text_options', options: ['Немає заявок', 'Дорогі кліки', 'Низька конверсія'] },
      { text: 'Основні запити:', type: 'custom_input', options: [] },
      { text: 'Чи є сайт?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Аналітика:', type: 'text_options', options: ['Налаштована', 'Не налаштована'] }
    ]
  },
  // 7. Telegram - Meta
  {
    name: 'Telegram без результату — реклама ллється не туди',
    slug: 'telegram-meta',
    platform: 'meta_ads',
    niche: 'services',
    image: '/quiz-images/telegram-bg.png',
    title: 'Telegram без результату — реклама ллється не туди',
    subtitle: 'Запускаємо Meta рекламу для Telegram-проєктів з фокусом на живу аудиторію',
    questions: [
      { text: 'Основна проблема:', type: 'text_options', options: ['Мало підписників', 'Дорогий підписник', 'Неактивна аудиторія'] },
      { text: 'Тематика каналу:', type: 'custom_input', options: [] },
      { text: 'Чи була реклама?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ціль каналу:', type: 'text_options', options: ['Продажі', 'Монетизація', 'Охоплення'] }
    ]
  },
  // 8. Telegram - Google
  {
    name: 'Google Ads для Telegram — трафік з наміром',
    slug: 'telegram-google',
    platform: 'google_ads',
    niche: 'services',
    image: '/quiz-images/telegram-bg.png',
    title: 'Google Ads для Telegram — трафік з наміром',
    subtitle: 'Налаштовуємо пошукову рекламу під Telegram-воронки',
    questions: [
      { text: 'Гео:', type: 'custom_input', options: [] },
      { text: 'Проблема:', type: 'text_options', options: ['Мало трафіку', 'Дорогий клік', 'Низька конверсія'] },
      { text: 'Чи є лендинг?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ціль реклами:', type: 'text_options', options: ['Підписники', 'Продажі', 'Реєстрації'] }
    ]
  },
  // 9. Будівництво - Meta
  {
    name: 'Будівництво без заявок — реклама працює на конкурентів',
    slug: 'construction-meta',
    platform: 'meta_ads',
    niche: 'services',
    image: '/quiz-images/construction-bg.png',
    title: 'Будівництво без заявок — реклама працює на конкурентів',
    subtitle: 'Запускаємо Meta рекламу для будівельних компаній з фокусом на якісні заявки',
    questions: [
      { text: 'Основна проблема:', type: 'text_options', options: ['Мало заявок', 'Неякісні заявки', 'Дорога реклама'] },
      { text: 'Тип послуг:', type: 'text_options', options: ['Будівництво будинків', 'Комерційне будівництво', 'Ремонт', 'Інше'] },
      { text: 'Чи була реклама в Meta?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Бажаний результат:', type: 'text_options', options: ['Більше заявок', 'Якісніші ліди', 'Стабільний потік'] }
    ]
  },
  // 10. Будівництво - Google
  {
    name: 'Google Ads для будівництва — клієнти з пошуку',
    slug: 'construction-google',
    platform: 'google_ads',
    niche: 'services',
    image: '/quiz-images/construction-bg.png',
    title: 'Google Ads для будівництва — клієнти з пошуку',
    subtitle: 'Налаштовуємо Google рекламу для будівельних компаній з фокусом на реальних замовників',
    questions: [
      { text: 'Проблема з Google Ads:', type: 'text_options', options: ['Немає заявок', 'Дорогі кліки', 'Нецільовий трафік'] },
      { text: 'Регіон роботи:', type: 'custom_input', options: [] },
      { text: 'Чи є сайт?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ціль:', type: 'text_options', options: ['Заявки', 'Дзвінки', 'Консультації'] }
    ]
  },
  // 11. Доставка їжі - Meta
  {
    name: 'Доставка їжі без замовлень — таргет не працює',
    slug: 'food-delivery-meta',
    platform: 'meta_ads',
    niche: 'services',
    image: '/quiz-images/food-delivery-bg.png',
    title: 'Доставка їжі без замовлень — таргет не працює',
    subtitle: 'Запускаємо Meta рекламу для доставки їжі з фокусом на замовлення та повторні покупки',
    questions: [
      { text: 'Основна проблема:', type: 'text_options', options: ['Мало замовлень', 'Дорогі замовлення', 'Немає повторних'] },
      { text: 'Тип кухні:', type: 'text_options', options: ['Піца', 'Суші', 'Бургери', 'Здорове харчування', 'Інше'] },
      { text: 'Чи була реклама?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ціль:', type: 'text_options', options: ['Нові клієнти', 'Повторні замовлення', 'Масштаб'] }
    ]
  },
  // 12. Доставка їжі - Google
  {
    name: 'Google Ads для доставки їжі — замовлення з пошуку',
    slug: 'food-delivery-google',
    platform: 'google_ads',
    niche: 'services',
    image: '/quiz-images/food-delivery-bg.png',
    title: 'Google Ads для доставки їжі — замовлення з пошуку',
    subtitle: 'Налаштовуємо Google рекламу для доставки їжі з фокусом на конверсії',
    questions: [
      { text: 'Проблема:', type: 'text_options', options: ['Мало замовлень', 'Дорогий клік', 'Низька конверсія'] },
      { text: 'Місто доставки:', type: 'custom_input', options: [] },
      { text: 'Чи є сайт/додаток?', type: 'text_options', options: ['Сайт', 'Додаток', 'Обидва', 'Немає'] },
      { text: 'Ціль:', type: 'text_options', options: ['Замовлення', 'Встановлення додатку', 'Обидва'] }
    ]
  },
  // 13. B2B - Meta
  {
    name: 'B2B реклама без якісних заявок — злитий бюджет',
    slug: 'b2b-meta',
    platform: 'meta_ads',
    niche: 'services',
    image: '/quiz-images/b2b-bg.png',
    title: 'B2B реклама без якісних заявок — злитий бюджет',
    subtitle: 'Запускаємо Meta Ads для B2B з фокусом на ЛПР і угоди',
    questions: [
      { text: 'Основна проблема:', type: 'text_options', options: ['Мало заявок', 'Неякісні ліди', 'Довгий цикл угоди'] },
      { text: 'Сфера бізнесу:', type: 'custom_input', options: [] },
      { text: 'Чи була реклама в Meta?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ціль:', type: 'text_options', options: ['Заявки від ЛПР', 'Демо-дзвінки', 'Угоди'] }
    ]
  },
  // 14. B2B - Google
  {
    name: 'Google Ads для B2B — заявки від бізнесу',
    slug: 'b2b-google',
    platform: 'google_ads',
    niche: 'services',
    image: '/quiz-images/b2b-bg.png',
    title: 'Google Ads для B2B — заявки від бізнесу',
    subtitle: 'Беремо під контроль Google рекламу для B2B-компаній',
    questions: [
      { text: 'Проблема:', type: 'text_options', options: ['Немає заявок', 'Неякісні ліди', 'Дорогі кліки'] },
      { text: 'Продукт/послуга:', type: 'custom_input', options: [] },
      { text: 'Чи є сайт?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ціль:', type: 'text_options', options: ['Заявки', 'Дзвінки', 'Демо'] }
    ]
  },
  // 15. Загальний - Meta
  {
    name: 'Реклама без результату — проблема в налаштуванні',
    slug: 'general-meta',
    platform: 'meta_ads',
    niche: 'other',
    image: '/quiz-images/general-bg.png',
    title: 'Реклама без результату — проблема в налаштуванні',
    subtitle: 'Запускаємо Meta рекламу для вашого бізнесу з фокусом на реальний результат',
    questions: [
      { text: 'Основна проблема:', type: 'text_options', options: ['Мало заявок', 'Дорогі заявки', 'Немає продажів', 'Нестабільний результат'] },
      { text: 'Ваша ніша:', type: 'custom_input', options: [] },
      { text: 'Чи була реклама в Meta?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Бажаний результат:', type: 'text_options', options: ['Заявки', 'Продажі', 'Підписники', 'Охоплення'] }
    ]
  },
  // 16. Загальний - Google
  {
    name: 'Google Ads без результату — налаштуємо правильно',
    slug: 'general-google',
    platform: 'google_ads',
    niche: 'other',
    image: '/quiz-images/general-bg.png',
    title: 'Google Ads без результату — налаштуємо правильно',
    subtitle: 'Беремо під контроль Google рекламу для вашого бізнесу',
    questions: [
      { text: 'Проблема:', type: 'text_options', options: ['Немає заявок', 'Дорогі кліки', 'Низька конверсія', 'Нецільовий трафік'] },
      { text: 'Ваша ніша:', type: 'custom_input', options: [] },
      { text: 'Чи є сайт?', type: 'text_options', options: ['Так', 'Ні'] },
      { text: 'Ціль:', type: 'text_options', options: ['Заявки', 'Продажі', 'Дзвінки', 'Трафік'] }
    ]
  }
];

async function main() {
  console.log('🚀 Starting quiz seeding with batch translations...\n');
  
  // Parse database URL
  const dbUrl = process.env.DATABASE_URL;
  const config = parseDbUrl(dbUrl);
  
  if (!config) {
    console.error('❌ Invalid DATABASE_URL');
    process.exit(1);
  }
  
  console.log(`📦 Connecting to database: ${config.host}/${config.database}`);
  
  const connection = await mysql.createConnection(config);
  
  try {
    // Clear existing quizzes
    console.log('🗑️ Clearing existing quizzes...');
    await connection.execute('DELETE FROM quiz_answer_options');
    await connection.execute('DELETE FROM quiz_questions');
    await connection.execute('DELETE FROM quiz_design_settings');
    await connection.execute('DELETE FROM quizzes');
    
    console.log(`\n📝 Creating ${QUIZZES.length} quizzes with translations...\n`);
    
    // First, collect ALL texts from ALL quizzes for batch translation
    console.log('📚 Collecting all texts for batch translation...');
    const allTexts = [];
    const quizTextRanges = []; // Track which texts belong to which quiz
    
    for (const quiz of QUIZZES) {
      const startIdx = allTexts.length;
      const texts = collectQuizTexts(quiz);
      allTexts.push(...texts);
      quizTextRanges.push({ start: startIdx, end: allTexts.length, count: texts.length });
    }
    
    console.log(`  Total texts to translate: ${allTexts.length}`);
    
    // Translate all texts in batches for each language
    const translations = { uk: allTexts };
    
    for (const lang of ['ru', 'en', 'pl', 'de']) {
      console.log(`\n🌐 Translating to ${lang.toUpperCase()}...`);
      
      // Split into batches of 50 to avoid rate limits
      const batchSize = 50;
      const translatedTexts = [];
      
      for (let i = 0; i < allTexts.length; i += batchSize) {
        const batch = allTexts.slice(i, i + batchSize);
        console.log(`  Batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(allTexts.length/batchSize)}...`);
        
        const translated = await translateBatch(batch, lang);
        translatedTexts.push(...translated);
        
        // Wait between batches to avoid rate limits
        if (i + batchSize < allTexts.length) {
          await sleep(1000);
        }
      }
      
      translations[lang] = translatedTexts;
    }
    
    console.log('\n✅ All translations complete!\n');
    
    // Now create quizzes with translated content
    for (let i = 0; i < QUIZZES.length; i++) {
      const quiz = QUIZZES[i];
      const range = quizTextRanges[i];
      
      console.log(`[${i + 1}/${QUIZZES.length}] ${quiz.name}`);
      
      // Extract translated texts for this quiz
      const quizTranslations = {};
      for (const lang of ['uk', 'ru', 'en', 'pl', 'de']) {
        const langTexts = translations[lang].slice(range.start, range.end);
        quizTranslations[lang] = distributeTranslatedTexts(quiz, langTexts);
      }
      
      // Create translations JSON
      const titleTranslations = JSON.stringify({
        uk: quizTranslations.uk.title,
        ru: quizTranslations.ru.title,
        en: quizTranslations.en.title,
        pl: quizTranslations.pl.title,
        de: quizTranslations.de.title
      });
      
      const subtitleTranslations = JSON.stringify({
        uk: quizTranslations.uk.subtitle,
        ru: quizTranslations.ru.subtitle,
        en: quizTranslations.en.subtitle,
        pl: quizTranslations.pl.subtitle,
        de: quizTranslations.de.subtitle
      });
      
      // Insert quiz
      const [quizResult] = await connection.execute(
        `INSERT INTO quizzes (name, slug, description, quizType, platform, niche, isActive, createdBy) 
         VALUES (?, ?, ?, 'lead_generation', ?, ?, 1, 1)`,
        [quiz.name, quiz.slug, quiz.subtitle, quiz.platform, quiz.niche]
      );
      
      const quizId = quizResult.insertId;
      
      // Insert design settings with translations
      await connection.execute(
        `INSERT INTO quiz_design_settings 
         (quizId, layoutType, backgroundImage, alignment, primaryColor, accentColor, fontFamily, titleText, subtitleText, buttonText, bonusEnabled) 
         VALUES (?, 'split', ?, 'left', '#FACC15', '#A855F7', 'Inter', ?, ?, 'Отримати консультацію', 0)`,
        [quizId, quiz.image, titleTranslations, subtitleTranslations]
      );
      
      // Insert questions
      for (let qIdx = 0; qIdx < quiz.questions.length; qIdx++) {
        const q = quiz.questions[qIdx];
        
        // Create question text translations
        const questionTranslations = JSON.stringify({
          uk: quizTranslations.uk.questions[qIdx]?.text || q.text,
          ru: quizTranslations.ru.questions[qIdx]?.text || q.text,
          en: quizTranslations.en.questions[qIdx]?.text || q.text,
          pl: quizTranslations.pl.questions[qIdx]?.text || q.text,
          de: quizTranslations.de.questions[qIdx]?.text || q.text
        });
        
        // Create options translations
        let optionsTranslations = null;
        if (q.options && q.options.length > 0) {
          const optionsArray = q.options.map((opt, optIdx) => ({
            uk: opt,
            ru: quizTranslations.ru.questions[qIdx]?.options[optIdx] || opt,
            en: quizTranslations.en.questions[qIdx]?.options[optIdx] || opt,
            pl: quizTranslations.pl.questions[qIdx]?.options[optIdx] || opt,
            de: quizTranslations.de.questions[qIdx]?.options[optIdx] || opt
          }));
          optionsTranslations = JSON.stringify(optionsArray);
        }
        
        await connection.execute(
          `INSERT INTO quiz_questions 
           (quizId, questionText, questionType, answerOptions, orderIndex, isRequired) 
           VALUES (?, ?, ?, ?, ?, 1)`,
          [quizId, questionTranslations, q.type, optionsTranslations, qIdx]
        );
      }
      
      console.log(`  ✅ Created with ${quiz.questions.length} questions`);
    }
    
    console.log('\n🎉 All quizzes created successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
