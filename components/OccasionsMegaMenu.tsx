'use client';

import Link from 'next/link';
import { useState } from 'react';
import clsx from 'clsx';

/**
 * OccasionsMegaMenu — Nalli-style nested occasion picker, Kalki-style
 * visuals. Left sidebar lists the top-level occasion groups (Wedding,
 * Festive, Everyday); right grid shows the sub-occasions for whichever
 * group the cursor is on. Mirrors the structure of ShopAllMegaMenu so
 * the two menus feel like one system.
 */

type Tile = { label: string; href: string; image?: string };
type Group = { id: string; label: string; tiles: Tile[] };

const GROUPS: Group[] = [
  {
    id: 'wedding',
    label: 'Wedding',
    tiles: [
      { label: 'Bridal', href: '/shop?tier=bridal', image: '/ocassions/bridal.png' },
      { label: 'Reception', href: '/shop?tier=bridal&occasion=reception', image: '/ocassions/reception.png' },
      { label: 'Engagement', href: '/shop?tier=bridal&occasion=engagement', image: '/ocassions/engagement.png' },
      { label: 'Haldi', href: '/shop?tier=bridal&occasion=haldi', image: '/ocassions/Haldi.png' },
      { label: 'Mehendi', href: '/shop?tier=bridal&occasion=mehendi', image: '/ocassions/Mehendi.png' },
      { label: 'Sangeet', href: '/shop?tier=bridal&occasion=sangeet', image: '/ocassions/Sangeet.png' },
    ],
  },
  {
    id: 'festive',
    label: 'Festive',
    tiles: [
      { label: 'Diwali', href: '/shop?tier=festive&occasion=diwali', image: '/newarrivals/rangraj patola.webp' },
      { label: 'Pongal', href: '/shop?tier=festive&occasion=pongal', image: '/Byweaves/kanjeevaram.webp' },
      { label: 'Navratri', href: '/shop?tier=festive&occasion=navratri', image: '/newarrivals/neelambari kanjivaram.webp' },
      { label: 'Pooja', href: '/shop?tier=festive&occasion=pooja', image: '/bestsellers/chandrika mysuru.webp' },
    ],
  },
  {
    id: 'everyday',
    label: 'Everyday',
    tiles: [
      { label: 'Office', href: '/shop?tier=everyday&occasion=office', image: '/Byweaves/mangalagiri.webp' },
      { label: 'Casual', href: '/shop?tier=everyday&occasion=casual', image: '/Byweaves/Mysore silk.webp' },
      { label: 'Home', href: '/shop?tier=everyday&occasion=home', image: '/Byweaves/Pochampally.webp' },
      { label: 'Travel', href: '/shop?tier=everyday&occasion=travel', image: '/Byweaves/fancy-saree.webp' },
    ],
  },
];

export default function OccasionsMegaMenu({
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
        <aside className="w-60 shrink-0 bg-bone -my-6 -ml-6 lg:-ml-10 py-8 pl-11 lg:pl-[60px] pr-5">
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
                    'text-left py-2.5 text-[0.85rem] tracking-[0.1em] uppercase font-bold transition-colors',
                    isActive ? 'text-gold-deep' : 'text-ink hover:text-gold-deep',
                  )}
                >
                  {g.label}
                </button>
              );
            })}
          </nav>
        </aside>

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
