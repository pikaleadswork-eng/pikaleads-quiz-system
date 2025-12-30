# 📦 Інструкція по відновленню бази даних PIKALEADS

## Файл бази даних
**`database_COMPLETE_WITH_ALL_DATA.sql`** - ПОВНИЙ дамп бази даних з УСІМА даними

## ✅ Що включено в дамп

### Структура (50+ таблиць):
- users, leads, quizzes, quiz_questions
- quiz_design_settings, quiz_answer_options
- ab_tests, ab_test_variants, ab_test_assignments
- services, additional_services, sales, sales_scripts
- blog_posts, blog_categories, case_studies, team_members
- analytics_settings, events_log, conversations, inbound_messages
- webhooks, webhook_logs, contact_messages
- assignment_rules, assignment_history, system_settings
- manager_invitations, lead_comments, lead_change_history
- scheduled_messages, scheduled_calls, interaction_history
- filter_presets, question_templates
- і багато інших...

### Дані (ВСЕ включено):

**👥 Користувачі (4 акаунти):**
1. **pikaleadswork@gmail.com** (admin) - основний адмін
2. **admin@pikaleads.com** (admin) - тестовий адмін, пароль: `admin123`
3. **manager1@pikaleads.com** (manager) - Олександр
4. **manager2@pikaleads.com** (manager) - Артур

**📝 Квізи (16 штук):**
- 8 META ADS квізів (e-commerce, renovation, furniture, telegram, construction, food-delivery, b2b, general)
- 8 GOOGLE ADS квізів (ті самі ніші)
- Всі з питаннями (64 питання загалом)
- Всі з дизайн налаштуваннями (фони, кольори, шрифти)

**🎯 Ліди (11 лідів):**
- З повною інформацією (ім'я, телефон, email, telegram)
- З UTM параметрами для аналітики
- З оцінками (lead scoring)
- З історією змін

**⚙️ Налаштування:**
- Analytics settings (Meta Pixel, GA4, GTM, Clarity)
- Telegram Bot налаштування
- Email SMTP конфігурація
- Всі системні параметри

## 🚀 Відновлення бази даних

### Варіант 1: Локальна MySQL база (РЕКОМЕНДОВАНО для розробки)

```bash
# 1. Створити нову базу даних
mysql -u root -p -e "CREATE DATABASE pikaleads CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# 2. Відновити дамп (ВСІ дані автоматично імпортуються)
mysql -u root -p pikaleads < database_COMPLETE_WITH_ALL_DATA.sql

# 3. Оновити DATABASE_URL в .env файлі
DATABASE_URL=mysql://root:ВАШ_ПАРОЛЬ@localhost:3306/pikaleads
```

### Варіант 2: TiDB Cloud (для продакшену)

```bash
# Відновити через MySQL клієнт
mysql -h YOUR_TIDB_HOST -P 4000 -u YOUR_USER -p --ssl-mode=REQUIRED YOUR_DATABASE < database_COMPLETE_WITH_ALL_DATA.sql

# Оновити .env
DATABASE_URL=mysql://USER:PASS@YOUR_TIDB_HOST:4000/YOUR_DB?ssl={"rejectUnauthorized":true}
```

### Варіант 3: Через Drizzle (ТІЛЬКИ якщо база порожня)

```bash
# Встановити залежності
pnpm install

# Запустити міграції (створить таблиці БЕЗ даних)
pnpm db:push

# Потім імпортувати дані окремо
mysql -u root -p pikaleads < database_COMPLETE_WITH_ALL_DATA.sql
```

## ✅ Перевірка відновлення

```bash
# Підключитись до бази
mysql -u root -p pikaleads

# Перевірити таблиці
SHOW TABLES;
# Має показати 50+ таблиць

# Перевірити користувачів
SELECT id, email, role, isActive FROM users;
# Має показати 4 користувачі

# Перевірити квізи
SELECT id, name, platform, niche FROM quizzes;
# Має показати 16 квізів

# Перевірити питання
SELECT COUNT(*) FROM quiz_questions;
# Має показати 64 питання

# Перевірити ліди
SELECT COUNT(*) FROM leads;
# Має показати 11 лідів

# Перевірити дизайн налаштування
SELECT quizId, layoutType, backgroundImage FROM quiz_design_settings;
# Має показати 16 записів
```

## 🔐 Логіни для тестування

### Адмін панель (/login):

**Основний адмін:**
- Email: `pikaleadswork@gmail.com`
- Password: (хеш в базі, потрібно скинути або використати інший акаунт)

**Тестовий адмін:**
- Email: `admin@pikaleads.com`
- Password: `admin123`
- Доступ: Повний доступ до всіх функцій

**Менеджери:**
- Email: `manager1@pikaleads.com` або `manager2@pikaleads.com`
- Password: (не встановлений, потрібно створити через адмін панель)
- Доступ: Обмежений доступ (тільки свої ліди)

## 🛠 Troubleshooting

### Помилка: "Table already exists"
```bash
# Видалити існуючу базу
mysql -u root -p -e "DROP DATABASE IF EXISTS pikaleads;"

# Створити знову
mysql -u root -p -e "CREATE DATABASE pikaleads CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Відновити дамп
mysql -u root -p pikaleads < database_COMPLETE_WITH_ALL_DATA.sql
```

### Помилка: "Access denied" або SSL connection
```bash
# Для TiDB Cloud обов'язково додати --ssl-mode
mysql -h HOST -P 4000 -u USER -p --ssl-mode=REQUIRED DATABASE < database_COMPLETE_WITH_ALL_DATA.sql
```

### Помилка: "Unknown database"
```bash
# Спочатку створити базу
mysql -u root -p -e "CREATE DATABASE pikaleads CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

### Помилка charset або encoding
```bash
# Переконатись що база створена з правильним charset
mysql -u root -p -e "ALTER DATABASE pikaleads CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"
```

## 📊 Статистика бази даних

- **Таблиць:** 50+
- **Користувачів:** 4 (2 admin + 2 manager)
- **Квізів:** 16 (8 META + 8 GOOGLE)
- **Питань:** 64
- **Лідів:** 11
- **Розмір дампу:** ~131 KB (стиснутий)

## 🎯 Після відновлення

1. ✅ Перевірити підключення до бази в .env
2. ✅ Запустити проект: `pnpm dev`
3. ✅ Залогінитись як admin@pikaleads.com / admin123
4. ✅ Перевірити що всі квізи відображаються на /quizzes
5. ✅ Перевірити CRM панель з лідами
6. ✅ Налаштувати Telegram Bot (якщо потрібно)
7. ✅ Налаштувати Meta Pixel / GA4 (якщо потрібно)

Готово! База даних повністю відновлена з усіма даними! 🚀
