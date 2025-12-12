import json

# Additional translations for admin panel
admin_translations = {
    "uk": {
        "adminDashboard": {
            "title": "Панель адміністратора",
            "welcome": "Ласкаво просимо до панелі адміністратора",
            "overview": "Огляд системи",
            "quickActions": "Швидкі дії",
            "recentActivity": "Остання активність",
            "systemHealth": "Стан системи",
            "viewAll": "Переглянути все"
        },
        "crmDashboard": {
            "title": "CRM Дашборд",
            "leadsOverview": "Огляд лідів",
            "conversionFunnel": "Воронка конверсії",
            "topPerformers": "Топ менеджерів",
            "recentLeads": "Останні ліди",
            "leadsByStatus": "Ліди за статусом",
            "leadsBySource": "Ліди за джерелом"
        },
        "analytics": {
            "title": "Аналітика",
            "description": "Детальна аналітика та звіти",
            "dateRange": "Період",
            "metrics": "Метрики",
            "charts": "Графіки",
            "export": "Експортувати",
            "refresh": "Оновити"
        },
        "calendar": {
            "title": "Календар",
            "description": "Заплановані події та зустрічі",
            "today": "Сьогодні",
            "week": "Тиждень",
            "month": "Місяць",
            "addEvent": "Додати подію",
            "upcomingEvents": "Майбутні події",
            "noEvents": "Немає запланованих подій"
        },
        "managers": {
            "title": "Менеджери",
            "description": "Управління командою менеджерів",
            "addManager": "Додати менеджера",
            "activeManagers": "Активні менеджери",
            "performance": "Продуктивність",
            "assignedLeads": "Призначені ліди",
            "closedDeals": "Закриті угоди"
        },
        "performance": {
            "title": "Продуктивність",
            "description": "Аналіз продуктивності команди",
            "topPerformers": "Топ виконавців",
            "conversionRate": "Конверсія",
            "averageResponseTime": "Середній час відповіді",
            "customerSatisfaction": "Задоволеність клієнтів"
        },
        "editLead": {
            "title": "Редагувати ліда",
            "contactInfo": "Контактна інформація",
            "name": "Ім'я",
            "phone": "Телефон",
            "email": "Email",
            "telegram": "Telegram",
            "whatsapp": "WhatsApp",
            "serviceAssignment": "Призначення послуги",
            "mainService": "Основна послуга",
            "selectService": "Оберіть послугу",
            "totalAmount": "Загальна сума",
            "autoCalculated": "Авто-розрахунок",
            "salesNotes": "Примітки до продажу",
            "addNotes": "Додайте примітки про цей продаж...",
            "cancel": "Скасувати",
            "updateLead": "Оновити ліда",
            "convertToSale": "Конвертувати в продаж"
        },
        "filters": {
            "title": "Фільтри",
            "manager": "Менеджер",
            "source": "Джерело",
            "dateRange": "Період дат",
            "from": "Від",
            "to": "До",
            "apply": "Застосувати",
            "clear": "Очистити",
            "clearAll": "Очистити все",
            "activeFilters": "Активні фільтри"
        },
        "table": {
            "id": "ID",
            "date": "Дата",
            "source": "Джерело",
            "name": "Ім'я",
            "phone": "Телефон",
            "status": "Статус",
            "manager": "Менеджер",
            "score": "Оцінка",
            "actions": "Дії",
            "view": "Переглянути",
            "edit": "Редагувати",
            "delete": "Видалити",
            "noData": "Немає даних",
            "loading": "Завантаження...",
            "showing": "Показано",
            "of": "з",
            "entries": "записів"
        }
    },
    "ru": {
        "adminDashboard": {
            "title": "Панель администратора",
            "welcome": "Добро пожаловать в панель администратора",
            "overview": "Обзор системы",
            "quickActions": "Быстрые действия",
            "recentActivity": "Последняя активность",
            "systemHealth": "Состояние системы",
            "viewAll": "Просмотреть все"
        },
        "crmDashboard": {
            "title": "CRM Дашборд",
            "leadsOverview": "Обзор лидов",
            "conversionFunnel": "Воронка конверсии",
            "topPerformers": "Топ менеджеров",
            "recentLeads": "Последние лиды",
            "leadsByStatus": "Лиды по статусу",
            "leadsBySource": "Лиды по источнику"
        },
        "analytics": {
            "title": "Аналитика",
            "description": "Детальная аналитика и отчеты",
            "dateRange": "Период",
            "metrics": "Метрики",
            "charts": "Графики",
            "export": "Экспортировать",
            "refresh": "Обновить"
        },
        "calendar": {
            "title": "Календарь",
            "description": "Запланированные события и встречи",
            "today": "Сегодня",
            "week": "Неделя",
            "month": "Месяц",
            "addEvent": "Добавить событие",
            "upcomingEvents": "Предстоящие события",
            "noEvents": "Нет запланированных событий"
        },
        "managers": {
            "title": "Менеджеры",
            "description": "Управление командой менеджеров",
            "addManager": "Добавить менеджера",
            "activeManagers": "Активные менеджеры",
            "performance": "Продуктивность",
            "assignedLeads": "Назначенные лиды",
            "closedDeals": "Закрытые сделки"
        },
        "performance": {
            "title": "Продуктивность",
            "description": "Анализ продуктивности команды",
            "topPerformers": "Топ исполнителей",
            "conversionRate": "Конверсия",
            "averageResponseTime": "Среднее время ответа",
            "customerSatisfaction": "Удовлетворенность клиентов"
        },
        "editLead": {
            "title": "Редактировать лида",
            "contactInfo": "Контактная информация",
            "name": "Имя",
            "phone": "Телефон",
            "email": "Email",
            "telegram": "Telegram",
            "whatsapp": "WhatsApp",
            "serviceAssignment": "Назначение услуги",
            "mainService": "Основная услуга",
            "selectService": "Выберите услугу",
            "totalAmount": "Общая сумма",
            "autoCalculated": "Авто-расчет",
            "salesNotes": "Примечания к продаже",
            "addNotes": "Добавьте примечания об этой продаже...",
            "cancel": "Отменить",
            "updateLead": "Обновить лида",
            "convertToSale": "Конвертировать в продажу"
        },
        "filters": {
            "title": "Фильтры",
            "manager": "Менеджер",
            "source": "Источник",
            "dateRange": "Период дат",
            "from": "От",
            "to": "До",
            "apply": "Применить",
            "clear": "Очистить",
            "clearAll": "Очистить все",
            "activeFilters": "Активные фильтры"
        },
        "table": {
            "id": "ID",
            "date": "Дата",
            "source": "Источник",
            "name": "Имя",
            "phone": "Телефон",
            "status": "Статус",
            "manager": "Менеджер",
            "score": "Оценка",
            "actions": "Действия",
            "view": "Просмотреть",
            "edit": "Редактировать",
            "delete": "Удалить",
            "noData": "Нет данных",
            "loading": "Загрузка...",
            "showing": "Показано",
            "of": "из",
            "entries": "записей"
        }
    },
    "en": {
        "adminDashboard": {
            "title": "Admin Dashboard",
            "welcome": "Welcome to Admin Dashboard",
            "overview": "System Overview",
            "quickActions": "Quick Actions",
            "recentActivity": "Recent Activity",
            "systemHealth": "System Health",
            "viewAll": "View All"
        },
        "crmDashboard": {
            "title": "CRM Dashboard",
            "leadsOverview": "Leads Overview",
            "conversionFunnel": "Conversion Funnel",
            "topPerformers": "Top Performers",
            "recentLeads": "Recent Leads",
            "leadsByStatus": "Leads by Status",
            "leadsBySource": "Leads by Source"
        },
        "analytics": {
            "title": "Analytics",
            "description": "Detailed analytics and reports",
            "dateRange": "Date Range",
            "metrics": "Metrics",
            "charts": "Charts",
            "export": "Export",
            "refresh": "Refresh"
        },
        "calendar": {
            "title": "Calendar",
            "description": "Scheduled events and meetings",
            "today": "Today",
            "week": "Week",
            "month": "Month",
            "addEvent": "Add Event",
            "upcomingEvents": "Upcoming Events",
            "noEvents": "No scheduled events"
        },
        "managers": {
            "title": "Managers",
            "description": "Manage your team of managers",
            "addManager": "Add Manager",
            "activeManagers": "Active Managers",
            "performance": "Performance",
            "assignedLeads": "Assigned Leads",
            "closedDeals": "Closed Deals"
        },
        "performance": {
            "title": "Performance",
            "description": "Team performance analysis",
            "topPerformers": "Top Performers",
            "conversionRate": "Conversion Rate",
            "averageResponseTime": "Average Response Time",
            "customerSatisfaction": "Customer Satisfaction"
        },
        "editLead": {
            "title": "Edit Lead",
            "contactInfo": "Contact Information",
            "name": "Name",
            "phone": "Phone",
            "email": "Email",
            "telegram": "Telegram",
            "whatsapp": "WhatsApp",
            "serviceAssignment": "Service Assignment",
            "mainService": "Main Service",
            "selectService": "Select Service",
            "totalAmount": "Total Amount",
            "autoCalculated": "Auto-calculated",
            "salesNotes": "Sales Notes",
            "addNotes": "Add notes about this sale...",
            "cancel": "Cancel",
            "updateLead": "Update Lead",
            "convertToSale": "Convert to Sale"
        },
        "filters": {
            "title": "Filters",
            "manager": "Manager",
            "source": "Source",
            "dateRange": "Date Range",
            "from": "From",
            "to": "To",
            "apply": "Apply",
            "clear": "Clear",
            "clearAll": "Clear All",
            "activeFilters": "Active Filters"
        },
        "table": {
            "id": "ID",
            "date": "Date",
            "source": "Source",
            "name": "Name",
            "phone": "Phone",
            "status": "Status",
            "manager": "Manager",
            "score": "Score",
            "actions": "Actions",
            "view": "View",
            "edit": "Edit",
            "delete": "Delete",
            "noData": "No data",
            "loading": "Loading...",
            "showing": "Showing",
            "of": "of",
            "entries": "entries"
        }
    }
}

# Update each language file
for lang in ['uk', 'ru', 'en']:
    filename = f'client/src/locales/{lang}.json'
    with open(filename, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # Merge new translations
    data.update(admin_translations[lang])
    
    with open(filename, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    
    print(f"✅ Updated {filename}")

print("\n✅ All translation files updated with admin panel translations!")
