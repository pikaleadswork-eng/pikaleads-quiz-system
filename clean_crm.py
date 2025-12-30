# Read CRM.tsx
with open('client/src/pages/CRM.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

# Remove lines 170-320 (all bulk operations code)
# Keep everything before line 170 and after line 320
cleaned_lines = lines[:169] + lines[320:]

# Write back
with open('client/src/pages/CRM.tsx', 'w', encoding='utf-8') as f:
    f.writelines(cleaned_lines)

print("✅ Removed all bulk operations code from CRM.tsx")
