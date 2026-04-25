# Everything Implemented

This file lists the pages and product capabilities currently implemented in the app.

## Page Map

### Public marketing/legal pages

1. `/` - Marketing homepage
2. `/pricing` - Pricing page
3. `/contact` - Contact page
4. `/privacy-policy` - Privacy Policy
5. `/terms-of-service` - Terms of Service

### Authentication pages

1. `/sign-in` - Sign in page
2. `/sign-up` - Sign up page
3. `/reset-password` - Password reset flow (request + token-based reset)

### Product/app pages

1. `/dashboard` - Main AI workspace page
2. `/dashboard/ai/[chatId]` - Open a specific saved chat
3. `/admin` - Admin user management page
4. `/feedback` - Deactivation feedback page

### SEO route files

1. `/sitemap.xml` (via `src/app/sitemap.ts`)
2. `/robots.txt` (via `src/app/robots.ts`)

## Core Features

### Authentication and account

1. Email/password sign up and sign in.
2. Google OAuth sign in.
3. Session-based auth with protected app APIs/routes.
4. Sign out and authenticated user menu flows.

### Admin and impersonation

1. Admin and moderator role support is implemented (admin/moderator/user roles).
2. Admin users can list, edit, and delete users from the admin page.
3. Admin users can impersonate users from admin tooling.
4. Admin users can stop impersonation and return to their own session.

### Blog platform (backend)

1. Blog post Prisma model and migration are implemented.
2. Blog post repository layer is implemented.
3. Blog post create/update payload validation schemas are implemented.
4. Blog write operations are protected to admin/moderator sessions.

### Auth-related email flows (working)

1. Email verification flow with server-side token creation.
2. Verification email sending endpoint with rate limiting.
3. Password reset request and reset confirmation flow.
4. Resend integration for auth/system email delivery.

### AI assistant workspace (chat)

1. Create, open, update, and delete chat sessions.
2. Persistent chat history with saved conversations.
3. Streaming AI responses via Vercel AI SDK.
4. Message reactions (like/unlike) with optional dislike feedback.
5. Auto chat title generation and chat context summarization.
6. Global floating AI widget with quick chat access/history.
7. AI widget is mounted globally and shown on most pages; it is intentionally hidden on the homepage, auth pages, and dashboard routes.
8. Shared AI build-context utility is implemented and configurable through include/exclude flags (system instructions, company context, policy context, available pages), plus optional user/request context, feature flags, and extra instructions.

### Dashboard UX and navigation

1. Responsive dashboard shell with desktop sidebar + mobile bottom nav.
2. Command menu (Cmd/Ctrl + K) for quick navigation/actions.
3. Global dialogs/providers wired in the dashboard layout.
4. Global quick access menu is mounted at the app layout level and available across pages (rendered without inline trigger by default, with command menu support behind it).

### Settings and user preferences

1. Advanced settings modal with account, notifications, appearance, and legal sections.
2. Notification preferences management.
3. Theme switching (light mode and dark mode).

### Billing and subscriptions

1. Stripe checkout session creation.
2. Stripe customer portal session support.
3. Subscription status endpoint and repository-backed billing state.
4. Stripe webhook handling for subscription lifecycle sync.

### Contact and account lifecycle

1. Contact page + contact form submission flow.
2. Account deactivation flow with feedback capture.

## SEO Foundations (implemented)

1. Centralized metadata builder (`src/features/seo/metadata.ts`).
2. Global metadata configured in root `layout.tsx` (title template, OG, Twitter, robots, canonical baseline).
3. Next.js native `sitemap.ts` and `robots.ts` routes are present.
4. JSON-LD components are implemented and integrated (`seo-page-json-ld`, `structured-data`).

## API Surface (high-level)

1. Auth handlers (`/api/auth/[...all]`) via Better Auth.
2. Auth signed-in helper API (`/api/auth/signed-in`).
3. AI chat APIs (`/api/chat`, `/api/chats`, `/api/chats/[chatId]`, message reaction endpoint).
4. Billing APIs (`/api/billing/checkout-session`, `/api/billing/portal-session`, `/api/billing/subscription`, `/api/billing/webhook`).
5. Account verification email API (`/api/account/send-verification-email`).
6. Admin APIs (`/api/admin/users`, `/api/admin/users/[userId]`).
7. Blog APIs (`/api/blog`, `/api/blog/[postId]`).

## Major Technologies

1. Next.js (App Router)
2. React
3. TypeScript
4. Prisma
5. PostgreSQL (Neon)
6. Better Auth
7. Vercel AI SDK
8. TanStack Query
9. Zustand
10. Tailwind CSS
11. shadcn/ui
12. Motion (`motion/react`)
13. Bun
14. Stripe
15. Resend
16. Vercel
17. Posthog
