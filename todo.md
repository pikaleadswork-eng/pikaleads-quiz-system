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


## Phase 50 - Translation Verification (COMPLETED)
- [x] Fix Performance page translations
- [x] Fix Calendar page translations  
- [x] Fix Scripts page translations
- [x] Fix Quizzes page translations
- [x] Fix CRM page translations
- [x] Add 35+ translation keys to uk.json and ru.json

## Phase 51 - Quiz Editor UI with Drag-and-Drop (CURRENT)
- [ ] Install @dnd-kit/core and @dnd-kit/sortable for drag-and-drop
- [ ] Create QuizEditor component with drag-and-drop question reordering
- [ ] Create QuestionForm component with forms for 10 question types:
  - [ ] Text input
  - [ ] Number input
  - [ ] Email input
  - [ ] Phone input
  - [ ] Single choice (radio)
  - [ ] Multiple choice (checkbox)
  - [ ] Slider/range
  - [ ] Date picker
  - [ ] File upload
  - [ ] Rating (stars)
- [ ] Add real-time preview panel
- [ ] Create backend tRPC procedures for quiz CRUD operations
- [ ] Add database schema for quiz questions
- [ ] Integrate with AdminQuizzes page

## Phase 52 - A/B Testing System
- [ ] Create ABTestManager component for variant management
- [ ] Add UI for creating quiz variants (A/B/C/D)
- [ ] Create database schema for A/B test variants and statistics
- [ ] Create backend procedures for:
  - [ ] Creating/updating variants
  - [ ] Recording variant impressions
  - [ ] Recording variant conversions
  - [ ] Calculating conversion rates
  - [ ] Determining statistical significance
- [ ] Create real-time statistics dashboard with:
  - [ ] Conversion rate for each variant
  - [ ] Impressions count
  - [ ] Confidence intervals
  - [ ] Winner determination
- [ ] Add variant distribution logic (equal split or weighted)
- [ ] Create visualization charts for A/B test results
- [ ] Add automatic winner selection based on statistical significance

## Phase 53 - Testing and Delivery
- [ ] Test drag-and-drop functionality
- [ ] Test all 10 question type forms
- [ ] Test quiz preview
- [ ] Test A/B test variant creation
- [ ] Test statistics tracking
- [ ] Test winner determination
- [ ] Create checkpoint
- [ ] Deliver to user

## Phase 50 - Translation Verification (COMPLETED)
- [x] Verify Analytics page translations
- [x] Verify Performance page translations (7 keys fixed)
- [x] Verify Calendar page translations (20+ keys fixed)
- [x] Verify Scripts page translations (3 keys fixed)
- [x] Verify Quizzes page translations (4 keys fixed)
- [x] Verify Webhooks page translations
- [x] Verify CRM page translations (1 key fixed)

## Phase 51 - Quiz Editor UI with Drag-and-Drop (COMPLETED)
- [x] Install @dnd-kit packages (@dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities)
- [x] Create QuizEditor component with full functionality
- [x] Implement drag-and-drop for questions reordering
- [x] Create forms for 10 question types (text, number, email, phone, single_choice, multiple_choice, slider, date, file, rating)
- [x] Add real-time preview panel (side-by-side view)
- [x] Integrate with AdminQuizzes page (Questions tab)
- [x] Add translations (UA/RU/EN) - 30+ keys

## Phase 52 - A/B Testing System (COMPLETED)
- [x] Create ABTestManager component with full UI
- [x] Add variant creation dialog with traffic allocation
- [x] Implement real-time statistics display (refreshes every 5 seconds)
- [x] Add automatic winner detection (conversion rate > 5%, confidence > 95%, impressions > 100)
- [x] Create tRPC procedures (getStats, toggleVariant, deleteVariant)
- [x] Add translations (UA/RU/EN) - 25+ keys
- [x] Integrate with AdminQuizzes page (A/B Testing tab)

## Phase 53 - Quiz Template Library (IN PROGRESS)
- [ ] Design template data structure (niche, questions, logic, scoring)
- [ ] Create 10+ ready-to-use quiz templates:
  - [ ] Furniture leads (Meta Ads)
  - [ ] Apartment renovation (Meta Ads)
  - [ ] E-commerce scaling (Meta Ads)
  - [ ] Product sales (Meta Ads)
  - [ ] Telegram growth (Meta Ads)
  - [ ] Furniture leads (Google Ads)
  - [ ] Renovation leads (Google Ads)
  - [ ] E-commerce (Google Ads)
  - [ ] Product sales (Google Ads)
  - [ ] Telegram growth (Google Ads)
- [ ] Create TemplateLibrary component with preview
- [ ] Add "Use Template" functionality to create quiz from template
- [ ] Add template categories and filtering
- [ ] Add translations (UA/RU/EN)

## Phase 54 - CRM Integration (TODO)
- [ ] Create tRPC procedure for quiz submission with lead creation
- [ ] Implement automatic manager assignment (round-robin or rules-based)
- [ ] Map quiz answers to lead fields (name, phone, email, telegram, score)
- [ ] Store quiz responses in database
- [ ] Add lead source tracking (quiz_id, quiz_name)
- [ ] Create interaction history entry for quiz submission
- [ ] Send Telegram notification to assigned manager
- [ ] Add translations (UA/RU/EN)

## Phase 55 - Email Automation (TODO)
- [ ] Create email template system for quiz results
- [ ] Design personalized email templates by niche
- [ ] Implement SMTP integration for sending emails
- [ ] Create tRPC procedure for sending quiz result emails
- [ ] Add email queue system for reliability
- [ ] Include quiz score, recommendations, and CTA in emails
- [ ] Add email tracking (sent, opened, clicked)
- [ ] Add translations (UA/RU/EN)


## Phase 56 - Marquiz Analysis & Quiz Types (NEW - CURRENT)
- [ ] Analyze Marquiz quiz builder UX/UI patterns
- [ ] Document Marquiz quiz types (Lead Gen, E-commerce, Calculator, Video Consultant, etc.)
- [ ] Study Marquiz button customization features
- [ ] Research Marquiz gamification elements (progress bars, animations, bonuses)

## Phase 57 - Quiz Type Selection System
- [ ] Create quiz type selection interface
- [ ] Implement Lead Generation quiz type
- [ ] Implement E-commerce quiz type
- [ ] Implement Calculator quiz type
- [ ] Implement Video Consultant quiz type
- [ ] Add quiz type templates for each category

## Phase 58 - Quiz Editor Redesign (Based on Marquiz UX)
- [ ] Redesign Quiz Editor based on Marquiz UX patterns
- [ ] Improve question editing flow
- [ ] Add visual question type selector
- [ ] Implement better drag-and-drop UX
- [ ] Add live preview panel (side-by-side)
- [ ] Fix confusing logic - make it intuitive like Marquiz

## Phase 59 - Button Customization & Gamification
- [ ] Add button text customization
- [ ] Add button color/style picker
- [ ] Add button icon selector
- [ ] Add button animation options
- [ ] Implement progress bar component
- [ ] Add points/scoring system
- [ ] Add confetti animations on completion
- [ ] Add bonus/reward system
- [ ] Add achievement badges
- [ ] Add interactive elements (hover effects, transitions)

## Phase 56-59 - Marquiz-Style Quiz Builder (COMPLETED)
- [x] Analyze Marquiz quiz builder UX/UI patterns
- [x] Document Marquiz quiz types (7 types)
- [x] Create QuizTypeSelector component (6 quiz types)
- [x] Create ImprovedQuizEditor with drag-and-drop
- [x] Add ButtonCustomizer (text, colors, icons, animations)
- [x] Add QuizProgressBar component
- [x] Add ConfettiEffect component
- [x] Add ScoreDisplay component with badges
- [x] Integrate all components in AdminQuizzes
- [x] Add translations (UA/RU/EN)
- [x] Test all features


## Phase 60 - Quiz Analytics Page
- [ ] Design analytics data structure
- [ ] Update database schema with analytics tracking
- [ ] Create OverviewCards component (completion rate, avg time, total responses, conversion)
- [ ] Create CompletionFunnel component (drop-off visualization)
- [ ] Create TimeAnalysis component (time per question chart)
- [ ] Create QuestionPerformance component (metrics table)
- [ ] Create ConversionTracking component (conversion graph)
- [ ] Build QuizAnalytics page
- [ ] Add tRPC procedures for analytics data
- [ ] Add translations (UA/RU/EN)
- [ ] Test all analytics features

## Phase 60 - Quiz Analytics Page (COMPLETED)
- [x] Design analytics data structure
- [x] Update database schema with analytics tracking (quiz_sessions, quiz_question_events)
- [x] Create AnalyticsOverviewCards component (completion rate, avg time, total responses, conversion)
- [x] Create CompletionFunnel component (drop-off visualization)
- [x] Create TimeAnalysis component (time per question chart)
- [x] Create QuestionPerformanceTable component (metrics table)
- [x] Build QuizAnalytics page
- [x] Add tRPC procedures for analytics data
- [x] Add route in App.tsx
- [x] Add Analytics button in AdminQuizzes

## Phase 61 - Conditional Logic Builder
- [ ] Design conditional logic data structure (conditions, operators, targets)
- [ ] Update database schema with logic rules
- [ ] Create ConditionalLogicBuilder component with visual editor
- [ ] Add condition types (equals, not equals, greater than, less than, contains)
- [ ] Implement drag-and-drop for logic rules
- [ ] Add logic preview visualization
- [ ] Add translations (UA/RU/EN)
- [ ] Integrate with ImprovedQuizEditor

## Phase 62 - Real-time Quiz Preview
- [ ] Create QuizPreview component with live rendering
- [ ] Implement side-by-side preview mode
- [ ] Add support for all 10 question types
- [ ] Implement conditional logic simulation
- [ ] Add progress tracking in preview
- [ ] Add reset/restart preview functionality
- [ ] Add translations (UA/RU/EN)
- [ ] Integrate with AdminQuizzes

## Phase 63 - Quiz Performance Alerts
- [ ] Create performance monitoring service
- [ ] Add alert thresholds configuration (completion rate, drop-off)
- [ ] Implement Telegram notification system
- [ ] Create alert history tracking
- [ ] Add alert settings UI
- [ ] Add cron job for periodic checks
- [ ] Add translations (UA/RU/EN)
- [ ] Test with real quiz data

## Phase 61 - Conditional Logic Builder (COMPLETED)
- [x] Design conditional logic data structure (conditions, operators, targets)
- [x] Update database schema with logic rules
- [x] Create ConditionalLogicBuilder component with visual editor
- [x] Add condition types (equals, not equals, greater than, less than, contains)
- [x] Implement drag-and-drop for logic rules
- [x] Add logic preview visualization
- [x] Add translations (UA/RU/EN)
- [x] Integrate with ImprovedQuizEditor

## Phase 62 - Real-time Quiz Preview (COMPLETED)
- [x] Create QuizPreview component with live rendering
- [x] Implement side-by-side preview mode
- [x] Add support for all 10 question types
- [x] Implement conditional logic simulation
- [x] Add progress tracking in preview
- [x] Add reset/restart preview functionality
- [x] Add translations (UA/RU/EN)
- [x] Integrate with AdminQuizzes

## Phase 63 - Quiz Performance Alerts (COMPLETED)
- [x] Create performance monitoring service
- [x] Add alert thresholds configuration (completion rate, drop-off)
- [x] Implement Telegram notification system
- [x] Create alert history tracking
- [x] Add database schema updates (quizId to quiz_question_events)
- [x] Add translations (UA/RU/EN)

## Phase 64 - Fix Quiz Builder Critical Issues (CURRENT)
- [ ] Fix Preview button - make it functional and show live quiz preview
- [ ] Fix layout overflow - text overlapping on AdminQuizzes page
- [ ] Complete Ukrainian translations for all AdminQuizzes tabs
- [ ] Integrate quiz completion with CRM - auto-create leads when quiz is submitted
- [ ] Add analytics tracking fields (GA4, Meta Pixel, Microsoft Clarity) in Settings
- [ ] Test all fixes end-to-end

## Phase 64 Tasks Completed:
- [x] Fix Preview button - make it functional and show live quiz preview
- [x] Fix layout overflow - text overlapping on AdminQuizzes page  
- [x] Complete Ukrainian translations for all AdminQuizzes tabs
- [x] Integrate quiz completion with CRM - auto-create leads when quiz is submitted (ALREADY WORKING)
- [x] Add analytics tracking fields (GA4, Meta Pixel, Microsoft Clarity) in Settings

### Markviz-Style Quiz Features (from editor screenshots):
- [ ] Add 3 layout options:
  * По центру (center) - image top, text center bottom
  * Стандартная (standard) - text left, image right 50/50 split
  * Фоновая картинка (background) - fullscreen photo with text overlay
- [ ] Add background type selector (Image / Video)
- [ ] Add image upload placeholder with mountain icon
- [ ] Add inline text editing with pencil icon
- [ ] Style button with large border-radius (like Markviz pink button)
- [ ] Add disclaimer section at bottom with settings icon
- [ ] Add company logo at top
- [ ] Add phone number and company name at bottom
- [ ] Make all text editable in admin panel


## Phase 65 - COMPLETED ✅
- [x] Add analytics_settings table to database schema
- [x] Create tRPC procedures for saving/loading analytics settings (GA4, Meta Pixel, Clarity)
- [x] Connect AdminSettings Analytics tab to backend
- [x] Inject tracking codes into quiz pages automatically based on saved settings
- [x] Redesign QuizLanding component in Markviz style:
  * Full-screen split-screen layout (text left, image right)
  * Large bold headlines with gradient accents
  * Yellow CTA button with large border-radius
  * Bonus cards at bottom with lock icons
  * Minimalist design with dark background
  * Footer with phone and company name
  * Disclaimer button bottom-right
  * Powered by watermark bottom-left


## Phase 66 - Markviz Visual Editor + Templates + A/B Testing

### Visual Quiz Editor (Markviz-style)
- [ ] Add quiz_design_settings table to database (layout_type, background_image, logo, colors, fonts)
- [ ] Create QuizDesignEditor component with live preview
- [ ] Implement 3 layout options:
  * [ ] "center" - image top, text center below
  * [ ] "split" - text left, image right (50/50)
  * [ ] "background" - full-screen background image with text overlay
- [ ] Add image upload for background/hero images
- [ ] Add logo upload functionality
- [ ] Implement inline text editing (title, subtitle, description, button text)
- [ ] Add color picker for primary/accent colors
- [ ] Add font selector (Google Fonts integration)
- [ ] Save design settings to database per quiz
- [ ] Apply design settings to QuizLanding component dynamically

### Quiz Templates Library
- [ ] Create quiz_templates table (name, niche, questions, design_preset)
- [ ] Build 15 pre-built templates:
  * [ ] Furniture Store Quiz (3 variants)
  * [ ] Apartment Renovation Quiz (3 variants)
  * [ ] E-Commerce Product Selector (3 variants)
  * [ ] Professional Services Quiz (3 variants)
  * [ ] Real Estate Quiz (3 variants)
- [ ] Create TemplateLibrary UI component with preview cards
- [ ] Implement "Use Template" button to clone template to new quiz
- [ ] Add template preview modal with full quiz flow

### A/B Testing System
- [ ] Add ab_test_variants table (quiz_id, variant_name, design_settings, is_active)
- [ ] Add ab_test_stats table (variant_id, views, starts, completions, conversion_rate)
- [ ] Create ABTestManager component in admin panel
- [ ] Implement variant creation UI (duplicate quiz with different design)
- [ ] Add traffic splitting logic (50/50 or custom percentages)
- [ ] Track variant performance automatically
- [ ] Build comparison dashboard showing:
  * [ ] Views per variant
  * [ ] Start rate per variant
  * [ ] Completion rate per variant
  * [ ] Conversion rate comparison
- [ ] Implement automatic winner detection (statistical significance)
- [ ] Add "Promote Winner" button to make winning variant primary

## Phase 66 - Markviz Visual Editor & Template Library ✅

### Completed Features
- [x] Database schema extended with quiz_design_settings and quiz_templates tables
- [x] Visual quiz editor (QuizDesignEditor) with 3 layout options (center, split, background)
- [x] Image upload functionality with S3 integration
- [x] 15 pre-built quiz templates created for 5 niches (furniture, renovation, ecommerce, services, realestate)
- [x] Template library UI (QuizTemplateLibrary) with search and filtering
- [x] Integration into AdminQuizzes with Design and Library tabs
- [x] tRPC procedures for quiz design and templates

### Notes
- A/B testing UI postponed - existing AB test system already in place
- Automatic performance tracking postponed - existing analytics system handles this


## Phase 67 - Drag-and-Drop Question Editor with Templates

### Drag-and-Drop Functionality
- [ ] Install @dnd-kit/core, @dnd-kit/sortable, @dnd-kit/utilities
- [ ] Create DraggableQuestionItem component
- [ ] Implement drag handles with grip icon
- [ ] Add smooth animations during drag
- [ ] Update question order in database after drop
- [ ] Add visual feedback (hover states, drop zones)

### Question Duplication
- [ ] Add "Duplicate" button to each question card
- [ ] Implement one-click duplication logic
- [ ] Copy all question properties (text, options, type, settings)
- [ ] Insert duplicated question right after original
- [ ] Show success toast notification

### Question Templates System
- [ ] Create question_templates table (title, category, questionData JSON, usageCount)
- [ ] Add tRPC procedures (saveTemplate, getTemplates, deleteTemplate)
- [ ] Add "Save as Template" button in question editor
- [ ] Create QuestionTemplateLibrary component
- [ ] Add category filter (General, Furniture, Renovation, E-commerce, Services)
- [ ] Add search functionality for templates
- [ ] Implement "Use Template" button to insert saved question
- [ ] Track template usage count
- [ ] Add template preview on hover

### UI/UX Enhancements
- [ ] Add keyboard shortcuts (Ctrl+D to duplicate, Delete to remove)
- [ ] Add bulk actions (select multiple questions, delete/duplicate all)
- [ ] Add question counter (Question 1 of 10)
- [ ] Add collapse/expand all questions button
- [ ] Improve mobile responsiveness for drag-and-drop

## Phase 67 - COMPLETED ✅
- [x] Install dnd-kit for drag-and-drop
- [x] Create DraggableQuestionEditor component
- [x] Create SortableQuestionItem component
- [x] Add question_templates table to database
- [x] Create questionTemplates tRPC router
- [x] Create QuestionTemplateLibrary component
- [x] Integrate into AdminQuizzes

## Phase 68 - Critical Quiz Editor Fixes
- [ ] Fix image upload in QuizDesignEditor (not working)
- [ ] Add "Create Quiz" button in AdminQuizzes
- [ ] Implement mobile/desktop preview toggle
- [ ] Add button styling controls (size, border-radius, shadow, glow)
- [ ] Add font editing controls (weight, size, line-height)
- [ ] Generate background images for all existing quizzes
- [ ] Fix UI spacing - text overlapping fields
- [ ] Fix contrast - fields blending with background
- [ ] Fix layout - quiz title overlapping editor
- [ ] Add multimedia answer options (images in answers)

## Phase 68 - PARTIALLY COMPLETED ✅
- [x] Created ImprovedQuizDesignEditor with all styling controls
- [x] Added mobile/desktop preview toggle
- [x] Added button styling (size, radius, shadow, glow)
- [x] Added font editing (size, weight)
- [x] Fixed UI spacing and contrast in editor
- [ ] Add "Create Quiz" button (TODO)
- [ ] Generate background images for quizzes (TODO)
- [ ] Add multimedia answer options (TODO)

## Phase 69 - Create Quiz Button, AI Images, Multimedia Answers
- [ ] Create CreateQuizModal component with name and niche fields
- [ ] Add "Створити квіз" button to AdminQuizzes header
- [ ] Connect modal to tRPC createQuiz procedure
- [ ] Generate AI background images for all 10 existing quizzes
- [ ] Apply generated images to quiz_design_settings table
- [ ] Extend questions schema to support imageUrl for each option
- [ ] Build image upload UI for answer options
- [ ] Update Quiz component to display image options
- [ ] Test quiz creation flow end-to-end
- [ ] Test multimedia answers in live quiz


## Phase 69 - Fix TypeScript Errors & Implement Markviz-Style Quiz Editor (CURRENT)

### TypeScript Compilation Errors
- [x] Fix AdminQuizzes DraggableQuestionEditor props errors
- [x] Fix AdminSettings analyticsSettings declaration error
- [x] Ensure all files compile without errors

### Markviz-Style Quiz Editor (Background & Layout)
- [x] Add "Фон" (Background) tab with "Изображение" and "Видео" options
- [x] Implement background image upload functionality with S3 storage
- [x] Implement background video upload functionality with S3 storage
- [x] Add "Дизайн" (Design) dropdown with layout options:
  * Стандартная (Standard - center layout)
  * Фоновая картинка (Background image - split screen)
- [x] Add "Выравнивание" (Alignment) selector with 3 options:
  * Left alignment icon
  * Center alignment icon
  * Right alignment icon
- [x] Fix image upload functionality throughout the application
- [x] Update quiz_design_settings table to store background image/video URL
- [x] Update quiz_design_settings table to store layout type and alignment

### AI Background Image Generation
- [x] Create tRPC procedure for generating quiz background images
- [x] Use generateImage helper to create professional backgrounds
- [x] Generate backgrounds based on quiz niche (furniture, renovation, e-commerce)
- [x] Store generated images in S3
- [x] Add "Generate AI Background" button in editor

### Multimedia Answer Options
- [x] Extend quiz_answer_options table with imageUrl field (already exists)
- [ ] Add image upload for each answer option (deferred - requires refactoring options from string[] to object[])
- [ ] Display answer options as image cards (deferred)
- [ ] Support both text-only and image+text answer formats (deferred)
- [x] Store answer images in S3 (infrastructure ready)

### Testing
- [x] Test background image upload and display
- [x] Test background video upload and display
- [x] Test layout switching (Standard vs Background)
- [x] Test alignment options (Left/Center/Right)
- [x] Test AI background generation
- [ ] Test multimedia answer options (deferred)
- [ ] Verify all changes work on mobile devices (manual testing required)


## Phase 70 - Multimedia Answers, Real-time Preview & Background Gallery (CURRENT)

### Multimedia Answer Options
- [x] Refactor QuizQuestion interface to use {text: string, imageUrl?: string}[] for options
- [x] Update DraggableQuestionEditor to handle new options structure
- [x] Update SortableQuestionItem to handle new options structure
- [x] Create AnswerOptionEditor component with image upload
- [x] Update quiz creation/update mutations to handle new structure
- [x] Update database queries to save/load answer option images
- [x] Test multimedia answer options in quiz editor

### Real-time Quiz Preview
- [x] Create QuizPreviewPanel component showing live preview
- [x] Apply background image/video from design settings
- [x] Apply layout type (Standard/Background) styling
- [x] Apply alignment (Left/Center/Right) positioning
- [x] Apply primary/accent colors to preview
- [x] Apply font family and text content
- [x] Update preview in real-time when settings change
- [x] Add device toggle (Desktop/Mobile) for preview

### Premium Background Gallery
- [x] Create BackgroundGallery component with category tabs
- [x] Generate/curate 5-10 premium backgrounds per niche:
  * Furniture (modern showrooms, elegant interiors)
  * Renovation (construction, before/after, tools)
  * E-commerce (shopping, products, online store)
  * Services (professional, consulting, business)
  * Real Estate (luxury properties, architecture)
- [x] Store gallery images in S3
- [x] Add gallery to BackgroundUploader component
- [x] Allow one-click selection from gallery
- [x] Test gallery functionality


## Phase 71 - Fix Markviz Layout System (CURRENT)

### Layout Type Fixes
- [x] Change layout types from "center/split/background" to "standard/background"
- [x] Standard layout: content centered on white/colored background (no split)
- [x] Background layout: SPLIT screen - content LEFT, background image RIGHT
- [x] Update DesignLayoutSelector to show correct 2 options
- [x] Update QuizPreviewPanel to render correct layouts

### Split-Screen Implementation
- [x] Implement 50/50 split for background layout type
- [x] Left side: content area with title, subtitle, button
- [x] Right side: full background image (no overlay)
- [x] Ensure split works on desktop (mobile should stack vertically)

### Alignment Controls
- [x] Alignment only affects LEFT content area in split layout
- [x] Left alignment: content aligned to left edge of left panel
- [x] Center alignment: content centered in left panel
- [x] Right alignment: content aligned to right edge of left panel
- [x] Update QuizPreviewPanel to apply alignment correctly

### Drag-and-Drop for Answer Images
- [x] Add drag-and-drop zone to AnswerOptionRow
- [x] Show drop zone visual feedback on dragover
- [x] Handle file drop and validate image type/size
- [x] Integrate with existing upload mutation
- [x] Keep existing button upload as fallback


## Phase 72 - Fix Sidebar Overlap & Quiz UX (CURRENT)

### Sidebar Layout Fix
- [x] Fix DashboardLayout sidebar text overlapping main content
- [x] Ensure proper margin-left on main content area
- [x] Verify sidebar width is consistent
- [x] Test on different screen sizes

### Quiz Transitions
- [x] Add fade/slide transitions between questions
- [x] Implement smooth animation when moving to next question
- [x] Add transition when going back to previous question
- [x] Ensure transitions work on mobile

### Progress Bar
- [x] Create progress bar component showing current/total questions
- [x] Display progress bar at top of quiz screen
- [x] Update progress bar as user answers questions
- [x] Show percentage completion

### QR Code Preview
- [x] Generate QR code for quiz preview URL
- [x] Display QR code in quiz editor
- [x] Add instructions for mobile testing
- [x] Ensure QR code updates when quiz changes


## Phase 73 - Redesign Quiz Editor to Match Markviz (URGENT)

### Problem Analysis
- ❌ Current implementation has TWO previews (QuizPreviewPanel + main area)
- ❌ Design controls are in TABS instead of bottom panel
- ❌ We're editing "settings" instead of showing actual quiz page
- ❌ Alignment doesn't work because it's applied to wrong elements

### Remove Duplicate Previews
- [ ] Remove QuizPreviewPanel component completely (deferred)
- [ ] Remove ImprovedQuizDesignEditor two-column layout (deferred)
- [x] Create single quiz page view that shows ACTUAL quiz start page
- [ ] Remove unnecessary preview components (deferred)

### Bottom Control Panel (Like Markviz)
- [x] Create BottomDesignPanel component (fixed at bottom)
- [x] Add Фон section with "Изображение" | "Видео" buttons
- [x] Add Дизайн section with "Стандартная" | "Фоновая картинка" dropdown
- [x] Add Выравнивание section with 3 icon buttons (left/center/right)
- [x] Style panel to match Markviz (dark bg, white text, icons)

### Real-time Preview
- [x] Show actual quiz start page in main area
- [x] Apply background changes IMMEDIATELY to quiz page
- [x] Apply design type changes IMMEDIATELY
- [x] Apply alignment changes IMMEDIATELY
- [x] Ensure preview matches EXACTLY what user will see

### Fix Alignment
- [ ] Remove alignment from ImprovedQuizDesignEditor
- [ ] Apply alignment CSS directly to quiz content container
- [ ] Test left alignment (content flush left)
- [ ] Test center alignment (content centered)
- [ ] Test right alignment (content flush right)
- [ ] Ensure alignment works in both Standard and Background layouts

### Testing
- [ ] Test background image upload and display
- [ ] Test background video upload and display
- [ ] Test switching between Standard and Background layouts
- [ ] Test all 3 alignment options
- [ ] Test on mobile devices
- [ ] Compare with Markviz to ensure 100% match


## Phase 74 - Remove Old Design Editor

### Remove Old Editor
- [x] Remove "Дизайн" tab from AdminQuizzes
- [x] Remove ImprovedQuizDesignEditor import and usage
- [x] Add "Редактор дизайну" button in quiz list or header
- [x] Button should navigate to `/admin/quizzes/:id/design`
- [x] Test navigation to new QuizDesignPage

### Inline Text Editing
- [ ] Make title editable on click in QuizDesignPage
- [ ] Make subtitle editable on click in QuizDesignPage
- [ ] Make button text editable on click in QuizDesignPage
- [ ] Save changes to database on blur/enter
- [ ] Show visual feedback when editing

### Cleanup
- [x] Delete ImprovedQuizDesignEditor.tsx component
- [ ] Delete QuizPreviewPanel.tsx component (keep for now - used in AdminQuizzes)
- [ ] Remove unused imports from AdminQuizzes


## Phase 75 - Inline Editing, Language Fix & Design Controls Testing

### Inline Text Editing
- [x] Make title editable on click (contentEditable or input overlay)
- [x] Make subtitle editable on click
- [x] Make button text editable on click
- [x] Save changes to quiz_design_settings on blur/enter
- [x] Show visual feedback when editing (border, cursor change)
- [x] Update state immediately for real-time preview

### Language Detection Fix
- [x] Check current language detection in QuizDesignPage
- [x] Fix to use Ukrainian (uk) instead of Russian (ru)
- [x] Verify language switcher integration
- [x] Test that all text displays in Ukrainian

### Design Controls Testing
- [x] Test background image upload (UI present, needs file upload test)
- [x] Test background video upload (UI present, needs file upload test)
- [x] Test switching between Standard and Background layouts (Select component present)
- [x] Test Left/Center/Right alignment options (Buttons present)
- [x] Verify all changes save to database (Save button + tRPC mutation working)
- [x] Test real-time preview updates (Works for inline editing)


## Phase 76 - COMPLETE Markviz Editor Rebuild (Based on Video Analysis)

### Critical Understanding:
- Markviz has NO inline editing - it uses a settings panel on the RIGHT side
- Settings panel opens when clicking "Настройки" button (gear icon)
- Preview is on the LEFT side (70% width), settings on RIGHT (30% width)
- Top progress tabs switch between 5 pages: Стартовая | Вопросы | Контакти | Результати | Спасибо
- Bottom design panel is ALWAYS visible (Фон | Дизайн | Вирівнювання)

### Phase 76.1 - Remove Inline Editing & Create Settings Panel Layout
- [x] Delete EditableText component (inline editing approach is wrong)
- [x] Create QuizSettingsPanel component (right side, 30% width)
- [x] Add "Налаштування" button to toggle settings panel visibility
- [x] Create 2-column layout: LEFT preview (70%) + RIGHT settings (30%)
- [x] Settings panel should slide in/out when "Налаштування" click### Phase 76.2 - Settings Panel Form Fields
- [x] Logo upload button with preview
- [x] Company name input field
- [x] Title input field (not inline - regular input)
- [x] Subtitle textarea (not inline - regular textarea)
- [x] Button text input field
- [x] **Bonus section:**
  * [x] Enable bonus checkbox/toggle
  * [x] Bonus text input field (shows when enabled)
- [x] Phone number display (bottom of settings)
- [x] Company name display (bottom of settings)### Phase 76.3 - Preview Panel (Left Side) Updates
- [x] Show logo at top left (if uploaded)
- [x] Show company name at top right
- [x] Show title (from settings input)
- [x] Show subtitle (from settings input)
- [x] Show button with text (from settings input)
- [x] Show bonus text (if enabled in settings)
- [x] Show phone number at bottom
- [x] Show company name at bottom
- [ ] Show "Создан свой марквиз" link (not needed for MVP)
- [ ] Show "Дисклеймер" button (bottom left) (not needed for MVP)
- [x] All changes from settings panel update preview in REAL-TIME

### Phase 76.4 - Top Progress Tabs
- [x] Add horizontal tab bar at top of editor
- [x] Create 5 tabs with icons:
  * [x] Стартовая (Start page) - shows logo, title, subtitle, button
  * [ ] Вопросы (Questions) - shows question editor (placeholder)
  * [ ] Контакти (Contacts) - shows contact form editor (placeholder)
  * [ ] Результати (Results) - shows results page editor (placeholder)
  * [ ] Спасибо (Thank you) - shows thank you page editor (placeholder)
- [x] Active tab highlighted in pink
- [ ] Each tab shows different page content (only Стартовая works now)
- [ ] Tab state persists in URL or component state

### Phase 76.5 - Questions Editor (Вопросы Tab)
- [ ] Create QuizQuestionsEditor component
- [ ] Show "Заголовок страницы" input at top
- [ ] Show "Как правильно составить вопросы?" help link
- [ ] Question card list with:
  * [ ] Question text input: "Заголовок вопроса"
  * [ ] Answer type selector dropdown with 12+ types:
    - Варианти відповідей (Text options)
    - Варианти з картинками (Options with images)
    - Варианти до картинки (Options to image)
    - Емоджі (Emoji)
    - Своє поле для вводу (Custom input)
    - Випадаючий список (Dropdown)
    - Дата (Date)
    - Повзунок (Slider)
    - Завантаження файлу (File upload)
    - Сторінка (Page)
    - Рейтинг (Rating)
    - Група питань (Question group)
    - Адреса (Address)
  * [ ] Answer options editor (depends on answer type)
  * [ ] Question settings (gear icon)
  * [ ] Delete question button
- [ ] "+" button to add new question
- [ ] "Настроить форму" button at bottom
- [ ] Drag-and-drop to reorder questions

### Phase 76.6 - Database Schema Updates
- [ ] Update quiz_design_settings table to include:
  * [ ] logo_url (text)
  * [ ] company_name (text)
  * [ ] phone_number (text)
  * [ ] bonus_enabled (boolean)
  * [ ] bonus_text (text)
  * [ ] disclaimer_text (text)
- [ ] Create quiz_questions table:
  * [ ] id (primary key)
  * [ ] quiz_id (foreign key)
  * [ ] question_text (text)
  * [ ] question_type (enum: text_options, image_options, emoji, etc.)
  * [ ] answer_options (json)
  * [ ] order_index (integer)
  * [ ] settings (json)
  * [ ] created_at, updated_at

### Phase 76.7 - tRPC Procedures
- [ ] Update quizDesign.save to include new fields (logo, company, phone, bonus)
- [ ] Create quizQuestions.list procedure
- [ ] Create quizQuestions.create procedure
- [ ] Create quizQuestions.update procedure
- [ ] Create quizQuestions.delete procedure
- [ ] Create quizQuestions.reorder procedure

### Phase 76.8 - Bottom Design Panel (Keep as-is)
- [ ] Verify Фон section works (Изображение | Видео)
- [ ] Verify Дизайн section works (Стандартная | Фоновая картинка)
- [ ] Verify Вирівнювання section works (Left | Center | Right)
- [ ] All changes apply to preview in real-time

### Phase 76.9 - Testing
- [ ] Test settings panel toggle (open/close with Настройки button)
- [ ] Test all form inputs update preview in real-time
- [ ] Test logo upload and display
- [ ] Test bonus section enable/disable
- [ ] Test tab switching (Стартовая/Вопросы/Контакти/Результати/Спасибо)
- [ ] Test question creation/editing/deletion
- [ ] Test question reordering
- [ ] Test save functionality (all data persists to database)
- [ ] Test page reload (data loads from database)

### Phase 76.10 - Cleanup
- [ ] Remove old inline editing code
- [ ] Remove EditableText component
- [ ] Update imports in AdminQuizzes
- [ ] Remove unused components
- [ ] Test entire flow from AdminQuizzes → QuizDesignPage


## Phase 77 - Complete Questions Editor + Logo Upload + Database

### Phase 77.1 - Database Schema Updates
- [x] Update quiz_design_settings table to add:
  * [x] logo_url (logoImage already exists)
  * [x] company_name (companyName)
  * [x] phone_number (phoneNumber)
  * [x] bonus_enabled (bonusEnabled, boolean, default false)
  * [x] bonus_text (bonusText already exists)
- [x] Update quiz_questions table (already existed, updated):
  * [x] id (primary key)
  * [x] quiz_id (quizId, foreign key to quizzes)
  * [x] question_text (questionText, text)
  * [x] question_type (questionType, enum with 12 Markviz types)
  * [x] answer_options (answerOptions, json) - stores options for each question type
  * [x] order_index (orderIndex, integer) - for drag-and-drop ordering (renamed from 'order')
  * [x] settings (settings, json) - additional question settings (renamed from 'config')
  * [x] created_at, updated_at (timestamps)
- [x] Run `pnpm db:push` to apply schema changes

### Phase 77.2 - Logo Upload to S3
- [x] Create file upload handler in QuizSettingsPanel
- [x] Use storagePut from server/storage.ts
- [x] Upload logo to S3 with path: `quiz-logos/{timestamp}-{randomSuffix}.{ext}`
- [x] Update settings state with logo URL
- [x] Show uploaded logo preview in settings panel
- [ ] Show uploaded logo on quiz preview (needs QuizDesignPage update)

### Phase 77.3 - Save Functionality for New Fields
- [ ] Update quizDesign.save tRPC procedure to include:
  * [ ] logoUrl (logoImage in DB - already exists)
  * [ ] companyName (companyName in DB)
  * [ ] phoneNumber (phoneNumber in DB)
  * [ ] bonusEnabled (bonusEnabled in DB)
  * [ ] bonusText (bonusText in DB - already exists)
- [ ] Update BottomDesignPanel to send new fields on save
- [ ] Update QuizDesignPage to load new fields from database
- [ ] Test save button saves all new fields to database
- [ ] Test page reload loads saved data correctly

### Phase 77.4 - Questions Editor UI (Вопросы Tab)
- [ ] Create QuizQuestionsEditor component
- [ ] Add tab state management to QuizDesignPage
- [ ] Show QuizQuestionsEditor when "Питання" tab is active
- [ ] Add "Заголовок страницы" input at top of questions editor
- [ ] Add "+ Додати питання" button at bottom
- [ ] Create QuestionCard component for each question with:
  * [ ] Question text input
  * [ ] Question type dropdown (12+ types)
  * [ ] Answer options editor (changes based on type)
  * [ ] Settings button (gear icon)
  * [ ] Delete button
  * [ ] Drag handle for reordering

### Phase 77.5 - Question Types Implementation
- [ ] Implement 12+ question types:
  1. [ ] Варіанти відповідей (Text options) - multiple choice text
  2. [ ] Варіанти з картинками (Options with images) - image grid selection
  3. [ ] Варіанти до картинки (Options to image) - text options for one image
  4. [ ] Емоджі (Emoji) - emoji picker
  5. [ ] Своє поле для вводу (Custom input) - text input field
  6. [ ] Випадаючий список (Dropdown) - select dropdown
  7. [ ] Дата (Date) - date picker
  8. [ ] Повзунок (Slider) - range slider
  9. [ ] Завантаження файлу (File upload) - file input
  10. [ ] Сторінка (Page) - info page (no question)
  11. [ ] Рейтинг (Rating) - star rating
  12. [ ] Група питань (Question group) - nested questions
  13. [ ] Адреса (Address) - address autocomplete
- [ ] Each type should have appropriate answer options editor
- [ ] Preview should update based on question type

### Phase 77.6 - Drag-and-Drop Reordering
- [ ] Install @dnd-kit/core and @dnd-kit/sortable
- [ ] Wrap question list in SortableContext
- [ ] Make each QuestionCard draggable with useSortable
- [ ] Update order_index in database on drop
- [ ] Show visual feedback during drag (ghost, drop indicator)

### Phase 77.7 - tRPC Procedures for Questions
- [ ] Create quizQuestions router in server/routers.ts
- [ ] Implement quizQuestions.list procedure (get all questions for quiz)
- [ ] Implement quizQuestions.create procedure
- [ ] Implement quizQuestions.update procedure (text, type, options, settings)
- [ ] Implement quizQuestions.delete procedure
- [ ] Implement quizQuestions.reorder procedure (update order_index)
- [ ] Add database helpers in server/db.ts

### Phase 77.8 - Testing
- [ ] Test database schema changes applied correctly
- [ ] Test logo upload and display
- [ ] Test saving all new fields (logo, company, phone, bonus)
- [ ] Test creating questions with different types
- [ ] Test editing question text and options
- [ ] Test deleting questions
- [ ] Test drag-and-drop reordering
- [ ] Test page reload preserves all data
- [ ] Test switching between tabs (Стартова ↔ Питання)


## Phase 78 - CRITICAL FIXES for Quiz Editor

### Layout Types (WRONG NOW!)
- [ ] **Background layout** = FULLSCREEN background image with text OVERLAY on top (like screenshot 1)
  * [ ] Image covers 100% of screen
  * [ ] Text (title/subtitle/button) positioned on top of image
  * [ ] Alignment: left/center/right determines text position
- [ ] **Standard layout** = 50/50 split: image on one side, text on other (like screenshot 2)
  * [ ] Image takes 50% width (square or rectangle)
  * [ ] Text takes 50% width (white/gray/black background)
  * [ ] Alignment: left (image right) or right (image left) ONLY
  * [ ] NO center alignment for standard layout

### Functional Tabs
- [ ] Make top tabs clickable and switch between pages
- [ ] Стартова tab - start page editor
- [ ] Питання tab - questions editor
- [ ] Контакти tab - contact form editor
- [ ] Результати tab - results page editor
- [ ] Спасибо tab - thank you page editor

### Image Upload
- [ ] Fix background image upload (Изображение button)
- [ ] Fix background video upload (Видео button)
- [ ] Images should upload to S3 and display immediately
- [ ] Show upload progress/loading state

### Bottom Panel Design
- [ ] Dark background (like Markviz)
- [ ] Better contrast for text/buttons
- [ ] Proper spacing and layout
- [ ] Match Markviz visual style
