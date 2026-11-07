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
 */
export const CART_DISABLED = SOFT_LAUNCH;

/**
 * Wishlist gate — when on, the heart button swallows its click and the
 * Nav wishlist count badge is hidden. toggleWishlist / inWishlist code
 * paths are left intact so flipping this re-enables them.
 */
export const WISHLIST_DISABLED = SOFT_LAUNCH;

/**
 * Returns the href unchanged normally, or `undefined` when SOFT_LAUNCH
 * is on and the target isn't `/home`. Callers render a `<Link>` when
 * this returns a string and a `<span>` (same classes + `cursor-default`)
 * when it returns `undefined`.
 */
export function navHref(href: string): string | undefined {
  if (!SOFT_LAUNCH) return href;
  return href === '/home' ? href : undefined;
}
