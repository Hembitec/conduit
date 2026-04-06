import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isProtectedRoute = request.nextUrl.pathname.startsWith("/cms");

  if (isProtectedRoute) {
    // TODO: Replace with Convex Auth session check in Phase 3
    // For now, allow all requests (auth will be added in Phase 3)
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
