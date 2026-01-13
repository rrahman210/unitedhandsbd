# Email Provider Decision - United Hands Bangladesh

## Executive Summary

**Recommended Stack (Total: $0/month)**

| Component | Provider | Purpose |
|-----------|----------|---------|
| Inbox | Zoho Mail Free | Read/send emails manually |
| Transactional | Resend | Automated emails (confirmations, notifications) |
| Marketing | MailerLite | Newsletter campaigns (already integrated) |

---

## Requirements

1. **Full Inbox Access** - Read and send emails via webmail/mobile app
2. **Transactional Emails** - Automated confirmations, notifications
3. **Best Deliverability** - Priority over cost
4. **Cost Efficient** - Minimize expenses while maintaining quality
5. **No Nonprofit Registration** - Solutions that don't require official NGO status

---

## Email Hosting Comparison (Inbox Access)

### Option 1: Zoho Mail Free (Recommended)

| Feature | Details |
|---------|---------|
| **Cost** | $0/month |
| **Users** | Up to 5 |
| **Storage** | 5 GB per user |
| **Inbox Access** | Webmail + IMAP/POP |
| **Mobile App** | Yes (iOS/Android) |
| **Custom Domain** | Yes |
| **Deliverability** | Good |
| **Requirements** | None (no registration needed) |

**Pros:**
- Completely free for small teams
- Professional webmail interface
- Mobile apps available
- IMAP support for email clients (Outlook, Apple Mail)
- No nonprofit registration required

**Cons:**
- Storage limited to 5GB per user
- Less brand recognition than Gmail
- No calendar integration in free tier

**Setup Complexity:** Medium (DNS configuration required)

---

### Option 2: Google Workspace

| Feature | Details |
|---------|---------|
| **Cost** | $6/user/month |
| **Users** | Unlimited (paid) |
| **Storage** | 30 GB per user |
| **Inbox Access** | Gmail |
| **Mobile App** | Yes |
| **Deliverability** | Excellent |
| **Requirements** | Payment |

**Pros:**
- Best deliverability
- Familiar Gmail interface
- Full Google integration (Calendar, Drive)

**Cons:**
- Costs $6/user/month
- Free nonprofit tier requires official registration
- Overkill for small organization

**Setup Complexity:** Easy

---

### Option 3: Cloudflare Email Routing (Current Setup)

| Feature | Details |
|---------|---------|
| **Cost** | $0 |
| **Inbox** | Forwarding only |
| **Sending** | Not included |
| **Deliverability** | N/A (receive only) |

**Pros:**
- Already configured
- Zero cost
- Simple forwarding

**Cons:**
- Cannot send emails as @unitedhandsbd.org
- No true inbox management
- Replies come from personal email

**Setup Complexity:** Already done

---

## Transactional Email Comparison

### Option 1: Resend (Recommended)

| Feature | Details |
|---------|---------|
| **Free Tier** | 3,000 emails/month |
| **Paid Tier** | $20/month for 50,000 emails |
| **Deliverability** | Excellent |
| **API Quality** | Best-in-class |
| **React Email** | Native support |
| **Webhooks** | Yes |

**Pricing at Scale:**
- 1,000 emails/month: $0
- 10,000 emails/month: $20
- 50,000 emails/month: $20

**Pros:**
- Modern, developer-friendly API
- Excellent documentation
- React Email integration
- Great deliverability
- Generous free tier

**Cons:**
- Newer company (founded 2022)
- Smaller community than SendGrid

**Setup Complexity:** Very Easy

---

### Option 2: Postmark

| Feature | Details |
|---------|---------|
| **Free Tier** | 100 emails/month |
| **Paid Tier** | $15/month for 10,000 emails |
| **Deliverability** | Best-in-class |
| **API Quality** | Excellent |
| **Templates** | Built-in |

**Pricing at Scale:**
- 1,000 emails/month: ~$15
- 10,000 emails/month: $15
- 50,000 emails/month: $60

**Pros:**
- Highest deliverability reputation
- Excellent for transactional emails
- Strong anti-spam stance

**Cons:**
- Expensive for low volume
- Strict content policies
- Small free tier

**Setup Complexity:** Easy

---

### Option 3: SendGrid (Twilio)

| Feature | Details |
|---------|---------|
| **Free Tier** | 100 emails/day (3,000/month) |
| **Paid Tier** | $19.95/month for 50,000 emails |
| **Deliverability** | Good |
| **API Quality** | Good |
| **Templates** | Built-in |

**Pricing at Scale:**
- 1,000 emails/month: $0
- 10,000 emails/month: $19.95
- 50,000 emails/month: $19.95

**Pros:**
- Owned by Twilio (stable)
- Good documentation
- Generous free tier

**Cons:**
- Deliverability has declined
- Complex pricing
- Account verification can be slow

**Setup Complexity:** Medium

---

### Option 4: Amazon SES

| Feature | Details |
|---------|---------|
| **Free Tier** | 3,000/month (from EC2) |
| **Paid Tier** | $0.10 per 1,000 emails |
| **Deliverability** | Good |
| **API Quality** | Complex |

**Pricing at Scale:**
- 1,000 emails/month: $0.10
- 10,000 emails/month: $1.00
- 50,000 emails/month: $5.00

**Pros:**
- Extremely cheap at scale
- AWS reliability
- Full control

**Cons:**
- Complex setup
- Requires AWS account
- No built-in templates
- Sandbox mode by default

**Setup Complexity:** Hard

---

## Decision Matrix

| Provider | Free Tier | Cost @10k | Deliverability | Setup | Developer Experience |
|----------|-----------|-----------|----------------|-------|---------------------|
| **Resend** | 3,000/mo | $20 | Excellent | Easy | Excellent |
| Postmark | 100/mo | $15 | Best | Easy | Good |
| SendGrid | 3,000/mo | $20 | Good | Medium | Good |
| Amazon SES | ~3,000/mo | $1 | Good | Hard | Complex |

---

## Final Recommendation

### For United Hands Bangladesh

**Email Hosting: Zoho Mail Free**
- $0/month
- Up to 5 users with full inbox
- No nonprofit registration required
- Setup: 30 minutes (DNS configuration)

**Transactional API: Resend**
- $0/month (3,000 emails free)
- Excellent deliverability
- Best developer experience
- Easy Cloudflare Workers integration

**Marketing Emails: MailerLite (Keep)**
- Already integrated
- Handles newsletters
- CAN-SPAM compliance built-in

---

## Setup Instructions

### Step 1: Zoho Mail Setup

1. Go to https://www.zoho.com/mail/zohomail-pricing.html
2. Click "Get Started" under "Forever Free Plan"
3. Enter domain: `unitedhandsbd.org`
4. Verify domain ownership (add TXT record to Cloudflare)
5. Create mailboxes:
   - `support@unitedhandsbd.org` (main)
   - `noreply@unitedhandsbd.org` (transactional)
6. Access webmail at: https://mail.zoho.com

### Step 2: DNS Configuration (Cloudflare)

Add these records in Cloudflare DNS dashboard:

**MX Records (Email Receiving)**
```
Type: MX   Name: @   Content: mx.zoho.com    Priority: 10
Type: MX   Name: @   Content: mx2.zoho.com   Priority: 20
Type: MX   Name: @   Content: mx3.zoho.com   Priority: 50
```

**SPF Record (Email Authentication)**
```
Type: TXT  Name: @   Content: "v=spf1 include:zoho.com include:resend.com ~all"
```

**DKIM Records (Get from Zoho admin + Resend dashboard)**
```
Type: TXT  Name: zmail._domainkey   Content: [provided by Zoho]
Type: TXT  Name: resend._domainkey  Content: [provided by Resend]
```

**DMARC Record**
```
Type: TXT  Name: _dmarc   Content: "v=DMARC1; p=quarantine; rua=mailto:support@unitedhandsbd.org"
```

### Step 3: Resend Setup

1. Create account at https://resend.com
2. Click "Domains" → "Add Domain"
3. Enter: `unitedhandsbd.org`
4. Add the provided DNS records to Cloudflare
5. Click "Verify" and wait for confirmation
6. Go to "API Keys" → "Create API Key"
7. Copy the API key (starts with `re_`)
8. Add to Cloudflare Worker:
   ```bash
   npx wrangler secret put RESEND_API_KEY
   # Paste your API key when prompted
   ```

---

## Environment Variables

```env
# Resend (Transactional emails)
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxx

# Email Configuration
EMAIL_FROM=United Hands Bangladesh <noreply@unitedhandsbd.org>
ADMIN_EMAIL=support@unitedhandsbd.org

# Existing (MailerLite - keep as is)
MAILERLITE_API_KEY=existing_key
MAILERLITE_GROUP_ID=existing_group_id
```

---

## Cost Summary

| Scenario | Zoho Mail | Resend | MailerLite | Total |
|----------|-----------|--------|------------|-------|
| Current (1k emails/mo) | $0 | $0 | $0 | **$0** |
| Growth (5k emails/mo) | $0 | $0 | $0 | **$0** |
| Scale (10k emails/mo) | $0 | $20 | $0 | **$20** |

---

## Deliverability Checklist

- [ ] Domain verified with Zoho
- [ ] Domain verified with Resend
- [ ] SPF record configured
- [ ] DKIM records configured (both Zoho + Resend)
- [ ] DMARC record configured
- [ ] Sending domain matches From address
- [ ] Unsubscribe header for marketing emails (MailerLite handles this)

---

## FAQ

**Q: Why not Amazon SES for lowest cost?**
A: Requires AWS account, complex setup, sandbox mode restrictions. Resend is free up to 3,000/month with much easier setup.

**Q: Why Zoho over free Gmail alternatives?**
A: Gmail's free tier doesn't support custom domains. Google Workspace for Nonprofits requires official registration.

**Q: Can we send from Gmail?**
A: You can configure Zoho to allow sending via Gmail's SMTP relay, but it's more complex. Zoho's webmail is recommended.

**Q: What if we exceed 3,000 transactional emails/month?**
A: Resend charges $20/month for up to 50,000 emails. This is very cost-effective for growth.
