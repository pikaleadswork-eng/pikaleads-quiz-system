# PIKALEADS Analytics Setup Guide

## 🎯 Overview

This guide explains how to configure Meta Pixel and Google Analytics 4 for tracking quiz conversions and user behavior.

## 📊 Meta Pixel Setup

### Step 1: Get Your Meta Pixel ID

1. Go to [Meta Events Manager](https://business.facebook.com/events_manager)
2. Select your Pixel or create a new one
3. Copy your **Pixel ID** (15-16 digit number, e.g., `1234567890123456`)

### Step 2: Get Conversion API Token (Optional but Recommended)

1. In Events Manager, go to **Settings** → **Conversions API**
2. Click **Generate Access Token**
3. Copy the token

### Step 3: Add to Environment Variables

Add these variables to your `.env` file or through the Manus Settings panel:

```bash
VITE_META_PIXEL_ID=your_pixel_id_here
META_CONVERSION_API_TOKEN=your_token_here
```

### Tracked Events

The system automatically tracks:
- `Lead` - Quiz start
- `ViewContent` - Each quiz step
- `CompleteRegistration` - Quiz completion
- `Lead` - Form submission

---

## 📈 Google Analytics 4 Setup

### Step 1: Get Your Measurement ID

1. Go to [Google Analytics](https://analytics.google.com/)
2. Navigate to **Admin** → **Data Streams**
3. Select your web stream
4. Copy your **Measurement ID** (format: `G-XXXXXXXXXX`)

### Step 2: Get API Secret for Server-Side Tracking (Optional)

1. In the same Data Stream settings
2. Go to **Measurement Protocol API secrets**
3. Click **Create** and copy the secret

### Step 3: Add to Environment Variables

Add these variables to your `.env` file or through the Manus Settings panel:

```bash
VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX
GA4_API_SECRET=your_api_secret_here
```

### Tracked Events

The system automatically tracks:
- `quiz_start` - User starts a quiz
- `quiz_step` - Each question answered
- `quiz_complete` - All questions answered
- `form_view` - Lead form displayed
- `generate_lead` - Form submitted
- `quiz_drop_off` - User leaves before completing

---

## 🔧 Environment Variables Reference

### Client-Side (VITE_ prefix)

```bash
# Meta Pixel
VITE_META_PIXEL_ID=1234567890123456

# Google Analytics 4
VITE_GA4_MEASUREMENT_ID=G-ABC123DEF4
```

### Server-Side (Optional for advanced tracking)

```bash
# Meta Conversions API
META_CONVERSION_API_TOKEN=your_token_here

# GA4 Measurement Protocol
GA4_API_SECRET=your_secret_here
```

---

## 🧪 Testing

### Test Meta Pixel

1. Install [Meta Pixel Helper](https://chrome.google.com/webstore/detail/meta-pixel-helper) Chrome extension
2. Visit your quiz pages
3. Click the extension icon to verify events are firing

### Test Google Analytics

1. Go to GA4 → **Reports** → **Realtime**
2. Navigate through your quiz
3. Verify events appear in real-time report

---

## 📝 Notes

- **Without configuration**: The system will log events to console but won't send to analytics platforms
- **Client-side only**: Basic tracking works with just `VITE_` variables
- **Full tracking**: Add server-side tokens for Conversions API and Measurement Protocol
- **Privacy**: Ensure you have proper cookie consent and privacy policy

---

## 🎨 Custom Events

To add custom events, use the helper functions:

```typescript
// Meta Pixel
import { trackMetaEvent } from "@/lib/metaPixel";
trackMetaEvent("CustomEvent", { param: "value" });

// Google Analytics
import { trackGA4Event } from "@/lib/googleAnalytics";
trackGA4Event("custom_event", { param: "value" });
```

---

## 🔗 Useful Links

- [Meta Pixel Documentation](https://developers.facebook.com/docs/meta-pixel)
- [Meta Conversions API](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [Google Analytics 4 Documentation](https://developers.google.com/analytics/devguides/collection/ga4)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)
