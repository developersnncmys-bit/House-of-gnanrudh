'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SAREES, BADGE_LABEL, type BadgeKind, formatINR } from '@/lib/sarees';
import { getProductHero } from '@/lib/product-images';
import WishlistButton from '@/components/shop/WishlistButton';
import ViewSimilarButton from '@/components/shop/ViewSimilarButton';

type Saree = (typeof SAREES)[number];

const BADGE_CLASS: Record<BadgeKind, string> = {
  ready: 'bg-green-100 text-green-800 border border-green-200',
  fast: 'bg-orange-100 text-orange-800 border border-orange-200',
  last: 'bg-red-100 text-red-800 border border-red-200',
};

export default function ProductCard({
  saree,
  priority = false,
  hideBadges = false,
  hideDiscountOverlay = false,
  showBadgesBelowPrice = false,
  showViewSimilar = false,
}: {
  saree: Saree;
  priority?: boolean;
  // Opt-out for the on-image availability chips (Ready to Ship / Selling
  // Fast / Last Chance). Only turned on by NewArrivalsView so other
  // shop surfaces keep showing the badges unchanged.
  hideBadges?: boolean;
  // Opt-out for the top-left discount-% chip overlay. Useful when the
  // page design keeps the discount in the price row only (NewArrivals).
  hideDiscountOverlay?: boolean;
  // Render the availability badges as a small pill row BELOW the price
  // instead of (or in addition to) the on-image overlay. Used by
  // NewArrivalsView to surface Ready-to-Ship / Selling Fast in the
  // info section, Kalki-style.
  showBadgesBelowPrice?: boolean;
  // Opt-in for the shared ViewSimilarButton — same icon pill the home
  // page uses (Featured / Tiers / PressStrip), placed right-aligned
  // in the info row under the image. Comes with its own portal modal
  // and Add-to-Bag CTAs, so no additional wiring is needed here.
  showViewSimilar?: boolean;
}) {
  const { mrp, badges } = saree;
  const discount = mrp ? Math.round(((mrp - saree.price) / mrp) * 100) : 0;

  return (
    <Link href={`/shop/${saree.id}`} className="group block bg-white">
      <div className="relative aspect-[2/3] overflow-hidden bg-gray-100">
        <Image
          src={getProductHero(saree)}
          alt={saree.name}
          fill
          priority={priority}
          sizes="(max-width: 768px) 50vw, (max-width: 1280px) 28vw, 22vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {!hideDiscountOverlay && discount > 0 && (
          <div className="absolute top-2 left-2 bg-maroon-deep text-white px-2 py-0.5 text-[0.65rem] font-bold tracking-wide z-10">
            {discount}% OFF
          </div>
        )}

        <WishlistButton
          productId={saree.id}
          className="absolute top-2 right-2 w-8 h-8 z-10"
          size={14}
        />


        {!hideBadges && badges.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1 pointer-events-none">
            {badges.map((b) => (
              <span
                key={b}
                className={`${BADGE_CLASS[b]} px-1.5 py-0.5 text-[0.6rem] font-semibold uppercase tracking-wide`}
              >
                {BADGE_LABEL[b]}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-2.5">
        <h3 className="text-sm text-gray-900 leading-snug line-clamp-2 mb-1.5 group-hover:text-maroon-deep transition-colors">
          {saree.name}
        </h3>
        <div className="flex items-end justify-between gap-2">
          <div className="flex items-baseline gap-2 flex-wrap min-w-0">
            <span className="text-base font-bold text-gray-900 tabular-nums">
              {formatINR(saree.price)}
            </span>
            {mrp && (
              <>
                <span className="text-xs text-gray-500 line-through tabular-nums">
                  {formatINR(mrp)}
                </span>
                <span className="inline-flex items-center text-[0.68rem] font-extrabold text-scarlet bg-scarlet/10 border border-scarlet/25 tabular-nums tracking-wide px-1.5 py-0.5 rounded-sm">
                  {discount}% OFF
                </span>
              </>
            )}
          </div>
          {showViewSimilar && (
            <ViewSimilarButton
              productId={saree.id}
              className="w-8 h-8 shrink-0 !bg-transparent !backdrop-blur-none"
              size={16}
            />
          )}
        </div>

        {/* Availability chips below price — opt-in via
            showBadgesBelowPrice. Kalki-style: small pills with a
            leading bolt glyph, tone-coded by badge kind. */}
        {showBadgesBelowPrice && badges.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {badges.map((b) => (
              <span
                key={b}
                className={`${BADGE_CLASS[b]} inline-flex items-center gap-1 px-2 py-0.5 text-[0.62rem] font-semibold uppercase tracking-wide rounded-sm`}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8Z" />
                </svg>
                {BADGE_LABEL[b]}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
