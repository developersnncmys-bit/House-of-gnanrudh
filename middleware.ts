import { NextRequest, NextResponse } from 'next/server';

/**
 * Soft-launch gate — every route except `/` redirects to `/`.
 * The Preloader is a component mounted inside SiteShell on `/`
 * (not a route), so it continues to work.
 *
 * To re-enable the rest of the site, delete this file. The underlying
 * routes under `app/` are untouched — all pages are still built, just
 * unreachable via navigation while this middleware is in place.
 *
 * See memory: project_pages_unlinked_soft_launch.
 */

const ALLOWED = new Set<string>([
  '/',
  '/about',
  '/account',
  '/account/orders',
  '/account/addresses',
]);

// Specific query-string-scoped URLs to let through even when the
// pathname itself is gated. Used to open just the "New Arrivals"
// shop view (/shop?sort=new) while /shop with any other params
// continues to redirect home.
const ALLOWED_WITH_QUERY = new Set<string>([
  '/shop?sort=new',
  '/shop?wishlist=1',
  '/shop?weave=Kanjivaram',
  '/shop?weave=Banarasi',
  '/shop?weave=Mysore+Silk',
]);

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (ALLOWED.has(pathname)) {
    return NextResponse.next();
  }
  if (ALLOWED_WITH_QUERY.has(pathname + search)) {
    return NextResponse.next();
  }
  const url = request.nextUrl.clone();
  url.pathname = '/';
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
