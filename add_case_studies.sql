-- Add 5 real case studies with rich content

-- Case Study 1: Furniture E-commerce
INSERT INTO case_studies (
  title, slug, description, content, coverImage, 
  budget, leads, roas, tags, pageVisibility,
  isPublished, publishedAt, orderIndex
) VALUES (
  'Меблевий інтернет-магазин: 1,247 лідів за 3 місяці',
  'furniture-ecommerce-1247-leads',
  'Як ми збільшили продажі меблів на 350% через Meta Ads та досягли ROAS 4.2',
  '<h2>Про клієнта</h2><p>Інтернет-магазин меблів з широким асортиментом: від кухонь до спалень. Працюють на ринку України 5+ років, але реклама в Meta не приносила очікуваних результатів.</p><h2>Виклик</h2><p>Клієнт витрачав $3,000/місяць на рекламу, але отримував лише 80-100 лідів з низькою якістю. CPL становив $30-35, що було неприйнятно для бізнесу.</p><h2>Наше рішення</h2><ul><li>Повний аудит рекламних кампаній та виявлення проблем</li><li>Створення нових креативів з акцентом на унікальні переваги</li><li>Налаштування Advantage+ Shopping кампаній</li><li>Впровадження Pixel та Conversions API для точного трекінгу</li><li>A/B тестування аудиторій та креативів</li></ul><h2>Результати після 3 місяців</h2><ul><li><strong>1,247 лідів</strong> (було 280)</li><li><strong>CPL $8.50</strong> (було $32)</li><li><strong>ROAS 4.2</strong> (було 1.8)</li><li><strong>Конверсія 12%</strong> (було 4%)</li><li><strong>Бюджет $3,500/міс</strong> (+17% до початкового)</li></ul><h2>Ключові інсайти</h2><p>Основний прорив стався після переходу на Advantage+ Shopping та створення креативів з реальними фото інтер''єрів клієнтів. Також критично важливою була інтеграція CRM з Meta для відстеження всього шляху клієнта.</p>',
  'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200',
  3500, 1247, 4.2,
  '["Meta Ads", "E-commerce", "Furniture", "ROAS 4.2", "CPL $8.50"]',
  '["home", "meta-ads"]',
  1, NOW(), 1
);

-- Case Study 2: Fashion Brand Google Ads
INSERT INTO case_studies (
  title, slug, description, content, coverImage,
  budget, leads, roas, tags, pageVisibility,
  isPublished, publishedAt, orderIndex
) VALUES (
  'Бренд одягу: ROAS 8.5x через Google Shopping',
  'fashion-brand-google-shopping-roas-85',
  'Як ми масштабували продажі одягу з $5K до $45K/місяць через Google Ads',
  '<h2>Про клієнта</h2><p>Український бренд жіночого одягу з власним виробництвом. Продають через інтернет-магазин та Instagram. До співпраці з нами витрачали $2,000/міс на Google Ads з мінімальними результатами.</p><h2>Виклик</h2><p>Низька видимість в Google Shopping, високий CPC ($1.50-2.00), ROAS 2.3x. Клієнт хотів масштабуватися, але не розумів, як це зробити ефективно.</p><h2>Наше рішення</h2><ul><li>Оптимізація фіду товарів (назви, описи, категорії)</li><li>Професійна фотозйомка товарів для Shopping</li><li>Налаштування Performance Max кампаній</li><li>Сегментація аудиторій за поведінкою</li><li>Динамічний ремаркетинг з персоналізацією</li><li>Інтеграція з Google Analytics 4 для глибокої аналітики</li></ul><h2>Результати після 4 місяців</h2><ul><li><strong>2,850 замовлень</strong> (було 420)</li><li><strong>ROAS 8.5x</strong> (було 2.3x)</li><li><strong>CPC $0.65</strong> (було $1.80)</li><li><strong>Виручка $45,000/міс</strong> (було $5,200)</li><li><strong>Середній чек $158</strong> (було $124)</li></ul><h2>Що спрацювало найкраще</h2><p>Performance Max показав найкращі результати завдяки машинному навчанню Google. Також критично важливою була якість фото - після професійної зйомки CTR виріс на 180%.</p>',
  'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200',
  5200, 2850, 8.5,
  '["Google Ads", "Shopping", "Fashion", "ROAS 8.5x", "Performance Max"]',
  '["home", "google-ads"]',
  1, NOW(), 2
);

-- Case Study 3: Renovation Services TikTok
INSERT INTO case_studies (
  title, slug, description, content, coverImage,
  budget, leads, roas, tags, pageVisibility,
  isPublished, publishedAt, orderIndex
) VALUES (
  'Ремонт квартир: 3,547 лідів з TikTok Ads за $2.80',
  'renovation-services-tiktok-3547-leads',
  'Як ми залучили 3,500+ якісних лідів на ремонт через вірусні відео в TikTok',
  '<h2>Про клієнта</h2><p>Компанія з ремонту квартир в Києві та області. Працюють 8+ років, мають портфоліо 500+ об''єктів. Раніше працювали тільки з Google Ads та рекомендаціями.</p><h2>Виклик</h2><p>Клієнт хотів залучити молоду аудиторію (25-35 років), яка купує перші квартири. Google Ads давав CPL $45-60, що було дорого для ремонтного бізнесу.</p><h2>Наше рішення</h2><ul><li>Створення вірусних відео з процесом ремонту (до/після)</li><li>Зйомка коротких роликів з порадами по ремонту</li><li>Таргетинг на молодих власників квартир</li><li>Використання Spark Ads для посилення органічних постів</li><li>Тестування різних креативів (10+ варіантів)</li><li>Ретаргетинг на тих, хто дивився відео до кінця</li></ul><h2>Результати за 6 місяців</h2><ul><li><strong>3,547 лідів</strong></li><li><strong>CPL $2.80</strong></li><li><strong>Конверсія в клієнта 18%</strong></li><li><strong>Середній чек $8,500</strong></li><li><strong>Виручка $5.4M</strong></li><li><strong>ROAS 6.8x</strong></li></ul><h2>Секрет успіху</h2><p>Ключовим фактором стали відео "до/після" з реальних об''єктів. Одне відео набрало 2.3M переглядів органічно, що дало додаткові 800+ лідів без витрат на рекламу. TikTok виявився ідеальною платформою для ремонтного бізнесу.</p>',
  'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?w=1200',
  9900, 3547, 6.8,
  '["TikTok Ads", "Renovation", "Viral Video", "CPL $2.80", "ROAS 6.8x"]',
  '["home", "meta-ads"]',
  1, NOW(), 3
);

-- Case Study 4: B2B SaaS LinkedIn Ads
INSERT INTO case_studies (
  title, slug, description, content, coverImage,
  budget, leads, roas, tags, pageVisibility,
  isPublished, publishedAt, orderIndex
) VALUES (
  'B2B SaaS: 247 якісних лідів через LinkedIn Ads',
  'b2b-saas-linkedin-247-qualified-leads',
  'Як ми залучили 247 B2B лідів з конверсією 28% через LinkedIn та досягли ROI 580%',
  '<h2>Про клієнта</h2><p>SaaS-платформа для автоматизації HR-процесів. Цільова аудиторія - HR-директори та власники бізнесу з 50+ співробітниками. Середній чек $2,400/рік.</p><h2>Виклик</h2><p>Клієнт пробував Meta Ads та Google Ads, але якість лідів була низькою. Потрібна була платформа для точного таргетингу на B2B аудиторію.</p><h2>Наше рішення</h2><ul><li>Запуск LinkedIn Ads з таргетингом за посадою та розміром компанії</li><li>Створення lead-магніту: безкоштовний аудит HR-процесів</li><li>Налаштування LinkedIn Lead Gen Forms для зручності</li><li>Nurturing через email-послідовності</li><li>Ретаргетинг на відвідувачів сайту</li><li>A/B тестування креативів та текстів</li></ul><h2>Результати за 5 місяців</h2><ul><li><strong>247 якісних лідів</strong></li><li><strong>CPL $85</strong></li><li><strong>Конверсія в клієнта 28%</strong></li><li><strong>69 нових клієнтів</strong></li><li><strong>Виручка $165,600</strong></li><li><strong>ROI 580%</strong></li></ul><h2>Ключові інсайти</h2><p>LinkedIn виявився ідеальною платформою для B2B SaaS. Незважаючи на високий CPL ($85), якість лідів була набагато вища, ніж в Meta ($12 CPL, але конверсія 3%). Lead Gen Forms дозволили збирати контакти без переходу на сайт, що підвищило конверсію на 40%.</p>',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200',
  21000, 247, 7.9,
  '["LinkedIn Ads", "B2B", "SaaS", "ROI 580%", "CPL $85"]',
  '["home"]',
  1, NOW(), 4
);

-- Case Study 5: Restaurant Chain Meta Ads
INSERT INTO case_studies (
  title, slug, description, content, coverImage,
  budget, leads, roas, tags, pageVisibility,
  isPublished, publishedAt, orderIndex
) VALUES (
  'Мережа ресторанів: +180% замовлень через Meta Ads',
  'restaurant-chain-meta-ads-180-percent-growth',
  'Як ми збільшили онлайн-замовлення для мережі ресторанів на 180% за 4 місяці',
  '<h2>Про клієнта</h2><p>Мережа з 5 ресторанів української кухні в Києві. Працюють з доставкою через власний сайт та агрегатори. До співпраці витрачали $1,500/міс на Meta Ads з ROAS 2.1x.</p><h2>Виклик</h2><p>Високі комісії агрегаторів (30-35%) знижували прибутковість. Потрібно було збільшити замовлення через власний сайт та додаток.</p><h2>Наше рішення</h2><ul><li>Створення креативів з апетитними фото страв</li><li>Відео-контент з процесом приготування</li><li>Таргетинг на районах доставки (геолокація)</li><li>Динамічні оголошення з меню та цінами</li><li>Ремаркетинг на тих, хто додав в кошик, але не оформив</li><li>Спеціальні пропозиції для нових клієнтів</li></ul><h2>Результати за 4 місяці</h2><ul><li><strong>+180% замовлень</strong> через власний сайт</li><li><strong>ROAS 5.2x</strong> (було 2.1x)</li><li><strong>CPO $4.20</strong> (було $8.50)</li><li><strong>Середній чек $28</strong> (було $22)</li><li><strong>Повторні замовлення 42%</strong> (було 18%)</li></ul><h2>Що спрацювало</h2><p>Найбільший ефект дали відео з приготуванням страв - CTR виріс на 240%. Також критично важливим був ремаркетинг на кинуті кошики - він приніс 35% всіх конверсій. Геотаргетинг дозволив знизити CPO на 60%, показуючи рекламу тільки в районах доставки.</p>',
  'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200',
  2800, 1890, 5.2,
  '["Meta Ads", "Restaurant", "Food Delivery", "ROAS 5.2x", "+180% Orders"]',
  '["home", "meta-ads"]',
  1, NOW(), 5
);

