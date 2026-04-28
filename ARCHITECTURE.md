# Application Architecture

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Framework | Next.js 16.2 | SSR, routing, API routes |
| React | 19 | UI rendering |
| Styling | Tailwind CSS 4 + shadcn/ui | Utility CSS + component library |
| Database | Convex | Reactive database with real-time sync |
| Auth | Convex Auth | Email + password authentication |
| File Storage | Cloudflare R2 | S3-compatible object storage, 10GB free, zero egress |
| Editor | TipTap | Rich text editing |
| State | Convex hooks + TanStack Query | Data fetching and caching |
| Charts | Recharts | Analytics visualizations |
| Animation | Framer Motion | Page transitions, micro-interactions |

---

## Target Directory Structure

```
app/
  (auth)/
    sign-in/page.tsx                      # Custom sign-in (email+password)
    sign-up/page.tsx                      # Custom sign-up (email+password)
  api/
    blog/
      all/route.ts                        # GET all published blogs
      [slug]/route.ts                     # GET blog by slug
      slugs/route.ts                      # GET all slugs
  blog/
    page.tsx                              # Public blog listing
    [slug]/page.tsx                       # Public blog post (SEO-optimized)
  feed.xml/route.ts                       # RSS feed
  sitemap.ts                              # Dynamic sitemap
  robots.ts                               # Robots.txt
  cms/
    page.tsx                              # Dashboard - article list
    layout.tsx                            # Dashboard layout (sidebar + content)
    (components)/
      DashboardSidebar.tsx                # Sidebar navigation
      DashboardNav.tsx                    # Mobile nav bar
      CreateDocument.tsx                  # Create document dialog
      DeleteDocument.tsx                  # Delete document dialog
      ArticleCard.tsx                     # Article card component
    documents/
      page.tsx                            # Document list
      [id]/page.tsx                       # Document editor (TipTap)
    publish/page.tsx                      # Publish article form
    preview/
      [slug]/page.tsx                     # Article preview
      [slug]/edit/page.tsx                # Article editor
    author/page.tsx                       # Create/manage authors
    category/page.tsx                     # Create/manage categories
    comments/page.tsx                     # Comment moderation
    analytics/page.tsx                    # Analytics dashboard
    settings/page.tsx                     # User settings
    api/page.tsx                          # API documentation
  page.tsx                                # Landing page
  layout.tsx                              # Root layout
  provider.tsx                            # Convex + providers
  globals.css                             # CSS variables, Tailwind

components/
  ui/                                     # shadcn/ui components (24+ files)
    avatar.tsx
    badge.tsx
    button.tsx
    card.tsx
    dialog.tsx
    dropdown-menu.tsx
    form.tsx
    input.tsx
    label.tsx
    popover.tsx
    select.tsx
    separator.tsx
    sheet.tsx
    skeleton.tsx
    sonner.tsx
    tabs.tsx
    textarea.tsx
    tooltip.tsx
    ...
  LandingPage/
    HeroSection.tsx                       # Hero with CTA
    FeaturesSection.tsx                   # Feature cards grid
    CTASection.tsx                        # Bottom CTA
    Footer.tsx                            # Site footer
  Container/
    PageWrapper.tsx                       # Layout wrapper (navbar + footer)
  NavBar.tsx                              # Public navigation
  Profile.tsx                             # User profile dropdown
  ModeToggle.tsx                          # Light/dark toggle
  theme-provider.tsx                      # Theme provider
  Icons.tsx                               # SVG icons
  TiptapMenuBar.tsx                       # Shared TipTap toolbar

convex/
  schema.ts                               # Database schema (all tables)
  auth.ts                                 # Auth configuration
  auth.config.ts                          # Auth provider config
  documents.ts                            # Document mutations & queries
  blogs.ts                                # Blog mutations & queries
  authors.ts                              # Author mutations & queries
  categories.ts                           # Category mutations & queries
  comments.ts                             # Comment mutations & queries
  analytics.ts                            # Analytics mutations & queries
  storage.ts                              # File upload helpers
  http.ts                                 # HTTP routes for public API
  users.ts                                # User-related functions

lib/
  utils.ts                                # cn() utility function

public/
  home.png                                # Dashboard screenshot for landing page
```

---

## Convex Database Schema

```typescript
// convex/schema.ts
import { defineSchema, defineTable } from "convex/server";
import { authTables } from "@convex-dev/auth/server";
import { v } from "convex/values";

export default defineSchema({
  // Auth tables managed by @convex-dev/auth (includes users, sessions, accounts etc.)
  ...authTables,

  // Extended user profile (separate from the auth users table)
  userProfiles: defineTable({
    userId: v.id("users"),
    name: v.optional(v.string()),
    image: v.optional(v.string()),
    apiKey: v.optional(v.string()),
  })
    .index("by_user", ["userId"])
    .index("by_api_key", ["apiKey"]),

  // Draft documents (editor workspace)
  documents: defineTable({
    title: v.string(),
    document: v.string(),                // TipTap HTML content
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // Blog categories
  categories: defineTable({
    name: v.string(),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // Blog authors
  authors: defineTable({
    name: v.string(),
    profileImg: v.optional(v.string()),   // R2 public URL
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    userId: v.id("users"),
  }).index("by_user", ["userId"]),

  // Published blog articles
  blogs: defineTable({
    title: v.string(),
    subtitle: v.optional(v.string()),
    slug: v.string(),
    blogHtml: v.string(),                 // TipTap HTML
    sourceDocumentId: v.optional(v.id("documents")),
    image: v.optional(v.string()),        // R2 public URL
    imageAlt: v.optional(v.string()),
    metaDescription: v.optional(v.string()),
    categoryId: v.optional(v.id("categories")),
    authorId: v.optional(v.id("authors")),
    keywords: v.optional(v.array(v.string())),
    published: v.boolean(),
    shareable: v.boolean(),
    viewCount: v.float64(),
    readingTime: v.optional(v.float64()),
    userId: v.id("users"),
  })
    .index("by_user", ["userId"])
    .index("by_slug", ["slug"])
    .index("by_user_and_slug", ["userId", "slug"])
    .index("by_published", ["published"]),

  // Comments on published articles
  comments: defineTable({
    blogId: v.id("blogs"),
    authorName: v.string(),
    authorEmail: v.string(),
    content: v.string(),
    approved: v.boolean(),
  }).index("by_blog", ["blogId"]),

  // Page view tracking
  pageViews: defineTable({
    blogId: v.id("blogs"),
    timestamp: v.float64(),
  }).index("by_blog", ["blogId"]),
});
```

---

## Data Flow

### Writing & Publishing Flow
```
1. User opens /cms/documents/[id]
2. TipTap editor loads document content from Convex
3. User writes content
4. Auto-save fires every 30s -> Convex mutation: documents.store
5. User clicks "Save" -> Convex mutation: documents.store
6. User opens /cms/publish
7. User fills form: title, subtitle, slug, image, author, category, document
8. User clicks "Publish" -> Convex mutation: blogs.create
9. Blog entry created with published=true
10. Article appears in /cms dashboard
```

### Public Reading Flow
```
1. Visitor hits /blog/[slug]
2. Convex query: blogs.getBySlug(slug)
3. If not found or not published -> 404
4. Convex mutation: analytics.trackView (fire-and-forget, non-blocking)
5. Page renders with:
   - SEO metadata from generateMetadata()
   - Article content from blog.content
   - Author info from author table
   - Reading time from blog.readingTimeMinutes
   - View count from blog.viewCount
   - Related articles from blogs table (matching tags/category)
   - Comments from comments table (approved only)
6. Table of contents generated client-side from h2/h3 headings
```

### API Consumption Flow
```
1. External client sends: GET /api/blog/all
   Header: X-Api-Key: <user_clerk_id_or_api_key>
2. HTTP action validates API key
3. Convex query: blogs.getAllPublished(userId)
4. Returns JSON array of published blogs
5. Same pattern for /api/blog/slugs and /api/blog/[slug]
```

---

## Authentication Flow

### Sign Up
```
1. User fills sign-up form (name, email, password)
2. Convex Auth creates account
3. User entry created in Convex users table
4. Session created
5. Redirect to /cms
```

### Sign In
```
1. User fills sign-in form (email, password)
2. Convex Auth validates credentials
3. Session created
4. Redirect to /cms
```

### Route Protection
```
1. Request to /cms/*
2. Middleware checks Convex Auth session
3. No session -> redirect to /sign-in
4. Session exists -> allow access
5. All Convex functions also check ctx.auth.getUserIdentity()
   - No identity -> throw "Not authenticated"
   - Identity found -> proceed with userId
```

### Sign Out
```
1. User clicks "Log out" in profile dropdown
2. Convex Auth signs out
3. Session cleared
4. Redirect to /sign-in
```

---

## R2 Upload Flow

### Upload Process (Cover Images, Author Images)
```
1. User clicks "Upload Image" (publish form or author form)
2. File picker opens
3. Client sends POST to /api/upload with { fileName, fileType }
4. Server generates presigned PUT URL using R2 credentials
5. Server returns { signedUrl, publicUrl } to client
6. Client uploads file directly to R2 using presigned URL
7. publicUrl stored in Convex database (blog.image or author.profileImage)
```

### Editor Image Handling (Hybrid Approach)
```
Upload Button: File -> Presigned URL -> R2 -> Public URL -> <img src="r2Url">
URL Paste: External URL -> stored as-is -> <img src="externalUrl">
Cover/Author images: Always uploaded to R2 (no URL paste option)
```

### Serving Files
```
1. Component renders <Image src={publicUrl} />
2. publicUrl format: https://pub-xxx.r2.dev/uploads/{timestamp}-{filename}
3. R2 serves the file directly (public bucket, no signing needed)
4. next.config.js allows the R2 domain via images.remotePatterns
```

---

## Environment Variables

### Required (Target)
```
# Convex
CONVEX_DEPLOYMENT=dev:your-deployment-name
NEXT_PUBLIC_CONVEX_URL=https://your-app.convex.cloud

# Cloudflare R2
R2_ACCOUNT_ID=your_cloudflare_account_id
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_BUCKET_NAME=your_bucket_name
NEXT_PUBLIC_R2_PUBLIC_URL=https://pub-xxx.r2.dev
```

### Removed (No Longer Needed)
```
# These are all removed:
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
# CLERK_SECRET_KEY
# NEXT_PUBLIC_CLERK_SIGN_IN_URL
# NEXT_PUBLIC_CLERK_SIGN_UP_URL
# NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL
# NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL
# WEBHOOK_SECRET / CLERK_WEBHOOK_SECRET
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# DATABASE_URL
# DIRECT_URL
```

---

## Files to Delete

| File/Directory | Reason |
|---|---|
| `prisma/` | Dead code, never queried |
| `app/api/auth/webhook/` | Clerk webhook, no longer needed |
| `app/api/uploadthing/` | Replaced by R2 + custom upload API |
| `utils/actions/` (entire directory) | Replaced by Convex functions |
| `utils/hooks/` (entire directory) | Replaced by Convex hooks |
| `utils/cn.ts` | Duplicate of `lib/utils.ts` |
| `utils/theme-provider.tsx` | Duplicate of `components/theme-provider.tsx` |
| `utils/uploadthing.ts` | UploadThing dependency removed |
| `utils/transform-node.tsx` | Will be rewritten for new styling |
| `app/(auth)/sign-in/` | Clerk catch-all, replaced by custom page |
| `app/(auth)/sign-up/` | Clerk catch-all, replaced by custom page |
| `app/(auth)/user-profile/` | Clerk UI, replaced by settings page |

## Files to Create

| File/Directory | Purpose |
|---|---|
| `convex/schema.ts` | Database schema |
| `convex/auth.ts` | Auth configuration |
| `convex/auth.config.ts` | Auth provider config |
| `convex/documents.ts` | Document CRUD functions |
| `convex/blogs.ts` | Blog CRUD functions |
| `convex/authors.ts` | Author CRUD functions |
| `convex/categories.ts` | Category CRUD functions |
| `convex/comments.ts` | Comment functions |
| `convex/analytics.ts` | Analytics functions |
| `convex/http.ts` | HTTP routes for public API |
| `convex/users.ts` | User-related functions |
| `app/(auth)/sign-in/page.tsx` | Custom sign-in page |
| `app/(auth)/sign-up/page.tsx` | Custom sign-up page |
| `app/blog/page.tsx` | Public blog listing |
| `app/blog/[slug]/page.tsx` | Public blog post |
| `app/feed.xml/route.ts` | RSS feed |
| `app/sitemap.ts` | Dynamic sitemap |
| `app/robots.ts` | Robots.txt |
| `app/cms/comments/page.tsx` | Comment moderation |
| `app/cms/analytics/page.tsx` | Analytics dashboard |
| `components/TiptapMenuBar.tsx` | Shared editor toolbar |
| `components/LandingPage/FeaturesSection.tsx` | Feature cards |
| `components/LandingPage/CTASection.tsx` | Bottom CTA |
| `lib/r2.ts` | R2 S3Client configuration |
| `app/api/upload/route.ts` | Presigned URL generation API |
| `components/UploadButton.tsx` | Custom upload component (replaces UploadThing) |

---

## Naming Conventions

### Files
- Components: `PascalCase.tsx` (e.g., `DashboardSidebar.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)
- Convex functions: `camelCase.ts` (e.g., `blogs.ts`)
- Pages: Always `page.tsx` or `layout.tsx`
- Styles: `kebab-case.scss` (e.g., `tiptap-editor.scss`)

### Functions
- Convex mutations: `camelCase` (e.g., `createDocument`)
- Convex queries: `camelCase` (e.g., `getAllArticles`)
- React components: `PascalCase` (e.g., `DashboardSidebar`)
- React hooks: `useCamelCase` (e.g., `useGetAllDocuments`)

### Variables
- Convex fields: `camelCase` (e.g., `userId`, `createdAt`)
- CSS variables: `kebab-case` with prefix (e.g., `--color-primary`)
- Environment variables: `SCREAMING_SNAKE_CASE` (e.g., `CONVEX_DEPLOYMENT`)
