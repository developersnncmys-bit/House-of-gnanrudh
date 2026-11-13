'use client';

import { useState } from 'react';

/**
 * Shared filter-rail primitives used by every category view.
 * Design brief: look premium and distinctly non-default — clear
 * tag/chip buttons for multi-selects, pill-shaped price rows, section
 * titles with a maroon accent bar, counts as rounded badges.
 */

// Section — collapsible group with:
//   • A short maroon-deep accent bar on the left of the title
//   • A rotating chevron on the right
//   • Smooth max-height + opacity reveal on open
export function Section({
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
        <span className="flex items-center gap-2.5">
          <span
            aria-hidden
            className={`inline-block w-[3px] rounded-full transition-all ${
              open ? 'h-4 bg-maroon-deep' : 'h-3 bg-gray-300 group-hover:bg-gray-500'
            }`}
          />
          <span
            className={`text-[0.82rem] font-bold uppercase tracking-[0.14em] transition-colors ${
              open ? 'text-gray-900' : 'text-gray-700 group-hover:text-gray-900'
            }`}
          >
            {title}
          </span>
        </span>
        <svg
          aria-hidden
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`text-gray-500 group-hover:text-gray-900 transition-transform duration-200 ${
            open ? 'rotate-180' : 'rotate-0'
          }`}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>
      <div
        className={`grid transition-[grid-template-rows,opacity] duration-200 ease-out ${
          open ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="pb-5">{children}</div>
        </div>
      </div>
    </div>
  );
}

// Check — a pill-tag button (not a checkbox row). Default is a
// hairline outlined chip; selected is filled maroon-deep with white
// text and a dot indicator. Count sits inside the chip as a rounded
// badge, tone-coded to the state.
export function Check({
  label,
  checked,
  onChange,
  count,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
  count?: number;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`group inline-flex items-center gap-2 w-full text-left px-3 py-2 mb-1.5 rounded-full border transition-all ${
        checked
          ? 'bg-maroon-deep text-white border-maroon-deep shadow-[0_2px_8px_-2px_rgba(4,37,9,0.25)]'
          : 'bg-white text-gray-800 border-gray-200 hover:border-gray-900 hover:bg-gray-50'
      }`}
    >
      <span
        aria-hidden
        className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
          checked ? 'bg-white' : 'bg-gray-300 group-hover:bg-gray-500'
        }`}
      />
      <span
        className={`text-[0.78rem] leading-tight flex-1 transition-colors ${
          checked ? 'font-semibold' : 'font-medium'
        }`}
      >
        {label}
      </span>
      {typeof count === 'number' && (
        <span
          className={`text-[0.65rem] tabular-nums font-bold px-1.5 py-0.5 rounded-full transition-colors shrink-0 min-w-[20px] text-center ${
            checked
              ? 'bg-white/20 text-white'
              : 'bg-gray-100 text-gray-600 group-hover:bg-gray-200'
          }`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

// RangeInput — bordered numeric input with an optional currency prefix.
// Focus adds a maroon ring to distinguish from the chip outlines above.
export function RangeInput({
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
    <span className="inline-flex items-center flex-1 rounded-full border border-gray-300 focus-within:border-maroon-deep focus-within:ring-1 focus-within:ring-maroon-deep h-9 px-3 text-sm bg-white transition-colors">
      {prefix && <span className="text-gray-500 mr-1 text-xs">{prefix}</span>}
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
        className="w-full min-w-0 bg-transparent focus:outline-none text-gray-900 placeholder:text-gray-400 tabular-nums text-[0.78rem]"
      />
    </span>
  );
}

// PriceRow — single-select pill. Same chip family as Check but
// without a count badge (brackets don't have one). Active is filled
// maroon-deep like Check.
export function PriceRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      aria-pressed={checked}
      className={`group inline-flex items-center gap-2 w-full text-left px-3 py-2 mb-1.5 rounded-full border transition-all ${
        checked
          ? 'bg-maroon-deep text-white border-maroon-deep shadow-[0_2px_8px_-2px_rgba(4,37,9,0.25)]'
          : 'bg-white text-gray-800 border-gray-200 hover:border-gray-900 hover:bg-gray-50'
      }`}
    >
      <span
        aria-hidden
        className={`inline-block w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
          checked ? 'bg-white' : 'bg-gray-300 group-hover:bg-gray-500'
        }`}
      />
      <span
        className={`text-[0.78rem] leading-tight flex-1 transition-colors ${
          checked ? 'font-semibold' : 'font-medium'
        }`}
      >
        {label}
      </span>
    </button>
  );
}
