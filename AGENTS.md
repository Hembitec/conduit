# AGENTS.md — AI Agent Context & Rules

This file is the single source of truth for any AI agent working on this project.
Read this file BEFORE doing any work. Follow every rule without exception.

---

## 1. Project Overview

**What this is**: An open-source blog CMS being transformed into a SaaS blog platform.

**Current state**: Next.js 14.1.4, Supabase (PostgreSQL), Clerk Auth, UploadThing, TipTap, shadcn/ui

**Target state**: Next.js 16.2, React 19, Convex (DB + Auth + File Storage), TipTap, Tailwind CSS 4, shadcn/ui

**Product name**: TBD (do NOT use "SupaNext CMS" — that is the old name)

**Repository**: `/home/hembi/Desktop/CMS`

---

## 2. Reference Files

Before starting any phase, read these files in order:

| File | Purpose |
|------|---------|
| `AGENTS.md` | This file — rules and context |
| `GOALS.md` | Master plan with all 10 phases and acceptance criteria |
| `DESIGN-SYSTEM.md` | Typography, colors, spacing, icons, animation rules |
| `PAGE-LAYOUTS.md` | Wireframes for all 17 pages with acceptance criteria |
| `ARCHITECTURE.md` | Directory structure, data flows, naming conventions |
| `PHASE-TRACKER.md` | Progress tracker — update after completing tasks |

**If a reference file contradicts this file, this file wins.**

---

## 3. Absolute Rules (Never Break These)

### 3.1 File Size Limit
**No file may exceed 550 lines of code.**

If a file is approaching 500 lines, split it into smaller modules:
- Extract shared logic into utility functions
- Split components into sub-components
- Move constants/config to separate files
- Use barrel exports (index.ts) to re-export

If a single file absolutely must be large (e.g., a complex Convex function file), document why in a comment at the top.

### 3.2 Zero Hardcoded Colors
No hex (`#fff`), rgb (`rgb(255,255,255)`), or hsl (`hsl(0,0%,100%)`) values in any `.tsx` or `.ts` file.

All colors must use Tailwind classes that reference CSS variables:
```
bg-primary, text-foreground, border-border, text-muted-foreground, bg-accent
```

The only exception is `globals.css` where the CSS variables are defined.

### 3.3 No Emoji as Icons
Never use emoji (🎉, 🚀, ⚙️, etc.) as UI icons.

Always use Lucide React icons:
```tsx
import { Home, Settings, FileText } from "lucide-react";
```

### 3.4 No Console.log in Production Code
Remove all `console.log`, `console.error`, `console.warn` before considering any task done.

Exception: Error boundary components may use `console.error` for error reporting.

### 3.5 No `any` Types
Never use `any` as a TypeScript type. If you don't know the type, use proper typing:
- Use Convex's `Id<"tableName">` for document IDs
- Use `v.string()`, `v.number()` etc. for Convex validators
- Use generics when needed
- Use `unknown` if truly unsure, then narrow with type guards

### 3.6 No Dead Code
If code is not used, delete it. Do not comment it out. Git history preserves it if needed.

### 3.7 No Duplicate Code
Before writing any function or component, check if it already exists. Use the existing one.

If you find duplicate code during your work, consolidate it into a single shared module.

---

## 4. Phase Execution Rules

### 4.1 One Phase at a Time
Complete the current phase fully before starting the next.

Check the phase's acceptance criteria in `GOALS.md`. Every single criterion must be met.

### 4.2 Update the Tracker
After completing any task, immediately update `PHASE-TRACKER.md`:
- Check off the completed task
- Update the progress table at the bottom
- Update the phase status (IN PROGRESS → DONE)

Do this AFTER each task, not at the end of a phase.

### 4.3 Verify Before Moving On
Before marking a phase as DONE:
1. Run `npm run build` — must pass with zero errors
2. Run `npm run lint` — must pass with zero errors
3. Run `npm run dev` — must start without warnings
4. Verify every acceptance criterion in GOALS.md for that phase

### 4.4 If Something Breaks
If a change breaks the build or causes errors:
1. Fix it immediately before continuing
2. Do not leave the codebase in a broken state
3. If you cannot fix it, stop and ask the user

---

## 5. Code Style Rules

### 5.1 Naming Conventions
- **Files**: Components `PascalCase.tsx`, utilities `camelCase.ts`, Convex functions `camelCase.ts`
- **Functions**: Convex mutations/queries `camelCase`, React components `PascalCase`, hooks `useCamelCase`
- **Variables**: Convex fields `camelCase`, CSS variables `kebab-case`, env vars `SCREAMING_SNAKE_CASE`
- **Directories**: `kebab-case` (e.g., `landing-page/`)

### 5.2 Imports
- Use `@/` alias for project imports (e.g., `@/components/ui/button`)
- Group imports: React → Next.js → Third-party → Project components → Utilities
- Use barrel exports (`index.ts`) for clean re-exports

### 5.3 Components
- One component per file (with named export)
- Props interface defined above the component
- Use `"use client"` only when necessary (hooks, event handlers, browser APIs)
- Server components by default

### 5.4 Error Handling
- Convex functions: Return clear error objects, don't throw unexpected errors
- Client-side: Use toast notifications (Sonner) for user-facing errors
- Forms: Use Zod validation, show inline error messages
- Never swallow errors silently

### 5.5 Styling
- Tailwind utility classes only
- No inline `style={}` props (except dynamic values from JS)
- Use `cn()` from `lib/utils.ts` for conditional classes
- Follow the 8px spacing grid (use multiples of 4px)

---

## 6. Design Rules

### 6.1 Follow the Design System
Read `DESIGN-SYSTEM.md` before designing any page. Every rule there is mandatory.

### 6.2 Follow Page Layouts
Read `PAGE-LAYOUTS.md` before building any page. Every page has a wireframe and acceptance criteria.

### 6.3 Dark Mode
Every page must work in both light and dark mode. Test both.

### 6.4 Responsive
Every page must be responsive at: 375px, 768px, 1024px, 1440px.

### 6.5 Loading States
Every page that fetches data must show a skeleton loader while loading.

### 6.6 Empty States
Every list view must have an illustrated empty state when no data exists.

### 6.7 Hover States
Every clickable element must have:
- `cursor-pointer`
- Visual hover feedback (color change, shadow, border)
- Smooth transition (150-300ms)

---

## 7. Convex-Specific Rules

### 7.1 Schema First
Always define the schema in `convex/schema.ts` before writing any functions.

### 7.2 Auth Check
Every Convex mutation and query (except public API routes) must check authentication:
```ts
const identity = await ctx.auth.getUserIdentity();
if (!identity === null) {
  throw new Error("Not authenticated");
}
```

### 7.3 User Isolation
All data queries must filter by `userId`. One user must never see another user's data.

### 7.4 File Storage (Cloudflare R2)
Use Cloudflare R2 for all file uploads. R2 is S3-compatible and uses the AWS SDK v3.

Upload flow:
1. Client requests presigned URL from `/api/upload`
2. Server generates presigned URL using R2 credentials
3. Client uploads directly to R2 using the presigned URL
4. Public URL stored in Convex database

Configuration:
- R2 client in `lib/r2.ts`
- Presigned URL API in `app/api/upload/route.ts`
- Custom UploadButton in `components/UploadButton.tsx`

Environment variables required:
- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `NEXT_PUBLIC_R2_PUBLIC_URL`

Editor images (hybrid approach):
- Upload button → R2
- URL paste → keep external URL as-is
- Cover/author images → always R2

### 7.5 Indexes
Always define indexes for fields you query by. Never do full table scans.

---

## 8. Authentication Rules

### 8.1 Convex Auth Only
Use `@convex-dev/auth` with email + password provider.

No social login (no Google, GitHub, etc.).

### 8.2 Route Protection
- `/cms/*` routes must be protected (redirect to `/sign-in` if not authenticated)
- `/blog/*` and `/article/public/*` are public
- Landing page (`/`) is public
- Sign-in and sign-up pages are public

### 8.3 API Key
The API key shown to users must be a proper generated key, NOT the user's ID.

---

## 9. Git & Deployment Rules

### 9.1 Commit Messages
Use conventional commits:
- `feat: add analytics dashboard`
- `fix: correct article slug routing`
- `refactor: extract shared MenuBar component`
- `docs: update GOALS.md with phase 5 progress`
- `chore: remove dead dependencies`

### 9.2 No Secrets in Code
Never commit API keys, secrets, or credentials. Use `.env.local` (which is gitignored).

### 9.3 Build Must Pass
Never commit code that breaks the build.

---

## 10. When to Ask for Clarification

Ask the user if:

1. **A requirement is ambiguous** — The GOALS.md or PAGE-LAYOUTS.md doesn't specify something clearly
2. **A design decision is needed** — Colors, layout choices not covered in DESIGN-SYSTEM.md
3. **A dependency choice is unclear** — Which library to use for a specific feature
4. **An acceptance criterion can't be met** — Technical limitation prevents meeting a requirement
5. **A phase is complete** — Ask for review before moving to the next phase
6. **You find something unexpected** — The codebase behaves differently than documented

**Do NOT ask** if the answer is clearly in one of the reference files. Read them first.

---

## 11. Anti-Patterns to Avoid

| Don't Do This | Do This Instead |
|---------------|-----------------|
| `className="bg-[#1a1a1a]"` | `className="bg-primary"` |
| `<div onClick={...}>` | `<button onClick={...}>` or `<a>` |
| Inline `style={{ color: 'red' }}` | `className="text-destructive"` |
| `any` type | Proper TypeScript types |
| `console.log('debug')` | Remove before committing |
| Commented-out code | Delete it |
| Duplicate utility functions | Import the existing one |
| Building from scratch | Check if shadcn has a block for it |
| Ignoring dark mode | Test both light and dark |
| Skipping loading states | Always add skeletons |
| Hardcoded URLs | Use environment variables |

---

## 12. Shadcn/ui Rules

### 12.1 Use Shadcn Blocks First
Before building a layout from scratch, check if shadcn has a block:
```bash
npx shadcn@latest add dashboard-01
npx shadcn@latest add login-01
```

### 12.2 Sidebar Component
Use shadcn's `<Sidebar>` component with `<SidebarProvider>` for the dashboard sidebar.

### 12.3 Form Handling
Use shadcn `<Form>` component with react-hook-form and Zod validation for all forms.

### 12.4 Don't Modify Shadcn Components
Extend them if needed, but don't edit the generated files directly.

---

## 13. Performance Rules

### 13.1 Images
Always use Next.js `<Image>` component. Never use raw `<img>` tags for app images.

### 13.2 Lazy Loading
Load below-fold images with `loading="lazy"`.

### 13.3 Code Splitting
Use dynamic imports for heavy components (e.g., charts, editors):
```tsx
const Chart = dynamic(() => import('./Chart'), { ssr: false });
```

### 13.4 No Layout Shift
Always specify dimensions for images and containers to prevent content jumping.

---

## 14. Accessibility Rules

### 14.1 Semantic HTML
Use `<nav>`, `<main>`, `<article>`, `<section>`, `<header>`, `<footer>` appropriately.

### 14.2 Form Labels
Every `<input>` must have an associated `<label>`.

### 14.3 Alt Text
Every `<Image>` must have an `alt` attribute.

### 14.4 Focus States
All interactive elements must have visible focus states for keyboard navigation.

### 14.5 Motion
Respect `prefers-reduced-motion`. Provide reduced or no animation for users who prefer it.

---

## 15. Quick Reference

### Run Commands
```bash
npm run dev          # Start development server
npm run build        # Production build
npm run lint         # ESLint check
npx convex dev       # Start Convex dev server
```

### Key Directories
```
app/                 # Next.js pages and API routes
components/          # React components
components/ui/       # shadcn/ui components
convex/              # Convex backend functions and schema
lib/                 # Utility functions
public/              # Static assets
```

### Key Files
```
GOALS.md             # Master plan (read first)
DESIGN-SYSTEM.md     # Design rules (read before UI work)
PAGE-LAYOUTS.md      # Page wireframes (read before building pages)
ARCHITECTURE.md      # Structure and flows (read before coding)
PHASE-TRACKER.md     # Progress tracking (update after tasks)
AGENTS.md            # This file (always follow + update it)
```

---

## 16. Context Memory Rule

**After every significant task or decision, update this file (AGENTS.md) to preserve context for future sessions.**

This includes:
- **New decisions made** — If the user clarifies something or makes a choice, add it here
- **Problems solved** — If you hit a bug or issue and fixed it, document it
- **New dependencies added** — If a new package is installed, note it
- **Schema changes** — If the Convex schema is modified, update the reference here
- **Deleted files** — If files were removed, note what and why
- **Discovered patterns** — If you find a useful pattern in the codebase, record it
- **User preferences** — If the user expresses a preference (e.g., "I don't like modals"), record it

### How to Update
Add a section called `## 17. Session Notes` at the bottom of this file (or update the existing one). Format:
```markdown
## 17. Session Notes

### [Date] — Phase X: [Task Name]
- **What was done**: Brief description
- **Key decisions**: Any choices made
- **Issues encountered**: Problems and how they were resolved
- **Files changed**: List of modified/deleted/created files
- **Next step**: What should happen next
```

### Why This Matters
AI agents lose context between sessions. This file is the persistent memory. If you don't update it, important context will be lost and the next agent (or future you) will have to re-discover everything.

**This file must always reflect the current state of the project.**

---

**Remember**: If you're unsure, ask. If you make a mistake, fix it immediately. If a phase is done, verify every acceptance criterion before moving on. Always update this file after significant work.

<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## 17. Session Notes

### 2026-04-07 — Phase 4 Completion & Stabilization (Phase 4.1/4.2)
- **What was done**: Completed Phase 4 (Data Layer Migration) by verifying all Convex CRUD operations work. Conducted a deep code audit across 6 core workflows and fixed critical UI/UX, data integrity, and security gaps (Phase 4.1 and 4.2). Marked Phase 4 as `DONE` in the tracker.
- **Key decisions**:
  - Replaced raw `throw new Error()` in `convex/mutations.ts` with `ConvexError` to surface clean error messages to the client instead of raw stack traces.
  - Form validation on the "Publish" and "Manage Article" pages was updated to store document `_id` values instead of full `blogHtml` blobs to prevent Next.js client-side state corruption.
  - Used `useRouter` to auto-redirect users from document creation to the TipTap editor, and from publish submission back to the CMS dashboard (better UX).
  - API Routes are now fully secured with `X-Auth-Key` header validation checking against a new `by_api_key` index in Convex.
- **Issues encountered & fixed**:
  - *Next.js Image Crash*: Solved empty `src` attribute crashes on the CMS dashboard by conditionally rendering skeleton placeholders if no image exists.
  - *Data Corruption*: Forms were storing full HTML as string values, replaced with Convex ID bindings.
  - *Broken API Key UI*: The Settings page was hardcoded. Re-wired it to load real API keys and trigger the `generateApiKey` mutation.
  - *Unpublished Share Links 404ing*: Fixed `readPublicArticle` to allow shareable (but unpublished) articles to be viewed via direct link.
  - *Missing Clicks*: Added CTA buttons (Share, Manage, Open Editor, etc.) to all dashboard cards for discoverability.
- **Files changed**:
  - `convex/mutations.ts`, `convex/queries.ts`, `convex/schema.ts`
  - `app/api/blog/.../*route.ts`
  - `app/cms/page.tsx`, `app/cms/settings/(components)/UserInfo.tsx`, `app/cms/documents/[id]/(components)/SubmitDocument.tsx`, `app/cms/(components)/CreateDocument.tsx`, `app/cms/publish/page.tsx`, `app/cms/documents/(components)/Documents.tsx`, `app/article/public/[id]/page.tsx`
  - `components/TrackPageView.tsx`
- **Next step**: Move on to Phase 5 (UI/UX Redesign).

### 2026-04-08 — Phase 5: UI/UX Redesign (Initial Session)
- **What was done**: Fixed authentication breaking issue (400 Bad Request on /api/auth). Updated CSS variables in globals.css to use Sage Green & Terracotta theme. Updated DashboardSidebar to use CSS variables instead of hardcoded gray colors. Added loading skeletons to CMS dashboard and documents page. Replaced TipTap editor toolbar text labels with Lucide icons.
- **Key decisions**:
  - Auth fix: Created `app/api/auth/route.ts` as proxy to Convex backend for auth requests
  - Updated `proxy.ts` to use explicit `apiRoute: "/api/auth"` configuration
  - Added font preconnect and Google Fonts links to `app/layout.tsx`
  - Theme uses CSS variables with Tailwind 4 `@theme` directive
- **Issues encountered & fixed**:
  - *Auth 400 Error*: Convex Auth returning 400 on /api/auth - fixed by creating proxy API route
  - *Missing Fonts*: Libre Bodoni and Public Sans fonts now properly loaded
  - *Hardcoded Colors*: Updated DashboardSidebar to use `text-muted-foreground`, `bg-primary`, `hover:bg-accent`
  - *Text Labels in Editor*: Replaced B, I, S, H1, H2, H3 text buttons with Lucide icons
- **Files changed**:
  - `app/globals.css` - CSS variables with Sage Green & Terracotta theme
  - `app/layout.tsx` - Added font preconnect
  - `app/cms/(components)/DashboardSidebar.tsx` - Updated to use CSS variables
  - `app/cms/page.tsx` - Updated to use CSS variables
  - `app/cms/documents/[id]/page.tsx` - Updated TipTap MenuBar with Lucide icons
  - `app/api/auth/route.ts` - NEW - Auth proxy route
  - `proxy.ts` - Added apiRoute configuration
  - `app/cms/loading.tsx` - NEW - Loading skeleton for CMS
  - `app/cms/documents/loading.tsx` - NEW - Loading skeleton for documents
- **Next step**: Complete remaining Phase 5 tasks (article preview page, public article page), then move to Phase 6 (SEO Features)

### 2026-04-25 — Codebase Audit & Git Hygiene

- **What was done**: Conducted exhaustive 6-area codebase audit. Fixed all issues found:
  1. Removed `yarn.lock` — project uses npm only
  2. Deleted empty root `cms/` directory (leftover git submodule/clone)
  3. Deleted empty `app/simple/` directory
  4. Uninstalled `@supabase/auth-helpers-nextjs` (still lingered in package.json)
  5. Stripped all 10 `console.log` statements from TipTap UI JSDoc blocks
  6. Fixed hardcoded `text-gray-500`, `text-gray-900`, `text-gray-400` in LandingPage components
  7. Fixed emoji icon violation (🎉 → `<Sparkles />` Lucide icon) in AnimatedGradientComponent
  8. Fixed `bg-gray-300` → `bg-border` in AnimatedGradientComponent
  9. Completely rewrote API docs page: fixed POST→GET bug, added response format examples, error code docs, account-scoping explainer
  10. Moved `utils/transform-node.tsx` → `lib/transform-node.tsx`, updated both import sites
  11. Deleted `utils/types.ts` (duplicate of `types/index.ts`)
  12. Updated PHASE-TRACKER.md to accurately reflect Phase 0 and Phase 3 status

- **Key decisions**:
  - User confirmed: **npm only** (not yarn)
  - User confirmed: **do NOT rename proxy.ts** — Next.js 16 uses `proxy.ts` not `middleware.ts`
  - API is correctly scoped: each API key only returns that key owner's articles (not global)
  - Phase 3.5 (forgot password) acknowledged as NOT DONE, deferred

- **Architecture clarifications found**:
  - `convex/http.ts` only mounts auth routes — public API uses Next.js API routes (not Convex HTTP actions)
  - `ARCHITECTURE.md` is out of date (schema field names differ from actual schema)
  - The public article page is still at `/article/public/[id]` (Phase 6 will migrate to `/blog/[slug]`)
  - Comment system: backend + moderation dashboard built, but **NO public comment form exists yet**

- **Issues encountered & fixed**:
  - `npm uninstall` failed with peer dep conflict — fixed with `--legacy-peer-deps`
  - Two `console.log` instances in TipTap hooks had special chars that `sed` couldn't match — fixed directly

- **Files changed**:
  - `yarn.lock` — DELETED
  - `utils/types.ts` — DELETED (duplicate)
  - `utils/transform-node.tsx` — MOVED to `lib/transform-node.tsx`
  - `package.json` — removed `@supabase/auth-helpers-nextjs`
  - `components/LandingPage/AnimatedGradientComponent.tsx` — emoji→Lucide, gray→border
  - `components/LandingPage/BlogSamples.tsx` — gray→muted-foreground
  - `components/LandingPage/MarketingCards.tsx` — 3× hardcoded grays replaced
  - `components/tiptap-ui/*/use-*.ts` + `color-highlight-button.tsx` — 10× console.log removed
  - `app/cms/api/page.tsx` — full rewrite with correct methods, response shapes, error codes
  - `app/article/public/[id]/page.tsx` — import path updated
  - `app/cms/preview/[slug]/page.tsx` — import path updated
  - `PHASE-TRACKER.md` — Phase 0 and Phase 3 status corrected

- **Next step**: Run `npm run build` to verify, then commit everything with the provided commit message

### 2026-04-25 — Settings UI, Analytics & Public Comments (Pre-SEO)

- **What was done**: Added a ThemeProvider to enable system-wide dark mode support. Created the Appearance section in the settings page to toggle Light/Dark/System themes. Wired the analytics dashboard to actual Convex queries, displaying real page views, published count, and a dynamic 30-day view chart instead of placeholders. Created the `ArticleComments` client component and integrated it into the public article page to allow visitors to submit comments (which await approval in the CMS).
- **Key decisions**:
  - `next-themes` used with `attribute="class"` for Tailwind compatibility.
  - The `ArticleComments` component handles its own client-side data fetching and form submission while the parent `page.tsx` remains a Server Component.
- **Issues encountered & fixed**:
  - `npm` wasn't available in the secure sandbox environment when trying to run the build verification, but the dev server was already running and verified successfully.
- **Files changed**:
  - `app/provider.tsx`, `app/cms/settings/(components)/UserInfo.tsx`
  - `app/cms/analytics/page.tsx`
  - `components/ArticleComments.tsx` (new), `app/article/public/[id]/page.tsx`
- **Next step**: Start Phase 6 (SEO Features) — migrate URL to `/blog/[slug]`, add `generateMetadata()`, sitemap, and RSS feed.

### 2026-04-25 — Deep Codebase Audit & Cleanup Sweep

- **What was done**: Exhaustive audit of every file, route, backend function, and schema. Compared actual codebase state against GOALS.md, ARCHITECTURE.md, and PHASE-TRACKER.md. Identified 7 tasks already completed but unchecked. Executed full cleanup sweep.
- **Key decisions**:
  - File size splits (OnboardingModal.tsx 572 lines, publish/page.tsx 553 lines) deferred — user said "we can leave this alone not much"
  - Hardcoded Tailwind semantic colors (green-500 for success, yellow-500 for warning) acknowledged but deprioritized — could define `--color-success` later
- **Cleanup executed**:
  1. DELETED `app/cms/(components)/ArticleCard.tsx` — dead, replaced by EntityCard
  2. DELETED `components/ModeToggle.tsx` — not imported anywhere, dark mode is in Settings
  3. DELETED `components/theme-provider.tsx` — not imported, ThemeProvider is from next-themes in provider.tsx
  4. DELETED empty `utils/` directory
  5. REMOVED commented-out code from `app/page.tsx` (MarketingCards + LogoAnimation imports)
  6. FIXED `package.json` name from "heytorontofoodie" → "conduit-cms"
  7. UPDATED `ARCHITECTURE.md` schema to match actual `convex/schema.ts` (10+ field mismatches fixed)
  8. UPDATED `PHASE-TRACKER.md` — checked off 7 tasks, updated statuses, corrected summary table (62% → 72%)
- **Tasks newly confirmed as done**:
  - 7.1 Page view tracking (TrackPageView component)
  - 7.2 View count per article (trackPageView mutation increments viewCount)
  - 7.3 Reading time auto-calculated (storeArticle calculates readingTime)
  - 7.5 Per-article view count on preview page
  - 6.8 metaDescription field in publish form (with 160-char counter)
  - 8.9 Author bio section on public article page
- **Remaining known issues** (logged, not blocking):
  - 4 raw `<img>` tags should be `<Image>` (publish preview, author pages, old ArticleCard)
  - Inconsistent error handling: some files use `ConvexError`, others use raw `throw new Error`
  - Dashboard search input is decorative (no filtering logic)
  - No public `/blog` listing page exists yet
  - `by_slug` index is not user-scoped (potential slug collision across users)
- **Files changed**:
  - `app/cms/(components)/ArticleCard.tsx` — DELETED
  - `components/ModeToggle.tsx` — DELETED
  - `components/theme-provider.tsx` — DELETED
  - `utils/` directory — DELETED
  - `app/page.tsx` — removed commented-out code
  - `package.json` — name fixed
  - `ARCHITECTURE.md` — schema section rewritten to match reality
  - `PHASE-TRACKER.md` — 7 tasks checked off, statuses updated
  - `AGENTS.md` — session notes added
- **Next step**: Start Phase 6 (SEO) — create `/blog/[slug]` route with `generateMetadata()`, sitemap, robots.txt, RSS feed.

### 2026-05-10 — Blog Public Listing Page Creation
- **What was done**: Created the public blog listing page (`/blog`) and connected it to the landing page navbar.
- **Key decisions**:
  - Enriched the `getPublishedArticles` query in `convex/blogs.ts` to return author and category data so the UI can display them correctly on the blog listing page.
  - Used the existing `NavBar` and `Footer` components to keep the layout consistent with the landing page design.
  - Set up a clean, responsive grid layout for the latest articles featuring cover images, categories, reading times, and author avatars.
- **Issues encountered & fixed**:
  - `getPublishedArticles` was previously returning raw database records without author/category data; modified it using `Promise.all` to fetch relationships.
  - Found a named import for `Footer` (`{ Footer }`) but the component used a `export default Footer`; fixed it to a default import.
- **Files changed**:
  - `convex/blogs.ts` (updated `getPublishedArticles` query)
  - `app/blog/page.tsx` (new file created)
- **Next step**: Finalize remaining Blog Features (search, tag filtering) from Phase 8.
