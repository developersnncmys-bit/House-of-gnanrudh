'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { LuX } from 'react-icons/lu';
import { SAREES, formatINR } from '@/lib/sarees';
import { navHref } from '@/lib/soft-launch';
import { useScrollLock } from '@/lib/scroll-lock';
import AddToCartButton from '@/components/shop/AddToCartButton';

/**
 * ViewSimilarButton — Pothys-style "view similar" trigger overlaid on
 * a product card. Permanent icon pill (same visual family as
 * WishlistButton); hover reveals a label tooltip; click opens a modal
 * with 8 products from the same weave, each with an Add-to-Bag CTA.
 *
 * The modal is portaled to <body> so it isn't nested inside the
 * product card's <Link>. Nesting a fixed overlay inside an <a> breaks
 * wheel event bubbling in some browsers, which lets scroll leak to
 * the page behind.
 */
export default function ViewSimilarButton({
  productId,
  className = '',
  size = 14,
}: {
  productId: string;
  className?: string;
  size?: number;
}) {
  const [open, setOpen] = useState(false);

  const current = SAREES.find((s) => s.id === productId);
  const similar = current
    ? SAREES.filter((s) => s.weave === current.weave && s.id !== productId).slice(0, 8)
    : [];

  // Shared project scroll-lock: Lenis-aware body overflow with reference
  // counting so nested modals don't release each other's lock.
  useScrollLock(open);

  // Close on Escape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setOpen(true);
  };

  const modal =
    typeof document !== 'undefined' && open
      ? createPortal(
          <div
            className="fixed inset-0 z-[60] bg-black/55 flex items-center justify-center p-3 md:p-6"
            onClick={() => setOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-label="Similar products"
            // Lenis cooperation — see lib/scroll-lock.ts. Without this,
            // Lenis preventDefaults wheel events over the modal and the
            // popup body won't scroll natively.
            data-lenis-prevent
          >
            <div
              className="bg-white w-full max-w-5xl max-h-[88vh] overflow-y-auto overscroll-contain rounded-sm shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="sticky top-0 bg-white flex items-center justify-between px-5 md:px-7 py-4 border-b border-ink/10 z-10">
                <h3 className="font-display text-lg md:text-2xl font-bold text-ink">
                  Similar {current?.weave ?? ''} Sarees
                </h3>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close"
                  className="p-1 text-ink hover:text-maroon transition-colors"
                >
                  <LuX size={22} strokeWidth={1.8} aria-hidden />
                </button>
              </div>

              {similar.length === 0 ? (
                <div className="px-6 py-10 text-sm text-ink/60 text-center">
                  No similar pieces in this weave right now.
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 px-5 md:px-7 py-5 md:py-6">
                  {similar.map((s) => {
                    const href = navHref(`/shop/${s.id}`);
                    const inner = (
                      <>
                        <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                          <Image
                            src={s.image}
                            alt={s.name}
                            fill
                            sizes="(max-width: 768px) 50vw, 20vw"
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        </div>
                        <div className="pt-3">
                          <div className="text-xs text-ink/55 font-medium mb-0.5">
                            {s.weave}
                          </div>
                          <div className="text-sm font-semibold text-ink line-clamp-1">
                            {s.name}
                          </div>
                          <div className="text-sm font-bold text-ink mt-1 mb-2.5 tabular-nums">
                            {formatINR(s.price)}
                          </div>
                        </div>
                      </>
                    );
                    return (
                      <div key={s.id} className="flex flex-col">
                        {href ? (
                          <Link
                            href={href}
                            onClick={() => setOpen(false)}
                            className="group block"
                          >
                            {inner}
                          </Link>
                        ) : (
                          <span className="group block cursor-default">
                            {inner}
                          </span>
                        )}
                        <AddToCartButton
                          productId={s.id}
                          variant="compact"
                          className="w-full !bg-ink !text-ivory hover:!bg-maroon-deep !py-2.5 !text-[0.7rem] !tracking-[0.14em]"
                        >
                          Add to Bag
                        </AddToCartButton>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>,
          document.body,
        )
      : null;

  return (
    <>
      <button
        type="button"
        onClick={handle}
        aria-label="View similar products"
        className={clsx(
          'group/vs relative flex items-center justify-center rounded-full bg-ivory/95 text-ink hover:text-maroon backdrop-blur-sm transition-colors',
          className,
        )}
      >
        <ViewSimilarIcon size={size} />
        {/* Tooltip — appears to the left of the pill on hover. */}
        <span className="absolute right-full top-1/2 -translate-y-1/2 mr-2 whitespace-nowrap bg-ink text-ivory text-[0.6rem] font-bold uppercase tracking-[0.14em] px-2 py-1 rounded-sm opacity-0 group-hover/vs:opacity-100 pointer-events-none transition-opacity">
          View Similar
        </span>
      </button>
      {modal}
    </>
  );
}

// "Similar items" glyph — two overlapping outlined rectangles reading
// as a stack of cards (one in front, one behind). Clearer "view
// similar" cue than a plain 2x2 grid.
function ViewSimilarIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {/* Back card — offset up-right. */}
      <rect x="8" y="3" width="13" height="13" rx="2" />
      {/* Front card — offset down-left, slightly larger feel. */}
      <rect x="3" y="8" width="13" height="13" rx="2" fill="currentColor" fillOpacity="0.12" />
    </svg>
  );
}
