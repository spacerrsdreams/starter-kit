<!-- BEGIN:Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed. -->

# Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed

Tradeoff: These guidelines bias toward caution over speed. For trivial tasks, use judgment.

1. Think Before Coding
   Don't assume. Don't hide confusion. Surface tradeoffs.

Before implementing:

State your assumptions explicitly. If uncertain, ask.
If multiple interpretations exist, present them - don't pick silently.
If a simpler approach exists, say so. Push back when warranted.
If something is unclear, stop. Name what's confusing. Ask.

2. Simplicity First
   Minimum code that solves the problem. Nothing speculative.

No features beyond what was asked.
No abstractions for single-use code.
No "flexibility" or "configurability" that wasn't requested.
No error handling for impossible scenarios.
No error handling for TypeScript-guaranteed unreachable paths (exhaustive switch cases, narrowed unions). Do handle untrusted boundaries like external API responses, user input, and storage reads — even if the shape seems "obviously correct." When in doubt, treat a boundary as untrusted.
If you write 200 lines and it could be 50, rewrite it.
Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

3. Surgical Changes
   Touch only what you must. Clean up only your own mess.

When editing existing code:

Don't "improve" adjacent code, comments, or formatting.
Don't refactor things that aren't broken.
Match existing style, even if you'd do it differently.
If you notice unrelated dead code, mention it - don't delete it.
When your changes create orphans:

Remove imports/variables/functions that YOUR changes made unused.
Don't remove pre-existing dead code unless asked.
The test: Every changed line should trace directly to the user's request.

4. Goal-Driven Execution
   Define success criteria. Loop until verified.

Transform tasks into verifiable goals:

"Add validation" → "Write tests for invalid inputs, then make them pass"
"Fix the bug" → "Write a test that reproduces it, then make it pass"
"Refactor X" → "Ensure tests pass before and after"
For multi-step tasks, state a brief plan:

1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

5. Self-Verification Before Declaring Done
   Never consider a task complete without running the verification loop.

After implementing any non-trivial change:

- Run `bun run lint` — zero new warnings or errors introduced.
- Run `bun run typecheck` — no new TypeScript errors.
- Run relevant tests (`bun test` or scoped subset) — all pass.
- If you added new behavior, confirm a test covers it. If none exists, write one.
- Compare your output against the original request: list any stated requirements not yet addressed.
- If CI commands are specified in the project, run them. Don't declare done if they fail.

Shortcut exception: for trivial single-line fixes (typo, rename, constant change) skip the full loop but still run typecheck.

6. Comments — Complex Code Only
   Write comments to explain _why_, never _what_. Only add them where the code itself cannot communicate intent.

**Add comments when:**

- The logic is non-obvious and a reasonable engineer would pause to figure it out.
- A decision was made that looks wrong but isn't (e.g. intentional empty catch, deliberate denormalization).
- A workaround exists due to an external constraint (browser bug, third-party quirk, Prisma limitation).
- A complex algorithm or multi-step state transition is implemented.

**Never add comments for:**

- Self-explanatory code (`// increment counter` above `count++`).
- Type-obvious assignments, straightforward CRUD, standard React patterns.
- Code that was just refactored to be readable — if you need a comment to explain it, simplify it first.

**Keep comments maintained:**

- If you change logic covered by a comment, update or remove the comment.
- Stale comments that contradict the code are worse than no comments.

<!-- END:Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed. -->

<!-- BEGIN:Project Rules -->

# Project Rules

### Architecture (Strict)

- Keep product/feature logic under `src/features/<feature-name>/`.
- Keep `src/app/` thin: routing, layouts, and wiring only.
- Shared cross-feature code belongs in `src/lib/` or truly shared modules.
- Keep code colocated by slice: `components/`, `hooks/`, `utils/`, `types/`, `constants/`, `repositories/`, `actions/`, `schemas/`, `store/`.
- No heavy business logic in route files.

### API Route Strings (Strict)

- Do not hardcode API strings in feature API clients.
- Centralize endpoint paths in `src/lib/api.routes.ts` (`ApiRoutes`).
- Extend `ApiRoutes` first, then consume constants/functions in feature API modules.

### Types (Strict)

- Do not define shared domain/feature types inline in `.tsx` or implementation files.
- Keep types feature-local under `src/features/<feature>/types/`.
- Any dedicated type file (`*.types.ts`) must live inside a `types/` folder.
- Prefer consolidated domain files over many tiny files:
  - As an example, use `<domain>.types.ts` as the default shared type file (client-safe by default, and server can also import from it).
  - As an example, use `<domain>.server.types.ts` only for server-only contracts used by repositories/actions/routes.
- Split into additional `*.types.ts` files only when a type group is large, reused across multiple domains, or has a clear boundary (for example external API contracts).
- Cross-feature shared types live in `src/global.types.ts` and import via `@/global.types`.
- Prefer direct `import type` from concrete modules for inferred types.
- Avoid inline `typeof import("...").symbol` style type hacks.
- Prefer Prisma-generated types for DB-backed entities/fields instead of duplicating manual model-like interfaces/unions.
- Choose typing source by intent: use Prisma-generated types for DB-backed contracts, and app-local types for UI/view-state/domain-only shapes when Prisma would be misleading.
- For client-side type imports from Prisma, use `@/generated/prisma/browser` with `import type`.
- For server/runtime type imports from Prisma, use `@/generated/prisma/client`.
- Any type that imports Prisma from non-browser paths (anything other than `@/generated/prisma/browser`) must stay in server-only type files (for example `*.server.types.ts`) to avoid leaking server runtime contracts into client bundles.
- Component-local strict prop types (`*Props`, `*ComponentType`, `Component`) must stay in the same component file and should not directly import Prisma model types.
- React component prop types must be declared in the same component file (do not place component `*Props` in dedicated `types/` files).

### TypeScript + Lint Discipline (Strict)

- Minimize casts/assertions (`as`, `as unknown as`, non-null `!`).
- Prefer narrowing, guards, and validated boundaries.
- No source suppressions: avoid `eslint-disable`, `@ts-ignore`, `@ts-expect-error`, `@ts-nocheck`.

### Single Responsibility

- One main concern per file.
- Split large UI into smaller components.
- Extract pure helpers into `utils/` or `*.utils.ts`.
- Reuse `src/components/ui` and `src/components/ai-elements`; do not copy internals.

### SOLID (Practical)

- **S**: Separate UI/data/formatting responsibilities.
- **O**: Extend by composition/hooks/props.
- **L**: Keep contracts substitutable.
- **I**: Use focused props and return shapes.
- **D**: Depend on explicit modules and concrete files.

### @tanstack/react-query Rules (Strict)

- Do not inline reusable query/mutation definitions in UI components.
- Place each query/mutation custom hook in its own file under `hooks/`.
- One primary query/mutation per hook file.
- Use `useFetch...` naming for reads and `useMutate...` naming for writes.
- Query keys for reads must be exported from the same hook file that defines the query (for example `export const usersQueryKey = "users"` and `export const getUsersQueryKey = () => [usersQueryKey] as const`).
- Use those same exported query key helpers everywhere (query definitions, invalidation, cache reads/writes) to keep navigation and refactors simple.
- Any query/mutation HTTP call must go through `apiRequest` from `src/lib/http-client.ts` (do not use raw `fetch` in feature API clients), so non-OK responses are handled consistently.
- Example:
  - `src/features/example/api/example.api.ts` exports `getExampleApi()` that calls `apiRequest`.
  - `src/features/example/hooks/use-fetch-example.ts` exports `exampleQueryKey` + `getExampleQueryKey()` and wraps it with `useQuery({ queryKey: getExampleQueryKey(), ... })`.
  - `src/features/example/hooks/use-mutate-example.ts` wraps writes with `useMutation`.

### No Barrel Index Files

Exactly one exported React component per .tsx file. Non-exported helper components used only by the parent may be colocated in the same file. Files with hooks only should be .ts. Move pure helpers out of component files into utils/helpers.

### One React Component per `.tsx` File

- Prefer one primary React component per `*.tsx` file.
- Small, non-complex helper components that are tightly coupled to the primary component (for example simple list item renderers like `ul/li` wrappers) may be colocated in the same file.
- If a helper component grows in complexity, is reused, or has its own logic/state concerns, split it into a sibling file.
- Files with hooks only should be `*.ts`.
- Move pure helpers out of component files into `utils`/`helpers`.

### Server-First UI + Client Islands

- Default to Server Components.
- Add `"use client"` only when browser-only APIs/interactivity are required.
- Do not mark large route shells as client for one hook; split into islands.
- Use normal `*.ts` / `*.tsx` filenames for client modules (no `.client` suffix).
- Reserve `*.server.ts` for explicit server-only modules.
- Server parent owns data/copy/layout and passes serializable props to client islands.

### Server-Only Guard

- For server-only modules, include `import "server-only"` as the first import (after comments).
- Apply to server actions, repositories/DB modules, and server-only libraries.
- If an action re-exports a server-only repository, the action file should still include `import "server-only"`.
- Keep `server-only` in dependencies.
- Note: `src/app/api/**` route handlers are server runtime by default.

### Providers + HTTP Client

- Root providers live under `src/providers/`.
- Keep `src/app/layout.tsx` thin and compose a single `AppProviders`.
- Use `src/lib/http-client.ts` (`apiRequest`, `ApiError`, shared parsing) for browser API transport.
- Feature endpoints live next to the feature and call `apiRequest`.
- Client-side data loading/mutations should flow through TanStack Query.
- Do not call raw `useQuery`/`useMutation` in UI components; wrap in feature hooks.
- `QueryClient` creation/defaults live in `src/providers/query-client-provider.tsx`.
- `useQueryClient()` is allowed in components for invalidation/removal when needed.

### Client Persistence (Zustand)

- No direct `localStorage` / `sessionStorage` calls in components or feature hooks (except store internals).
- Use Zustand for shared/persisted client state, with `persist` middleware when persisted.
- Store files belong under `src/features/<feature>/store/`.
- Validate persisted JSON with Zod before use.
- Wait for hydration completion before trusting persisted values for routing/bootstrap behavior.

### Zod Validation (Client + Server)

- Any **form validation** or **backend validation** should use Zod, including on the client.
- For unknown/untrusted structured data (API bodies, search params, storage JSON, websocket payloads), prefer Zod (`safeParse`) over ad hoc shape checks.
- Exception: if the shape is truly trivial single-field validation (for example, only `email`), lightweight validation without Zod is acceptable.
- For anything involving **2 or more fields** (or nested/object rules), use Zod.
- Do not cast unknown JSON to app types before validation.
- Prefer `z.infer<typeof schema>` as the source of truth instead of duplicating interfaces.
- Place feature-local schemas under `src/features/<feature>/schemas/` (or colocated `*.schema.ts`).
- Shared schemas go in `src/lib/schemas/` or `src/schemas/`.

### Security (Strict)

- **No hardcoded secrets**: Never embed API keys, tokens, passwords, or connection strings in source code. Use environment variables. Mark placeholders explicitly (e.g. `process.env.STRIPE_SECRET_KEY`).
- **Parameterized queries only**: Always use Prisma Client queries over raw SQL. If raw SQL is unavoidable, use parameterized placeholders — never string interpolation.
- **Least privilege**: Request only the scopes/permissions/DB access actually needed for the operation. Do not reuse admin-level credentials for user-facing operations.
- **No disabled security defaults**: Do not disable SSL/TLS validation, CORS protections, or CSP headers without an explicit, documented reason.
- **Dependency hygiene**: Do not add new dependencies for functionality already available in the existing stack. If a new dependency is needed, note it explicitly in the response for human review.

### Environment Variables (Strict)

- Never read `process.env.*` directly outside `src/lib/env.server.ts` and `src/lib/env.client.ts`.
- Server/runtime modules must import env from `ServerEnv` (`@/lib/env.server`).
- Client/browser modules must import env from `ClientEnv` (`@/lib/env.client`).
- Add new env keys in the appropriate env module first, validate required keys there, and expose typed exports.
- Required env validation must fail fast and include missing key names in the error message.
- When adding a new env key, add it to `.env.example` in the same change.

### UI and Styling (Strict)

- Do not edit `src/components/ui/` or `src/components/ai-elements/` (treat as read-only vendor-like libs).
- Use `@/components/ui/*` for generic primitives and `@/components/ai-elements/*` for AI/chat patterns.
- Use `lucide-react` for icons.
- Minimize one-off styling; prefer variants, tokens, and `cn` utility patterns.
- Avoid introducing parallel styling/component systems.

### Prisma + Migrations

- Prisma source lives under `prisma/schema/` (multi-file schema), migrations under `prisma/migrations`.
- Use domain-first schema files (for example `ai.prisma`, `billing.prisma`, `user.prisma`) rather than mixing unrelated domains.
- For client components (`"use client"` files), import Prisma types from `@/generated/prisma/browser` using `import type`.
- For server/runtime code, import Prisma types from `@/generated/prisma/client` (and use runtime Prisma Client only on server).
- When typing entities/fields that exist in DB, prefer Prisma-generated types directly instead of duplicating manual string unions/interfaces.
- Agent may edit schema files and migration SQL files.
- For relation changes, explicitly review and choose delete behavior (`Cascade` vs `Restrict`/`NoAction`/`SetNull`).
- Do not run DB-applying commands (`prisma migrate dev/deploy/reset`, `prisma db push`).
- `prisma generate` is separate from applying migrations; run only if explicitly needed.
- Prefer Prisma Client queries over raw SQL.

### Package Manager: Bun

- Use Bun for installs/scripts/tooling by default.
- Use `bun install`, `bun add`, `bun run`, and `bunx`.
- Avoid npm/pnpm/yarn unless a documented exception requires it.
- In multi-package setups, run Bun commands in the relevant package directory as configured.

### SEO Rules Source of Truth (Strict)

- For anything SEO-related, always read and follow `skills/SEO.md`.
- This includes metadata, canonical tags, robots, sitemap, structured data (JSON-LD), OG/Twitter tags/images, indexing behavior, and SEO performance requirements.
- Do not invent alternate SEO rules if `skills/SEO.md` already defines them; treat that file as authoritative.

### i18n (Strict)

- English is the default locale and must use non-prefixed URLs.
- If a URL does not include a locale segment (for example no `/ka`, `/en`, etc.), it is always treated as English (`en`).
- Do not generate `/en` URLs for default English pages unless explicitly requested later.
- Always generate `<link rel="alternate" hreflang="x-default" ...>` to the default English non-prefixed URL.
- This default-locale URL rule exists for cleaner brand presentation, SEO, and user-friendly links.
- Never localize `admin` routes; keep all `admin` route paths stable and non-localized.
- Never localize `api` routes; keep all `src/app/api/**` paths and handlers stable and non-localized.

### Stripe Pricing Sync (Strict)

- Never hardcode plan prices in UI or business logic.
- Always fetch plan prices from Stripe Price objects on the server using configured Stripe price IDs.
- Use Stripe-derived values as the single source of truth for displayed pricing and checkout consistency.
- If Stripe prices are unavailable, disable purchase actions instead of falling back to hardcoded amounts.

<!-- END:Project Rules-->

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

This project uses the App Router exclusively. Never use Pages Router patterns,
conventions, or APIs (`getServerSideProps`, `getStaticProps`, `_app.tsx`, `_document.tsx`, etc.).
If a Next.js docs path covers both routers, follow the App Router section only.

<!-- END:nextjs-agent-rules -->
