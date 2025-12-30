import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection, { schema, mode: 'default' });

const cases = [
  {
    title: 'E-com в Україні в ніші Продаж люстр та світильників',
    slug: 'e-com-v-ukraini-prodazh-lyustr',
    client: 'Інтернет-магазин світильників',
    industry: 'E-commerce',
    description: 'Кейс в ніші світильників та люстр з детальними показниками та механікою роботи.',
    content: '# E-com в Україні\n\nУспішний запуск e-commerce проєкту в ніші освітлення з ефективною таргетованою рекламою.',
    results: '{"industry": "E-commerce", "platform": "Facebook Ads"}',
    tags: '["Meta Ads", "E-commerce"]',
    pageVisibility: '["home", "facebook-ads"]',
    author: 'Roman Hrybuk',
    isPublished: true,
    orderIndex: 1,
    createdBy: 1
  },
  {
    title: 'BIG - Бюджет 1.8 млн доларів',
    slug: 'big-byudzhet-1-8-mln',
    client: 'Американський E-commerce',
    industry: 'E-commerce',
    description: 'Досвід роботи з великим бюджетом на американському ринку в 4-му кварталі.',
    content: '# BIG Budget Case\n\nROAS 2.67, 400+ покупок на день, бюджет 1,890,561 USD.',
    results: '{"budget": "1,890,561$", "roas": "2.67", "purchases": "400+"}',
    tags: '["Meta Ads", "E-commerce", "ROAS 2.67"]',
    pageVisibility: '["home", "facebook-ads"]',
    author: 'Roman Hrybuk',
    isPublished: true,
    orderIndex: 2,
    createdBy: 1
  },
  {
    title: 'Від 100 до 1500 лідів на день',
    slug: 'vid-100-do-1500-lidiv',
    client: 'Інфобізнес компанія',
    industry: 'Інфобізнес',
    description: 'Масштабування лідогенерації для 8 продуктів компанії з 100 до 1500 лідів на день.',
    content: '# Lead Generation Growth\n\n30,124 лідів за 50,254 USD, ціна ліда 1.66 USD, ROAS 405-584%.',
    results: '{"budget": "50,254$", "leads": "30,124", "cost_per_lead": "1.66$", "roas": "405-584%"}',
    tags: '["Meta Ads", "Інфобізнес", "Лідогенерація"]',
    pageVisibility: '["home", "facebook-ads"]',
    author: 'Roman Hrybuk',
    isPublished: true,
    orderIndex: 3,
    createdBy: 1
  }
];

for (const caseData of cases) {
  await db.insert(schema.caseStudies).values(caseData);
  console.log(`Inserted: ${caseData.title}`);
}

await connection.end();
console.log('Done!');
