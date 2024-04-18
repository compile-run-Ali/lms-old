import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const path = req.nextUrl.pathname;
    const user = req.nextauth.token.user;

    if (user.level === 0 && !path.startsWith("/faculty/print_results")) {
      return NextResponse.rewrite(new URL("/faculty/print_results", req.url));
    }

    // /faculty/print_results can only be accessed by faculty level 0
    if (user.level !== 0 && path === "/faculty/print_results") {
      return NextResponse.rewrite(new URL("/", req.url));
    }

    if (path.startsWith("/admin") && user.role === "faculty") {
      // faculty level 0 can only access /faculty/print_results
    }

    if (path.startsWith("/admin") && user.level !== 5) {
      return NextResponse.rewrite(new URL("/", req.url));
    }

    if (path.startsWith("/student") && user.role !== "student") {
      return NextResponse.rewrite(new URL("/", req.url));
    }

    if (path.startsWith("/faculty") && user.role !== "faculty") {
      return NextResponse.rewrite(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/admin/:path*", "/student/:path*", "/faculty/:path*"],
};
