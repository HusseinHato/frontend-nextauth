// middleware.ts
import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const isAuth = req.nextauth.token;

    console.log(req.nextauth);

    // Define paths that require authentication
    const protectedPaths = ['/protected'];
    const authPaths = ['/auth'];

    if (protectedPaths.some(path => pathname.startsWith(path))) {
      if (!isAuth) {
        return NextResponse.redirect(new URL('/auth/signin', req.url));
      }
    }

    if (authPaths.some(path => pathname.startsWith(path))) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/protected/todos', req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ['/protected/:path*']
};
