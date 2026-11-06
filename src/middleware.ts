import { NextResponse, type NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { SESSION_COOKIE_NAME, verifySessionSignature } from "./lib/auth/token";

const intlMiddleware = createMiddleware(routing);

export default async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    // Signature + expiry are checked here; revocation (and the logged-in redirect away from /admin/login)
    // is handled server-side in the admin layout, which can read the session table.
    const session = await verifySessionSignature(request.cookies.get(SESSION_COOKIE_NAME)?.value);
    const isLogin = pathname === "/admin/login";

    if (!isLogin && !session) {
      const loginUrl = new URL("/admin/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      const res = NextResponse.redirect(loginUrl);
      if (request.cookies.has(SESSION_COOKIE_NAME)) res.cookies.delete(SESSION_COOKIE_NAME);
      return res;
    }

    const headers = new Headers(request.headers);
    headers.set("x-pathname", pathname);
    return NextResponse.next({ request: { headers } });
  }

  // Launched from the installed app but pointed at a public page: send it to the admin instead.
  if (request.nextUrl.searchParams.get("source") === "pwa") {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
