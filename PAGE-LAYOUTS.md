# Page Layouts & Wireframes

Every page in the application. Each includes ASCII wireframe, component breakdown, and acceptance criteria.

---

## 1. Landing Page (`/`)

### Purpose
Introduce the product. Show value proposition. Drive sign-ups.

### Wireframe
```
+---------------------------------------------------------------+
|  [Logo]                              [Sign In] [Get Started]   |
|---------------------------------------------------------------|
|                                                               |
|                    Write. Publish. Grow.                      |
|                                                               |
|          A minimal blog CMS for focused writers.              |
|          No complexity. No bloat. Just your words.            |
|                                                               |
|                    [Get Started Free ->]                      |
|                                                               |
|          +---------------------------------+                 |
|          |                                 |                 |
|          |    Dashboard Screenshot         |                 |
|          |    (with border-beam effect)    |                 |
|          |                                 |                 |
|          +---------------------------------+                 |
|                                                               |
|---------------------------------------------------------------|
|                                                               |
|              Everything you need, nothing you don't           |
|                                                               |
|   +----------+  +----------+  +----------+  +----------+     |
|   | [Icon]   |  | [Icon]   |  | [Icon]   |  | [Icon]   |     |
|   | Rich     |  | SEO      |  | Analyt-  |  | Fast     |     |
|   | Editor   |  | Ready    |  | ics      |  | API      |     |
|   |          |  |          |  |          |  |          |     |
|   | Write    |  | Meta     |  | Track    |  | Serve    |     |
|   | with     |  | tags,    |  | views,   |  | blog via |     |
|   | TipTap   |  | sitemap, |  | reading  |  | REST     |     |
|   | editor   |  | OG tags  |  | time     |  | API      |     |
|   +----------+  +----------+  +----------+  +----------+     |
|                                                               |
|---------------------------------------------------------------|
|                                                               |
|                     Ready to start?                           |
|                                                               |
|                   [Get Started Free ->]                       |
|                                                               |
|---------------------------------------------------------------|
|  [Product Name]                                               |
|  A minimal blog CMS for focused writers.                      |
|                                                               |
|  Product          Company           Legal                     |
|  - Features       - About           - Privacy                 |
|  - Pricing        - Blog            - Terms                   |
|  - Docs           - Contact                                   |
|                                                               |
|  (c) 2026 [Product Name]. All rights reserved.                |
+---------------------------------------------------------------+
```

### Components
| Component | Source |
|-----------|--------|
| Navbar | Custom (not shadcn) |
| Hero Section | Custom with Framer Motion |
| Feature Cards | shadcn Card |
| CTA Section | Custom with shadcn Button |
| Footer | Custom |

### Acceptance Criteria
> Landing page loads in under 2 seconds. Hero text is readable. "Get Started" button navigates to sign-up. Feature cards are evenly spaced. Responsive: stacks to single column on mobile. Dark mode works. No hardcoded colors. No emoji icons. Dashboard screenshot has border-beam animation effect.

---

## 2. Sign-In Page (`/sign-in`)

### Purpose
Email + password authentication. Clean, minimal.

### Wireframe
```
+---------------------------------------------------------------+
|                                                               |
|                                                               |
|                      +--------------+                        |
|                      |   [Logo]     |                        |
|                      |              |                        |
|                      |  Sign in to  |                        |
|                      |  [Product]   |                        |
|                      |              |                        |
|                      |  Email       |                        |
|                      |  +------------------+                 |
|                      |  |                  |                 |
|                      |  +------------------+                 |
|                      |              |                        |
|                      |  Password    |                        |
|                      |  +------------------+                 |
|                      |  |          [eye]   |                 |
|                      |  +------------------+                 |
|                      |              |                        |
|                      |  [    Sign In    ]                    |
|                      |              |                        |
|                      |  Forgot password?                     |
|                      |              |                        |
|                      |  Don't have an account?               |
|                      |  Sign up                              |
|                      +--------------+                        |
|                                                               |
|                                                               |
+---------------------------------------------------------------+
```

### Components
| Component | Source |
|-----------|--------|
| Card | shadcn Card |
| Input | shadcn Input |
| Button | shadcn Button |
| Label | shadcn Label |
| Form | shadcn Form + react-hook-form + Zod |

### Acceptance Criteria
> Form validates email format and password length. Error messages display inline. "Sign In" button shows loading state. Successful sign-in redirects to `/cms`. "Forgot password" links to password reset. "Sign up" links to `/sign-up`. No social login buttons present. Eye icon toggles password visibility.

---

## 3. Sign-Up Page (`/sign-up`)

### Purpose
Create new account with email, password, and name.

### Wireframe
```
+---------------------------------------------------------------+
|                                                               |
|                      +--------------+                        |
|                      |   [Logo]     |                        |
|                      |              |                        |
|                      |  Create your |                        |
|                      |  account     |                        |
|                      |              |                        |
|                      |  Name        |                        |
|                      |  +------------------+                 |
|                      |  |                  |                 |
|                      |  +------------------+                 |
|                      |              |                        |
|                      |  Email       |                        |
|                      |  +------------------+                 |
|                      |  |                  |                 |
|                      |  +------------------+                 |
|                      |              |                        |
|                      |  Password    |                        |
|                      |  +------------------+                 |
|                      |  |          [eye]   |                 |
|                      |  +------------------+                 |
|                      |              |                        |
|                      |  Confirm Password                     |
|                      |  +------------------+                 |
|                      |  |          [eye]   |                 |
|                      |  +------------------+                 |
|                      |              |                        |
|                      |  [  Create Account  ]                |
|                      |              |                        |
|                      |  Already have an account?             |
|                      |  Sign in                              |
|                      +--------------+                        |
|                                                               |
+---------------------------------------------------------------+
```

### Acceptance Criteria
> All fields required. Password minimum 8 characters. Confirm password must match. Email validated for format. Success redirects to `/cms`. Error messages display inline. Password strength indicator optional but preferred.

---

## 4. Dashboard — Article List (`/cms`)

### Purpose
Main dashboard. Shows all articles with status, category, date.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| [Logo]   |  [Search...]                    [+ New Article]     |
|          |                                                    |
|----------|  Articles                                        |
|          |  Manage your published and draft articles         |
|          |                                                    |
| Home     |  +-------------+ +-------------+ +-----------+    |
|          |  | [Image]     | | [Image]     | | [Image]   |    |
| Documents|  |             | |             | |           |    |
|          |  | Title       | | Title       | | Title     |    |
| Publish  |  | Subtitle    | | Subtitle    | | Subtitle  |    |
|          |  | [Category]  | | [Category]  | | [Category]|    |
| Authors  |  | Jan 15 2026 | | Jan 10 2026 | | Jan 5     |    |
|          |  | [Published] | | [Draft]     | | [Published|    |
| Categories| | 142 views   | |             | |  89 views |    |
|          |  +-------------+ +-------------+ +-----------+    |
| Comments |                                                    |
|          |  +-------------+ +-------------+                  |
| Analytics|  | [Image]     | | [Image]     |                  |
|          |  | Title       | | Title       |                  |
| API Docs |  | Subtitle    | | Subtitle    |                  |
|          |  | [Category]  | | [Category]  |                  |
| Settings |  | Dec 28 2025 | | Dec 20 2025 |                  |
|          |  | [Draft]     | | [Published] |                  |
|          |  | 23 views    | | 312 views   |                  |
|          |  +-------------+ +-------------+                  |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Components
| Component | Source |
|-----------|--------|
| Sidebar | shadcn Sidebar + SidebarProvider |
| Search | shadcn Input with Search icon |
| Article Cards | shadcn Card |
| Badge | shadcn Badge (for category + status) |
| Button | shadcn Button |

### Sidebar Items
| Item | Icon | Route |
|------|------|-------|
| Home | Home | `/cms` |
| Documents | FileText | `/cms/documents` |
| Publish | PenLine | `/cms/publish` |
| Authors | UserPen | `/cms/author` |
| Categories | Tag | `/cms/category` |
| Comments | MessageSquare | `/cms/comments` |
| Analytics | BarChart3 | `/cms/analytics` |
| API Docs | Code | `/cms/api` |
| Settings | Settings | `/cms/settings` |

### Article Card Content
| Element | Data |
|---------|------|
| Top | Cover image (or placeholder) |
| Title | `blog.title` |
| Subtitle | `blog.subtitle` (truncated to 2 lines) |
| Bottom Left | Category badge |
| Bottom Right | Status badge (Published/Draft) |
| Footer | Date + view count |

### Acceptance Criteria
> Sidebar highlights active page. Article cards show image, title, subtitle, category, status, date, view count. "New Article" button goes to `/cms/publish`. Clicking a card goes to `/cms/preview/[slug]`. Search filters articles by title in real-time. Empty state shows illustration + "Create your first article" CTA. Responsive: sidebar collapses on mobile. Loading shows skeleton cards.

---

## 5. Document Editor (`/cms/documents/[id]`)

### Purpose
Write and edit document drafts using TipTap rich text editor.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  [< Back to Documents]        [Save] [Delete]      |
|          |                                                    |
|          |  +--------------------------------------------+   |
|          |  |  Document Title                            |   |
|          |  |  (editable, large text)                    |   |
|          |  +--------------------------------------------+   |
|          |  |  B  I  S  <>  [link] [img] | H1  H2  H3   |   |
|          |  |  bullet  numbered  "  ---  undo  redo      |   |
|          |  +--------------------------------------------+   |
|          |  |                                            |   |
|          |  |  (TipTap editor area)                      |   |
|          |  |                                            |   |
|          |  |  Start writing your content here...        |   |
|          |  |                                            |   |
|          |  |  [Bubble menu on text selection:           |   |
|          |  |   Bold | Italic | Strike | Link]           |   |
|          |  |                                            |   |
|          |  |                                            |   |
|          |  +--------------------------------------------+   |
|          |                                                    |
|          |  Auto-saved at 2:34 PM                            |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Toolbar Icons (Lucide)
| Action | Icon |
|--------|------|
| Bold | Bold |
| Italic | Italic |
| Strikethrough | Strikethrough |
| Code | Code |
| Link | Link |
| Image | ImageIcon |
| Heading 1 | Heading1 |
| Heading 2 | Heading2 |
| Heading 3 | Heading3 |
| Bullet List | List |
| Ordered List | ListOrdered |
| Code Block | FileCode |
| Blockquote | Quote |
| Horizontal Rule | Minus |
| Undo | Undo |
| Redo | Redo |

### Acceptance Criteria
> Toolbar buttons have Lucide icons (not text). Bold/italic/strikethrough toggle correctly. Headings render with proper size. Links open prompt for URL. Images open prompt for URL. Bubble menu appears on text selection. Content auto-saves every 30 seconds. Save button stores document. Delete button shows confirmation dialog. Back button returns to documents list.

---

## 6. Document List (`/cms/documents`)

### Purpose
List all draft documents. Click to open editor.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  [+ Create Document]                              |
|          |                                                    |
|          |  My Documents                                     |
|          |  Your drafts and work in progress                 |
|          |                                                    |
|          |  +----------------------------------------------+  |
|          |  | [icon]  My First Blog Post                   |  |
|          |  |         Jan 15, 2026 at 2:30 PM              |  |
|          |  +----------------------------------------------+  |
|          |  | [icon]  Product Launch Draft                  |  |
|          |  |         Jan 12, 2026 at 10:15 AM             |  |
|          |  +----------------------------------------------+  |
|          |  | [icon]  Tutorial Ideas                        |  |
|          |  |         Jan 8, 2026 at 4:45 PM               |  |
|          |  +----------------------------------------------+  |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Acceptance Criteria
> Documents listed with title and last modified date. Click opens editor. "Create Document" opens dialog for title input. Empty state shows "No documents yet" with create CTA. Documents sorted by most recently updated.

---

## 7. Publish Article (`/cms/publish`)

### Purpose
Convert a document into a published blog article with metadata.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  Publish                                          |
|          |  Turn your documents into published articles      |
|          |                                                    |
|          |  +-------------------------------------------+    |
|          |  |                                            |    |
|          |  |  Title                                    |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  |                                      | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |                                            |    |
|          |  |  Subtitle                                 |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  |                                      | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |                                            |    |
|          |  |  Slug              Keywords               |    |
|          |  |  +--------------+  +------------------+   |    |
|          |  |  |              |  | Pizza, Chicken   |   |    |
|          |  |  +--------------+  +------------------+   |    |
|          |  |                                            |    |
|          |  |  Cover Image                              |    |
|          |  |  [Upload Image]                           |    |
|          |  |                                            |    |
|          |  |  Image Alt Text                            |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  |                                      | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |                                            |    |
|          |  |  Meta Description (SEO)                   |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  |                                      | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  0/160 characters                         |    |
|          |  |                                            |    |
|          |  |  Author              Category              |    |
|          |  |  +--------------+  +------------------+   |    |
|          |  |  | Select v    |  | Select v         |   |    |
|          |  |  +--------------+  +------------------+   |    |
|          |  |                                            |    |
|          |  |  Document                                  |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  | Select v                             | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |                                            |    |
|          |  |  [  Publish Article  ]                    |    |
|          |  |                                            |    |
|          |  +-------------------------------------------+    |
|          |                                                    |
+----------+----------------------------------------------------+
```

### New Fields (vs current)
| Field | Purpose |
|-------|---------|
| Meta Description | SEO meta description, max 160 chars, with counter |
| Image Alt Text | Accessibility for cover image |

### Acceptance Criteria
> All fields validated with Zod. Slug auto-generated from title (editable). Keywords comma-separated. Image upload via Convex storage. Meta description shows character count (0/160). Author and Category select from existing entries. Document select shows saved documents. Publish creates blog entry and shows success toast. Form resets after publish. If no authors/categories exist, show "Create one first" link.

---

## 8. Article Preview (`/cms/preview/[slug]`)

### Purpose
Preview a published article as it appears to readers. Manage publish status.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  [Edit] [Share] [Publish/Unpublish] [Delete]      |
|          |                                                    |
|          |  Published on January 15, 2026                    |
|          |                                                    |
|          |  Article Title Goes Here                          |
|          |                                                    |
|          |  +------+                                          |
|          |  |Avatar|  Author Name                            |  |
|          |  +------+  @username                              |  |
|          |                                                    |
|          |  +--------------------------------------------+   |
|          |  |                                            |   |
|          |  |           Cover Image                     |   |
|          |  |                                            |   |
|          |  +--------------------------------------------+   |
|          |                                                    |
|          |  Article content rendered from HTML...            |
|          |                                                    |
|          |  Subheading                                       |
|          |  ---------------                                  |
|          |  More content here with proper typography.        |
|          |  Links are styled. Lists work correctly.          |
|          |                                                    |
|          |  ------------------------------------------------  |
|          |  +------+                                          |
|          |  |Avatar|  Author Name                            |  |
|          |  +------+  Bio text about the author              |  |
|          |            [Twitter] [Instagram]                  |  |
|          |                                                    |
|          |  ------------------------------------------------  |
|          |                                                    |
|          |  Reading time: 5 min     Views: 142               |
|          |                                                    |
|          |  Related Articles                                 |
|          |  +--------+ +--------+ +--------+                 |
|          |  | Img    | | Img    | | Img    |                 |
|          |  | Title  | | Title  | | Title  |                 |
|          |  +--------+ +--------+ +--------+                 |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Action Buttons
| Button | Action |
|--------|--------|
| Edit | Opens TipTap editor at `/cms/preview/[slug]/edit` |
| Share | Opens popover with public URL + copy button |
| Publish/Unpublish | Toggles `published` status with confirmation |
| Delete | Deletes article with confirmation dialog |

### Acceptance Criteria
> Article renders with correct typography. Author info shows name, image, social links. Cover image displays correctly. Reading time and view count shown. Related articles show 3 articles with matching tags. Edit navigates to editor. Share shows copyable URL. Publish/Unpublish toggles with confirmation. Delete shows confirmation and redirects to `/cms`.

---

## 9. Article Editor (`/cms/preview/[slug]/edit`)

### Purpose
Edit an already published article's content.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  [< Preview]                       [Update]        |
|          |                                                    |
|          |  +--------------------------------------------+   |
|          |  |  Article Title                            |   |
|          |  |  (read-only, shown for reference)         |   |
|          |  +--------------------------------------------+   |
|          |  |  B  I  S  <>  [link] [img] | H1  H2  H3   |   |
|          |  |  bullet  numbered  "  ---  undo  redo      |   |
|          |  +--------------------------------------------+   |
|          |  |                                            |   |
|          |  |  (TipTap editor loaded with article       |   |
|          |  |   content — same toolbar as documents)    |   |
|          |  |                                            |   |
|          |  |                                            |   |
|          |  +--------------------------------------------+   |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Acceptance Criteria
> Editor loads with current article content. Same toolbar as document editor. "Update" saves changes to blog. "Preview" returns to preview page. Bubble menu works. All formatting options functional.

---

## 10. Create Author (`/cms/author`)

### Purpose
Create author profiles for blog attribution.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  Create an Author                                 |
|          |  Create an author to add to your articles         |
|          |                                                    |
|          |  +-------------------------------------------+    |
|          |  |                                            |    |
|          |  |  Name                                     |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  |                                      | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |                                            |    |
|          |  |  Instagram Username                       |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  | @                                    | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |                                            |    |
|          |  |  Twitter Username                         |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  | @                                    | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |                                            |    |
|          |  |  Profile Image                            |    |
|          |  |  [Upload Image]                           |    |
|          |  |                                            |    |
|          |  |  [  Create Author  ]                      |    |
|          |  |                                            |    |
|          |  +-------------------------------------------+    |
|          |                                                    |
|          |  Existing Authors                                 |
|          |  +-------------------------------------------+    |
|          |  | +------+  John Doe                        |    |
|          |  | |Avatar|  @johndoe                        |    |
|          |  | +------+  Created Jan 10, 2026            |    |
|          |  +-------------------------------------------+    |
|          |  | +------+  Jane Smith                     |    |
|          |  | |Avatar|  @janesmith                     |    |
|          |  | +------+  Created Jan 5, 2026             |    |
|          |  +-------------------------------------------+    |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Acceptance Criteria
> Name required. Social handles optional. Image upload optional. "Create Author" saves to Convex. Success toast shown. Existing authors listed below with avatar, name, handle. Form resets after creation.

---

## 11. Create Category (`/cms/category`)

### Purpose
Create categories for organizing blog posts.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  Create a Category                                |
|          |  Categories help organize your blogs              |
|          |                                                    |
|          |  +-------------------------------------------+    |
|          |  |  Category Name                            |    |
|          |  |  +--------------------------------------+ |    |
|          |  |  |                                      | |    |
|          |  |  +--------------------------------------+ |    |
|          |  |                                            |    |
|          |  |  [  Create Category  ]                    |    |
|          |  +-------------------------------------------+    |
|          |                                                    |
|          |  Existing Categories                              |
|          |  +----------+ +----------+ +----------+          |
|          |  | Tech     | | Design   | | Tutorial |          |
|          |  +----------+ +----------+ +----------+          |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Acceptance Criteria
> Category name required. Duplicates prevented. Saves to Convex. Badge-style display of existing categories. Form resets after creation.

---

## 12. Comments Moderation (`/cms/comments`)

### Purpose
Review and approve/reject comments on published articles.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  Comments                                         |
|          |  Moderate comments on your articles               |
|          |                                                    |
|          |  [All (12)] [Pending (5)] [Approved (7)]          |
|          |                                                    |
|          |  +----------------------------------------------+  |
|          |  |  John Doe                                   |  |
|          |  |  john@example.com                           |  |
|          |  |  On: "How to Build a Blog with Next.js"     |  |
|          |  |                                              |  |
|          |  |  Great article! Really helped me understand  |  |
|          |  |  the server components pattern. Thanks!      |  |
|          |  |                                              |  |
|          |  |  Jan 15, 2026 at 3:42 PM                    |  |
|          |  |  [Approve] [Reject] [Delete]                |  |
|          |  +----------------------------------------------+  |
|          |  |  Jane Smith                                 |  |
|          |  |  jane@example.com                           |  |
|          |  |  On: "Understanding Convex Database"         |  |
|          |  |                                              |  |
|          |  |  This is exactly what I was looking for.     |  |
|          |  |  The real-time sync feature is amazing.      |  |
|          |  |                                              |  |
|          |  |  Jan 14, 2026 at 11:20 AM                   |  |
|          |  |  [Approved] [Revoke] [Delete]               |  |
|          |  +----------------------------------------------+  |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Tab Behavior
| Tab | Shows |
|-----|-------|
| All | All comments regardless of status |
| Pending | `approved: false` only |
| Approved | `approved: true` only |

### Acceptance Criteria
> Comments show author name, email, article title, content, timestamp. Pending comments show "Approve" and "Reject" buttons. Approved comments show "Revoke" button. All show "Delete" button. Actions update immediately (optimistic). Tab counts update after actions. Empty state per tab shows appropriate message.

---

## 13. Analytics Dashboard (`/cms/analytics`)

### Purpose
Show blog performance: views, top articles, trends.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  Analytics                                        |
|          |  Track your blog performance                      |
|          |                                                    |
|          |  [7 Days] [30 Days] [All Time]                    |
|          |                                                    |
|          |  +----------+ +----------+ +----------+ +------+  |
|          |  | Total    | | Articles | | Avg      | | Top  |  |
|          |  | Views    | | Published| | Per Post | | Day  |  |
|          |  |          | |          | |          | |      |  |
|          |  |  2,847   | |    12    | |   237    | | 156  |  |
|          |  | up 12%   | |          | | up 8%    | | Jan  |  |
|          |  +----------+ +----------+ +----------+ +------+  |
|          |                                                    |
|          |  Views Over Time                                  |
|          |  +--------------------------------------------+   |
|          |  |    _--_                                     |   |
|          |  |   /    \  __                                |   |
|          |  |  /      \/  \__  __                         |   |
|          |  | /             \/  \                         |   |
|          |  |/                  \__                      |   |
|          |  | Jan 1  Jan 8  Jan 15  Jan 22  Jan 29      |   |
|          |  +--------------------------------------------+   |
|          |                                                    |
|          |  Top Articles                 Reading Time        |
|          |  +---------------------+     +--------------+    |
|          |  | 1. How to Build...  |     | Avg: 5 min   |    |
|          |  |    542 views        |     | Min: 2 min   |    |
|          |  | 2. Understanding..  |     | Max: 12 min  |    |
|          |  |    389 views        |     +--------------+    |
|          |  | 3. Getting Start..  |                         |
|          |  |    312 views        |     Traffic Sources     |
|          |  | 4. Advanced Tip..   |     +--------------+    |
|          |  |    287 views        |     | Direct  45%  |    |
|          |  | 5. SEO Best Pra..   |     | Google  30%  |    |
|          |  |    201 views        |     | Twitter 15%  |    |
|          |  +---------------------+     | Other   10%  |    |
|          |                              +--------------+    |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Stat Cards
| Card | Data | Calculation |
|------|------|-------------|
| Total Views | Sum of pageViews in range | `SUM(pageViews WHERE timestamp > rangeStart)` |
| Articles Published | Count of published blogs | `COUNT(blogs WHERE published = true)` |
| Avg Per Post | Total views / published articles | Division |
| Top Day | Day with most views | `MAX(DAILY(pageViews))` |

### Charts
| Chart | Type | Library | Data |
|-------|------|---------|------|
| Views Over Time | Area/Line chart | Recharts | Daily page view counts |
| Top Articles | Ranked list | Custom | Top 5 by view count |
| Reading Time | Stat display | Custom | Avg/min/max |
| Traffic Sources | Horizontal bar | Custom | Referrer aggregation |

### Acceptance Criteria
> Stat cards show correct numbers. "7 Days" filter shows last 7 days of data. "30 Days" shows last 30. "All Time" shows everything. Trend chart renders without errors. Top 5 articles ranked correctly. Reading time stats accurate. Date filter changes all displayed data. Charts are responsive on mobile. Empty state: "No data yet — publish your first article to see analytics."

---

## 14. Settings (`/cms/settings`)

### Purpose
View user profile and API key.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  Settings                                         |
|          |                                                    |
|          |  +-------------------------------------------+    |
|          |  |                                            |    |
|          |  |  Profile                                  |    |
|          |  |  ---------------------                    |    |
|          |  |                                            |    |
|          |  |  Name         Email                       |    |
|          |  |  +----------+ +------------------------+ |    |
|          |  |  | John     | | john@example.com       | |    |
|          |  |  +----------+ +------------------------+ |    |
|          |  |                                            |    |
|          |  |  ---------------------                    |    |
|          |  |                                            |    |
|          |  |  API Key                                   |    |
|          |  |  Use this key to access the API            |    |
|          |  |                                            |    |
|          |  |  +--------------------------+ [Copy]      |    |
|          |  |  | ••••••••••••••••••••••  |              |    |
|          |  |  +--------------------------+              |    |
|          |  |  [Show] [Regenerate]                       |    |
|          |  |                                            |    |
|          |  +-------------------------------------------+    |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Acceptance Criteria
> Name and email displayed from Convex user record. API key is a proper generated key (NOT the user ID). Show/hide toggle works. Copy button copies to clipboard. Regenerate button creates new key with confirmation. Fields are read-only (no editing profile here).

---

## 15. API Documentation (`/cms/api`)

### Purpose
Show users how to consume the blog API.

### Wireframe
```
+----------+----------------------------------------------------+
|          |                                                    |
| Sidebar  |  API Routes                                       |
|          |  Use these endpoints to fetch your blog data      |
|          |                                                    |
|          |  Authentication                                   |
|          |  All requests require an API key header:          |
|          |  +----------------------------------------------+  |
|          |  | X-Api-Key: your_api_key_here                 |  |
|          |  +----------------------------------------------+  |
|          |                                                    |
|          |  ---------------------------------------------     |
|          |                                                    |
|          |  GET — Retrieve All Published Blogs               |
|          |  +----------------------------------------------+  |
|          |  | GET /api/blog/all                            |  |
|          |  |                                              |  |
|          |  | curl -H "X-Api-Key: YOUR_KEY" \             |  |
|          |  |   https://yourdomain.com/api/blog/all        |  |
|          |  +----------------------------------------------+  |
|          |                                                    |
|          |  GET — Retrieve All Slugs                         |
|          |  +----------------------------------------------+  |
|          |  | GET /api/blog/slugs                          |  |
|          |  |                                              |  |
|          |  | curl -H "X-Api-Key: YOUR_KEY" \             |  |
|          |  |   https://yourdomain.com/api/blog/slugs      |  |
|          |  +----------------------------------------------+  |
|          |                                                    |
|          |  GET — Retrieve Article By Slug                   |
|          |  +----------------------------------------------+  |
|          |  | GET /api/blog/[slug]                         |  |
|          |  |                                              |  |
|          |  | curl -H "X-Api-Key: YOUR_KEY" \             |  |
|          |  |   https://yourdomain.com/api/blog/my-slug    |  |
|          |  +----------------------------------------------+  |
|          |                                                    |
+----------+----------------------------------------------------+
```

### Acceptance Criteria
> Code examples are copyable. API key shown matches user's actual key. All 3 endpoints documented. Response format shown. Error codes documented. No hardcoded URLs.

---

## 16. Public Article Page (`/blog/[slug]`)

### Purpose
Public-facing article page. SEO-optimized. Reading-optimized.

### Wireframe
```
+---------------------------------------------------------------+
| [Logo]                                    [Sign In]           |
|---------------------------------------------------------------|
| [==========================---------------------------]        |
| (reading progress bar)                                        |
|                                                               |
|                    Published on Jan 15, 2026                  |
|                                                               |
|             How to Build a Blog with Next.js                  |
|                                                               |
|          A complete guide to building a modern blog           |
|          using Next.js, Convex, and TipTap editor.            |
|                                                               |
|                  +------+                                     |
|                  |Avatar|  Author Name                        |
|                  +------+  5 min read . 142 views             |
|                                                               |
|          +-----------------------------------------+          |
|          |                                         |          |
|          |           Cover Image                   |          |
|          |                                         |          |
|          +-----------------------------------------+          |
|                                                               |
|  +----------+                                                |
|  | On This  |  Introduction                                 |
|  | Page:    |  ---------------                               |
|  |          |  This is the first paragraph of the article.   |
|  | Intro    |  It introduces the topic and sets up what      |
|  | Setup    |  the reader will learn.                        |
|  | Code     |                                                |
|  | Deploy   |  Setting Up the Project                       |
|  | Done     |  ----------------------                        |
|  |          |  Here we walk through the setup process.       |
|  +----------+  Code examples are formatted properly.         |
|                                                               |
|                ```bash                                       |
|                npm create next-app@latest                    |
|                ```                                           |
|                                                               |
|                Deploying to Production                       |
|                -----------------------                       |
|                Final steps to get your blog live...          |
|                                                               |
|                Conclusion                                    |
|                ----------                                    |
|                Summary of what we covered.                   |
|                                                               |
|          ------------------------------------------------     |
|                                                               |
|          +------+                                             |
|          |Avatar|  Author Name                                |
|          +------+  Short bio about the author goes here.     |
|                    Writer, developer, and creator.           |
|                    [Twitter] [Instagram]                     |
|                                                               |
|          ------------------------------------------------     |
|                                                               |
|          Share this article                                  |
|          [Twitter] [LinkedIn] [Facebook] [Copy Link]         |
|                                                               |
|          ------------------------------------------------     |
|                                                               |
|          Related Articles                                    |
|          +------------+ +------------+ +------------+        |
|          | [Image]    | | [Image]    | | [Image]    |        |
|          | Title      | | Title      | | Title      |        |
|          | 5 min read | | 3 min read | | 8 min read |        |
|          +------------+ +------------+ +------------+        |
|                                                               |
|          ------------------------------------------------     |
|                                                               |
|          Comments (3)                                        |
|                                                               |
|          +-----------------------------------------+          |
|          |  Leave a Comment                        |          |
|          |                                         |          |
|          |  Name    Email                           |          |
|          |  +-----+ +------------------+            |          |
|          |  +-----+ +------------------+            |          |
|          |                                         |          |
|          |  Comment                                 |          |
|          |  +------------------------------------+  |          |
|          |  |                                    |  |          |
|          |  |                                    |  |          |
|          |  +------------------------------------+  |          |
|          |                                         |          |
|          |  [  Post Comment  ]                      |          |
|          +-----------------------------------------+          |
|                                                               |
|          +-----------------------------------------+          |
|          |  John Doe                               |          |
|          |  Jan 15, 2026 at 3:42 PM                |          |
|          |                                         |          |
|          |  Great article! Really helped me         |          |
|          |  understand the pattern. Thanks!         |          |
|          +-----------------------------------------+          |
|                                                               |
|---------------------------------------------------------------|
|  [Product Name]                                               |
|  (c) 2026 [Product Name]. All rights reserved.                |
+---------------------------------------------------------------+
```

### SEO (Head Tags)
```html
<title>Article Title -- Product Name</title>
<meta name="description" content="Meta description here">
<link rel="canonical" href="https://domain.com/blog/slug">
<meta property="og:title" content="Article Title">
<meta property="og:description" content="Meta description">
<meta property="og:image" content="Cover image URL">
<meta property="og:type" content="article">
<meta name="twitter:card" content="summary_large_image">
<script type="application/ld+json">
  { "@context": "https://schema.org", "@type": "Article", ... }
</script>
```

### Acceptance Criteria
> Page loads with correct SEO tags (verified via browser dev tools). Reading progress bar updates on scroll. Table of contents links scroll to correct headings. TOC highlights current section. Author bio shows at bottom. Share buttons open correct share URLs. Related articles show 3 relevant articles. Comment form validates name, email, and content. Comments display after submission (pending approval). Responsive: single column on mobile. Article content max-width 65ch. Images responsive. Code blocks styled. Dark mode works. Old `/article/public/[id]` redirects to `/blog/[slug]`.

---

## 17. Blog Listing Page (`/blog`)

### Purpose
Public listing of all published articles. Optional — may not be needed if blog is consumed via API.

### Wireframe
```
+---------------------------------------------------------------+
| [Logo]                                    [Sign In]           |
|---------------------------------------------------------------|
|                                                               |
|                      The Blog                                |
|          Thoughts on building, writing, and growing.         |
|                                                               |
|          [Search...]                                         |
|                                                               |
|          +-----------------------------------------+          |
|          |                                         |          |
|          |  [Image]    Article Title                |          |
|          |             Subtitle text here that      |          |
|          |             gives context.               |          |
|          |             Jan 15, 2026 . 5 min read    |          |
|          |                                         |          |
|          +-----------------------------------------+          |
|          |                                         |          |
|          |  [Image]    Another Article Title        |          |
|          |             Subtitle text here.          |          |
|          |             Jan 10, 2026 . 3 min read    |          |
|          |                                         |          |
|          +-----------------------------------------+          |
|          |                                         |          |
|          |  [Image]    Third Article Title          |          |
|          |             Subtitle text here.          |          |
|          |             Jan 5, 2026 . 8 min read     |          |
|          |                                         |          |
|          +-----------------------------------------+          |
|                                                               |
|          [Load More]                                         |
|                                                               |
|---------------------------------------------------------------|
|  Footer                                                       |
+---------------------------------------------------------------+
```

### Acceptance Criteria
> Lists all published articles sorted by date descending. Each shows image, title, subtitle, date, reading time. Search filters by title. Click navigates to `/blog/[slug]`. "Load More" paginates. Empty state: "No articles yet."

---

## Page Summary

| # | Page | Route | Phase |
|---|------|-------|-------|
| 1 | Landing | `/` | 5 |
| 2 | Sign In | `/sign-in` | 3 |
| 3 | Sign Up | `/sign-up` | 3 |
| 4 | Dashboard | `/cms` | 5 |
| 5 | Document Editor | `/cms/documents/[id]` | 5 |
| 6 | Document List | `/cms/documents` | 5 |
| 7 | Publish | `/cms/publish` | 5 |
| 8 | Article Preview | `/cms/preview/[slug]` | 5 |
| 9 | Article Editor | `/cms/preview/[slug]/edit` | 5 |
| 10 | Create Author | `/cms/author` | 5 |
| 11 | Create Category | `/cms/category` | 5 |
| 12 | Comments | `/cms/comments` | 8 |
| 13 | Analytics | `/cms/analytics` | 7 |
| 14 | Settings | `/cms/settings` | 5 |
| 15 | API Docs | `/cms/api` | 5 |
| 16 | Public Article | `/blog/[slug]` | 6 |
| 17 | Blog Listing | `/blog` | 6 |
