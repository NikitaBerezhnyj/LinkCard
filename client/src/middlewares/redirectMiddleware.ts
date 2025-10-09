import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function redirectMiddleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  const url = req.nextUrl.clone();

  if (token && ["/login", "/register"].includes(url.pathname)) {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  if (!token && url.pathname.match(/^\/user\/[^/]+\/edit$/)) {
    url.pathname = url.pathname.replace("/edit", "");
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/register", "/user/:path*/edit"]
};
