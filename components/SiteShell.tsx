'use client';

import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import BackToTop from '@/components/BackToTop';
import Preloader from '@/components/Preloader';
import LoginModal from '@/components/auth/LoginModal';
import AddressModal from '@/components/checkout/AddressModal';
import CartDrawer from '@/components/shop/CartDrawer';
import CheckoutPopup from '@/components/checkout/CheckoutPopup';
import Toaster from '@/components/shop/Toaster';
import { useAudio } from '@/components/AudioProvider';
import { LoginModalProvider } from '@/lib/login-modal';
import { AddressProvider } from '@/lib/addresses';
import { OrdersProvider } from '@/lib/orders';
import { CartDrawerProvider } from '@/lib/cart-drawer';
import { CheckoutModalProvider } from '@/lib/checkout-modal';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { markEntered } = useAudio();

  // Show the Preloader only when the initial pathname is `/` (the home
  // page). SiteShell stays mounted across SPA navigations, so `useState`
  // with an initializer captures the entry route exactly once; refreshing
  // `/shop` etc. mounts SiteShell fresh with a non-`/` pathname and
  // skips the preloader entirely.
  const [showPreloader] = useState(() => pathname === '/');
  useEffect(() => {
    markEntered();
  }, [markEntered]);

  // Disable the browser's automatic scroll restoration — we drive it
  // ourselves below because Lenis owns scroll position and the browser's
  // native remembering doesn't go through the smooth-scroll library.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Track whether the pending navigation came from the browser's back /
  // forward buttons (POP). `popstate` fires before the pathname effect
  // runs, so the flag is set when the restore effect wakes up.
  const popRef = useRef(false);
  useEffect(() => {
    const onPop = () => {
      popRef.current = true;
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  // Save current scroll position continuously (throttled to rAF), keyed
  // by the FULL url (pathname + search). Filter changes get their own
  // slots so each filter state remembers its own scroll depth.
  //
  // IMPORTANT — this MUST be a useLayoutEffect, not useEffect. When
  // pathname changes, React runs the scroll-to-top useLayoutEffect
  // (further down) in the commit phase, BEFORE useEffect cleanups. If
  // we save in a useEffect cleanup, scrollY has already been zeroed by
  // the scroll-to-top, so we'd persist 0 for the leaving page and the
  // back button would land at the top. useLayoutEffect cleanups run
  // first, so we capture the real pre-navigation scrollY.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    // Capture the key ONCE at effect setup. If we read window.location
    // inside save(), the cleanup run (which fires on pathname change)
    // would read the NEW url — because history has already updated by
    // the time React's useLayoutEffect cleanup runs — and we'd write
    // the leaving page's scrollY under the arriving page's key. Net
    // result: the position we want to restore on Back is gone, and
    // Back lands at the top of the home page every time.
    const effectKey = `scroll:${window.location.pathname}${window.location.search}`;
    let raf = 0;
    const save = () => {
      try {
        sessionStorage.setItem(effectKey, String(window.scrollY));
      } catch {}
    };
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        save();
        raf = 0;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (raf) cancelAnimationFrame(raf);
      save();
    };
  }, [pathname]);

  // Forward navigation → snap to top SYNCHRONOUSLY before the browser
  // paints the new page. useEffect runs after paint, which left the
  // new route briefly displayed at the previous page's scroll depth
  // (visible as pages "opening from the middle"). useLayoutEffect
  // fires in the commit phase so the reset lands before first paint.
  // Filter-only changes (router.replace with scroll:false) keep the
  // pathname identical and don't retrigger this effect.
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return;
    if (popRef.current) return; // POP handled by the effect below
    const lenis = window.__lenis;
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  // Back / forward navigation (POP) → restore the saved scroll for the
  // target url. The hard part is that below-the-fold content (hero
  // image, product rails with lazy images, async-rendered sections) may
  // still be laying out when this effect fires, so scrollHeight is too
  // small for the target Y and the browser clamps us to the current
  // max. Strategy: attempt immediately, then on every rAF for up to ~1s,
  // bailing out as soon as scrollY actually matches the target (or the
  // page has clearly grown past it). This way slow-loading pages still
  // land back where the shopper left off instead of near the top.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!popRef.current) return;
    popRef.current = false;
    const key = `scroll:${window.location.pathname}${window.location.search}`;
    const targetY = Number(sessionStorage.getItem(key) ?? 0);
    if (!targetY) return;

    let cancelled = false;
    let attemptsLeft = 40; // ~640ms at 16ms/frame; enough for lazy rails

    const apply = () => {
      if (cancelled) return;
      const maxY =
        document.documentElement.scrollHeight - window.innerHeight;
      const y = Math.min(targetY, Math.max(0, maxY));
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(y, { immediate: true });
      else window.scrollTo(0, y);

      // Done if we reached the target OR the page can't grow any taller
      // (maxY stopped increasing and we're clamped — accept the clamp).
      if (Math.abs(window.scrollY - targetY) < 2) return;
      if (maxY < targetY && attemptsLeft > 0) {
        attemptsLeft -= 1;
        requestAnimationFrame(apply);
      }
    };

    // First attempt after 2 rAFs (give React paint a tick), then the
    // loop above keeps re-trying while content grows.
    const r1 = requestAnimationFrame(() => {
      if (cancelled) return;
      requestAnimationFrame(apply);
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(r1);
    };
  }, [pathname]);
  // The journey long-read (/journey) is a self-contained cinematic
  // experience that ends with its own closing panel — no global nav
  // and no footer. `/` is the main home and keeps the global chrome.
  const immersive = pathname === '/journey';
  const showFooter = !immersive;
  // Nav stacks promo strip (~36px min-h) + main row (py-[6px] wrapping a
  // tall logo image) + 1px bottom border + a desktop-only sub-row
  // (Row 3: `hidden lg:block` with py-3 + ~12px text + 1px border ≈
  // 37px). Logo image is `h-11 sm:h-[64px] md:h-[72px] lg:h-[76px]`.
  //   base:  36 + (44 + 12) + 1           ≈  93 → pt-[96px]
  //   sm:    36 + (64 + 12) + 1           ≈ 113 → pt-[120px]
  //   md:    36 + (72 + 12) + 1           ≈ 121 → pt-[128px]
  //   lg:    36 + (76 + 12) + 1 + 37      ≈ 162 → pt-[174px]
  // Spacer background must match the nav's own background (nav is
  // bg-bone) — otherwise a visible stripe appears between the nav's
  // bottom border and the first page section.
  const mainClass = immersive
    ? ''
    : 'pt-[96px] sm:pt-[120px] md:pt-[128px] lg:pt-[174px] bg-bone';

  return (
    <LoginModalProvider>
      <AddressProvider>
        <OrdersProvider>
        <CartDrawerProvider>
          <CheckoutModalProvider>
            <Nav />
            <main className={mainClass}>{children}</main>
            {showFooter && <Footer />}
            {!immersive && <BackToTop />}
            <LoginModal />
            <CartDrawer />
            <CheckoutPopup />
            <AddressModal />
            <Toaster />
            {showPreloader && <Preloader />}
          </CheckoutModalProvider>
        </CartDrawerProvider>
        </OrdersProvider>
      </AddressProvider>
    </LoginModalProvider>
  );
}
