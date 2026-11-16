'use client';

import { useEffect } from 'react';
import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  // Scroll-position management on route change lives in SiteShell —
  // it handles both the forward-nav "snap to top" and the back/forward
  // "restore where you were". SmoothScroll just owns Lenis setup.

  useEffect(() => {
    const lenis = new Lenis({
      // Longer interpolation + softer wheel = a slower, glidier feel that
      // makes the pinned story panels read at a reading pace instead of a
      // flick-through pace. Easing is unchanged.
      duration: 1.6,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.7,
      touchMultiplier: 1.2,
    });

    // Expose the instance so the preloader can pause and reset it while the
    // welcome gate plays — otherwise Lenis accumulates wheel/touch deltas
    // during the gate and dumps the visitor mid-story when it dismisses.
    window.__lenis = lenis;

    const onScroll = () => ScrollTrigger.update();
    lenis.on('scroll', onScroll);
    const tick = (time: number) => {
      lenis.raf(time * 1000);
    };
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      lenis.off('scroll', onScroll);
      lenis.destroy();
      if (window.__lenis === lenis) delete window.__lenis;
    };
  }, []);

  return <>{children}</>;
}
