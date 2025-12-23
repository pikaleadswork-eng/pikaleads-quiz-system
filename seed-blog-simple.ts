import { getDb } from "./server/db";
import * as schema from "./drizzle/schema";

const samplePosts = [
  {
    title: "Андромеда: Новий алгоритм Meta Ads 2025",
    slug: "andromeda-meta-ads-2025",
    excerpt: "Meta запустила революційний алгоритм Андромеда, який змінює правила гри в таргетованій рекламі. Розбираємо ключові зміни та як адаптувати свої кампанії.",
    content: `<h2>Що таке Андромеда?</h2><p>Андромеда — це новий алгоритм машинного навчання від Meta, який замінює попередню систему оптимізації реклами. Він використовує передові технології AI для кращого прогнозування конверсій.</p><h2>Ключові зміни</h2><ul><li>Автоматична оптимізація бюджету на рівні кампанії</li><li>Розширений таргетинг на основі поведінки користувачів</li><li>Швидша адаптація до змін в аудиторії</li></ul><h2>Як адаптувати кампанії?</h2><p>Щоб отримати максимум від Андромеди, рекомендуємо:</p><ol><li>Збільшити бюджет тестування на 20-30%</li><li>Дати алгоритму мінімум 7 днів на навчання</li><li>Використовувати широкий таргетинг замість вузького</li></ol>`,
    coverImage: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800",
    categoryId: null,
    status: "published" as const,
    authorId: 1,
  },
  {
    title: "Meta API: Повний гайд по інтеграції 2025",
    slug: "meta-api-integration-guide-2025",
    excerpt: "Детальна інструкція з інтеграції Meta Marketing API для автоматизації рекламних кампаній. Від створення додатку до першого запиту.",
    content: `<h2>Навіщо потрібна Meta API?</h2><p>Meta Marketing API дозволяє автоматизувати управління рекламними кампаніями, отримувати детальну аналітику та масштабувати процеси.</p><h2>Крок 1: Створення додатку</h2><p>Перейдіть в Facebook Developers Console та створіть новий додаток типу "Business".</p><h2>Крок 2: Налаштування доступу</h2><p>Отримайте Access Token з правами ads_management та ads_read.</p><h2>Приклад запиту</h2><pre><code>curl -X GET "https://graph.facebook.com/v18.0/act_123456789/campaigns" -H "Authorization: Bearer YOUR_ACCESS_TOKEN"</code></pre>`,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    categoryId: null,
    status: "published" as const,
    authorId: 1,
  },
  {
    title: "Google Analytics 4: Налаштування для e-commerce",
    slug: "google-analytics-4-ecommerce-setup",
    excerpt: "GA4 кардинально відрізняється від Universal Analytics. Покрокова інструкція з налаштування відстеження для інтернет-магазинів.",
    content: `<h2>Чому GA4?</h2><p>Google Analytics 4 — це майбутнє веб-аналітики. Universal Analytics припинив роботу в 2023 році, тому міграція на GA4 обов'язкова.</p><h2>Налаштування e-commerce подій</h2><p>GA4 використовує event-based модель замість pageview. Основні події для e-commerce:</p><ul><li>view_item — перегляд товару</li><li>add_to_cart — додавання в кошик</li><li>begin_checkout — початок оформлення</li><li>purchase — покупка</li></ul><h2>Інтеграція з GTM</h2><p>Використовуйте Google Tag Manager для спрощення налаштування. Створіть Data Layer змінні для передачі даних про товари.</p>`,
    coverImage: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800",
    categoryId: null,
    status: "published" as const,
    authorId: 1,
  },
  {
    title: "TikTok Ads: Як отримати CPM $2 в Україні",
    slug: "tiktok-ads-low-cpm-ukraine",
    excerpt: "TikTok Ads в Україні все ще недооцінений канал. Ділимося стратегією, як отримати CPM $2 та залучити якісну аудиторію.",
    content: `<h2>Чому TikTok Ads?</h2><p>TikTok має найнижчий CPM серед всіх соціальних мереж в Україні. При правильному підході можна отримати CPM $1.5-$3.</p><h2>Секрети низького CPM</h2><ol><li><strong>Креативи в стилі UGC</strong> — знімайте на телефон, без монтажу</li><li><strong>Перші 3 секунди</strong> — зачіпка має бути миттєвою</li><li><strong>Таргетинг на інтереси</strong> — уникайте lookalike на старті</li></ol><h2>Структура кампанії</h2><p>Створіть 3-5 креативів, запустіть з бюджетом $10/день на кожен. Через 3 дні вимкніть неефективні та масштабуйте переможців.</p>`,
    coverImage: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800",
    categoryId: null,
    status: "published" as const,
    authorId: 1,
  },
];

async function seed() {
  console.log("Seeding blog posts...");
  const db = await getDb();
  if (!db) {
    console.error("Database not available");
    process.exit(1);
  }
  
  for (const post of samplePosts) {
    const [result] = await db.insert(schema.blogPosts).values({
      ...post,
      publishedAt: new Date(),
    });
    console.log(`Created post: ${post.title}`);
  }
  
  console.log("Blog seeding complete!");
  process.exit(0);
}

seed().catch((error) => {
  console.error("Seeding failed:", error);
  process.exit(1);
});
