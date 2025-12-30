import os
import re

# List of files to fix
files_to_fix = [
    "client/src/pages/CRM.tsx",
    "client/src/pages/SalesStatistics.tsx",
    "client/src/pages/SalesScripts.tsx",
    "client/src/pages/ServicesManagement.tsx",
    "client/src/pages/AdminSettings.tsx",
    "client/src/components/CRMLayout.tsx",
    "client/src/pages/MessagingInbox.tsx",
    "client/src/components/LeadInfoPanel.tsx",
]

# Pattern to match the old translation code
old_translation_pattern = re.compile(
    r'\s*// Detect language from localStorage\s*\n'
    r'\s*const \[language, setLanguage\] = useState\(\(\) => \{\s*\n'
    r'\s*return localStorage\.getItem\(\'language\'\) \|\| \'uk\';\s*\n'
    r'\s*\}\);\s*\n'
    r'\s*useEffect\(\(\) => \{\s*\n'
    r'\s*const handleLanguageChange = \(\) => \{\s*\n'
    r'\s*setLanguage\(localStorage\.getItem\(\'language\'\) \|\| \'uk\'\);\s*\n'
    r'\s*\};\s*\n'
    r'\s*window\.addEventListener\(\'languageChanged\', handleLanguageChange\);\s*\n'
    r'\s*return \(\) => window\.removeEventListener\(\'languageChanged\', handleLanguageChange\);\s*\n'
    r'\s*\}, \[\]\);\s*\n'
    r'\s*const t = \(uk: string, ru: string, en: string\) => \{\s*\n'
    r'\s*if \(language === \'ru\'\) return ru;\s*\n'
    r'\s*if \(language === \'en\'\) return en;\s*\n'
    r'\s*return uk;\s*\n'
    r'\s*\};',
    re.MULTILINE
)

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        print(f"⚠️  File not found: {file_path}")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Remove old translation code
    new_content = old_translation_pattern.sub('', content)
    
    # Check if anything changed
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"✅ Fixed: {file_path}")
    else:
        print(f"✓  Already clean: {file_path}")

print("\n✅ All files processed!")
