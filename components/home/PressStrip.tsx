'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { SAREES, formatINR, TIERS } from '@/lib/sarees';
import WishlistButton from '@/components/shop/WishlistButton';
import ViewSimilarButton from '@/components/shop/ViewSimilarButton';
import { navHref } from '@/lib/soft-launch';

// Kept at 10 so the desktop view of 5-per-row scrolls cleanly to a second
// page of 5 without showing the previous page's cards again. (At 8, one
// page-scroll was landing the rail at the end and visibly repeating the
// last two cards from page 1.)
const trendingIds = [
  'banarasi-jamawar',
  'mysore-tara',
  'mangalagiri-megha',
  'patola-rasleela',
  'pochampally-aakash',
  'mixedpattu-katha',
  'banarasi-saanjh',
  'kanjivaram-mayura',
  'gadwal-konark',
  'fancy-cocktail',
];

const stockLeft: Record<string, number> = {
  'banarasi-jamawar': 2,
  'mysore-tara': 4,
  'mangalagiri-megha': 1,
  'patola-rasleela': 1,
  'pochampally-aakash': 6,
  'mixedpattu-katha': 3,
  'banarasi-saanjh': 5,
  'kanjivaram-mayura': 2,
  'gadwal-konark': 2,
  'fancy-cocktail': 1,
};

export default function PressStrip() {
  const railRef = useRef<HTMLDivElement | null>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateButtons = useCallback(() => {
    const el = railRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    updateButtons();
    const el = railRef.current;
    if (!el) return;
    el.addEventListener('scroll', updateButtons, { passive: true });
    window.addEventListener('resize', updateButtons);
    return () => {
      el.removeEventListener('scroll', updateButtons);
      window.removeEventListener('resize', updateButtons);
    };
  }, [updateButtons]);

  const scrollBy = (dir: 1 | -1) => {
    const el = railRef.current;
    if (!el) return;
    // Each card uses calc((100% - gaps)/N) so the rail always shows
    // exactly N full cards — advancing by clientWidth lands on the
    // next page cleanly.
    el.scrollBy({ left: dir * (el.clientWidth + 16), behavior: 'smooth' });
  };

  const items = trendingIds
    .map((id) => SAREES.find((s) => s.id === id))
    .filter((s): s is (typeof SAREES)[number] => Boolean(s));

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col items-center text-center mb-4 md:mb-6 gap-2">
          <span className="inline-flex items-center gap-2 bg-maroon/10 text-maroon px-3 py-1.5 text-xs font-bold uppercase tracking-wider">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-maroon opacity-60" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-maroon" />
            </span>
            Low Stock
          </span>
          <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
            Selling fast
          </h2>
          <p className="max-w-xl text-sm md:text-base text-ink/60 leading-relaxed">
            Only a handful left — pieces our shoppers are reaching for this week.
            Once these are gone, each is one of a kind.
          </p>
          {navHref('/shop?sort=trending') ? (
            <Link
              href="/shop?sort=trending"
              className="text-sm font-semibold text-ink hover:text-maroon transition-colors underline underline-offset-4"
            >
              View All
            </Link>
          ) : (
            <span className="text-sm font-semibold text-ink underline underline-offset-4 cursor-default">
              View All
            </span>
          )}
        </div>
        <div className="hidden md:flex items-center justify-end gap-2 mb-4">
          <button
            onClick={() => scrollBy(-1)}
            disabled={!canPrev}
            aria-label="Scroll left"
            className="w-9 h-9 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:bg-maroon-deep hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ‹
          </button>
          <button
            onClick={() => scrollBy(1)}
            disabled={!canNext}
            aria-label="Scroll right"
            className="w-9 h-9 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:bg-maroon-deep hover:text-ivory disabled:opacity-30 disabled:cursor-not-allowed transition-all"
          >
            ›
          </button>
        </div>

        <div
          ref={railRef}
          className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
        >
          {items.map((saree) => {
            const stock = stockLeft[saree.id] ?? 5;
            const tier = TIERS[saree.tier];
            const productHref = navHref(`/shop/${saree.id}`);
            const CardTag = productHref ? Link : 'span';
            const cardProps = productHref
              ? {
                  href: productHref,
                  'data-card': true,
                  className:
                    'group shrink-0 w-[calc((100%-12px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)] xl:w-[calc((100%-64px)/5)] snap-start bg-white',
                }
              : {
                  'data-card': true,
                  className:
                    'group shrink-0 w-[calc((100%-12px)/2)] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)] xl:w-[calc((100%-64px)/5)] snap-start bg-white cursor-default block',
                };
            return (
              <CardTag
                key={saree.id}
                {...(cardProps as { href: string; className: string; 'data-card': true })}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-bone rounded-sm">
                  <Image
                    src={saree.image}
                    alt={saree.name}
                    fill
                    sizes="(max-width: 640px) 46vw, (max-width: 768px) 46vw, (max-width: 1024px) 30vw, (max-width: 1280px) 23vw, 18vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {stock <= 3 ? (
                    <div className="absolute top-2.5 left-2.5 bg-gold-deep text-ivory px-2 py-1 text-[0.65rem] font-bold uppercase tracking-wider rounded-sm">
                      Only {stock} Left
                    </div>
                  ) : (
                    <div className="absolute top-2.5 left-2.5 bg-ivory/95 no-pattern backdrop-blur-sm text-ink px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-wide rounded-sm">
                      {tier.title}
                    </div>
                  )}
                  <WishlistButton
                    productId={saree.id}
                    className="absolute top-2.5 right-2.5 w-9 h-9"
                    size={14}
                  />
                  {/* Add-to-bag pill — revealed on hover, sits at the bottom
                      of the image. Full-width now that the wishlist heart
                      lives at top-right. */}
                  <span className="pointer-events-none absolute left-3 right-3 bottom-3 inline-flex items-center justify-center gap-2 bg-ivory/95 no-pattern backdrop-blur-sm text-ink px-3 py-2 text-[0.7rem] font-bold uppercase tracking-wider rounded-sm opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
                      <line x1="3" y1="6" x2="21" y2="6" />
                      <path d="M16 10a4 4 0 0 1-8 0" />
                    </svg>
                    Add to Bag
                  </span>
                </div>
                <div className="p-3">
                  <div className="text-[0.7rem] text-ink/55 font-medium mb-1">
                    {saree.weave}
                  </div>
                  <h3 className="text-sm font-semibold text-ink leading-snug line-clamp-1 mb-2">
                    {saree.name}
                  </h3>
                  <div className="flex items-end justify-between gap-2">
                    <span className="text-base font-bold text-ink">
                      {formatINR(saree.price)}
                    </span>
                    <ViewSimilarButton
                      productId={saree.id}
                      className="w-8 h-8 shrink-0 !bg-transparent !backdrop-blur-none"
                      size={16}
                    />
                  </div>
                </div>
              </CardTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
