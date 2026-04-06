# Project Goals: Open Source CMS → SaaS Blog Platform

## Vision
Transform a single-user open-source blog CMS into a modern, clean, minimal SaaS blog platform built on Convex.

## Tech Stack (Target)

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2 (latest) |
| React | 19 |
| Styling | Tailwind CSS 4 + shadcn/ui |
| Database | Convex |
| Auth | Convex Auth (email + password only) |
| File Storage | Cloudflare R2 (S3-compatible, 10GB free) |
| Editor | TipTap |
| State | Convex real-time + TanStack Query |

## Core Rules

1. **Zero hardcoded colors** — All colors via CSS variables in `globals.css`. No hex, rgb, or hsl in any `.tsx` file.
2. **No social login** — Email + password only via Convex Auth.
3. **One user = one isolated blog** — Simplest multi-tenancy. Each user sees only their data.
4. **No billing yet** — Stripe/Paddle deferred to future phase.
5. **Clean execution** — No rushed code. Each phase verified before moving on.

---

## Phase 0: Pre-Migration Cleanup
**Goal**: Remove dead code and fix duplication before touching the stack.

### Tasks
- [x] 0.1 Remove dead dependencies (`openai`, `@liveblocks/*`, `yjs`, `ai`, `@blocknote/*`, `cmdk`, `fast-check`, `next-view-transitions`, `prisma`, `@prisma/client`)
- [x] 0.2 Delete `prisma/schema.prisma` (dead code)
- [x] 0.3 Fix duplicate `cn()` — keep `lib/utils.ts`, delete `utils/cn.ts`
- [x] 0.4 Fix duplicate ThemeProvider — keep `components/theme-provider.tsx`, delete `utils/theme-provider.tsx`
- [x] 0.5 Remove all `console.log` statements (~15+ occurrences)
- [x] 0.6 Remove hardcoded URLs (`cms.rasmic.xyz` in API docs and public article page)
- [x] 0.7 Update LICENSE to new project name

### Acceptance Criteria
> `npm run build` passes with zero errors. No dead dependencies in `package.json`. No duplicate utility functions. No `console.log` in production code. No hardcoded third-party URLs.

---

## Phase 1: Core Framework Upgrade
**Goal**: Modernize Next.js, React, and Tailwind to latest versions.

### Tasks
- [x] 1.1 Upgrade Next.js from 14.1.4 → 16.2
- [x] 1.2 Upgrade React from 18 → 19
- [x] 1.3 Upgrade Tailwind CSS from 3 → 4 (CSS-first config)
- [x] 1.4 Re-initialize shadcn/ui for Tailwind 4 compatibility
- [x] 1.5 Regenerate all 24 shadcn/ui components
- [x] 1.6 Update remaining dependencies (`framer-motion`, `sonner`, `@tanstack/react-query`, `zod`, `react-hook-form`, `lucide-react`)
- [x] 1.7 Update `next.config.js` to Next.js 16 format
- [x] 1.8 Update `tsconfig.json` for compatibility
- [x] 1.9 Verify build passes with zero errors

### Acceptance Criteria
> Next.js 16.2 running. React 19 active. Tailwind 4 configured via CSS. All shadcn components regenerated. `npm run build` passes. `npm run dev` starts without warnings. All existing pages still render (even if ugly — redesign comes later).

---

## Phase 2: Convex Infrastructure
**Goal**: Set up Convex as the new backend. Replace Supabase, Clerk, and UploadThing with one unified system.

### Tasks
- [ ] 2.1 Install Convex (`npx convex dev --configure`)
- [ ] 2.2 Install `@convex-dev/auth`
- [ ] 2.3 Create `convex/schema.ts` with all tables (users, documents, categories, authors, blogs, comments, pageViews)
- [ ] 2.4 Configure Convex Auth in `convex/auth.ts` — email + password provider only
- [ ] 2.5 Set up Cloudflare R2 for file storage (public bucket, S3-compatible)
- [ ] 2.5a Create R2 client config in `lib/r2.ts`
- [ ] 2.5b Create upload API route at `app/api/upload/route.ts` (presigned URL generation)
- [ ] 2.5c Create custom UploadButton component (replaces UploadThing)
- [ ] 2.5d Update `next.config.js` — add R2 public domain to image domains
- [ ] 2.6 Create Convex mutations for all write operations
- [ ] 2.7 Create Convex queries for all read operations
- [ ] 2.8 Set up Convex HTTP routes for public API (`/api/blog/*`)
- [ ] 2.9 Create `.env.local` with Convex deployment URL

### Acceptance Criteria
> Convex dashboard accessible. Schema deployed. Auth configured with email+password. R2 client connects successfully. Presigned URL generation works. Upload to R2 succeeds. Public URL accessible. Next.js `<Image>` renders R2-hosted images. Convex functions callable from dashboard. HTTP routes respond to curl requests. All data stored in Convex (not Supabase). No UploadThing code remains.

---

## Phase 3: Auth Migration
**Goal**: Replace Clerk entirely with Convex Auth. Email + password only.

### Tasks
- [ ] 3.1 Uninstall `@clerk/nextjs` and remove all Clerk config
- [ ] 3.2 Wrap app in `ConvexAuthProvider`
- [ ] 3.3 Create custom sign-in page at `/sign-in`
- [ ] 3.4 Create custom sign-up page at `/sign-up`
- [ ] 3.5 Create forgot password flow
- [ ] 3.6 Update middleware to check Convex Auth session
- [ ] 3.7 Protect `/cms` routes — redirect to sign-in if unauthenticated
- [ ] 3.8 Delete `app/api/auth/webhook/route.ts` (Clerk webhook)
- [ ] 3.9 Replace all `auth()` calls with Convex `getAuthUserId()`
- [ ] 3.10 Remove `svix` dependency

### Acceptance Criteria
> Sign-up with email + password creates user in Convex `users` table. Sign-in returns valid session. Unauthenticated users cannot access `/cms/*`. Password reset works via email. No Clerk code remains anywhere. `SignOutButton` logs user out and redirects to sign-in.

---

## Phase 4: Data Layer Migration
**Goal**: Replace all Supabase server actions with Convex functions.

### Tasks
- [ ] 4.1 Create all Convex mutations (createDocument, storeDocument, deleteDocument, storeArticle, updateArticle, deleteBlog, statusBlog, shareArticle, createAuthor, createCategory)
- [ ] 4.2 Create all Convex queries (getAllDocuments, getDocumentById, getAllArticles, getArticleBySlug, getAllAuthors, getAllCategories, readPublicArticle, getArticlesSlugs)
- [ ] 4.3 Replace React Query hooks with Convex hooks (`useQuery`, `useMutation`)
- [ ] 4.4 Update API routes to use Convex HTTP actions
- [ ] 4.5 Remove UploadThing — uninstall `@uploadthing/react` and `uploadthing` packages, delete `app/api/uploadthing/*`, delete `utils/uploadthing.ts`
- [ ] 4.6 Implement R2 file upload — replace UploadButton in publish and author forms with new R2 UploadButton
- [ ] 4.7 Uninstall all Supabase packages
- [ ] 4.8 Delete entire `utils/actions/` directory
- [ ] 4.9 Delete `utils/hooks/` directory
- [ ] 4.10 Delete `utils/uploadthing.ts`

### Acceptance Criteria
> All CRUD operations work through Convex. Documents can be created, edited, deleted. Articles can be published, previewed, edited, unpublished, deleted. Authors and categories can be created. File uploads save to R2 and return valid public URLs. No Supabase code remains. No UploadThing code remains. Public API endpoints return correct data.

---

## Phase 5: UI/UX Redesign
**Goal**: Complete visual overhaul. Clean, minimal, professional. Zero hardcoded colors.

### Tasks
- [ ] 5.1 Define CSS variable system in `globals.css` (all colors as `--color-*` variables)
- [ ] 5.2 Update Tailwind config to reference CSS variables
- [ ] 5.3 Audit all 24 shadcn/ui components — replace any hardcoded colors
- [ ] 5.4 Redesign landing page (hero, features, CTA, footer)
- [ ] 5.5 Redesign sign-in and sign-up pages
- [ ] 5.6 Redesign dashboard sidebar (use shadcn Sidebar component)
- [ ] 5.7 Redesign dashboard content area
- [ ] 5.8 Redesign document editor (TipTap toolbar with icons)
- [ ] 5.9 Redesign article preview page
- [ ] 5.10 Redesign public article reading page
- [ ] 5.11 Add loading skeletons to all data-fetching pages
- [ ] 5.12 Add illustrated empty states for all list views
- [ ] 5.13 Remove all "SupaNext CMS" branding — replace with new product name

### Acceptance Criteria
> Every page looks clean, minimal, professional. No color is hardcoded — all come from CSS variables. Dark mode works on every page. Landing page has hero, features, CTA sections. Dashboard has sidebar + content layout. Editor toolbar has proper icons. Loading states show skeletons. Empty states show illustrations and action buttons. Responsive at 375px, 768px, 1024px, 1440px.

---

## Phase 6: SEO Features
**Goal**: Make every published article SEO-optimized.

### Tasks
- [ ] 6.1 Per-article metadata via `generateMetadata()` (title, description, image)
- [ ] 6.2 Open Graph tags on every article (`og:title`, `og:description`, `og:image`, `og:type`)
- [ ] 6.3 Twitter Card tags (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- [ ] 6.4 Dynamic sitemap at `/sitemap.xml` listing all published articles
- [ ] 6.5 Static `robots.txt` allowing crawlers, pointing to sitemap
- [ ] 6.6 Canonical URLs via `<link rel="canonical">` on every article
- [ ] 6.7 Change public article URL from `/article/public/[id]` to `/blog/[slug]`
- [ ] 6.8 Add optional `metaDescription` field to publish form
- [ ] 6.9 JSON-LD structured data (Article schema) on every article page
- [ ] 6.10 RSS feed at `/feed.xml` serving all published articles

### Acceptance Criteria
> Visiting `/blog/[slug]` shows correct title, description, and image in browser tab and when shared on social media. Google Rich Results Test passes for article pages. `/sitemap.xml` lists all published articles with correct slugs and last-modified dates. `/robots.txt` exists and references sitemap. `/feed.xml` returns valid RSS XML. Old `/article/public/[id]` URLs redirect to new `/blog/[slug]`.

---

## Phase 7: Analytics Features
**Goal**: Track and display blog performance.

### Tasks
- [ ] 7.1 Page view tracking — Convex mutation fires on public article render
- [ ] 7.2 View count per article stored in `blogs.viewCount`
- [ ] 7.3 Reading time auto-calculated on publish (word count / 200)
- [ ] 7.4 Analytics dashboard page at `/cms/analytics`
- [ ] 7.5 Per-article view count shown on preview page
- [ ] 7.6 Date range filtering (7 days, 30 days, all time)

### Acceptance Criteria
> Opening a public article increments its view count. Analytics dashboard shows total views, views per article, top 5 articles, and a trend chart. Each article card in dashboard shows view count and reading time. Date filter changes the displayed data. Charts render without errors.

---

## Phase 8: Blog Feature Gaps
**Goal**: Fill missing standard blog features.

### Tasks
- [ ] 8.1 Comments system — public comment form on articles, moderation in dashboard
- [ ] 8.2 Tags system — add tags table, attach to blogs, filter by tag
- [ ] 8.3 Search — full-text search on blog titles in dashboard and public blog
- [ ] 8.4 Draft auto-save — TipTap content saved every 30 seconds
- [ ] 8.5 Social sharing buttons — Twitter/X, LinkedIn, Facebook on public articles
- [ ] 8.6 Related articles — 3 related articles by matching tags at bottom of each article
- [ ] 8.7 Table of contents — auto-generated from h2/h3 headings, sticky sidebar
- [ ] 8.7a Add image upload button to TipTap editor toolbar (upload to R2, insert URL into editor content)
- [ ] 8.8 Reading progress bar — thin bar at top of article showing scroll position
- [ ] 8.9 Author bio section — full author info at end of each article
- [ ] 8.10 Newsletter placeholder — email input field on public blog for future use

### Acceptance Criteria
> Visitors can leave comments on public articles. Author can approve/reject comments in dashboard. Tags can be created and attached to articles. Search bar finds articles by title. Editor auto-saves every 30 seconds without user action. Share buttons open correct share URLs. Related articles section shows 3 relevant articles. Table of contents links scroll to correct headings. Reading progress bar updates smoothly. Author bio shows name, image, and social links. Newsletter input exists (does not need to send emails yet).

---

## Phase 9: Code Quality
**Goal**: Production-grade code standards.

### Tasks
- [ ] 9.1 Remove all `any` types — proper TypeScript everywhere
- [ ] 9.2 Centralize error handling pattern across all Convex functions
- [ ] 9.3 Zod validation on all forms (consistent, not just publish page)
- [ ] 9.4 Extract duplicated TipTap MenuBar into single shared component
- [ ] 9.5 Consolidate duplicate SCSS files into one
- [ ] 9.6 Add barrel exports (`index.ts`) for clean imports
- [ ] 9.7 Consistent file and function naming convention
- [ ] 9.8 Stricter ESLint rules beyond `next/core-web-vitals`
- [ ] 9.9 Remove all files left over from removed dependencies

### Acceptance Criteria
> `npm run lint` passes with zero errors. No `any` types in codebase. No duplicate components. All imports use barrel exports. Naming is consistent across all files. No leftover files from old dependencies.

---

## Summary

| Phase | Focus | Estimated Scope |
|-------|-------|----------------|
| 0 | Cleanup | Small — remove dead code |
| 1 | Framework upgrade | Medium — dependency updates |
| 2 | Convex setup | Medium — new backend |
| 3 | Auth migration | Medium — replace Clerk |
| 4 | Data migration | Large — replace all server actions |
| 5 | UI redesign | Large — every page redesigned |
| 6 | SEO | Medium — metadata + sitemap + RSS |
| 7 | Analytics | Medium — tracking + dashboard |
| 8 | Blog features | Large — comments, tags, search, etc. |
| 9 | Code quality | Medium — types, lint, cleanup |
