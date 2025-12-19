import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const userSession = request.cookies.get('user_session')
  const adminSession = request.cookies.get('admin_session')
  const { pathname } = request.nextUrl

  console.log('[MIDDLEWARE]', { pathname, hasUserSession: !!userSession, hasAdminSession: !!adminSession })

  // Admin login page
  if (pathname === '/admin-login') {
    if (adminSession) {
      return NextResponse.redirect(new URL('/admin', request.url))
    }
    return NextResponse.next()
  }

  // Admin routes - require admin auth
  if (pathname.startsWith('/admin')) {
    if (!adminSession) {
      return NextResponse.redirect(new URL('/admin-login', request.url))
    }
    return NextResponse.next()
  }

  // Dashboard routes - require user auth
  if (pathname.startsWith('/dashboard')) {
    if (!userSession) {
      return NextResponse.redirect(new URL('/auth/login', request.url))
    }
    return NextResponse.next()
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
