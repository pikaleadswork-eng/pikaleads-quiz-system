# PIKALEADS Quiz System TODO

## Database & Backend
- [x] Create database schema for leads (quiz_name, answers, name, phone, telegram, timestamp)
- [x] Create tRPC procedures for saving leads
- [x] Create Telegram bot integration for sending leads

## Design & Styling
- [x] Setup dark theme with black background (#000000)
- [x] Configure purple (#5B2E90) and yellow (#FFD93D) accent colors
- [x] Add Inter/Montserrat fonts via Google Fonts
- [x] Upload and integrate Pikachu logo
- [x] Create esports-style branding components

## Quiz Components
- [x] Create reusable Quiz component with 4-step progress bar
- [x] Create Question component with multiple choice options
- [x] Create Lead capture form (Name, Phone, Telegram)
- [x] Add large buttons with shadow effects

## Quiz Pages (10 total)
- [x] META - Furniture quiz (/meta-furniture)
- [x] META - Repair quiz (/meta-repair)
- [x] META - E-commerce quiz (/meta-ecom)
- [x] META - Products quiz (/meta-products)
- [x] META - Telegram B2B quiz (/meta-telegram)
- [x] GOOGLE - Furniture quiz (/google-furniture)
- [x] GOOGLE - Repair quiz (/google-repair)
- [x] GOOGLE - E-commerce quiz (/google-ecom)
- [x] GOOGLE - Products quiz (/google-products)
- [x] GOOGLE - Telegram B2B quiz (/google-telegram)

## Additional Pages
- [x] Create Thank You page with Telegram redirect button
- [x] Create Index/Menu page for quiz selection

## Testing & Deployment
- [x] Test all 10 quiz flows
- [x] Test Telegram integration
- [x] Test database storage
- [x] Verify responsive design on mobile/tablet/desktop
- [x] Create checkpoint for deployment

## NEW FEATURES - Phase 2

### Multilanguage Support
- [x] Add i18n system with 5 languages (UA, RU, EN, PL, DE)
- [x] Auto-detect user language from browser
- [x] Create language switcher component
- [x] Translate all quiz content and UI
- [x] Store language preference in localStorage

### Analytics & Tracking
- [x] Integrate Meta Pixel API for conversion tracking
- [x] Add custom Meta events for each quiz step
- [x] Integrate Google Analytics 4
- [x] Add custom GA4 events for each quiz step
- [x] Track drop-off points in funnels
- [x] Placeholder support for Meta Pixel ID and GA4 Measurement ID

### Admin Panel
- [x] Create protected admin dashboard route
- [x] Display all leads in sortable/filterable table
- [x] Show statistics by quiz type and language
- [ ] Add date range filters
- [x] Export leads to CSV functionality
- [ ] Show conversion funnel analytics
- [ ] Display drop-off rates per step

### A/B Testing
- [ ] Create A/B test variants table in database
- [ ] Add variant assignment logic
- [ ] Create UI for managing test variants
- [ ] Track performance by variant
- [ ] Test different offers
- [ ] Test different CTA buttons
- [ ] Test different question wording

### Quiz Landing Pages
- [x] Create separate landing page for each quiz
- [x] Add unique offer/headline per quiz
- [x] Add "Start Quiz" CTA button
- [x] Display bonus offer (Free Audit or Free Strategy)
- [x] Make each page optimized for direct ad traffic
- [x] Add social proof elements

### Content Translation
- [x] Translate Home page to all 5 languages
- [x] Complete quiz translations for all 10 quizzes
- [x] Translate LeadForm component
- [x] Translate ThankYou page

## Phase 3 - A/B Testing & Remarketing

### A/B Testing System
- [x] Create database schema for A/B test variants
- [x] Create database schema for test assignments and conversions
- [ ] Implement traffic splitting logic (50/50, 70/30, etc.)
- [ ] Create variant assignment based on user session
- [ ] Track conversions per variant
- [x] Create admin UI for creating test variants
- [ ] Create admin UI for viewing test results and statistics
- [ ] Add statistical significance calculator
- [ ] Implement winner declaration and auto-switch

### Remarketing Funnel
- [x] Create database schema for incomplete quiz sessions
- [ ] Track partial quiz completions with user contact info
- [ ] Create email template system for reminders
- [ ] Create SMS template system for reminders
- [ ] Implement scheduled reminder jobs (15 min, 1 hour, 24 hours)
- [ ] Add unsubscribe mechanism
- [ ] Create admin UI for managing remarketing campaigns
- [ ] Track remarketing conversion rates
- [ ] Integrate with email service provider (placeholder for SMTP/SendGrid)
- [ ] Integrate with SMS service provider (placeholder for Twilio)

### Admin Panel for Quiz Management
- [x] Create admin page for managing all quizzes
- [x] Add UI for editing quiz titles and subtitles
- [x] Add UI for editing quiz questions and answers
- [x] Add UI for editing offers and bonuses
- [x] Add UI for editing landing page content
- [x] Add quick A/B test variant switcher
- [x] Add preview mode for changes before publishing
- [ ] Test responsive design on mobile (320px, 375px, 414px)
- [ ] Test responsive design on tablets (768px, 1024px)
- [ ] Test responsive design on desktop (1280px, 1920px)

## Phase 4 - Complete A/B Testing & Responsive Design

### A/B Testing Implementation
- [x] Implement traffic splitting algorithm (50/50, 70/30, custom ratios)
- [x] Create variant assignment logic on quiz start
- [x] Track conversions automatically when lead is submitted
- [x] Calculate statistical significance (p-value, confidence interval)
- [x] Create admin UI for A/B test results with charts
- [ ] Add winner declaration functionality
- [ ] Implement auto-switch to winning variant

### Responsive Design Optimization
- [x] Test and fix Home page on mobile (320px, 375px, 414px)
- [x] Test and fix Home page on tablets (768px, 1024px)
- [x] Test and fix Home page on desktop (1280px, 1920px)
- [x] Test and fix Quiz pages on all screen sizes
- [x] Test and fix Admin panel on all screen sizes
- [x] Test and fix Thank You page on all screen sizes
- [x] Ensure all buttons and forms are touch-friendly on mobile
- [x] Check font sizes and readability on small screens

## Phase 5 - Custom CRM System

### Role Management
- [x] Add 'manager' role to user schema
- [ ] Create manager registration/invitation system
- [x] Implement role-based access control (RBAC)
- [x] Restrict manager access to leads and comments only
- [ ] Admin can manage users and assign roles

### Lead Status Management
- [x] Create lead_statuses table (id, name, color, order, createdBy)
- [x] Admin UI for creating/editing/deleting statuses (via tRPC)
- [ ] Seed default statuses: New, In Progress, Contacted, Qualified, Closed Won, Closed Lost
- [x] Assign status to each lead
- [x] Status change history tracking

### Comments System
- [x] Create lead_comments table (id, leadId, userId, comment, createdAt)
- [x] Managers can add comments to leads
- [x] Display comment history with timestamps and author
- [ ] Real-time comment updates
- [ ] Comment notifications

### CRM Interface for Managers
- [x] Create /crm route for managers
- [x] Lead list view with filters (status, date, quiz)
- [x] Lead detail view with full information
- [x] Quick status change dropdown
- [x] Comment input and history display
- [x] Activity log for each lead

### Instagram Direct Integration
- [ ] Request Instagram API credentials from user
- [x] Create Instagram messaging module (placeholder)
- [x] Send messages to clients via Instagram username (UI ready)
- [x] Store Instagram conversation history
- [ ] Link Instagram account to lead

### Telegram Integration for Client Communication
- [ ] Create Telegram bot for two-way communication
- [x] Link Telegram username to lead
- [x] Send messages to clients via Telegram (UI ready)
- [ ] Receive and display client replies in CRM
- [x] Conversation history in lead detail view

### Activity Logging
- [x] Create activity_log table (id, userId, leadId, action, details, createdAt)
- [x] Log all manager actions (status changes, comments, messages)
- [x] Display activity timeline in lead detail
- [x] Admin can view all activity across managers

## Phase 6 - Bug Fixes & Legal Pages

### Bug Fixes
- [x] Fix "Quiz not found" error on quiz pages
- [x] Verify all quiz routes are working correctly

### Privacy Policy & Cookie Consent
- [x] Create Privacy Policy page with GDPR compliance
- [x] Add Cookie Consent banner
- [x] Store cookie preferences in localStorage
- [x] Translate Privacy Policy to all 5 languages

### Contact Page
- [x] Create Contact page with company information
- [x] Add contact details: ФОП "Грибук Роман Миколайович"
- [x] Phone: 380992377117
- [x] Email: info@pika-leads.com
- [x] Address: вул. Незалежності 44а., м.Ківерці, Волинська обл
- [x] Translate Contact page to all 5 languages

### Complete Messenger Integration
- [ ] Implement Instagram Direct API integration
- [ ] Implement Telegram Bot for two-way communication
- [ ] Test message sending and receiving
- [ ] Add webhook endpoint for Telegram

### Manager Invitation System
- [ ] Create UI for admin to invite managers via email
- [ ] Generate invitation tokens
- [ ] Create registration page for invited managers
- [ ] Send invitation emails
- [ ] Auto-assign 'manager' role on registration

### Default Lead Statuses
- [ ] Run seed script to create default statuses
- [ ] Verify statuses appear in CRM
- [ ] Test status assignment to leads
