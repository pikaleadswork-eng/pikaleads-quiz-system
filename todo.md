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
