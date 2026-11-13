'use client';

import type { Occasion } from '@/lib/sarees';

/**
 * CategoryOccasionIntro — editorial header for an occasion landing
 * page (Mehendi, Diwali, Office, …). Smaller + tighter than the weave
 * intro since the per-occasion copy is a one-liner; no Read More.
 *
 * All copy lives in OCCASION_COPY below so a new occasion is a one-row
 * edit. The `tier` prop is used only to render the eyebrow line
 * (WEDDING · FESTIVE · EVERYDAY).
 */

type Copy = {
  title: string;
  tagline: string;
  body: string;
};

const TIER_LABEL: Record<string, string> = {
  bridal: 'Wedding',
  festive: 'Festive',
  everyday: 'Everyday',
};

// Per-occasion intro copy. Kept short so the page leads with product.
const OCCASION_COPY: Record<Occasion, Copy> = {
  // Wedding
  reception: {
    title: 'Reception Sarees',
    tagline: 'For the night the whole family turns out.',
    body:
      'Statement Kanjeevarams, pit-loom Banarasis and Patan Patolas — bridal-weight silks picked for the hour the photographs get framed.',
  },
  engagement: {
    title: 'Engagement Sarees',
    tagline: 'The first promise, in silk.',
    body:
      'Signature weaves in the colours a family has worn for generations — temple borders, mayil-kann motifs, zari that catches the mandap light.',
  },
  haldi: {
    title: 'Haldi Sarees',
    tagline: 'Marigold-yellow, meant for the morning turmeric.',
    body:
      'Yellow and mustard drapes that can take a stain and still read as a portrait — lighter fancy silks for the sunlit ceremony.',
  },
  mehendi: {
    title: 'Mehendi Sarees',
    tagline: 'For the long hours of henna.',
    body:
      'Greens, deep reds and festive Patolas — colours for the celebration that sits cross-legged while the design dries.',
  },
  sangeet: {
    title: 'Sangeet Sarees',
    tagline: 'Dance-ready silks.',
    body:
      'Patolas and lighter Kanjeevarams in vibrant palettes — drapes that move through a choreographed evening without holding you back.',
  },
  // Festive
  diwali: {
    title: 'Diwali Sarees',
    tagline: 'Jewel tones for the lit night.',
    body:
      'Zari-heavy Banarasis and Patolas in deep festive palettes — the saree for the family photograph that lives on the hall wall.',
  },
  pongal: {
    title: 'Pongal Sarees',
    tagline: 'South-Indian harvest, in silk.',
    body:
      'Traditional golds, temple borders and Mysore crepes — the day the sun, the pot and the elder each get their due.',
  },
  navratri: {
    title: 'Navratri Sarees',
    tagline: 'Nine nights, nine colours.',
    body:
      'A rail that spans the Navratri palette — reds, blues, greens and ochres woven for garba floors and temple corridors alike.',
  },
  pooja: {
    title: 'Pooja Sarees',
    tagline: 'For the quiet hour at the mandir.',
    body:
      'Cream, white and soft-gold weaves — Mysore crepes and Mangalagiri cottons that carry a quiet grace into the shrine.',
  },
  // Everyday
  office: {
    title: 'Office Sarees',
    tagline: 'Crisp cottons for the long week.',
    body:
      'Mangalagiri, Pochampally and soft Mysore crepes with subtle borders — drapes that read professional in meeting rooms and still sit comfortably by 7pm.',
  },
  casual: {
    title: 'Casual Sarees',
    tagline: 'Easy silks for the evening.',
    body:
      'Lightweight Mysore, soft Banarasis and everyday Kanjeevarams for coffee catch-ups, house visits and the unplanned invitation.',
  },
  home: {
    title: 'At-Home Sarees',
    tagline: 'For the slow Saturday.',
    body:
      'Breathable cottons and soft everyday silks — the drapes that handle a kitchen, a book and an afternoon nap equally well.',
  },
  travel: {
    title: 'Travel Sarees',
    tagline: 'Pack light, land ready.',
    body:
      'Pochampally ikats and silk-cotton blends that fold small, resist creases and come out of the suitcase presentable.',
  },
};

export default function CategoryOccasionIntro({
  tier,
  occasion,
}: {
  tier: string;
  occasion: Occasion;
}) {
  const copy = OCCASION_COPY[occasion];

  return (
    <section className="bg-ivory border-b border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-10 md:py-12 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lotus.png"
          alt=""
          aria-hidden
          className="mx-auto mb-4 h-8 md:h-9 w-auto select-none"
          draggable={false}
        />
        <div className="text-[0.68rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-gold-deep mb-3">
          {TIER_LABEL[tier] ?? 'Occasions'} · {occasion.toUpperCase()}
        </div>
        <div
          role="heading"
          aria-level={1}
          className="font-sans text-xl md:text-2xl lg:text-[1.6rem] font-extrabold text-ink leading-tight tracking-tight"
        >
          {copy?.title ?? `${occasion[0].toUpperCase()}${occasion.slice(1)} Sarees`}
        </div>
        {copy?.tagline && (
          <p
            className="mt-2 text-sm md:text-base italic text-maroon-deep"
            style={{ fontWeight: 500 }}
          >
            {copy.tagline}
          </p>
        )}
        {copy?.body && (
          <p className="mt-3 text-xs md:text-sm text-ink/75 leading-relaxed max-w-[900px] mx-auto">
            {copy.body}
          </p>
        )}
      </div>
    </section>
  );
}
