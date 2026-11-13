'use client';

import Link from 'next/link';
import Image from 'next/image';
import { LuHeart, LuShoppingBag, LuX, LuCheck } from 'react-icons/lu';
import { useShop } from '@/lib/shop-store';
import { useCartDrawer } from '@/lib/cart-drawer';
import { SAREES, formatINR } from '@/lib/sarees';

export default function Toaster() {
  const { toasts, dismissToast } = useShop();
  const { openCart } = useCartDrawer();

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col gap-3 w-[320px] max-w-[calc(100vw-2.5rem)] pointer-events-none">
      {toasts.map((t) => {
        const product = SAREES.find((s) => s.id === t.productId);
        const isAdd = t.kind === 'cart-add' || t.kind === 'wishlist-add';
        const isCart = t.kind === 'cart-add' || t.kind === 'cart-remove';

        const StatusIcon = isAdd ? LuCheck : isCart ? LuShoppingBag : LuHeart;
        const title = isCart
          ? isAdd ? 'Added to Bag' : 'Removed from Bag'
          : isAdd ? 'Saved to Wishlist' : 'Removed from Wishlist';
        const ctaLabel = isCart ? 'View Bag' : 'View Wishlist';

        return (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto relative bg-white shadow-[0_12px_32px_-8px_rgba(0,0,0,0.18)] border border-ink/10 animate-[slideInRight_0.3s_ease-out]"
          >
            <button
              onClick={() => dismissToast(t.id)}
              aria-label="Dismiss notification"
              className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center text-ink/40 hover:text-ink transition-colors"
            >
              <LuX size={14} strokeWidth={1.8} aria-hidden />
            </button>

            {/* Title row — status icon + label */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-2.5 border-b border-ink/5">
              <span
                className={`inline-flex items-center justify-center w-5 h-5 rounded-full ${
                  isAdd ? 'bg-peacock text-white' : 'bg-ink/10 text-ink/60'
                }`}
              >
                <StatusIcon size={12} strokeWidth={2.5} aria-hidden />
              </span>
              <span className="text-xs font-semibold text-ink">
                {title}
              </span>
            </div>

            {/* Product row */}
            <div className="flex items-center gap-3 px-4 py-3">
              {product && (
                <Link
                  href={`/shop/${product.id}`}
                  className="relative w-12 h-14 shrink-0 bg-bone overflow-hidden group"
                >
                  <Image
                    src={product.image}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>
              )}

              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-ink leading-tight truncate">
                  {product?.name ?? 'Saree'}
                </div>
                {product && (
                  <div className="text-xs text-ink/55 tabular-nums mt-0.5">
                    {formatINR(product.price)}
                  </div>
                )}
              </div>
            </div>

            {/* Full-width CTA — cart toasts open the drawer directly,
                wishlist toasts link to the wishlist shop view. */}
            {isAdd && (
              isCart ? (
                <button
                  type="button"
                  onClick={() => {
                    dismissToast(t.id);
                    openCart();
                  }}
                  className="block w-full bg-ink text-white text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] py-2.5 hover:bg-black transition-colors"
                >
                  {ctaLabel}
                </button>
              ) : (
                <Link
                  href="/shop?wishlist=1"
                  onClick={() => dismissToast(t.id)}
                  className="block bg-ink text-white text-center text-[0.7rem] font-semibold uppercase tracking-[0.14em] py-2.5 hover:bg-black transition-colors"
                >
                  {ctaLabel}
                </Link>
              )
            )}
          </div>
        );
      })}
    </div>
  );
}
