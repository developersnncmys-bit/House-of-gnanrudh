'use client';

import { useEffect } from 'react';
import { useScrollLock } from '@/lib/scroll-lock';

/**
 * FilterDrawer — left-sliding drawer that houses the category filter
 * rail. Replaces the sticky 260 px sidebar every category view used
 * to carry inline. One drawer, one design, one close/apply flow —
 * every category view just passes its own filter sections as children.
 *
 * Esc + backdrop-click dismiss. Body scroll is locked while open.
 */
export default function FilterDrawer({
  open,
  onClose,
  productCount,
  activeCount,
  onClearAll,
  onApply,
  children,
}: {
  open: boolean;
  onClose: () => void;
  productCount: number;
  activeCount: number;
  onClearAll: () => void;
  // "Apply" is a UX affordance — the filter state is already live
  // (URL-synced). This just dismisses the drawer. Separate from
  // `onClose` only so the view could override it in the future.
  onApply?: () => void;
  children: React.ReactNode;
}) {
  // Body scroll lock — delegated to the project hook so Lenis's
  // smooth-scroll instance is paused correctly (plain `body { overflow:
  // hidden }` leaks because Lenis drives scroll on its own transform).
  useScrollLock(open);

  // Esc dismiss.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const handleApply = () => {
    if (onApply) onApply();
    else onClose();
  };

  return (
    <div
      aria-hidden={!open}
      // data-lenis-prevent → tells Lenis to release wheel/touch events
      // over this subtree so the drawer body can scroll natively
      // instead of driving the page underneath.
      data-lenis-prevent
      className={`fixed inset-0 z-[60] ${open ? '' : 'pointer-events-none'}`}
    >
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/40 transition-opacity duration-200 ${
          open ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Drawer panel */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Filters"
        className={`absolute left-0 top-0 h-full w-full max-w-[380px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold text-gray-900 tracking-tight">
              Filter
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close filters"
              className="w-9 h-9 flex items-center justify-center text-gray-700 hover:text-gray-900 transition-colors -mr-2"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="mt-1 flex items-center gap-3">
            <div className="text-sm text-gray-500 tabular-nums">
              {productCount} products
            </div>
            {activeCount > 0 && (
              <>
                <span className="text-gray-300" aria-hidden>·</span>
                <button
                  type="button"
                  onClick={onClearAll}
                  className="text-xs font-bold uppercase tracking-[0.12em] text-maroon-deep hover:underline"
                >
                  Clear ({activeCount})
                </button>
              </>
            )}
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 min-h-0 overflow-y-auto px-6 filter-drawer-scroll">
          {children}
        </div>

        {/* Footer — "Remove all" (left, text-link) + Apply (right,
            filled). Mirrors the Tulsi pattern. "Remove all" is hidden
            when no filter is active since there's nothing to clear. */}
        <div className="px-6 py-5 border-t border-gray-200 bg-white flex items-center gap-4">
          {activeCount > 0 ? (
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm font-semibold text-gray-700 hover:text-maroon-deep underline underline-offset-4 decoration-gray-400 hover:decoration-maroon-deep transition-colors shrink-0"
            >
              Remove all
            </button>
          ) : (
            <span aria-hidden className="shrink-0" />
          )}
          <button
            type="button"
            onClick={handleApply}
            className="flex-1 bg-ink text-white py-3.5 text-sm font-bold uppercase tracking-[0.18em] hover:bg-maroon-deep transition-colors"
          >
            Apply
          </button>
        </div>
      </aside>

      <style jsx global>{`
        .filter-drawer-scroll {
          scrollbar-width: thin;
          scrollbar-color: #9CA3AF transparent;
        }
        .filter-drawer-scroll::-webkit-scrollbar { width: 6px; }
        .filter-drawer-scroll::-webkit-scrollbar-track { background: transparent; }
        .filter-drawer-scroll::-webkit-scrollbar-thumb {
          background-color: #D1D5DB;
          border-radius: 3px;
        }
        .filter-drawer-scroll:hover::-webkit-scrollbar-thumb {
          background-color: #9CA3AF;
        }
      `}</style>
    </div>
  );
}
