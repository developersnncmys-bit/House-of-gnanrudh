'use client';

/**
 * CategoryBestsellerIntro — compact header for /shop?sort=bestseller.
 * Same minimal-header treatment as the Price / Sale / Tier landings
 * (eyebrow + title + one-line tagline, white background, no lotus).
 */
export default function CategoryBestsellerIntro() {
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-5 md:py-6 text-center">
        <div className="text-[0.62rem] md:text-[0.68rem] tracking-[0.3em] uppercase font-bold text-gold-deep mb-1.5">
          Shop All · Bestsellers
        </div>
        <div
          role="heading"
          aria-level={1}
          className="font-sans text-lg md:text-xl font-extrabold text-ink leading-tight tracking-tight"
        >
          Bestsellers
        </div>
        <p className="mt-1 text-xs md:text-sm text-ink/65">
          The weaves our shoppers reach for first — curated by what&apos;s moving off the shelf.
        </p>
      </div>
    </section>
  );
}
