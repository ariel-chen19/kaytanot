import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow: _next internals, static assets, and /coming-soon itself
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/coming-soon') ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // Redirect everything else → /coming-soon
  return NextResponse.redirect(new URL('/coming-soon', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
