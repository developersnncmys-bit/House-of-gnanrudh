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
import { useAudio } from '@/components/AudioProvider';
import { LoginModalProvider } from '@/lib/login-modal';
import { AddressProvider } from '@/lib/addresses';
import { OrdersProvider } from '@/lib/orders';
import { CartDrawerProvider } from '@/lib/cart-drawer';
import { CheckoutModalProvider } from '@/lib/checkout-modal';

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { markEntered } = useAudio();

  // Show the Preloader only when the initial pathname is `/home`. The
  // root `/` server-redirects there, so the splash plays on first visit
  // to the site. SiteShell stays mounted across SPA navigations, so
  // `useState` with an initializer captures the entry route exactly
  // once; refreshing `/shop` etc. mounts SiteShell fresh with a non-
  // `/home` pathname and skips the preloader entirely.
  const [showPreloader] = useState(() => pathname === '/home');
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
  // Both the story page (/) and the journey long-read (/journey) are
  // self-contained cinematic experiences that end with their own closing
  // panel — no global nav and no footer.
  const immersive = pathname === '/' || pathname === '/journey';
  const showFooter = !immersive;
  // Nav stacks promo strip (~44px min) + main row (logo + py-3) + 1px
  // bottom border. Sub-row has been removed — all nav links sit in the
  // main row. Logo scales h-7 → h-10 across breakpoints.
  //   base:  44 + (28 + 24) + 1 ≈  97 → pt-[97px]
  //   sm:    44 + (32 + 24) + 1 ≈ 101 → pt-[101px]
  //   md:    44 + (36 + 24) + 1 ≈ 105 → pt-[105px]
  //   lg:    44 + (40 + 24) + 1 ≈ 109 → pt-[109px]
  // Spacer is plain white so it matches the nav's own background (nav is
  // bg-white). Using bg-ivory here would paint a visible cream stripe
  // between the nav's bottom border and the first page section.
  const mainClass = immersive
    ? ''
    : 'pt-[97px] sm:pt-[101px] md:pt-[105px] lg:pt-[109px] bg-white';

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
            {showPreloader && <Preloader />}
          </CheckoutModalProvider>
        </CartDrawerProvider>
        </OrdersProvider>
      </AddressProvider>
    </LoginModalProvider>
  );
}
