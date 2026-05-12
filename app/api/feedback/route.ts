import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

/**
 * CORS headers — required so JavaScript running on a different domain
 * (e.g. your product app) can call this endpoint from the browser.
 */
const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Auth-Key",
};

// ─── OPTIONS (preflight) ─────────────────────────────────────────
// Browsers send this automatically before a cross-origin POST.
// We must respond 204 with the CORS headers.
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

// ─── POST /api/feedback ──────────────────────────────────────────
/**
 * Public endpoint — no browser session needed.
 * Authentication is performed via X-Auth-Key header (your CMS API key).
 *
 * Expected JSON body:
 * {
 *   authorName:   string           (required)
 *   authorEmail:  string           (optional)
 *   type:         "bug" | "feature" | "general"  (required)
 *   message:      string           (required, max 5000 chars)
 *   pageUrl:      string           (optional — the page they were on)
 *   screenshots:  string[]         (optional — max 2 R2 public URLs)
 * }
 *
 * Screenshot upload flow (client side):
 *   1. Call POST /api/upload   →  { presignedUrl, publicUrl }
 *   2. PUT the image file to presignedUrl directly from the browser
 *   3. Include publicUrl inside the screenshots[] array in this request
 *
 * The API route never touches binary data — it only stores the final
 * public R2 URLs that the client already uploaded.
 */
export async function POST(request: Request) {
  const apiKey = request.headers.get("X-Auth-Key");

  if (!apiKey) {
    return NextResponse.json(
      { status: 401, message: "Missing X-Auth-Key header" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  // ── Resolve the API key to a real user ──
  let profile: Awaited<ReturnType<typeof fetchQuery<typeof api.users.getUserByApiKey>>> | null = null;
  try {
    profile = await fetchQuery(api.users.getUserByApiKey, { apiKey });
  } catch {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  if (!profile) {
    return NextResponse.json(
      { status: 403, message: "Invalid API key" },
      { status: 403, headers: CORS_HEADERS }
    );
  }

  // ── Parse body ──
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: 400, message: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { authorName, authorEmail, type, message, pageUrl, screenshots } =
    body as Record<string, unknown>;

  // ── Validate required fields ──
  if (typeof authorName !== "string" || !authorName.trim()) {
    return NextResponse.json(
      { status: 422, message: "authorName is required" },
      { status: 422, headers: CORS_HEADERS }
    );
  }
  if (!["bug", "feature", "general"].includes(type as string)) {
    return NextResponse.json(
      { status: 422, message: "type must be one of: bug, feature, general" },
      { status: 422, headers: CORS_HEADERS }
    );
  }
  if (typeof message !== "string" || !message.trim()) {
    return NextResponse.json(
      { status: 422, message: "message is required" },
      { status: 422, headers: CORS_HEADERS }
    );
  }
  if (message.length > 5000) {
    return NextResponse.json(
      { status: 422, message: "message exceeds 5000 character limit" },
      { status: 422, headers: CORS_HEADERS }
    );
  }

  // ── Validate screenshots ──
  if (screenshots !== undefined) {
    if (
      !Array.isArray(screenshots) ||
      screenshots.length > 2 ||
      screenshots.some((s) => typeof s !== "string")
    ) {
      return NextResponse.json(
        { status: 422, message: "screenshots must be an array of at most 2 URLs" },
        { status: 422, headers: CORS_HEADERS }
      );
    }
  }

  // ── Validate optional email ──
  if (
    authorEmail !== undefined &&
    (typeof authorEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authorEmail as string))
  ) {
    return NextResponse.json(
      { status: 422, message: "authorEmail must be a valid email address" },
      { status: 422, headers: CORS_HEADERS }
    );
  }

  // ── Write to Convex ──
  try {
    await fetchMutation(api.feedback.createFeedback, {
      userId: profile.userId,
      authorName: (authorName as string).trim(),
      authorEmail:
        typeof authorEmail === "string" ? authorEmail.trim() : undefined,
      type: type as "bug" | "feature" | "general",
      message: (message as string).trim(),
      pageUrl: typeof pageUrl === "string" ? pageUrl.trim() : undefined,
      screenshots: Array.isArray(screenshots)
        ? (screenshots as string[])
        : undefined,
    });

    return NextResponse.json(
      {
        status: 201,
        message: "Feedback submitted successfully. Thank you!",
      },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
