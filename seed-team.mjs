import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const teamMembers = [
  {
    name: "Олександр Коваленко",
    position: "Performance Marketing Manager",
    bio: "Спеціалізується на Meta Ads та Google Ads. Запустив понад 200 успішних кампаній для e-commerce та B2B.",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    experience: "7+ років досвіду",
    metaBlueprintCertified: 1,
    googleAdsCertified: 1,
    tiktokCertified: 0,
    linkedinUrl: "https://linkedin.com",
    orderIndex: 1,
    isActive: 1
  },
  {
    name: "Марія Шевченко",
    position: "Lead Generation Specialist",
    bio: "Експерт з генерації лідів через соціальні мережі. Середній ROI клієнтів — 250%.",
    photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    experience: "5+ років досвіду",
    metaBlueprintCertified: 1,
    googleAdsCertified: 0,
    tiktokCertified: 1,
    instagramUrl: "https://instagram.com",
    orderIndex: 2,
    isActive: 1
  },
  {
    name: "Дмитро Петренко",
    position: "Data Analyst & CRO Expert",
    bio: "Аналізує дані та оптимізує конверсії. Збільшив CR клієнтів у середньому на 180%.",
    photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    experience: "6+ років досвіду",
    metaBlueprintCertified: 0,
    googleAdsCertified: 1,
    tiktokCertified: 0,
    linkedinUrl: "https://linkedin.com",
    facebookUrl: "https://facebook.com",
    orderIndex: 3,
    isActive: 1
  }
];

for (const member of teamMembers) {
  await connection.execute(
    `INSERT INTO team_members (name, position, bio, photoUrl, experience, metaBlueprintCertified, googleAdsCertified, tiktokCertified, linkedinUrl, facebookUrl, instagramUrl, telegramUrl, orderIndex, isActive) 
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      member.name,
      member.position,
      member.bio,
      member.photoUrl,
      member.experience,
      member.metaBlueprintCertified,
      member.googleAdsCertified,
      member.tiktokCertified,
      member.linkedinUrl || null,
      member.facebookUrl || null,
      member.instagramUrl || null,
      member.telegramUrl || null,
      member.orderIndex,
      member.isActive
    ]
  );
}

console.log('✅ Added 3 team members');
await connection.end();
