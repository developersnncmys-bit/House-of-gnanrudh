'use client';

import Link from 'next/link';
import { useState } from 'react';
import { type SAREES, TIERS } from '@/lib/sarees';

type Saree = (typeof SAREES)[number];

export default function ProductAccordion({ saree }: { saree: Saree }) {
  return (
    <div className="border-t border-gray-200">
      <Section title="Product Details" defaultOpen>
        <ProductDetailsTable saree={saree} />
      </Section>

      <Section title="Product Speciality" defaultOpen>
        <p className="text-sm text-gray-700 leading-relaxed">
          {saree.story}
        </p>
      </Section>

      <Section title="Style & Fit Tips">
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            <strong className="text-gray-900">Style Tips:</strong> Pair with traditional gold or
            kundan jewellery for a heritage look. A choker on a high-neck blouse balances the
            heavy pallu; a long rani haar suits a deeper neckline.
          </p>
          <p>
            <strong className="text-gray-900">Fit Tips:</strong> Ensure the pallu falls
            effortlessly over the shoulder for a graceful drape. Pleats should sit at the navel
            and fall straight to the floor. A petticoat in a matching shade keeps the silhouette
            clean.
          </p>
        </div>
      </Section>

      <Section title="Shipping & Returns">
        <div className="space-y-3 text-sm text-gray-700 leading-relaxed">
          <p>
            Exchange and returns are available within 48 Hrs of delivery. Items must be in
            their original condition with all tags intact. Custom-stitched blouses are
            non-returnable.
          </p>
          <p>
            Estimated delivery dates are approximate and may shift due to unforeseen
            circumstances. Free shipping across India on every order.
          </p>
          <Link href="/returns" className="text-[#082052] font-semibold text-sm hover:underline">
            Read full return policy →
          </Link>
        </div>
      </Section>

      <Section title="FAQs">
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
      </Section>
    </div>
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
    { label: 'Manufactured', value: 'House Of GnanRudh Pvt Ltd, Bengaluru' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3 text-sm">
      {rows.map((r) => (
        <div key={r.label} className="flex flex-col">
          <span className="text-xs font-bold text-gray-900 uppercase tracking-wide">{r.label}</span>
          <span className="text-gray-700 mt-0.5">{r.value}</span>
        </div>
      ))}
    </div>
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

function Section({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <h2 className="text-base font-bold text-gray-900 group-hover:text-[#082052] transition-colors">
          {title}
        </h2>
        <span className={`text-2xl text-gray-500 transition-transform ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && <div className="pb-5">{children}</div>}
    </div>
  );
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
        <span className="text-sm font-semibold text-gray-900 group-hover:text-[#082052] transition-colors">
          {q}
        </span>
        <span className={`text-xl text-gray-500 transition-transform shrink-0 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && <p className="pb-3 pr-8 text-sm text-gray-700 leading-relaxed">{a}</p>}
    </div>
  );
}
