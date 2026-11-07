'use client';

import { useState } from 'react';

export default function BrandSeoBlock() {
  const [expanded, setExpanded] = useState(false);

  return (
    <section className="bg-white border-t border-ink/10">
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10 py-10 md:py-14">
        <h1 className="font-display text-xl md:text-2xl font-semibold text-ink leading-tight mb-5">
          House Of GnanRudh — Buy Handloom Silk Sarees &amp; Heirloom Weaves Online in India
        </h1>

        <div
          className={`text-sm md:text-[0.95rem] text-ink/75 leading-relaxed space-y-4 ${
            expanded ? '' : 'line-clamp-3 md:line-clamp-2'
          }`}
        >
          <p>
            Rooted in the weaving villages of South and North India, House Of GnanRudh is a
            curated house of hand-woven silk sarees — Kanjeevaram from
            Kanchipuram, Banarasi from Varanasi, Mysore Silk from Mysuru,
            Mangalagiri from Andhra Pradesh, Pochampally and Gadwal from
            Telangana, Patola from Patan, and contemporary Fancy &amp; Mixed Pattu
            drapes for the modern wardrobe. Each saree is designer-quality,
            hand-finished, and chosen for its loom, its weave story, and the
            artisan behind it.
          </p>
          <p>
            Our atelier works directly with master weavers to bring you heirloom
            pieces — pure zari borders, traditional motifs, and the honest
            irregularities that mark a true handloom. Whether you&apos;re shopping
            for a bridal Kanjeevaram, a festive Banarasi, an everyday Mangalagiri
            cotton-silk, or a statement Patola ikat, every drape in our
            collection is built to be worn for a lifetime and passed down with
            pride.
          </p>
          <p>
            We ship across India with free, insured delivery and offer secure
            worldwide shipping to over 40 countries. Every parcel is tracked
            and signed for, with easy returns, authenticated zari, and a
            dedicated concierge for bridal consultations and bespoke
            commissions. From a quiet Mysore silk for a morning puja to a
            heavy Kanjeevaram for the mandap, House Of GnanRudh is where India&apos;s weaving
            traditions meet the way you live today.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="mt-4 text-sm font-semibold text-ink hover:text-maroon transition-colors"
          aria-expanded={expanded}
        >
          {expanded ? 'Read Less' : 'Read More...'}
        </button>
      </div>
    </section>
  );
}
