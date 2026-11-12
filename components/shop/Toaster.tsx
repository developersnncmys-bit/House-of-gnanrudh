'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LuHeart, LuShoppingBag, LuX, LuArrowRight } from 'react-icons/lu';
import { useShop } from '@/lib/shop-store';
import { SAREES, formatINR } from '@/lib/sarees';

export default function Toaster() {
  const { toasts, dismissToast } = useShop();

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-3 w-[340px] max-w-[calc(100vw-2.5rem)] pointer-events-none">
      {toasts.map((t) => {
        const product = SAREES.find((s) => s.id === t.productId);
        const isAdd = t.kind === 'cart-add' || t.kind === 'wishlist-add';
        const isCart = t.kind === 'cart-add' || t.kind === 'cart-remove';

        // One toast template for all four variants (cart add/remove,
        // wishlist add/remove). The only per-variant bits are the
        // small eyebrow icon, the eyebrow label, and whether a CTA
        // link appears underneath.
        const Eyebrow = isCart ? LuShoppingBag : LuHeart;
        const eyebrowLabel = isCart
          ? isAdd ? 'Added to Bag' : 'Removed from Bag'
          : isAdd ? 'Saved to Wishlist' : 'Removed from Wishlist';
        const ctaHref = isCart ? '/shop?bag=1' : '/shop?wishlist=1';
        const ctaLabel = isCart ? 'View Bag' : 'View Wishlist';

        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto relative bg-ivory no-pattern shadow-[0_18px_40px_-20px_rgba(0,0,0,0.35)] rounded-sm overflow-hidden animate-[slideInRight_0.3s_ease-out]"
          >
            {/* Gold hairline accent along the top edge — subtle brand
                signature instead of the old chunky left border. */}
            <div
              aria-hidden
              className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-gold-deep via-gold to-gold-deep"
            />

            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="absolute top-2 right-2 w-7 h-7 flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
            >
              <LuX size={14} strokeWidth={2} aria-hidden />
            </button>

            <div className="flex items-stretch gap-3 p-3 pr-10">
              {product && (
                <Link
                  href={`/shop/${product.id}`}
                  className="relative w-16 h-20 shrink-0 bg-bone rounded-sm overflow-hidden group"
                >
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              )}

              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div className="flex items-center gap-1.5">
                  <span
                    className={`inline-flex items-center justify-center w-4 h-4 ${
                      isAdd ? 'text-maroon-deep' : 'text-ink/45'
                    }`}
                  >
                    <Eyebrow
                      size={12}
                      strokeWidth={2.2}
                      fill={!isCart && isAdd ? 'currentColor' : 'none'}
                      aria-hidden
                    />
                  </span>
                  <span className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-ink/70">
                    {eyebrowLabel}
                  </span>
                </div>
                <div className="text-sm font-semibold text-ink leading-tight truncate">
                  {product?.name ?? 'Saree'}
                </div>
                {product && (
                  <div className="text-[0.7rem] text-ink/60 tabular-nums">
                    {formatINR(product.price)}
                  </div>
                )}
                {isAdd && (
                  <Link
                    href={ctaHref}
                    onClick={() => dismissToast(t.id)}
                    className="mt-1 inline-flex items-center gap-1 text-[0.7rem] font-bold uppercase tracking-[0.14em] text-maroon-deep hover:text-ink transition-colors"
                  >
                    {ctaLabel}
                    <LuArrowRight size={12} strokeWidth={2.5} aria-hidden />
                  </Link>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
