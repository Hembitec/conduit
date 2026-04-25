# Phase 6: SEO Features & API Reconciliation Design

## Goal
Transform Conduit into a production-grade, SEO-optimized blog platform while reconciling the public API implementation with its documentation.

## Architecture

### 1. Routing & Migration
- **New Public Route:** `/blog/[slug]` will be the primary entry point for articles.
- **Legacy Support:** `/article/public/[id]` will be maintained as a redirect layer. Using `next/navigation`'s `permanentRedirect`, we will map old ID-based links to the new slug-based links.
- **Search Engine Discovery:** Implement `sitemap.ts`, `robots.ts`, and `feed.xml` to automate discovery of published content.

### 2. SEO & Metadata
- **Metadata Generation:** Utilize Next.js `generateMetadata` for dynamic tags.
- **Fallback Logic:**
  1. `metaDescription` (User-provided)
  2. `subtitle` (Secondary)
  3. `blogHtml` (Truncated first 160 characters of text content)
- **Social Graph:** Standardize Open Graph (`og:`) and Twitter card tags using the article's cover image and title.

### 3. API Reconciliation (RESTful Transition)
- **Header Compatibility:** The API will accept both `X-Api-Key` and `X-Auth-Key` to prevent breaking existing integrations.
- **Endpoint Normalization:** Transition from query parameters to RESTful path segments (`/api/blog/[slug]`).
- **Documentation Update:** Sync `/cms/api` to accurately reflect the implementation.

---

## Technical Details

### Components & Routes

| Path | Purpose | Key Logic |
|---|---|---|
| `app/blog/[slug]/page.tsx` | New Public Article Page | `generateMetadata`, `fetchQuery(api.queries.readPublicArticle)` |
| `app/article/public/[id]/page.tsx` | Redirect Layer | Fetches slug by ID and issues `permanentRedirect` |
| `app/sitemap.ts` | Dynamic Sitemap | Queries `api.queries.getPublishedArticles` |
| `app/robots.ts` | Robots Config | Points to Sitemap |
| `app/feed.xml/route.ts` | RSS Feed | Generates XML feed from published articles |

### Data Flow (SEO Metadata)
1. `generateMetadata` receives `slug`.
2. Calls `api.queries.readPublicArticle`.
3. If not found, returns default metadata.
4. If found, computes description using the fallback chain.
5. Returns metadata object with `openGraph` and `twitter` properties.

### API Response Standardization
All `/api/blog/*` endpoints will return:
- `200 OK` on success.
- `401 Unauthorized` for missing/invalid keys.
- `404 Not Found` for missing articles.

---

## Success Criteria
- [ ] Navigating to `/blog/[slug]` renders the correct article with all meta tags present in the `<head>`.
- [ ] Navigating to `/article/public/[id]` results in a 301 redirect to the correct slug.
- [ ] `/sitemap.xml` returns a valid XML list of published articles only.
- [ ] `/api/blog/[slug]` works with both `X-Auth-Key` and `X-Api-Key`.
- [ ] API Documentation page correctly reflects the working endpoints.
