'use client';

import { useEffect, useState } from 'react';
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

  // Disable the browser's automatic scroll restoration once on mount —
  // we drive scroll position ourselves below. history.scrollRestoration
  // = 'manual' prevents the browser from "remembering" where you were on
  // a page when you return to it via back/forward.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
  }, []);

  // Scroll to top on every route change. Without this, navigating from a
  // mid-scroll position on page A to page B (via a <Link>) leaves the
  // visitor halfway down page B — Lenis holds the previous scroll value
  // and Next.js's default scroll-to-top doesn't cover smooth-scroll
  // libraries. We call lenis.scrollTo(0, { immediate: true }) when the
  // smooth-scroll instance is mounted, and fall back to a plain
  // window.scrollTo otherwise.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const lenis = window.__lenis;
    if (lenis) {
      lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo(0, 0);
    }
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
  // Spacer is plain white so it matches the nav's own background (nav is
  // bg-white). Using bg-ivory here would paint a visible cream stripe
  // between the nav's bottom border and the first page section.
  const mainClass = immersive
    ? ''
    : 'pt-[112px] sm:pt-[120px] md:pt-[128px] lg:pt-[174px] bg-white';

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
