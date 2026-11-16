'use client';

import { useState } from 'react';

/**
 * AllSareesIntro — SEO + brand copy that heads the bare /shop
 * (All Sarees) landing. Mirrors NewArrivalsIntro so the two pages feel
 * like siblings in the Kalki-style category rail.
 */

export default function AllSareesIntro() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-ivory border-b border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-10 md:py-12 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lotus.png"
          alt=""
          aria-hidden
          className="mx-auto mb-5 h-8 md:h-9 w-auto select-none"
          draggable={false}
        />
        <div
          role="heading"
          aria-level={1}
          className="font-sans text-xl md:text-2xl lg:text-[1.6rem] font-extrabold text-ink leading-tight tracking-tight"
        >
          All Sarees: The Full House Of GnanRudh Collection
        </div>
        <p className="mt-3 text-xs md:text-sm text-ink/75 leading-relaxed max-w-[900px] mx-auto">
          Every drape in the house, under one rail — Kanjeevaram,
          Banarasi, Mysore Silk, Mangalagiri, Pochampally, Gadwal,
          Patola, Fancy Sarees and Mixed Pattu. Woven across India&apos;s
          finest clusters, hand-finished at the loom, and photographed
          exactly as they ship.
          {expanded && (
            <>
              {' '}
              Filter by weave, colour, availability or price band to
              narrow the catalogue; sort by newest, lowest or highest
              price. Bridal Kanjeevarams with 10-gram zari sit beside
              everyday Mangalagiris under five thousand — so a visiting
              mother, a first-time buyer and a seasoned collector can
              each find their piece in the same rail. Shipped worldwide
              from India with insured delivery, 7-day easy returns, and
              a care guide folded inside every box.
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
