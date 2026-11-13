'use client';

import type { Tier } from '@/lib/sarees';

/**
 * CategoryTierIntro — editorial header for the three tier landings
 * (Bridal / Festive / Everyday). Matches the sizing of the weave +
 * occasion intros so the three live in the same visual family.
 */

type Copy = {
  title: string;
  tagline: string;
  body: string;
};

const TIER_COPY: Record<Tier, Copy> = {
  bridal: {
    title: 'Bridal Sarees',
    tagline: 'The wardrobe for the day of the vow.',
    body:
      'Heirloom-weight Kanjeevarams, pit-loom Banarasis and Salvi Patolas — hand-woven silks chosen for weddings, receptions, engagements and the portraits that frame a family for a generation.',
  },
  festive: {
    title: 'Festive Sarees',
    tagline: 'For the lit hour.',
    body:
      'Drapes for Diwali, Pongal, Navratri, poojas and every family gathering in between — mid-weight silks and silk-cottons that read rich in temple light without weighing down the evening.',
  },
  everyday: {
    title: 'Everyday Sarees',
    tagline: 'Drapes that move with the morning.',
    body:
      'Mangalagiri cottons, Pochampally ikats and soft Mysore crepes for office, home, and the unplanned invitation — light on the shoulder, easy on the loom, faithful in the wash.',
  },
};

const TIER_LABEL: Record<Tier, string> = {
  bridal: 'Wedding',
  festive: 'Festive',
  everyday: 'Everyday',
};

export default function CategoryTierIntro({ tier }: { tier: Tier }) {
  const copy = TIER_COPY[tier];

  // Compact header — editorial copy would overdress a utilitarian
  // tier filter. Small eyebrow + title + one-line tagline, no lotus.
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-5 md:py-6 text-center">
        <div className="text-[0.62rem] md:text-[0.68rem] tracking-[0.3em] uppercase font-bold text-gold-deep mb-1.5">
          Shop by Occasion
        </div>
        <div
          role="heading"
          aria-level={1}
          className="font-sans text-lg md:text-xl font-extrabold text-ink leading-tight tracking-tight"
        >
          {copy.title}
        </div>
        <p className="mt-1 text-xs md:text-sm text-ink/65">
          {copy.tagline}
        </p>
      </div>
    </section>
  );
}
