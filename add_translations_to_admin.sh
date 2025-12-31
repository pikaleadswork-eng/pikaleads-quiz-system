#!/bin/bash

# List of admin files to update (only those that exist and need translation)
FILES=(
  "client/src/pages/AdminDashboard.tsx"
  "client/src/pages/CRMDashboard.tsx"
  "client/src/pages/AdminAnalytics.tsx"
  "client/src/pages/AdminCalendar.tsx"
  "client/src/pages/AdminManagers.tsx"
  "client/src/pages/AdminPerformance.tsx"
)

for file in "${FILES[@]}"; do
  if [ -f "$file" ]; then
    # Check if already has useTranslation
    if ! grep -q "useTranslation" "$file"; then
      # Add import after other imports
      sed -i '/^import.*from.*;$/a import { useTranslation } from "react-i18next";' "$file" | head -1
      
      # Add const { t } = useTranslation(); after function declaration
      sed -i '/^export default function/a \  const { t } = useTranslation();' "$file"
      
      echo "✅ Added useTranslation to $file"
    else
      echo "⏭️  Skipped $file (already has useTranslation)"
    fi
  else
    echo "❌ File not found: $file"
  fi
done

echo ""
echo "✅ Finished adding useTranslation hooks!"
