'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  SAREES,
  STANDARD_COLORWAYS,
  BADGE_LABEL,
  sareeMatchesColor,
} from '@/lib/sarees';
import type { Weave, BadgeKind } from '@/lib/sarees';
import ProductCard from './ProductCard';
import CategoryPriceIntro from './CategoryPriceIntro';
import CategoryTrustBand from './CategoryTrustBand';
import FilterDrawer from './FilterDrawer';
import FilterTriggerBar from './FilterTriggerBar';
import { Section, Check } from './FilterRailPrimitives';

/**
 * CategoryPriceView — Kalki-style landing for Shop-by-Price URLs
 * (/shop?maxPrice=10000, /shop?minPrice=10000&maxPrice=25000, …).
 * Same recipe as the sibling category views — the only unique bit
 * is the Price filter section being dropped (the page IS the price).
 */

const WEAVES: Weave[] = [
  'Kanjivaram', 'Banarasi', 'Mysore Silk', 'Mangalagiri',
  'Pochampally', 'Gadwal', 'Patola', 'Fancy Sarees', 'Mixed Pattu Sarees',
];

const AVAILABILITY_BADGES: BadgeKind[] = ['ready', 'fast', 'last'];

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

// Section / Check live in FilterRailPrimitives.tsx — shared across
// every category view so filter-rail design can be tuned in one place.

export default function CategoryPriceView({
  pmin,
  pmax,
}: {
  pmin: number | null;
  pmax: number | null;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL filters (price is locked by prop, not read from URL).
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

  const updateUrl = (
    next: {
      weaves?: Weave[];
      colors?: string[];
      order?: Sort;
      discount?: string | null;
      availability?: BadgeKind[];
    },
  ) => {
    const params = new URLSearchParams();
    if (pmin !== null) params.set('minPrice', String(pmin));
    if (pmax !== null && pmax !== Infinity) params.set('maxPrice', String(pmax));
    const w = next.weaves ?? weaves;
    const c = next.colors ?? colors;
    const o = next.order ?? sort;
    const d = next.discount === undefined ? discount : next.discount;
    const av = next.availability ?? availability;
    if (w.length) params.set('weave', w.join(','));
    if (c.length) params.set('color', c.join(','));
    if (d) params.set('discount', d);
    if (av.length) params.set('avail', av.join(','));
    if (o && o !== 'curated') params.set('order', o);
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const toggleWeave = (w: Weave) =>
    updateUrl({ weaves: weaves.includes(w) ? weaves.filter((x) => x !== w) : [...weaves, w] });
  const toggleColor = (id: string) =>
    updateUrl({ colors: colors.includes(id) ? colors.filter((x) => x !== id) : [...colors, id] });
  const selectDiscount = (id: string) =>
    updateUrl({ discount: discount === id ? null : id });
  const toggleAvailability = (b: BadgeKind) =>
    updateUrl({
      availability: availability.includes(b)
        ? availability.filter((x) => x !== b)
        : [...availability, b],
    });
  const clearAll = () => {
    const params = new URLSearchParams();
    if (pmin !== null) params.set('minPrice', String(pmin));
    if (pmax !== null && pmax !== Infinity) params.set('maxPrice', String(pmax));
    router.replace(`/shop?${params.toString()}`, { scroll: false });
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  // Base dataset — sarees inside the locked price band, newest first.
  const base = useMemo(() => {
    const lo = pmin ?? 0;
    const hi = pmax ?? Infinity;
    return [...SAREES]
      .filter((s) => s.price >= lo && (hi === Infinity ? true : s.price < hi))
      .reverse();
  }, [pmin, pmax]);

  const items = useMemo(() => {
    let list = base;
    if (weaves.length) list = list.filter((s) => weaves.includes(s.weave));
    if (colors.length) {
      list = list.filter((s) => colors.some((cid) => sareeMatchesColor(s, cid)));
    }
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
  }, [base, weaves, colors, discount, availability, sort]);

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
    weaves.length + colors.length + (discount ? 1 : 0) + availability.length;

  return (
    <div className="bg-white min-h-screen text-gray-900">
      <CategoryPriceIntro pmin={pmin} pmax={pmax} />

      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-8">
        <nav aria-label="Breadcrumb" className="text-xs text-gray-500 mb-3">
          <span className="hover:text-gray-900 cursor-default">Home</span>
          <span className="mx-1.5">/</span>
          <span className="hover:text-gray-900 cursor-default">Shop by Price</span>
          <span className="mx-1.5">/</span>
          <span className="text-gray-900">{priceLabel(pmin, pmax)}</span>
        </nav>

        <section>
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
              No sarees match these filters in this price band.{' '}
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

      <CategoryTrustBand />

      <FilterDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        productCount={items.length}
        activeCount={activeCount}
        onClearAll={clearAll}
      >
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
    </div>
  );
}

function priceLabel(pmin: number | null, pmax: number | null): string {
  const fmt = (n: number) =>
    n >= 100000
      ? `₹${(n / 100000).toLocaleString('en-IN')}L`
      : `₹${n.toLocaleString('en-IN')}`;
  if (pmin && pmax) return `${fmt(pmin)} – ${fmt(pmax)}`;
  if (pmax && !pmin) return `Under ${fmt(pmax)}`;
  if (pmin && !pmax) return `Above ${fmt(pmin)}`;
  return 'All Prices';
}
