import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // فقط برای روت‌های محافظت شده چک کن
  if (request.nextUrl.pathname.startsWith('/panel')) {
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
      // اگر توکن نیست، فورس ریدایرکت به لاگین
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/panel/:path*']
};