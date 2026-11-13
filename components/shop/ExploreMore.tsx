'use client';

import Image from 'next/image';
import Link from 'next/link';

type Block = {
  href: string;
  title: string;
  subtitle: string;
  image: string;
};

const BLOCKS: Block[] = [
  {
    href: '/shop?weave=Kanjivaram',
    title: 'Kanjeevaram Sarees',
    subtitle: 'Silk body · Korvai borders',
    image: '/product/Explore-Kanjeevaram.webp',
  },
  {
    href: '/shop?weave=Patola',
    title: 'Patola Sarees',
    subtitle: 'Double-ikat heritage',
    image: '/product/Explore-patola.webp',
  },
  {
    href: '/shop?weave=Mysore+Silk',
    title: 'Mysore Silk Sarees',
    subtitle: 'Crepe-soft Mysuru silk',
    image: '/product/Explore-Mysoresilk.webp',
  },
  {
    href: '/shop?weave=Pochampally',
    title: 'Pochampally Sarees',
    subtitle: 'Resist-tied ikat geometry',
    image: '/product/Explore-baluchari.webp',
  },
];

export default function ExploreMore() {
  return (
    <section className="bg-white border-t border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <h2 className="text-base md:text-lg font-bold uppercase tracking-wider text-gray-900 mb-4">
          Explore More
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
          {BLOCKS.map((b) => (
            <Link
              key={b.href + b.title}
              href={b.href}
              className="group relative block aspect-[4/3] sm:aspect-[5/4] lg:aspect-[4/5] overflow-hidden bg-gray-100"
            >
              <Image
                src={b.image}
                alt={b.title}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover object-[50%_18%] transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 flex flex-col px-4 pb-4 text-white">
                <div className="text-sm lg:text-base font-bold mb-0.5">{b.title}</div>
                <div className="text-xs text-white/85 mb-2">{b.subtitle}</div>
                <span className="inline-flex items-center gap-1.5 text-[0.65rem] font-bold tracking-wider uppercase">
                  Shop Now
                  <span aria-hidden className="transition-transform group-hover:translate-x-1">→</span>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
