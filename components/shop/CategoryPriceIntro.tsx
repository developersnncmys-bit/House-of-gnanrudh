'use client';

/**
 * CategoryPriceIntro — editorial header for the /shop?minPrice=…&
 * maxPrice=… Shop-by-Price landings. Copy picks itself based on the
 * numeric range so adding a new band is just one row in PRICE_COPY.
 */

type Copy = {
  key: string;
  label: string;
  title: string;
  tagline: string;
  body: string;
  // min / max are inclusive on min, exclusive on max. Infinity for open-ended.
  min: number;
  max: number;
};

export const PRICE_BANDS: Copy[] = [
  {
    key: 'under-10k',
    label: 'Under ₹10,000',
    title: 'Under ₹10,000',
    tagline: 'Entry-level silks and everyday cottons.',
    body:
      'Pochampallys, Mangalagiris and soft Mysore crepes — hand-woven weaves at an approachable price. Right for office, pooja mornings and the first saree in a wardrobe.',
    min: 0,
    max: 10000,
  },
  {
    key: '10-25k',
    label: '₹10,000 – ₹25,000',
    title: 'The Festive Rail',
    tagline: 'Party-ready silks for the lit evening.',
    body:
      'Mid-weight Banarasis, festive Patolas and Gadwal silks woven for Diwali, sangeet and reception nights — statement pieces without heirloom weight.',
    min: 10000,
    max: 25000,
  },
  {
    key: '25-50k',
    label: '₹25,000 – ₹50,000',
    title: 'The Signature Rail',
    tagline: 'Where festive meets heirloom.',
    body:
      'Pit-loom Banarasis, signature Kanjeevarams and double-ikat Patolas — drapes picked for engagements, receptions and the family portrait that lives on the hall wall.',
    min: 25000,
    max: 50000,
  },
  {
    key: '50k-1L',
    label: '₹50,000 – ₹1,00,000',
    title: 'The Bridal Rail',
    tagline: 'Bridal-grade silks.',
    body:
      'Three-ply mulberry-silk Kanjeevarams with pure zari, pit-loom Banarasis and bridal-weight Mixed Pattus — the drapes cut for the day of the vow.',
    min: 50000,
    max: 100000,
  },
  {
    key: 'above-1L',
    label: 'Above ₹1,00,000',
    title: 'The Heirloom Rail',
    tagline: 'Collector pieces.',
    body:
      'Six-month Salvi Patolas, bridal Kanjeevarams with heavy korvai borders and limited-edition Mughal Banarasis — the sarees meant to be folded into the next century.',
    min: 100000,
    max: Infinity,
  },
];

export function matchBand(pmin: number | null, pmax: number | null): Copy | null {
  // Find the band whose min/max line up with the URL. Allows either
  // bound to be omitted (treated as 0 or Infinity respectively).
  const low = pmin ?? 0;
  const high = pmax ?? Infinity;
  return (
    PRICE_BANDS.find((b) => b.min === low && b.max === high) ?? null
  );
}

export default function CategoryPriceIntro({
  pmin,
  pmax,
}: {
  pmin: number | null;
  pmax: number | null;
}) {
  const band = matchBand(pmin, pmax);
  const title = band?.label ?? priceRangeLabel(pmin, pmax);
  const tagline = band?.tagline ?? '';

  // Compact header — pure filter landings don't need an editorial
  // intro. Small eyebrow + title + one-line tagline.
  return (
    <section className="bg-white border-b border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-5 md:py-6 text-center">
        <div className="text-[0.62rem] md:text-[0.68rem] tracking-[0.3em] uppercase font-bold text-gold-deep mb-1.5">
          Shop by Price
        </div>
        <div
          role="heading"
          aria-level={1}
          className="font-sans text-lg md:text-xl font-extrabold text-ink leading-tight tracking-tight"
        >
          {title}
        </div>
        {tagline && (
          <p className="mt-1 text-xs md:text-sm text-ink/65">{tagline}</p>
        )}
      </div>
    </section>
  );
}

function priceRangeLabel(pmin: number | null, pmax: number | null): string {
  const fmt = (n: number) =>
    n >= 100000
      ? `₹${(n / 100000).toLocaleString('en-IN')}L`
      : `₹${n.toLocaleString('en-IN')}`;
  if (pmin && pmax) return `${fmt(pmin)} – ${fmt(pmax)}`;
  if (pmax && !pmin) return `Under ${fmt(pmax)}`;
  if (pmin && !pmax) return `Above ${fmt(pmin)}`;
  return 'All Prices';
}
