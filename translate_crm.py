import re

file_path = "client/src/pages/CRM.tsx"

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useTranslation import if not present
if "useTranslation" not in content:
    content = content.replace(
        'import { useState, useMemo } from "react";',
        'import { useState, useMemo } from "react";\nimport { useTranslation } from "react-i18next";'
    )

# 2. Add const { t } = useTranslation(); after component declaration
if "const { t } = useTranslation();" not in content:
    content = re.sub(
        r'(export default function CRM\(\) \{)',
        r'\1\n  const { t } = useTranslation();',
        content
    )

# 3. Replace hardcoded English strings with t() calls
replacements = {
    # Page title and subtitle
    '"Leads Management"': 't("crm.title")',
    '"Manage your leads and communicate with clients"': 't("crm.subtitle")',
    
    # Buttons
    '"Filters"': 't("crm.filters")',
    '"Clear Filters"': 't("crm.clearFilters")',
    '"Create Lead Manually"': 't("crm.createLeadManually")',
    
    # UTM Filters section
    '"UTM Filters"': 't("crm.utmFilters")',
    '"Filter leads by campaign parameters"': 't("crm.filterByUTM")',
    
    # Leads count
    '"Leads"': 't("crm.leads")',
    
    # Table headers
    '"ID"': 't("table.id")',
    '"Date"': 't("table.date")',
    '"Source"': 't("table.source")',
    '"Quiz"': 't("table.quiz")',
    '"Name"': 't("table.name")',
    '"Phone"': 't("table.phone")',
    '"UTM Campaign"': 't("table.utmCampaign")',
    '"UTM Source"': 't("table.utmSource")',
    '"UTM Medium"': 't("table.utmMedium")',
    '"Score"': 't("table.score")',
    '"Status"': 't("table.status")',
    '"Actions"': 't("table.actions")',
    
    # Action buttons
    '"View"': 't("table.view")',
    '"Edit"': 't("common.edit")',
}

for old, new in replacements.items():
    content = content.replace(old, new)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print(f"✅ Translated {file_path}")
