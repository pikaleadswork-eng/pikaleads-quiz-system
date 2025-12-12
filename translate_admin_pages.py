import re

# CRMDashboard translations
crm_dashboard_replacements = {
    '"Messengers"': 't("nav.messaging")',
    '"Email, Telegram, WhatsApp"': 't("nav.emailTelegramWhatsApp")',
    '"Leads"': 't("nav.leads")',
    '"Manage all leads"': 't("nav.manageAllLeads")',
    '"Services"': 't("nav.services")',
    '"Pricing & offerings"': 't("nav.pricingOfferings")',
    '"Sales"': 't("nav.sales")',
    '"Revenue & transactions"': 't("nav.revenueTransactions")',
    '"Scripts"': 't("nav.scripts")',
    '"Call scripts library"': 't("nav.callScriptsLibrary")',
    '"Settings"': 't("nav.settings")',
    '"Integrations & API"': 't("nav.integrationsAPI")',
}

# AdminDashboard translations  
admin_dashboard_replacements = {
    '"Admin Dashboard"': 't("adminDashboard.title")',
    '"Welcome to Admin Dashboard"': 't("adminDashboard.welcome")',
    '"System Overview"': 't("adminDashboard.overview")',
    '"Quick Actions"': 't("adminDashboard.quickActions")',
    '"Recent Activity"': 't("adminDashboard.recentActivity")',
    '"System Health"': 't("adminDashboard.systemHealth")',
    '"View All"': 't("adminDashboard.viewAll")',
}

# Apply replacements to files
files_and_replacements = [
    ('client/src/pages/CRMDashboard.tsx', crm_dashboard_replacements),
    ('client/src/pages/AdminDashboard.tsx', admin_dashboard_replacements),
]

for filepath, replacements in files_and_replacements:
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        for old, new in replacements.items():
            content = content.replace(old, new)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print(f"✅ Updated {filepath}")
    except FileNotFoundError:
        print(f"❌ File not found: {filepath}")

print("\n✅ Completed admin page translations!")
