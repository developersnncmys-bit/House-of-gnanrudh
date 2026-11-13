'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { SAREES, STANDARD_COLORWAYS, BADGE_LABEL, sareeMatchesColor } from '@/lib/sarees';
import type { Weave, BadgeKind } from '@/lib/sarees';
import ProductCard from './ProductCard';
import { Section, Check, RangeInput, PriceRow } from './FilterRailPrimitives';
import CategoryWeaveIntro from './CategoryWeaveIntro';
import CategoryStylingGuide from './CategoryStylingGuide';
import CategoryEditorialBlock from './CategoryEditorialBlock';
import CategoryTrustBand from './CategoryTrustBand';
import FilterDrawer from './FilterDrawer';
import FilterTriggerBar from './FilterTriggerBar';

/**
 * CategoryWeaveView — Kalki-style landing page for a single weave
 * (Kanjeevaram, Banarasi, Mysore Silk, …). Mirrors NewArrivalsView
 * so every category reads the same visual family, but the Weave
 * section is dropped from the filter rail (the page IS the weave),
 * the base dataset is pre-filtered to the active weave, and URL
 * writes preserve `weave=X`.
 *
 * Kept entirely separate from NewArrivalsView so changes to one
 * can't accidentally regress the other — explicit duplication over
 * clever conditional rendering per the project's "don't affect
 * working" rule.
 */

const AVAILABILITY_BADGES: BadgeKind[] = ['ready', 'fast', 'last'];

const PRICE_BRACKETS: { id: string; label: string; min: number; max: number }[] = [
  { id: 'under-5k',  label: 'Under ₹5,000',           min: 0,     max: 5000 },
  { id: '5-15k',     label: '₹5,000 – ₹15,000',       min: 5000,  max: 15000 },
  { id: '15-30k',    label: '₹15,000 – ₹30,000',      min: 15000, max: 30000 },
  { id: '30-60k',    label: '₹30,000 – ₹60,000',      min: 30000, max: 60000 },
  { id: 'above-60k', label: 'Above ₹60,000',          min: 60000, max: Infinity },
];

const DISCOUNT_BANDS: { id: string; label: string; min: number; max: number }[] = [
  { id: '10-20',  label: '10 – 20%',   min: 10,  max: 20 },
  { id: '20-30',  label: '20 – 30%',   min: 20,  max: 30 },
  { id: '30-40',  label: '30 – 40%',   min: 30,  max: 40 },
  { id: '40plus', label: '40% & Above', min: 40,  max: Infinity },
];

function discountPct(saree: (typeof SAREES)[number]): number {
  if (!saree.mrp) return 0;
  return Math.round(((saree.mrp - saree.price) / saree.mrp) * 100);
}

type Sort = 'curated' | 'price-asc' | 'price-desc';

const SORT_LABELS: Record<Sort, string> = {
  curated: 'Featured',
  'price-asc': 'Price: Low to High',
  'price-desc': 'Price: High to Low',
};

// Section / Check / RangeInput / PriceRow live in
// FilterRailPrimitives.tsx — shared across every category view.
export default function CategoryWeaveView({ weave }: { weave: Weave }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Parse filters from URL. The weave itself is locked by prop, not
  // derived from the URL, so the page is deterministic.
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
    rawSort && rawSort in SORT_LABELS ? (rawSort as Sort) : 'curated';

  // URL writer — always preserves `weave=<weave>` so the page stays
  // on itself; every other filter is round-trippable.
  const updateUrl = (
    next: {
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
    params.set('weave', weave);
    const c = next.colors ?? colors;
    const b = next.bracket === undefined ? bracket : next.bracket;
    const o = next.order ?? sort;
    const pn = next.pmin === undefined ? pmin : next.pmin;
    const px = next.pmax === undefined ? pmax : next.pmax;
    const d = next.discount === undefined ? discount : next.discount;
    const av = next.availability ?? availability;
    if (c.length) params.set('color', c.join(','));
    if (b) params.set('bracket', b);
    if (pn) params.set('pmin', pn);
    if (px) params.set('pmax', px);
    if (d) params.set('discount', d);
    if (av.length) params.set('avail', av.join(','));
    if (o && o !== 'curated') params.set('order', o);
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

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
  const clearAll = () =>
    router.replace(`/shop?weave=${encodeURIComponent(weave)}`, { scroll: false });

  const [minInput, setMinInput] = useState(pmin ?? '');
  const [maxInput, setMaxInput] = useState(pmax ?? '');
  const [drawerOpen, setDrawerOpen] = useState(false);
  useEffect(() => { setMinInput(pmin ?? ''); }, [pmin]);
  useEffect(() => { setMaxInput(pmax ?? ''); }, [pmax]);
  const commitRange = () => {
    const nextMin = minInput.trim() ? String(Math.max(0, Number(minInput) || 0)) : null;
    const nextMax = maxInput.trim() ? String(Math.max(0, Number(maxInput) || 0)) : null;
    if (nextMin === pmin && nextMax === pmax) return;
    updateUrl({ pmin: nextMin, pmax: nextMax });
  };

  // Base dataset — only sarees matching the locked weave. Reversed so
  // "newest" weaves of this type appear first by default.
  const base = useMemo(
    () => SAREES.filter((s) => s.weave === weave).reverse(),
    [weave],
  );

  const items = useMemo(() => {
    let list = base;
    if (colors.length) {
      list = list.filter((s) => colors.some((cid) => sareeMatchesColor(s, cid)));
    }
    if (bracket) {
      const pb = PRICE_BRACKETS.find((p) => p.id === bracket);
      if (pb) list = list.filter((s) => s.price >= pb.min && s.price < pb.max);
    }
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
  }, [base, colors, bracket, pmin, pmax, discount, availability, sort]);

  const colorCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const c of STANDARD_COLORWAYS) {
      map[c.id] = base.filter((s) => sareeMatchesColor(s, c.id)).length;
    }
    return map;
  }, [base]);

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

  const availabilityCounts = useMemo(() => {
    const map: Record<string, number> = {};
    for (const b of AVAILABILITY_BADGES) map[b] = 0;
    for (const s of base) for (const b of s.badges) {
      if (b in map) map[b] += 1;
    }
    return map;
  }, [base]);

  const activeCount =
    colors.length +
    (bracket ? 1 : 0) +
    (pmin || pmax ? 1 : 0) +
    (discount ? 1 : 0) +
    availability.length;

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <CategoryWeaveIntro weave={weave} />

      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-3">
          <span className="hover:text-gray-900 cursor-default">Home</span>
          <span className="mx-1.5">/</span>
          <span className="text-gray-900">{weave}</span>
        </nav>

        <section>
          {/* Top row — filter trigger + product count on left,
              sort dropdown on right. Replaces the old sticky-aside
              + inline sort row pattern. */}
          <FilterTriggerBar
            productCount={items.length}
            activeCount={activeCount}
            onOpenFilter={() => setDrawerOpen(true)}
            sortValue={sort}
            sortOptions={(Object.keys(SORT_LABELS) as Sort[]).map((s) => ({
              value: s,
              label: SORT_LABELS[s],
            }))}
            onSortChange={(v) => updateUrl({ order: v as Sort })}
          />

          {items.length === 0 ? (
            <div className="py-16 text-center text-sm text-gray-600">
              No {weave} sarees match these filters.{' '}
              <button
                type="button"
                onClick={clearAll}
                className="text-maroon-deep font-semibold underline underline-offset-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-4 gap-y-8 pt-8">
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

      {/* Filter drawer — slides in from the left when the trigger is
          clicked. Houses every filter section the sticky rail used to. */}
      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productCount={items.length}
        activeCount={activeCount}
        onClearAll={clearAll}
      >
        <Section title="Price">
          {PRICE_BRACKETS.map((b) => (
            <PriceRow
              key={b.id}
              label={b.label}
              checked={bracket === b.id}
              onChange={() => selectBracket(b.id)}
            />
          ))}
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
                  className={`relative w-9 h-9 rounded-full border-2 transition-all ${
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
      </FilterDrawer>

      {/* Editorial footer blocks — weave-scoped so every category page
          carries copy tailored to its own drape. Kept out of
          NewArrivalsView so the New Arrivals page stays lean. The
          trust band bridges the grid and the editorial copy below. */}
      <CategoryTrustBand />
      <CategoryStylingGuide weave={weave} />
      <CategoryEditorialBlock weave={weave} />

    </div>
  );
}
