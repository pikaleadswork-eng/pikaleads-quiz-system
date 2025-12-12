import re
import os

# Files to fix
files_to_fix = [
    "client/src/components/EditLeadForm.tsx",
    "client/src/pages/AdminSettings.tsx",
    "client/src/pages/SettingsRoles.tsx",
    "client/src/pages/SettingsLeadStatuses.tsx",
    "client/src/pages/ServicesManagement.tsx",
    "client/src/pages/SalesStatistics.tsx",
]

for file_path in files_to_fix:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} - file not found")
        continue
    
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    
    # Fix 1: Add mb-2 to all Label elements that don't have it
    # Pattern: <Label (anything except >) that doesn't contain mb-
    content = re.sub(
        r'<Label\s+([^>]*?)(?<!mb-)(\s*className="([^"]*?)")?([^>]*?)>',
        lambda m: f'<Label {m.group(1)}className="{m.group(3) + " " if m.group(3) else ""}mb-2"{m.group(4)}>',
        content
    )
    
    # Fix 2: Add bg-zinc-800 border-zinc-700 to all Input elements
    content = re.sub(
        r'<Input\s+([^>]*?)(?:className="([^"]*?)")?([^>]*?)/>',
        lambda m: f'<Input {m.group(1)}className="{m.group(2) + " " if m.group(2) else ""}bg-zinc-800 border-zinc-700"{m.group(3)} />',
        content
    )
    
    # Fix 3: Add bg-zinc-800 border-zinc-700 to all Textarea elements
    content = re.sub(
        r'<Textarea\s+([^>]*?)(?:className="([^"]*?)")?([^>]*?)/>',
        lambda m: f'<Textarea {m.group(1)}className="{m.group(2) + " " if m.group(2) else ""}bg-zinc-800 border-zinc-700"{m.group(3)} />',
        content
    )
    
    # Fix 4: Add bg-zinc-800 border-zinc-700 to all Select.Trigger elements
    content = re.sub(
        r'<Select\.Trigger\s+([^>]*?)(?:className="([^"]*?)")?([^>]*?)>',
        lambda m: f'<Select.Trigger {m.group(1)}className="{m.group(2) + " " if m.group(2) else ""}bg-zinc-800 border-zinc-700"{m.group(3)}>',
        content
    )
    
    if content != original_content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✅ Fixed {file_path}")
    else:
        print(f"⏭️  No changes needed in {file_path}")

print("\n✅ All input fields fixed!")
