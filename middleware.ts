import { NextRequest, NextResponse } from 'next/server';

/**
 * Soft-launch gate — every route except `/` and `/home` redirects to
 * `/home`. The Preloader is a component mounted inside SiteShell on the
 * `/home` path (not a route), so it continues to work.
 *
 * To re-enable the rest of the site, delete this file. The underlying
 * routes under `app/` are untouched — all pages are still built, just
 * unreachable via navigation while this middleware is in place.
 *
 * See memory: project_pages_unlinked_soft_launch.
 */

const ALLOWED = new Set<string>(['/', '/home']);

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (ALLOWED.has(pathname)) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = '/home';
  url.search = '';
  return NextResponse.redirect(url);
}

export const config = {
  // Match everything except Next.js internals, API routes, and any
  // request that looks like a static asset (contains a `.`). Without
  // the asset exclusion the middleware would intercept /favicon.ico,
  // /icon.png, /brand/*.svg, etc. and redirect those to /home too,
  // breaking the whole page.
  matcher: ['/((?!_next/|api/|.*\\..*).*)'],
};
