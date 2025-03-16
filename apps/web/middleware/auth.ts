import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from '@/lib/keycloak';

export async function authMiddleware(request: NextRequest) {
  // Public paths that don't require authentication
  const publicPaths = ['/login', '/register', '/about', '/'];
  
  const path = request.nextUrl.pathname;
  
  // Allow access to public paths
  if (publicPaths.includes(path)) {
    return NextResponse.next();
  }

  // Check for authentication
  const token = getToken();
  
  if (!token) {
    // Redirect to login page if not authenticated
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', path);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
} 