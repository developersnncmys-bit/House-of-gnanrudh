'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useScrollLock } from '@/lib/scroll-lock';

// Session-scoped so a single browse session sees it once; sessionStorage
// (not localStorage) means it returns on a fresh tab — appropriate for a
// promotion-of-the-week banner, not a one-time onboarding screen.
const STORAGE_KEY = 'tridha-promo-splash-dismissed';
const DELAY_MS = 4200;

export default function PromoSplash() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [closing, setClosing] = useState(false);

  // The journey long-read owns the viewport and shouldn't be interrupted
  // by a marketing dialog. /journey is hidden from nav but still routable —
  // skip there for the same reason.
  const immersive = pathname === '/journey';

  useEffect(() => {
    if (immersive) return;
    try {
      if (sessionStorage.getItem(STORAGE_KEY) === '1') return;
    } catch {
      /* private mode — fall through and just show it */
    }
    const t = setTimeout(() => setOpen(true), DELAY_MS);
    return () => clearTimeout(t);
  }, [immersive]);

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dismiss();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const dismiss = () => {
    try {
      sessionStorage.setItem(STORAGE_KEY, '1');
    } catch {
      /* private mode — silent */
    }
    setClosing(true);
    setTimeout(() => {
      setOpen(false);
      setClosing(false);
    }, 240);
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center px-4 py-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="promo-title"
      data-lenis-prevent
    >
      <button
        type="button"
        aria-label="Close promotion"
        onClick={dismiss}
        className={`absolute inset-0 bg-[#1B0E0A]/75 backdrop-blur-sm transition-opacity duration-300 ${
          closing ? 'opacity-0' : 'opacity-100'
        }`}
      />

      <div
        className={`relative w-full max-w-[860px] aspect-[16/10] max-h-[78vh] overflow-hidden shadow-2xl bg-ink transition-all duration-300 ${
          closing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
      >
        {/* Full-bleed hero photograph — no side panel, no scrim */}
        <Image
          src="/blog/nivi-style2.webp"
          alt=""
          fill
          sizes="(max-width: 768px) 100vw, 860px"
          priority={false}
          className="object-cover object-[70%_18%]"
        />

        {/* Text content sits directly on the image, bottom-left.
            Text-shadow handles legibility instead of a dark overlay. */}
        <div
          className="absolute inset-x-0 bottom-0 p-6 md:p-9 lg:p-10 text-ivory max-w-[560px]"
          style={{
            textShadow:
              '0 2px 12px rgba(0,0,0,0.55), 0 0 2px rgba(0,0,0,0.4)',
          }}
        >
          <div className="text-[0.6rem] md:text-[0.65rem] tracking-[0.4em] uppercase text-gold">
            New Arrivals · Festive 2026
          </div>
          <h2
            id="promo-title"
            className="mt-2 font-display font-semibold text-3xl md:text-4xl lg:text-5xl leading-[1.05]"
          >
            The Festive Edit
          </h2>
          <p className="mt-3 text-xs md:text-[0.9rem] text-ivory leading-relaxed max-w-[42ch]">
            A new chapter of hand-loomed heirlooms — Paithani, Kanjeevaram and Banarasi, photographed across the atelier floor.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              href="/shop?sort=new"
              onClick={dismiss}
              className="inline-flex items-center gap-2 bg-ivory text-ink px-5 py-2.5 text-xs font-semibold tracking-[0.15em] uppercase hover:bg-gold hover:text-ink transition-colors"
              style={{ textShadow: 'none' }}
            >
              Explore Collection
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs tracking-[0.18em] uppercase text-ivory hover:text-gold underline underline-offset-4 px-2 py-2"
            >
              Not now
            </button>
          </div>
        </div>

        {/* Close */}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute top-3 right-3 z-20 w-8 h-8 flex items-center justify-center text-ivory/90 hover:text-ivory bg-ink/40 hover:bg-ink/70 backdrop-blur-sm transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
            <path d="m6 6 12 12M18 6 6 18" />
          </svg>
        </button>
      </div>
    </div>
  );
}
