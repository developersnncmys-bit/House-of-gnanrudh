'use client';

import { useState } from 'react';

/**
 * NewArrivalsIntro — SEO + brand copy that heads the /shop?sort=new
 * landing. Mirrors the Pothys pattern: an H1 hook, an opening paragraph,
 * then a Read More toggle that reveals a second paragraph. Kept to the
 * shop container's gutter so the block aligns with the grid below.
 */

export default function NewArrivalsIntro() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-ivory border-b border-gray-200">
      {/* Extra top padding on lg+ compensates for Nav Row 3 (the
          centred link bar) — SiteShell's main `pt-[109px]` was
          computed before that sub-row returned, so the first element
          in a page section gets hidden under the nav on desktop. */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 pt-16 md:pt-20 lg:pt-28 pb-10 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lotus.png"
          alt=""
          aria-hidden
          className="mx-auto mb-5 h-8 md:h-9 w-auto select-none"
          draggable={false}
        />
        {/* Rendered as a semantic heading via role/aria so we escape
            globals.css's `h1 { font-family: Italiana; font-weight: 600 }`
            rule — Italiana only ships at weight 400 on Google Fonts, so
            every <h1> in the brand reads as a hairline and this intro
            heading was invisible against the paragraph. Using a <div>
            with role=heading keeps the SEO/a11y semantics without the
            cascade battle. */}
        <div
          role="heading"
          aria-level={1}
          className="font-sans text-xl md:text-2xl lg:text-[1.6rem] font-extrabold text-ink leading-tight tracking-tight"
        >
          New Arrivals: Freshly Woven Sarees, Straight from the Loom
        </div>
        <p className="mt-3 text-xs md:text-sm text-ink/75 leading-relaxed max-w-[900px] mx-auto">
          Step into the newest edit from House Of GnanRudh — a season of
          heirloom silks drawn from India&apos;s finest weaving towns.
          From temple-border Kanjeevarams and pit-loom Banarasis to
          featherlight Mysore Silks, crisp Mangalagiri cottons and
          double-ikat Patolas, every drape here has just stepped off
          the loom and onto our shelves.
          {expanded && (
            <>
              {' '}
              Each saree is hand-selected from master weavers we&apos;ve
              worked with for generations — the kind of makers whose
              family names are stitched into the selvedge. Festive
              Kanjeevarams carry 10-gram zari borders and rich mayilkann
              motifs; Banarasis arrive in katan silk with meenakari
              buttis; Pochampally and Gadwal pieces show the quiet
              geometry of South Indian ikat. Whether you&apos;re
              shopping for a wedding, a festival, or simply a Sunday
              that deserves silk, the New Arrivals rail is the first
              place to look — refreshed often, sized for every occasion
              in a woman&apos;s wardrobe, and shipped worldwide from
              India with insured delivery.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-sm font-bold text-maroon hover:text-maroon-deep transition-colors underline underline-offset-4"
          aria-expanded={expanded}
        >
          {expanded ? 'Read Less' : 'Read More'}
        </button>
      </div>
    </section>
  );
}
