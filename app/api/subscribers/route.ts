import { fetchQuery, fetchMutation } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const apiKey = request.headers.get("X-Auth-Key");
  if (!apiKey) {
    return NextResponse.json({ status: 401, message: "Missing X-Auth-Key header" }, { status: 401 });
  }

  try {
    const profile = await fetchQuery(api.users.getUserByApiKey, { apiKey });
    if (!profile) {
      return NextResponse.json({ status: 403, message: "Invalid API key" }, { status: 403 });
    }

    const body = await request.json();
    if (!body.email || typeof body.email !== "string") {
      return NextResponse.json({ status: 400, message: "Missing or invalid email" }, { status: 400 });
    }

    try {
      await fetchMutation(api.subscribers.subscribe, { 
        email: body.email, 
        blogUserId: profile.userId 
      });
      return NextResponse.json({ status: 200, message: "Successfully subscribed" }, { status: 200 });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to subscribe";
      return NextResponse.json({ status: 400, message }, { status: 400 });
    }
  } catch (err) {
    return NextResponse.json({ status: 500, message: "Internal server error" }, { status: 500 });
  }
}
