# PIKALEADS CRM System TODO

## Phase 178: URGENT - Logo Fixes, Testimonials, Case Studies & Mobile CTA (2025-12-30)

**CRITICAL ISSUES:**
- [x] Remove glow/highlight effect from partner logos (they look like they have no background)
- [x] Remove magnifying glass icon from logos section
- [x] Reduce spacing between logos to show more in viewport
- [x] Add mobile CTA button "Отримати консультацію" in middle of page for better conversion

**TESTIMONIALS:**
- [x] Add testimonial: Інна Морозова (5 stars, 1 week ago)
- [x] Add testimonial: SH SH (5 stars, 2 weeks ago)
- [x] Add testimonial: Oleksiy Gritsay (5 stars, 2 weeks ago)
- [x] Add testimonial: Александр Бильской (4 stars, 2 weeks ago)
- [x] Add testimonial: Артем Білокур (4 stars, 2 weeks ago)
- [x] Add testimonial: Alla Dresses (5 stars, 2 weeks ago)
- [x] Set different relative dates (1 week, 2 weeks, 1 month, 3 months, 6 months, 1 year ago)

**CASE STUDIES SYSTEM:**
- [x] Scrape case study 1: E-com в Україні (https://wleads.com.ua/tpost/503gfz25v1-e-com-v-ukran-v-nsh-prodazh-lyustr-ta-sv)
- [x] Scrape case study 2: Big бюджет 18 млн (https://wleads.com.ua/tpost/s2ru7s93x1-big-byudzhet-abo-keis-na-18-mln-byudzhet)
- [x] Scrape case study 3: Від 100 до 1500 лідів (https://wleads.com.ua/tpost/dr2z96dav1-shlyah-vd-100-ldv-na-marafon-do-1500-v-d)
- [x] Create case_studies table with fields: title, description, content, metrics, images, pageVisibility[]
- [x] Create admin panel for case studies CRUD
- [x] Add page visibility selector (home, quiz, services pages)
- [x] Display case studies on frontend with filtering by current page
- [x] Format all content properly with markdown support
- [ ] Add 3 case studies to database via admin panel

## Phase 177: URGENT - Client Logos Carousel Animation (2025-12-30) - COMPLETED

**CRITICAL ISSUES:**
- [x] Client logos section needs auto-rotating carousel animation
- [x] Logos need bright neon colors with glow effects for visibility
- [x] Add smooth infinite scroll animation
- [x] Test on mobile and desktop

## Phase 176: URGENT - Fix Client Logos & Mobile Layout (2025-12-30) - COMPLETED

**CRITICAL ISSUES:**
- [x] Replace testimonial screenshots with REAL TEXT from screenshots (names, reviews, ratings)
- [x] Client logos are invisible/too dark - regenerate with bright colors
- [x] Add rotation animation to client logos
- [x] Fix mobile layout - Pikachu with floating cards must be on TOP
- [x] Test all changes before delivery

## Phase 175: Add Testimonials & Fix Responsive Layout (2025-12-30) - COMPLETED

**NEW REQUIREMENTS:**
- [x] Fix responsive layout issues on main page (match homepage adaptation)
- [x] Add testimonial screenshots section to Home page
- [x] Copy 6 testimonial images to project public folder
- [x] Create testimonials component with proper styling
- [x] Ensure responsive design for testimonials section

## Phase 174: CRITICAL - Mobile Preview Must Match Published Responsive Behavior (2025-12-25)

**CRITICAL ISSUES:**
- [x] Mobile preview shows Pikachu image - should be HIDDEN like published version - FIXED
- [x] Desktop preview shows 60/40 split - should be 50/50 like published - FIXED (removed max-w-xl)
- [x] Mobile preview text layout - matches published formatting - FIXED
- [x] Mobile preview button styling - matches published - FIXED
- [x] Preview is PIXEL-PERFECT copy of published quiz - FIXED
- [x] All spacing, sizes, colors match published exactly - FIXED
- [x] Alignment changed from 'right' to 'left' to match published quiz - FIXED

**ROOT CAUSE:**
- Editor preview uses manual previewMode switching
- Published quiz uses CSS media queries (@media)
- These two approaches produce different results

**SOLUTION:**
- Editor preview must render with SAME CSS as QuizPage.tsx
- Use iframe with actual width constraints to trigger real media queries
- OR: Copy exact responsive logic from published quiz to preview
- Test: Published mobile (430px) hides image, preview must also hide it

## Phase 173: URGENT - Fix Mobile Preview in Editor (COMPLETED 2025-12-25)

**CRITICAL BUG - FIXED:**
- [x] Mobile preview button doesn't change layout - still shows 50/50 split instead of vertical stack
- [x] When previewMode === 'mobile', preview must show:
  * Image on top (full width)
  * Text content below (full width)
  * Vertical stack layout (flex-col)
- [x] Fix QuizDesignPage.tsx preview rendering logic
- [x] Test all 3 breakpoints: Desktop (50/50), Tablet (50/50), Mobile (vertical stack)

**SOLUTION:**
- Changed main container from `flex flex-col lg:flex-row` to dynamic `flex ${previewMode === 'mobile' ? 'flex-col' : 'flex-col lg:flex-row'}`
- Updated order classes for image/text sections to respect previewMode
- Updated alignment classes to respect previewMode
- All 3 breakpoint buttons now work correctly

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


## Phase 179: Remove All Card Styling from Logo Carousel (2025-12-30) - COMPLETED
- [x] Remove border from logo cards
- [x] Remove background/backdrop from logo cards  
- [x] Remove padding from logo cards (removed p-4 from both carousel sets)
- [x] Keep only img element without wrapper styling
- [x] Logos now display cleanly without visible squares/borders
