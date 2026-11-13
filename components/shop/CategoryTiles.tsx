'use client';

import Image from 'next/image';
import Link from 'next/link';

type Tile = {
  href: string;
  title: string;
  caption: string;
  image: string;
  badge?: string;
};

const TILES: Tile[] = [
  {
    href: '/shop?tier=bridal',
    title: 'Bridal Wear',
    caption: 'Wedding-ready bridal silks, woven for the day you keep.',
    image: '/product/bridal.webp',
  },
  {
    href: '/shop?tier=festive',
    title: 'Festive Wear',
    caption: 'Festive & reception sarees — our quickest movers.',
    image: '/product/partywear.webp',
    badge: 'Bestseller',
  },
  {
    href: '/shop?weave=Banarasi',
    title: 'Banarasi Sarees',
    caption: 'Pure pit-loom silks from the looms of Varanasi.',
    image: '/product/banarasi.webp',
  },
];

/**
 * Shop by Category — editorial split-card layout. Each tile is a
 * portrait image on top with a clean white info area below (title,
 * caption, and an "Explore →" link). Replaces the earlier all-image
 * tile with a dark overlay, which fought the site's cream editorial
 * tone.
 */
export default function CategoryTiles() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-10 lg:py-14">
        {/* Section header — centred eyebrow + display title + gold rule */}
        <div className="text-center mb-8 lg:mb-10">
          <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon mb-3">
            Collections
          </div>
          <h2 className="font-display text-2xl md:text-3xl lg:text-[2rem] font-semibold text-ink leading-tight">
            Shop by Category
          </h2>
          <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {TILES.map((tile) => (
            <Link
              key={tile.href + tile.title}
              href={tile.href}
              className="group block bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(77,0,21,0.06)] hover:shadow-[0_10px_30px_rgba(77,0,21,0.12)] transition-shadow duration-300"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                <Image
                  src={tile.image}
                  alt={tile.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {tile.badge && (
                  <div
                    className="absolute top-3 left-3 text-ink px-3 py-1 text-[0.6rem] font-bold tracking-[0.2em] uppercase rounded-sm"
                    style={{
                      backgroundImage:
                        'linear-gradient(135deg, #C8923F 0%, #F2C99E 50%, #C8923F 100%)',
                      boxShadow:
                        '0 1px 2px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.4)',
                    }}
                  >
                    {tile.badge}
                  </div>
                )}
              </div>

              <div className="px-5 py-6 md:px-6 md:py-7 text-center">
                <h3 className="font-display text-lg md:text-xl lg:text-[1.35rem] font-semibold text-ink leading-tight">
                  {tile.title}
                </h3>
                <p className="mt-2 text-sm text-ink/60 leading-relaxed line-clamp-2">
                  {tile.caption}
                </p>
                <span
                  aria-hidden
                  className="block mx-auto h-px w-8 bg-gold/70 my-4"
                />
                <span className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.25em] uppercase text-maroon group-hover:text-maroon-deep transition-colors">
                  Explore
                  <span
                    aria-hidden
                    className="inline-block transition-transform duration-300 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
