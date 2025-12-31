# GTM Server Container Configuration

## 📊 Container Details

**Container ID:** GTM-KJR4RP5K  
**Configuration String:** `aWQ9R1RNLVdYWk5DOVFEJmVudj0xJmF1dGg9QUtPTUw4TVFuU1JQb1dhdW04NGVpUQ==`

---

## 🚀 Setup Instructions

### 1. Import Configuration

1. Go to [Google Tag Manager](https://tagmanager.google.com/)
2. Select your Server Container (GTM-KJR4RP5K)
3. Click **Admin** → **Import Container**
4. Upload the configuration file or paste the configuration string
5. Choose **Merge** option to keep existing tags
6. Click **Confirm**

### 2. Configure Server URL

Your GTM Server Container needs to be hosted on a custom domain for best performance:

**Recommended setup:**
- Domain: `gtm.yourdomain.com` (replace with your actual domain)
- SSL Certificate: Required (Let's Encrypt or Cloudflare)
- Server: Cloud Run, App Engine, or custom VPS

**Configuration:**
```bash
# Add DNS record
Type: A
Name: gtm
Value: [Your Server IP]

# Or CNAME for Cloud Run
Type: CNAME
Name: gtm
Value: ghs.googlehosted.com
```

### 3. Update Web Container

In your web container (GTM-KJR4RP5K), update the Server Container URL:

1. Go to **Admin** → **Container Settings**
2. Find **Server Container URLs**
3. Add: `https://gtm.yourdomain.com`
4. Save and Publish

---

## 🎯 Server-Side Tags Configuration

### Meta Conversions API Tag

**Tag Type:** Meta Conversions API  
**Trigger:** All Events

**Configuration:**
```
Pixel ID: 720023837850036
Access Token: EAAL2VLAkKwsBQArtQkl8yeawxXtASeC4sSoU5ci8Rbuul9XdaFqljBeZBoZCnYECBy1Txr1efCeT7ljBdImbK9CrrVEr45LbIU19CbKFVwngchOLS5KAZBKwHKUsKjQoQXZCtJyFySyUkDqxsn7dt1gtcZBoWS2IV7XGWTZAUDCVrc0ZC7ednm7dGHrJV9YvwZDZD

Event Mapping:
- CompleteRegistration → Lead submission
- InitiateCheckout → Call scheduled
- AddToCart → Callback requested
- Purchase → Sale completed
```

### GA4 Tag

**Tag Type:** Google Analytics: GA4 Event  
**Trigger:** All Events

**Configuration:**
```
Measurement ID: G-BS1VTVTWVC
API Secret: mafjIn1MRsSueyQ7d6NF2A

Event Mapping:
- generate_lead → Lead submission
- begin_checkout → Call scheduled
- add_to_cart → Callback requested
- purchase → Sale completed
```

---

## 📈 Benefits of Server-Side Tagging

1. **Bypass Ad Blockers** - Events sent from server, not blocked by browser extensions
2. **Better Data Quality** - More accurate tracking, no client-side interference
3. **Improved Performance** - Reduces page load time
4. **Enhanced Privacy** - Control what data is sent to third parties
5. **Extended Cookie Lifetime** - Server-side cookies last longer

---

## 🔧 Testing

### Test Server Container

1. Go to GTM → **Preview Mode**
2. Enter your website URL
3. Check **Server Requests** tab
4. Verify events are sent to both Meta and GA4

### Test Events

**Test Lead Submission:**
```bash
# Submit a quiz
# Check Meta Events Manager: CompleteRegistration event
# Check GA4 Realtime: generate_lead event
```

**Test Status Changes:**
```bash
# Change lead status to "Дзвінок заплановано"
# Check Meta: InitiateCheckout event
# Check GA4: begin_checkout event
```

**Test Purchase:**
```bash
# Change lead status to "Виграно"
# Check Meta: Purchase event with real amount
# Check GA4: purchase event with transaction details
```

---

## 🛠️ Troubleshooting

### Events not appearing in Meta

1. Check Access Token is valid (regenerate if needed)
2. Verify Pixel ID is correct
3. Check Server Container URL is accessible
4. Review Meta Events Manager → Diagnostics

### Events not appearing in GA4

1. Verify Measurement ID and API Secret
2. Check GA4 Realtime reports (events appear within 30 seconds)
3. Review Server Container Debug Console
4. Check for errors in GTM Preview Mode

### Server Container not responding

1. Check DNS records are correct
2. Verify SSL certificate is valid
3. Check server logs for errors
4. Ensure Server Container is deployed and running

---

## 📚 Resources

- [GTM Server-Side Tagging Guide](https://developers.google.com/tag-platform/tag-manager/server-side)
- [Meta Conversions API Documentation](https://developers.facebook.com/docs/marketing-api/conversions-api)
- [GA4 Measurement Protocol](https://developers.google.com/analytics/devguides/collection/protocol/ga4)

---

## 🔐 Security Notes

- **Never commit Access Tokens** to version control
- **Rotate tokens regularly** (every 60 days recommended)
- **Use environment variables** for sensitive data
- **Monitor API usage** to detect unauthorized access
- **Enable 2FA** on Meta Business Manager and Google accounts
