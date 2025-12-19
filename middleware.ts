import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_session')
  const { pathname } = request.nextUrl

  console.log('[MIDDLEWARE]', { pathname, hasAuthToken: !!authToken })

  // Admin login page
  if (pathname === '/admin-login') {
    if (authToken) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // Admin routes - require auth
  if (pathname.startsWith('/admin')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    return NextResponse.next()
  }

  // Public routes - always allow
  const publicRoutes = ['/', '/auth/login', '/auth/signup', '/auth/forgot-password', '/auth/reset-password', '/auth/verify-otp', '/setup-admin']
  const isPublicRoute = publicRoutes.includes(pathname) || pathname.startsWith('/auth/')
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Protected routes (like /dashboard) - require auth
  if (!authToken) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('from', pathname)
    return NextResponse.redirect(loginUrl)
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
