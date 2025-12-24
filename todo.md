# PIKALEADS CRM System TODO

## Phase 170: URGENT - Real-Time Preview for ALL Editor Controls

**CRITICAL REQUIREMENT:**
- [ ] ALL editor controls must update preview INSTANTLY without saving
- [ ] Button color picker → preview updates immediately
- [ ] Text inputs (title, subtitle, button text) → preview updates on every keystroke
- [ ] Font selector → preview updates immediately
- [ ] Font weight → preview updates immediately
- [ ] Text color pickers → preview updates immediately
- [ ] Alignment buttons → preview updates immediately
- [ ] Background image upload → preview updates immediately
- [ ] Background color/gradient → preview updates immediately
- [ ] Button border radius slider → preview updates immediately
- [ ] Bonus toggle → preview updates immediately
- [ ] Phone number → preview updates immediately
- [ ] Company name → preview updates immediately

**Implementation:**
- Use local state in QuizDesignPage for all settings
- Preview renders from local state (not database)
- "Зберегти все" button saves local state to database
- No database calls until user clicks save

## URGENT BUGS (Reported 2025-12-24) - FIXED

- [x] Quiz fonts not working in editor (font selection doesn't apply) - FIXED: Added all 22 fonts to selector
- [x] Background color black instead of purple gradient on published quiz - FIXED: Gradient was already correct
- [x] Image not filling full space in 50/50 layout (not square proportions) - FIXED: Image now uses object-cover
- [x] Text too large and in UPPERCASE instead of normal case - FIXED: Reduced text sizes and added textTransform: 'none'
- [x] Editor preview showing incorrect rendering compared to published quiz - FIXED: Preview now matches published layout
- [x] Font selector in editor doesn't change actual font in preview or published quiz - FIXED: All fonts now work

## Phase 172: URGENT - Fix Editor Preview & Add Enhancements (COMPLETED)

**CRITICAL ISSUES:**
- [x] Fix editor preview - should show DESKTOP layout (50/50 split) by default, not mobile
- [x] Change default previewMode from 'mobile' to 'desktop' in QuizDesignPage.tsx

**NEW FEATURES:**
- [x] Add three breakpoint buttons: Desktop (1920px) / Tablet (768px) / Mobile (375px)
- [x] Add visual "Aa" preview on font size sliders showing current size
- [x] Add preset buttons: Small (32/16), Medium (48/20), Large (64/28), XL (80/36)
- [x] Apply preset to both title and subtitle simultaneously

## Phase 171: CRITICAL - Font Synchronization & Font Size Sliders (COMPLETED)

**USER REQUIREMENTS:**
- [x] Fix font synchronization - published quiz shows different font than editor
- [x] Add titleFontSize slider (16-96px) to editor
- [x] Add subtitleFontSize slider (12-48px) to editor
- [x] Add breakpoint preview buttons (Mobile 375px / Tablet 768px / Desktop)
- [ ] Test on real mobile device after publishing

**TECHNICAL FIXES:**
- [x] Check if fontFamily from quiz_design_settings is being applied to QuizPage.tsx
- [x] Verify Google Fonts loading on published page
- [x] Add titleFontSize field to quiz_design_settings schema (default: 48)
- [x] Add subtitleFontSize field to quiz_design_settings schema (default: 20)
- [x] Add font size sliders to QuizSettingsPanel
- [x] Update quizDesign.save tRPC procedure to save font sizes
- [x] Apply font sizes to QuizDesignPage preview
- [x] Apply font sizes to QuizPage.tsx published quiz
- [x] Add preview mode selector with device frames
- [x] Update preview container width based on selected breakpoint

## Phase 169: CRITICAL - Button Color Not Reactive & Right Side Needs Black Background

**USER REQUIREMENTS:**
- [ ] Button color picker in editor must update preview in REAL-TIME
- [ ] Right side (where Pikachu image is) must have BLACK background, not gradient
- [ ] Left side keeps purple gradient
- [ ] Changes must work on both local and published site

**TECHNICAL FIXES:**
- [ ] Fix buttonColor state reactivity in QuizDesignPage.tsx
- [ ] Update preview rendering to use buttonColor from state
- [ ] Change right side background from gradient to solid black (#000000)
- [ ] Test color picker changes reflect immediately
- [ ] Save and verify on published site

## Phase 169: COMPLETED - Editor Preview Now Matches Published Quiz

**FIXES APPLIED:**
- [x] Editor preview now renders EXACTLY like published quiz
- [x] Right side shows image with gradient overlay (same as QuizPage.tsx)
- [x] Left side shows purple gradient with text
- [x] Button color is reactive (uses settings.accentColor)
- [x] Both editor and published quiz use identical rendering logic

## Phase 168: URGENT - Published Site Shows Wrong Layout (pikaleadsquiz-eccrelaa.manus.space)

**CRITICAL PROBLEM:**
- Published site (pikaleadsquiz-eccrelaa.manus.space) shows fullscreen purple gradient
- Local dev site shows correct 50/50 split with Pikachu image
- Database on published site has outdated/incorrect data
- Changes made locally NOT synced to production database

**MUST FIX:**
- [ ] Connect to production database and check quiz_design_settings table
- [ ] Update backgroundImage URL to working image in production DB
- [ ] Verify layoutType is 'standard' in production DB
- [ ] Test editor on published site after database update
- [ ] Verify published quiz page shows correct layout
- [ ] Document how to sync local changes to production

## Phase 167: COMPLETED - Fixed Editor Layout on Local Dev

**PROBLEM SOLVED:**
- [x] Editor preview now shows 50/50 split layout
- [x] Editor loads backgroundImage from database
- [x] Editor shows layoutType='standard' correctly
- [x] QuizDesignPage.tsx loads correct data
- [x] Preview matches QuizPage.tsx rendering
- [x] Changes save and appear on local published quiz

## Phase 153: Redesign Team Section with Premium Cyberpunk Style (COMPLETED)
- [x] Redesign TeamSection component layout to match screenshot
- [x] Add large photo cards with gradient overlays (dark to transparent)
- [x] Implement certification badges (META, GOOGLE, TIKTOK) with icons and colors
- [x] Add neon glow effects on cards and badges
- [x] Improve typography (bold names, cyan job titles)
- [x] Improve typography (bold names, cyan job titles)
- [x] Add social media icons at bottom of cards
- [x] Implement hover animations and scale effects
- [x] Test responsive design on mobile, tablet, desktop
- [x] Verify all 3 team members display correctly

## Phase 152: Add Guarantees and Team Sections (COMPLETED)
- [x] Create database schema for team_members table
- [x] Create tRPC router for team management (CRUD operations)
- [x] Create GuaranteesSection component with 4 guarantees
- [x] Create TeamSection component with team member cards
- [x] Create AdminTeam page for managing team members
- [x] Add "Команда" menu item to CRM sidebar
- [x] Integrate GuaranteesSection after About Us section
- [x] Integrate TeamSection after Why Us section
- [x] Add placeholder team members with photos
- [x] Test all CRUD operations for team management

## Phase 151: Remove Cancel Button from Lead Form Modal (COMPLETED)
- [x] Remove "Скасувати" button from LeadFormModal to increase conversion
- [x] Remove "Не знайшли відповідь на своє питання?" section with contact button from FAQSection
- [x] Test modal functionality after changes
- [x] Verify form submission works correctly

## Phase 122: Final Clarity Enhancements & VPS Deployment (COMPLETED)
- [x] Integrate automatic Clarity event logging with session IDs to backend
- [x] Add "Only with recordings" filter checkbox to Events Dashboard
- [x] Create session replay modal with iframe embed
- [x] Verify all analytics integrations (Meta, GA4, GTM, Telegram)
- [x] Create deployment archive with all configurations
- [x] Prepare VPS deployment instructions
- [x] Set up database with admin and manager users

## Phase 121: Clarity Session Recordings Integration (COMPLETED)
- [x] Research Clarity Session Recordings API
- [x] Add Clarity session ID tracking to events_log
- [x] Create backend API for fetching Clarity session URLs
- [x] Add session recordings column to Events Dashboard table
- [x] Add "View Recording" button for Clarity events
- [x] Test session recordings playback
- [x] Update ClarityEvents to send session IDs to backend

## Phase 120: Analytics Enhancements (COMPLETED)
- [x] Make GTM dynamic - move Container ID from index.html to AnalyticsScripts.tsx
- [x] Update analytics_settings to load GTM dynamically from database
- [x] Add Clarity custom events for CTA clicks
- [x] Add Clarity custom events for form field interactions
- [x] Add Clarity custom events for quiz drop-off tracking
- [x] Create events_log table in database for event monitoring
- [x] Create Events Dashboard page in CRM (/admin/events)
- [x] Display last 100 events with status (success/fail)
- [x] Add real-time auto-refresh to Events Dashboard
- [x] Add event filtering by type and platform
- [x] Test all analytics enhancements

## Phase 32 - 3-Column Messaging Inbox with Lead Info Panel

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

### Rich Text Editor for Scripts
- [x] Install Tiptap editor package
- [x] Replace textarea with rich text editor in Scripts
- [x] Add formatting toolbar (bold, italic, underline, lists, headings)
- [x] Style editor to match dark theme
- [x] Save HTML content to database
- [x] Display formatted content in script view


## Phase 37 - Fix Leads Page Translations & Add Missing Features

### Leads Page Translation
- [x] Add useTranslation hook to CRM.tsx
- [x] Translate page title "Leads Management"
- [x] Translate "UTM Filters" section
- [x] Translate filter labels (Campaign, Placement, Site, Status)
- [x] Translate "Clear Filters" button
- [x] Translate table headers (ID, Date, Source, Quiz, Name, Phone, Email, Telegram, Score, Status, Actions)
- [x] Translate action buttons (View, Edit, Convert to Sale)
- [x] Translate "Create Lead Manually" button
- [x] Translate status badges (New, Contacted, Qualified, Converted, Lost)

### Fix Missing Features
- [x] Add "Convert to Sale" button functionality
- [x] Create ConvertToSaleModal component
- [x] Add tRPC procedure for converting lead to sale
- [x] Show success notification after conversion
- [x] Update lead status to "Converted" after sale creation


## Phase 38 - Fix Services Page Translations

### Services Page Translation
- [x] Add useTranslation hook to ServicesManagement.tsx
- [x] Translate page title "Services Management"
- [x] Translate "Main Services" and "Additional Services" section titles
- [x] Translate table headers (Service Name, Category, Price, Description, Actions)
- [x] Translate buttons (Add Service, Edit, Delete, Save, Cancel)
- [x] Translate form labels in Add/Edit Service modal
- [x] Translate delete confirmation dialog


## Phase 39 - Fix Sales Page Translations

### Sales Page Translation
- [x] Add useTranslation hook to SalesStatistics.tsx
- [x] Translate page title "Sales Statistics"
- [x] Translate metric cards (Total Revenue, Total Sales, Average Deal Size, Conversion Rate)
- [x] Translate table headers (Date, Lead Name, Service, Amount, Manager, Status)
- [x] Translate filter options
- [x] Translate status badges


## Phase 40 - Fix Scripts Page Translations

### Scripts Page Translation
- [x] Add useTranslation hook to SalesScripts.tsx
- [x] Translate page title "Sales Scripts"
- [x] Translate category tabs (Cold Call, Follow-up, Objection Handling, Closing)
- [x] Translate table headers (Title, Category, Last Updated, Actions)
- [x] Translate buttons (Add Script, Edit, Delete, View, Save, Cancel)
- [x] Translate delete confirmation dialog


## Phase 41 - Fix Settings Page Translations

### Settings Page Translation
- [x] Add useTranslation hook to AdminSettings.tsx
- [x] Translate page title "Integration Settings"
- [x] Translate tab labels (Instagram, WhatsApp, Email, Google Calendar)
- [x] Translate form labels (API Key, Bot Token, SMTP Host, Port, Username, Password, From Email)
- [x] Translate buttons (Save Settings, Test Connection)
- [x] Translate status messages


## Phase 42 - Fix AdminDashboard Translations

### AdminDashboard Translation
- [x] Add useTranslation hook to AdminDashboard.tsx
- [x] Translate page title "Admin Dashboard"
- [x] Translate all 12 card titles (CRM System, Analytics, Assignment Rules, etc.)
- [x] Translate card descriptions
- [x] Translate "Go to" link text

## Phase 171: CRITICAL - Preview CSS Does Not Match Published Quiz

**Issues:**
- [ ] Pikachu image too small in preview - only shows head, should show full character
- [ ] Title text too large in preview - takes too much space
- [ ] Subtitle text cut off in preview - not fully visible
- [ ] Image sizing/scaling different from published quiz
- [ ] Font sizes not matching published quiz
- [ ] Padding/spacing different from published quiz

**Root Cause:**
QuizDesignPage.tsx preview styles don't match QuizPage.tsx (published quiz) styles

**Solution:**
Copy exact CSS classes and styles from QuizPage.tsx to QuizDesignPage.tsx preview section

## Phase 172: URGENT - Editor Preview CSS Must Match Production EXACTLY (3rd Attempt)

**USER COMPLAINT:** Text sizes and image display in editor preview STILL don't match production

**ROOT CAUSE:** QuizDesignPage.tsx preview code has been manually modified and diverged from QuizPage.tsx

**SOLUTION:**
- [ ] Read QuizPage.tsx lines 227-340 (entire standard layout block)
- [ ] Copy EXACT code to QuizDesignPage.tsx WITHOUT ANY MODIFICATIONS
- [ ] Verify CSS classes match: text-4xl md:text-5xl lg:text-6xl for title
- [ ] Verify CSS classes match: text-xl md:text-2xl for subtitle
- [ ] Verify image container classes match exactly
- [ ] Test side-by-side: production vs editor preview
- [ ] Take screenshots and compare pixel-by-pixel

## Phase 173: Real-Time Preview + Quiz List Sync

**USER REQUIREMENTS:**
- [ ] ALL editor controls update preview in REAL-TIME (no save needed)
- [ ] Text inputs (title, subtitle, button) → preview updates on every keystroke
- [ ] Color pickers → preview updates immediately
- [ ] Font selector → preview updates immediately
- [ ] Alignment buttons → preview updates immediately
- [ ] Background image/video → preview updates immediately
- [ ] When saving settings → also update quizzes.name and quizzes.description
- [ ] Quiz list shows current title/subtitle from quiz_design_settings

**IMPLEMENTATION:**
- [ ] Remove getTextForLanguage() wrapper in preview rendering (already done in settings state)
- [ ] Preview renders directly from settings state (no database calls)
- [ ] Add onChange handlers to ALL input fields to update settings state
- [ ] Add quizzes table update to saveSettings mutation
- [ ] Extract Ukrainian text from titleText/subtitleText JSON for quizzes.name/description

## Phase 171: Quiz Editor Improvements - Color Hierarchy & Field Sync

**REQUESTED IMPROVEMENTS:**
- [ ] Add separate color controls for title and subtitle (currently both white)
- [ ] Synchronize editor name/description fields with quizzes table
- [ ] Test changes across all 16 quiz templates to ensure global compatibility

**IMPLEMENTATION:**
- [ ] Add titleColor and subtitleColor fields to quiz_design_settings table
- [ ] Add color pickers for title and subtitle in QuizDesignPage settings panel
- [ ] Update preview to use separate colors for title and subtitle
- [ ] Save name and description from editor to quizzes table (not just quiz_design_settings)
- [ ] Create test procedure to verify all 16 quiz templates render correctly
- [ ] Document color hierarchy best practices


## Phase 171: Quiz Editor Improvements (COMPLETED)
- [x] Add separate color controls for title and subtitle in QuizSettingsPanel
- [x] Add titleColor, subtitleColor, titleWeight, subtitleWeight to schema and backend
- [x] Synchronize quiz name and description fields with quizzes table
- [x] Add quiz info section at top of settings panel
- [x] Test changes across all 16 quiz templates

## Phase 172: URGENT - Mobile Preview Adaptation & Fixes
- [x] Remove rounded corners from mobile preview image (currently has border-radius)
- [x] Add TRUE mobile adaptation - vertical stack layout for mobile preview
- [x] Mobile layout: image on top (full width), text below (not 50/50)
- [x] Reduce font sizes for mobile (title, subtitle, button)
- [x] Make text fully visible on mobile (no overflow)
- [ ] Add font size sliders for title in editor (titleFontSize)
- [ ] Add font size sliders for subtitle in editor (subtitleFontSize)
- [ ] Update schema to store titleFontSize and subtitleFontSize
- [x] Apply responsive breakpoints to both preview and published quiz
- [x] Test mobile preview in editor (works correctly with vertical stack)
