import mysql from 'mysql2/promise';

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

const caseStudies = [
  {
    title: "Збільшення продажів меблів на 350% через Meta Ads",
    slug: "furniture-meta-ads-350-increase",
    client: "Меблева фабрика 'Comfort Home'",
    industry: "Меблі та інтер'єр",
    description: "Як ми допомогли меблевій компанії збільшити онлайн-продажі на 350% за 3 місяці використовуючи таргетовану рекламу в Facebook та Instagram.",
    content: `
<h2>Про клієнта</h2>
<p>Меблева фабрика 'Comfort Home' - виробник якісних меблів з 15-річним досвідом. До початку співпраці компанія мала проблеми з онлайн-продажами та залежала виключно від офлайн-каналів.</p>

<h2>Виклик</h2>
<ul>
  <li>Низька впізнаваність бренду в онлайні</li>
  <li>Відсутність системного підходу до digital-маркетингу</li>
  <li>Високий CPL (вартість ліда) - $15-20</li>
  <li>Низька конверсія сайту - 0.8%</li>
</ul>

<h2>Рішення</h2>
<p>Ми розробили комплексну стратегію, яка включала:</p>
<ul>
  <li><strong>Створення квізу для підбору меблів</strong> - інтерактивний інструмент, який допомагає клієнтам обрати ідеальні меблі</li>
  <li><strong>Сегментація аудиторії</strong> - 12 різних сегментів за інтересами та поведінкою</li>
  <li><strong>Динамічні креативи</strong> - автоматична генерація оголошень під кожен сегмент</li>
  <li><strong>Ретаргетинг</strong> - багаторівнева воронка повернення клієнтів</li>
</ul>

<h2>Результати</h2>
<div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">+350%</div>
      <div style="color: #9ca3af;">Зростання продажів</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">$4.2</div>
      <div style="color: #9ca3af;">CPL (було $18)</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">6.8x</div>
      <div style="color: #9ca3af;">ROAS</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">1,247</div>
      <div style="color: #9ca3af;">Лідів за 3 місяці</div>
    </div>
  </div>
</div>

<h2>Ключові інсайти</h2>
<p>Використання квізу збільшило конверсію на 280% порівняно зі звичайними лендінгами. Клієнти, які проходили квіз, мали на 45% вищий середній чек.</p>
`,
    coverImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop",
    results: JSON.stringify({
      roi: "350%",
      leads: "1,247",
      roas: "6.8x",
      cpl: "$4.2"
    }),
    tags: JSON.stringify(["Meta Ads", "Меблі", "Квіз", "E-commerce"]),
    isPublished: true,
    orderIndex: 1,
  },
  {
    title: "ROAS 8.5x для інтернет-магазину одягу через Google Ads",
    slug: "fashion-google-ads-roas-85x",
    client: "Fashion Boutique 'Style Avenue'",
    industry: "Мода та одяг",
    description: "Як ми досягли ROAS 8.5x для інтернет-магазину жіночого одягу використовуючи Google Shopping та Performance Max кампанії.",
    content: `
<h2>Про клієнта</h2>
<p>Style Avenue - інтернет-магазин жіночого одягу преміум-сегменту з асортиментом 500+ позицій. Компанія працювала з Google Ads, але результати були нестабільними.</p>

<h2>Виклик</h2>
<ul>
  <li>Нестабільний ROAS - коливання від 2x до 4x</li>
  <li>Висока вартість конверсії - $45</li>
  <li>Низька ефективність Shopping кампаній</li>
  <li>Відсутність аналітики та відстеження</li>
</ul>

<h2>Рішення</h2>
<p>Ми впровадили:</p>
<ul>
  <li><strong>Performance Max кампанії</strong> з динамічними фідами</li>
  <li><strong>Розширене відстеження</strong> - GA4 + серверний GTM</li>
  <li><strong>Сегментація продуктів</strong> - 8 груп за маржинальністю та попитом</li>
  <li><strong>Автоматизація ставок</strong> - Smart Bidding з урахуванням LTV</li>
  <li><strong>Ретаргетинг</strong> - персоналізовані оголошення на основі переглянутих товарів</li>
</ul>

<h2>Результати</h2>
<div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">8.5x</div>
      <div style="color: #9ca3af;">ROAS</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">$18</div>
      <div style="color: #9ca3af;">Вартість конверсії</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">+420%</div>
      <div style="color: #9ca3af;">Зростання доходу</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">2,850</div>
      <div style="color: #9ca3af;">Замовлень</div>
    </div>
  </div>
</div>

<h2>Ключові інсайти</h2>
<p>Performance Max показав на 65% кращі результати порівняно зі стандартними Shopping кампаніями. Впровадження серверного GTM покращило точність відстеження на 35%.</p>
`,
    coverImage: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop",
    results: JSON.stringify({
      roi: "420%",
      leads: "2,850",
      roas: "8.5x",
      cpl: "$18"
    }),
    tags: JSON.stringify(["Google Ads", "E-commerce", "Performance Max", "Fashion"]),
    isPublished: true,
    orderIndex: 2,
  },
  {
    title: "Генерація 3,500+ лідів для ремонтної компанії через TikTok Ads",
    slug: "renovation-tiktok-ads-3500-leads",
    client: "Ремонтна компанія 'Perfect Renovation'",
    industry: "Ремонт та будівництво",
    description: "Як ми згенерували 3,500+ якісних лідів для ремонтної компанії використовуючи TikTok Ads та інтерактивні квізи.",
    content: `
<h2>Про клієнта</h2>
<p>Perfect Renovation - компанія з ремонту квартир та будинків, яка працює в Києві та області. До співпраці компанія використовувала лише Facebook Ads з середніми результатами.</p>

<h2>Виклик</h2>
<ul>
  <li>Насичення аудиторії в Facebook</li>
  <li>Високий CPL - $12-15</li>
  <li>Низька якість лідів - конверсія в угоди 8%</li>
  <li>Потреба в нових каналах залучення</li>
</ul>

<h2>Рішення</h2>
<p>Ми запустили TikTok Ads з фокусом на:</p>
<ul>
  <li><strong>Відео-контент</strong> - 20+ креативів з прикладами робіт</li>
  <li><strong>Квіз для розрахунку вартості</strong> - інтерактивний калькулятор ремонту</li>
  <li><strong>Таргетинг на власників нерухомості</strong> - 25-45 років</li>
  <li><strong>Spark Ads</strong> - використання органічного контенту в рекламі</li>
  <li><strong>Ретаргетинг</strong> - повернення незавершених квізів</li>
</ul>

<h2>Результати</h2>
<div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">3,547</div>
      <div style="color: #9ca3af;">Лідів за 4 місяці</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">$2.8</div>
      <div style="color: #9ca3af;">CPL</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">18%</div>
      <div style="color: #9ca3af;">Конверсія в угоди</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">5.2x</div>
      <div style="color: #9ca3af;">ROAS</div>
    </div>
  </div>
</div>

<h2>Ключові інсайти</h2>
<p>TikTok показав на 75% нижчий CPL порівняно з Facebook. Квіз збільшив якість лідів - конверсія в угоди зросла з 8% до 18%. Spark Ads показали на 40% кращі результати за звичайні оголошення.</p>
`,
    coverImage: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=800&h=600&fit=crop",
    results: JSON.stringify({
      roi: "420%",
      leads: "3,547",
      roas: "5.2x",
      cpl: "$2.8"
    }),
    tags: JSON.stringify(["TikTok Ads", "Ремонт", "Квіз", "Lead Generation"]),
    isPublished: true,
    orderIndex: 3,
  },
  {
    title: "ROI 580% для B2B SaaS компанії через LinkedIn Ads",
    slug: "b2b-saas-linkedin-ads-roi-580",
    client: "SaaS платформа 'BusinessHub'",
    industry: "B2B SaaS",
    description: "Як ми досягли ROI 580% для B2B SaaS компанії використовуючи LinkedIn Ads та ABM (Account-Based Marketing) стратегію.",
    content: `
<h2>Про клієнта</h2>
<p>BusinessHub - SaaS платформа для управління бізнес-процесами малого та середнього бізнесу. Середній чек - $2,500/рік. Компанія шукала ефективні канали для залучення B2B клієнтів.</p>

<h2>Виклик</h2>
<ul>
  <li>Висока вартість ліда в B2B - $150-200</li>
  <li>Довгий цикл угоди - 3-6 місяців</li>
  <li>Складність таргетингу на decision makers</li>
  <li>Низька конверсія з ліда в клієнта - 5%</li>
</ul>

<h2>Рішення</h2>
<p>Ми впровадили ABM стратегію:</p>
<ul>
  <li><strong>LinkedIn Ads</strong> з таргетингом на CEO, CFO, COO</li>
  <li><strong>Lead Gen Forms</strong> - нативні форми LinkedIn</li>
  <li><strong>Контент-маркетинг</strong> - whitepaper, кейси, вебінари</li>
  <li><strong>Ретаргетинг</strong> - багаторівнева воронка прогріву</li>
  <li><strong>Інтеграція з CRM</strong> - автоматизація lead nurturing</li>
</ul>

<h2>Результати</h2>
<div style="background: #1a1a1a; padding: 20px; border-radius: 8px; margin: 20px 0;">
  <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px;">
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">580%</div>
      <div style="color: #9ca3af;">ROI</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">$85</div>
      <div style="color: #9ca3af;">CPL</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">18%</div>
      <div style="color: #9ca3af;">Конверсія в клієнти</div>
    </div>
    <div>
      <div style="color: #fbbf24; font-size: 32px; font-weight: bold;">247</div>
      <div style="color: #9ca3af;">Якісних лідів</div>
    </div>
  </div>
</div>

<h2>Ключові інсайти</h2>
<p>LinkedIn Lead Gen Forms показали на 60% вищу конверсію порівняно з лендінгами. Контент-маркетинг скоротив цикл угоди з 4.5 до 2.8 місяців. ABM підхід збільшив конверсію з ліда в клієнта з 5% до 18%.</p>
`,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop",
    results: JSON.stringify({
      roi: "580%",
      leads: "247",
      roas: "6.8x",
      cpl: "$85"
    }),
    tags: JSON.stringify(["LinkedIn Ads", "B2B", "SaaS", "ABM"]),
    isPublished: true,
    orderIndex: 4,
  },
];

async function seedCaseStudies() {
  let connection;
  try {
    connection = await mysql.createConnection(DATABASE_URL);
    console.log('Connected to database');

    for (const caseStudy of caseStudies) {
      const [result] = await connection.execute(
        `INSERT INTO case_studies 
        (title, slug, client, industry, description, content, coverImage, results, tags, isPublished, orderIndex, publishedAt, createdBy, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 1, NOW(), NOW())
        ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        client = VALUES(client),
        industry = VALUES(industry),
        description = VALUES(description),
        content = VALUES(content),
        coverImage = VALUES(coverImage),
        results = VALUES(results),
        tags = VALUES(tags),
        isPublished = VALUES(isPublished),
        orderIndex = VALUES(orderIndex),
        updatedAt = NOW()`,
        [
          caseStudy.title,
          caseStudy.slug,
          caseStudy.client,
          caseStudy.industry,
          caseStudy.description,
          caseStudy.content,
          caseStudy.coverImage,
          caseStudy.results,
          caseStudy.tags,
          caseStudy.isPublished,
          caseStudy.orderIndex,
        ]
      );
      console.log(`✓ Seeded case study: ${caseStudy.title}`);
    }

    console.log('\n✅ All case studies seeded successfully!');
  } catch (error) {
    console.error('Error seeding case studies:', error);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedCaseStudies();
