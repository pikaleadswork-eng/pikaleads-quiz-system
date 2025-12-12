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


## Phase 24 - Fix Admin Authentication & Navigation

### Fix AdminDashboard Authentication
- [x] Replace OAuth with useAuth() hook in AdminDashboard.tsx
- [x] Add admin role check
- [x] Redirect to /login if not authenticated
- [x] Test login flow works

### Restructure Admin Navigation
- [x] Add "Services" card to AdminDashboard
- [x] Add "Sales Scripts" card to AdminDashboard
- [x] Add "Sales Statistics" card to AdminDashboard
- [x] Update card links to match CRM structure
- [x] Add language switcher to AdminDashboard

### Remove Duplicates
- [ ] Remove /crm-dashboard route (keep /admin as main)
- [ ] Update all links that point to /crm-dashboard
- [ ] Test all navigation flows

### Final Testing
- [ ] Test admin login
- [ ] Test all admin cards navigation
- [ ] Create checkpoint v23.0


## Phase 25 - Create Unified CRM Layout with Sidebar

### Create CRMLayout Component
- [x] Create CRMLayout.tsx with sidebar navigation
- [x] Add 6 main sections to sidebar:
  * Messaging Inbox
  * Leads Management
  * Services Management
  * Sales Statistics
  * Sales Scripts
  * Settings
- [x] Apply dark theme (black + purple/yellow)
- [x] Add language switcher to header
- [x] Add user profile section

### Integrate All CRM Pages
- [x] Wrap CRM.tsx in CRMLayout
- [x] Wrap MessagingInbox.tsx in CRMLayout
- [x] Wrap ServicesManagement.tsx in CRMLayout
- [x] Wrap SalesStatistics.tsx in CRMLayout
- [x] Wrap SalesScripts.tsx in CRMLayout
- [x] Wrap AdminSettings.tsx in CRMLayout

### Test & Polish
- [x] Test sidebar navigation works
- [x] Test all pages load correctly
- [x] Verify dark theme consistency
- [ ] Create checkpoint v24.0


## Phase 26 - Fix CRM Issues (Email, Edit Lead, Translations)

### Issue 1: Email Configuration
- [x] Add SMTP configuration form to AdminSettings.tsx
- [x] Add fields: SMTP Host, Port, Username, Password, From Email
- [x] Add backend procedure to save SMTP credentials
- [ ] Test SMTP connection

### Issue 2: Edit Lead Modal Enhancements
- [x] Add "Send Message" section with Telegram/WhatsApp/Email buttons
- [x] Add manual amount input field (override calculated price)
- [x] Add Additional Services multi-select dropdown
- [x] Update total calculation to include additional services
- [x] Style buttons with messenger icons

### Issue 3: Ukrainian Translations
- [x] Translate EditLeadForm fields (Name, Phone, Email, Telegram, etc.)
- [x] Translate Service Assignment section
- [x] Translate buttons (Update Lead, Convert to Sale, Cancel)
- [ ] Translate CRM table headers
- [ ] Translate Settings page

### Testing
- [x] Test SMTP form saves correctly
- [x] Test Edit Lead with all new features
- [x] Test Ukrainian translations display correctly
- [ ] Create checkpoint v25.0


## Phase 27 - Add Chat Functionality & Russian Translations

### Chat Window Component
- [x] Create ChatWindow.tsx component
- [x] Add conversation view (messages from both sides)
- [x] Add message bubbles (sent/received styling)
- [x] Add timestamp display
- [x] Add sender info (name, channel icon)
- [x] Add scroll to bottom functionality

### Reply Functionality
- [x] Add message input field at bottom
- [x] Add "Send" button
- [x] Add backend procedure to send messages
- [x] Connect to Telegram/WhatsApp/Email APIs
- [x] Show sending status (pending/sent/failed)

### Integration
- [x] Add "View Chat" button in MessagingInbox table
- [x] Open chat window as modal/sidebar
- [x] Load conversation history for selected contact
- [x] Update message list after sending
- [ ] Add unread message indicators

### Russian Translations
- [x] Translate EditLeadForm to Russian
- [ ] Translate CRM table headers to Russian
- [ ] Translate MessagingInbox to Russian
- [ ] Translate Settings page to Russian
- [ ] Translate AdminDashboard to Russian

### Testing
- [x] Test chat window opens correctly
- [x] Test message sending works
- [x] Test conversation history loads
- [x] Test Russian translations display
- [ ] Create checkpoint v26.0
