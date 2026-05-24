# NDANow UX Bulletproofing & QA Agent Spec

> Comprehensive audit of every workflow, user story, known breakpoints, test credentials, and infrastructure gaps.
> Last updated: 2026-05-23

---

## Table of Contents

1. [Architecture Overview](#1-architecture-overview)
2. [Environment & Credentials](#2-environment--credentials)
3. [User Workflows (End-to-End)](#3-user-workflows-end-to-end)
4. [Page-by-Page Audit](#4-page-by-page-audit)
5. [API Route Audit](#5-api-route-audit)
6. [Known Breakpoints & Bugs](#6-known-breakpoints--bugs)
7. [Missing Features (Advertised but Not Built)](#7-missing-features-advertised-but-not-built)
8. [Database Requirements](#8-database-requirements)
9. [Security Audit](#9-security-audit)
10. [Test Plan & Credentials](#10-test-plan--credentials)
11. [Recommended Fix Priority](#11-recommended-fix-priority)

---

## 1. Architecture Overview

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript + Tailwind CSS |
| Payments | Stripe Checkout (API `2026-04-22.dahlia`) |
| E-Signatures | SignWell API |
| Email | Resend |
| PDF | jsPDF (client-side) |
| Hosting | Vercel |
| DNS | Vercel DNS (ns1/ns2.vercel-dns.com) |
| Database | **NONE** |
| Auth | **NONE** |
| Rate Limiting | **NONE** |
| Middleware | **NONE** |

### Key Files

```
src/
  app/
    page.tsx                          # Homepage
    layout.tsx                        # Root layout (ExitIntentPopup, Analytics, UTM)
    sitemap.ts                        # 199+ URLs
    feed.xml/route.ts                 # RSS feed
    create/page.tsx                   # 5-step NDA form
    success/page.tsx                  # Post-checkout (send to SignWell, PDF download)
    signed/                           # EMPTY DIRECTORY - broken redirect target
    pricing/page.tsx                  # 3 tiers ($29/$59/$99)
    nda/[...slug]/page.tsx            # 171+ programmatic SEO pages
    nda/page.tsx                      # Templates index
    nda/enforceability/page.tsx       # Enforceability guide
    blog/page.tsx                     # Blog index
    blog/[slug]/page.tsx              # Blog posts
    glossary/page.tsx                 # Glossary
    tools/page.tsx                    # Tools index
    tools/enforceability-checker/     # Interactive enforceability tool
    lp/[variant]/page.tsx             # Ad landing pages
    api/
      checkout/route.ts               # Stripe session create/retrieve
      send-nda/route.ts               # SignWell e-signature
      email/route.ts                  # Resend transactional email
      subscribe/route.ts              # Lead capture (exit-intent)
      track/route.ts                  # In-memory analytics counter
  lib/
    nda-template.ts                   # NdaData interface + text generation
    nda-html.ts                       # HTML generation for SignWell
    stripe.ts                         # Stripe client (lazy init)
    resend.ts                         # Resend client (lazy init)
    constants.ts                      # BASE_URL, SITE_NAME, SITE_DESCRIPTION
    seo-data.ts                       # Programmatic page slugs
    blog-data.ts                      # Blog post metadata
    email-templates.ts                # 5 email templates
    tracking.ts                       # Client-side analytics helpers
  components/
    exit-intent.tsx                   # Exit-intent popup
    social-proof.tsx                  # NDA counter + trust badges
    json-ld.tsx                       # Structured data schemas
```

---

## 2. Environment & Credentials

### Production Env Vars (Vercel)

| Variable | Set In | Value/Notes |
|----------|--------|-------------|
| `STRIPE_SECRET_KEY` | Preview + Production | Live Stripe key |
| `SIGNWELL_API_KEY` | Preview + Production | SignWell API key |
| `SIGNWELL_TEST_MODE` | Production only | `"false"` (live signing) |
| `NEXT_PUBLIC_BASE_URL` | Production | `https://www.ndanow.app` |
| `RESEND_API_KEY` | Production only | `re_CYshwxWt_...` |
| `RESEND_FROM_EMAIL` | NOT SET | Defaults to `onboarding@resend.dev` |

### Missing Env Vars (needed for full functionality)

| Variable | Purpose | Impact |
|----------|---------|--------|
| `RESEND_FROM_EMAIL` | Custom sender domain | Emails come from `onboarding@resend.dev` (Resend sandbox) |
| `SIGNWELL_TEST_MODE` (Preview) | Test mode for preview deploys | Preview deploys may use live signing |
| Any database URL | Persistence | All data is ephemeral |

---

## 3. User Workflows (End-to-End)

### Workflow 1: Create & Purchase NDA (Primary Revenue Flow)

```
Homepage (/) --> Click "Create Your NDA" --> /create (Step 1-5)
  --> Step 1: Select NDA type (mutual/unilateral)
  --> Step 2: Disclosing party info (name, email, address)
  --> Step 3: Receiving party info (name, email, address)
  --> Step 4: Terms (purpose, date, duration, state)
  --> Step 5: Review --> Click "Pay $29 & Send for Signing"
  --> POST /api/checkout --> Redirect to Stripe Checkout
  --> Stripe payment --> Redirect to /success?session_id=xxx
  --> GET /api/checkout?session_id=xxx (verify payment)
  --> POST /api/send-nda (send to SignWell)
  --> POST /api/email (purchase confirmation)
  --> POST /api/track (analytics)
  --> User sees "NDA Sent for Signing" or downloads PDF
```

**Breakpoints in this flow:**
- [ ] **BUG**: No email format validation (Step 2/3) -- user can enter "asdf" as email
- [ ] **BUG**: No address validation -- empty-ish strings pass (e.g., a single space)
- [ ] **BUG**: Stripe metadata has 500-char limit per key -- large NdaData JSON may silently truncate
- [ ] **BUG**: Error handling on checkout POST is `alert()` only -- no retry, no state preservation
- [ ] **BUG**: If Stripe redirect fails, user loses all form data (no persistence)
- [ ] **RISK**: No idempotency -- user can back-button and re-submit, creating duplicate Stripe sessions

### Workflow 2: Post-Payment Signing via SignWell

```
/success page --> POST /api/send-nda
  --> SignWell creates document with 2 signers
  --> Both parties receive signing emails from SignWell
  --> Signer clicks link in email --> Signs on SignWell
  --> After signing --> Redirect to /signed
  --> **404 ERROR** -- page does not exist
```

**Breakpoints:**
- [ ] **CRITICAL BUG**: `/signed` page does not exist -- SignWell redirects to a 404
- [ ] **BUG**: No webhook from SignWell -- we never know if signing completed
- [ ] **BUG**: No way for user to re-access their NDA after leaving /success page
- [ ] **MISSING**: No signed document storage or download link

### Workflow 3: PDF Download (Fallback)

```
/success page --> Click "Download PDF"
  --> Client-side jsPDF generates PDF from NDA text
  --> Browser downloads PDF file
```

**Breakpoints:**
- [ ] **BUG**: PDF is unsigned -- it's just the NDA text, not a signed copy
- [ ] **RISK**: PDF formatting may break with very long party names or addresses
- [ ] **MISSING**: No way to re-download PDF after leaving /success page

### Workflow 4: Exit-Intent Lead Capture

```
User moves mouse toward browser chrome (or idles 45s)
  --> Exit-intent popup appears (once per session)
  --> User enters email --> POST /api/subscribe
  --> Server logs email to console (NO database)
  --> Sends WELCOME15 discount email via Resend
  --> User receives email with "15% off" code
  --> User clicks CTA in email --> /create
  --> **NO WAY TO APPLY DISCOUNT** -- checkout is hardcoded $29
```

**Breakpoints:**
- [ ] **CRITICAL BUG**: WELCOME15 discount code is completely non-functional
- [ ] **BUG**: Leads are logged to `console.log` only -- lost on deploy
- [ ] **BUG**: No duplicate email prevention -- same email can subscribe 100x
- [ ] **MISSING**: No Stripe coupon/promotion code integration
- [ ] **MISSING**: No email list storage (no Resend audience, no DB)

### Workflow 5: Pricing Page Tier Selection

```
/pricing --> User clicks "Get Started" on a tier
  --> Basic ($29): /create --> works as expected
  --> Professional ($59): /create?tier=pro --> tier param IGNORED, charges $29
  --> Business ($99/mo): /create?tier=biz --> tier param IGNORED, charges $29
```

**Breakpoints:**
- [ ] **CRITICAL BUG**: Pro and Business tiers are non-functional -- users clicking those CTAs get charged $29 with no upgraded features
- [ ] **BUG**: Business tier should be subscription (`mode: "subscription"`) but checkout uses `mode: "payment"`
- [ ] **MISSING**: No feature gating, no tier-aware form, no subscription management

### Workflow 6: Blog / SEO Content

```
/blog --> Blog index with post cards
/blog/[slug] --> Individual blog posts
/nda --> Templates index
/nda/[...slug] --> 171+ programmatic pages
/glossary --> Glossary terms
```

**Status:** These are read-only content pages. Generally working but:
- [ ] **RISK**: Programmatic pages use template-based content (not unique per page) -- potential thin content penalty from Google
- [ ] **MISSING**: No internal linking strategy between programmatic pages

### Workflow 7: Enforceability Checker Tool

```
/tools --> Tools index
/tools/enforceability-checker --> Interactive form
  --> User selects state, duration, scope, consideration, exclusions
  --> Client-side analysis (no API call)
  --> Shows score (20-95) with factor breakdown
  --> CTA: "Generate an Enforceable NDA -- $29"
```

**Status:** Fully functional as a client-side tool. No bugs identified.

---

## 4. Page-by-Page Audit

### Homepage (`/`)

| Element | Status | Issue |
|---------|--------|-------|
| Header nav | OK | Links to /pricing, /nda, /blog, /create |
| Hero CTA | OK | Links to /create |
| "How it works" | OK | 3-step explanation |
| "What's included" | OK | 8 feature bullets |
| Template cards | OK | Links to /nda/mutual-nda, /nda/startup, /nda/hiring-employees |
| SocialProofCounter | FRAGILE | Fetches /api/track, seeds at 847, resets on deploy |
| TrustBadges | OK | SSL, Money-Back, Legally Sound (static) |
| Footer | OK | Links to /pricing, /nda, /nda/enforceability, /tools, /glossary, /blog |
| JSON-LD | OK | OrganizationSchema, ProductSchema ($29), HowToSchema |

### Create Page (`/create`)

| Element | Status | Issue |
|---------|--------|-------|
| Step 1: NDA type | OK | Mutual/Unilateral toggle |
| Step 2: Disclosing party | BROKEN | No email validation (accepts "abc") |
| Step 3: Receiving party | BROKEN | No email validation |
| Step 4: Terms | OK | Purpose, date, duration, state selectors |
| Step 5: Review | BROKEN | Shows $29 regardless of tier query param |
| Progress bar | OK | 5 segments |
| Back button | OK | Returns to previous step |
| Form persistence | MISSING | Data lost if user navigates away or payment fails |
| Error state | POOR | Uses `alert()` for checkout errors |

### Success Page (`/success`)

| Element | Status | Issue |
|---------|--------|-------|
| Payment verification | OK | Checks Stripe session |
| SignWell sending | OK | Sends NDA for e-signature |
| PDF download | OK | Client-side jsPDF generation |
| Purchase email | BROKEN | References `jurisdiction` instead of `governingState` |
| Loading states | OK | Shows spinner during processing |
| Error fallback | PARTIAL | Graceful degradation if SignWell fails |
| Re-access | MISSING | No way to return to this page later |

### Signed Page (`/signed`)

| Element | Status | Issue |
|---------|--------|-------|
| Page | **DOES NOT EXIST** | Directory exists but contains no files -- 404 |

### Pricing Page (`/pricing`)

| Element | Status | Issue |
|---------|--------|-------|
| Basic tier | OK | $29, links to /create |
| Pro tier | BROKEN | $59, links to /create?tier=pro but tier is ignored |
| Business tier | BROKEN | $99/mo, links to /create?tier=biz but tier is ignored |
| FAQ section | OK | 5 questions |
| JSON-LD | OK | ProductSchema, FAQSchema, BreadcrumbSchema |
| Feature lists | MISLEADING | Advertises features that don't exist |

### Tools Pages

| Page | Status |
|------|--------|
| /tools | OK |
| /tools/enforceability-checker | OK |

---

## 5. API Route Audit

### `POST /api/checkout`

```
Input:  NdaData JSON body (no validation)
Output: { url: stripeCheckoutUrl }
```

| Check | Status | Issue |
|-------|--------|-------|
| Input validation | MISSING | Accepts any JSON, stores raw in Stripe metadata |
| Email validation | MISSING | Invalid emails stored in metadata |
| Metadata size | RISK | Stripe metadata values limited to 500 chars; large NdaData may truncate |
| Rate limiting | MISSING | Unlimited checkout sessions can be created |
| CSRF protection | MISSING | No token validation |
| Tier support | MISSING | Always charges $29 regardless of input |
| Coupon support | MISSING | No promotion code / coupon logic |
| Idempotency | MISSING | Duplicate submissions create duplicate sessions |

### `GET /api/checkout`

```
Input:  ?session_id=cs_xxx
Output: { paid: boolean, ndaData: NdaData }
```

| Check | Status | Issue |
|-------|--------|-------|
| Session validation | OK | Checks `payment_status === "paid"` |
| Error handling | OK | Returns `{ paid: false }` on any error |
| Data exposure | RISK | Returns full NdaData to any caller with session_id |

### `POST /api/send-nda`

```
Input:  { ndaData: NdaData, sessionId: string }
Output: { success: true, documentId } or error
```

| Check | Status | Issue |
|-------|--------|-------|
| Payment verification | MISSING | Does not verify Stripe payment -- anyone can call this |
| Input validation | MISSING | No validation of ndaData |
| Rate limiting | MISSING | Could send unlimited SignWell documents |
| Redirect URL | BROKEN | Points to /signed which is a 404 |
| Test mode | PARTIAL | Production uses live mode, but Preview env may default to test mode inconsistently |

### `POST /api/email`

```
Input:  { type: string, to: string, data: object }
Output: { success: true, id } or error
```

| Check | Status | Issue |
|-------|--------|-------|
| Type validation | OK | Validates against known template types |
| Email validation | MISSING | No format validation on `to` field |
| Rate limiting | MISSING | Could be used to spam arbitrary emails |
| Auth | MISSING | Public endpoint -- anyone can send emails through our Resend account |
| Sender domain | PARTIAL | Uses sandbox domain `onboarding@resend.dev` |

### `POST /api/subscribe`

```
Input:  { email: string }
Output: { success: true }
```

| Check | Status | Issue |
|-------|--------|-------|
| Email validation | MISSING | No format validation |
| Storage | BROKEN | Logs to console only -- data lost on deploy |
| Deduplication | MISSING | Same email can subscribe unlimited times |
| Rate limiting | MISSING | Can be spammed |
| Discount code | BROKEN | Sends WELCOME15 but code has no Stripe integration |

### `GET/POST /api/track`

```
POST Input:  { event: string, data: object }
GET Output:  { count: formattedNumber }
```

| Check | Status | Issue |
|-------|--------|-------|
| Counter persistence | BROKEN | In-memory, resets to 847 on every deploy |
| Event validation | OK | Validates against known event types |
| Rate limiting | MISSING | Counter can be inflated by repeated POST calls |
| Data storage | MISSING | Events logged to console only |

---

## 6. Known Breakpoints & Bugs

### Critical (Breaks User Experience)

| # | Bug | Location | Impact |
|---|-----|----------|--------|
| 1 | `/signed` page is a 404 | `src/app/signed/` (empty dir) | After signing on SignWell, users hit a dead end |
| 2 | WELCOME15 discount code is fake | checkout route / exit-intent | Users receive a discount code that cannot be applied anywhere |
| 3 | Pro ($59) and Business ($99) tiers don't work | `/create` ignores `?tier=` param | Users paying for higher tiers get the $29 product |
| 4 | Email payload references wrong field | `success/page.tsx` line ~`data.ndaData.jurisdiction` | Purchase confirmation email may fail or send wrong data |

### High (Data Loss / Security)

| # | Bug | Location | Impact |
|---|-----|----------|--------|
| 5 | No database -- all data is ephemeral | Entire app | Leads, analytics, purchase history all lost on deploy |
| 6 | `/api/send-nda` has no payment verification | `send-nda/route.ts` | Anyone can generate free SignWell documents |
| 7 | `/api/email` is a public email relay | `email/route.ts` | Our Resend account can be used to send arbitrary emails |
| 8 | No input validation on checkout | `checkout/route.ts` | Malformed/malicious data stored in Stripe metadata |
| 9 | No form data persistence | `create/page.tsx` | Users lose all data if they navigate away or payment fails |

### Medium (UX / Quality)

| # | Bug | Location | Impact |
|---|-----|----------|--------|
| 10 | No email format validation | `create/page.tsx` | Invalid emails pass form validation |
| 11 | Social proof counter resets on deploy | `track/route.ts` | Counter drops back to 847 after each deployment |
| 12 | Error handling uses `alert()` | `create/page.tsx` | Poor UX for checkout errors |
| 13 | No way to re-access NDA after leaving /success | `success/page.tsx` | Users who close the tab lose access to their NDA |
| 14 | No SignWell webhook | `send-nda/route.ts` | We never know if/when signing is completed |
| 15 | PDF is unsigned text only | `success/page.tsx` | Downloaded PDF has no signatures |

---

## 7. Missing Features (Advertised but Not Built)

### From Pricing Page

| Feature | Tier | Status |
|---------|------|--------|
| Customizable clauses | Pro | Not implemented |
| DOCX + PDF export | Pro | Not implemented (only PDF via jsPDF) |
| Up to 3 parties | Pro | Not implemented (always 2 parties) |
| Priority support | Pro | Not implemented |
| Revision included | Pro | Not implemented |
| Unlimited NDAs | Business | Not implemented (no subscription) |
| Team access (5 seats) | Business | Not implemented (no auth) |
| Template library | Business | Not implemented |
| Bulk generation | Business | Not implemented |
| NDA tracking dashboard | Business | Not implemented (no auth, no DB) |

### From Growth Plan

| Feature | Status |
|---------|--------|
| Email follow-up sequences (signing guide +3d, upsell +14d, subscription +30d) | Templates exist, no scheduling |
| Stripe subscription billing | Not implemented |
| Customer portal | Not implemented |
| Document bundles (Contractor Agreement, Operating Agreement, ToS, etc.) | Not implemented |
| Unique AI content per programmatic page | Not implemented (template-based) |
| Google Ads campaigns | Not configured |
| Database for leads/analytics/NDA tracking | Not implemented |

---

## 8. Database Requirements

The app currently has **zero persistence**. Here's what needs a database:

### Schema Design (Recommended: PostgreSQL via Neon or Supabase)

```sql
-- Leads captured from exit-intent popup
CREATE TABLE leads (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email         TEXT NOT NULL,
  source        TEXT DEFAULT 'exit-intent',
  discount_code TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(email)
);

-- NDA purchases
CREATE TABLE orders (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_session_id   TEXT UNIQUE NOT NULL,
  stripe_payment_id   TEXT,
  tier                TEXT DEFAULT 'basic',       -- basic/pro/business
  amount_cents        INTEGER NOT NULL,
  status              TEXT DEFAULT 'pending',     -- pending/paid/refunded
  nda_data            JSONB NOT NULL,             -- full NdaData object
  signwell_doc_id     TEXT,
  signing_status      TEXT DEFAULT 'pending',     -- pending/sent/partial/completed/declined
  created_at          TIMESTAMPTZ DEFAULT now(),
  updated_at          TIMESTAMPTZ DEFAULT now()
);

-- Analytics events (replaces in-memory counter)
CREATE TABLE events (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type  TEXT NOT NULL,
  data        JSONB,
  session_id  TEXT,
  ip_hash     TEXT,                               -- hashed IP for dedup
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- Email sends for tracking/dedup
CREATE TABLE email_sends (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  to_email    TEXT NOT NULL,
  template    TEXT NOT NULL,
  order_id    UUID REFERENCES orders(id),
  sent_at     TIMESTAMPTZ DEFAULT now(),
  status      TEXT DEFAULT 'sent'
);

-- Subscriptions (for Business tier)
CREATE TABLE subscriptions (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stripe_subscription_id TEXT UNIQUE NOT NULL,
  stripe_customer_id    TEXT NOT NULL,
  email                 TEXT NOT NULL,
  tier                  TEXT NOT NULL,
  status                TEXT DEFAULT 'active',    -- active/cancelled/past_due
  current_period_end    TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now()
);

-- Indexes
CREATE INDEX idx_orders_stripe_session ON orders(stripe_session_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_created ON events(created_at);
CREATE INDEX idx_leads_email ON leads(email);
CREATE INDEX idx_subscriptions_customer ON subscriptions(stripe_customer_id);
```

### What Each Table Solves

| Table | Fixes |
|-------|-------|
| `leads` | Exit-intent emails persisted, deduplication, future email sequences |
| `orders` | NDA purchase history, re-access to documents, signing status tracking |
| `events` | Persistent analytics, accurate NDA counter, no reset on deploy |
| `email_sends` | Track what emails were sent, prevent duplicates, enable sequences |
| `subscriptions` | Business tier management, recurring billing state |

### Recommended Provider

**Neon Postgres** (already available as MCP tool in this workspace):
- Free tier: 0.5 GB storage, 1 compute
- Serverless-friendly (scales to zero)
- Branching for preview deploys
- Connection string via `DATABASE_URL` env var

---

## 9. Security Audit

### Critical Vulnerabilities

| # | Vulnerability | Severity | Location |
|---|--------------|----------|----------|
| 1 | Public email relay | HIGH | `/api/email` -- no auth, anyone can send emails via our Resend account |
| 2 | Free document generation | HIGH | `/api/send-nda` -- no payment verification, costs us per SignWell API call |
| 3 | No input sanitization | MEDIUM | `/api/checkout` -- raw JSON stored in Stripe metadata, potential XSS in email templates |
| 4 | No rate limiting on any endpoint | MEDIUM | All 5 API routes are unlimited |
| 5 | No CSRF protection | MEDIUM | All POST endpoints accept unauthenticated requests |
| 6 | Session ID exposure | LOW | Stripe session_id in URL can be bookmarked/shared, leaking NDA data |
| 7 | No Content Security Policy | LOW | No CSP headers configured |

### Recommended Mitigations

1. **API route auth**: Add a signed token (from Stripe checkout) that `/api/send-nda` and `/api/email` verify before processing
2. **Rate limiting**: Add `next-rate-limit` or Vercel's rate limiting (via middleware)
3. **Input validation**: Use Zod schemas on all API inputs
4. **CSRF tokens**: Add to form submissions
5. **Payment verification in send-nda**: Verify Stripe session payment_status before calling SignWell

---

## 10. Test Plan & Credentials

### Stripe Test Mode

To test the full purchase flow without real charges:

1. **Create a Stripe test mode key** in the Stripe Dashboard:
   - Go to https://dashboard.stripe.com/test/apikeys
   - Copy the test secret key (`sk_test_...`)
   - Set `STRIPE_SECRET_KEY=sk_test_...` in `.env.local`

2. **Test card numbers**:
   | Card | Number | Behavior |
   |------|--------|----------|
   | Success | `4242 4242 4242 4242` | Payment succeeds |
   | Decline | `4000 0000 0000 0002` | Payment declined |
   | 3D Secure | `4000 0025 0000 3155` | Requires authentication |
   | Insufficient funds | `4000 0000 0000 9995` | Fails with insufficient funds |

   Use any future expiry date, any 3-digit CVC, any billing ZIP.

3. **Test the full flow**:
   ```
   /create --> fill form --> checkout --> use test card --> /success
   ```

### SignWell Test Mode

1. Set `SIGNWELL_TEST_MODE=true` in `.env.local`
2. SignWell test mode sends signing requests to a sandbox -- no real emails sent
3. Note: In production, `SIGNWELL_TEST_MODE=false` -- signing is LIVE

### Resend Test Mode

1. Resend has no explicit test mode
2. With `onboarding@resend.dev` as sender, emails can only be sent to the account owner's email
3. For testing: use your own email as the disclosing party email in the form

### Local Development Setup

```bash
# Clone and install
git clone https://github.com/talktoconor/nda-generator.git
cd nda-generator
npm install

# Create .env.local
cat > .env.local << 'EOF'
STRIPE_SECRET_KEY=sk_test_YOUR_TEST_KEY_HERE
SIGNWELL_API_KEY=YOUR_SIGNWELL_KEY
SIGNWELL_TEST_MODE=true
RESEND_API_KEY=re_YOUR_RESEND_KEY
NEXT_PUBLIC_BASE_URL=http://localhost:3000
EOF

# Run dev server
npm run dev
```

### QA Test Matrix

| Test Case | Steps | Expected | Status |
|-----------|-------|----------|--------|
| Happy path: Mutual NDA | Fill all 5 steps, pay, verify signing email | NDA sent to both parties | |
| Happy path: Unilateral NDA | Fill all steps as unilateral | Labels change to "Disclosing/Receiving" | |
| Invalid email in form | Enter "notanemail" in email field | Should show validation error | WILL FAIL |
| Empty fields | Try to advance with empty required fields | Should block advancement | |
| Stripe decline | Use decline test card | Should show error, preserve form data | WILL FAIL (form data lost) |
| Stripe cancel | Click back on Stripe checkout | Should return to /create with data | WILL FAIL (form data lost) |
| Re-access NDA | Close /success tab, try to return | Should have way to re-access | WILL FAIL (no persistence) |
| SignWell redirect | Complete signing on SignWell | Should land on /signed page | WILL FAIL (404) |
| Exit-intent popup | Move mouse to top of page | Should show popup once | |
| Apply WELCOME15 | Enter code during checkout | Should apply 15% discount | WILL FAIL (not implemented) |
| Pro tier purchase | Click Pro on /pricing, complete checkout | Should charge $59 | WILL FAIL (charges $29) |
| Business tier purchase | Click Business on /pricing | Should create subscription | WILL FAIL (one-time $29) |
| PDF download | Click download on /success page | Should download valid PDF | |
| Social proof counter | Deploy, check counter | Should persist across deploys | WILL FAIL (resets to 847) |
| Mobile responsive | Test all pages on 375px width | Should be usable | |
| API abuse: email | POST to /api/email with arbitrary recipient | Should require auth | WILL FAIL (open relay) |
| API abuse: send-nda | POST to /api/send-nda without payment | Should require payment proof | WILL FAIL (no verification) |

---

## 11. Recommended Fix Priority

### P0 -- Fix Before Accepting Real Money

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 1 | Create `/signed` page with confirmation message | 30 min | Fixes broken post-signing experience |
| 2 | Add payment verification to `/api/send-nda` | 1 hr | Prevents free document abuse |
| 3 | Add auth/rate-limiting to `/api/email` | 1 hr | Prevents email relay abuse |
| 4 | Fix `jurisdiction` -> `governingState` in success page email | 5 min | Fixes purchase confirmation email |
| 5 | Add email format validation to create form | 30 min | Prevents invalid emails from reaching Stripe/SignWell |
| 6 | Remove or fix WELCOME15 discount code flow | 1 hr | Either implement Stripe coupon or remove popup |

### P1 -- Fix Before Marketing Push

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 7 | Set up database (Neon Postgres) | 2-3 hrs | Enables persistence for leads, orders, analytics |
| 8 | Implement Pro tier ($59) in checkout | 2-3 hrs | Unlocks revenue from higher tier |
| 9 | Add form data persistence (localStorage) | 1 hr | Prevents data loss on Stripe cancel/back |
| 10 | Input validation with Zod on all API routes | 2 hrs | Security + data quality |
| 11 | Add rate limiting middleware | 1-2 hrs | Prevents API abuse |
| 12 | Add SignWell webhook handler | 2-3 hrs | Track signing completion |

### P2 -- Growth Features

| # | Fix | Effort | Impact |
|---|-----|--------|--------|
| 13 | Implement Business subscription tier ($99/mo) | 4-6 hrs | New revenue stream |
| 14 | Build email follow-up sequences (cron jobs) | 3-4 hrs | Automated upselling |
| 15 | Add order re-access (email link or simple lookup) | 2-3 hrs | Better user experience |
| 16 | Persistent analytics with dashboard | 3-4 hrs | Real conversion data |
| 17 | DOCX export for Pro tier | 2-3 hrs | Feature differentiation |
| 18 | Customer portal via Stripe | 2-3 hrs | Subscription management |

---

## Appendix: NdaData Interface

```typescript
export type NdaType = "mutual" | "unilateral";

export interface NdaData {
  ndaType: NdaType;
  disclosingPartyName: string;
  disclosingPartyEmail: string;
  disclosingPartyAddress: string;
  receivingPartyName: string;
  receivingPartyEmail: string;
  receivingPartyAddress: string;
  purpose: string;
  durationYears: number;
  governingState: string;  // NOTE: NOT "jurisdiction"
  effectiveDate: string;
}
```

## Appendix: Stripe Metadata Structure

The full `NdaData` object is JSON-stringified and stored as `session.metadata.ndaData`. Stripe metadata values are limited to **500 characters per value**. A typical NdaData JSON is ~300-400 characters, but with long addresses/purposes it could exceed this limit, causing **silent truncation**.

**Mitigation**: Either validate total JSON length before checkout, or store NdaData in a database and only put the order ID in Stripe metadata.

## Appendix: File Quick Reference for Fixes

| Fix | File(s) to Edit |
|-----|-----------------|
| Create /signed page | `src/app/signed/page.tsx` (new file) |
| Fix jurisdiction bug | `src/app/success/page.tsx` (~line with `data.ndaData.jurisdiction`) |
| Add email validation | `src/app/create/page.tsx` (canAdvance function) |
| Add payment verification | `src/app/api/send-nda/route.ts` (add Stripe session check) |
| Secure email endpoint | `src/app/api/email/route.ts` (add auth token check) |
| Fix/remove discount code | `src/app/api/checkout/route.ts` + `src/components/exit-intent.tsx` |
| Add database | New: `src/lib/db.ts`, update all API routes |
| Add rate limiting | New: `src/middleware.ts` |
| Form persistence | `src/app/create/page.tsx` (add localStorage read/write) |
| Tier-aware checkout | `src/app/api/checkout/route.ts` + `src/app/create/page.tsx` |
