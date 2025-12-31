# PIKALEADS CRM System TODO

## Phase 185: Case Studies Enhancement & Image Optimization (2025-12-30)

- [x] Create seed-data script with 5-6 real case studies with metrics
- [x] Add lazy loading to all images (homepage, Meta Ads page, quiz pages)
- [x] Verify case studies admin panel exists and works
- [x] Add case studies management to CRM navigation
- [ ] Test case studies CRUD operations
- [ ] Test image lazy loading performance

## Phase 184: Add Real Case Studies & Individual Pages (2025-12-30)
- [x] Add 5 real case studies via SQL with rich content
- [x] Create individual case study page component (/case-studies/[slug])
- [x] Update CaseStudyPage to display all results fields dynamically
- [x] Display full case study content with images, metrics, results
- [x] Add breadcrumbs and navigation
- [x] Fix authentication error on homepage - changed to public procedures
- [ ] Verify responsive design on mobile (375px, 414px)
- [ ] Verify responsive design on tablet (768px, 1024px)
- [ ] Test "Читати повний кейс" button links
- [ ] Test all case studies display correctly on Home and Meta Ads pages

## Phase 188: Create 7 Service Landing Pages (2025-12-31)

- [x] Read all Google Docs specifications for content structure
- [x] Copy all Pikachu hero images to /client/public/
- [x] Create ServicePage component with all sections
- [x] Implement Google Ads page with full content
- [ ] Implement TikTok Ads page with full content
- [ ] Implement X (Twitter) Ads page with full content
- [ ] Implement Telegram Ads page with full content
- [ ] Implement Web Development page with full content
- [ ] Implement Web Design page with full content
- [ ] Implement App Development page with full content
- [ ] Test all pages responsiveness (mobile, tablet, desktop)
- [ ] Create final checkpoint with all 7 pages

## URGENT: Fix All Service Buttons on Homepage
- [ ] Change Google Ads "Дізнатись більше" to navigate to /services/google-ads
- [ ] Change TikTok Ads "Дізнатись більше" to navigate to /services/tiktok-ads
- [ ] Change X (Twitter) Ads "Дізнатись більше" to navigate to /services/x-ads
- [ ] Change Telegram Ads "Дізнатись більше" to navigate to /services/telegram-ads
- [ ] Change Web Development "Дізнатись більше" to navigate to /services/web-development
- [ ] Change Web Design "Дізнатись більше" to navigate to /services/web-design
- [ ] Change App Development "Дізнатись більше" to navigate to /services/app-development

## CRITICAL FIXES (2025-12-31)

- [x] Fix image cropping and alignment on all service pages (images not properly cropped)
- [x] Rebuild Google Ads service page with complete content from requirements (missing all text blocks, hero, problems, solution system, FAQ, etc.)
- [x] Make lead generation form look impressive and professional (not just basic form)

## COMPLETE SERVICE PAGES REBUILD (2025-12-31)

### Design & Components
- [ ] Create unified design system matching homepage (cyberpunk yellow/cyan colors)
- [ ] Fix Pikachu images - same size, cropping, presentation as homepage (square, object-contain, centered)
- [ ] Add popup modal component for lead capture on all service pages
- [ ] Ensure forms look impressive and professional (not basic)
- [ ] Add form at bottom of each service page

### Individual Service Pages (Read TZ and implement ALL con- [x] TikTok Ads - read TZ, implement all 8 blocks, add forms and popup
- [x] X (Twitter) Ads - read TZ, implement all 8 blocks, add forms and popup
- [x] Telegram Ads - read TZ, implement all 8 blocks, add forms and popup
- [x] Web Development - read TZ, implement all content blocks, add forms and popup
- [x] Web Design - read TZ, implement all content blocks, add forms and popup
- [x] App Development - read TZ, implement all content blocks, add forms and popup
- [x] Google Ads - read TZ, implement all 8 blocks, add forms and popuptyling

### Testing
- [ ] Test all images display correctly on desktop
- [ ] Test all images crop properly on mobile (375px, 414px)
- [ ] Test all images crop properly on tablet (768px, 1024px)
- [ ] Test popup modal works on all pages
- [ ] Test all forms submit correctly
- [ ] Verify unified design across all 7 pages

## URGENT: Service Pages Fixes (2025-12-31)

### Critical Issues
- [x] Fix TikTok Ads 404 error - check route in App.tsx
- [x] Fix X (Twitter) Ads 404 error - check route in App.tsx
- [x] Fix all other service pages 404 errors
- [x] Verify all routes work: /services/tiktok-ads, /services/x-ads, /services/telegram-ads, /services/web-development, /services/web-design, /services/app-development

### Design Improvements
- [x] Apply homepage fonts to ALL service pages (Bungee for headings, Eurostile Bold Extended for body text)
- [x] Redesign all content cards with premium style (large icons, neon borders, gradient backgrounds like reference image)
- [x] Add large platform icons to "Вам це знайомо" blocks on TikTok, X, Google, Telegram Ads
- [x] Add icons to "Наше рішення" blocks on TikTok, X, Google, Telegram Ads
- [x] Add premium cards to Web Development page
- [x] Add premium cards to Web Design page
- [x] Add premium cards to App Development page

### Button Fixes
- [x] Change "ОТРИМАТИ БЕЗКОШТОВНИЙ АУДИТ" to "ОТРИМАТИ АУДИТ" everywhere
- [x] Make "Залишити заявку" button yellow (#FFD93D) with black text
- [x] Remove text "Без зобов'язань. Скажемо чесно, чи має сенс запуск у вашій ніші."

### Pikachu Size Fixes
- [x] Increase Pikachu size on TikTok Ads page to match homepage (500-850px)
- [x] Increase Pikachu size on X Ads page to match homepage
- [x] Increase Pikachu size on Telegram Ads page to match homepage
- [x] Increase Pikachu size on Google Ads page to match homepage
- [x] Increase Pikachu size on Web Dev page to match homepage
- [x] Increase Pikachu size on Web Design page to match homepage
- [x] Increase Pikachu size on App Dev page to match homepage
- [ ] Verify Pikachu responsive sizing on mobile/tablet/desktop
