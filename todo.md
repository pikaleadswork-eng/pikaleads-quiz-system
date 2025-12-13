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

## Translation Issues (Dec 12, 2025 - CRITICAL)

### Problems Reported:
- [ ] Ukrainian language selected but displays Russian text
- [ ] Russian language option shows English text (mixed languages)
- [ ] MessagingInbox page not translated at all
- [ ] CRM page not fully translated
- [ ] Admin pages not translated
- [ ] DashboardLayout sidebar menu not translated (Сообщения, Ліди, etc.)
- [ ] Missing translations for headers, subheaders, buttons, popups
- [ ] Language switcher doesn't work properly

### Components Missing Translation Integration:
- [ ] DashboardLayout.tsx - sidebar menu items
- [ ] MessagingInbox.tsx - all UI text
- [ ] CRM.tsx - headers, buttons, table columns
- [ ] EditLeadForm.tsx - form labels and buttons
- [ ] AdminDashboard.tsx - all content
- [ ] AdminAnalytics.tsx - all content
- [ ] AdminCalendar.tsx - all content
- [ ] CRMDashboard.tsx - all content
- [ ] SalesStatistics.tsx - filters and labels
- [ ] All other admin pages

### Required Actions:
- [ ] Fix language detection logic (uk should show Ukrainian, not Russian)
- [ ] Add complete translation keys for ALL components
- [ ] Add useTranslation() to ALL components
- [ ] Replace ALL hardcoded text with t() calls
- [ ] Test language switching on every page

## Phase 40 - Translation System Complete (Dec 12)
- [x] Fixed language code mismatch (ua → uk)
- [x] Added comprehensive translation keys for admin panel
- [x] Integrated useTranslation into EditLeadForm
- [x] Added useTranslation to AdminDashboard, CRMDashboard, AdminAnalytics, AdminCalendar, AdminManagers, AdminPerformance
- [x] Fixed duplicate useTranslation imports
- [x] Tested language switching - Ukrainian displays correctly
- [x] Homepage fully translated
- [x] CRM sidebar menu translated
- [x] MessagingInbox translated

## Translation Coverage Status
- ✅ Homepage (Home.tsx)
- ✅ CRM Layout (CRMLayout.tsx) - sidebar menu
- ✅ CRM Leads Management (CRM.tsx)
- ✅ Messaging Inbox (MessagingInbox.tsx)
- ✅ Sales Scripts (SalesScripts.tsx)
- ✅ Services Management (ServicesManagement.tsx)
- ✅ Settings pages (SettingsRoles, SettingsLeadStatuses, SettingsIntegrations, SettingsTelephony, SettingsMessaging)
- ✅ Edit Lead Form (EditLeadForm.tsx)
- ⚠️ AdminDashboard, CRMDashboard, AdminAnalytics, etc. - have useTranslation but need text replacement
- ❌ Quiz pages (not needed for admin panel)

## Phase 41 - CRM Enhancements (Dec 12)
- [x] Connect Manager filter to backend (trpc.crm.getLeads)
- [x] Connect Source filter to backend (trpc.crm.getLeads)
- [x] Connect Date Range filter to backend (trpc.crm.getLeads)
- [x] Update CRM.tsx to pass filter parameters to query
- [x] Complete AdminDashboard.tsx translations
- [x] Complete CRMDashboard.tsx translations
- [ ] Complete AdminAnalytics.tsx translations
- [ ] Complete AdminCalendar.tsx translations
- [ ] Complete AdminManagers.tsx translations
- [ ] Complete AdminPerformance.tsx translations
- [ ] Add checkbox column to leads table
- [ ] Add "Select All" checkbox in table header
- [ ] Add bulk actions toolbar (appears when leads selected)
- [ ] Implement bulk assign manager action
- [ ] Implement bulk change status action
- [ ] Implement bulk delete action
- [ ] Add confirmation dialogs for bulk operations
- [ ] Test all filters work correctly
- [ ] Test all translations display properly
- [ ] Test bulk operations work correctly

## Phase 41 - CRM Enhancements (Completed)
- [x] Connect CRM filters to backend (Manager, Source, Date Range)
- [x] Complete admin page translations (AdminDashboard, CRMDashboard)
- [x] Implement bulk lead operations
  - [x] Add checkbox column to leads table
  - [x] Add Select All checkbox in header
  - [x] Add bulk actions toolbar
  - [x] Add bulk assign manager functionality
  - [x] Add bulk change status functionality
  - [x] Add bulk delete functionality
  - [x] Add bulk actions dialog
  - [x] Add translation keys for bulk operations

## Critical Issues (Reported Dec 12)
- [ ] Language switching NOT working - Ukrainian/Russian/English switcher doesn't change UI text
- [ ] Input field spacing issues in ALL admin sections - labels overlap with input fields
- [ ] Input field visibility issues in ALL admin sections - black background fields blend with black page background
- [ ] CRM filters redesign - merge UTM filters into main filter popover instead of separate section

## Testing Results (Dec 12, 2025)

### ✅ Fixed Issues:
- [x] Input fields spacing - all labels have mb-2
- [x] Input fields backgrounds - all inputs have bg-zinc-800 and visible borders
- [x] Homepage button translations - "Learn More" translates correctly
- [x] CRM filters backend - Manager, Source, Date Range connected to trpc.crm.getLeads

### ❌ Remaining Issues:
- [ ] CRM page translations - sidebar, headers, table, buttons all in English
- [ ] Settings page translations - all text in English
- [ ] UTM filters - still separate section, need to merge into main Filters popover
- [ ] CRMLayout translations not working despite using t() calls

### Next Steps:
1. Manually add useTranslation() to CRM.tsx
2. Manually add useTranslation() to Settings pages
3. Debug why CRMLayout t() calls don't work
4. Merge UTM filters into main filter popover

## Phase 43 Tasks (Dec 12, 2025)

- [ ] Fix duplicate className in SettingsLeadStatuses.tsx (lines 215, 225)
- [ ] Fix duplicate className in SettingsRoles.tsx (lines 191, 201)
- [ ] Add useTranslation() to CRM.tsx
- [ ] Translate CRM sidebar menu items
- [ ] Translate CRM page headers and subtitles
- [ ] Translate CRM table headers
- [ ] Translate CRM buttons (View, Edit, Create Lead Manually)
- [ ] Merge UTM filters into main Filters popover
- [ ] Test language switching in browser
- [ ] Save checkpoint


## Phase 45: Complete Multilingual Admin Panel + Advanced CRM Features

### Translate Remaining Admin Pages
- [ ] Translate Services page (add useTranslation integration)
- [ ] Translate Sales page (add useTranslation integration)
- [ ] Translate Scripts page (add useTranslation integration)
- [ ] Translate Messaging page (add useTranslation integration)
- [ ] Add missing translation keys to uk.json, ru.json, en.json

### Bulk Actions for Leads
- [ ] Add checkbox column to leads table
- [ ] Add "Select All" checkbox in table header
- [ ] Create bulk action toolbar (appears when items selected)
- [ ] Implement "Assign Manager" bulk operation
- [ ] Implement "Change Status" bulk operation
- [ ] Implement "Export Selected" bulk operation (CSV/Excel)
- [ ] Add translations for bulk actions UI

### Lead Detail Modal
- [ ] Create LeadDetailModal component
- [ ] Add conversation history section with all messages
- [ ] Display all UTM parameters in organized view
- [ ] Show lead score breakdown with explanation
- [ ] Add activity timeline (calls, messages, status changes)
- [ ] Add edit capabilities within modal
- [ ] Add translations for modal content (UA/RU/EN)

### Filter Presets/Saved Views
- [ ] Create filter_presets table (userId, name, filters JSON, isDefault)
- [ ] Add "Save Current Filters" button to CRM page
- [ ] Create preset management UI (save, rename, delete)
- [ ] Add preset dropdown for quick access
- [ ] Implement default presets (High-value leads, This week, New leads)
- [ ] Add translations for preset UI
- [ ] Store user-specific presets in database


### Phase 45 Progress Update ($(date))
- [x] Translate Services page (add useTranslation integration) - 37 strings replaced
- [x] Translate Sales page (add useTranslation integration) - 18 strings replaced
- [x] Translate Scripts page (add useTranslation integration) - 31 strings replaced
- [x] Translate Messaging page (add useTranslation integration) - 10 strings replaced
- [x] Add missing translation keys to uk.json, ru.json, en.json


## Phase 2: Bulk Actions - COMPLETED ✅
- [x] Add selectedLeadIds state and bulk action handlers
- [x] Add checkbox column to table header (select all)
- [x] Add checkbox to each table row (individual selection)
- [x] Create floating bulk actions bar at bottom
- [x] Implement exportSelectedToCSV function
- [x] Implement bulkAssignManager function
- [x] Implement bulkChangeStatus function
- [x] Add bulk actions translations (uk/ru/en)
- [x] Test bulk actions in browser - all working!

## Phase 3: Lead Detail Modal - IN PROGRESS 🚧
- [ ] Create LeadDetailModal component
- [ ] Add full conversation history section
- [ ] Add complete UTM parameters display
- [ ] Add lead score breakdown visualization
- [ ] Add activity timeline with all interactions
- [ ] Add translations for modal
- [ ] Wire modal to "View" button in table


## Phase 3: Lead Detail Modal - COMPLETED ✅
- [x] Create LeadDetailModal component with 4 tabs
- [x] Add Overview tab with contact info and lead score breakdown
- [x] Add Conversations tab for message history
- [x] Add UTM Data tab with all UTM parameters
- [x] Add Timeline tab with activity chronology
- [x] Add translations for modal (uk/ru/en)
- [x] Wire modal to View button in CRM table
- [x] Test all tabs - working perfectly!

## Phase 4: Filter Presets/Saved Views - IN PROGRESS 🚧
- [ ] Create FilterPresets component
- [ ] Add "Save Current Filters" button
- [ ] Add preset dropdown next to Filters button
- [ ] Implement save preset functionality
- [ ] Implement load preset functionality
- [ ] Implement delete preset functionality
- [ ] Store presets in database
- [ ] Add translations for presets


## Phase 5: Complete Filter Presets UI - IN PROGRESS 🚧
- [ ] Add preset dropdown next to Filters button
- [ ] Add "Save Current Filters" button
- [ ] Create SavePresetDialog component
- [ ] Implement load preset functionality
- [ ] Implement delete preset functionality
- [ ] Add translations for preset UI elements
- [ ] Test saving and loading presets

## Phase 6: Lead Assignment Automation - PENDING ⏳
- [ ] Create assignment rules UI in Settings
- [ ] Add rule conditions (source, campaign, workload)
- [ ] Implement auto-assignment logic in backend
- [ ] Add assignment history tracking
- [ ] Test automation with different rules

## Phase 7: Analytics Dashboard - PENDING ⏳
- [ ] Create Analytics page component
- [ ] Add conversion rate charts by source/campaign
- [ ] Add manager performance metrics
- [ ] Add revenue trends visualization
- [ ] Add date range selector for analytics
- [ ] Add export analytics data functionality


## Bug Fixes - COMPLETED ✅
- [x] Fix Filters popover scrolling - add max-height and overflow-y-auto


## Phase 6: Lead Assignment Automation - IN PROGRESS 🚀
- [ ] Create assignmentRules table in schema.ts
- [ ] Add tRPC procedures for assignment rules CRUD
- [ ] Create Settings → Lead Assignment page
- [ ] Implement rule types: workload-based, source-based, campaign-based
- [ ] Add automatic assignment logic when lead is created
- [ ] Add translations for assignment settings
- [ ] Test automatic assignment with different rules

## Phase 7: Analytics Dashboard - PENDING ⏳
- [ ] Create Analytics page with navigation
- [ ] Add conversion rate charts by source/campaign
- [ ] Add manager performance metrics
- [ ] Add revenue trends visualization
- [ ] Implement date range selector
- [ ] Add export analytics data functionality
- [ ] Add translations for analytics page


## Phase 8: Complete Lead Assignment UI - COMPLETED ✅
- [x] Add assignmentRules translations to uk.json
- [x] Add assignmentRules translations to ru.json
- [x] Add assignmentRules translations to en.json
- [x] Add route to App.tsx for /admin/settings/lead-assignment
- [x] Add navigation card in AdminSettings page
- [x] Fix common.create translation
- [x] Test Lead Assignment page loads correctly
- [ ] Test creating assignment rule (next)
- [ ] Test activating/deactivating rule (next)
- [ ] Test rule with real lead (next)

## Phase 9: Comprehensive Analytics Dashboard Rebuild - IN PROGRESS 🚀
- [x] Install Chart.js and react-chartjs-2
- [x] Add analytics translations to uk.json (title, filters, metrics, charts)
- [x] Add analytics translations to ru.json
- [x] Add analytics translations to en.json
- [x] Extend leads schema with spent_amount and time_on_site fields
- [x] Create comprehensive analytics backend (getAnalyticsData with filters)
- [x] Calculate ROMI (Return on Marketing Investment)
- [x] Calculate ROAS (Return on Ad Spend)
- [x] Calculate conversion rates by source/campaign/quiz
- [x] Calculate average time on site
- [x] Rebuild AdminAnalytics.tsx with filter panel
- [x] Add date range filter (today/week/month/custom)
- [x] Add quiz filter dropdown
- [x] Add source filter dropdown
- [x] Add campaign filter dropdown
- [x] Create Chart.js: Leads by Source (bar chart)
- [x] Create Chart.js: Conversion Funnel (funnel chart)
- [x] Create Chart.js: Revenue Trends (line chart)
- [x] Add detailed table: Top Campaigns (with ROMI/ROAS)
- [x] Add detailed table: Top Ads (with conversion rate)
- [x] Add detailed table: Top Keywords (with click-through rate)
- [x] Add summary cards (Total Leads, Conversion %, ROMI, ROAS, Avg Time)
- [x] Test all filters work correctly
- [x] Verify translations in all 3 languages

## Phase 10: Filter Preset Management - PENDING ⏳
- [ ] Add delete button to preset dropdown items
- [ ] Add confirmation dialog for preset deletion
- [ ] Add rename button to preset dropdown items
- [ ] Add rename dialog with input field
- [ ] Update tRPC procedures if needed
- [ ] Add translations for delete/rename actions
- [ ] Test delete preset functionality
- [ ] Test rename preset functionality


## Phase 11: Real-time Analytics Auto-Refresh - COMPLETED ✅
- [x] Add useEffect hook with 30-second interval for auto-refresh
- [x] Add visual indicator showing last update time
- [x] Add pause/resume button for auto-refresh
- [x] Preserve filter state during auto-refresh
- [x] Test auto-refresh works correctly
- [x] Verify no memory leaks from interval cleanup


## Phase 12: Language Switcher + Period Comparison + Email Reports - IN PROGRESS 🚀
- [x] Wrap AdminAnalytics page with DashboardLayout for language switcher
- [x] Add "Compare with previous period" toggle to filters
- [x] Calculate percentage changes for all metrics (vs previous period)
- [x] Add up/down arrows with green/red colors for metric changes
- [ ] Add comparison data to charts (previous period as dashed line)
- [x] Create email report backend procedure (admin.sendAnalyticsReport)
- [x] Create email template with key metrics
- [x] Add "Send Report" button to analytics page
- [x] Add translations for email report feature
- [ ] Test language switcher works on analytics page
- [ ] Test period comparison calculations are correct
- [ ] Test email reports are sent successfully


## Phase 13: Fix Admin Pages Layout & Translations - IN PROGRESS 🚀
- [x] Wrap AdminPerformance with DashboardLayout
- [x] Add performance page translations to uk.json
- [x] Add performance page translations to ru.json
- [x] Add performance page translations to en.json
- [x] Wrap AdminCalendar with DashboardLayout
- [x] Add calendar page translations to uk.json
- [x] Add calendar page translations to ru.json
- [x] Add calendar page translations to en.json
- [x] Test all admin pages have language switcher
- [x] Verify all translations work correctly


## Phase 14: Fix AdminScripts & AdminQuizzes + Export + Webhooks - IN PROGRESS 🚀

### AdminScripts & AdminQuizzes Fixes
- [x] Wrap AdminScripts with DashboardLayout
- [x] Add scripts page translations (UK/RU/EN)
- [x] Wrap AdminQuizzes with DashboardLayout
- [x] Add quizzes page translations (UK/RU/EN)
- [x] Fix AdminQuizzes responsive design (mobile/tablet)
- [x] Test all breakpoints work correctly

### Marquiz Research & Quiz Management
- [x] Research Marquiz quiz builder features
- [x] Document question types (single/multiple choice, text, image)
- [x] Document answer types (text, images, conditional logic)
- [x] Plan quiz editor improvements based on Marquiz

### Analytics Export
- [x] Add Excel export button to analytics page
- [x] Implement Excel generation with metrics and charts
- [x] Add PDF export button to analytics page
- [x] Implement PDF generation with formatted report
- [x] Test export functionality

### Webhook Integrations
- [ ] Create webhook settings page
- [ ] Add HubSpot webhook configuration
- [ ] Add Salesforce webhook configuration
- [ ] Implement webhook sending on new lead
- [ ] Add webhook retry logic
- [ ] Test webhook integrations


## Phase 15: Language Switcher + Webhooks + Advanced Quiz Editor + A/B Testing - IN PROGRESS 🚀

### Language Switcher Fix
- [x] Add language switcher to DashboardLayout header
- [x] Add language switcher to sidebar footer for desktop
- [x] Add language switcher to mobile header
- [x] Test language switcher on all admin pages
- [x] Verify translations work correctly

### Webhook Integrations
- [x] Create webhooks table in database schema
- [x] Add webhook backend procedures (create, update, delete, test)
- [x] Create AdminWebhooks page (/admin/webhooks)
- [x] Add webhook list with status indicators
- [x] Add webhook configuration form (URL, headers, events)
- [x] Add HubSpot preset configuration
- [x] Add Salesforce preset configuration
- [x] Add custom webhook configuration
- [x] Add webhook test button
- [x] Add translations for webhooks page (UK)
- [x] Add translations for webhooks page (RU/EN)
- [x] Add webhook route to App.tsx
- [ ] Create webhook trigger on new lead creation
- [ ] Add HubSpot API integration helper
- [ ] Add Salesforce API integration helper
- [ ] Add webhook logs viewer
- [ ] Implement HubSpot webhook integration
- [ ] Implement Salesforce webhook integration
- [ ] Add webhook testing functionality
- [ ] Add webhook logs/history
- [ ] Test webhook delivery on new lead

### Advanced Quiz Editor
- [ ] Add image-based choices question type
- [ ] Add slider question type
- [ ] Add rating question type
- [ ] Add file upload question type
- [ ] Add date/time picker question type
- [ ] Implement conditional logic (question branching)
- [ ] Add scoring system for questions
- [ ] Test new question types in quiz builder

### A/B Testing
- [ ] Create A/B test configuration UI
- [ ] Add variant creation functionality
- [ ] Implement traffic splitting logic
- [ ] Add conversion tracking per variant
- [ ] Create A/B test results dashboard
- [ ] Add automatic winner selection
- [ ] Test A/B testing flow end-to-end


### Advanced Quiz Editor
- [x] Extend quiz schema with new question types (quizzes, quiz_questions, quiz_answer_options)
- [x] Push database schema changes
- [x] Create quiz editor backend router (CRUD for quizzes, questions, options)
- [x] Add quizEditor router to appRouter
- [ ] Create quiz editor UI page
- [ ] Add conditional logic fields to questions (show_if, hide_if)
- [ ] Add question branching/skip logic
- [ ] Create image upload for question options
- [ ] Add slider question type component
- [ ] Add rating (stars) question type component
- [ ] Add file upload question type component
- [ ] Add image choice question type component
- [ ] Add conditional logic editor UI
- [ ] Add question branching visual editor
- [ ] Add translations for new question types (UK/RU/EN)
- [ ] Test all new question types work correctly

### A/B Testing
- [ ] Create quiz_variants table in database schema
- [ ] Add variant tracking fields (impressions, conversions, revenue)
- [ ] Add backend procedures for variant management
- [ ] Add automatic traffic splitting logic
- [ ] Create A/B test creation UI
- [ ] Add variant performance comparison charts
- [ ] Add statistical significance calculator
- [ ] Add winner declaration functionality
- [ ] Add translations for A/B testing (UK/RU/EN)
- [ ] Test A/B testing functionality


## Phase 16: Comprehensive Translation Testing - IN PROGRESS 🚀
- [ ] Test Analytics page (UK/RU/EN) - all metrics, filters, charts
- [ ] Test Performance page (UK/RU/EN) - all text elements
- [ ] Test Calendar page (UK/RU/EN) - all text elements
- [ ] Test Scripts page (UK/RU/EN) - all text elements
- [ ] Test Quizzes page (UK/RU/EN) - all text elements
- [ ] Test Webhooks page (UK/RU/EN) - all text elements
- [ ] Test CRM page (UK/RU/EN) - all text elements
- [ ] Test Settings pages (UK/RU/EN) - all text elements
- [ ] Fix any untranslated elements found
- [ ] Fix any alignment/layout issues
- [ ] Document all fixes made
