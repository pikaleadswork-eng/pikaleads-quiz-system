import mysql from 'mysql2/promise';

// Get database URL from environment
const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

// Parse connection string
const url = new URL(DATABASE_URL);

async function main() {
  const connection = await mysql.createConnection({
    host: url.hostname,
    port: parseInt(url.port) || 3306,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1).split('?')[0],
    ssl: {
      rejectUnauthorized: false
    }
  });

  console.log('Connected to database');

  // Get all quizzes
  const [quizzes] = await connection.execute('SELECT id, slug, name FROM quizzes');
  console.log(`Found ${quizzes.length} quizzes:`);
  quizzes.forEach(q => console.log(`  - ID: ${q.id}, Slug: ${q.slug}, Name: ${q.name}`));

  // Get all design settings
  const [settings] = await connection.execute('SELECT id, quizId, layoutType, alignment, contactFormTitle, thankYouTitle FROM quiz_design_settings');
  console.log(`\nFound ${settings.length} design settings:`);
  settings.forEach(s => console.log(`  - ID: ${s.id}, QuizID: ${s.quizId}, Layout: ${s.layoutType}, Alignment: ${s.alignment}`));

  // Find quizzes without design settings
  const quizIdsWithSettings = new Set(settings.map(s => s.quizId));
  const quizzesWithoutSettings = quizzes.filter(q => !quizIdsWithSettings.has(q.id));
  console.log(`\nQuizzes without design settings: ${quizzesWithoutSettings.length}`);
  quizzesWithoutSettings.forEach(q => console.log(`  - ID: ${q.id}, Slug: ${q.slug}`));

  // Default settings for new quizzes
  const defaultSettings = {
    layoutType: 'background',
    alignment: 'center',
    primaryColor: '#FFD93D',
    accentColor: '#A855F7',
    fontFamily: 'Inter',
    buttonText: 'Почати',
    bonusEnabled: false,
    companyName: 'PikaLeads',
    phoneNumber: '+380992377117',
    contactFormTitle: JSON.stringify({
      uk: "Залиште свої контакти",
      ru: "Оставьте свои контакты",
      en: "Leave your contacts",
      pl: "Zostaw swoje kontakty",
      de: "Hinterlassen Sie Ihre Kontakte"
    }),
    contactFormSubtitle: JSON.stringify({
      uk: "Ми зв'яжемося з вами найближчим часом",
      ru: "Мы свяжемся с вами в ближайшее время",
      en: "We will contact you shortly",
      pl: "Skontaktujemy się z Tobą wkrótce",
      de: "Wir werden uns in Kürze bei Ihnen melden"
    }),
    contactFormFields: JSON.stringify(['name', 'phone', 'email', 'telegram']),
    thankYouTitle: JSON.stringify({
      uk: "Дякуємо за вашу заявку!",
      ru: "Спасибо за вашу заявку!",
      en: "Thank you for your application!",
      pl: "Dziękujemy za zgłoszenie!",
      de: "Vielen Dank für Ihre Bewerbung!"
    }),
    thankYouSubtitle: JSON.stringify({
      uk: "Наш менеджер зв'яжеться з вами найближчим часом",
      ru: "Наш менеджер свяжется с вами в ближайшее время",
      en: "Our manager will contact you shortly",
      pl: "Nasz menedżer skontaktuje się z Tobą wkrótce",
      de: "Unser Manager wird sich in Kürze bei Ihnen melden"
    }),
    thankYouButtonText: JSON.stringify({
      uk: "На головну",
      ru: "На главную",
      en: "To main page",
      pl: "Na stronę główną",
      de: "Zur Hauptseite"
    }),
    thankYouButtonUrl: '/'
  };

  // Update existing settings that are missing contact/thank you fields
  console.log('\nUpdating existing settings with missing fields...');
  for (const setting of settings) {
    if (!setting.contactFormTitle || !setting.thankYouTitle) {
      console.log(`  Updating settings for quizId: ${setting.quizId}`);
      await connection.execute(
        `UPDATE quiz_design_settings SET 
          contactFormTitle = COALESCE(contactFormTitle, ?),
          contactFormSubtitle = COALESCE(contactFormSubtitle, ?),
          contactFormFields = COALESCE(contactFormFields, ?),
          thankYouTitle = COALESCE(thankYouTitle, ?),
          thankYouSubtitle = COALESCE(thankYouSubtitle, ?),
          thankYouButtonText = COALESCE(thankYouButtonText, ?),
          thankYouButtonUrl = COALESCE(thankYouButtonUrl, ?)
        WHERE id = ?`,
        [
          defaultSettings.contactFormTitle,
          defaultSettings.contactFormSubtitle,
          defaultSettings.contactFormFields,
          defaultSettings.thankYouTitle,
          defaultSettings.thankYouSubtitle,
          defaultSettings.thankYouButtonText,
          defaultSettings.thankYouButtonUrl,
          setting.id
        ]
      );
    }
  }

  // Create settings for quizzes without them
  console.log('\nCreating settings for quizzes without them...');
  for (const quiz of quizzesWithoutSettings) {
    console.log(`  Creating settings for quiz: ${quiz.slug} (ID: ${quiz.id})`);
    await connection.execute(
      `INSERT INTO quiz_design_settings 
        (quizId, layoutType, alignment, primaryColor, accentColor, fontFamily, buttonText, bonusEnabled, companyName, phoneNumber, contactFormTitle, contactFormSubtitle, contactFormFields, thankYouTitle, thankYouSubtitle, thankYouButtonText, thankYouButtonUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        quiz.id,
        defaultSettings.layoutType,
        defaultSettings.alignment,
        defaultSettings.primaryColor,
        defaultSettings.accentColor,
        defaultSettings.fontFamily,
        defaultSettings.buttonText,
        defaultSettings.bonusEnabled,
        defaultSettings.companyName,
        defaultSettings.phoneNumber,
        defaultSettings.contactFormTitle,
        defaultSettings.contactFormSubtitle,
        defaultSettings.contactFormFields,
        defaultSettings.thankYouTitle,
        defaultSettings.thankYouSubtitle,
        defaultSettings.thankYouButtonText,
        defaultSettings.thankYouButtonUrl
      ]
    );
  }

  console.log('\nDone! All quizzes now have design settings.');
  await connection.end();
}

main().catch(console.error);
