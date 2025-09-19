import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('access_token')?.value ||
                request.headers.get('Authorization')?.replace('Bearer ', '');

  // Protected routes
  if (request.nextUrl.pathname.startsWith('/panel')) {
    if (!token) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // If logged in and trying to access login, redirect to panel
  if (request.nextUrl.pathname === '/login' && token) {
    return NextResponse.redirect(new URL('/panel', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*', '/login']
};