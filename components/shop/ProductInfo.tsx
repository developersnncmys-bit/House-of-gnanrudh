'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useMemo, useState } from 'react';
import { type SAREES, formatINR, getColorways } from '@/lib/sarees';
import { getPdpVariants, getProductHero } from '@/lib/product-images';
import { useShop } from '@/lib/shop-store';
import { useCheckoutModal } from '@/lib/checkout-modal';
import { useLoginModal } from '@/lib/login-modal';
import { useAuth } from '@/lib/auth';
import { navHref } from '@/lib/soft-launch';

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
  // Same-weave variants for the "More in ..." strip — a true variant
  // picker. First entry is this saree itself; the rest are other
  // sarees in the same weave category ranked by palette proximity.
  const variants = useMemo(() => getPdpVariants(saree), [saree]);
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
        <div
          className="inline-block text-white px-3.5 py-1 text-[0.7rem] font-semibold tracking-[0.12em] uppercase mb-4 shadow-[0_1px_2px_rgba(77,0,21,0.18)]"
          style={{
            backgroundImage:
              'linear-gradient(135deg, #B07A2A 0%, #8A5A1F 35%, #7A1F2E 70%, #4D0015 100%)',
          }}
        >
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
            {discount}% OFF
          </span>
        </div>
      )}

      {/* Same-weave variant strip — a true "more colours" row in the
          sense a saree customer expects: every tile is another piece
          in THIS weave (Mangalagiri, Kanjeevaram, etc.), ranked by
          palette proximity. First tile is this saree (active, not a
          link); the rest link to their own PDP. */}
      {variants.length > 1 && (
        <div className="mb-5">
          <div className="flex items-baseline gap-2 mb-3">
            <span className="text-[0.7rem] font-bold tracking-[0.18em] uppercase text-gray-900">
              More in {saree.weave}
            </span>
            <span aria-hidden className="h-px w-5 bg-gold/70" />
            <span className="font-display italic text-[0.95rem] text-maroon-deep">
              {saree.name}
            </span>
          </div>
          <div className="flex flex-wrap items-start gap-2.5">
            {variants.map((v) => {
              const active = v.id === saree.id;
              const safeHref = navHref(`/shop/${v.id}`);
              const tile = (
                <>
                  <span
                    className={`relative block w-14 h-[72px] overflow-hidden bg-bone transition-all ${
                      active
                        ? 'ring-1 ring-maroon-deep ring-offset-2 ring-offset-white'
                        : 'ring-1 ring-black/15 group-hover:ring-black/45'
                    }`}
                  >
                    <Image
                      src={getProductHero(v)}
                      alt=""
                      fill
                      sizes="56px"
                      className={`object-cover transition-all duration-300 ${
                        active
                          ? 'scale-105'
                          : 'saturate-[0.85] group-hover:saturate-100 group-hover:scale-105'
                      }`}
                    />
                    <span
                      aria-hidden
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        boxShadow:
                          'inset 0 1px 1px rgba(255,255,255,0.18), inset 0 -2px 4px rgba(0,0,0,0.22)',
                      }}
                    />
                  </span>
                  <span
                    aria-hidden
                    className={`h-[2px] w-6 transition-all ${
                      active ? 'bg-maroon-deep' : 'bg-transparent'
                    }`}
                  />
                </>
              );
              if (active || !safeHref) {
                return (
                  <div
                    key={v.id}
                    aria-current={active ? 'page' : undefined}
                    title={active ? `${v.name} (current)` : v.name}
                    className="group flex flex-col items-center gap-1.5 cursor-default"
                  >
                    {tile}
                  </div>
                );
              }
              return (
                <Link
                  key={v.id}
                  href={safeHref}
                  aria-label={`View ${v.name}`}
                  title={v.name}
                  className="group flex flex-col items-center gap-1.5 focus:outline-none"
                >
                  {tile}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Blouse stitching — hidden from the PDP for now. The underlying
          `blouseOption` state + `stitchingFee` calc still live on the
          component (default 'unstitched' → fee ₹0), so re-enabling this
          block is a pure uncomment — no state or pricing wiring needed. */}
      {/*
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
      */}

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

    </div>
  );
}
