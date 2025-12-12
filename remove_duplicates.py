# Read CRM.tsx
with open('client/src/pages/CRM.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find and remove the FIRST occurrence of bulk handlers (the one we just added incorrectly)
# Keep only the SECOND occurrence
import re

# Pattern to match the bulk handlers block
pattern = r'  // Bulk operations mutations\n  const bulkAssignMutation.*?  };\n\n'

# Find all matches
matches = list(re.finditer(pattern, content, re.DOTALL))

if len(matches) >= 2:
    # Remove the first match (keep the second one)
    first_match = matches[0]
    content = content[:first_match.start()] + content[first_match.end():]
    print(f"✅ Removed first duplicate at position {first_match.start()}")
elif len(matches) == 1:
    print("⚠️  Only one occurrence found")
else:
    print("❌ No bulk handlers found")

# Write back
with open('client/src/pages/CRM.tsx', 'w', encoding='utf-8') as f:
    f.write(content)

print("✅ Cleaned up duplicates")
