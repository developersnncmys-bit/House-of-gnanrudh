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
  // slots so each filter state remembers its own scroll depth. Saves
  // one final time on unmount so forward-nav snapshots the leaving page.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const key = () =>
      `scroll:${window.location.pathname}${window.location.search}`;
    let raf = 0;
    const save = () => {
      try {
        sessionStorage.setItem(key(), String(window.scrollY));
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

  // Back / forward navigation (POP) → restore the saved scroll for
  // the target url. Deferred behind two rAFs + a 120ms retry so the
  // new DOM has time to lay out enough height for the target Y to be
  // reachable; snapping synchronously here would clamp to 0 when the
  // page hadn't rendered yet.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!popRef.current) return;
    popRef.current = false;
    const key = `scroll:${window.location.pathname}${window.location.search}`;
    const targetY = Number(sessionStorage.getItem(key) ?? 0);
    const apply = () => {
      const lenis = window.__lenis;
      if (lenis) lenis.scrollTo(targetY, { immediate: true });
      else window.scrollTo(0, targetY);
    };
    const r1 = requestAnimationFrame(() => {
      const r2 = requestAnimationFrame(apply);
      (apply as unknown as { _r2?: number })._r2 = r2;
    });
    const t = window.setTimeout(apply, 120);
    return () => {
      cancelAnimationFrame(r1);
      const r2 = (apply as unknown as { _r2?: number })._r2;
      if (r2) cancelAnimationFrame(r2);
      window.clearTimeout(t);
    };
  }, [pathname]);
  // The journey long-read (/journey) is a self-contained cinematic
  // experience that ends with its own closing panel — no global nav
  // and no footer. `/` is the main home and keeps the global chrome.
  const immersive = pathname === '/journey';
  const showFooter = !immersive;
  // Nav stacks promo strip (~36px min-h) + main row (py-1 wrapping a
  // tall logo image) + 1px bottom border + a desktop-only sub-row
  // (Row 3: `hidden lg:block` with py-3 + ~12px text + 1px border ≈
  // 37px). Logo image is `h-16 sm:h-[72px] md:h-20 lg:h-[88px]`.
  //   base:  36 + (64 + 8) + 1            ≈ 109 → pt-[112px]
  //   sm:    36 + (72 + 8) + 1            ≈ 117 → pt-[120px]
  //   md:    36 + (80 + 8) + 1            ≈ 125 → pt-[128px]
  //   lg:    36 + (88 + 8) + 1 + 37       ≈ 170 → pt-[174px]
  // Spacer background must match the nav's own background (nav is
  // bg-bone) — otherwise a visible stripe appears between the nav's
  // bottom border and the first page section.
  const mainClass = immersive
    ? ''
    : 'pt-[112px] sm:pt-[120px] md:pt-[128px] lg:pt-[174px] bg-bone';

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
