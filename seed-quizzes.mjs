import mysql from 'mysql2/promise';

// Quiz data mapping
const quizzesData = [
  {
    slug: "meta_ads-furniture",
    name: "Want to Get 30+ Furniture Leads Daily?",
    description: "Take a short quiz and we'll calculate your lead cost and strategy",
    platform: "meta_ads",
    niche: "furniture",
  },
  {
    slug: "meta_ads-renovation",
    name: "Get 5-15 Hot Leads Daily for Apartment Renovations",
    description: "Complete the quiz to get your personalized marketing plan",
    platform: "meta_ads",
    niche: "renovation",
  },
  {
    slug: "meta_ads-ecommerce",
    name: "Want to Scale Your E-Commerce? Get 30-120 Leads Daily",
    description: "Answer a few questions to discover your growth potential",
    platform: "meta_ads",
    niche: "ecommerce",
  },
  {
    slug: "google_ads-furniture",
    name: "Want to Get 30+ Furniture Leads Daily?",
    description: "Take a short quiz and we'll calculate your lead cost and strategy",
    platform: "google_ads",
    niche: "furniture",
  },
  {
    slug: "google_ads-renovation",
    name: "Get 5-15 Hot Leads Daily for Apartment Renovations",
    description: "Complete the quiz to get your personalized marketing plan",
    platform: "google_ads",
    niche: "renovation",
  },
  {
    slug: "google_ads-ecommerce",
    name: "Want to Scale Your E-Commerce? Get 30-120 Leads Daily",
    description: "Answer a few questions to discover your growth potential",
    platform: "google_ads",
    niche: "ecommerce",
  },
];

async function seed() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  console.log('🌱 Seeding quizzes...');

  // Get owner user ID (first user in database)
  const [users] = await connection.execute('SELECT id FROM users LIMIT 1');
  const ownerId = users[0]?.id || 1;

  for (const quiz of quizzesData) {
    try {
      // Check if quiz already exists
      const [existing] = await connection.execute(
        'SELECT id FROM quizzes WHERE slug = ?',
        [quiz.slug]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Quiz "${quiz.name}" already exists, skipping...`);
        continue;
      }

      // Insert quiz
      await connection.execute(
        `INSERT INTO quizzes (name, slug, description, quizType, platform, niche, isActive, createdBy)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          quiz.name,
          quiz.slug,
          quiz.description,
          'lead_generation',
          quiz.platform,
          quiz.niche,
          1,
          ownerId,
        ]
      );

      console.log(`✅ Created quiz: ${quiz.name} (${quiz.platform} / ${quiz.niche})`);
    } catch (error) {
      console.error(`❌ Error creating quiz "${quiz.name}":`, error.message);
    }
  }

  await connection.end();
  console.log('🎉 Seeding complete!');
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
