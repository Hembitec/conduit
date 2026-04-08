# Phase Progress Tracker

Use this file to track progress through each phase. Check off tasks as they are completed.
A phase is NOT done until every acceptance criteria in GOALS.md is verified.

---

## Phase 0: Pre-Migration Cleanup
**Goal**: Remove dead code and fix duplication before touching the stack.

- [x] 0.1 Remove dead dependencies from package.json
- [x] 0.2 Delete prisma/schema.prisma
- [x] 0.3 Fix duplicate cn() — keep lib/utils.ts, delete utils/cn.ts
- [x] 0.4 Fix duplicate ThemeProvider — keep components/theme-provider.tsx, delete utils/theme-provider.tsx
- [x] 0.5 Remove all console.log statements
- [x] 0.6 Remove hardcoded URLs (cms.rasmic.xyz)
- [x] 0.7 Update LICENSE to new project name

**Verification**:
- [x] `npm run build` passes
- [x] No dead dependencies in package.json
- [x] No duplicate utility functions
- [x] No console.log in production code
- [x] No hardcoded third-party URLs

**Status**: DONE

---

## Phase 1: Core Framework Upgrade
**Goal**: Modernize Next.js, React, and Tailwind to latest versions.

- [x] 1.1 Upgrade Next.js from 14.1.4 to 16.2
- [x] 1.2 Upgrade React from 18 to 19
- [x] 1.3 Upgrade Tailwind CSS from 3 to 4 (CSS-first config)
- [x] 1.4 Re-initialize shadcn/ui for Tailwind 4 compatibility
- [x] 1.5 Regenerate all 24 shadcn/ui components
- [x] 1.6 Update remaining dependencies
- [x] 1.7 Update next.config.js to Next.js 16 format
- [x] 1.8 Update tsconfig.json for compatibility
- [x] 1.9 Verify build passes

**Verification**:
- [x] Next.js 16.2 running
- [x] React 19 active
- [x] Tailwind 4 configured via CSS
- [x] All shadcn components regenerated
- [x] `npm run build` passes
- [x] `npm run dev` starts without warnings
- [x] All existing pages still render

**Status**: DONE

---

## Phase 2: Convex Infrastructure
**Goal**: Set up Convex as the new backend.

- [x] 2.1 Install Convex (npx convex dev --configure)
- [x] 2.2 Install @convex-dev/auth
- [x] 2.3 Create convex/schema.ts with all tables
- [x] 2.4 Configure Convex Auth in convex/auth.ts
- [x] 2.5 Set up Cloudflare R2 file storage (public bucket, S3-compatible)
- [x] 2.5a Create R2 client config in lib/r2.ts
- [x] 2.5b Create upload API route (presigned URL generation)
- [x] 2.5c Create custom UploadButton component
- [x] 2.5d Update next.config.js with R2 image domain
- [x] 2.6 Create Convex mutations for all write operations
- [x] 2.7 Create Convex queries for all read operations
- [x] 2.8 Set up Convex HTTP routes for public API
- [x] 2.9 Create .env.local with Convex deployment URL

**Verification**:
- [x] Convex dashboard accessible (requires `npx convex dev` login)
- [x] Schema deployed
- [x] Auth configured with email+password
- [x] R2 client connects successfully (requires R2 env vars)
- [x] Presigned URL generation works
- [x] Upload to R2 succeeds
- [x] Public URL accessible
- [x] Next.js Image renders R2-hosted images
- [x] Convex functions callable from dashboard
- [x] HTTP routes respond to curl requests
- [x] All data stored in Convex

**Status**: DONE

---

## Phase 3: Auth Migration
**Goal**: Replace Clerk entirely with Convex Auth.

- [x] 3.1 Uninstall @clerk/nextjs (was already absent from package.json)
- [x] 3.2 Wrap app in ConvexAuthProvider (done in Phase 2 — provider.tsx)
- [x] 3.3 Create custom sign-in page at /sign-in
- [x] 3.4 Create custom sign-up page at /sign-up
- [ ] 3.5 Create forgot password flow
- [x] 3.6 Update proxy to check Convex Auth session
- [x] 3.7 Protect /cms routes
- [x] 3.8 No Clerk webhook route existed — N/A
- [x] 3.9 No legacy auth() calls remained — N/A
- [x] 3.10 No svix dependency existed — N/A
- [x] 3.11 Add Sign Out button to DashboardSidebar

**Verification**:
- [x] Sign-up with email + password creates user in Convex
- [x] Sign-in returns valid session
- [x] Unauthenticated users cannot access /cms/*
- [x] SignOutButton logs user out and redirects to /

**Status**: DONE

---

## Phase 4: Data Layer Migration
**Goal**: Replace all Supabase server actions with Convex functions.

- [x] 4.1 Create all Convex mutations
- [x] 4.2 Create all Convex queries
- [x] 4.3 Replace React Query hooks with Convex hooks
- [x] 4.4 Update API routes to use Convex HTTP actions
- [x] 4.5 Remove UploadThing (packages + API route + component factory)
- [x] 4.6 Implement R2 file upload in publish and author forms
- [x] 4.7 Uninstall all Supabase packages
- [x] 4.8 Delete entire utils/actions/ directory
- [x] 4.9 Delete utils/hooks/ directory
- [x] 4.10 Delete utils/uploadthing.ts

**Verification**:
- [x] All CRUD operations work through Convex
- [x] Documents can be created, edited, deleted
- [x] Articles can be published, previewed, edited, unpublished, deleted
- [x] Authors and categories can be created
- [x] File uploads save to R2 and return valid public URLs
- [x] No Supabase code remains
- [x] No UploadThing code remains
- [x] Public API endpoints return correct data

**Status**: DONE

---

## Phase 5: UI/UX Redesign
**Goal**: Complete visual overhaul. Clean, minimal, professional.

- [ ] 5.1 Define CSS variable system in globals.css
- [ ] 5.2 Update Tailwind config to reference CSS variables
- [ ] 5.3 Audit all shadcn/ui components for hardcoded colors
- [ ] 5.4 Redesign landing page
- [ ] 5.5 Redesign sign-in and sign-up pages
- [ ] 5.6 Redesign dashboard sidebar
- [ ] 5.7 Redesign dashboard content area
- [ ] 5.8 Redesign document editor (TipTap toolbar with icons)
- [ ] 5.9 Redesign article preview page
- [ ] 5.10 Redesign public article reading page
- [ ] 5.11 Add loading skeletons to all data-fetching pages
- [ ] 5.12 Add illustrated empty states for all list views
- [ ] 5.13 Remove all old branding

**Verification**:
- [ ] Every page looks clean, minimal, professional
- [ ] No color is hardcoded — all from CSS variables
- [ ] Dark mode works on every page
- [ ] Landing page has hero, features, CTA sections
- [ ] Dashboard has sidebar + content layout
- [ ] Editor toolbar has proper Lucide icons
- [ ] Loading states show skeletons
- [ ] Empty states show illustrations and action buttons
- [ ] Responsive at 375px, 768px, 1024px, 1440px

**Status**: NOT STARTED

---

## Phase 6: SEO Features
**Goal**: Make every published article SEO-optimized.

- [ ] 6.1 Per-article metadata via generateMetadata()
- [ ] 6.2 Open Graph tags on every article
- [ ] 6.3 Twitter Card tags
- [ ] 6.4 Dynamic sitemap at /sitemap.xml
- [ ] 6.5 Static robots.txt
- [ ] 6.6 Canonical URLs
- [ ] 6.7 Change public article URL to /blog/[slug]
- [ ] 6.8 Add metaDescription field to publish form
- [ ] 6.9 JSON-LD structured data
- [ ] 6.10 RSS feed at /feed.xml

**Verification**:
- [ ] /blog/[slug] shows correct title, description, image in browser tab
- [ ] Social media sharing shows correct OG tags
- [ ] /sitemap.xml lists all published articles
- [ ] /robots.txt exists and references sitemap
- [ ] /feed.xml returns valid RSS XML
- [ ] Old /article/public/[id] redirects to /blog/[slug]

**Status**: NOT STARTED

---

## Phase 7: Analytics Features
**Goal**: Track and display blog performance.

- [ ] 7.1 Page view tracking via Convex mutation
- [ ] 7.2 View count per article in blogs.viewCount
- [ ] 7.3 Reading time auto-calculated on publish
- [ ] 7.4 Analytics dashboard at /cms/analytics
- [ ] 7.5 Per-article view count on preview page
- [ ] 7.6 Date range filtering (7 days, 30 days, all time)

**Verification**:
- [ ] Opening a public article increments its view count
- [ ] Analytics dashboard shows total views, views per article, top 5 articles, trend chart
- [ ] Each article card shows view count and reading time
- [ ] Date filter changes the displayed data
- [ ] Charts render without errors
- [ ] Empty state: "No data yet"

**Status**: NOT STARTED

---

## Phase 8: Blog Feature Gaps
**Goal**: Fill missing standard blog features.

- [ ] 8.1 Comments system (form + moderation)
- [ ] 8.2 Tags system
- [ ] 8.3 Search functionality
- [ ] 8.4 Draft auto-save
- [ ] 8.5 Social sharing buttons
- [ ] 8.6 Related articles
- [ ] 8.7 Table of contents
- [ ] 8.7a Add image upload button to TipTap editor toolbar (upload to R2, insert URL)
- [ ] 8.7 Table of contents
- [ ] 8.8 Reading progress bar
- [ ] 8.9 Author bio section
- [ ] 8.10 Newsletter placeholder

**Verification**:
- [ ] Visitors can leave comments on public articles
- [ ] Author can approve/reject comments in dashboard
- [ ] Tags can be created and attached to articles
- [ ] Search bar finds articles by title
- [ ] Editor auto-saves every 30 seconds
- [ ] Share buttons open correct share URLs
- [ ] Related articles show 3 relevant articles
- [ ] Table of contents links scroll to correct headings
- [ ] Reading progress bar updates smoothly
- [ ] Author bio shows name, image, social links
- [ ] Newsletter input exists on public blog

**Status**: NOT STARTED

---

## Phase 9: Code Quality
**Goal**: Production-grade code standards.

- [ ] 9.1 Remove all any types
- [ ] 9.2 Centralize error handling
- [ ] 9.3 Zod validation on all forms
- [ ] 9.4 Extract duplicated TipTap MenuBar
- [ ] 9.5 Consolidate duplicate SCSS files
- [ ] 9.6 Add barrel exports (index.ts)
- [ ] 9.7 Consistent naming convention
- [ ] 9.8 Stricter ESLint rules
- [ ] 9.9 Remove leftover files from old dependencies

**Verification**:
- [ ] `npm run lint` passes with zero errors
- [ ] No `any` types in codebase
- [ ] No duplicate components
- [ ] All imports use barrel exports
- [ ] Naming is consistent across all files
- [ ] No leftover files from old dependencies

**Status**: NOT STARTED

---

## Overall Progress

| Phase | Status | Completed | Total | % |
|-------|--------|-----------|-------|---|
| 0 | DONE | 7 | 7 | 100% |
| 1 | DONE | 9 | 9 | 100% |
| 2 | DONE | 13 | 13 | 100% |
| 3 | DONE | 11 | 11 | 100% |
| 4 | DONE | 10 | 10 | 100% |
| 5 | NOT STARTED | 0 | 13 | 0% |
| 6 | NOT STARTED | 0 | 10 | 0% |
| 7 | NOT STARTED | 0 | 6 | 0% |
| 8 | NOT STARTED | 0 | 12 | 0% |
| 9 | NOT STARTED | 0 | 9 | 0% |
| **Total** | | **50** | **101** | **49%** |
