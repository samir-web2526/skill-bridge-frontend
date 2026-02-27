
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getUser } from "./services/user.service";

const ALLOWED_ROLE = ["ADMIN", "STUDENT", "TUTOR"];
const PUBLIC_ROUTE = ["/login", "/register"];

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const user = await getUser();

  if (PUBLIC_ROUTE.includes(pathname)) {
    return NextResponse.next();
  }

  if (!user) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, origin)
    );
  }

  if (!ALLOWED_ROLE.includes(user.role)) {
    return NextResponse.redirect(
      new URL(`/login?redirect=${pathname}`, origin)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/dashboard/:path*",
};