import {
  convexAuthNextjsMiddleware,
  createRouteMatcher,
  nextjsMiddlewareRedirect,
} from "@convex-dev/auth/nextjs/server";

const isProtectedRoute = createRouteMatcher(["/cms(.*)"]);
const isAuthRoute = createRouteMatcher(["/sign-in(.*)", "/sign-up(.*)"]);

export default convexAuthNextjsMiddleware(async (request, { convexAuth }) => {
  // Already logged in? Don't let them access the auth pages
  if (isAuthRoute(request) && (await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/cms");
  }
  // Not logged in? Don't let them access protected pages
  if (isProtectedRoute(request) && !(await convexAuth.isAuthenticated())) {
    return nextjsMiddlewareRedirect(request, "/sign-in");
  }
}, {
  apiRoute: "/api/auth",
  cookieConfig: {
    maxAge: 60 * 60 * 24 * 30, // 30 days — matches Convex backend session default
  },
});

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
