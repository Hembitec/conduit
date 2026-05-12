/**
 * RSS Feed — DISABLED
 *
 * Conduit is a multi-tenant SaaS CMS. A single global RSS feed would mix
 * articles from all users, which is architecturally incorrect.
 *
 * Each user's own frontend should expose a feed scoped to their content,
 * constructed from the /api/blog/all endpoint using their API key.
 *
 * Example using the Conduit API:
 *   GET /api/blog/all
 *   Headers: { "X-Auth-Key": "<user-api-key>" }
 *
 * Returns only that user's published articles — use this to build a
 * per-user /feed.xml on their own domain.
 */
export async function GET() {
  return new Response(
    JSON.stringify({
      error: "Global RSS feed is not available. Use the /api/blog/all endpoint with your API key to build a scoped feed for your own domain.",
    }),
    {
      status: 410, // 410 Gone — intentionally removed
      headers: { "Content-Type": "application/json" },
    }
  );
}
