import { NextRequest, NextResponse } from 'next/server';
import { verifyAuthToken, AUTH_COOKIE_NAME } from './lib/auth';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Protect /dashboard/super-admin
  if (pathname.startsWith('/dashboard/super-admin')) {
    const sessionCookie = req.cookies.get(AUTH_COOKIE_NAME)?.value;

    if (!sessionCookie) {
      // In development, check if demo header or allow graceful redirect to login
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    const payload = await verifyAuthToken(sessionCookie);

    if (!payload || payload.role !== 'SUPER_ADMIN') {
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('error', 'unauthorized');
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/super-admin/:path*'],
};
