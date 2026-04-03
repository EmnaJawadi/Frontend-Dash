import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

const OWNER_ROUTES = [
  "/dashboard",
  "/conversations",
  "/contacts",
  "/knowledge-base",
  "/analytics",
  "/settings",
  "/settings/account",
  "/company-info",
  "/team",
  "/setup",
];

const AGENT_ROUTES = [
  "/dashboard",
  "/conversations",
  "/contacts",
  "/knowledge-base",
  "/settings",
  "/settings/account",
];

const SUPER_ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/companies",
  "/admin/users",
  "/admin/subscriptions",
  "/admin/settings",
  "/settings",
  "/settings/account",
];

type AppRole = "OWNER" | "AGENT" | "SUPER_ADMIN";

function isIgnoredRoute(pathname: string): boolean {
  return (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  );
}

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function isValidRole(role: string | undefined): role is AppRole {
  return role === "OWNER" || role === "AGENT" || role === "SUPER_ADMIN";
}

function getDefaultRouteByRole(role: AppRole): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "/admin/dashboard";
    case "OWNER":
    case "AGENT":
      return "/dashboard";
    default:
      return "/login";
  }
}

function redirectTo(request: NextRequest, path: string) {
  return NextResponse.redirect(new URL(path, request.url));
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (isIgnoredRoute(pathname)) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("is_authenticated")?.value;
  const roleCookie = request.cookies.get("user_role")?.value;

  const isAuthenticated = authCookie === "true";
  const userRole = isValidRole(roleCookie) ? roleCookie : null;

  if (pathname === "/") {
    if (!isAuthenticated || !userRole) {
      return redirectTo(request, "/login");
    }

    return redirectTo(request, getDefaultRouteByRole(userRole));
  }

  if (isPublicRoute(pathname)) {
    if (isAuthenticated && userRole) {
      return redirectTo(request, getDefaultRouteByRole(userRole));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated || !userRole) {
    return redirectTo(request, "/login");
  }

  switch (userRole) {
    case "OWNER":
      return matchesRoute(pathname, OWNER_ROUTES)
        ? NextResponse.next()
        : redirectTo(request, "/dashboard");

    case "AGENT":
      return matchesRoute(pathname, AGENT_ROUTES)
        ? NextResponse.next()
        : redirectTo(request, "/dashboard");

    case "SUPER_ADMIN":
      return matchesRoute(pathname, SUPER_ADMIN_ROUTES)
        ? NextResponse.next()
        : redirectTo(request, "/admin/dashboard");

    default:
      return redirectTo(request, "/login");
  }
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};