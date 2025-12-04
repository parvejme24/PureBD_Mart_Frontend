import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  // Protected routes that require authentication
  const protectedRoutes = ["/dashboard", "/profile", "/checkout", "/orders"];

  // Admin only routes
  const adminRoutes = ["/dashboard/users", "/dashboard/products", "/dashboard/categories"];

  // Check if the current path starts with any protected route
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isAdminRoute = adminRoutes.some((route) =>
    pathname.startsWith(route)
  );

  // Redirect to login if trying to access protected route without token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if trying to access admin route without admin role
  if (isAdminRoute && token?.role !== "admin") {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Redirect authenticated users away from login/register pages
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/checkout/:path*",
    "/orders/:path*",
    "/login",
    "/register",
  ],
};

