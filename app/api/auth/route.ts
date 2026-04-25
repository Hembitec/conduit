import { NextRequest, NextResponse } from "next/server";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL || "https://pleasant-stoat-303.convex.cloud";

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/auth", "");
  const url = new URL(`${CONVEX_URL}/api/auth${path}`);
  url.search = request.nextUrl.search;
  
  const response = await fetch(url.toString(), {
    method: "GET",
    headers: {
      cookie: request.headers.get("cookie") || "",
    },
  });
  
  const data = await response.text();
  return new NextResponse(data, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": response.headers.get("Set-Cookie") || "",
    },
  });
}

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/auth", "");
  const url = new URL(`${CONVEX_URL}/api/auth${path}`);
  url.search = request.nextUrl.search;
  
  const body = await request.text();
  
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      cookie: request.headers.get("cookie") || "",
      "Content-Type": "application/json",
    },
    body,
  });
  
  const data = await response.text();
  return new NextResponse(data, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": response.headers.get("Set-Cookie") || "",
    },
  });
}
