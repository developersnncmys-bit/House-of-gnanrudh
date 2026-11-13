/**
 * Soft-launch gate — single source of truth for whether the site is in
 * the pre-launch holding pattern. When true, non-home Links across the
 * UI render as inert <span>s (same look, no navigation). Paired with
 * `middleware.ts`, which also blocks direct URL access.
 *
 * To re-open the site: set `SOFT_LAUNCH = false` here AND delete
 * `middleware.ts`. See memory: project_pages_unlinked_soft_launch.
 *
 * Note: `components/Nav.tsx` and `components/auth/AccountMenu.tsx`
 * duplicate this flag locally (historical — they were gated first).
 * Flip all three when re-opening.
 */
export const SOFT_LAUNCH = true;

/**
 * Cart gate — when on, Add-to-Cart buttons swallow their click and the
 * Nav cart icon doesn't open the drawer. Code paths (addToCart, cart
 * drawer, checkout) are left intact so flipping this re-enables them.
 * Opened alongside the wishlist so visitors can actually add pieces
 * to the bag during the soft-launch window.
 */
export const CART_DISABLED = false;

/**
 * Wishlist gate — when on, the heart button swallows its click and the
 * Nav wishlist count badge is hidden. toggleWishlist / inWishlist code
 * paths are left intact so flipping this re-enables them. Opened
 * ahead of the rest of the soft-launch so visitors can save pieces
 * for later even while shop/cart stay gated.
 */
export const WISHLIST_DISABLED = false;

/**
 * Routes that stay live even while SOFT_LAUNCH is on. Keep in sync with
 * `middleware.ts` so the gate and the UI agree on what's reachable.
 */
const SOFT_LAUNCH_ALLOWED = new Set<string>([
  '/',
  '/about',
  '/stores',
  '/contact',
  '/blog',
  '/bespoke',
  '/account',
  '/account/orders',
  '/account/addresses',
  '/shipping',
  '/returns',
  '/care',
  '/privacy',
  '/terms',
  '/order/thank-you',
  '/order/cancelled',
  '/payment/success',
  '/payment/cancelled',
]);

/**
 * Query-scoped URLs that stay live. Used to open just the "New Arrivals"
 * view (/shop?sort=new) while every other /shop URL stays gated. Must
 * mirror `ALLOWED_WITH_QUERY` in middleware.ts.
 */
const SOFT_LAUNCH_ALLOWED_WITH_QUERY = new Set<string>([
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
  '/shop?tier=bridal',
  '/shop?tier=festive',
  '/shop?tier=everyday',
  '/shop?tier=bridal&occasion=reception',
  '/shop?tier=bridal&occasion=engagement',
  '/shop?tier=bridal&occasion=haldi',
  '/shop?tier=bridal&occasion=mehendi',
  '/shop?tier=bridal&occasion=sangeet',
  '/shop?tier=festive&occasion=diwali',
  '/shop?tier=festive&occasion=pongal',
  '/shop?tier=festive&occasion=navratri',
  '/shop?tier=festive&occasion=pooja',
  '/shop?tier=everyday&occasion=office',
  '/shop?tier=everyday&occasion=casual',
  '/shop?tier=everyday&occasion=home',
  '/shop?tier=everyday&occasion=travel',
  '/shop?maxPrice=5000',
  '/shop?maxPrice=10000',
  '/shop?maxPrice=25000',
  '/shop?minPrice=10000&maxPrice=25000',
  '/shop?minPrice=25000',
  '/shop?minPrice=25000&maxPrice=50000',
  '/shop?minPrice=50000&maxPrice=100000',
  '/shop?minPrice=100000',
]);

/**
 * Returns the href unchanged normally, or `undefined` when SOFT_LAUNCH
 * is on and the target isn't in the allow-list. Callers render a `<Link>`
 * when this returns a string and a `<span>` (same classes +
 * `cursor-default`) when it returns `undefined`.
 */
export function navHref(href: string): string | undefined {
  if (!SOFT_LAUNCH) return href;
  if (SOFT_LAUNCH_ALLOWED_WITH_QUERY.has(href)) return href;
  const [path] = href.split('?');
  // Product detail routes — any /shop/<id> is live so wishlist, search
  // recommendations and product-card links all navigate through.
  if (path.startsWith('/shop/') && path.length > '/shop/'.length) {
    return href;
  }
  // Blog post routes — any /blog/<slug> is live so the landing grid,
  // sidebar lists and prev/next navigation all resolve.
  if (path.startsWith('/blog/') && path.length > '/blog/'.length) {
    return href;
  }
  return SOFT_LAUNCH_ALLOWED.has(path) ? href : undefined;
}
