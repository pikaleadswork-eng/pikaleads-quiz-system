# PIKALEADS Admin Panel Guide

## 📋 Table of Contents
1. [Admin Panel URLs](#admin-panel-urls)
2. [User Roles](#user-roles)
3. [Integration Setup](#integration-setup)
4. [Environment Variables Reference](#environment-variables-reference)
5. [Quick Start Guide](#quick-start-guide)

---

## 🔗 Admin Panel URLs

### Main Dashboard
**URL:** `/admin`  
**Access:** Admin only  
**Description:** Centralized navigation hub with quick stats

**Features:**
- Total leads count
- Active managers count
- Active A/B tests count
- Leads today count
- Quick links to all admin sections

---

### CRM System
**URL:** `/crm`  
**Access:** Admin and Managers  
**Description:** Lead management interface

**Features:**
- View all leads in table format
- Filter by status, quiz type, date range
- Filter by UTM parameters (campaign, ad group, ad, placement, keyword, site)
- Update lead status
- Add comments to leads
- Send messages via Telegram/Instagram/WhatsApp
- View activity log
- Export leads to CSV

**Manager Features:**
- View assigned leads only
- Update status and add comments
- Send messages to leads
- Cannot delete leads or change assignments

---

### Analytics Dashboard
**URL:** `/admin/analytics`  
**Access:** Admin only  
**Description:** UTM tracking and campaign performance

**Features:**
- Top campaigns by conversion rate
- Top ad groups by lead count
- Top ads by conversion rate
- Top placements/sources
- Top keywords
- Export analytics to CSV

**Metrics:**
- Leads count per UTM parameter
- Conversion rate calculation
- Performance comparison

---

### Assignment Rules
**URL:** `/admin/assignment-rules`  
**Access:** Admin only  
**Description:** Configure automatic lead assignment

**Features:**
- Create assignment rules (quiz name → manager)
- Set priority for rules (higher priority = first match)
- Enable/disable rules
- Edit existing rules
- Delete rules
- View rule statistics

**How it works:**
1. Lead submits quiz
2. System checks active assignment rules
3. Matches quiz name with rule
4. Assigns lead to specified manager
5. Logs assignment in activity log

---

### Manager Performance
**URL:** `/admin/performance`  
**Access:** Admin only  
**Description:** Manager leaderboard and statistics

**Features:**
- Total leads assigned per manager
- Total leads processed (status changed from "New")
- Conversion rate calculation
- Export performance data to CSV

**Metrics:**
- Leads Assigned: Total number of leads assigned to manager
- Leads Processed: Leads with status changed from "New"
- Conversion Rate: (Leads Processed / Leads Assigned) × 100%

---

### Manager Invitation
**URL:** `/admin/managers`  
**Access:** Admin only  
**Description:** Invite new managers to join the team

**Features:**
- View list of all managers
- Invite manager by email
- View invitation history (pending/accepted/expired)
- Invitation link generation
- Automatic role assignment on registration

**Invitation Process:**
1. Admin enters manager email
2. System generates unique invitation token
3. Email sent via SendGrid with registration link
4. Manager clicks link and completes registration
5. System automatically assigns "manager" role

---

### Quiz Management
**URL:** `/admin/quizzes`  
**Access:** Admin only  
**Description:** Edit quiz content and questions

**Features:**
- Edit quiz titles and subtitles
- Edit quiz questions and answer options
- Edit offers and bonuses
- Edit landing page content
- Preview changes before publishing
- Multi-language support (edit all 5 languages)

**Editable Fields:**
- Quiz title
- Quiz subtitle
- Bonus offer
- Questions (text and options)
- Landing page hero section
- Benefits section
- CTA button text

---

### A/B Testing
**URL:** `/admin/ab-tests`  
**Access:** Admin only  
**Description:** Create and manage quiz variants

**Features:**
- Create test variants for each quiz
- Set traffic split ratio (50/50, 70/30, custom)
- View test results and statistics
- Calculate statistical significance
- Declare winner and switch traffic

**Test Metrics:**
- Total sessions per variant
- Conversions per variant
- Conversion rate
- P-value (statistical significance)
- Confidence interval

---

### Calendar Integration
**URL:** `/admin/calendar`  
**Access:** Admin only  
**Description:** Manage Calendly and Google Calendar settings

**Features:**
- Configure Calendly API key
- Set Calendly event type URL
- Configure Google Calendar OAuth
- View upcoming appointments
- Sync calendar events

---

### Retargeting
**URL:** `/admin/retargeting`  
**Access:** Admin only  
**Description:** Export leads for Facebook Custom Audiences

**Features:**
- Filter leads by score (<40 for retargeting)
- Select leads for export
- Generate CSV in Facebook format (email, phone)
- Create Custom Audience name
- Export to Facebook Ads Manager

**Export Format:**
- Email (hashed with SHA-256)
- Phone (normalized format)
- Name (optional)

---

### Manager Dashboard
**URL:** `/manager`  
**Access:** Managers only  
**Description:** Manager-specific dashboard

**Features:**
- Assigned leads count (today, this week, total)
- Processed leads count
- Personal conversion rate
- Quick actions (view leads, send message)
- Performance comparison with team average

---

## 👥 User Roles

### Admin Role
**Database value:** `role = 'admin'`

**Permissions:**
- Full access to all admin panel sections
- Create/edit/delete assignment rules
- Invite managers
- View all leads and analytics
- Edit quiz content
- Manage A/B tests
- Export data

**How to create admin:**
```sql
UPDATE users SET role = 'admin' WHERE id = 1;
```

---

### Manager Role
**Database value:** `role = 'manager'`

**Permissions:**
- Access to CRM (/crm)
- View assigned leads only
- Update lead status
- Add comments
- Send messages to leads
- View own performance metrics

**How to create manager:**
1. Use Manager Invitation (/admin/managers)
2. Or manually:
```sql
UPDATE users SET role = 'manager' WHERE id = 2;
```

---

## 🔌 Integration Setup

### 1. Telegram Bot Integration

**Purpose:** Send lead notifications and enable two-way messaging

**Setup Steps:**

1. **Create Bot:**
   - Open Telegram and search for [@BotFather](https://t.me/BotFather)
   - Send `/newbot` command
   - Follow instructions to create bot
   - Copy **Bot Token** (format: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

2. **Get Chat ID:**
   - Send any message to your bot
   - Open browser and visit:
     ```
     https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getUpdates
     ```
   - Find `"chat":{"id":123456789}` in JSON response
   - Copy the **Chat ID**

3. **Add to .env:**
   ```env
   TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
   TELEGRAM_CHAT_ID=123456789
   ```

4. **Set Webhook (for two-way messaging):**
   ```bash
   curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
     -H "Content-Type: application/json" \
     -d '{"url": "https://ukraine.com.ua/api/webhooks/telegram"}'
   ```

5. **Test:**
   - Submit a test quiz
   - Check if notification appears in Telegram

---

### 2. SendGrid Email Integration

**Purpose:** Send manager invitation emails

**Setup Steps:**

1. **Create Account:**
   - Go to [SendGrid.com](https://sendgrid.com/)
   - Sign up for free account (100 emails/day)

2. **Create API Key:**
   - Navigate to **Settings → API Keys**
   - Click **Create API Key**
   - Name: "PIKALEADS Production"
   - Select **Full Access**
   - Copy API key (starts with `SG.`)

3. **Verify Sender:**
   - Go to **Settings → Sender Authentication**
   - Click **Verify a Single Sender**
   - Enter email: `noreply@ukraine.com.ua`
   - Complete verification via email

4. **Add to .env:**
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   SENDGRID_FROM_EMAIL=noreply@ukraine.com.ua
   ```

5. **Test:**
   - Go to `/admin/managers`
   - Invite a test manager
   - Check if email is received

---

### 3. Instagram Direct Integration (Optional)

**Purpose:** Send messages to leads via Instagram

**Setup Steps:**

1. **Create Meta App:**
   - Go to [developers.facebook.com](https://developers.facebook.com/)
   - Create new app
   - Add **Instagram Graph API** product

2. **Get Access Token:**
   - Go to **Graph API Explorer**
   - Select your app
   - Request permissions: `instagram_basic`, `instagram_manage_messages`
   - Generate **User Access Token**
   - Convert to **Long-Lived Token** (60 days)

3. **Connect Instagram Account:**
   - Go to **Instagram → Settings**
   - Connect your Instagram Business Account
   - Copy **Instagram Business Account ID**

4. **Add to .env:**
   ```env
   INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   INSTAGRAM_ACCOUNT_ID=17841400000000000
   ```

5. **Set Webhook:**
   ```bash
   curl -X POST "https://graph.facebook.com/v18.0/<APP_ID>/subscriptions" \
     -F "object=instagram" \
     -F "callback_url=https://ukraine.com.ua/api/webhooks/instagram" \
     -F "verify_token=your_verify_token" \
     -F "fields=messages" \
     -F "access_token=<ACCESS_TOKEN>"
   ```

6. **Test:**
   - Go to CRM
   - Send Instagram message to lead
   - Check if message is delivered

---

### 4. WhatsApp Business API Integration (Optional)

**Purpose:** Send messages to leads via WhatsApp

**Setup Steps:**

1. **Create Meta Business Account:**
   - Go to [business.facebook.com](https://business.facebook.com/)
   - Create Business Account
   - Complete business verification

2. **Setup WhatsApp:**
   - Navigate to **WhatsApp → Getting Started**
   - Add phone number
   - Verify phone number
   - Copy **Phone Number ID** and **Business Account ID**

3. **Generate Access Token:**
   - Go to **System Users → Add**
   - Generate token with `whatsapp_business_messaging` permission
   - Copy **Access Token**

4. **Add to .env:**
   ```env
   WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   WHATSAPP_PHONE_NUMBER_ID=123456789012345
   WHATSAPP_VERIFY_TOKEN=your_random_verify_token
   ```

5. **Set Webhook:**
   ```bash
   curl -X POST "https://graph.facebook.com/v18.0/<BUSINESS_ACCOUNT_ID>/subscribed_apps" \
     -H "Authorization: Bearer <ACCESS_TOKEN>" \
     -d "subscribed_fields=messages"
   ```

6. **Test:**
   - Go to CRM
   - Send WhatsApp message to lead
   - Check if message is delivered

---

### 5. Facebook Custom Audiences (Optional)

**Purpose:** Export leads for retargeting campaigns

**Setup Steps:**

1. **Create Facebook App:**
   - Go to [developers.facebook.com](https://developers.facebook.com/)
   - Create app with **Marketing API** product

2. **Get Access Token:**
   - Go to **Graph API Explorer**
   - Request permissions: `ads_management`, `business_management`
   - Generate **User Access Token**
   - Convert to **Long-Lived Token**

3. **Get Ad Account ID:**
   - Go to **Facebook Ads Manager**
   - Click **Account Settings**
   - Copy **Ad Account ID** (format: `act_123456789`)

4. **Add to .env:**
   ```env
   FACEBOOK_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   FACEBOOK_AD_ACCOUNT_ID=act_123456789
   ```

5. **Test:**
   - Go to `/admin/retargeting`
   - Select leads with score < 40
   - Export to Facebook
   - Check if Custom Audience is created in Ads Manager

---

### 6. Google Analytics 4 (Optional)

**Purpose:** Track user behavior and conversions

**Setup Steps:**

1. **Create GA4 Property:**
   - Go to [analytics.google.com](https://analytics.google.com/)
   - Create new property
   - Add **Web Data Stream** for `ukraine.com.ua`

2. **Get Measurement ID:**
   - Go to **Admin → Data Streams**
   - Click your stream
   - Copy **Measurement ID** (format: `G-XXXXXXXXXX`)

3. **Add to .env:**
   ```env
   VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
   ```

4. **Test:**
   - Open website in browser
   - Open browser DevTools → Network
   - Filter by "collect"
   - Submit quiz and check if GA4 events are sent

---

### 7. Meta Pixel (Optional)

**Purpose:** Track conversions for Facebook Ads

**Setup Steps:**

1. **Create Pixel:**
   - Go to [business.facebook.com/events_manager](https://business.facebook.com/events_manager)
   - Click **Connect Data Sources → Web → Meta Pixel**
   - Name: "PIKALEADS Pixel"
   - Enter website: `ukraine.com.ua`

2. **Get Pixel ID:**
   - Go to **Events Manager → Data Sources**
   - Click your pixel
   - Copy **Pixel ID** (15-digit number)

3. **Add to .env:**
   ```env
   VITE_META_PIXEL_ID=123456789012345
   ```

4. **Test:**
   - Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper/) Chrome extension
   - Open website
   - Check if pixel is firing
   - Submit quiz and verify "Lead" event

---

## 📝 Environment Variables Reference

### Required Variables

```env
# Database
DATABASE_URL=mysql://user:password@host:port/database

# JWT Secret (min 32 characters)
JWT_SECRET=your_random_secret_key_here

# Telegram Bot
TELEGRAM_BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz
TELEGRAM_CHAT_ID=123456789

# SendGrid Email
SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
SENDGRID_FROM_EMAIL=noreply@ukraine.com.ua
```

### Optional Variables

```env
# Instagram Direct
INSTAGRAM_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
INSTAGRAM_ACCOUNT_ID=17841400000000000

# WhatsApp Business
WHATSAPP_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_VERIFY_TOKEN=your_random_verify_token

# Facebook Retargeting
FACEBOOK_ACCESS_TOKEN=EAAxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
FACEBOOK_AD_ACCOUNT_ID=act_123456789

# Google Analytics 4
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX

# Meta Pixel
VITE_META_PIXEL_ID=123456789012345

# Calendly
CALENDLY_API_KEY=your_calendly_api_key

# Google Calendar
GOOGLE_CALENDAR_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CALENDAR_CLIENT_SECRET=your-client-secret
```

---

## 🚀 Quick Start Guide

### 1. First Login

1. **Access Admin Panel:**
   - URL: `https://ukraine.com.ua/admin`
   - Login with Manus OAuth

2. **Set Admin Role:**
   ```sql
   UPDATE users SET role = 'admin' WHERE email = 'your@email.com';
   ```

3. **Verify Dashboard:**
   - Check if stats are loading
   - Verify all navigation cards are clickable

---

### 2. Create Lead Statuses

1. **Run Seed Script:**
   ```bash
   node server/seed-db.mjs
   ```

2. **Verify Statuses:**
   - Go to `/crm`
   - Check if status dropdown has options:
     - New
     - In Progress
     - Contacted
     - Qualified
     - Closed Won
     - Closed Lost

---

### 3. Invite First Manager

1. **Go to Manager Invitation:**
   - URL: `/admin/managers`

2. **Enter Manager Email:**
   - Email: `manager@example.com`

3. **Copy Invitation Link:**
   - Link format: `https://ukraine.com.ua/register-manager?token=xxx`
   - Send to manager via email or messenger

4. **Manager Registration:**
   - Manager clicks link
   - Completes registration form
   - System automatically assigns "manager" role

---

### 4. Create Assignment Rule

1. **Go to Assignment Rules:**
   - URL: `/admin/assignment-rules`

2. **Create Rule:**
   - Name: "Furniture Quiz → Manager 1"
   - Quiz Name: `furniture`
   - Manager: Select from dropdown
   - Priority: `1`

3. **Enable Rule:**
   - Toggle "Active" switch

4. **Test:**
   - Submit furniture quiz
   - Check if lead is assigned to manager

---

### 5. Test Quiz Submission

1. **Open Quiz:**
   - URL: `https://ukraine.com.ua/quiz/furniture?utm_campaign=test&utm_adgroup=test_ad&utm_ad=test_creative`

2. **Complete Quiz:**
   - Answer all questions
   - Fill contact form
   - Submit

3. **Verify:**
   - Check Telegram notification
   - Check CRM for new lead
   - Verify UTM parameters are captured
   - Verify lead is assigned to manager (if rule exists)

---

### 6. Send Test Message

1. **Go to CRM:**
   - URL: `/crm`

2. **Click on Lead:**
   - Opens lead detail modal

3. **Send Message:**
   - Select platform (Telegram/Instagram/WhatsApp)
   - Type message
   - Click Send

4. **Verify:**
   - Check if message is delivered
   - Check activity log for message record

---

## 📊 Analytics & Reporting

### View UTM Analytics

1. **Go to Analytics:**
   - URL: `/admin/analytics`

2. **Metrics Available:**
   - Top campaigns by conversion rate
   - Top ad groups by lead count
   - Top ads by performance
   - Top placements/sources
   - Top keywords

3. **Export Data:**
   - Click "Export to CSV"
   - Opens in Excel/Google Sheets

---

### View Manager Performance

1. **Go to Performance:**
   - URL: `/admin/performance`

2. **Metrics Available:**
   - Leads Assigned
   - Leads Processed
   - Conversion Rate

3. **Export Data:**
   - Click "Export to CSV"

---

### Export Leads for Retargeting

1. **Go to Retargeting:**
   - URL: `/admin/retargeting`

2. **Filter Leads:**
   - System shows leads with score < 40

3. **Select Leads:**
   - Check boxes for leads to export

4. **Create Audience:**
   - Enter audience name
   - Click "Export to Facebook"

5. **Verify:**
   - Go to Facebook Ads Manager → Audiences
   - Check if Custom Audience is created

---

## 🔧 Troubleshooting

### Telegram notifications not working

**Check:**
1. Verify `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID` in .env
2. Test bot token:
   ```bash
   curl "https://api.telegram.org/bot<TOKEN>/getMe"
   ```
3. Check server logs: `pm2 logs pikaleads`

---

### SendGrid emails not sending

**Check:**
1. Verify `SENDGRID_API_KEY` and `SENDGRID_FROM_EMAIL` in .env
2. Verify sender email is verified in SendGrid
3. Check SendGrid Activity Feed for errors
4. Test API key:
   ```bash
   curl -X POST https://api.sendgrid.com/v3/mail/send \
     -H "Authorization: Bearer $SENDGRID_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"personalizations":[{"to":[{"email":"test@example.com"}]}],"from":{"email":"noreply@ukraine.com.ua"},"subject":"Test","content":[{"type":"text/plain","value":"Test"}]}'
   ```

---

### Lead assignment not working

**Check:**
1. Verify assignment rule is active
2. Check quiz name matches exactly (case-sensitive)
3. Verify manager exists in database
4. Check activity log for assignment errors
5. Enable auto-assignment in system settings

---

### Instagram/WhatsApp messages not sending

**Check:**
1. Verify access tokens are valid (not expired)
2. Check if Instagram/WhatsApp account is connected
3. Verify webhook is configured correctly
4. Check Meta App permissions
5. Review server logs for API errors

---

## 📞 Support

**Contact Information:**
- **Email:** info@pika-leads.com
- **Phone:** +380 99 237 7117
- **Address:** вул. Незалежності 44а., м.Ківерці, Волинська обл

**Documentation:**
- Full deployment guide: `DEPLOYMENT_GUIDE.md`
- Database schema: `drizzle/schema.ts`
- API documentation: `server/routers.ts`

---

**Document Version:** 1.0  
**Last Updated:** December 7, 2024  
**Author:** PIKALEADS Development Team
