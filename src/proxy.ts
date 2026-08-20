import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Duplicated from lib/auth.ts rather than imported: that module also pulls
// in node:crypto (for the password check), which isn't available in the
// Edge runtime Proxy executes in.
const SESSION_COOKIE_NAME = "admin_session";

function getSecretKey() {
  return new TextEncoder().encode(process.env.SESSION_SECRET);
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  let authenticated = false;

  if (token) {
    try {
      await jwtVerify(token, getSecretKey());
      authenticated = true;
    } catch {
      authenticated = false;
    }
  }

  if (!authenticated) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
