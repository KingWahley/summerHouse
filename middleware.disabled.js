import { NextResponse } from "next/server";

export function middleware(request) {
  const hasSession =
    request.cookies.get("sb-access-token") ||
    request.cookies.get("sb-refresh-token");

  const { pathname } = request.nextUrl;

  // Protect dashboard + listings
  if (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/listings")
  ) {
    if (!hasSession) {
      return NextResponse.redirect(
        new URL("/auth/login", request.url)
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/listings/:path*"]
};
