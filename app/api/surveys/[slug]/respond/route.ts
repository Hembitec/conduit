import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, X-Auth-Key",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

/**
 * POST /api/surveys/[slug]/respond
 * Submit a response to a survey. Requires X-Auth-Key.
 *
 * Expected JSON body:
 * {
 *   respondentName?:  string
 *   respondentEmail?: string
 *   answers: Array<{ questionId: string, type: string, value: string | number }>
 *   pageUrl?:         string
 * }
 */
export async function POST(
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

  // Resolve API key
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

  // Find survey by slug
  let survey: Awaited<
    ReturnType<typeof fetchQuery<typeof api.surveys.getSurveyBySlug>>
  > | null = null;
  try {
    survey = await fetchQuery(api.surveys.getSurveyBySlug, {
      userId: profile.userId,
      slug,
    });
  } catch {
    return NextResponse.json(
      { status: 500, message: "Internal server error" },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  if (!survey) {
    return NextResponse.json(
      { status: 404, message: "Survey not found or not active" },
      { status: 404, headers: CORS_HEADERS }
    );
  }

  // Parse body
  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { status: 400, message: "Invalid JSON body" },
      { status: 400, headers: CORS_HEADERS }
    );
  }

  const { respondentName, respondentEmail, answers, pageUrl } = body;

  // Validate answers array
  if (!Array.isArray(answers) || answers.length === 0) {
    return NextResponse.json(
      { status: 422, message: "answers must be a non-empty array" },
      { status: 422, headers: CORS_HEADERS }
    );
  }

  for (const a of answers) {
    if (
      typeof a !== "object" ||
      !a ||
      typeof (a as Record<string, unknown>).questionId !== "string" ||
      typeof (a as Record<string, unknown>).type !== "string" ||
      ((a as Record<string, unknown>).value === undefined)
    ) {
      return NextResponse.json(
        {
          status: 422,
          message:
            "Each answer must have questionId (string), type (string), and value (string or number)",
        },
        { status: 422, headers: CORS_HEADERS }
      );
    }
  }

  // Validate email if provided
  if (
    respondentEmail !== undefined &&
    (typeof respondentEmail !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(respondentEmail))
  ) {
    return NextResponse.json(
      { status: 422, message: "respondentEmail must be a valid email" },
      { status: 422, headers: CORS_HEADERS }
    );
  }

  // Submit
  try {
    await fetchMutation(api.surveys.submitSurveyResponse, {
      surveyId: survey._id,
      respondentName:
        typeof respondentName === "string" ? respondentName.trim() : undefined,
      respondentEmail:
        typeof respondentEmail === "string"
          ? respondentEmail.trim()
          : undefined,
      answers: (answers as Array<Record<string, unknown>>).map((a) => ({
        questionId: String(a.questionId),
        type: String(a.type),
        value:
          typeof a.value === "number" ? a.value : String(a.value),
      })),
      pageUrl: typeof pageUrl === "string" ? pageUrl.trim() : undefined,
      userId: profile.userId,
    });

    return NextResponse.json(
      { status: 201, message: "Response submitted successfully" },
      { status: 201, headers: CORS_HEADERS }
    );
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Internal server error";
    return NextResponse.json(
      { status: 422, message },
      { status: 422, headers: CORS_HEADERS }
    );
  }
}
