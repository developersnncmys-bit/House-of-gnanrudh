'use client';

/**
 * FilterTriggerBar — Tulsi-style top row above the product grid:
 *   [ ⨳ SHOW FILTERS ]  X products          SORT BY: Latest ▾
 *
 * Replaces the sticky left filter rail + the "N products + sort"
 * bar every category view used to render inline. Sort options and
 * handler are passed by the view so each page keeps its own sort set
 * (bestseller / newest / featured / discount-desc etc.).
 */

export default function FilterTriggerBar({
  productCount,
  activeCount,
  onOpenFilter,
  sortValue,
  sortOptions,
  onSortChange,
}: {
  productCount: number;
  activeCount: number;
  onOpenFilter: () => void;
  sortValue: string;
  sortOptions: { value: string; label: string }[];
  onSortChange: (value: string) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 flex-wrap pb-5 border-b border-gray-200">
      <div className="flex items-center gap-4">
        {/* Show Filters — premium pill: ink-filled icon medallion
            inside a bordered chip, tracked-out label, gold active
            badge. Hover darkens the border and lifts the shadow. */}
        <button
          type="button"
          onClick={onOpenFilter}
          className="group inline-flex items-center gap-2.5 bg-white border border-gray-900 hover:border-maroon-deep text-gray-900 pl-1 pr-4 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)] transition-all"
        >
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white group-hover:bg-maroon-deep transition-colors">
            <SlidersIcon />
          </span>
          <span className="text-[0.72rem] font-bold uppercase tracking-[0.18em]">
            Show Filters
          </span>
          {activeCount > 0 && (
            <span className="inline-flex items-center justify-center min-w-[22px] h-[22px] px-1.5 rounded-full bg-gold-deep text-white text-[0.68rem] font-extrabold tabular-nums shadow-[0_2px_6px_-1px_rgba(166,109,35,0.4)]">
              {activeCount}
            </span>
          )}
        </button>
        <div className="text-sm text-gray-700 tabular-nums">
          <span className="font-semibold text-gray-900">{productCount}</span>{' '}
          {productCount === 1 ? 'product' : 'products'}
        </div>
      </div>

      {/* Sort By — mirrors the Show Filters pill exactly: same ink
          medallion inset at the left, same tracked label, same border
          + shadow. Native <select> sits transparently on top of the
          label so the pill reads consistent with its sibling. */}
      <label className="inline-flex items-center gap-3 text-sm text-gray-700">
        <span className="uppercase tracking-[0.18em] text-[0.68rem] font-bold text-gray-500">
          Sort by
        </span>
        <div className="group relative inline-flex items-center gap-2.5 bg-white border border-gray-900 hover:border-maroon-deep text-gray-900 pl-1 pr-10 py-1 rounded-full shadow-[0_1px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_12px_-2px_rgba(0,0,0,0.12)] transition-all">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-ink text-white group-hover:bg-maroon-deep transition-colors">
            <SortIcon />
          </span>
          <span className="text-[0.72rem] font-bold uppercase tracking-[0.18em] whitespace-nowrap">
            {sortOptions.find((o) => o.value === sortValue)?.label ?? sortValue}
          </span>
          <select
            value={sortValue}
            onChange={(e) => onSortChange(e.target.value)}
            aria-label="Sort by"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer appearance-none"
          >
            {sortOptions.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-700 group-hover:text-maroon-deep transition-colors pointer-events-none"
            aria-hidden
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </label>
    </div>
  );
}

function SortIcon() {
  // Horizontal lines, descending length — a classic "sort" glyph that
  // reads at 12 px and pairs nicely with the sliders icon on the left.
  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <line x1="4" y1="12" x2="16" y2="12" />
      <line x1="4" y1="17" x2="12" y2="17" />
    </svg>
  );
}

function SlidersIcon() {
  // Horizontal sliders glyph — reads clearly as "filters" at 14 px.
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <line x1="4" y1="7" x2="20" y2="7" />
      <circle cx="10" cy="7" r="2.2" fill="currentColor" stroke="none" />
      <line x1="4" y1="17" x2="20" y2="17" />
      <circle cx="16" cy="17" r="2.2" fill="currentColor" stroke="none" />
    </svg>
  );
}
