# Starter Kit

## Introduction

This is a ready-to-use SaaS starter kit with prebuilt pages and core product features:

- Marketing pages
- Auth pages (sign up, sign in, reset password)
- Dashboard pages
- AI chat experience
- Billing flow
- Advanced settings modal (account, notifications, appearance, legal)
- Legal pages
- SEO basics (`sitemap.xml`, `robots.txt`, metadata setup)

See `features.md` for the full list.

## Simple Setup

### Step 1: Requirements

You need:

- Bun
- Node.js
- Neon Postgres database
- Google OAuth credentials
- Resend API key
- Vercel AI Gateway API key

### Step 2: Install dependencies

```bash
bun install
```

### Step 3: Create `.env.local`

Copy `.env.example` to `.env.local`.

### Step 4: Fill `.env.local`

You must provide **all** values from `.env.example`.

Required env values:

- `NEXT_PUBLIC_DOMAIN` (usually `http://localhost:3000`)
- `NEXT_PUBLIC_ENVIRONMENT` (`development`)
- `NEXT_PUBLIC_ANALYTICS_TRACKING` (`on` or `off`)
- `NEXT_PUBLIC_POSTHOG_KEY` (PostHog project API key)
- `NEXT_PUBLIC_POSTHOG_HOST` (usually `https://us.i.posthog.com`)
- `AI_GATEWAY_API_KEY`
- `DATABASE_URL` (Neon pooled connection string)
- `DIRECT_URL` (Neon direct connection string)
- `BETTER_AUTH_URL` (usually `http://localhost:3000`)
- `BETTER_AUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SUPPORT_EMAIL`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `STRIPE_PRICE_ID_PRO_MONTHLY`
- `STRIPE_PRICE_ID_PRO_YEARLY`

Quick meaning:

- `NEXT_PUBLIC_DOMAIN`: app URL (`http://localhost:3000` locally).
- `NEXT_PUBLIC_ENVIRONMENT`: `development`, `preview`, or `production`.
- `NEXT_PUBLIC_ANALYTICS_TRACKING`: enables/disables analytics capture.
- `NEXT_PUBLIC_POSTHOG_KEY`: PostHog browser key.
- `NEXT_PUBLIC_POSTHOG_HOST`: PostHog host URL.
- `AI_GATEWAY_API_KEY`: VERCEL AI GATEWAY provider key.
- `DATABASE_URL`: Neon pooled DB URL.
- `DIRECT_URL`: Neon direct DB URL (Prisma migrations).
- `BETTER_AUTH_URL`: auth base URL.
- `BETTER_AUTH_SECRET`: auth signing secret.
- `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`: Google OAuth credentials.
- `RESEND_API_KEY`: Resend API key.
- `RESEND_FROM_EMAIL`: verified sender email (example: `noreply@yourdomain.com`).
- `SUPPORT_EMAIL`: support contact email (example: `support@yourdomain.com`).
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe public key.
- `STRIPE_SECRET_KEY`: Stripe secret key.
- `STRIPE_WEBHOOK_SECRET`: Stripe webhook signing secret.
- `STRIPE_PRICE_ID_PRO_MONTHLY`: monthly plan price id.
- `STRIPE_PRICE_ID_PRO_YEARLY`: yearly plan price id.

### Step 5: Prepare database

```bash
bun run prisma:migrate
bun run prisma:generate
```

### Step 6: Start app

```bash
bun run dev
```

Open: [http://localhost:3000](http://localhost:3000)

## Get Your Keys

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create/select a project.
3. Configure OAuth consent screen.
4. Create OAuth 2.0 Client ID (Web application).
5. For local development, add:
   - authorized origin: `http://localhost:3000`
   - redirect URI: `http://localhost:3000/api/auth/callback/google`
6. For production, replace both URLs with your real domain.
7. Copy values to `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`.

### Neon

1. Go to [Neon Console](https://console.neon.tech/).
2. Create project/database.
3. Copy:
   - pooled URL -> `DATABASE_URL`
   - direct URL -> `DIRECT_URL`

### Resend

1. Create API key at [Resend](https://resend.com/).
2. Verify your sending domain (or sender) in Resend.
3. Add:
   - API key -> `RESEND_API_KEY`
   - verified sender email -> `RESEND_FROM_EMAIL` (example: `noreply@yourdomain.com`)
   - support inbox -> `SUPPORT_EMAIL` (this is the email that receives contact form messages, for example `support@yourdomain.com`)

### Stripe

1. Create a Stripe account at [Stripe](https://dashboard.stripe.com/).
2. Get API keys from Developers -> API keys:
   - publishable key -> `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - secret key -> `STRIPE_SECRET_KEY`
3. Create your billing product and recurring prices (monthly/yearly) in Stripe Products.
4. Copy the created Price IDs:
   - monthly price id -> `STRIPE_PRICE_ID_PRO_MONTHLY`
   - yearly price id -> `STRIPE_PRICE_ID_PRO_YEARLY`
5. Set up a webhook endpoint for your app and copy the webhook signing secret to `STRIPE_WEBHOOK_SECRET`.

### Vercel AI Gateway

1. Create/get API key from your Vercel AI setup.
2. Add it to `AI_GATEWAY_API_KEY`.

## Notes

- This repo uses Bun for install and scripts.
- If Google auth redirect fails, make sure `BETTER_AUTH_URL`, origin, and redirect URI match your current environment (local or production).

stripe listen --forward-to localhost:3000/api/billing/webhook

Shipfast — ~$199
Makerkit — $149–$299
Supastarter — $299+
