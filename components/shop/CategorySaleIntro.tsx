'use client';

/**
 * CategorySaleIntro — editorial header for /shop?sale=1. Same visual
 * family as the tier / weave / occasion intros so every category
 * landing in the site reads consistently. Copy leans into the
 * "curated markdown, not a clearance" framing to match the brand voice.
 */
export default function CategorySaleIntro() {
  // Compact header — Sale should read punchy, not editorial.
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-5 md:py-6 text-center">
        <div className="text-[0.62rem] md:text-[0.68rem] tracking-[0.3em] uppercase font-bold text-scarlet mb-1.5">
          Sarees on Sale
        </div>
        <div
          role="heading"
          aria-level={1}
          className="font-sans text-lg md:text-xl font-extrabold text-ink leading-tight tracking-tight"
        >
          Festive Markdown
        </div>
        <p className="mt-1 text-xs md:text-sm text-ink/65">
          A curated edit — sizes and borders on this rail come off the shelf first.
        </p>
      </div>
    </section>
  );
}
