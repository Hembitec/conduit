"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Globe, FileJson, Link as LinkIcon, AlertTriangle, BookOpen, Mail, MessageSquarePlus, Upload, Download, ClipboardList } from "lucide-react"
import { toast } from "sonner"

interface ApiEndpointProps {
  method: "GET" | "POST"
  title: string
  description: string
  endpoint: string
  code: string
  response?: string
}

function ApiEndpoint({ method, title, description, endpoint, code, response }: ApiEndpointProps) {
  const [copiedEndpoint, setCopiedEndpoint] = useState(false)
  const [copiedCode, setCopiedCode] = useState(false)

  const copyToClipboard = async (text: string, type: "endpoint" | "code") => {
    await navigator.clipboard.writeText(text)
    if (type === "endpoint") {
      setCopiedEndpoint(true)
      setTimeout(() => setCopiedEndpoint(false), 2000)
    } else {
      setCopiedCode(true)
      setTimeout(() => setCopiedCode(false), 2000)
    }
    toast.success("Copied to clipboard")
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          <Badge variant={method === "GET" ? "default" : "secondary"}>
            {method}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <code className="flex-1 p-3 bg-muted rounded-md text-sm font-mono">
            {endpoint}
          </code>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => copyToClipboard(endpoint, "endpoint")}
          >
            {copiedEndpoint ? (
              <Check className="h-4 w-4 text-primary" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground mb-1">Request</p>
          <pre className="bg-muted p-4 rounded-md overflow-x-auto">
            <code className="text-sm font-mono">{code}</code>
          </pre>
        </div>

        {response && (
          <div>
            <p className="text-xs font-medium text-muted-foreground mb-1">Response</p>
            <pre className="bg-muted p-4 rounded-md overflow-x-auto">
              <code className="text-sm font-mono">{response}</code>
            </pre>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function SectionHeader({ title, icon: Icon, markdown }: { title: string; icon: any; markdown: string }) {
  const downloadMarkdown = () => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + ".md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast.success("Downloaded " + title + " docs");
  };

  return (
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {title}
      </h2>
      <Button variant="outline" size="sm" onClick={downloadMarkdown} className="h-8 gap-2">
        <Download className="h-4 w-4" />
        Download Section
      </Button>
    </div>
  );
}

const blogEndpointsMd = [
  "# Blog Endpoints",
  "",
  "Use these endpoints to display your blog content on external websites.",
  "",
  "## Get All Your Articles",
  "**Method:** `GET`",
  "**Endpoint:** `/api/blog/all`",
  "Returns all your published articles with author and category info.",
  "",
  "### Request Example",
  "```javascript",
  "const response = await fetch('https://your-domain.com/api/blog/all', {",
  "  headers: { 'X-Auth-Key': 'YOUR_API_KEY' }",
  "});",
  "const { data } = await response.json();",
  "```"
].join("\\n");

const singleArticleMd = [
  "# Single Article",
  "",
  "## Get Article by Slug",
  "**Method:** `GET`",
  "**Endpoint:** `/api/blog/[slug]`",
  "Returns a specific article from your blog by its slug.",
  "",
  "### Request Example",
  "```javascript",
  "const response = await fetch('https://your-domain.com/api/blog/my-article-slug', {",
  "  headers: { 'X-Auth-Key': 'YOUR_API_KEY' }",
  "});",
  "const { data } = await response.json();",
  "```"
].join("\\n");

const commentsMd = [
  "# Comments",
  "",
  "## Get Approved Comments",
  "**Method:** `GET`",
  "**Endpoint:** `/api/blog/[slug]/comments`",
  "Returns all approved (moderated) comments for a specific article. Requires API key.",
  "",
  "### Request Example",
  "```javascript",
  "const response = await fetch('https://your-domain.com/api/blog/my-article-slug/comments', {",
  "  headers: { 'X-Auth-Key': 'YOUR_API_KEY' }",
  "});",
  "const { data } = await response.json();",
  "```",
  "",
  "## Submit a Comment",
  "**Method:** `POST`",
  "**Endpoint:** `/api/blog/[slug]/comments`",
  "Submit a new comment on any published article. No API key needed.",
  "",
  "### Request Example",
  "```javascript",
  "const response = await fetch('https://your-domain.com/api/blog/my-article-slug/comments', {",
  "  method: 'POST',",
  "  headers: { 'Content-Type': 'application/json' },",
  "  body: JSON.stringify({",
  "    authorName: 'Jane Smith',",
  "    authorEmail: 'jane@example.com',",
  "    content: 'Great article!'",
  "  })",
  "});",
  "```"
].join("\\n");

const subscribersMd = [
  "# Subscribers",
  "",
  "## Add a Newsletter Subscriber",
  "**Method:** `POST`",
  "**Endpoint:** `/api/subscribers`",
  "Add a new email subscriber to your newsletter list.",
  "",
  "### Request Example",
  "```javascript",
  "const response = await fetch('https://your-domain.com/api/subscribers', {",
  "  method: 'POST',",
  "  headers: { ",
  "    'Content-Type': 'application/json',",
  "    'X-Auth-Key': 'YOUR_API_KEY'",
  "  },",
  "  body: JSON.stringify({ email: 'reader@example.com' })",
  "});",
  "```"
].join("\\n");

const feedbackMd = [
  "# Feedback API",
  "",
  "Collect bug reports, feature requests, and general feedback from any external app, product, or website.",
  "",
  "## Step 1 — Get a Screenshot Upload URL",
  "**Method:** `POST`",
  "**Endpoint:** `/api/upload`",
  "Request a presigned Cloudflare R2 upload URL for an image. Requires your API key.",
  "",
  "## Step 2 — Submit Feedback",
  "**Method:** `POST`",
  "**Endpoint:** `/api/feedback`",
  "Submit a bug report, feature request, or general message. Requires your API key.",
  "",
  "## Complete Working Example",
  "```javascript",
  "const CONDUIT_DOMAIN = 'https://your-domain.com';",
  "const CONDUIT_API_KEY = 'YOUR_API_KEY';",
  "",
  "async function uploadScreenshot(file) {",
  "  const res = await fetch(CONDUIT_DOMAIN + '/api/upload', {",
  "    method: 'POST',",
  "    headers: { 'Content-Type': 'application/json', 'X-Auth-Key': CONDUIT_API_KEY },",
  "    body: JSON.stringify({ filename: file.name, contentType: file.type })",
  "  });",
  "  const { presignedUrl, publicUrl } = await res.json();",
  "",
  "  await fetch(presignedUrl, { method: 'PUT', headers: { 'Content-Type': file.type }, body: file });",
  "  return publicUrl;",
  "}",
  "",
  "async function submitFeedback({ type, message, name, email, pageUrl, files }) {",
  "  const screenshots = files?.length ? await Promise.all([...files].slice(0, 2).map(uploadScreenshot)) : undefined;",
  "  const res = await fetch(CONDUIT_DOMAIN + '/api/feedback', {",
  "    method: 'POST',",
  "    headers: { 'Content-Type': 'application/json', 'X-Auth-Key': CONDUIT_API_KEY },",
  "    body: JSON.stringify({ authorName: name, authorEmail: email, type, message, pageUrl, screenshots })",
  "  });",
  "  return res.ok;",
  "}",
  "```"
].join("\\n");

const surveysMd = [
  "# Survey API",
  "",
  "Build multi-question surveys with NPS, ratings, multiple choice, open-ended & text feedback.",
  "",
  "## Endpoints",
  "",
  "### GET /api/surveys/[slug]",
  "Returns the survey structure (questions + settings). Requires X-Auth-Key.",
  "",
  "### POST /api/surveys/[slug]/respond",
  "Submit answers to a survey. Requires X-Auth-Key.",
  "",
  "## Question Types",
  "- **nps** — Net Promoter Score (0-10)",
  "- **open_ended** — Free text (max 5000 chars)",
  "- **multiple_choice** — Pick from predefined options",
  "- **rating** — Numeric scale (configurable 1-N)",
  "- **text_feedback** — Categorized feedback (bug/feature/general)",
  "",
  "See the full documentation at /cms/api/surveys for detailed setup and UI code examples.",
].join("\\n");

export default function ApiPage() {
  return (
    <main className="w-full max-w-3xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">API Documentation</h1>
        <p className="text-muted-foreground">
          Use these endpoints to display your blog content on external websites.
          Each API key is scoped to your account — you will only receive your own published articles.
        </p>
      </div>

      <div className="space-y-6">
        {/* Important Note */}
        <Card className="border-accent/30 bg-accent/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertTriangle className="h-5 w-5 text-accent shrink-0 mt-0.5" />
              <div className="text-sm text-muted-foreground space-y-2">
                <p className="font-medium text-foreground">How the API works</p>
                <p>
                  Your API key identifies your account. All endpoints return <strong>only your published articles</strong> — 
                  you cannot access other users&apos; content. Generate your API key in{" "}
                  <a href="/cms/settings" className="text-primary hover:underline">Settings</a>.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Blog Endpoints */}
        <div>
          <SectionHeader title="Blog Endpoints" icon={Globe} markdown={blogEndpointsMd} />
          <div className="space-y-4">
            <ApiEndpoint
              method="GET"
              title="Get All Your Articles"
              description="Returns all your published articles with author and category info"
              endpoint="/api/blog/all"
              code={`const response = await fetch(
  'https://your-domain.com/api/blog/all',
  {
    headers: {
      'X-Auth-Key': 'YOUR_API_KEY',
    },
  }
);
const { data } = await response.json();`}
              response={`// 200 OK
{
  "status": 200,
  "message": "success",
  "data": [
    {
      "_id": "...",
      "title": "My Article",
      "subtitle": "A subtitle",
      "slug": "my-article",
      "blogHtml": "<p>Content...</p>",
      "image": "https://...",
      "published": true,
      "viewCount": 42,
      "readingTime": 5,
      "author": { "name": "John", "profileImg": "..." },
      "category": { "name": "Tech" }
    }
  ]
}`}
            />
            <ApiEndpoint
              method="GET"
              title="Get All Your Slugs"
              description="Returns slugs for all your published articles — useful for static site generation"
              endpoint="/api/blog/slugs"
              code={`const response = await fetch(
  'https://your-domain.com/api/blog/slugs',
  {
    headers: {
      'X-Auth-Key': 'YOUR_API_KEY',
    },
  }
);
const { data } = await response.json();`}
              response={`// 200 OK
{
  "status": 200,
  "message": "success",
  "data": [
    { "slug": "my-first-article" },
    { "slug": "another-post" }
  ]
}`}
            />
          </div>
        </div>

        <div>
          <SectionHeader title="Single Article" icon={FileJson} markdown={singleArticleMd} />
          <div className="space-y-4">
            <ApiEndpoint
              method="GET"
              title="Get Article by Slug"
              description="Returns a specific article from your blog by its slug"
              endpoint="/api/blog/[slug]"
              code={`const response = await fetch(
  'https://your-domain.com/api/blog/my-article-slug',
  {
    headers: {
      'X-Auth-Key': 'YOUR_API_KEY',
    },
  }
);
const { data } = await response.json();`}
              response={`// 200 OK
{
  "status": 200,
  "message": "success",
  "data": {
    "_id": "...",
    "title": "My Article",
    "slug": "my-article-slug",
    "blogHtml": "<p>Full article content...</p>",
    "image": "https://...",
    "published": true,
    "viewCount": 42,
    "readingTime": 5,
    "author": { "name": "John", "profileImg": "..." },
    "category": { "name": "Tech" }
  }
}`}
            />
          </div>
        </div>

        {/* Comments Endpoints */}
        <div>
          <SectionHeader title="Comments" icon={BookOpen} markdown={commentsMd} />
          <div className="space-y-4">
            <ApiEndpoint
              method="GET"
              title="Get Approved Comments"
              description="Returns all approved (moderated) comments for a specific article. Requires API key."
              endpoint="/api/blog/[slug]/comments"
              code={`const response = await fetch(
  'https://your-domain.com/api/blog/my-article-slug/comments',
  {
    headers: {
      'X-Auth-Key': 'YOUR_API_KEY',
    },
  }
);
const { data } = await response.json();`}
              response={`// 200 OK
{
  "status": 200,
  "message": "success",
  "data": [
    {
      "_id": "...",
      "authorName": "Jane Smith",
      "content": "Great article!",
      "_creationTime": 1714000000000
    }
  ]
}`}
            />
            <ApiEndpoint
              method="POST"
              title="Submit a Comment"
              description="Submit a new comment on any published article. No API key needed — open to all readers. Comments appear after moderation."
              endpoint="/api/blog/[slug]/comments"
              code={`const response = await fetch(
  'https://your-domain.com/api/blog/my-article-slug/comments',
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      authorName: 'Jane Smith',
      authorEmail: 'jane@example.com',
      content: 'Great article!',
    }),
  }
);
const result = await response.json();`}
              response={`// 201 Created
{
  "status": 201,
  "message": "Comment submitted. It will appear after moderation."
}`}
            />
          </div>
        </div>

        {/* Subscribers Endpoints */}
        <div>
          <SectionHeader title="Subscribers" icon={Mail} markdown={subscribersMd} />
          <div className="space-y-4">
            <ApiEndpoint
              method="POST"
              title="Add a Newsletter Subscriber"
              description="Add a new email subscriber to your newsletter list. This allows you to collect emails from any other website (e.g., a landing page, external blog, or opt-in form) and have them sync directly to your CMS Subscribers dashboard. Requires your API key."
              endpoint="/api/subscribers"
              code={`const response = await fetch(
  'https://your-domain.com/api/subscribers',
  {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Auth-Key': 'YOUR_API_KEY' // Required: Identifies your account
    },
    body: JSON.stringify({
      email: 'reader@example.com'
    }),
  }
);
const result = await response.json();`}
              response={`// 200 OK
{
  "status": 200,
  "message": "Successfully subscribed"
}

// 400 Bad Request (If email is invalid or already subscribed)
{
  "status": 400,
  "message": "You are already subscribed!"
}`}
            />
          </div>
        </div>

        {/* Feedback Endpoints */}
        <div>
          <SectionHeader title="Feedback API" icon={MessageSquarePlus} markdown={feedbackMd} />
          <p className="text-sm text-muted-foreground mb-4">
            Collect bug reports, feature requests, and general feedback from any external app, product, or website — directly into your Conduit dashboard.
          </p>

          {/* How screenshot upload works — callout card */}
          <Card className="border-primary/20 bg-primary/5 mb-4">
            <CardContent className="pt-5">
              <div className="flex gap-3">
                <Upload className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="space-y-2 text-sm">
                  <p className="font-semibold text-foreground">How screenshot uploads work</p>
                  <p className="text-muted-foreground">
                    The feedback API stores <strong>URLs</strong>, not raw image files. Screenshots must be uploaded to Cloudflare R2
                    first using the <code className="bg-muted px-1 rounded">/api/upload</code> helper endpoint,
                    then the returned public URL is included in the feedback body. This approach keeps the feedback
                    endpoint fast and allows images to be served via CDN.
                  </p>
                  <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                    <li>
                      <code className="bg-muted px-1 rounded">POST /api/upload</code> with{" "}
                      <code className="bg-muted px-1 rounded">&#123; filename, contentType &#125;</code> → receive
                      <code className="bg-muted px-1 rounded">presignedUrl</code> and
                      <code className="bg-muted px-1 rounded">publicUrl</code>
                    </li>
                    <li>
                      <code className="bg-muted px-1 rounded">PUT presignedUrl</code> with the raw image binary
                      directly from the browser — no server proxy needed
                    </li>
                    <li>
                      Include <code className="bg-muted px-1 rounded">publicUrl</code> in the
                      <code className="bg-muted px-1 rounded">screenshots</code> array when calling
                      <code className="bg-muted px-1 rounded">POST /api/feedback</code>
                    </li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {/* Upload endpoint */}
            <ApiEndpoint
              method="POST"
              title="Step 1 — Get a Screenshot Upload URL"
              description="Request a presigned Cloudflare R2 upload URL for an image. Requires your API key. The URL expires in 5 minutes. Call this once per image, before submitting feedback."
              endpoint="/api/upload"
              code={`// Step 1: Get presigned URL from your Conduit backend
const uploadRes = await fetch('https://your-domain.com/api/upload', {
  method: 'POST',
  headers: { 
    'Content-Type': 'application/json',
    'X-Auth-Key': 'YOUR_API_KEY',   // Required: from Settings → API Keys
  },
  body: JSON.stringify({
    filename: 'screenshot.png',     // The original file name
    contentType: 'image/png',       // MIME type of the file (must be image/*)
  }),
});

const { presignedUrl, publicUrl } = await uploadRes.json();

// Step 2: Upload the binary file directly to R2 (no auth needed here)
await fetch(presignedUrl, {
  method: 'PUT',
  headers: { 'Content-Type': 'image/png' },
  body: imageFile,  // File object from an <input type="file">
});

// Step 3: publicUrl is now a permanent CDN URL — include it in feedback`}
              response={`// 200 OK
{
  "presignedUrl": "https://account.r2.cloudflarestorage.com/...",
  "publicUrl": "https://cdn.yourdomain.com/uploads/1715000000-screenshot.png",
  "key": "uploads/1715000000-screenshot.png"
}

// 400 Bad Request
{ "error": "filename and contentType are required" }

// 401 Unauthorized
{ "error": "Missing X-Auth-Key header" }

// 422 Unprocessable Entity
{ "error": "Only image uploads are allowed" }

// 503 Service Unavailable
{ "error": "File upload is not configured" }`}
            />

            {/* Feedback submission endpoint */}
            <ApiEndpoint
              method="POST"
              title="Step 2 — Submit Feedback"
              description="Submit a bug report, feature request, or general message. Requires your API key. Optionally include up to 2 screenshot public URLs obtained from Step 1."
              endpoint="/api/feedback"
              code={`const response = await fetch('https://your-domain.com/api/feedback', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Auth-Key': 'YOUR_API_KEY',   // Required: from Settings → API Keys
  },
  body: JSON.stringify({
    // ── Required fields ──────────────────────────────
    authorName: 'Jane Smith',                // Display name of the submitter
    type: 'bug',                             // "bug" | "feature" | "general"
    message: 'The save button does nothing', // Feedback message (max 5000 chars)

    // ── Optional fields ──────────────────────────────
    authorEmail: 'jane@example.com',         // Submitter email (for follow-up)
    pageUrl: 'https://yourapp.com/settings', // Page they were on when submitting
    screenshots: [                           // Max 2 R2 public URLs from Step 1
      'https://cdn.yourdomain.com/uploads/1715000000-screenshot.png',
    ],
  }),
});

const result = await response.json();`}
              response={`// 201 Created
{
  "status": 201,
  "message": "Feedback submitted successfully. Thank you!"
}

// 401 Unauthorized (missing API key)
{ "status": 401, "message": "Missing X-Auth-Key header" }

// 403 Forbidden (invalid API key)
{ "status": 403, "message": "Invalid API key" }

// 422 Unprocessable Entity (validation failure)
{ "status": 422, "message": "type must be one of: bug, feature, general" }

// 500 Internal Server Error
{ "status": 500, "message": "Internal server error" }`}
            />

            {/* Complete working example */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-base">Complete Working Example</CardTitle>
                    <CardDescription>Full flow: screenshot upload → feedback submission (vanilla JS)</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm font-mono">{`/**
 * Conduit Feedback Widget — Drop-in Example
 * ─────────────────────────────────────────
 * Replace YOUR_DOMAIN and YOUR_API_KEY with real values.
 * Works in any JS environment (React, Vue, vanilla, etc.)
 */

const CONDUIT_DOMAIN = 'https://your-domain.com';
const CONDUIT_API_KEY = 'YOUR_API_KEY';

async function uploadScreenshot(file) {
  // 1. Get a presigned URL from Conduit
  const res = await fetch(CONDUIT_DOMAIN + '/api/upload', {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json',
      'X-Auth-Key': CONDUIT_API_KEY,
    },
    body: JSON.stringify({
      filename: file.name,
      contentType: file.type,
    }),
  });
  const { presignedUrl, publicUrl } = await res.json();

  // 2. Upload the file directly to R2 (fast — no server round-trip)
  await fetch(presignedUrl, {
    method: 'PUT',
    headers: { 'Content-Type': file.type },
    body: file,
  });

  return publicUrl; // permanent CDN URL
}

async function submitFeedback({ type, message, name, email, pageUrl, files }) {
  // 3. Upload screenshots (max 2) in parallel
  const screenshots = files?.length
    ? await Promise.all([...files].slice(0, 2).map(uploadScreenshot))
    : undefined;

  // 4. Submit feedback with screenshot URLs
  const res = await fetch(CONDUIT_DOMAIN + '/api/feedback', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Key': CONDUIT_API_KEY,
    },
    body: JSON.stringify({
      authorName: name,
      authorEmail: email,
      type,          // 'bug' | 'feature' | 'general'
      message,
      pageUrl: pageUrl || window.location.href,
      screenshots,
    }),
  });

  return res.ok;
}

// Usage example:
await submitFeedback({
  type: 'bug',
  message: 'Login button crashes on mobile Safari',
  name: 'Jane Smith',
  email: 'jane@example.com',
  files: document.getElementById('screenshot-input').files,
});`}</code>
                </pre>
              </CardContent>
            </Card>

            {/* Field reference table */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Field Reference</CardTitle>
                <CardDescription>Complete list of fields accepted by POST /api/feedback</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {([
                    { field: "authorName", type: "string", req: true, desc: "Display name of the person submitting feedback" },
                    { field: "type", type: '"bug" | "feature" | "general"', req: true, desc: "Category of the feedback" },
                    { field: "message", type: "string", req: true, desc: "The feedback message body. Max 5000 characters." },
                    { field: "authorEmail", type: "string", req: false, desc: "Optional. Allows you to reply to the submitter." },
                    { field: "pageUrl", type: "string", req: false, desc: "Optional. URL of the page they were on when submitting. Useful for bug reports." },
                    { field: "screenshots", type: "string[]", req: false, desc: "Optional. Array of up to 2 R2 public URLs. Must be uploaded first via POST /api/upload." },
                  ] as const).map(({ field, type, req, desc }) => (
                    <div key={field} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/50">
                      <code className="shrink-0 font-mono text-xs bg-background px-1.5 py-0.5 rounded border">{field}</code>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <span className="text-xs text-muted-foreground font-mono">{type}</span>
                          <Badge variant={req ? "default" : "outline"} className="text-[10px] h-4 px-1">
                            {req ? "required" : "optional"}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Survey API */}
        <div>
          <SectionHeader title="Survey API" icon={ClipboardList} markdown={surveysMd} />
          <p className="text-sm text-muted-foreground mb-4">
            Build and embed multi-question surveys — NPS, rating scales, multiple choice, open-ended, and text feedback.
            Create surveys in the <a href="/cms/surveys" className="text-primary hover:underline">Surveys dashboard</a>, then use these
            endpoints to render and collect responses from any app or website.
          </p>

          <div className="space-y-4">
            <ApiEndpoint
              method="GET"
              title="Fetch Survey Structure"
              description="Returns the survey's questions and settings. Call this first to dynamically render your survey form. Only works for surveys with status = active."
              endpoint="/api/surveys/[slug]"
              code={`const response = await fetch(
  'https://your-domain.com/api/surveys/product-nps-q2',
  {
    headers: { 'X-Auth-Key': 'YOUR_API_KEY' },
  }
);
const { data } = await response.json();
// data.title        — survey title
// data.description  — optional subtitle
// data.questions    — array of question objects
// data.settings     — { allowAnonymous, requireEmail, showProgress }`}
              response={`// 200 OK
{
  "status": 200,
  "data": {
    "_id": "...",
    "title": "Product NPS Q2 2026",
    "slug": "product-nps-q2",
    "questions": [
      {
        "id": "q1",
        "type": "nps",
        "title": "How likely are you to recommend us to a friend?",
        "required": true
      },
      {
        "id": "q2",
        "type": "rating",
        "title": "Rate your onboarding experience",
        "required": true,
        "ratingScale": 5,
        "ratingLabels": { "low": "Very Bad", "high": "Excellent" }
      },
      {
        "id": "q3",
        "type": "multiple_choice",
        "title": "What matters most to you?",
        "required": false,
        "options": ["Price", "Speed", "Support", "Features"]
      },
      {
        "id": "q4",
        "type": "open_ended",
        "title": "What would you improve?",
        "required": false
      }
    ],
    "settings": {
      "allowAnonymous": true,
      "requireEmail": false,
      "showProgress": true
    }
  }
}

// 404 Not Found (survey doesn't exist or isn't active)
{ "status": 404, "message": "Survey not found or not active" }`}
            />

            <ApiEndpoint
              method="POST"
              title="Submit Survey Response"
              description="Submit answers to an active survey. Answers must match each question's type. Required questions must be answered or the request is rejected with 422."
              endpoint="/api/surveys/[slug]/respond"
              code={`const response = await fetch(
  'https://your-domain.com/api/surveys/product-nps-q2/respond',
  {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Key': 'YOUR_API_KEY',
    },
    body: JSON.stringify({
      // ── Respondent info (optional) ─────────────────
      respondentName:  'Jane Smith',
      respondentEmail: 'jane@example.com',

      // ── Answers — must match question types exactly ─
      answers: [
        // NPS: value must be 0-10
        { questionId: 'q1', type: 'nps', value: 9 },

        // Rating: value must be 1 to ratingScale
        { questionId: 'q2', type: 'rating', value: 4 },

        // Multiple choice: value must be one of the options
        { questionId: 'q3', type: 'multiple_choice', value: 'Speed' },

        // Open-ended: value is any string (max 5000 chars)
        { questionId: 'q4', type: 'open_ended',
          value: 'Better mobile navigation' },
      ],

      // ── Context (optional) ─────────────────────────
      pageUrl: 'https://yourapp.com/dashboard',
    }),
  }
);
const result = await response.json();`}
              response={`// 201 Created
{ "status": 201, "message": "Response submitted successfully" }

// 401 Unauthorized (missing key)
{ "status": 401, "message": "Missing X-Auth-Key header" }

// 403 Forbidden (invalid key)
{ "status": 403, "message": "Invalid API key" }

// 404 Not Found (wrong slug or survey not active)
{ "status": 404, "message": "Survey not found or not active" }

// 422 Validation Error (bad answer or missing required)
{ "status": 422, "message": "NPS score must be between 0 and 10" }
{ "status": 422, "message": "Missing required answers for: q1, q2" }
{ "status": 422, "message": "Invalid choice for question q3" }`}
            />

            {/* Question Types Reference */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Question Types Reference</CardTitle>
                <CardDescription>
                  Each question type has specific rules for the <code className="bg-muted px-1 rounded">value</code> field
                  in your answers array.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  {([
                    {
                      type: "nps",
                      value: "number (0–10)",
                      desc: "Net Promoter Score. 0–6 = Detractor, 7–8 = Passive, 9–10 = Promoter. Dashboard calculates NPS score automatically.",
                      setup: 'No extra config needed.',
                    },
                    {
                      type: "open_ended",
                      value: "string (max 5000 chars)",
                      desc: "Free text response for qualitative insights. Great for 'What would you improve?' style questions.",
                      setup: 'No extra config needed.',
                    },
                    {
                      type: "multiple_choice",
                      value: "string — must match one of options[]",
                      desc: "Single-select from a predefined list. The value must exactly match one of the options defined in the survey builder.",
                      setup: 'Set options[] in the survey builder (2–20 choices).',
                    },
                    {
                      type: "rating",
                      value: "number (1 to ratingScale)",
                      desc: "Satisfaction score on a configurable scale. Dashboard shows average + distribution chart.",
                      setup: 'Set ratingScale (e.g. 5 or 10) and ratingLabels in the builder.',
                    },
                    {
                      type: "text_feedback",
                      value: "string (max 5000 chars)",
                      desc: "Open text feedback — like open_ended but displayed with a feedback icon in the dashboard.",
                      setup: 'No extra config needed.',
                    },
                  ] as const).map(({ type, value, desc, setup }) => (
                    <div key={type} className="flex items-start gap-3 p-2.5 rounded-lg bg-muted/50">
                      <code className="shrink-0 font-mono text-xs bg-background px-1.5 py-0.5 rounded border">{type}</code>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-muted-foreground font-mono">{value}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{desc}</p>
                        <p className="text-xs text-primary/80">{setup}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Complete drop-in widget */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Complete Drop-in Survey Widget</CardTitle>
                <CardDescription>
                  Copy this into any JS/TS project. Fetches the survey, renders all question types, and submits responses.
                  Works in React, Vue, Svelte, or vanilla JS.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm font-mono">{`const DOMAIN  = 'https://your-domain.com';
const API_KEY = 'YOUR_API_KEY';

// ─── Step 1: Fetch the survey ─────────────────────────────────────
async function loadSurvey(slug) {
  const res = await fetch(\`\${DOMAIN}/api/surveys/\${slug}\`, {
    headers: { 'X-Auth-Key': API_KEY },
  });
  if (!res.ok) throw new Error('Survey not found');
  const { data } = await res.json();
  return data; // { title, description, questions, settings }
}

// ─── Step 2: Render based on question type ────────────────────────
function renderQuestion(question, container) {
  const { id, type, title, description, options, ratingScale, ratingLabels } = question;

  const wrapper = document.createElement('div');
  wrapper.className = 'survey-question';
  wrapper.innerHTML = \`<h3>\${title}</h3>\${description ? \`<p>\${description}</p>\` : ''}\`;

  if (type === 'nps') {
    // 0-10 buttons, color-coded
    const row = document.createElement('div');
    row.className = 'nps-row';
    for (let i = 0; i <= 10; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.className = i <= 6 ? 'nps-detractor' : i <= 8 ? 'nps-passive' : 'nps-promoter';
      btn.onclick = () => { row.dataset.value = i; btn.classList.add('selected'); };
      row.appendChild(btn);
    }
    row.innerHTML += '<div class="nps-labels"><span>Not likely</span><span>Extremely likely</span></div>';
    wrapper.appendChild(row);

  } else if (type === 'rating') {
    // 1-N scale with labels
    const scale = ratingScale ?? 5;
    const row = document.createElement('div');
    row.className = 'rating-row';
    for (let i = 1; i <= scale; i++) {
      const btn = document.createElement('button');
      btn.textContent = i;
      btn.onclick = () => { row.dataset.value = i; btn.classList.add('selected'); };
      row.appendChild(btn);
    }
    if (ratingLabels) {
      row.innerHTML += \`<div class="rating-labels"><span>\${ratingLabels.low}</span><span>\${ratingLabels.high}</span></div>\`;
    }
    wrapper.appendChild(row);

  } else if (type === 'multiple_choice') {
    // Radio-style option cards
    const list = document.createElement('div');
    list.className = 'choice-list';
    (options ?? []).forEach(opt => {
      const btn = document.createElement('button');
      btn.className = 'choice-btn';
      btn.textContent = opt;
      btn.onclick = () => { list.dataset.value = opt; document.querySelectorAll('.choice-btn').forEach(b => b.classList.remove('selected')); btn.classList.add('selected'); };
      list.appendChild(btn);
    });
    wrapper.appendChild(list);

  } else if (type === 'open_ended' || type === 'text_feedback') {
    // Textarea with character counter
    const ta = document.createElement('textarea');
    ta.placeholder = 'Your answer...';
    ta.maxLength = 5000;
    ta.oninput = () => { ta.dataset.value = ta.value; };
    wrapper.appendChild(ta);
  }

  container.appendChild(wrapper);
}

// ─── Step 3: Collect answers ──────────────────────────────────────
function collectAnswers(survey) {
  return survey.questions.map(q => {
    const el = document.querySelector(\`[data-question-id="\${q.id}"]\`);
    const value = el?.dataset?.value ?? '';
    return { questionId: q.id, type: q.type, value: q.type === 'nps' || q.type === 'rating' ? Number(value) : value };
  }).filter(a => a.value !== '' && a.value !== 0);
}

// ─── Step 4: Submit ───────────────────────────────────────────────
async function submitSurvey(slug, answers, name, email) {
  const res = await fetch(\`\${DOMAIN}/api/surveys/\${slug}/respond\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Auth-Key': API_KEY },
    body: JSON.stringify({ respondentName: name, respondentEmail: email, answers }),
  });
  return res.ok;
}

// ─── Usage ────────────────────────────────────────────────────────
const survey = await loadSurvey('product-nps-q2');
const container = document.getElementById('survey-container');
survey.questions.forEach(q => renderQuestion(q, container));
// ... show a submit button, then:
const ok = await submitSurvey('product-nps-q2', collectAnswers(survey), 'Jane', 'jane@example.com');
if (ok) container.innerHTML = '<p>Thank you for your feedback!</p>';`}
                  </code>
                </pre>
              </CardContent>
            </Card>

            {/* CSS snippet */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Suggested Widget CSS</CardTitle>
                <CardDescription>Paste this into your stylesheet to style the widget above.</CardDescription>
              </CardHeader>
              <CardContent>
                <pre className="bg-muted p-4 rounded-md overflow-x-auto">
                  <code className="text-sm font-mono">{`.survey-question { margin-bottom: 2rem; }
.survey-question h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.5rem; }
.survey-question p  { font-size: 0.875rem; color: #666; margin-bottom: 0.75rem; }

/* NPS */
.nps-row { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.nps-row button { width: 2.5rem; height: 2.5rem; border-radius: 0.5rem; border: 1px solid #ddd; cursor: pointer; font-weight: 500; }
.nps-row button:hover, .nps-row button.selected { outline: 2px solid currentColor; }
.nps-detractor { color: #ef4444; }
.nps-passive   { color: #eab308; }
.nps-promoter  { color: #22c55e; }
.nps-labels    { display: flex; justify-content: space-between; width: 100%; font-size: 0.75rem; color: #888; margin-top: 0.25rem; }

/* Rating */
.rating-row { display: flex; flex-wrap: wrap; gap: 0.25rem; }
.rating-row button { width: 3rem; height: 3rem; border-radius: 0.5rem; border: 1px solid #ddd; cursor: pointer; font-weight: 600; }
.rating-row button:hover, .rating-row button.selected { background: var(--primary, #4f46e5); color: #fff; border-color: transparent; }
.rating-labels { display: flex; justify-content: space-between; width: 100%; font-size: 0.75rem; color: #888; margin-top: 0.25rem; }

/* Multiple Choice */
.choice-list { display: flex; flex-direction: column; gap: 0.5rem; }
.choice-btn { padding: 0.75rem 1rem; border: 1px solid #ddd; border-radius: 0.5rem; text-align: left; cursor: pointer; transition: all 0.15s; }
.choice-btn:hover { border-color: var(--primary, #4f46e5); }
.choice-btn.selected { border-color: var(--primary, #4f46e5); background: rgba(79,70,229,0.05); font-weight: 600; }

/* Textarea */
textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 0.5rem; resize: vertical; min-height: 6rem; font-size: 0.875rem; }
textarea:focus { outline: 2px solid var(--primary, #4f46e5); border-color: transparent; }`}
                  </code>
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <BookOpen className="h-5 w-5 text-primary" />
            Error Codes
          </h2>
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                  <Badge variant="outline" className="shrink-0 font-mono">401</Badge>
                  <div>
                    <p className="font-medium">Missing API Key</p>
                    <p className="text-muted-foreground">No <code className="bg-muted px-1 rounded">X-Auth-Key</code> header provided.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                  <Badge variant="outline" className="shrink-0 font-mono">403</Badge>
                  <div>
                    <p className="font-medium">Invalid API Key</p>
                    <p className="text-muted-foreground">The API key does not match any account.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                  <Badge variant="outline" className="shrink-0 font-mono">404</Badge>
                  <div>
                    <p className="font-medium">Article Not Found</p>
                    <p className="text-muted-foreground">No published article exists with the given slug for your account.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 p-2 rounded bg-muted/50">
                  <Badge variant="outline" className="shrink-0 font-mono">500</Badge>
                  <div>
                    <p className="font-medium">Server Error</p>
                    <p className="text-muted-foreground">Something went wrong. Try again later.</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Authentication */}
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <LinkIcon className="h-5 w-5 text-primary" />
            Authentication
          </h2>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground mb-4">
                All API requests require authentication using your API key.
                Include it in the <code className="bg-muted px-1 rounded">X-Auth-Key</code> header.
                Your key is scoped to your account only.
              </p>
              <p className="text-sm text-muted-foreground">
                Find your API key in{" "}
                <a href="/cms/settings" className="text-primary hover:underline">
                  Settings
                </a>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
