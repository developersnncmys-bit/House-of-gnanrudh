'use client';

import { useMemo, useState } from 'react';
import { type SAREES, formatINR, getColorways } from '@/lib/sarees';
import { useShop } from '@/lib/shop-store';
import { useCheckoutModal } from '@/lib/checkout-modal';
import { useLoginModal } from '@/lib/login-modal';
import { useAuth } from '@/lib/auth';

type Saree = (typeof SAREES)[number];

export default function ProductInfo({
  saree,
  mrp,
  badge,
  viewers,
  deliveryDate,
  colorId,
  onColorChange,
}: {
  saree: Saree;
  mrp?: number;
  badge?: string;
  viewers: number;
  deliveryDate: string;
  colorId: string;
  onColorChange: (id: string) => void;
}) {
  const { addToCart, inCart, toggleWishlist, inWishlist, hydrated } = useShop();
  const { openCheckout } = useCheckoutModal();
  const { openLogin } = useLoginModal();
  const { user, hydrated: authHydrated } = useAuth();

  // Express-checkout: drop the saree into the cart (if not already there)
  // and open the checkout popup. Gated — opens the login modal first if
  // the user isn't signed in, then resumes via the post-login callback.
  const handleBuyItNow = () => {
    if (!authHydrated) return;
    const proceed = () => {
      if (!inCart(saree.id)) addToCart(saree.id, 1);
      openCheckout();
    };
    if (!user) {
      openLogin(proceed);
      return;
    }
    proceed();
  };
  const colorways = useMemo(() => getColorways(saree), [saree]);
  const selectedColor = colorways.find((c) => c.id === colorId) ?? colorways[0];
  const [blouseOption, setBlouseOption] = useState<'unstitched' | 'stitched'>('unstitched');
  const [shareNote, setShareNote] = useState<string | null>(null);

  const discount = mrp ? Math.round(((mrp - saree.price) / mrp) * 100) : 0;
  const stitchingFee = blouseOption === 'stitched' ? 800 : 0;
  const total = saree.price + stitchingFee;



  const onShare = async () => {
    if (typeof window === 'undefined') return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: saree.name, url });
        return;
      }
      await navigator.clipboard.writeText(url);
      setShareNote('Link copied');
      setTimeout(() => setShareNote(null), 1800);
    } catch {
      /* user cancelled */
    }
  };

  const saved = hydrated && inWishlist(saree.id);

  return (
    <div className="lg:sticky lg:top-[200px]">
      {/* Title row + heart + share */}
      <div className="flex items-start justify-between gap-4 mb-3">
        <h1 className="text-[1.6rem] md:text-[1.75rem] font-bold text-gray-900 leading-tight flex-1">
          {saree.name}
        </h1>
        <div className="flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={() => toggleWishlist(saree.id)}
            aria-label={saved ? 'Remove from wishlist' : 'Add to wishlist'}
            aria-pressed={saved}
            className="p-2 text-gray-700 hover:text-maroon-deep transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20.8 6.6a5.5 5.5 0 0 0-9-1.7l-.8.8-.8-.8a5.5 5.5 0 1 0-7.8 7.8l8.6 8.5 8.6-8.5a5.5 5.5 0 0 0 1.2-6.1Z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={onShare}
            aria-label="Share"
            className="p-2 text-gray-700 hover:text-gray-900 transition-colors relative"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
              <line x1="15.4" y1="6.5" x2="8.6" y2="10.5" />
            </svg>
            {shareNote && (
              <span className="absolute top-full right-0 mt-1 bg-gray-900 text-white text-[0.65rem] px-2 py-0.5 whitespace-nowrap">
                {shareNote}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Style number */}
      <div className="text-xs text-gray-500 mb-3">
        Style No <span className="text-gray-700 font-medium">{saree.id.toUpperCase()}</span>
      </div>

      {badge && (
        <div className="inline-block bg-orange-50 text-orange-800 px-2.5 py-1 text-[0.7rem] font-semibold tracking-wide mb-4">
          {badge}
        </div>
      )}

      {/* Price — Kalki pattern: amount + "Inclusive Of All Taxes" sit on
          the same line, with the MRP / discount stacked underneath. */}
      <div className="flex items-baseline gap-3 flex-wrap mb-1">
        <span className="text-[1.75rem] font-semibold text-gray-900 tabular-nums">
          {formatINR(saree.price)}
        </span>
        <span className="text-xs text-gray-500">Inclusive Of All Taxes</span>
      </div>
      {mrp && (
        <div className="flex items-baseline gap-2 flex-wrap mb-6 text-sm">
          <span className="text-gray-500 line-through tabular-nums">
            MRP {formatINR(mrp)}
          </span>
          <span className="font-semibold text-scarlet tabular-nums">
            ({discount}% OFF)
          </span>
        </div>
      )}

      {/* Color — pill-style swatches with the colour name shown inline
          on every option, so visitors can tell the full palette at a
          glance without hovering each dot. Active chip carries a
          maroon ring and a tinted background wash. */}
      {colorways.length > 0 && selectedColor && (
        <div className="mb-5">
          <div className="flex items-baseline justify-between mb-3">
            <div className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-gray-900">
              Colour
            </div>
            <div className="text-sm text-gray-700">
              <span className="text-gray-500">Selected: </span>
              <span className="font-semibold text-gray-900">
                {selectedColor.name}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {colorways.map((c) => {
              const active = c.id === selectedColor.id;
              return (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => onColorChange(c.id)}
                  aria-label={`Choose colour ${c.name}`}
                  aria-pressed={active}
                  className={`group inline-flex items-center gap-2 pl-1.5 pr-3 py-1.5 rounded-full border transition-all ${
                    active
                      ? 'border-maroon-deep bg-maroon-deep/5 shadow-[inset_0_0_0_1px_rgba(77,0,21,0.25)]'
                      : 'border-gray-300 hover:border-gray-600 bg-white'
                  }`}
                >
                  <span className="relative inline-flex items-center justify-center w-6 h-6 rounded-full shrink-0">
                    <span
                      className="block w-6 h-6 rounded-full border border-black/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.12)]"
                      style={{ backgroundColor: c.hex }}
                    />
                    {active && (
                      <svg
                        viewBox="0 0 24 24"
                        className="absolute w-3.5 h-3.5 text-white drop-shadow-[0_0_1px_rgba(0,0,0,0.4)]"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden
                      >
                        <path d="m5 12 5 5L20 7" />
                      </svg>
                    )}
                  </span>
                  <span
                    className={`text-[0.78rem] font-semibold whitespace-nowrap transition-colors ${
                      active
                        ? 'text-maroon-deep'
                        : 'text-gray-700 group-hover:text-gray-900'
                    }`}
                  >
                    {c.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Blouse stitching — full-width tab buttons (Kalki pattern).
          Big side-by-side tabs feel like a choice, not a chip picker. */}
      <div className="mb-5">
        <div className="text-sm font-semibold text-gray-900 mb-2">
          Blouse Stitching Option
        </div>
        <div className="grid grid-cols-2 gap-2 max-w-[420px]">
          <button
            type="button"
            onClick={() => setBlouseOption('unstitched')}
            className={`py-3 px-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] border transition-colors ${
              blouseOption === 'unstitched'
                ? 'border-gray-900 bg-ink text-white'
                : 'border-gray-300 bg-white text-gray-900 hover:border-gray-900'
            }`}
          >
            Unstitched Blouse
          </button>
          <button
            type="button"
            onClick={() => setBlouseOption('stitched')}
            className={`py-3 px-3 text-[0.72rem] font-semibold uppercase tracking-[0.08em] border transition-colors ${
              blouseOption === 'stitched'
                ? 'border-gray-900 bg-ink text-white'
                : 'border-gray-300 bg-white text-gray-900 hover:border-gray-900'
            }`}
          >
            Custom Tailored (+₹800)
          </button>
        </div>
      </div>

      {/* Estimated delivery — Kalki pattern: "Delivered by : Wed, 18 Nov"
          with a simple truck glyph, no coloured banner. */}
      <div className="mt-5 flex items-center gap-2.5 text-sm text-gray-700">
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" className="text-gray-700 shrink-0" aria-hidden>
          <path d="M3 7h11v9H3zM14 11h4l3 3v2h-7z" />
          <circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" />
        </svg>
        <span>
          Delivered by :{' '}
          <strong className="font-semibold text-gray-900">{deliveryDate}</strong>
        </span>
      </div>

      {/* CTAs — Kalki PDP uses chunky full-width buttons that read as
          the page's primary actions. */}
      <div className="mt-5 grid gap-3 max-w-[420px]">
        <button
          type="button"
          onClick={() => addToCart(saree.id, 1)}
          className="w-full border border-gray-900 text-gray-900 bg-white py-3 text-[0.75rem] font-semibold uppercase tracking-[0.1em] hover:bg-gray-900 hover:text-white transition-colors flex items-center justify-center gap-2.5"
        >
          <span>Add to Cart</span>
          <span className="w-1 h-1 rounded-full bg-current" />
          <span className="tabular-nums">{formatINR(total)}</span>
        </button>
        <button
          type="button"
          onClick={handleBuyItNow}
          className="w-full bg-ink text-white py-3 text-[0.75rem] font-semibold uppercase tracking-[0.1em] hover:bg-maroon-deep transition-colors"
        >
          Buy It Now
        </button>
      </div>

      {/* Trust trio — 3 columns on md+, stacked 3×1 on mobile. */}
      <div className="mt-8 grid grid-cols-3 gap-x-3 gap-y-5 pt-6 border-t border-gray-200">
        <TrustItem icon="return" label="48 Hr Exchange & Returns*" />
        <TrustItem icon="star" label="Assured Quality" />
        <TrustItem icon="truck" label="Free Shipping*" />
      </div>
    </div>
  );
}

function TrustItem({
  icon,
  label,
}: {
  icon: 'percent' | 'return' | 'star' | 'truck';
  label: string;
}) {
  // Vertical mini-tile: icon medallion stacked above a short label.
  // Matches the Kalki PDP trust row where every cell is centre-aligned.
  return (
    <div className="flex flex-col items-center text-center gap-1.5 text-[0.7rem] md:text-xs leading-snug text-gray-700">
      <span className="w-8 h-8 flex items-center justify-center text-gray-800 shrink-0">
        <Icon name={icon} />
      </span>
      <span className="font-medium text-gray-700">{label}</span>
    </div>
  );
}

function Icon({ name }: { name: 'percent' | 'return' | 'star' | 'truck' }) {
  const c = {
    width: 20, height: 20, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const, 'aria-hidden': true,
  };
  switch (name) {
    case 'percent':
      return (<svg {...c}><circle cx="12" cy="12" r="9" /><path d="m8 16 8-8" /><circle cx="9" cy="9" r="1.2" /><circle cx="15" cy="15" r="1.2" /></svg>);
    case 'return':
      return (<svg {...c}><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>);
    case 'star':
      return (<svg {...c}><path d="m12 2 2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2Z" /></svg>);
    case 'truck':
      return (<svg {...c}><path d="M3 7h11v9H3zM14 11h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>);
  }
}
