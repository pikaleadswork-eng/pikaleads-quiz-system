import re

# Read the file
with open('client/src/components/EditLeadForm.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Mapping of old translations to new keys
replacements = {
    "t('Контактна інформація', 'Контактная информация', 'Contact Information')": "t('editLead.contactInfo')",
    "t('Ім\\'я *', 'Имя *', 'Name *')": "t('editLead.name') + ' *'",
    "t('Телефон *', 'Телефон *', 'Phone *')": "t('editLead.phone') + ' *'",
    "t('Призначення послуг', 'Назначение услуг', 'Service Assignment')": "t('editLead.serviceAssignment')",
    "t('Основна послуга', 'Основная услуга', 'Main Service')": "t('editLead.mainService')",
    "t('Оберіть послугу', 'Выберите услугу', 'Select a service')": "t('editLead.selectService')",
    "t('Додаткові послуги', 'Дополнительные услуги', 'Additional Services')": "t('editLead.additionalServices')",
    "t('Загальна сума (Ручне введення)', 'Общая сумма (Ручной ввод)', 'Total Amount (Manual Override)')": "t('editLead.totalAmount') + ' (' + t('editLead.manualOverride') + ')'",
    "t('Авто-розрахунок', 'Авто-расчет', 'Auto-calculate')": "t('editLead.autoCalculated')",
    "t('Загальна сума:', 'Общая сумма:', 'Total Amount:')": "t('editLead.totalAmount') + ':'",
    "t('Активне ручне введення', 'Активен ручной ввод', 'Manual override active')": "t('editLead.manualOverrideActive')",
    "t('Примітки до продажу', 'Примечания к продаже', 'Sale Notes')": "t('editLead.salesNotes')",
    "t('Додайте примітки про цей продаж...', 'Добавьте примечания об этой продаже...', 'Add notes about this sale...')": "t('editLead.addNotes')",
    "t('Email', 'Email', 'Email')": "t('editLead.email')",
    "t('Telegram', 'Telegram', 'Telegram')": "t('editLead.telegram')",
    "t('WhatsApp', 'WhatsApp', 'WhatsApp')": "t('editLead.whatsapp')",
    "t('Скасувати', 'Отменить', 'Cancel')": "t('editLead.cancel')",
    "t('Оновити ліда', 'Обновить лида', 'Update Lead')": "t('editLead.updateLead')",
    "t('Конвертувати в продаж', 'Конвертировать в продажу', 'Convert to Sale')": "t('editLead.convertToSale')",
}

for old, new in replacements.items():
    content = content.replace(old, new)

# Write back
with open('client/src/components/EditLeadForm.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Fixed EditLeadForm.tsx translations")
