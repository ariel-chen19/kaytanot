import { NextResponse, type NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Keep the public site closed while allowing the live landing page,
  // API routes and required static files.
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/coming-soon') ||
    pathname === '/kaytana/mitgalgalim' ||
    pathname === '/privacy' ||
    pathname === '/robots.txt' ||
    pathname === '/sitemap.xml' ||
    pathname.match(/\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$/)
  ) {
    return NextResponse.next()
  }

  const response = NextResponse.redirect(new URL('/coming-soon', request.url))
  response.cookies.delete('preview_mode')
  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
