# PIKALEADS CRM System TODO

## Phase 23 - CRM RESTRUCTURE (Current Priority)

### CRM Navigation Structure
- [ ] Create unified CRM layout with sidebar navigation
- [ ] Add 5 main sections:
  * Messengers (Email, Telegram, WhatsApp) with Inbox
  * Leads (with edit, service assignment, convert to sale)
  * Lead Statistics (UTM analytics)
  * Manager Statistics (performance tracking)
  * Sales Statistics (revenue, transactions)
- [ ] Add Services submenu (main services + additional services)
- [ ] Add Sales Scripts submenu (Cold Call, Follow-up, Objection, Closing)

### Language Switcher - Add to ALL pages
- [x] CRM.tsx - DONE
- [x] CRMDashboard.tsx - DONE
- [x] AdminSettings.tsx - DONE
- [x] ServicesManagement.tsx
- [x] SalesStatistics.tsx
- [x] SalesScripts.tsx
- [x] MessagingInbox.tsx

### Dark Theme Design (Black + Purple/Yellow)
- [ ] Apply to CRM.tsx
- [ ] Apply to CRMDashboard.tsx
- [ ] Apply to ServicesManagement.tsx
- [ ] Apply to SalesStatistics.tsx
- [ ] Apply to SalesScripts.tsx
- [ ] Apply to MessagingInbox.tsx

### Connect Existing Features
- [ ] Link Messaging Inbox to CRM navigation
- [ ] Link Services Management to CRM navigation
- [ ] Link Sales Statistics to CRM navigation
- [ ] Link Sales Scripts to CRM navigation
- [ ] Test Edit Lead modal with service selection
- [ ] Test Convert to Sale functionality

### Final Testing
- [ ] Test all navigation flows
- [ ] Test language switching on all pages
- [ ] Test dark theme consistency
- [ ] Create checkpoint v22.0

## Previous Phases (Completed)
- [x] Phase 1-22 completed (see git history)
- [x] Services database created (services, additional_services)
- [x] Sales tracking created (sales table)
- [x] Sales scripts database created (sales_scripts table)
- [x] Edit Lead form with service assignment
- [x] Messaging inbox backend ready
- [x] Admin Settings for API credentials
