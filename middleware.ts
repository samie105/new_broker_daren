import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_session')
  const { pathname } = request.nextUrl

  // Admin login page - handle separately (not under /admin folder)
  if (pathname === '/admin-login') {
    // If already authenticated, redirect to admin dashboard
    if (authToken) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // Admin routes handling
  if (pathname.startsWith('/admin')) {
    // For all /admin routes, require authentication
    if (!authToken) {
      const loginUrl = new URL('/admin-login', request.url)
      return NextResponse.redirect(loginUrl)
    }
    
    // Role-based access control will be handled in the admin layout
    return NextResponse.next()
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-otp', '/setup-admin']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith('/auth/'))

  // If trying to access protected route without auth token, redirect to login
  if (!authToken && !isPublicRoute) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // If authenticated user tries to access auth pages, redirect to dashboard
  if (authToken && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    // Check if this is a redirect loop by looking at the referer
    const referer = request.headers.get('referer')
    const isDashboardOrAuthReferer = referer && (referer.includes('/dashboard') || referer.includes('/auth/'))
    
    // Only redirect if NOT coming from dashboard or auth pages (prevents loops)
    if (!isDashboardOrAuthReferer) {
      const redirectUrl = new URL('/dashboard', request.url)
      console.log('🔄 [MIDDLEWARE] Redirecting authenticated user from', pathname, 'to /dashboard')
      return NextResponse.redirect(redirectUrl)
    } else {
      console.log('⚠️ [MIDDLEWARE] Skipping redirect to prevent loop, referer:', referer)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets|.*\\.svg|.*\\.png|.*\\.jpg).*)',
  ],
}
