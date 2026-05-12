import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Auth-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * GET /api/surveys/[slug]
 * Returns the public-facing survey structure (questions only).
 * Requires X-Auth-Key to identify which account's survey to fetch.
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const apiKey = request.headers.get("X-Auth-Key");

  if (!apiKey) {
    return NextResponse.json(
      { status: 401, message: "Missing X-Auth-Key header" },
      { status: 401, headers: CORS_HEADERS }
    );
  }

  // Resolve API key to user
  let profile: Awaited<
    ReturnType<typeof fetchQuery<typeof api.users.getUserByApiKey>>
  > | null = null;
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

  try {
    const survey = await fetchQuery(api.surveys.getSurveyBySlug, {
      userId: profile.userId,
      slug,
    });

    if (!survey) {
      return NextResponse.json(
        { status: 404, message: "Survey not found or not active" },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    return NextResponse.json(
      { status: 200, data: survey },
      { status: 200, headers: CORS_HEADERS }
    );
  } catch {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
