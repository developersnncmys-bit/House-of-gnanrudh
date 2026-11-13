'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import { SAREES, formatINR } from '@/lib/sarees';
import WishlistButton from '@/components/shop/WishlistButton';
import { navHref } from '@/lib/soft-launch';

const bestSellerIds = [
  'banarasi-raktarani',
  'kanjivaram-mayura',
  'fancy-haldi',
  'patola-rasleela',
  'mysore-chandrika',
  'mixedpattu-katha',
  'mangalagiri-megha',
  'pochampally-aakash',
  'banarasi-jamawar',
  'mysore-tara',
];

// Override images for matched products with the dedicated bestsellers shots.
// Unmatched ids fall back to the catalog's `saree.image`.
const bestSellerImages: Record<string, string> = {
  'banarasi-raktarani': '/bestsellers/raktharani%20banarasi.webp',
  'kanjivaram-mayura': '/bestsellers/Mayura%20kanjee.webp',
  'fancy-haldi': '/Partysarees/P1.webp',
  'patola-rasleela': '/bestsellers/Rasleela%20patola2.webp',
  'mysore-chandrika': '/bestsellers/chandrika%20mysuru.webp',
  'mixedpattu-katha': '/bestsellers/katha%20baluchari.webp',
};

function ProductCard({ saree }: { saree: (typeof SAREES)[number] }) {
  const discount =
    saree.mrp > saree.price
      ? Math.round(((saree.mrp - saree.price) / saree.mrp) * 100)
      : 0;

  // Soft-launch: product pages aren't reachable yet. Each Link below
  // becomes an inert span wrapper when navHref returns undefined.
  const productHref = navHref(`/shop/${saree.id}`);
  const CardTag = productHref ? Link : 'span';
  const cardProps = productHref
    ? { href: productHref, className: 'block group' }
    : { className: 'block group cursor-default' };

  return (
    <div className="shrink-0 w-[230px] sm:w-[260px] md:w-[290px] lg:w-[320px] snap-start">
      <CardTag {...(cardProps as { href: string; className: string })}>
        {/* Plain rectangular product card, slight rounded corners. */}
        <div className="relative overflow-hidden bg-bone aspect-[4/5] rounded-sm">
          <Image
            src={bestSellerImages[saree.id] ?? saree.image}
            alt={saree.name}
            fill
            sizes="(max-width: 640px) 46vw, (max-width: 1024px) 32vw, 270px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      </CardTag>

      {/* Add-to-cart row — underlined label on the left, wishlist heart
          on the right. Sits directly under the arch image with a hairline
          divider so it reads as a quiet utility strip, not a loud CTA. */}
      <div className="flex items-center justify-between gap-2 border-y border-ink/15 py-2.5 mt-1">
        {productHref ? (
          <Link
            href={productHref}
            className="text-[0.72rem] font-bold tracking-[0.14em] uppercase underline underline-offset-4 text-ink hover:text-maroon transition-colors"
          >
            Add to Cart
          </Link>
        ) : (
          <span className="text-[0.72rem] font-bold tracking-[0.14em] uppercase underline underline-offset-4 text-ink cursor-default">
            Add to Cart
          </span>
        )}
        <WishlistButton
          productId={saree.id}
          className="!bg-transparent !backdrop-blur-none w-7 h-7"
          size={16}
        />
      </div>

      {/* Title + price. Discount pill sits above the name so promotional
          copy stays off the imagery and the photo reads clean. */}
      {productHref ? (
        <Link href={productHref} className="block pt-3 group">
          <TitleBlock saree={saree} discount={discount} />
        </Link>
      ) : (
        <span className="block pt-3 group cursor-default">
          <TitleBlock saree={saree} discount={discount} />
        </span>
      )}
    </div>
  );
}

function TitleBlock({
  saree,
  discount,
}: {
  saree: (typeof SAREES)[number];
  discount: number;
}) {
  return (
    <>
      {discount > 0 && (
        <span className="inline-block bg-maroon-deep text-ivory px-2 py-0.5 text-[0.6rem] font-bold tracking-wider uppercase rounded-sm mb-2">
          {discount}% Off
        </span>
      )}
      <h3 className="text-sm font-semibold text-ink line-clamp-1 mb-1 group-hover:text-maroon transition-colors">
        {saree.name}
      </h3>
      <div className="flex items-baseline gap-2">
        <span className="text-base font-bold text-ink tabular-nums">
          {formatINR(saree.price)}
        </span>
        {saree.mrp > saree.price && (
          <span className="text-xs text-ink/45 line-through tabular-nums">
            {formatINR(saree.mrp)}
          </span>
        )}
      </div>
    </>
  );
}

export default function BestSellers() {
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
    el.scrollBy({ left: dir * (el.clientWidth + 16), behavior: 'smooth' });
  };

  // Category tabs sit above the rail — Pothys pattern. "All" is the
  // default; the others filter the bestseller lineup by weave so the
  // same curated-id list powers every tab.
  type Category = 'all' | 'kanjivaram' | 'mysore' | 'banarasi';
  const categories: { id: Category; label: string; weave: string | null }[] = [
    { id: 'all', label: 'All', weave: null },
    { id: 'kanjivaram', label: 'Kanjeevaram', weave: 'Kanjivaram' },
    { id: 'mysore', label: 'Mysore Silk', weave: 'Mysore Silk' },
    { id: 'banarasi', label: 'Banarasi', weave: 'Banarasi' },
  ];
  const [category, setCategory] = useState<Category>('all');

  const allItems = bestSellerIds
    .map((id) => SAREES.find((s) => s.id === id))
    .filter((s): s is (typeof SAREES)[number] => Boolean(s));
  const currentCategory = categories.find((c) => c.id === category)!;
  const items = currentCategory.weave
    ? allItems.filter((s) => s.weave === currentCategory.weave)
    : allItems;

  return (
    <section className="bg-ivory py-10 md:py-14">
      <div className="max-w-[1720px] mx-auto pl-4 pr-6 sm:pl-6 sm:pr-8 lg:pl-10 lg:pr-10 xl:pl-14">
        <div className="grid gap-8 md:gap-10 md:grid-cols-[minmax(240px,300px)_1fr] items-start">
          {/* Left column — lotus + heading + description + view-all.
              Sticky on md+ so the context stays beside the rail while
              the visitor scrolls the cards or the page. Top offset keeps
              it clear of the fixed nav; extra `pt-*` nudges the block
              down so it doesn't crowd the section's top edge. */}
          <div className="md:pt-32 lg:pt-44">
            <div>
            <Image
              src="/lotus.png"
              alt=""
              width={80}
              height={80}
              className="h-6 sm:h-7 md:h-8 w-auto select-none mb-3"
              draggable={false}
              aria-hidden
            />
            <h2 className="font-display text-3xl md:text-4xl font-bold text-ink mb-3 leading-tight">
              Bestsellers
            </h2>
            <p className="text-sm md:text-base text-ink/70 leading-relaxed">
              Our most-loved pieces, carried home by shoppers who know
              their silks — heirloom weaves from six traditions.
            </p>
            {navHref('/shop?sort=bestseller') ? (
              <Link
                href="/shop?sort=bestseller"
                className="inline-block mt-5 text-sm font-semibold text-ink hover:text-maroon transition-colors underline underline-offset-4"
              >
                View All
              </Link>
            ) : (
              <span className="inline-block mt-5 text-sm font-semibold text-ink underline underline-offset-4 cursor-default">
                View All
              </span>
            )}
            </div>
          </div>

          {/* Right column — category tabs + View All + card rail. */}
          <div className="relative min-w-0">
            {/* Category tabs — Pothys pattern. Each tab is separated by
                a vertical hairline; the active tab is bold ink, inactive
                ones are muted. Tabs filter the bestseller lineup by tier. */}
            <div className="flex items-center justify-end flex-wrap gap-x-5 md:gap-x-7 mb-5">
              {categories.map((c, i) => (
                <div key={c.id} className="flex items-center gap-x-5 md:gap-x-7">
                  <button
                    type="button"
                    onClick={() => setCategory(c.id)}
                    aria-pressed={category === c.id}
                    className={`font-sans text-sm md:text-[0.95rem] tracking-[0.14em] uppercase font-semibold transition-colors whitespace-nowrap ${
                      category === c.id
                        ? 'text-ink underline underline-offset-[10px] decoration-2'
                        : 'text-ink/50 hover:text-ink'
                    }`}
                  >
                    {c.label}
                  </button>
                  {i < categories.length - 1 && (
                    <span className="h-4 w-px bg-ink/25" aria-hidden />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-end mb-8">
              {navHref('/shop?sort=bestseller') ? (
                <Link
                  href="/shop?sort=bestseller"
                  className="text-sm font-semibold text-ink/70 hover:text-maroon transition-colors underline underline-offset-4"
                >
                  View All
                </Link>
              ) : (
                <span className="text-sm font-semibold text-ink/70 underline underline-offset-4 cursor-default">
                  View All
                </span>
              )}
            </div>

            <div
              ref={railRef}
              className="flex gap-4 md:gap-5 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2"
            >
              {items.map((saree) => (
                <ProductCard key={saree.id} saree={saree} />
              ))}
            </div>

            {/* Arrow controls — anchored to the bottom-right of the rail
                so they read as rail chrome, not a floating widget. */}
            <div className="hidden md:flex items-center gap-2 justify-end mt-4">
              <button
                onClick={() => scrollBy(-1)}
                disabled={!canPrev}
                aria-label="Scroll left"
                className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:bg-maroon hover:text-ivory hover:border-maroon disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <LuChevronLeft size={18} strokeWidth={2} aria-hidden />
              </button>
              <button
                onClick={() => scrollBy(1)}
                disabled={!canNext}
                aria-label="Scroll right"
                className="w-10 h-10 rounded-full border border-ink/20 flex items-center justify-center text-ink hover:bg-maroon hover:text-ivory hover:border-maroon disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <LuChevronRight size={18} strokeWidth={2} aria-hidden />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
