import { NextRequest, NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/login", "/register", "/forgot-password"];

const OWNER_ROUTES = [
  "/dashboard",
  "/conversations",
  "/contacts",
  "/knowledge-base",
  "/analytics",
  "/settings",
  "/company-info",
  "/team",
  "/setup",
];

const AGENT_ROUTES = [
  "/dashboard",
  "/conversations",
  "/contacts",
  "/knowledge-base",
];

const SUPER_ADMIN_ROUTES = [
  "/admin/dashboard",
  "/admin/companies",
  "/admin/users",
  "/admin/subscriptions",
  "/admin/settings",
];

function isPublicRoute(pathname: string): boolean {
  return PUBLIC_ROUTES.includes(pathname);
}

function matchesRoute(pathname: string, routes: string[]): boolean {
  return routes.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const authCookie = request.cookies.get("is_authenticated")?.value;
  const roleCookie = request.cookies.get("user_role")?.value;

  const isAuthenticated = authCookie === "true";
  const userRole = roleCookie;

  if (pathname === "/") {
    if (!isAuthenticated || !userRole) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    if (userRole === "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }

    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (isPublicRoute(pathname)) {
    if (isAuthenticated && userRole) {
      if (userRole === "SUPER_ADMIN") {
        return NextResponse.redirect(new URL("/admin/dashboard", request.url));
      }

      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  if (!isAuthenticated || !userRole) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (userRole === "OWNER") {
    if (!matchesRoute(pathname, OWNER_ROUTES)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (userRole === "AGENT") {
    if (!matchesRoute(pathname, AGENT_ROUTES)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.next();
  }

  if (userRole === "SUPER_ADMIN") {
    if (!matchesRoute(pathname, SUPER_ADMIN_ROUTES)) {
      return NextResponse.redirect(new URL("/admin/dashboard", request.url));
    }
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)"],
};