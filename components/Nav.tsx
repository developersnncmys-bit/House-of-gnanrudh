'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import {
  LuSearch,
  LuHeart,
  LuShoppingBag,
  LuMenu,
  LuX,
} from 'react-icons/lu';
import { PiStorefront } from 'react-icons/pi';
import AnimatedSearchBar from '@/components/AnimatedSearchBar';
import PromoStrip from '@/components/PromoStrip';
import ShopAllMegaMenu from '@/components/ShopAllMegaMenu';
import OccasionsMegaMenu from '@/components/OccasionsMegaMenu';
import { useShop } from '@/lib/shop-store';
import { useCartDrawer } from '@/lib/cart-drawer';
import { useScrollLock } from '@/lib/scroll-lock';
import AccountMenu from '@/components/auth/AccountMenu';
import { SAREES, formatINR } from '@/lib/sarees';
import { CART_DISABLED, WISHLIST_DISABLED } from '@/lib/soft-launch';

// Popular Choices — surfaced in the search panel as quick-filter pills.
// Each entry drops the visitor onto /shop with the right query param.
const POPULAR_CHOICES = [
  { label: 'Silk Sarees', href: '/shop?weave=Kanjivaram' },
  { label: 'Kanchipuram / Kanjivaram', href: '/shop?weave=Kanjivaram' },
  { label: 'Banarasi Sarees', href: '/shop?weave=Banarasi' },
  { label: 'Wedding Sarees', href: '/shop?tier=bridal' },
  { label: 'Mysore Silk', href: '/shop?weave=Mysore+Silk' },
  { label: 'Patola Sarees', href: '/shop?weave=Patola' },
];

// Picks for the "Recommended For You" grid in the search panel. Shown
// as a 2-column vertical grid, so enough entries to make the scroll
// feel inhabited rather than a one-screen afterthought.
const RECOMMENDED = SAREES.slice(0, 10);

// Tier categories — kept as a separate array so they can carry a subtle
// weight distinction from the weaves in the centred sub-row. Occasion
// links sit first (what shoppers decide before fabric), weaves next.
// Currently empty — Occasions lives in the weaveLinks row as a single
// entry pointing at the tier landing.
const sectionLinks: { href: string; label: string }[] = [];

// Soft-launch gate — items stay in the UI (labels, icons, styling all
// preserved) but their navigation is stripped. Links to pages other
// than `/home` become inert `<span>` wrappers, so clicks do nothing.
// Pair with `middleware.ts` which also blocks direct URL access.
// Flip to `false` to restore navigation. The `/home` link stays live
// regardless so the logo always works.
// See memory: project_pages_unlinked_soft_launch.
const SOFT_LAUNCH = true;

// Sub-row — streamlined main nav. "New Arrivals" keeps the maroon accent
// (highlight recent stock); "Sale" keeps the box accent at the end.
const weaveLinks = [
  { href: '/', label: 'Home' },
  { href: '/shop?sort=new', label: 'New Arrivals' },
  { href: '/shop?weave=Kanjivaram', label: 'Kanjeevaram' },
  { href: '/shop?weave=Banarasi', label: 'Banarasi' },
  { href: '/shop?weave=Mysore+Silk', label: 'Mysore Silk' },
  { href: '/shop?weave=Mangalagiri', label: 'Mangalagiri' },
  { href: '/shop?weave=Pochampally', label: 'Pochampally' },
  { href: '/shop?weave=Gadwal', label: 'Gadwal' },
  { href: '/shop?weave=Patola', label: 'Patola' },
  { href: '/shop?weave=Fancy+Sarees', label: 'Fancy Sarees' },
  { href: '/shop', label: 'Shop All' },
  { href: '/shop?view=occasions', label: 'Occasions' },
  { href: '/shop?sale=1', label: 'Sale', accent: 'box' },
];

// Helper: during SOFT_LAUNCH, strip navigation on any href that isn't
// `/home` so the link renders as a styled-but-inert span. Returns the
// safe href (never navigates away from /home when gated).
function navHref(href: string): string | undefined {
  if (!SOFT_LAUNCH) return href;
  return href === '/' ? href : undefined;
}

// Active-link detection. A link is active when the current path matches
// its base path AND every query param the link declares is present (with
// the same value) in the current URL. For "New In" (/shop with no params)
// we additionally require that no weave/sale/tier param is set —
// otherwise it would light up on every shop view alongside the actual
// category.
//
// `params` is nullable: during static prerender we render the navbar
// shell without resolved search params, so no link is "active" in the
// HTML. After hydration the real params arrive and the active highlight
// applies — same DOM, just re-rendered.
function isLinkActive(
  href: string,
  pathname: string,
  params: URLSearchParams | null,
): boolean {
  if (!params) return false;
  const [path, query] = href.split('?');
  if (pathname !== path) return false;
  const linkParams = new URLSearchParams(query ?? '');
  for (const [k, v] of linkParams) {
    if (params.get(k) !== v) return false;
  }
  if (linkParams.toString() === '' && path === '/shop') {
    if (params.get('weave') || params.get('sale') || params.get('tier')) {
      return false;
    }
  }
  return true;
}

// Static prerender (`next build` with output:'export') requires every
// component that calls useSearchParams() to sit inside a <Suspense>
// boundary. Previously the fallback was `null` — which meant the navbar
// was completely missing from the prerendered HTML and only appeared
// once the client JS hydrated. On a slow first paint that read as
// "navbar loading 40s late".
//
// Now the fallback renders the navbar *shell* (no active link
// highlights) so the bar is present in the static HTML and visible
// instantly. After hydration the searchParams resolve and NavInner
// re-renders with active state.
export default function Nav() {
  return (
    <Suspense fallback={<NavInner searchParams={null} />}>
      <NavWithSearchParams />
    </Suspense>
  );
}

function NavWithSearchParams() {
  const searchParams = useSearchParams();
  return <NavInner searchParams={searchParams} />;
}

function NavInner({ searchParams }: { searchParams: URLSearchParams | null }) {
  const pathname = usePathname();
  // Self-contained cinematic pages have no nav — they own the whole viewport
  // and supply their own exit CTAs in the closing panel.
  const isImmersive = pathname === '/journey';
  const { cartCount, wishlistCount, hydrated } = useShop();
  const { openCart } = useCartDrawer();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  // Search icon in the centre cluster toggles this. When true, a thin
  // overlay row slides down below the top bar carrying AnimatedSearchBar.
  // Keeps the main row visually quiet (Pothys pattern) while giving
  // search a full-width field once summoned.
  const [searchOpen, setSearchOpen] = useState(false);
  // Mega menus (Shop All, Occasions). Only one is open at a time —
  // hovering a second trigger swaps the panel instantly. Close is
  // delayed by 180ms so the cursor has time to travel from trigger to
  // panel without the menu collapsing in between.
  type MegaId = 'shop' | 'occasions';
  const [openMenuId, setOpenMenuId] = useState<MegaId | null>(null);
  const megaCloseTimer = useRef<number | null>(null);
  const openMega = (id: MegaId) => {
    if (megaCloseTimer.current) {
      window.clearTimeout(megaCloseTimer.current);
      megaCloseTimer.current = null;
    }
    setOpenMenuId(id);
  };
  const closeMega = () => {
    if (megaCloseTimer.current) window.clearTimeout(megaCloseTimer.current);
    megaCloseTimer.current = window.setTimeout(() => {
      setOpenMenuId(null);
      megaCloseTimer.current = null;
    }, 180);
  };

  // Close menu on route change so a tap-through link doesn't leave it open.
  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
    setOpenMenuId(null);
  }, [pathname]);

  // Lock body scroll (Lenis-aware — see lib/scroll-lock.ts) and listen for
  // Escape while the mobile drawer is open. The overlay carries
  // `data-lenis-prevent` so Lenis releases wheel/touch events to the
  // drawer's own scrollable container.
  useScrollLock(menuOpen || searchOpen || openMenuId !== null);
  useEffect(() => {
    if (!menuOpen && !searchOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      if (menuOpen) setMenuOpen(false);
      if (searchOpen) setSearchOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen, searchOpen]);

  // One-shot animation triggers for the bag + heart icons whenever their
  // count increases. We snapshot the previous count in a ref, compare on
  // every render, and flip a short-lived flag that drives a CSS keyframe.
  const prevCart = useRef(0);
  const prevWishlist = useRef(0);
  const [bagPulse, setBagPulse] = useState(false);
  const [heartPulse, setHeartPulse] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!hydrated) {
      prevCart.current = cartCount;
      prevWishlist.current = wishlistCount;
      return;
    }
    if (cartCount > prevCart.current) {
      setBagPulse(true);
      const t = window.setTimeout(() => setBagPulse(false), 600);
      prevCart.current = cartCount;
      return () => window.clearTimeout(t);
    }
    prevCart.current = cartCount;
  }, [cartCount, hydrated]);

  useEffect(() => {
    if (!hydrated) {
      prevWishlist.current = wishlistCount;
      return;
    }
    if (wishlistCount > prevWishlist.current) {
      setHeartPulse(true);
      const t = window.setTimeout(() => setHeartPulse(false), 750);
      prevWishlist.current = wishlistCount;
      return () => window.clearTimeout(t);
    }
    prevWishlist.current = wishlistCount;
  }, [wishlistCount, hydrated]);

  if (isImmersive) return null;

  return (
    <header
      className={clsx(
        'fixed top-0 inset-x-0 z-40 transition-shadow duration-300 bg-white',
        scrolled && 'shadow-[0_1px_0_rgba(77,0,21,0.08)]',
      )}
    >
      {/* Top promo strip — rotating Kalki-style announcement */}
      <PromoStrip />

      {/* Row 2 — logo + utility icons. Pothys pattern: logo anchors
          the left, icons cluster at the right, nothing in between so the
          crest gets visual weight. Nav links move to their own row below. */}
      <div>
        <div className="max-w-[1720px] mx-auto pl-6 sm:pl-10 lg:pl-16 pr-4 sm:pr-6 lg:pr-10 py-3 flex items-center justify-between gap-3 sm:gap-5">
          {/* Left: hamburger (mobile only) + logo. */}
          <div className="flex items-center gap-2 min-w-0 ml-[14px]">
            {!SOFT_LAUNCH && (
              <button
                type="button"
                aria-label={menuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((v) => !v)}
                className="group lg:hidden text-ink p-1 -ml-1"
              >
                <span className="inline-flex transition-transform duration-300 ease-out group-hover:scale-110">
                  {menuOpen ? <IconClose /> : <IconMenu />}
                </span>
              </button>
            )}
            <Link
              href="/"
              aria-label="House Of GnanRudh — home"
              className="flex items-center shrink-0 group"
            >
              <span className="font-display text-xl sm:text-2xl md:text-[1.6rem] lg:text-[1.75rem] font-semibold tracking-tight text-ink whitespace-nowrap select-none transition-opacity group-hover:opacity-85">
                House Of GnanRudh
              </span>
            </Link>
          </div>

          {/* Right: utilities (lg+) + icons. On mobile the hamburger
              drawer covers Find a Store, and a search icon still appears
              here so touch users can reach search without opening the
              drawer. */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 lg:gap-4 shrink-0">
            {(() => {
              const findStoreHref = navHref('/shipping');
              const findStoreCls =
                'group hidden lg:flex items-center gap-2 px-2 py-2 text-ink hover:text-scarlet transition-colors whitespace-nowrap leading-none';
              const findStoreContent = (
                <>
                  <span className="inline-flex transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110">
                    <IconStore />
                  </span>
                  <span className="tracking-[0.08em] uppercase text-[0.8rem] font-bold">
                    Find a Store
                  </span>
                </>
              );
              return findStoreHref ? (
                <Link href={findStoreHref} className={findStoreCls}>
                  {findStoreContent}
                </Link>
              ) : (
                <span className={clsx(findStoreCls, 'cursor-default')}>
                  {findStoreContent}
                </span>
              );
            })()}
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="group hidden lg:flex items-center gap-2 px-2 py-2 text-ink hover:text-scarlet transition-colors whitespace-nowrap leading-none"
            >
              <span className="inline-flex transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110">
                <IconSearch />
              </span>
              <span className="tracking-[0.08em] uppercase text-[0.8rem] font-bold">
                Search
              </span>
            </button>
            <button
              type="button"
              aria-label={searchOpen ? 'Close search' : 'Open search'}
              aria-expanded={searchOpen}
              onClick={() => setSearchOpen((v) => !v)}
              className="group lg:hidden p-2 text-ink hover:text-scarlet transition-colors"
            >
              <span className="inline-flex transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110">
                <IconSearch />
              </span>
            </button>
            <AccountMenu />
            {(() => {
              const wishlistHref = navHref('/shop?wishlist=1');
              const wishlistCls =
                'group relative p-2 text-ink hover:text-scarlet transition-colors';
              const wishlistAria = `Wishlist (${hydrated ? wishlistCount : 0} items)`;
              const wishlistContent = (
                <>
                  <span
                    className={clsx(
                      'inline-flex transition-transform duration-300 ease-out group-hover:-translate-y-0.5 group-hover:scale-110 origin-center',
                      heartPulse && 'animate-icon-heartbeat',
                    )}
                  >
                    <IconHeart
                      className={clsx(
                        'transition-[fill,stroke] duration-300',
                        !WISHLIST_DISABLED && hydrated && wishlistCount > 0
                          ? 'fill-maroon stroke-maroon'
                          : 'fill-transparent group-hover:fill-maroon/15',
                      )}
                    />
                  </span>
                  {!WISHLIST_DISABLED && hydrated && wishlistCount > 0 && (
                    <span
                      key={`wishlist-${wishlistCount}`}
                      className="absolute top-0.5 right-0.5 bg-maroon text-ivory text-[0.55rem] leading-none rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold animate-badge-pop"
                    >
                      {wishlistCount > 99 ? '99+' : wishlistCount}
                    </span>
                  )}
                </>
              );
              return wishlistHref ? (
                <Link
                  href={wishlistHref}
                  aria-label={wishlistAria}
                  className={wishlistCls}
                >
                  {wishlistContent}
                </Link>
              ) : (
                <span
                  aria-label={wishlistAria}
                  className={clsx(wishlistCls, 'cursor-default')}
                >
                  {wishlistContent}
                </span>
              );
            })()}
            <button
              type="button"
              onClick={CART_DISABLED ? undefined : openCart}
              aria-label={`Bag (${hydrated ? cartCount : 0} items)`}
              className={clsx(
                'group relative p-2 text-ink hover:text-scarlet transition-colors',
                CART_DISABLED && 'cursor-default',
              )}
            >
              <span
                className={clsx(
                  'inline-flex transition-transform duration-300 ease-out origin-bottom group-hover:-translate-y-0.5 group-hover:scale-110',
                  bagPulse && !CART_DISABLED && 'animate-icon-bounce',
                )}
              >
                <IconBag />
              </span>
              {!CART_DISABLED && (
                <span
                  key={`cart-${hydrated ? cartCount : 0}`}
                  className="absolute top-0.5 right-0.5 bg-maroon text-ivory text-[0.55rem] leading-none rounded-full min-w-4 h-4 px-1 flex items-center justify-center font-bold animate-badge-pop"
                >
                  {hydrated ? (cartCount > 99 ? '99+' : cartCount) : 0}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Row 3 — centered nav links. Dedicated bar, Pothys/Nalli pattern,
          so the catalog surfaces (Kanjeevaram, Banarasi, Shop All, …)
          get their own horizontal lane under the logo/icons. Hidden on
          mobile — the hamburger drawer carries these at small widths. */}
      <nav className="hidden lg:block border-b border-ink/10">
        <div className="max-w-[1720px] mx-auto px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-center gap-5 xl:gap-7 overflow-x-auto no-scrollbar">
          {weaveLinks.map((w) => {
            const active = isLinkActive(w.href, pathname, searchParams);
            const isShopAll = w.label === 'Shop All';
            const isOccasions = w.label === 'Occasions';
            const triggered =
              (isShopAll && openMenuId === 'shop') ||
              (isOccasions && openMenuId === 'occasions');
            const cls =
              w.accent === 'box'
                ? clsx(
                    'px-2.5 py-0.5 text-ivory font-bold',
                    active ? 'bg-maroon' : 'bg-maroon-deep hover:bg-maroon',
                  )
                : active || triggered
                ? 'text-maroon font-bold'
                : w.accent === 'maroon'
                ? 'text-gold-deep font-bold hover:text-scarlet'
                : 'text-ink hover:text-scarlet font-bold';
            const resolvedHref = navHref(w.href);
            const linkCls = clsx(
              'relative text-[0.76rem] tracking-[0.1em] uppercase transition-colors whitespace-nowrap',
              cls,
            );
            const link = resolvedHref ? (
              <Link
                href={resolvedHref}
                aria-current={active ? 'page' : undefined}
                className={linkCls}
              >
                {w.label}
              </Link>
            ) : (
              <span className={clsx(linkCls, 'cursor-default')}>
                {w.label}
              </span>
            );
            if (isShopAll || isOccasions) {
              const id: MegaId = isShopAll ? 'shop' : 'occasions';
              return (
                <div
                  key={w.href + w.label}
                  onMouseEnter={() => openMega(id)}
                  onMouseLeave={closeMega}
                  className="flex items-center"
                >
                  {link}
                </div>
              );
            }
            return <span key={w.href + w.label}>{link}</span>;
          })}
        </div>
      </nav>

      {/* Mega menus — Shop All + Occasions. Rendered inside the fixed
          header so they position relative to it; the shared hover
          handlers (openMega for the matching id, closeMega with delay)
          keep each open while the cursor is over either the trigger or
          the panel. Both wrappers are desktop-only — mobile uses the
          hamburger drawer. */}
      <div
        onMouseEnter={() => openMega('shop')}
        onMouseLeave={closeMega}
        className="hidden lg:block"
      >
        <ShopAllMegaMenu
          open={openMenuId === 'shop'}
          onClose={() => setOpenMenuId(null)}
        />
      </div>
      <div
        onMouseEnter={() => openMega('occasions')}
        onMouseLeave={closeMega}
        className="hidden lg:block"
      >
        <OccasionsMegaMenu
          open={openMenuId === 'occasions'}
          onClose={() => setOpenMenuId(null)}
        />
      </div>

      {/* Search panel — slides in from the right when the search icon is
          clicked. Mirrors the Nalli / Pothys pattern: a search bar at the
          top, "Popular Choices" quick-filter pills on the left, and a
          "Recommended for You" product rail on the right. Esc or
          backdrop click dismisses. */}
      <div
        className={clsx(
          'fixed inset-0 z-50 transition-opacity duration-300',
          searchOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!searchOpen}
        data-lenis-prevent
      >
        <div
          className="absolute inset-0 bg-black/40"
          onClick={() => setSearchOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Search"
          className={clsx(
            'absolute top-0 right-0 h-full w-full md:w-[70%] lg:w-[60%] xl:w-[55%] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out',
            searchOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="flex items-center gap-4 px-5 sm:px-8 py-5 border-b border-ink/10">
            <div className="flex-1 min-w-0">
              <AnimatedSearchBar autoFocus={searchOpen} />
            </div>
            <button
              type="button"
              aria-label="Close search"
              onClick={() => setSearchOpen(false)}
              className="shrink-0 flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.1em] text-ink hover:text-maroon transition-colors"
            >
              <span className="hidden sm:inline">Close</span>
              <LuX size={22} strokeWidth={1.8} aria-hidden />
            </button>
          </div>

          <div className="flex-1 min-h-0 overflow-y-auto md:overflow-hidden px-5 sm:px-8 py-6">
            <div className="flex flex-col md:flex-row gap-8 md:gap-10 h-full min-h-0">
              {/* Popular Choices — pills, stacked vertically on desktop. */}
              <section className="md:w-64 shrink-0">
                <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-ink mb-4">
                  Popular Choices
                </h3>
                <ul className="flex flex-wrap md:flex-col gap-2">
                  {POPULAR_CHOICES.map((c) => {
                    const chipCls =
                      'inline-block w-full border border-ink/20 px-4 py-2 text-sm text-ink hover:border-maroon hover:text-maroon transition-colors text-center md:text-left';
                    const resolved = navHref(c.href);
                    return (
                      <li key={c.label}>
                        {resolved ? (
                          <Link
                            href={resolved}
                            onClick={() => setSearchOpen(false)}
                            className={chipCls}
                          >
                            {c.label}
                          </Link>
                        ) : (
                          <span className={clsx(chipCls, 'cursor-default')}>
                            {c.label}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </section>

              {/* Recommended For You — 2-up vertical grid with its own
                  scrollbar so Popular Choices stays visible while the
                  visitor scrolls through products. */}
              <section className="flex-1 min-w-0 flex flex-col min-h-0">
                <h3 className="text-xs font-bold tracking-[0.18em] uppercase text-ink mb-4">
                  Recommended For You
                </h3>
                <div className="grid grid-cols-2 gap-4 overflow-y-auto pr-2 search-rail-scroll">
                  {RECOMMENDED.map((s) => {
                    const resolved = navHref(`/shop/${s.id}`);
                    const tile = (
                      <>
                        <div className="aspect-[3/4] overflow-hidden bg-ink/5">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={s.image}
                            alt={s.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            draggable={false}
                          />
                        </div>
                        <div className="pt-3">
                          <div className="text-sm font-semibold text-ink line-clamp-1">
                            {s.name}
                          </div>
                          <div className="text-sm text-ink/70 mt-1">
                            {formatINR(s.price)}
                          </div>
                        </div>
                      </>
                    );
                    return resolved ? (
                      <Link
                        key={s.id}
                        href={resolved}
                        onClick={() => setSearchOpen(false)}
                        className="group"
                      >
                        {tile}
                      </Link>
                    ) : (
                      <span key={s.id} className="group cursor-default">
                        {tile}
                      </span>
                    );
                  })}
                </div>
              </section>
            </div>
          </div>
        </aside>
      </div>

      {/* Mobile drawer — slides in from the left. Holds the section
          tiers + every weave link + Find a Store + search, since all of
          those are hidden in the top bar at sub-md widths. Surface is
          brand maroon (deep variant) so the drawer reads as a brand
          chamber rather than a generic dark overlay. */}
      <div
        className={clsx(
          'fixed inset-0 z-50 lg:hidden transition-opacity duration-300',
          menuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none',
        )}
        aria-hidden={!menuOpen}
        data-lenis-prevent
      >
        <div
          className="absolute inset-0 bg-black/55"
          onClick={() => setMenuOpen(false)}
        />
        <aside
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className={clsx(
            'absolute top-0 left-0 h-full w-[86%] max-w-[340px] bg-maroon-deep text-ivory shadow-2xl flex flex-col transition-transform duration-300 ease-out',
            menuOpen ? 'translate-x-0' : '-translate-x-full',
          )}
        >
          <div className="flex items-center justify-between px-5 py-4 border-b border-ivory/10 shrink-0">
            <span className="text-[0.75rem] tracking-[0.3em] uppercase text-gold-soft font-semibold">
              Menu
            </span>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="w-9 h-9 flex items-center justify-center text-ivory/85 hover:text-ivory transition-colors"
            >
              <IconClose />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-5">
            {sectionLinks.length > 0 && (
              <>
                <div className="text-[0.72rem] tracking-[0.3em] uppercase text-ivory/55 font-semibold mb-3">
                  Shop by occasion
                </div>
                <nav className="flex flex-col mb-7">
                  {sectionLinks.map((l) => {
                    const cls =
                      'text-base font-semibold tracking-wide uppercase text-ivory py-2.5 border-b border-ivory/10 hover:text-gold transition-colors';
                    const resolved = navHref(l.href);
                    return resolved ? (
                      <Link
                        key={l.href}
                        href={resolved}
                        onClick={() => setMenuOpen(false)}
                        className={cls}
                      >
                        {l.label}
                      </Link>
                    ) : (
                      <span
                        key={l.href}
                        className={clsx(cls, 'cursor-default')}
                      >
                        {l.label}
                      </span>
                    );
                  })}
                </nav>
              </>
            )}

            <div className="text-[0.72rem] tracking-[0.3em] uppercase text-ivory/55 font-semibold mb-3">
              Browse
            </div>
            <nav className="flex flex-col mb-7">
              {weaveLinks.map((w) => {
                const active = isLinkActive(w.href, pathname, searchParams);
                const drawerCls = clsx(
                  'text-sm tracking-[0.1em] uppercase py-2 border-b border-ivory/10 transition-colors',
                  active
                    ? 'text-gold font-bold bg-ivory/[0.06] -mx-5 px-5'
                    : w.accent === 'maroon'
                    ? 'text-gold font-semibold'
                    : 'text-ivory/90 hover:text-gold',
                );
                const resolved = navHref(w.href);
                return resolved ? (
                  <Link
                    key={w.href + w.label}
                    href={resolved}
                    onClick={() => setMenuOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    className={drawerCls}
                  >
                    {w.label}
                  </Link>
                ) : (
                  <span
                    key={w.href + w.label}
                    className={clsx(drawerCls, 'cursor-default')}
                  >
                    {w.label}
                  </span>
                );
              })}
            </nav>

            {(() => {
              const storeCls =
                'inline-flex items-center gap-2 text-sm text-ivory/85 hover:text-gold transition-colors';
              const resolved = navHref('/shipping');
              return resolved ? (
                <Link
                  href={resolved}
                  onClick={() => setMenuOpen(false)}
                  className={storeCls}
                >
                  <IconStore />
                  Find a Store
                </Link>
              ) : (
                <span className={clsx(storeCls, 'cursor-default')}>
                  <IconStore />
                  Find a Store
                </span>
              );
            })()}
          </div>
        </aside>
      </div>

    </header>
  );
}

/* — Icons — */

// Nav icon set — Lucide via react-icons. Using a real library instead of
// hand-drawn SVGs keeps stroke weight, corner radius and proportions
// consistent across the whole bar.
//
// Heart note: react-icons Lucide SVGs bake in `fill="none"` on the
// <svg>. Tailwind `fill-*` utilities applied via className override that
// attribute (CSS beats presentation attributes on specificity), so the
// filled-when-wishlist-has-items state still works without any prop
// gymnastics at the call site.
function IconStore() {
  return <PiStorefront size={22} aria-hidden />;
}

function IconHeart({ className }: { className?: string }) {
  return <LuHeart size={20} strokeWidth={2} aria-hidden className={className} />;
}

function IconBag() {
  return <LuShoppingBag size={20} strokeWidth={2} aria-hidden />;
}

function IconSearch() {
  return <LuSearch size={20} strokeWidth={2} aria-hidden />;
}

function IconMenu() {
  return <LuMenu size={22} strokeWidth={1.8} aria-hidden />;
}

function IconClose() {
  return <LuX size={22} strokeWidth={1.8} aria-hidden />;
}
