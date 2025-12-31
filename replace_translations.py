import re
import json

# Read translation files
with open('client/src/locales/ua.json', 'r', encoding='utf-8') as f:
    ua_trans = json.load(f)
with open('client/src/locales/ru.json', 'r', encoding='utf-8') as f:
    ru_trans = json.load(f)
with open('client/src/locales/en.json', 'r', encoding='utf-8') as f:
    en_trans = json.load(f)

# Files to process
files = [
    'client/src/pages/CRM.tsx',
    'client/src/pages/AdminSettings.tsx',
]

# Pattern to match old t() calls: t('uk text', 'ru text', 'en text')
pattern = re.compile(r"t\(['\"]([^'\"]+)['\"],\s*['\"]([^'\"]+)['\"],\s*['\"]([^'\"]+)['\"]\)")

def find_or_create_key(uk_text, ru_text, en_text):
    """Find existing key or create new one"""
    # Check if translation already exists
    for key, value in en_trans.items():
        if isinstance(value, str) and value == en_text:
            return key
    
    # Create new key based on English text
    # Convert to camelCase key
    key = en_text.lower().replace(' ', '_').replace('-', '_')
    key = re.sub(r'[^a-z0-9_]', '', key)
    
    return f"common.{key}"

for file_path in files:
    print(f"\n📝 Processing {file_path}...")
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    matches = pattern.findall(content)
    
    if not matches:
        print(f"   No old-style translations found")
        continue
    
    print(f"   Found {len(matches)} old-style translations")
    
    # Replace each match
    new_content = content
    for uk_text, ru_text, en_text in matches:
        old_call = f"t('{uk_text}', '{ru_text}', '{en_text}')"
        old_call_double = f't("{uk_text}", "{ru_text}", "{en_text}")'
        
        # Find or create translation key
        key = find_or_create_key(uk_text, ru_text, en_text)
        new_call = f"t('{key}')"
        
        # Add to translation files if doesn't exist
        if key not in en_trans:
            # Add to nested structure
            parts = key.split('.')
            if len(parts) == 2:
                section, subkey = parts
                if section not in ua_trans:
                    ua_trans[section] = {}
                if section not in ru_trans:
                    ru_trans[section] = {}
                if section not in en_trans:
                    en_trans[section] = {}
                
                ua_trans[section][subkey] = uk_text
                ru_trans[section][subkey] = ru_text
                en_trans[section][subkey] = en_text
                print(f"   ✅ Added key: {key}")
        
        # Replace in content
        new_content = new_content.replace(old_call, new_call)
        new_content = new_content.replace(old_call_double, new_call)
    
    # Write back
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"   ✅ Updated {file_path}")

# Write updated translation files
with open('client/src/locales/ua.json', 'w', encoding='utf-8') as f:
    json.dump(ua_trans, f, ensure_ascii=False, indent=2)
with open('client/src/locales/ru.json', 'w', encoding='utf-8') as f:
    json.dump(ru_trans, f, ensure_ascii=False, indent=2)
with open('client/src/locales/en.json', 'w', encoding='utf-8') as f:
    json.dump(en_trans, f, ensure_ascii=False, indent=2)

print("\n✅ All files processed and translation files updated!")
