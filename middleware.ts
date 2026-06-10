import { NextResponse, type NextRequest } from 'next/server'

const PREVIEW_PARAM  = 'kaytanot2026'
const PREVIEW_COOKIE = 'preview_mode'
const COOKIE_MAX_AGE = 60 * 60 * 24 // 24 hours

export function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  // 1. Always allow _next internals and static assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/auth') ||
    pathname === '/lp/mitgalgalim' ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next()
  }

  // 2. If ?preview=kaytanot2026 → set cookie + allow through (strip param from URL)
  if (searchParams.get('preview') === PREVIEW_PARAM) {
    const destination = new URL(request.url)
    destination.searchParams.delete('preview')

    const response = NextResponse.redirect(destination)
    response.cookies.set(PREVIEW_COOKIE, '1', {
      httpOnly: true,
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
    return response
  }

  // 3. If preview cookie is set → allow full access
  if (request.cookies.get(PREVIEW_COOKIE)?.value === '1') {
    return NextResponse.next()
  }

  // 4. Allow /coming-soon itself
  if (pathname.startsWith('/coming-soon')) {
    return NextResponse.next()
  }

  // 5. Everything else → coming soon
  return NextResponse.redirect(new URL('/coming-soon', request.url))
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
