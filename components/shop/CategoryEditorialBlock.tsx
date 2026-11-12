'use client';

import Link from 'next/link';
import { useState } from 'react';
import { WEAVE_STORIES } from './CategoryStory';

/**
 * CategoryEditorialBlock — bottom-of-page editorial scoped to one
 * weave. Not the generic shop SEO block (SeoContent.tsx) — that one
 * reads as the whole-site landing. This one is weave-specific:
 * heritage lead, care notes, and FAQs that only make sense for the
 * drape the visitor is actually browsing.
 *
 * Design intentionally avoids the plain two-column grey block: it
 * uses the brand cream background, a maroon-serif heading, and a
 * right-rail "At A Glance" card instead of generic chip groups.
 */

type FAQ = { q: string; a: string };

// Weave-specific FAQs. Each entry adds three questions tailored to
// that drape; the two shared ones (delivery, returns) are appended at
// render time so every page still answers the baseline logistics.
const WEAVE_FAQS: Record<string, FAQ[]> = {
  Kanjivaram: [
    {
      q: 'How do I know the zari in a Kanjeevaram is pure?',
      a: 'Hold the pallu to a flame — real zari scorches to a fine dust, never turns black. Our Kanjeevarams are woven with silver-base zari dipped in 24K gold, tested at the loom.',
    },
    {
      q: 'Is a Kanjeevaram heavy to drape?',
      a: 'The silk is weighty by design (three-ply mulberry) but modern pleating with a stiff cotton petticoat carries it comfortably across a full wedding day.',
    },
    {
      q: 'How should I store my Kanjeevaram between wears?',
      a: 'Wrap in soft mulmul, store flat (not folded on the zari), and air it under shade every three months. Never seal in plastic — the silk needs to breathe.',
    },
  ],
  Banarasi: [
    {
      q: 'What makes a Banarasi a Banarasi?',
      a: 'True Banarasis are woven on pit looms in Varanasi, with meenakari accents and silver-gilt brocade. If the reverse of the pallu reads as clean as the front, the weave is hand-done.',
    },
    {
      q: 'How long does a Banarasi take to weave?',
      a: 'A single bridal Banarasi can take up to six months on the loom. Lighter party weaves finish in 4–6 weeks.',
    },
    {
      q: 'Dry-clean only?',
      a: 'Yes — always. Water-washing opens up the gilt threads and dulls the silk gloss.',
    },
  ],
  'Mysore Silk': [
    {
      q: 'Is this real KSIC Mysore Silk?',
      a: 'Every KSIC Mysore from our rail carries the official KSIC gold-foil hologram inside the pallu, with the serial-number stamp. If either is missing it isn\'t KSIC.',
    },
    {
      q: 'How is Mysore different from Kanjeevaram?',
      a: 'Mysore is a lighter crepe-silk — softer drape, 100% pure gold zari, meant for long-day comfort rather than the structured heft of a Kanjeevaram.',
    },
    {
      q: 'Can I wear it daily?',
      a: 'Absolutely. The weight (around 400g for a 6-yard) is built for office, temple, and travel — not just the lit hour.',
    },
  ],
  Mangalagiri: [
    {
      q: 'Is Mangalagiri a silk or a cotton?',
      a: 'Classic Mangalagiri is 100% cotton with a silk border; the silk-cotton blend is a modern variant. Both carry the Andhra GI tag.',
    },
    {
      q: 'How does it hold up in summer?',
      a: 'Famously well — the weave is loose enough to breathe, the border crisp enough to hold a pleat. A proper August saree.',
    },
    {
      q: 'Does it fade with washing?',
      a: 'No. The yarn is dyed before weaving (vat-fast), so colour holds across years of cold-water hand-washes.',
    },
  ],
  Pochampally: [
    {
      q: 'What is ikat, really?',
      a: 'The yarn is resist-tied in sections and dyed before it reaches the loom. The pattern only reveals itself when warp meets weft — a geometry locked in by the tying, not painted on afterwards.',
    },
    {
      q: 'Is Pochampally always silk?',
      a: 'No — we carry silk, cotton and silk-cotton Pochampallys. The silk pieces are heirloom-grade; the cottons are everyday workhorses.',
    },
    {
      q: 'Why do the lines look slightly offset?',
      a: 'That small mis-alignment is the signature of true ikat. A perfectly aligned "ikat" is almost certainly printed.',
    },
  ],
  Gadwal: [
    {
      q: 'Cotton body, silk pallu — how?',
      a: 'The native interlock join (kuttu) weds the two fabrics by hand on the loom. Done well, you can\'t see the seam from either side.',
    },
    {
      q: 'Can a Gadwal pass through a matchbox?',
      a: 'The old proof — a fine Gadwal folds that small. Our bridal Gadwals weigh closer to 500g; the everyday ones get close to the matchbox claim.',
    },
    {
      q: 'Is the border always zari?',
      a: 'Classically yes — silk pallu + zari border. We also stock contemporary Gadwals with meena-worked borders and plain silk pallus.',
    },
  ],
  Patola: [
    {
      q: 'Why are Patolas so expensive?',
      a: 'A single Patan Patola is six months of work from three weavers, both warp and weft tie-dyed. The Salvi family has made them this way for eight centuries.',
    },
    {
      q: 'Single-ikat or double-ikat?',
      a: 'Our Patan Patolas are true double-ikat — pattern locked into both axes. Rajkot Patolas (single-ikat) are lighter on the loom and the pocket.',
    },
    {
      q: 'Will the colours bleed?',
      a: 'Never. Patola dyes are set with a traditional alum-mordant process — they hold through decades of wear.',
    },
  ],
  'Fancy Sarees': [
    {
      q: 'What counts as a Fancy Saree?',
      a: 'Contemporary silhouettes, modern motifs, party-ready palettes — designed for the wedding-adjacent moments: sangeet, mehendi, cocktail, engagement.',
    },
    {
      q: 'Are these machine-made?',
      a: 'Our Fancy rail is mixed: hand-woven where the weave calls for it, machine-finished where embellishment demands precision. Each product page lists the construction.',
    },
    {
      q: 'Lighter than a Kanjeevaram?',
      a: 'Yes — typically 350–500g, built to photograph well and move freely on a dance floor.',
    },
  ],
  'Mixed Pattu Sarees': [
    {
      q: 'What\'s a Mixed Pattu?',
      a: 'A single drape that marries two weaves — a Kanjeevaram body with a Banarasi pallu, a Mangalagiri stripe edged in Gadwal zari. One saree, two traditions.',
    },
    {
      q: 'Who makes them?',
      a: 'Dedicated weaver clusters in Kanchipuram and Varanasi collaborate on each piece. Cut, join, and pallu-swap are hand-done on the loom.',
    },
    {
      q: 'Are they bridal?',
      a: 'Many are. We tag the bridal-weight Mixed Pattus separately; the lighter pieces work beautifully for reception and sangeet.',
    },
  ],
};

const SHARED_FAQS: FAQ[] = [
  {
    q: 'How long does delivery take?',
    a: 'Every order ships within 5–7 working days, insured and tracked. Free shipping across India; international orders are chargeable at checkout.',
  },
  {
    q: 'Can I return it?',
    a: 'Returns and exchanges are open for 48 hours after delivery, provided the saree is unworn and in its original packaging. Customised and fall-attached pieces are non-returnable.',
  },
];

// A compact "at a glance" summary for the sidebar. Falls back to the
// story's region when the weave doesn't have a bespoke snapshot.
type Snapshot = {
  origin: string;
  material: string;
  signature: string;
  occasion: string;
};

const WEAVE_SNAPSHOT: Record<string, Snapshot> = {
  Kanjivaram: {
    origin: 'Kanchipuram, Tamil Nadu',
    material: 'Three-ply mulberry silk, pure zari',
    signature: 'Korvai interlock, temple border',
    occasion: 'Bridal · Festive · Pooja',
  },
  Banarasi: {
    origin: 'Varanasi, Uttar Pradesh',
    material: 'Katan silk with silver-gilt brocade',
    signature: 'Mughal kalga-bel, meenakari accents',
    occasion: 'Bridal · Reception · Festive',
  },
  'Mysore Silk': {
    origin: 'Mysuru, Karnataka',
    material: '100% mulberry silk, 100% gold zari',
    signature: 'KSIC gold-foil hologram',
    occasion: 'Daily · Office · Temple',
  },
  Mangalagiri: {
    origin: 'Mangalagiri, Andhra Pradesh',
    material: 'Cotton body, silk border',
    signature: 'Nizam border, GI-tagged',
    occasion: 'Daily · Summer · Festive',
  },
  Pochampally: {
    origin: 'Bhoodan Pochampally, Telangana',
    material: 'Silk and silk-cotton',
    signature: 'Resist-dyed single-ikat geometry',
    occasion: 'Party · Festive · Daily',
  },
  Gadwal: {
    origin: 'Jogulamba Gadwal, Telangana',
    material: 'Cotton body, silk pallu',
    signature: 'Kuttu interlock join, zari border',
    occasion: 'Festive · Reception · Pooja',
  },
  Patola: {
    origin: 'Patan, Gujarat',
    material: 'Mulberry silk, double-ikat dye',
    signature: 'Eight-century Salvi geometry',
    occasion: 'Heirloom · Bridal · Collector',
  },
  'Fancy Sarees': {
    origin: 'Contemporary Indian ateliers',
    material: 'Blended silks, organza, tissue',
    signature: 'Modern motifs, statement palettes',
    occasion: 'Sangeet · Cocktail · Engagement',
  },
  'Mixed Pattu Sarees': {
    origin: 'Kanchipuram × Varanasi collabs',
    material: 'Two-weave union drape',
    signature: 'Hand-joined pallu swap',
    occasion: 'Bridal · Reception · Festive',
  },
};

export default function CategoryEditorialBlock({ weave }: { weave: string }) {
  const story = WEAVE_STORIES[weave];
  const faqs = [...(WEAVE_FAQS[weave] ?? []), ...SHARED_FAQS];
  const snap = WEAVE_SNAPSHOT[weave];

  return (
    <section className="bg-ivory border-t border-maroon-deep/10">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-16 items-start">
          {/* LEFT — editorial column */}
          <div>
            <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-gold-deep mb-3">
              About the Weave
            </div>
            <h2
              className="text-[1.9rem] md:text-[2.4rem] lg:text-[2.75rem] leading-[1.05] text-ink mb-5"
              style={{
                fontFamily: 'var(--font-hero), "Italiana", Georgia, serif',
                fontWeight: 600,
              }}
            >
              The {weave} Story
            </h2>

            {story && (
              <>
                {/* Tagline — Italiana only ships at weight 400 on
                    Google Fonts, so italic + display face rendered as
                    a near-invisible hairline on cream. Dropping to the
                    body sans with italic + semibold reads as a quiet
                    pull-quote without disappearing. */}
                <p
                  className="font-sans text-lg md:text-xl italic text-maroon-deep leading-snug mb-5"
                  style={{ fontWeight: 600, letterSpacing: '-0.005em' }}
                >
                  “{story.tagline}”
                </p>
                <p className="text-sm md:text-[0.95rem] text-ink/75 leading-relaxed mb-10">
                  {story.body}
                </p>
              </>
            )}

            {/* FAQ accordion — hairline rule between each row, +/- toggle
                on the right, body opens underneath. No boxes. */}
            <div className="border-t border-maroon-deep/15">
              <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-gold-deep pt-6 pb-3">
                Frequently Asked
              </div>
              {faqs.map((f, i) => (
                <FaqRow key={i} q={f.q} a={f.a} />
              ))}
            </div>
          </div>

          {/* RIGHT — "At A Glance" snapshot card. */}
          {snap && (
            <aside className="lg:sticky lg:top-[140px]">
              <div className="border border-maroon-deep/15 bg-white p-6 lg:p-7">
                <div className="flex items-center gap-3 text-gold-deep mb-5">
                  <span className="block h-px w-6 bg-gold-deep/60" aria-hidden />
                  <span className="text-[0.62rem] tracking-[0.35em] uppercase font-bold">
                    At A Glance
                  </span>
                </div>
                <SnapRow label="Origin" value={snap.origin} />
                <SnapRow label="Material" value={snap.material} />
                <SnapRow label="Signature" value={snap.signature} />
                <SnapRow label="Best for" value={snap.occasion} last />

                <Link
                  href="/shop?sort=new"
                  className="mt-6 inline-flex items-center gap-2 text-[0.72rem] font-bold tracking-[0.18em] uppercase text-maroon-deep hover:text-ink transition-colors border-b border-maroon-deep/40 hover:border-ink pb-0.5"
                >
                  Explore New Arrivals
                  <span aria-hidden>→</span>
                </Link>
              </div>
            </aside>
          )}
        </div>
      </div>
    </section>
  );
}

function SnapRow({
  label,
  value,
  last = false,
}: {
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className={`flex flex-col gap-0.5 py-3 ${
        last ? '' : 'border-b border-maroon-deep/10'
      }`}
    >
      <span className="text-[0.62rem] tracking-[0.25em] uppercase text-ink/50 font-semibold">
        {label}
      </span>
      <span className="text-sm text-ink leading-snug">{value}</span>
    </div>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-maroon-deep/10">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-sm md:text-[0.95rem] font-semibold text-ink group-hover:text-maroon-deep transition-colors pr-4">
          {q}
        </span>
        <span
          aria-hidden
          className="relative inline-flex items-center justify-center w-3 h-3 text-maroon-deep shrink-0"
        >
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-current" />
          {!open && (
            <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-current" />
          )}
        </span>
      </button>
      {open && (
        <p className="pb-5 pr-8 text-sm text-ink/70 leading-relaxed">{a}</p>
      )}
    </div>
  );
}
