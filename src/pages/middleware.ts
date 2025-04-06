import AuthService from "@/services/auth";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const publicRoutes = ["/login", "/register", "/forgot-password"];
  const isPublicRoute = publicRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route),
  );

  const token = request.cookies.get("auth_token")?.value;

  if (isPublicRoute && token) {
    try {
      const { userId } = await AuthService.validateToken(token as string);
      if (userId) {
        return NextResponse.redirect(new URL("/", request.url));
      }
    } catch {
      return NextResponse.next();
    }
  }

  if (!isPublicRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (!isPublicRoute && token) {
    try {
      const { userId } = await AuthService.validateToken(token as string);
      if (!userId) {
        return NextResponse.redirect(new URL("/login", request.url));
      }
    } catch {
      return NextResponse.redirect(new URL("/login", request.url));
    }
  }

  return NextResponse.next();
}
