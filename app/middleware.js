import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Get token with fallback for development
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
    secureCookie: process.env.NODE_ENV === "production",
  });

  // Auth pages - redirect to home if already logged in
  const authPages = ["/login", "/register"];
  const isAuthPage = authPages.includes(pathname);

  if (isAuthPage) {
    if (token) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/orders"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // If accessing protected route without token, redirect to login
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Admin only routes
  const adminRoutes = [
    "/dashboard/users",
    "/dashboard/products",
    "/dashboard/categories",
  ];
  const isAdminRoute = adminRoutes.some((route) => pathname.startsWith(route));

  // Redirect to home if trying to access admin route without admin role
  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/orders/:path*",
    "/login",
    "/register",
  ],
};
