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
    <section className="border-t border-gray-200">
      {/* Tab bar — horizontal scroll on narrow screens so all tabs stay
          reachable without wrapping. */}
      <div className="border-b border-gray-200">
        <div
          role="tablist"
          aria-label="Product information"
          className="flex gap-6 md:gap-10 overflow-x-auto no-scrollbar"
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
                className={`relative shrink-0 py-4 md:py-5 text-[0.72rem] md:text-[0.78rem] font-bold uppercase tracking-[0.18em] transition-colors whitespace-nowrap ${
                  isActive
                    ? 'text-maroon-deep'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {t.label}
                {/* Gold underline — animates in on the active tab */}
                <span
                  aria-hidden
                  className={`absolute left-0 right-0 -bottom-px h-[2px] transition-transform duration-300 origin-center ${
                    isActive ? 'scale-x-100' : 'scale-x-0'
                  }`}
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, #8A5A1F 0%, #C8923F 50%, #8A5A1F 100%)',
                  }}
                />
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
        className="py-6 md:py-8 animate-[fadeIn_240ms_ease-out]"
      >
        {active === 'details' && <ProductDetailsTable saree={saree} />}
        {active === 'speciality' && (
          <p className="text-sm md:text-[0.95rem] text-gray-700 leading-[1.85] max-w-3xl">
            {saree.story}
          </p>
        )}
        {active === 'tips' && (
          <div className="space-y-4 text-sm md:text-[0.95rem] text-gray-700 leading-[1.85] max-w-3xl">
            <p>
              <strong className="text-gray-900">Style Tips:</strong> Pair with
              traditional gold or kundan jewellery for a heritage look. A choker
              on a high-neck blouse balances the heavy pallu; a long rani haar
              suits a deeper neckline.
            </p>
            <p>
              <strong className="text-gray-900">Fit Tips:</strong> Ensure the
              pallu falls effortlessly over the shoulder for a graceful drape.
              Pleats should sit at the navel and fall straight to the floor. A
              petticoat in a matching shade keeps the silhouette clean.
            </p>
          </div>
        )}
        {active === 'shipping' && (
          <div className="space-y-4 text-sm md:text-[0.95rem] text-gray-700 leading-[1.85] max-w-3xl">
            <p>
              Exchange and returns are available within 48 Hrs of delivery.
              Items must be in their original condition with all tags intact.
              Custom-stitched blouses are non-returnable.
            </p>
            <p>
              Estimated delivery dates are approximate and may shift due to
              unforeseen circumstances. Free shipping across India on every
              order.
            </p>
            <Link
              href="/returns"
              className="inline-flex items-center gap-1 text-maroon-deep font-semibold text-sm hover:underline"
            >
              Read full return policy
              <span aria-hidden>→</span>
            </Link>
          </div>
        )}
        {active === 'faqs' && (
          <div className="max-w-3xl">
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

function ProductDetailsTable({ saree }: { saree: Saree }) {
  const tier = TIERS[saree.tier];
  const rows: { label: string; value: string }[] = [
    { label: 'Style No', value: saree.id.toUpperCase() },
    { label: 'Design No', value: `K${saree.id.slice(0, 3).toUpperCase()}${saree.price}` },
    { label: 'Color', value: saree.palette[0] ? colourName(saree.palette[0]) : '—' },
    { label: 'Work', value: saree.weave },
    { label: 'Region', value: saree.region },
    { label: 'Category', value: tier.title },
    { label: 'Length', value: saree.details.length },
    { label: 'Blouse', value: saree.details.blouse },
    { label: 'Zari', value: saree.details.zari },
    ...(saree.details.weight ? [{ label: 'Weight', value: saree.details.weight }] : []),
    { label: 'Pack Contains', value: '1 Saree, 1 Unstitched Blouse Fabric' },
    { label: 'Manufactured', value: 'House Of GnanRudh Pvt Ltd, Nellore' },
  ];
  return (
    <dl className="grid grid-cols-1 md:grid-cols-2 md:gap-x-12">
      {rows.map((r) => (
        <div
          key={r.label}
          className="grid grid-cols-[130px_1fr] items-baseline gap-5 py-3.5 border-b border-gray-200/70"
        >
          <dt className="text-[0.66rem] font-bold tracking-[0.2em] uppercase text-gray-500">
            {r.label}
          </dt>
          <dd className="text-sm text-gray-900 font-medium leading-snug">
            {r.value}
          </dd>
        </div>
      ))}
    </dl>
  );
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

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-gray-200 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-3 text-left group"
      >
        <span className="text-sm font-semibold text-gray-900 group-hover:text-maroon-deep transition-colors">
          {q}
        </span>
        <span
          className={`text-xl text-gray-500 transition-transform shrink-0 ${
            open ? 'rotate-45' : ''
          }`}
        >
          +
        </span>
      </button>
      {open && <p className="pb-3 pr-8 text-sm text-gray-700 leading-relaxed">{a}</p>}
    </div>
  );
}
