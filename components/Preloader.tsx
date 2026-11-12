'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

// Preloader is mounted only on the first page-load splash. Progress bar
// at the bottom has been retired — the wordmark now carries the full
// reveal via a clip-path sweep + gentle fade/scale.
const DURATION_MS = 2200;
const FADE_MS = 500;

export default function Preloader() {
  const [mounted, setMounted] = useState(false);
  const [fading, setFading] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    document.body.style.overflow = 'hidden';
    const t = window.setTimeout(() => {
      setFading(true);
      window.setTimeout(() => {
        setDone(true);
        document.body.style.overflow = '';
      }, FADE_MS);
    }, DURATION_MS);
    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = '';
    };
  }, [mounted]);

  // Never unmount — even after fade completes. Returning null from this
  // component while GSAP/Lenis are mutating sibling DOM raised
  // `NotFoundError: Failed to execute 'insertBefore'` in React's
  // reconciler. Stay mounted, just become invisible and click-through.
  return (
    <div
      className="fixed inset-0 z-[200] bg-maroon-deep overflow-hidden transition-opacity"
      style={{
        transitionDuration: `${FADE_MS}ms`,
        opacity: !mounted ? 1 : fading ? 0 : 1,
        pointerEvents: done ? 'none' : 'auto',
        visibility: done ? 'hidden' : 'visible',
      }}
      aria-hidden
    >
      {/* Centre brand wordmark — two-stage reveal:
            1. Clip-path sweeps the glyphs in from left → right (1.6s)
            2. The whole wordmark gently fades + eases up from scale 0.96
          Timings are shorter than DURATION_MS so the reveal settles
          before the preloader fades out. */}
      <div className="absolute inset-0 flex items-center justify-center px-6">
        <div className="flex flex-col items-center">
          <Image
            src="/footer-logo.png"
            alt="House Of GnanRudh"
            width={320}
            height={320}
            priority
            draggable={false}
            className="preloader-wordmark h-40 sm:h-48 md:h-56 lg:h-64 w-auto select-none"
          />
        </div>
      </div>

      <style>{`
        @keyframes preloaderSweep {
          0%   { clip-path: inset(0 100% 0 0); opacity: 0; transform: translateY(6px) scale(0.96); }
          40%  { opacity: 1; }
          100% { clip-path: inset(0 0 0 0);   opacity: 1; transform: translateY(0)   scale(1); }
        }
        .preloader-wordmark {
          clip-path: inset(0 100% 0 0);
          animation: preloaderSweep 1600ms cubic-bezier(0.22, 1, 0.36, 1) 150ms forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .preloader-wordmark {
            clip-path: inset(0 0 0 0);
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}
