import { NextRequest, NextResponse } from "next/server";

const CONVEX_CLOUD_URL =
  process.env.NEXT_PUBLIC_CONVEX_URL || "https://pleasant-stoat-303.convex.cloud";
const CONVEX_SITE_URL = CONVEX_CLOUD_URL.replace(".cloud", ".site");

async function proxyRequest(request: NextRequest, method: string): Promise<NextResponse> {
  const path = request.nextUrl.pathname.replace("/api/auth", "");
  const url = new URL(`${CONVEX_SITE_URL}/api/auth${path}`);
  url.search = request.nextUrl.search;

  const body = method === "GET" ? undefined : await request.text();

  const response = await fetch(url.toString(), {
    method,
    headers: {
      cookie: request.headers.get("cookie") || "",
      ...(method !== "GET" && { "Content-Type": "application/json" }),
    },
    ...(body !== undefined && { body }),
  });

  const data = await response.text();
  const nextResponse = new NextResponse(data, {
    status: response.status,
    headers: { "Content-Type": "application/json" },
  });

  // Forward ALL Set-Cookie headers — response.headers.get() only returns the first one,
  // but Convex Auth sets multiple cookies (JWT + refresh token) in a single response.
  const setCookieHeaders: string[] = (response.headers as unknown as { getSetCookie?: () => string[] }).getSetCookie?.()
    ?? ([response.headers.get("Set-Cookie")].filter(Boolean) as string[]);

  for (const cookie of setCookieHeaders) {
    nextResponse.headers.append("Set-Cookie", cookie);
  }

  return nextResponse;
}

export async function GET(request: NextRequest) {
  return proxyRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return proxyRequest(request, "POST");
}
