export const translations = {
  en: {
    // Navigation
    home: "Home",
    crm: "CRM",
    admin: "Admin",
    logout: "Logout",
    
    // CRM
    leads: "Leads",
    createLeadManually: "Create Lead Manually",
    source: "Source",
    quiz: "Quiz",
    name: "Name",
    phone: "Phone",
    email: "Email",
    telegram: "Telegram",
    status: "Status",
    score: "Score",
    date: "Date",
    actions: "Actions",
    view: "View",
    comments: "Comments",
    messages: "Messages",
    addComment: "Add Comment",
    sendMessage: "Send Message",
    
    // Lead Sources
    manual: "Manual",
    facebook: "Facebook",
    google: "Google",
    youtube: "YouTube",
    emailSource: "Email",
    coldLead: "Cold Lead",
    referral: "Referral",
    
    // UTM
    utmCampaign: "UTM Campaign",
    utmSource: "UTM Source",
    utmMedium: "UTM Medium",
    utmContent: "UTM Content",
    utmTerm: "UTM Term",
    
    // Admin
    adminPanel: "Admin Panel",
    totalLeads: "Total Leads",
    activeManagers: "Active Managers",
    systemStatus: "System Status",
    online: "Online",
    crmSystem: "CRM System",
    analytics: "Analytics",
    settings: "Settings",
    quizManagement: "Quiz Management",
    abTesting: "A/B Testing",
    calendar: "Calendar",
    messaging: "Messaging",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    search: "Search",
    filter: "Filter",
    all: "All",
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },
  
  uk: {
    // Navigation
    home: "Головна",
    crm: "CRM",
    admin: "Адмін",
    logout: "Вийти",
    
    // CRM
    leads: "Ліди",
    createLeadManually: "Створити лід вручну",
    source: "Джерело",
    quiz: "Квіз",
    name: "Ім'я",
    phone: "Телефон",
    email: "Email",
    telegram: "Telegram",
    status: "Статус",
    score: "Оцінка",
    date: "Дата",
    actions: "Дії",
    view: "Переглянути",
    comments: "Коментарі",
    messages: "Повідомлення",
    addComment: "Додати коментар",
    sendMessage: "Надіслати повідомлення",
    
    // Lead Sources
    manual: "Вручну",
    facebook: "Facebook",
    google: "Google",
    youtube: "YouTube",
    emailSource: "Email",
    coldLead: "Холодний лід",
    referral: "Реферал",
    
    // UTM
    utmCampaign: "UTM Кампанія",
    utmSource: "UTM Джерело",
    utmMedium: "UTM Канал",
    utmContent: "UTM Контент",
    utmTerm: "UTM Термін",
    
    // Admin
    adminPanel: "Адмін панель",
    totalLeads: "Всього лідів",
    activeManagers: "Активних менеджерів",
    systemStatus: "Статус системи",
    online: "Онлайн",
    crmSystem: "CRM Система",
    analytics: "Аналітика",
    settings: "Налаштування",
    quizManagement: "Управління квізами",
    abTesting: "A/B Тестування",
    calendar: "Календар",
    messaging: "Повідомлення",
    
    // Common
    save: "Зберегти",
    cancel: "Скасувати",
    delete: "Видалити",
    edit: "Редагувати",
    create: "Створити",
    update: "Оновити",
    search: "Пошук",
    filter: "Фільтр",
    all: "Всі",
    loading: "Завантаження...",
    error: "Помилка",
    success: "Успішно",
  },
  
  ru: {
    // Navigation
    home: "Главная",
    crm: "CRM",
    admin: "Админ",
    logout: "Выйти",
    
    // CRM
    leads: "Лиды",
    createLeadManually: "Создать лид вручную",
    source: "Источник",
    quiz: "Квиз",
    name: "Имя",
    phone: "Телефон",
    email: "Email",
    telegram: "Telegram",
    status: "Статус",
    score: "Оценка",
    date: "Дата",
    actions: "Действия",
    view: "Просмотр",
    comments: "Комментарии",
    messages: "Сообщения",
    addComment: "Добавить комментарий",
    sendMessage: "Отправить сообщение",
    
    // Lead Sources
    manual: "Вручную",
    facebook: "Facebook",
    google: "Google",
    youtube: "YouTube",
    emailSource: "Email",
    coldLead: "Холодный лид",
    referral: "Реферал",
    
    // UTM
    utmCampaign: "UTM Кампания",
    utmSource: "UTM Источник",
    utmMedium: "UTM Канал",
    utmContent: "UTM Контент",
    utmTerm: "UTM Термин",
    
    // Admin
    adminPanel: "Админ панель",
    totalLeads: "Всего лидов",
    activeManagers: "Активных менеджеров",
    systemStatus: "Статус системы",
    online: "Онлайн",
    crmSystem: "CRM Система",
    analytics: "Аналитика",
    settings: "Настройки",
    quizManagement: "Управление квизами",
    abTesting: "A/B Тестирование",
    calendar: "Календарь",
    messaging: "Сообщения",
    
    // Common
    save: "Сохранить",
    cancel: "Отменить",
    delete: "Удалить",
    edit: "Редактировать",
    create: "Создать",
    update: "Обновить",
    search: "Поиск",
    filter: "Фильтр",
    all: "Все",
    loading: "Загрузка...",
    error: "Ошибка",
    success: "Успешно",
  },
};

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en;

export function useTranslation(lang: Language = "en") {
  return {
    t: (key: TranslationKey) => translations[lang][key] || translations.en[key],
    lang,
  };
}
