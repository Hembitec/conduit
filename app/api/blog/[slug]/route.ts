import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const apiKey = request.headers.get("X-Auth-Key");
  if (!apiKey) {
    return NextResponse.json({ status: 401, message: "Missing X-Auth-Key header" }, { status: 401 });
  }

  try {
    const profile = await fetchQuery(api.queries.getUserByApiKey, { apiKey });
    if (!profile) {
      return NextResponse.json({ status: 403, message: "Invalid API key" }, { status: 403 });
    }

    const { slug } = await params;
    const response = await fetchQuery(api.queries.readPublicArticle, { slug });
    return NextResponse.json({ status: 200, message: "success", response });
  } catch (error: unknown) {
    return NextResponse.json({ status: 404, message: "failed", error: "unknown_error" });
  }
}
