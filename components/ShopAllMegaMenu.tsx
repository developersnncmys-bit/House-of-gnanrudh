'use client';

import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';

/**
 * ShopAllMegaMenu — Kalki-style mega menu that opens when the user
 * hovers "Shop All" in the nav. Left sidebar lists group labels (hover
 * to switch); right side shows a grid of image tiles for the active
 * group. Each tile deep-links to the shop with the right filter.
 *
 * Positioning / visibility are owned by the parent (Nav) — this
 * component just paints the panel and handles group switching.
 */

type Tile = { label: string; href: string; image?: string };
type Group = { id: string; label: string; tiles: Tile[] };

const GROUPS: Group[] = [
  {
    id: 'weaves',
    label: 'Shop by Weave',
    tiles: [
      { label: 'Kanjeevaram', href: '/shop?weave=Kanjivaram', image: '/Byweaves/kanjeevaram.webp' },
      { label: 'Banarasi', href: '/shop?weave=Banarasi', image: '/Byweaves/banarasi.webp' },
      { label: 'Mysore Silk', href: '/shop?weave=Mysore+Silk', image: '/Byweaves/Mysore silk.webp' },
      { label: 'Mangalagiri', href: '/shop?weave=Mangalagiri', image: '/Byweaves/mangalagiri.webp' },
      { label: 'Pochampally', href: '/shop?weave=Pochampally', image: '/Byweaves/Pochampally.webp' },
      { label: 'Gadwal', href: '/shop?weave=Gadwal', image: '/Byweaves/Gadwal.webp' },
      { label: 'Patola', href: '/shop?weave=Patola', image: '/Byweaves/Patola.webp' },
      { label: 'Fancy Sarees', href: '/shop?weave=Fancy+Sarees', image: '/Byweaves/fancy-saree.webp' },
      { label: 'Mixed Pattu', href: '/shop?weave=Mixed+Pattu+Sarees', image: '/Byweaves/Mixed-pattu.webp' },
    ],
  },
  {
    id: 'occasions',
    label: 'Shop by Occasion',
    tiles: [
      { label: 'Bridal', href: '/shop?tier=bridal', image: '/bestsellers/Mayura kanjee.webp' },
      { label: 'Festive', href: '/shop?tier=festive', image: '/bestsellers/Rasleela patola2.webp' },
      { label: 'Everyday', href: '/shop?tier=everyday', image: '/Byweaves/mangalagiri.webp' },
    ],
  },
  {
    id: 'price',
    label: 'Shop by Price',
    // Price buckets use ?minPrice / ?maxPrice query params. If the shop
    // view doesn't yet filter on these, the links still land on /shop
    // with the params preserved for whenever the filter wiring lands.
    tiles: [
      { label: 'Under ₹10,000', href: '/shop?maxPrice=10000', image: '/Byweaves/mangalagiri.webp' },
      { label: '₹10,000 – ₹25,000', href: '/shop?minPrice=10000&maxPrice=25000', image: '/Byweaves/Mysore silk.webp' },
      { label: '₹25,000 – ₹50,000', href: '/shop?minPrice=25000&maxPrice=50000', image: '/Byweaves/kanjeevaram.webp' },
      { label: '₹50,000 – ₹1,00,000', href: '/shop?minPrice=50000&maxPrice=100000', image: '/bestsellers/Mayura kanjee.webp' },
      { label: 'Above ₹1,00,000', href: '/shop?minPrice=100000', image: '/bestsellers/Rasleela patola2.webp' },
    ],
  },
  {
    id: 'collections',
    label: 'Collections',
    tiles: [
      { label: 'New Arrivals', href: '/shop?sort=new', image: '/newarrivals/neelambari kanjivaram.webp' },
      { label: 'Best Sellers', href: '/shop?sort=bestseller', image: '/bestsellers/Mayura kanjee.webp' },
      { label: 'On Sale', href: '/shop?sale=1', image: '/newarrivals/rangraj patola.webp' },
    ],
  },
];

export default function ShopAllMegaMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [activeId, setActiveId] = useState(GROUPS[0].id);
  const active = GROUPS.find((g) => g.id === activeId) ?? GROUPS[0];

  return (
    <div
      className={clsx(
        'absolute left-0 right-0 top-full bg-white border-t border-ink/10 shadow-[0_12px_28px_-12px_rgba(77,0,21,0.18)] transition-all duration-200 origin-top',
        open
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 -translate-y-2 pointer-events-none',
      )}
      aria-hidden={!open}
      data-lenis-prevent
    >
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10 py-6 flex gap-8">
        {/* Left sidebar — hover any row to change the right grid.
            `self-start` keeps it pinned to the top while the right grid
            scrolls underneath. */}
        <aside className="w-60 shrink-0 pr-6 self-start">
          <nav className="flex flex-col">
            {GROUPS.map((g) => {
              const isActive = g.id === activeId;
              return (
                <button
                  key={g.id}
                  type="button"
                  onMouseEnter={() => setActiveId(g.id)}
                  onFocus={() => setActiveId(g.id)}
                  className={clsx(
                    'text-left py-2.5 text-[0.85rem] tracking-[0.1em] uppercase font-semibold transition-colors',
                    isActive ? 'text-gold-deep' : 'text-ink hover:text-gold-deep',
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Right grid — image tiles for the active group. Capped at
            ~55vh so the panel never dominates the viewport; overflows
            scroll inside the grid while the sidebar stays in view. */}
        <div className="flex-1 max-h-[55vh] overflow-y-auto overscroll-contain pr-2 -mr-2 grid grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 content-start">
          {active.tiles.map((t) => (
            <Link
              key={t.label}
              href={t.href}
              onClick={onClose}
              className="group"
            >
              <div className="relative aspect-square overflow-hidden bg-ivory img-fallback">
                {t.image && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={t.image}
                    alt={t.label}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    draggable={false}
                    loading="lazy"
                  />
                )}
              </div>
              <p className="mt-2 text-[0.78rem] tracking-[0.1em] uppercase text-ink group-hover:text-maroon transition-colors text-center font-medium">
                {t.label}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
