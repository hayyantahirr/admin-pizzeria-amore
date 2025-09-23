import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(req) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  // Check if user is authenticated
  const { data: { session } } = await supabase.auth.getSession();
  
  // Get the pathname from the request
  const { pathname } = req.nextUrl;

  // Allow access to login page even when not authenticated
  if (pathname === '/login') {
    // If already logged in and trying to access login page, redirect to home
    if (session) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    return res;
  }

  // For all other routes, redirect to login if not authenticated
  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return res;
}

// Specify which routes this middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};