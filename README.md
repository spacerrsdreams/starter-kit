# Starter Kit

Simple setup guide to run this app locally.

Requirements:

- Bun installed
- Node.js installed
- A Neon Postgres database
- Google OAuth credentials
- Resend API key (for verification/reset emails)
- Vercel AI Gateway API key

Setup:

1. Install dependencies:
   - `bun install`
2. Create local env file:
   - Copy `.env.example` to `.env.local`
3. Fill all required environment variables in `.env.local`:
   - `NEXT_PUBLIC_DOMAIN` (usually `http://localhost:3000`)
   - `NEXT_PUBLIC_ENVIRONMENT` (`development`)
   - `AI_GATEWAY_API_KEY`
   - `DATABASE_URL` (Neon pooled connection string)
   - `DIRECT_URL` (Neon direct connection string for Prisma migrations)
   - `BETTER_AUTH_URL` (usually `http://localhost:3000`)
   - `BETTER_AUTH_SECRET` (keep existing value or generate your own strong random secret)
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`
   - `RESEND_API_KEY`
4. Prepare the database:
   - `bun run prisma:migrate`
   - `bun run prisma:generate`
5. Start the app:
   - `bun run dev`
6. Open:
   - `http://localhost:3000`

How to get the keys:

Google OAuth:

1. Go to [Google Cloud Console](https://console.cloud.google.com/).
2. Create/select project and configure OAuth consent screen.
3. Create OAuth 2.0 Client ID (Web application).
4. Add authorized JavaScript origin:
   - `http://localhost:3000`
5. Add redirect URI:
   - `http://localhost:3000/api/auth/callback/google`
6. Copy values to:
   - `GOOGLE_CLIENT_ID`
   - `GOOGLE_CLIENT_SECRET`

Neon database:

1. Go to [Neon Console](https://console.neon.tech/) and create a project/database.
2. Copy connection strings:
   - Pooled URL -> `DATABASE_URL`
   - Direct URL -> `DIRECT_URL`

Resend:

1. Create an API key at [Resend](https://resend.com/).
2. Put it into `RESEND_API_KEY`.

Vercel AI Gateway:

1. Create/get API key from your Vercel AI setup.
2. Put it into `AI_GATEWAY_API_KEY`.

Notes:

- This repo uses Bun as package manager and script runner.
- If Google auth redirect fails, check that `BETTER_AUTH_URL` and Google redirect URI match exactly.
