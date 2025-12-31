// Generate sitemap.xml for PIKALEADS Lead Engine
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'https://pikaleadsquiz-eccrelaa.manus.space';

// Static pages
const staticPages = [
  { url: '/', priority: '1.0', changefreq: 'daily' },
  { url: '/privacy', priority: '0.3', changefreq: 'monthly' },
  { url: '/contact', priority: '0.5', changefreq: 'monthly' },
  { url: '/thank-you', priority: '0.3', changefreq: 'monthly' },
];

// Quiz pages (will be fetched from database in production)
const quizPages = [
  // META ADS Quizzes
  { url: '/quiz/ecommerce-meta', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/renovation-meta', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/furniture-meta', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/telegram-meta', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/construction-meta', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/food-delivery-meta', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/b2b-meta', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/general-meta', priority: '0.9', changefreq: 'weekly' },
  
  // GOOGLE ADS Quizzes
  { url: '/quiz/ecommerce-google', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/renovation-google', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/furniture-google', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/telegram-google', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/construction-google', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/food-delivery-google', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/b2b-google', priority: '0.9', changefreq: 'weekly' },
  { url: '/quiz/general-google', priority: '0.9', changefreq: 'weekly' },
];

const allPages = [...staticPages, ...quizPages];

const generateSitemap = () => {
  const lastmod = new Date().toISOString().split('T')[0];
  
  const urls = allPages.map(page => `
  <url>
    <loc>${BASE_URL}${page.url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`).join('');

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

  const outputPath = path.join(__dirname, '../client/public/sitemap.xml');
  fs.writeFileSync(outputPath, sitemap, 'utf-8');
  console.log(`✅ Sitemap generated successfully at ${outputPath}`);
  console.log(`📄 Total URLs: ${allPages.length}`);
};

generateSitemap();
