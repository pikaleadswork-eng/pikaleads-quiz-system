# PIKALEADS CRM System TODO

## Phase 32 - 3-Column Messaging Inbox with Lead Info Panel (CURRENT)

### Database Schema Updates
- [x] Create scheduled_messages table (leadId, channel, message, scheduledAt, status)
- [x] Create scheduled_calls table (leadId, scheduledAt, duration, notes, status)
- [x] Add interaction_history table (leadId, type, channel, message, timestamp)
- [x] Link conversations table to leads (leadId foreign key already exists)

### Backend tRPC Procedures
- [x] messaging.getLeadInfo - Get full lead details by ID
- [x] messaging.updateLeadStatus - Change lead status
- [x] messaging.scheduleMessage - Create scheduled message
- [x] messaging.scheduleCall - Create scheduled call
- [x] messaging.getInteractionHistory - Get all interactions for lead
- [x] messaging.addNote - Add note to lead

### Frontend Components
- [x] Create LeadInfoPanel component (right sidebar)
- [x] Show lead contact details (name, phone, email, telegram)
- [x] Status dropdown with color badges (New/Contacted/Qualified/Won/Lost)
- [x] Schedule Call form (date, time, duration, notes)
- [x] Schedule Message form (channel, message, date/time)
- [x] Interaction history timeline
- [x] Notes section with add/edit functionality

### MessagingInbox Layout Redesign
- [x] Change from 2-column to 3-column layout
- [x] Left: Chat list (25% width)
- [x] Center: Conversation view (50% width)
- [x] Right: Lead info panel (25% width)
- [ ] Link each conversation to leadId (TODO: connect real lead data)
- [x] Show lead info when chat is selected
- [ ] Responsive design for mobile (collapse right panel)

### Integration with Existing CRM
- [ ] Connect EditLeadForm messaging buttons to MessagingInbox
- [ ] Pass leadId when opening chat from CRM
- [ ] Update lead status from MessagingInbox
- [ ] Sync status changes back to CRM table

## Phase 31 - Fix EditLeadForm Styling & Complete ALL Translations (COMPLETED)

### EditLeadForm Styling Fixes
- [x] Add bg-zinc-800 to all Input fields
- [x] Add proper spacing (mb-4) between form sections
- [x] Fix textarea background color
- [x] Add border colors to make fields visible
- [x] Test form visibility on dark background

### Complete CRM Translations
- [ ] Translate "Leads Management" title
- [ ] Translate "UTM Filters" section
- [ ] Translate filter labels (Campaign, Placement, Site, Status)
- [ ] Translate "Clear Filters" button
- [ ] Translate table headers (ID, Date, Source, Quiz, Name, Phone, Email, Telegram, Score, Status, Actions)
- [ ] Translate action buttons (View, Edit, Convert to Sale)
- [ ] Translate "Create Lead Manually" button
- [ ] Translate status badges (New, Contacted, Qualified, Converted, Lost)

### Complete Services Translations
- [ ] Translate "Services Management" title
- [ ] Translate "Main Services" and "Additional Services" section titles
- [ ] Translate table headers (Service Name, Category, Price, Description, Actions)
- [ ] Translate buttons (Add Service, Edit, Delete, Save, Cancel)
- [ ] Translate form labels in Add/Edit Service modal

### Complete Sales Translations
- [ ] Translate "Sales Statistics" title
- [ ] Translate metric cards (Total Revenue, Total Sales, Average Deal Size, Conversion Rate)
- [ ] Translate table headers (Date, Lead Name, Service, Amount, Manager, Status)
- [ ] Translate filter options

### Complete Scripts Translations
- [ ] Translate "Sales Scripts" title
- [ ] Translate category tabs (Cold Call, Follow-up, Objection Handling, Closing)
- [ ] Translate table headers (Title, Category, Last Updated, Actions)
- [ ] Translate buttons (Add Script, Edit, Delete, View, Save, Cancel)

### Complete Settings Translations
- [ ] Translate "Integration Settings" title
- [ ] Translate tab labels (Instagram, WhatsApp, Email, Google Calendar)
- [ ] Translate form labels (API Key, Bot Token, SMTP Host, Port, Username, Password, From Email)
- [ ] Translate buttons (Save Settings, Test Connection)
- [ ] Translate status messages

### Complete AdminDashboard Translations
- [ ] Translate "Admin Dashboard" title
- [ ] Translate all 12 card titles (CRM System, Analytics, Assignment Rules, etc.)
- [ ] Translate card descriptions
- [ ] Translate "Go to" link text

## Previous Phases (Completed)

### Phase 30 - Redesign MessagingInbox (Facebook-style)
- [x] 2-column layout with chat list and conversation view
- [x] Tabs for filtering by channel
- [x] Search functionality
- [x] Message bubbles with timestamps

### Phase 29 - Fix Language Switching & Chat Functionality
- [x] MessagingInbox translations complete
- [x] CRMLayout sidebar translations complete
- [x] Language switcher working

### Phase 28 - Complete Russian Translations
- [x] Added language detection hooks to all pages
- [x] CRM.tsx table headers translated

### Phase 27 - Add Chat Functionality
- [x] ChatWindow component created
- [x] Reply functionality added
- [x] Russian translations for EditLeadForm

### Phase 26 - Fix CRM Issues
- [x] SMTP configuration form
- [x] Edit Lead modal enhancements
- [x] Ukrainian translations

### Phase 25 - Create Unified CRM Layout
- [x] CRMLayout component with sidebar
- [x] All CRM pages integrated
- [x] Dark theme applied

### Phase 24 - Fix Admin Authentication
- [x] Custom email/password authentication
- [x] Admin Dashboard restructured

### Phase 23 - CRM RESTRUCTURE
- [x] Language switcher added to all pages
- [x] Dark theme design
- [x] Connected existing features

### Phases 1-22
- [x] Quiz system (10 quizzes)
- [x] Multi-language support (UA/RU/EN/PL/DE)
- [x] UTM tracking
- [x] Telegram/WhatsApp/Instagram integration
- [x] Manager invitation system
- [x] A/B testing
- [x] Services database
- [x] Sales tracking
- [x] Sales scripts database


## Phase 33 - Final CRM Features: Manager Assignment, IP Telephony, Meetings & Notifications (CURRENT)

### Manager Assignment Tracking
- [x] Add assignedManagerId to conversations table
- [x] Add assignedManagerId to leads table (already exists as 'assignedTo')
- [x] Create tRPC procedure for assigning manager (messaging.assignManager)
- [ ] Show assigned manager in chat list
- [ ] Show assigned manager in lead info panel
- [ ] Add dropdown to assign/change manager
- [ ] Track assignment history in interaction_history

### Zadarma IP Telephony Integration
- [x] Add Zadarma settings to integration_settings table (already exists)
- [x] Create Zadarma API helper functions (initiate call, get call status)
- [x] Add call_logs table (leadId, managerId, phone, duration, status, recordingUrl)
- [x] Create tRPC procedures for Zadarma calls (messaging.initiateCall)
- [x] Add "Call" button with yellow background next to phone number
- [x] Show channel selector (Telegram/Phone/WhatsApp) with icons
- [ ] Implement in-CRM call widget (Zadarma SIP) (requires Zadarma account setup)
- [x] Log all calls to database

### Meeting Scheduling (Google Meet & Zoom)
- [x] Add Google Meet OAuth integration (helper functions created)
- [x] Add Zoom OAuth integration (helper functions created)
- [x] Create meetings table (leadId, managerId, platform, meetingUrl, scheduledAt)
- [x] Create tRPC procedure for scheduling meetings (messaging.scheduleMeeting)
- [x] Add "Schedule Meeting" button in LeadInfoPanel
- [x] Meeting type selector (Google Meet / Zoom)
- [x] Date/time picker for meeting
- [x] Auto-generate meeting link (done in backend)
- [ ] Send meeting link to lead via selected channel (TODO: integrate with messaging)

### Reminder Calendar & Notifications
- [x] Create reminders table (leadId, managerId, type, message, scheduledAt, status)
- [x] Create tRPC procedures (messaging.createReminder, messaging.getUpcomingReminders)
- [ ] Add calendar view for reminders
- [ ] Add "Schedule Reminder" button
- [ ] Implement browser notification when reminder triggers
- [ ] Add sound alert in CRM when time to contact lead
- [ ] Show upcoming reminders in dashboard

### Telegram Bot Notifications
- [x] Create Telegram bot notification function
- [x] Send notification when new lead created (integrated into quiz submission)
- [x] Notification format:
  * Квіз: {quizName}
  * Ім'я: {firstName}
  * Прізвище: {lastName}
  * Телефон: {phone}
  * Telegram: {telegram}
  * Email: {email}
  * UTM мітки: {utmSource, utmMedium, utmCampaign}
  * Менеджер: {assignedManager}
- [ ] Add notification for scheduled call reminders (TODO: create cron job)
- [ ] Add notification for scheduled meeting reminders (TODO: create cron job)

### UI Updates
- [x] Update LeadInfoPanel with call buttons
- [x] Add channel selector UI (Telegram/Phone/WhatsApp icons)
- [x] Style call button with yellow background (#FFD93D)
- [ ] Add manager assignment dropdown (TODO)
- [ ] Show assigned manager badge (TODO)
- [x] Add meeting scheduling modal
- [ ] Add reminder calendar widget (TODO)


## Phase 34 - Translations & Settings Enhancements

### i18n System (Ukrainian/Russian/English)
- [x] Install i18next and react-i18next packages
- [x] Create translation files structure (locales/ua.json, ru.json, en.json)
- [ ] Translate all UI text in MessagingInbox (TODO)
- [ ] Translate all UI text in LeadInfoPanel (TODO)
- [x] Translate all UI text in Settings pages
- [ ] Translate all UI text in Dashboard (TODO)
- [ ] Translate all UI text in Leads page (TODO)
- [ ] Ensure language switcher works 100% (TODO)

### Settings - Roles & Permissions
- [x] Create roles table (name, permissions JSON)
- [x] Create user_invitations table (email, role, token, status)
- [x] Add Settings → Roles page
- [x] List all roles (Admin, Manager, Viewer, Custom)
- [x] Create new role with permission checkboxes
- [ ] Edit existing roles (TODO)
- [x] Delete custom roles
- [x] Invite user with role assignment
- [ ] Send invitation email with signup link (TODO)
- [ ] User signup with role assignment (TODO)

### Settings - Lead Status Management
- [x] Add Settings → Lead Statuses page
- [x] List all current statuses
- [x] Add new status (name, color, order)
- [ ] Edit existing status (TODO)
- [x] Delete status (with warning if leads exist)
- [ ] Reorder statuses (drag & drop) (TODO)
- [x] Set default status for new leads

### Settings - IP Telephony Configuration
- [x] Add Settings → IP Telephony page
- [x] Zadarma configuration form (API key, secret, SIP number)
- [x] Test connection button
- [ ] Show account balance (TODO)
- [ ] Call history settings (TODO)
- [ ] Recording settings (TODO)

### Integration Guides (Multilingual)
- [x] Create guides/zadarma.md (UA/RU/EN) (embedded in UI)
- [x] Create guides/google-meet.md (UA/RU/EN) (embedded in translations)
- [x] Create guides/zoom.md (UA/RU/EN) (embedded in translations)
- [ ] Add screenshots to guides (TODO)
- [x] Link guides from Settings pages
- [x] Add "How to integrate" buttons


## Phase 35 - Complete Translation Integration (100% Coverage)

### Translation Files Enhancement
- [x] Add all missing translations to ua.json (DashboardLayout, CRM, Leads, etc.)
- [x] Add all missing translations to ru.json (DashboardLayout, CRM, Leads, etc.)
- [x] Ensure en.json has all keys

### DashboardLayout Translation
- [x] Add useTranslation hook to CRMLayout (main navigation)
- [x] Translate all menu items (Messaging, Leads, Services, Sales, Scripts, Settings)
- [x] Translate menu descriptions
- [x] Translate logout button

### MessagingInbox Translation
- [x] Add useTranslation hook to MessagingInbox
- [x] Translate page title and subtitle
- [x] Translate channel tabs (All Messages, Telegram, WhatsApp, Email, Instagram)
- [x] Translate search placeholder
- [x] Translate "Select chat" message
- [x] Translate message input placeholder

### LeadInfoPanel Translation
- [x] Add useTranslation hook to LeadInfoPanel
- [x] Translate all section titles (Contact Information, Status, Schedule, Notes, Activity Timeline)
- [x] Translate all field labels (Name, Phone, Email, Telegram, Quiz, Lead Score)
- [x] Translate all buttons (Call, Schedule Call, Schedule Message, Schedule Meeting, Add Note)
- [x] Translate status options (New, Contacted, Qualified, Won, Lost)

### CRM/Leads Page Translation
- [ ] Add useTranslation hook to CRM page
- [ ] Translate page title and description
- [ ] Translate table headers (Source, Quiz, Name, Phone, Email, Status, Score, Date, Actions)
- [ ] Translate filter labels and buttons
- [ ] Translate "Create Lead Manually" button
- [ ] Translate lead sources (Manual, Facebook, Google, etc.)

### AdminSettings Translation
- [ ] Add useTranslation hook to AdminSettings
- [ ] Translate settings categories
- [ ] Add navigation links to Roles, Lead Statuses, IP Telephony pages
- [ ] Translate all settings descriptions

### Other Components Translation
- [ ] AdminDashboard - translate stats cards and titles
- [ ] ServicesManagement - translate service fields
- [ ] SalesStatistics - translate chart labels
- [ ] SalesScripts - translate script fields
- [ ] AdminCalendar - translate calendar labels


## Phase 36 - Fix Dialog Spacing & Rich Text Editor for Scripts

### Dialog Form Spacing Fixes
- [x] Fix Services "Create New Service" dialog - add proper padding, fix placeholder overlap
- [x] Fix Services "Create Additional Service" dialog - same spacing issues
- [x] Fix Scripts "Create New Script" dialog - add proper spacing
- [x] Fix Leads "Edit Lead" dialog - fix "Запишіть порожньки" text overlap
- [x] Ensure all Input/Textarea fields have proper label spacing (mb-2)
- [x] Ensure all placeholder texts are visible and don't overlap with input content

### Rich Text Editor Implementation
- [x] Install @tiptap/react, @tiptap/starter-kit, @tiptap/extension-image
- [x] Create RichTextEditor component with toolbar (Bold, Italic, Headings, Lists, Images)
- [x] Add formatting buttons with icons
- [x] Add image upload functionality
- [x] Style editor to match dark theme

### Scripts Page Redesign
- [x] Replace simple textarea with TipTap rich text editor
- [ ] Add script templates (Cold Call, Follow-up, Objection Handling) (TODO: future enhancement)
- [ ] Add tags system for scripts (TODO: future enhancement)
- [ ] Add script preview mode (TODO: future enhancement)
- [x] Improve category management (already has 4 categories)
- [ ] Add search and filter by tags (TODO: future enhancement)
- [ ] Add script duplication feature (TODO: future enhancement)


## Phase 37 - Manager Assignment, Translations & Sales Filters

### AdminSettings - Links to New Settings Pages
- [x] Add card/link to Settings → Roles & Permissions (UA/RU/EN)
- [x] Add card/link to Settings → Lead Statuses (UA/RU/EN)
- [x] Add card/link to Settings → IP Telephony (UA/RU/EN)
- [x] Add multilingual descriptions for each settings section

### Manager Assignment System
- [ ] Add manager dropdown in LeadInfoPanel
- [ ] Add manager dropdown in MessagingInbox chat list
- [ ] Show current assigned manager with badge
- [ ] Implement automatic manager assignment on lead creation (round-robin)
- [ ] Log manager changes to interaction_history table
- [ ] Add tRPC procedure for changing assigned manager
- [ ] Update lead assignment when manager is changed

### CRM/Leads Page Translations
- [ ] Translate table headers (ID, Date, Source, Name, Phone, etc.)
- [ ] Translate filter labels (UTM Filters, Campaign, Placement, etc.)
- [ ] Translate status badges (New, Contacted, Qualified, Won, Lost)
- [ ] Translate "Create Lead Manually" button and form
- [ ] Translate all form fields in create lead dialog
- [ ] Add useTranslation hook to CRM.tsx

### Sales Page Filters
- [ ] Add Source filter dropdown (quiz, manual, import, all)
- [ ] Add Manager filter dropdown (all managers + "All")
- [ ] Add Time period filter with options:
  - [ ] Today
  - [ ] Yesterday
  - [ ] 3 days ago
  - [ ] 7 days ago
  - [ ] 14 days ago
  - [ ] 30 days ago
  - [ ] All time
  - [ ] Custom (date range picker)
- [ ] Update tRPC procedure to accept filter parameters
- [ ] Add translations for all filter options (UA/RU/EN)


## Phase 38 - FIX LANGUAGE SWITCHING 100% (URGENT)

### Problem
- Language switcher shows "Українська" but text is mixed (RU/EN/UA)
- useTranslation() hook NOT added to most components
- Hardcoded text in CRM, Services, Sales, Scripts, AdminSettings

### CRM Page Translation (PRIORITY 1)
- [ ] Add useTranslation hook to CRM.tsx
- [ ] Translate "Leads Management" title
- [ ] Translate "Manage your leads and communicate with clients" subtitle
- [ ] Translate "UTM Filters" section
- [ ] Translate filter labels (Campaign, Ad Group, Ad, Placement, Keyword, Site)
- [ ] Translate dropdown options (All campaigns, All ad groups, All ads, All keywords, All sites)
- [ ] Translate "Clear Filters" button
- [ ] Translate table headers (ID, Date, Source, Quiz, Name, Phone, UTM Campaign, UTM Source, UTM Medium, Score, Status, Actions)
- [ ] Translate "Create Lead Manually" button
- [ ] Translate action buttons (View, Edit)
- [ ] Translate status badges (New)

### Services Page Translation (PRIORITY 2)
- [ ] Add useTranslation hook to ServicesManagement.tsx
- [ ] Translate "Services Management" title
- [ ] Translate "Manage your services and pricing" subtitle
- [ ] Translate "Main Services" section title
- [ ] Translate "Additional Services" section title
- [ ] Translate table headers (Name, Type, Price, Status, Actions)
- [ ] Translate "Add Service" button
- [ ] Translate "Add Additional Service" button
- [ ] Translate dialog titles and form labels

### Sales Page Translation (PRIORITY 2)
- [ ] Add useTranslation hook to SalesStatistics.tsx
- [ ] Translate "Sales Statistics" title
- [ ] Translate metric cards (Total Revenue, Total Sales, Average Deal Size, Conversion Rate)
- [ ] Translate table headers (Date, Lead Name, Service, Amount, Manager, Status)
- [ ] Translate status labels

### Scripts Page Translation (PRIORITY 2)
- [ ] Add useTranslation hook to SalesScripts.tsx
- [ ] Translate "Sales Scripts" title
- [ ] Translate "Manage your sales scripts and templates" subtitle
- [ ] Translate "Filter by Category" label
- [ ] Translate category options (All Categories, Cold Call, Follow-up, Objection Handling, Closing)
- [ ] Translate table headers (Title, Category, Last Updated, Actions)
- [ ] Translate "Create Script" button
- [ ] Translate dialog form labels

### AdminSettings Translation (PRIORITY 3)
- [ ] Add useTranslation hook to AdminSettings.tsx
- [ ] Translate all settings card titles
- [ ] Translate all settings card descriptions
- [ ] Translate "Go to" link text

### Testing
- [ ] Test Ukrainian language on all pages
- [ ] Test Russian language on all pages
- [ ] Test English language on all pages
- [ ] Verify language switcher updates all text immediately
- [ ] Verify no hardcoded text remains


## UI/UX Fixes (Reported Dec 12, 2025)

### CRM Page Filters
- [ ] Add Manager filter dropdown to CRM page
- [ ] Add Source filter dropdown to CRM page  
- [ ] Add Date filter with modern popup design (icon + date range picker)
- [ ] Make filters more compact and user-friendly
- [ ] Show active date filter visibly

### Input Field Visibility Issues
- [ ] Fix EditLeadForm - add bg-zinc-800 to all input fields
- [ ] Fix EditLeadForm - add mb-2 spacing to all Label elements
- [ ] Fix Services dialog - add bg-zinc-800 to all input fields
- [ ] Fix Services dialog - add mb-2 spacing to all Label elements
- [ ] Fix Roles dialog - add bg-zinc-800 to all input fields
- [ ] Fix Roles dialog - add mb-2 spacing to all Label elements
- [ ] Fix Lead Statuses dialog - add bg-zinc-800 to all input fields
- [ ] Fix Lead Statuses dialog - add mb-2 spacing to all Label elements

### Roles Management
- [ ] Replace JSON editor with checkbox-based permissions UI
- [ ] Add checkboxes for each permission (leads: read/write, messaging: read/write, etc.)
- [ ] Make role creation user-friendly without code editing

### Lead Statuses CRUD
- [ ] Enable Edit functionality for existing statuses
- [ ] Enable Create functionality for new statuses
- [ ] Enable Delete functionality for statuses
- [ ] Fix input field backgrounds in status dialogs
- [ ] Fix label spacing in status dialogs

## Completed Items (Dec 12, 2025)

- [x] Add Manager filter dropdown to CRM page
- [x] Add Source filter dropdown to CRM page  
- [x] Add Date filter with modern popup design (icon + date range picker)
- [x] Make filters more compact and user-friendly
- [x] Show active date filter visibly
- [x] Fix EditLeadForm - add bg-zinc-800 to all input fields
- [x] Fix EditLeadForm - add mb-2 spacing to all Label elements
- [x] Fix Services dialog - add bg-zinc-800 to all input fields
- [x] Fix Services dialog - add mb-2 spacing to all Label elements
- [x] Fix Roles dialog - add bg-zinc-800 to all input fields
- [x] Fix Roles dialog - add mb-2 spacing to all Label elements
- [x] Fix Lead Statuses dialog - add bg-zinc-800 to all input fields
- [x] Fix Lead Statuses dialog - add mb-2 spacing to all Label elements
- [x] Replace JSON editor with checkbox-based permissions UI
- [x] Add checkboxes for each permission (leads: read/write, messaging: read/write, etc.)
- [x] Make role creation user-friendly without code editing
- [x] Enable Edit functionality for existing statuses
- [x] Enable Create functionality for new statuses
- [x] Enable Delete functionality for statuses
- [x] Fix input field backgrounds in status dialogs
- [x] Fix label spacing in status dialogs
