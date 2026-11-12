'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SAREES, STANDARD_COLORWAYS, BADGE_LABEL, sareeMatchesColor } from '@/lib/sarees';
import type { Weave, BadgeKind } from '@/lib/sarees';
import ProductCard from './ProductCard';
import NewArrivalsIntro from './NewArrivalsIntro';
import CategoryTiles from './CategoryTiles';

/**
 * NewArrivalsView — dedicated layout for /shop?sort=new. Kept fully
 * separate from ShopView so this page can carry its own Kalki-style
 * design (collapsible filter rail, tracked-out section headers, +/−
 * toggles) without rippling into the other /shop views that still use
 * ShopView + the shared FilterRail.
 *
 * Only reuses leaf pieces that are safe to share:
 *   - ProductCard (pure presentation)
 *   - NewArrivalsIntro (already specific to this page)
 *   - SAREES / STANDARD_COLORWAYS catalogue data
 */

const WEAVES: Weave[] = [
  'Kanjivaram', 'Banarasi', 'Mysore Silk', 'Mangalagiri',
  'Pochampally', 'Gadwal', 'Patola', 'Fancy Sarees', 'Mixed Pattu Sarees',
];

const PRICE_BRACKETS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'under-5k',  label: 'Under ₹5,000',           min: 0,     max: 5000 },
  { id: '5-15k',     label: '₹5,000 – ₹15,000',       min: 5000,  max: 15000 },
  { id: '15-30k',    label: '₹15,000 – ₹30,000',      min: 15000, max: 30000 },
  { id: '30-60k',    label: '₹30,000 – ₹60,000',      min: 30000, max: 60000 },
  { id: 'above-60k', label: 'Above ₹60,000',          min: 60000, max: Infinity },
];

// Availability chips — lifted off the product-card images and into
// the filter rail as a selectable multi-chip row. Order matches the
// badge priority used on the card (ready → fast → last).
const AVAILABILITY_BADGES: BadgeKind[] = ['ready', 'fast', 'last'];

const DISCOUNT_BANDS: { id: string; label: string; min: number; max: number }[] = [
  { id: '10-20',  label: '10 – 20%',   min: 10,  max: 20 },
  { id: '20-30',  label: '20 – 30%',   min: 20,  max: 30 },
  { id: '30-40',  label: '30 – 40%',   min: 30,  max: 40 },
  { id: '40plus', label: '40% & Above', min: 40,  max: Infinity },
];

// Pre-compute discount % per saree the same way ProductCard renders it.
function discountPct(saree: (typeof SAREES)[number]): number {
  if (!saree.mrp) return 0;
  return Math.round(((saree.mrp - saree.price) / saree.mrp) * 100);
}

type Sort = 'newest' | 'price-asc' | 'price-desc';

const SORT_LABELS: Record<Sort, string> = {
  newest: 'Newest',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
};

// Collapsible filter section — Kalki pattern with a +/− toggle on
// the right of the title bar. Local to this file so FilterRail stays
// untouched for every other /shop view.
function Section({
  title,
  children,
  defaultOpen = true,
}: {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-4 text-left group"
      >
        <span className="text-[0.78rem] font-bold text-gray-900 uppercase tracking-[0.12em]">
          {title}
        </span>
        <span
          aria-hidden
          className="relative inline-flex items-center justify-center w-3 h-3 text-gray-700 group-hover:text-gray-900 transition-colors"
        >
          <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1.5px] bg-current" />
          {!open && (
            <span className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-[1.5px] bg-current" />
          )}
        </span>
      </button>
      {open && <div className="pb-5 -mt-1">{children}</div>}
    </div>
  );
}

function Check({
  label, checked, onChange, count,
}: { label: string; checked: boolean; onChange: () => void; count?: number }) {
  return (
    <label className="flex items-center gap-2.5 cursor-pointer group py-1.5">
      <span className={`w-4 h-4 border flex items-center justify-center transition-colors shrink-0 ${
        checked ? 'border-gray-900 bg-gray-900' : 'border-gray-400 group-hover:border-gray-900'
      }`}>
        {checked && (
          <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-white" aria-hidden>
            <path d="M2 6.5 5 9l5-6.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only" />
      <span className={`text-sm leading-tight flex-1 ${checked ? 'text-gray-900 font-medium' : 'text-gray-700 group-hover:text-gray-900'}`}>
        {label}
      </span>
      {typeof count === 'number' && (
        <span className="text-xs text-gray-500 tabular-nums">{count}</span>
      )}
    </label>
  );
}

// Numeric From/To input — bordered pill with an optional ₹ prefix.
// Commits the value on blur or Enter via `onCommit` so the URL only
// updates once the user has finished typing, not on every keystroke.
function RangeInput({
  prefix,
  placeholder,
  value,
  onChange,
  onCommit,
}: {
  prefix?: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  onCommit: () => void;
}) {
  return (
    <span className="inline-flex items-center flex-1 border border-gray-300 focus-within:border-gray-900 h-9 px-2 text-sm bg-white">
      {prefix && <span className="text-gray-500 mr-1">{prefix}</span>}
      <input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value.replace(/[^0-9]/g, ''))}
        onBlur={onCommit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            e.preventDefault();
            onCommit();
          }
        }}
        className="w-full min-w-0 bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400 tabular-nums"
      />
    </span>
  );
}

// Price rows render as plain clickable text (Kalki pattern), no radio.
function PriceRow({
  label, checked, onChange,
}: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`block w-full text-left text-sm py-1.5 transition-colors ${
        checked ? 'text-gray-900 font-semibold' : 'text-gray-700 hover:text-gray-900'
      }`}
    >
      {label}
    </button>
  );
}

export default function NewArrivalsView() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse filters out of the URL so share links stay round-trip clean.
  // Mirrors the ShopView convention (comma-separated multi-values) for
  // weave and color, single value for price bracket.
  const weaves = useMemo<Weave[]>(() => {
    const csv = searchParams.get('weave');
    if (!csv) return [];
    return csv.split(',').filter((w) => (WEAVES as string[]).includes(w)) as Weave[];
  }, [searchParams]);
  const colors = useMemo<string[]>(() => {
    const csv = searchParams.get('color');
    if (!csv) return [];
    const valid = new Set(STANDARD_COLORWAYS.map((c) => c.id));
    return csv.split(',').filter((c) => valid.has(c));
  }, [searchParams]);
  const bracket = searchParams.get('bracket');
  const pmin = searchParams.get('pmin');
  const pmax = searchParams.get('pmax');
  const discount = searchParams.get('discount');
  const availability = useMemo<BadgeKind[]>(() => {
    const csv = searchParams.get('avail');
    if (!csv) return [];
    const valid = new Set<string>(AVAILABILITY_BADGES);
    return csv.split(',').filter((v) => valid.has(v)) as BadgeKind[];
  }, [searchParams]);
  const rawSort = searchParams.get('order');
  const sort: Sort =
    rawSort && rawSort in SORT_LABELS ? (rawSort as Sort) : 'newest';

  // URL writer — preserves sort=new and the filters above. Any undefined
  // or empty value drops out of the query so the URL stays short.
  // `pmin`/`pmax`/`discount` follow the same `null = clear` convention
  // the bracket filter uses, so passing `null` deliberately strips them.
  const updateUrl = (
    next: {
      weaves?: Weave[];
      colors?: string[];
      bracket?: string | null;
      order?: Sort;
      pmin?: string | null;
      pmax?: string | null;
      discount?: string | null;
      availability?: BadgeKind[];
    },
  ) => {
    const params = new URLSearchParams();
    params.set('sort', 'new');
    const w = next.weaves ?? weaves;
    const c = next.colors ?? colors;
    const b = next.bracket === undefined ? bracket : next.bracket;
    const o = next.order ?? sort;
    const pn = next.pmin === undefined ? pmin : next.pmin;
    const px = next.pmax === undefined ? pmax : next.pmax;
    const d = next.discount === undefined ? discount : next.discount;
    const av = next.availability ?? availability;
    if (w.length) params.set('weave', w.join(','));
    if (c.length) params.set('color', c.join(','));
    if (b) params.set('bracket', b);
    if (pn) params.set('pmin', pn);
    if (px) params.set('pmax', px);
    if (d) params.set('discount', d);
    if (av.length) params.set('avail', av.join(','));
    if (o && o !== 'newest') params.set('order', o);
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const toggleWeave = (w: Weave) =>
    updateUrl({ weaves: weaves.includes(w) ? weaves.filter((x) => x !== w) : [...weaves, w] });
  const toggleColor = (id: string) =>
    updateUrl({ colors: colors.includes(id) ? colors.filter((x) => x !== id) : [...colors, id] });
  const selectBracket = (id: string) =>
    updateUrl({ bracket: bracket === id ? null : id });
  const selectDiscount = (id: string) =>
    updateUrl({ discount: discount === id ? null : id });
  const toggleAvailability = (b: BadgeKind) =>
    updateUrl({
      availability: availability.includes(b)
        ? availability.filter((x) => x !== b)
        : [...availability, b],
    });
  const clearAll = () => router.replace('/shop?sort=new', { scroll: false });

  // Local-state mirrors for the From/To inputs so the user can type
  // freely; the value is only committed to the URL on blur or Enter.
  // The mirror re-syncs when the URL changes externally (e.g. Clear).
  const [minInput, setMinInput] = useState(pmin ?? '');
  const [maxInput, setMaxInput] = useState(pmax ?? '');
  useEffect(() => { setMinInput(pmin ?? ''); }, [pmin]);
  useEffect(() => { setMaxInput(pmax ?? ''); }, [pmax]);
  const commitRange = () => {
    const nextMin = minInput.trim() ? String(Math.max(0, Number(minInput) || 0)) : null;
    const nextMax = maxInput.trim() ? String(Math.max(0, Number(maxInput) || 0)) : null;
    if (nextMin === pmin && nextMax === pmax) return;
    updateUrl({ pmin: nextMin, pmax: nextMax });
  };

  // Base catalogue — reverse-ordered so "newest" is most-recent SAREES
  // entries first. A dedicated `createdAt` field would be more honest
  // but reverse-iteration matches how the catalogue is seeded.
  const base = useMemo(() => [...SAREES].reverse(), []);

  // Filter + sort pipeline.
  const items = useMemo(() => {
    let list = base;
    if (weaves.length) list = list.filter((s) => weaves.includes(s.weave));
    if (colors.length) {
      list = list.filter((s) => colors.some((cid) => sareeMatchesColor(s, cid)));
    }
    if (bracket) {
      const pb = PRICE_BRACKETS.find((p) => p.id === bracket);
      if (pb) list = list.filter((s) => s.price >= pb.min && s.price < pb.max);
    }
    // Custom range inputs (pmin/pmax) layer on top of the bracket —
    // both constrain the price, so an intersection is the correct
    // behaviour.
    const nMin = pmin ? Number(pmin) : null;
    const nMax = pmax ? Number(pmax) : null;
    if (nMin !== null && !Number.isNaN(nMin)) list = list.filter((s) => s.price >= nMin);
    if (nMax !== null && !Number.isNaN(nMax)) list = list.filter((s) => s.price <= nMax);
    if (discount) {
      const db = DISCOUNT_BANDS.find((d) => d.id === discount);
      if (db) {
        list = list.filter((s) => {
          const d = discountPct(s);
          return d >= db.min && d < db.max;
        });
      }
    }
    if (availability.length) {
      list = list.filter((s) => availability.some((b) => s.badges.includes(b)));
    }
    if (sort === 'price-asc') list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    return list;
  }, [base, weaves, colors, bracket, pmin, pmax, discount, availability, sort]);

  // Per-filter counts — drives the small grey numbers next to each row.
  const weaveCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const s of base) map[s.weave] = (map[s.weave] ?? 0) + 1;
    return map;
  }, [base]);
  const colorCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of STANDARD_COLORWAYS) {
      map[c.id] = base.filter((s) => sareeMatchesColor(s, c.id)).length;
    }
    return map;
  }, [base]);

  // Discount counts — one tally per band, computed off the base list so
  // the numbers stay stable as other filters toggle (Kalki's pattern).
  const discountCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of DISCOUNT_BANDS) map[b.id] = 0;
    for (const s of base) {
      const d = discountPct(s);
      if (d <= 0) continue;
      for (const b of DISCOUNT_BANDS) {
        if (d >= b.min && d < b.max) { map[b.id] += 1; break; }
      }
    }
    return map;
  }, [base]);

  // Availability counts — one tally per badge kind, computed off the
  // base list so the numbers stay stable as other filters toggle.
  const availabilityCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of AVAILABILITY_BADGES) map[b] = 0;
    for (const s of base) for (const b of s.badges) {
      if (b in map) map[b] += 1;
    }
    return map;
  }, [base]);

  const activeCount =
    weaves.length +
    colors.length +
    (bracket ? 1 : 0) +
    (pmin || pmax ? 1 : 0) +
    (discount ? 1 : 0) +
    availability.length;

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <NewArrivalsIntro />
      <CategoryTiles />

      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-8">
        {/* Breadcrumb + sort/count bar */}
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-3">
          <span className="hover:text-gray-900 cursor-default">Home</span>
          <span className="mx-1.5">/</span>
          <span className="text-gray-900">New Arrivals</span>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* ───── Filter rail — Kalki pattern ───── */}
          {/* Sticky filter rail — on desktop it pins under the nav
              (top offset = nav height + a bit of breathing room) and
              gets its own scroll track so a long filter list scrolls
              independently of the product grid. Mobile falls back to
              static since the rail stacks above the grid there.
              The wrapper uses `direction: rtl` so the vertical
              scrollbar renders on the LEFT edge of the rail (Kalki's
              layout); the inner panel flips back to `direction: ltr`
              so the filter content itself stays left-aligned. */}
          <aside className="w-full lg:w-[260px] shrink-0 lg:self-start lg:sticky lg:top-[120px]">
            <div
              className="lg:max-h-[calc(100vh-140px)] lg:overflow-y-auto lg:pl-2 filter-scroll"
              style={{ direction: 'rtl' }}
            >
            <div style={{ direction: 'ltr' }}>
            <div className="flex items-center justify-between pb-3 border-b-2 border-gray-900">
              <div className="text-[0.95rem] font-bold text-gray-900 uppercase tracking-[0.15em]">
                Filters
              </div>
              {activeCount > 0 && (
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-bold text-maroon-deep hover:underline uppercase"
                >
                  Clear ({activeCount})
                </button>
              )}
            </div>

            <Section title="Price">
              {PRICE_BRACKETS.map((b) => (
                <PriceRow
                  key={b.id}
                  label={b.label}
                  checked={bracket === b.id}
                  onChange={() => selectBracket(b.id)}
                />
              ))}

              {/* Custom range — From/To inputs with a leading ₹ glyph.
                  Committed on blur or Enter; a short press of Enter in
                  either field submits both values. Kalki's exact UX. */}
              <div className="mt-3 flex items-center gap-2">
                <RangeInput
                  prefix="₹"
                  placeholder="From"
                  value={minInput}
                  onChange={setMinInput}
                  onCommit={commitRange}
                />
                <span className="text-gray-400">–</span>
                <RangeInput
                  placeholder="To"
                  value={maxInput}
                  onChange={setMaxInput}
                  onCommit={commitRange}
                />
              </div>
            </Section>

            {/* Availability — pulled off the on-image badge overlay
                (ProductCard gets hideBadges=true below) and surfaced
                as multi-select chips. Toned, pill-shaped buttons so the
                rail reads as filters instead of product adornments. */}
            <Section title="Availability">
              <div className="flex flex-wrap gap-2 pt-1">
                {AVAILABILITY_BADGES.map((b) => {
                  const active = availability.includes(b);
                  const count = availabilityCounts[b] ?? 0;
                  const disabled = count === 0 && !active;
                  return (
                    <button
                      key={b}
                      type="button"
                      onClick={() => toggleAvailability(b)}
                      disabled={disabled}
                      aria-pressed={active}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[0.72rem] font-semibold uppercase tracking-wide rounded-full border transition-colors ${
                        active
                          ? 'bg-gray-900 text-white border-gray-900'
                          : disabled
                          ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                          : 'border-gray-300 text-gray-700 hover:border-gray-900 hover:text-gray-900'
                      }`}
                    >
                      {BADGE_LABEL[b]}
                      <span className={`tabular-nums text-[0.68rem] font-normal ${active ? 'text-white/70' : 'text-gray-500'}`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Weave">
              {WEAVES.map((w) => (
                <Check
                  key={w}
                  label={w}
                  checked={weaves.includes(w)}
                  onChange={() => toggleWeave(w)}
                  count={weaveCounts[w] ?? 0}
                />
              ))}
            </Section>

            <Section title="Color">
              <div className="flex flex-wrap gap-2">
                {STANDARD_COLORWAYS.map((c) => {
                  const active = colors.includes(c.id);
                  const count = colorCounts[c.id] ?? 0;
                  const disabled = count === 0 && !active;
                  return (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => toggleColor(c.id)}
                      aria-label={`Filter by ${c.name} (${count})`}
                      aria-pressed={active}
                      disabled={disabled}
                      title={`${c.name} (${count})`}
                      className={`relative w-8 h-8 rounded-full border-2 transition-all ${
                        active
                          ? 'border-gray-900 p-0.5'
                          : disabled
                          ? 'border-transparent opacity-30 cursor-not-allowed p-0.5'
                          : 'border-transparent hover:border-gray-400 p-0.5'
                      }`}
                    >
                      <span
                        className="block w-full h-full rounded-full border border-gray-200"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  );
                })}
              </div>
            </Section>

            <Section title="Discount %" defaultOpen={false}>
              {DISCOUNT_BANDS.map((b) => (
                <Check
                  key={b.id}
                  label={b.label}
                  checked={discount === b.id}
                  onChange={() => selectDiscount(b.id)}
                  count={discountCounts[b.id] ?? 0}
                />
              ))}
            </Section>
            </div>
            </div>
          </aside>

          {/* ───── Product grid + sort bar ───── */}
          <section className="flex-1 min-w-0">
            <div className="flex items-end justify-between gap-4 flex-wrap pb-4 border-b border-gray-200">
              <div className="text-sm text-gray-700 tabular-nums">
                <span className="font-semibold text-gray-900">{items.length}</span>{' '}
                {items.length === 1 ? 'product' : 'products'}
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-700">
                <span className="uppercase tracking-wide text-[0.72rem] font-bold text-gray-500">
                  Sort by
                </span>
                <select
                  value={sort}
                  onChange={(e) => updateUrl({ order: e.target.value as Sort })}
                  className="border border-gray-300 px-3 py-1.5 text-sm bg-white focus:outline-none focus:border-gray-900"
                >
                  {(Object.keys(SORT_LABELS) as Sort[]).map((s) => (
                    <option key={s} value={s}>{SORT_LABELS[s]}</option>
                  ))}
                </select>
              </label>
            </div>

            {items.length === 0 ? (
              <div className="py-16 text-center text-sm text-gray-600">
                No sarees match these filters.{' '}
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-maroon-deep font-semibold underline underline-offset-2"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-8 pt-6">
                {items.map((s, i) => (
                  <ProductCard
                    key={s.id}
                    saree={s}
                    priority={i < 4}
                    hideBadges
                    hideDiscountOverlay
                    showBadgesBelowPrice
                    showViewSimilar
                  />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Scoped scrollbar styling for the sticky filter rail. Scoped
          to .filter-scroll so it doesn't leak to the rest of the app.
          Firefox uses `scrollbar-*`, WebKit/Blink use the pseudo. */}
      <style jsx global>{`
        .filter-scroll {
          scrollbar-width: thin;
          scrollbar-color: #9CA3AF transparent;
        }
        .filter-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .filter-scroll::-webkit-scrollbar-track {
          background: transparent;
        }
        .filter-scroll::-webkit-scrollbar-thumb {
          background-color: #D1D5DB;
          border-radius: 3px;
        }
        .filter-scroll:hover::-webkit-scrollbar-thumb {
          background-color: #9CA3AF;
        }
      `}</style>
    </div>
  );
}
