'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type SAREES, TIERS } from '@/lib/sarees';

type Saree = (typeof SAREES)[number];

type TabId = 'details' | 'speciality' | 'tips' | 'shipping' | 'faqs';

const TABS: { id: TabId; label: string }[] = [
  { id: 'details', label: 'Product Details' },
  { id: 'speciality', label: 'Product Speciality' },
  { id: 'tips', label: 'Style & Fit Tips' },
  { id: 'shipping', label: 'Shipping & Returns' },
  { id: 'faqs', label: 'FAQs' },
];

/**
 * ProductAccordion — replaced the stacked collapse pattern with a
 * horizontal tabs layout. One section is visible at a time, a gold
 * underline marks the active tab, and content fades into place
 * beneath. Reads cleaner than five collapsed rows and matches the
 * luxury ecommerce convention used by Kalki / Taneira / Nalli.
 */
export default function ProductAccordion({ saree }: { saree: Saree }) {
  const [active, setActive] = useState<TabId>('details');

  return (
    <section>
      {/* Tab bar — centred editorial row. Italiana labels, hairline rule
          below with a small diamond indicator snapping to the active tab. */}
      <div className="border-b border-ink/10">
        <div
          role="tablist"
          aria-label="Product information"
          className="flex justify-center gap-8 md:gap-14 overflow-x-auto no-scrollbar px-2"
        >
          {TABS.map((t) => {
            const isActive = active === t.id;
            return (
              <button
                key={t.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-controls={`panel-${t.id}`}
                id={`tab-${t.id}`}
                onClick={() => setActive(t.id)}
                className={`relative shrink-0 pt-5 pb-6 md:pt-6 md:pb-7 font-display font-bold text-[1rem] md:text-[1.15rem] tracking-tight whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-maroon-deep'
                    : 'text-ink/50 hover:text-ink'
                }`}
              >
                {t.label}
                {/* Diamond + hairline underline for the active tab */}
                {isActive && (
                  <span
                    aria-hidden
                    className="absolute left-1/2 -translate-x-1/2 bottom-2 flex items-center gap-1.5"
                  >
                    <span className="h-px w-5 bg-gold/70" />
                    <span className="w-1 h-1 rotate-45 bg-gold-deep" />
                    <span className="h-px w-5 bg-gold/70" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Panel area — only the active panel is rendered. Keyed on the
          active id so entering a new panel resets the subtle fade-in. */}
      <div
        key={active}
        id={`panel-${active}`}
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        className="py-10 md:py-14 animate-[fadeIn_240ms_ease-out]"
      >
        {active === 'details' && <ProductDetailsTable saree={saree} />}
        {active === 'speciality' && (
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-display font-bold italic text-sm md:text-base text-ink leading-[1.7]">
              {saree.story}
            </p>
          </div>
        )}
        {active === 'tips' && (
          <div className="max-w-3xl mx-auto grid md:grid-cols-2 gap-8 md:gap-12">
            <PanelNote title="Style" body="Pair with traditional gold or kundan jewellery for a heritage look. A choker on a high-neck blouse balances the heavy pallu; a long rani haar suits a deeper neckline." />
            <PanelNote title="Fit" body="Ensure the pallu falls effortlessly over the shoulder for a graceful drape. Pleats should sit at the navel and fall straight to the floor. A petticoat in a matching shade keeps the silhouette clean." />
          </div>
        )}
        {active === 'shipping' && (
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <p className="text-[0.95rem] md:text-base text-ink/75 leading-[1.95]">
              Exchange and returns are available within 48 Hrs of delivery.
              Items must be in their original condition with all tags intact.
              Custom-stitched blouses are non-returnable.
            </p>
            <p className="text-[0.95rem] md:text-base text-ink/75 leading-[1.95]">
              Estimated delivery dates are approximate and may shift due to
              unforeseen circumstances. Free shipping across India on every
              order.
            </p>
            <Link
              href="/returns"
              className="inline-flex items-center gap-2 pt-2 font-display font-bold text-[1.05rem] text-maroon-deep hover:text-maroon transition-colors"
            >
              Read full return policy
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
        {active === 'faqs' && (
          <div className="max-w-3xl mx-auto">
            <FaqRow
              q="What if I want to exchange or return my order?"
              a="Exchange and returns are available within 48 Hrs of delivery. Items must be in original condition with all tags intact. Custom-stitched pieces are non-returnable."
            />
            <FaqRow
              q="Will I receive a quality product?"
              a="As a heritage brand, we adhere to strict quality controls. Every saree goes through a five-step inspection — fabric integrity, zari purity, dye fastness, weave fidelity and finish — before dispatch."
            />
            <FaqRow
              q="How long will my order take to arrive?"
              a="Orders ship within 5–7 working days, insured and tracked. International orders take an additional 7–10 working days depending on the destination."
            />
            <FaqRow
              q="Can I customise the blouse?"
              a="Yes — select the Stitched option above and provide measurements at checkout. Custom stitching adds ₹800 and 5 working days to the dispatch time."
            />
          </div>
        )}
      </div>
    </section>
  );
}

type DetailRow = { label: string; value: string; swatch?: string };
type DetailSection = {
  title: string;
  icon: 'tag' | 'thread' | 'box';
  rows: DetailRow[];
};

function ProductDetailsTable({ saree }: { saree: Saree }) {
  const tier = TIERS[saree.tier];
  const swatchHex = saree.palette[0];
  const sections: DetailSection[] = [
    {
      title: 'Identity',
      icon: 'tag',
      rows: [
        { label: 'Style No', value: saree.id.toUpperCase() },
        {
          label: 'Design No',
          value: `K${saree.id.slice(0, 3).toUpperCase()}${saree.price}`,
        },
        {
          label: 'Color',
          value: swatchHex ? colourName(swatchHex) : '—',
          swatch: swatchHex,
        },
        { label: 'Category', value: tier.title },
      ],
    },
    {
      title: 'Craft & Material',
      icon: 'thread',
      rows: [
        { label: 'Work', value: saree.weave },
        { label: 'Region', value: saree.region },
        { label: 'Zari', value: saree.details.zari },
        { label: 'Length', value: saree.details.length },
        { label: 'Blouse', value: saree.details.blouse },
        ...(saree.details.weight
          ? [{ label: 'Weight', value: saree.details.weight }]
          : []),
      ],
    },
    {
      title: 'Pack & Provenance',
      icon: 'box',
      rows: [
        {
          label: 'Pack Contains',
          value: '1 Saree, 1 Unstitched Blouse Fabric',
        },
        {
          label: 'Manufactured',
          value: 'House Of GnanRudh Pvt Ltd, Nellore',
        },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-y-12 lg:gap-y-0 lg:divide-x divide-ink/10">
      {sections.map((section, idx) => (
        <section
          key={section.title}
          className={`px-0 ${idx > 0 ? 'lg:px-10 xl:px-14' : 'lg:pr-10 xl:pr-14'}`}
        >
          {/* Section mark — icon medallion + Italiana title, hairline rule
              with gold diamond beneath. Reads as a quiet editorial header. */}
          <header className="flex flex-col items-start">
            <span className="w-11 h-11 rounded-full bg-white ring-1 ring-gold-deep/50 flex items-center justify-center text-maroon-deep shadow-[0_1px_2px_rgba(77,0,21,0.05)]">
              <DetailIcon name={section.icon} />
            </span>
            <h3 className="mt-4 font-display font-bold text-2xl md:text-[1.7rem] text-ink leading-none">
              {section.title}
            </h3>
            <div className="mt-3 flex items-center gap-2" aria-hidden>
              <span className="h-px w-8 bg-gold/70" />
              <span className="w-1 h-1 rotate-45 bg-gold-deep" />
              <span className="h-px w-16 bg-gold/40" />
            </div>
          </header>

          {/* Spec list — clean label/value pairs, no boxes */}
          <dl className="mt-6 md:mt-7 space-y-5">
            {section.rows.map((r) => (
              <div key={r.label}>
                <dt className="text-[0.62rem] md:text-[0.66rem] font-bold tracking-[0.28em] uppercase text-ink/45">
                  {r.label}
                </dt>
                <dd className="mt-1.5 flex items-center gap-2 text-[0.95rem] md:text-base text-ink leading-snug">
                  {r.swatch && (
                    <span
                      aria-hidden
                      className="inline-block w-3.5 h-3.5 rounded-full ring-1 ring-ink/15 shrink-0"
                      style={{ backgroundColor: r.swatch }}
                    />
                  )}
                  <span>{r.value}</span>
                </dd>
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}

function DetailIcon({ name }: { name: 'tag' | 'thread' | 'box' }) {
  const c = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'tag':
      return (
        <svg {...c}>
          <path d="M20.6 13.4 13.4 20.6a2 2 0 0 1-2.8 0L3 13V5a2 2 0 0 1 2-2h8l7.6 7.6a2 2 0 0 1 0 2.8Z" />
          <circle cx="8" cy="8" r="1.5" />
        </svg>
      );
    case 'thread':
      return (
        <svg {...c}>
          <path d="M4 20c4-8 12-8 16 0" />
          <path d="M4 14c4-8 12-8 16 0" />
          <circle cx="12" cy="4" r="1.5" />
        </svg>
      );
    case 'box':
      return (
        <svg {...c}>
          <path d="M3 7.5 12 3l9 4.5v9L12 21 3 16.5v-9Z" />
          <path d="M3 7.5 12 12l9-4.5" />
          <path d="M12 12v9" />
        </svg>
      );
  }
}

function colourName(hex: string): string {
  const map: Record<string, string> = {
    '#082052': 'Maroon',
    '#E0AE6D': 'Gold',
    '#3F3F3F': 'Ink Black',
    '#0E4D5C': 'Peacock',
    '#1E1B3A': 'Indigo',
    '#A66D23': 'Bronze',
    '#F2C99E': 'Champagne',
    '#F9F9F9': 'Cream',
    '#5D3E14': 'Coffee',
    '#F7EAD9': 'Ivory',
  };
  return map[hex] ?? hex;
}

function PanelNote({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <div className="text-[0.62rem] md:text-[0.66rem] font-bold tracking-[0.28em] uppercase text-gold-deep mb-2">
        {title}
      </div>
      <p className="text-[0.95rem] md:text-base text-ink/75 leading-[1.95]">
        {body}
      </p>
    </div>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-ink/10 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between gap-4 py-5 text-left group"
      >
        <span className="font-display font-bold text-base md:text-lg text-ink group-hover:text-maroon-deep transition-colors">
          {q}
        </span>
        <span
          className={`text-2xl text-gold-deep transition-transform shrink-0 ${
            open ? 'rotate-45' : ''
          }`}
          aria-hidden
        >
          +
        </span>
      </button>
      {open && (
        <p className="pb-5 pr-8 text-[0.92rem] md:text-[0.95rem] text-ink/75 leading-[1.9]">
          {a}
        </p>
      )}
    </div>
  );
}
