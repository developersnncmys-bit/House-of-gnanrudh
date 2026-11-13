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
  '/stores',
  '/contact',
  '/blog',
  '/bespoke',
  '/account',
  '/account/orders',
  '/account/addresses',
  // Footer policy pages — Shipping, Returns, Care, Privacy, Terms.
  '/shipping',
  '/returns',
  '/care',
  '/privacy',
  '/terms',
  // Checkout success/cancel landings — the popup redirects here after
  // placeOrder / cancel. Query params (order id, txn ref, email) are
  // ignored by the pathname match.
  '/order/thank-you',
  '/order/cancelled',
  '/payment/success',
  '/payment/cancelled',
]);

// Specific query-string-scoped URLs to let through even when the
// pathname itself is gated. Used to open just the "New Arrivals"
// shop view (/shop?sort=new) while /shop with any other params
// continues to redirect home.
const ALLOWED_WITH_QUERY = new Set<string>([
  // Sort / wishlist / sale / weave landings
  '/shop?sort=new',
  '/shop?sort=bestseller',
  '/shop?wishlist=1',
  '/shop?sale=1',
  '/shop?weave=Kanjivaram',
  '/shop?weave=Banarasi',
  '/shop?weave=Mysore+Silk',
  '/shop?weave=Mangalagiri',
  '/shop?weave=Pochampally',
  '/shop?weave=Gadwal',
  '/shop?weave=Patola',
  '/shop?weave=Fancy+Sarees',
  '/shop?weave=Mixed+Pattu+Sarees',
  // Tier landings (Shop by Occasion — top level)
  '/shop?tier=bridal',
  '/shop?tier=festive',
  '/shop?tier=everyday',
  // Wedding occasions
  '/shop?tier=bridal&occasion=reception',
  '/shop?tier=bridal&occasion=engagement',
  '/shop?tier=bridal&occasion=haldi',
  '/shop?tier=bridal&occasion=mehendi',
  '/shop?tier=bridal&occasion=sangeet',
  // Festive occasions
  '/shop?tier=festive&occasion=diwali',
  '/shop?tier=festive&occasion=pongal',
  '/shop?tier=festive&occasion=navratri',
  '/shop?tier=festive&occasion=pooja',
  // Everyday occasions
  '/shop?tier=everyday&occasion=office',
  '/shop?tier=everyday&occasion=casual',
  '/shop?tier=everyday&occasion=home',
  '/shop?tier=everyday&occasion=travel',
  // Price-range landings (Shop by Price)
  '/shop?maxPrice=5000',
  '/shop?maxPrice=10000',
  '/shop?maxPrice=25000',
  '/shop?minPrice=10000&maxPrice=25000',
  '/shop?minPrice=25000',
  '/shop?minPrice=25000&maxPrice=50000',
  '/shop?minPrice=50000&maxPrice=100000',
  '/shop?minPrice=100000',
]);

// Product detail pages — any `/shop/<id>` path is live so individual
// saree pages from the grids can be opened. Guarded by a startsWith
// check (not a Set) because the saree id is dynamic.
function isProductDetailRoute(pathname: string): boolean {
  return pathname.startsWith('/shop/') && pathname.length > '/shop/'.length;
}

// Blog post pages — any `/blog/<slug>` path is live.
function isBlogPostRoute(pathname: string): boolean {
  return pathname.startsWith('/blog/') && pathname.length > '/blog/'.length;
}

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  if (ALLOWED.has(pathname)) {
    return NextResponse.next();
  }
  if (ALLOWED_WITH_QUERY.has(pathname + search)) {
    return NextResponse.next();
  }
  if (isProductDetailRoute(pathname) || isBlogPostRoute(pathname)) {
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
