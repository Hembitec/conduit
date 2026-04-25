"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, Check, Globe, FileJson, Link as LinkIcon, AlertTriangle, BookOpen } from "lucide-react"
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
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <Globe className="h-5 w-5 text-primary" />
            Blog Endpoints
          </h2>
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
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <FileJson className="h-5 w-5 text-primary" />
            Single Article
          </h2>
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

        {/* Error Codes */}
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
