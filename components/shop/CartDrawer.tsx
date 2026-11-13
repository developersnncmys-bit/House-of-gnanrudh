'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { SAREES, formatINR } from '@/lib/sarees';
import { getProductHero } from '@/lib/product-images';
import { useShop } from '@/lib/shop-store';
import { useCartDrawer } from '@/lib/cart-drawer';
import { useCheckoutModal } from '@/lib/checkout-modal';
import { useLoginModal } from '@/lib/login-modal';
import { useAuth } from '@/lib/auth';
import { useScrollLock } from '@/lib/scroll-lock';

export default function CartDrawer() {
  const { open, closeCart } = useCartDrawer();
  const { open: checkoutOpen, openCheckout } = useCheckoutModal();
  const { openLogin } = useLoginModal();
  const { user, hydrated: authHydrated } = useAuth();
  const {
    cart, hydrated, cartSubtotal, updateCartQty, removeFromCart,
  } = useShop();

  useScrollLock(open);

  // Policy-agreement checkbox — defaults to accepted (Kalki parity) but
  // the user can un-tick it, which disables Checkout.
  const [agreedToPolicies, setAgreedToPolicies] = useState(true);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, closeCart]);

  const items = cart
    .map((c) => {
      const saree = SAREES.find((s) => s.id === c.productId);
      return saree ? { saree, qty: c.quantity } : null;
    })
    .filter((x): x is { saree: (typeof SAREES)[number]; qty: number } => Boolean(x));

  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const mrpTotal = items.reduce((sum, i) => sum + i.saree.mrp * i.qty, 0);
  const discount = mrpTotal - cartSubtotal;
  const shippingFree = cartSubtotal >= 25_000;

  // Don't close the drawer when launching checkout — Kalki keeps the cart
  // visible on the right while the centered popup opens beside it.
  // Gated: if the user is not signed in, open the login modal first and
  // resume the checkout via the post-login callback.
  const handleCheckout = () => {
    if (!authHydrated) return; // wait for auth state to settle
    if (!agreedToPolicies) return;
    if (!user) {
      openLogin(() => openCheckout());
      return;
    }
    openCheckout();
  };

  // When the checkout popup is open, the drawer needs to sit ABOVE the
  // popup's backdrop so it stays fully visible (not dimmed). We also hide
  // the drawer's own backdrop in that case so we don't stack two dims.
  //
  // IMPORTANT: the drawer's full-viewport container must NOT intercept
  // pointer events when the popup is open. Otherwise its z-[110] above
  // the popup (z-[100]) swallows wheel / click events over the popup
  // area and the popup becomes unscrollable / unclickable. Only the
  // visible panel on the right should be interactive in that state.
  return (
    <div
      className={`fixed inset-0 ${checkoutOpen ? 'z-[110]' : 'z-[90]'}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-labelledby="cart-drawer-title"
      style={{ pointerEvents: open && !checkoutOpen ? 'auto' : 'none' }}
      data-lenis-prevent
    >
      {!checkoutOpen && (
        <button
          type="button"
          aria-label="Close cart"
          onClick={closeCart}
          className={`absolute inset-0 bg-ink/30 transition-opacity duration-300 ${
            open ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}

      <div
        className={`absolute top-0 right-0 h-full w-full max-w-[440px] bg-bone shadow-2xl flex flex-col transition-transform duration-300 ease-out ${
          open ? 'translate-x-0' : 'translate-x-full'
        } ${
          open && checkoutOpen ? 'max-md:translate-x-full' : ''
        }`}
        style={{ pointerEvents: open ? 'auto' : 'none' }}
      >
        {/* Header — large "Your Cart (N Items)" with close X on the
            right. Matches the Kalki cart drawer header. */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-ink/10 shrink-0 bg-bone">
          <h2 id="cart-drawer-title" className="text-xl font-bold text-ink tabular-nums">
            Your Cart ({hydrated ? itemCount : 0} {itemCount === 1 ? 'Item' : 'Items'})
          </h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Close"
            className="w-8 h-8 flex items-center justify-center text-ink hover:text-maroon transition-colors -mr-2"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="m6 6 12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {!hydrated ? (
            <ListSkeleton />
          ) : items.length === 0 ? (
            <EmptyDrawer onClose={closeCart} />
          ) : (
            <>
              <ul className="divide-y divide-ink/10">
                {items.map(({ saree, qty }) => (
                  <li key={saree.id} className="flex gap-4 p-5 bg-white">
                    <Link
                      href={`/shop/${saree.id}`}
                      onClick={closeCart}
                      className="relative w-24 shrink-0 overflow-hidden bg-bone"
                      style={{ aspectRatio: '3 / 4' }}
                    >
                      <Image
                        src={getProductHero(saree)}
                        alt={saree.name}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </Link>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/shop/${saree.id}`}
                          onClick={closeCart}
                          className="text-[0.95rem] font-semibold text-ink leading-tight hover:text-maroon-deep transition-colors line-clamp-2 flex-1"
                        >
                          {saree.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFromCart(saree.id)}
                          aria-label={`Remove ${saree.name}`}
                          className="shrink-0 w-7 h-7 flex items-center justify-center text-ink/55 hover:text-maroon-deep transition-colors"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                            <path d="M3 6h18M8 6V4h8v2M6 6l1 14a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-14" />
                          </svg>
                        </button>
                      </div>
                      <div className="mt-1 text-sm font-bold text-ink tabular-nums">
                        MRP {formatINR(saree.price)}
                      </div>
                      <div className="mt-1 text-[0.72rem] text-ink/60">
                        {saree.weave}
                      </div>
                      <div className="mt-auto pt-3 flex items-center justify-between gap-2">
                        <QtyStepper
                          qty={qty}
                          onMinus={() => updateCartQty(saree.id, qty - 1)}
                          onPlus={() => updateCartQty(saree.id, qty + 1)}
                        />
                        <div className="text-sm font-bold text-ink tabular-nums">
                          {formatINR(saree.price * qty)}
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              {/* Order Summary — Kalki pattern: MRP Total, Discount on
                  MRP (scarlet), Subtotal, Shipping (green when free),
                  and a tinted Estimated total row at the bottom. */}
              <div className="px-5 py-5">
                <div className="bg-white border border-ink/10 rounded-sm overflow-hidden">
                  <div className="px-5 pt-5 pb-3 text-lg font-bold text-ink">
                    Order Summary
                  </div>
                  <div className="px-5 pb-4 space-y-2.5">
                    <SummaryRow label="MRP Total" value={formatINR(mrpTotal)} />
                    {discount > 0 && (
                      <SummaryRow
                        label="Discount on MRP"
                        value={`-${formatINR(discount)}`}
                        valueClass="text-scarlet"
                      />
                    )}
                    <SummaryRow label="Subtotal" value={formatINR(cartSubtotal)} />
                    <SummaryRow
                      label="Shipping"
                      value={shippingFree ? 'Free' : 'At checkout'}
                      valueClass={shippingFree ? 'text-emerald-600 font-bold' : ''}
                    />
                  </div>
                  <div className="px-5 py-3.5 bg-[#faf1ea] flex items-baseline justify-between">
                    <span className="text-[0.95rem] font-bold text-ink">Estimated total</span>
                    <span className="text-[0.95rem] font-bold text-ink tabular-nums">
                      {formatINR(cartSubtotal)}
                    </span>
                  </div>
                </div>

                {/* We Accept — payment logos row (Kalki parity). */}
                <div className="mt-6 text-center">
                  <div className="text-[0.72rem] font-bold tracking-[0.2em] uppercase text-ink/55 mb-3">
                    We Accept
                  </div>
                  <PaymentLogos />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Sticky footer — Congrats (when any discount) sits ABOVE
            Estimated total + CHECKOUT, matching the Kalki pattern where
            the saved-amount strip is always visible with the CTA. */}
        {hydrated && items.length > 0 && (
          <div className="border-t border-ink/10 bg-bone shrink-0">
            {discount > 0 && (
              <div className="px-5 py-3 bg-[#faf1ea] border-b border-ink/10">
                <p className="text-[0.82rem] text-ink leading-snug">
                  Congrats! You saved total{' '}
                  <span className="font-bold tabular-nums">{formatINR(discount)}</span>{' '}
                  on this order
                </p>
              </div>
            )}
            <div className="px-5 py-4">
              <div className="flex items-baseline justify-between mb-3">
                <span className="text-sm font-bold text-ink">Estimated total</span>
                <span className="text-lg font-bold text-ink tabular-nums">
                  {formatINR(cartSubtotal)}
                </span>
              </div>
              <button
                type="button"
                onClick={handleCheckout}
                disabled={!agreedToPolicies}
                className="w-full bg-ink text-white py-4 text-sm font-bold tracking-[0.18em] uppercase hover:bg-maroon-deep transition-colors disabled:bg-ink/40 disabled:cursor-not-allowed disabled:hover:bg-ink/40"
              >
                Checkout
              </button>
              <label className="mt-3 flex items-center justify-center gap-2 text-center cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={agreedToPolicies}
                  onChange={(e) => setAgreedToPolicies(e.target.checked)}
                  className="sr-only peer"
                />
                <span
                  aria-hidden
                  className="shrink-0 w-4 h-4 rounded-sm border border-ink/40 bg-white flex items-center justify-center peer-checked:bg-emerald-600 peer-checked:border-emerald-600 transition-colors"
                >
                  {agreedToPolicies && (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  )}
                </span>
                <span className="text-[0.72rem] font-bold text-ink leading-relaxed">
                  By clicking Checkout you agree to all our{' '}
                  <Link
                    href="/shipping"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeCart();
                    }}
                    className="underline underline-offset-2 text-ink"
                  >
                    policies
                  </Link>
                  .
                </span>
              </label>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmptyDrawer({ onClose }: { onClose: () => void }) {
  return (
    <div className="h-full flex flex-col items-center justify-center text-center px-6 py-12">
      <div className="text-sm font-bold text-ink">Your cart is empty.</div>
      <p className="mt-1.5 text-xs text-ink/65 max-w-xs">
        Browse the catalogue and add a saree to begin.
      </p>
      <Link
        href="/shop"
        onClick={onClose}
        className="mt-6 bg-maroon-deep text-ivory px-6 py-2.5 text-xs font-semibold tracking-wide hover:bg-maroon transition-colors"
      >
        Continue shopping
      </Link>
    </div>
  );
}

function QtyStepper({
  qty,
  onMinus,
  onPlus,
}: {
  qty: number;
  onMinus: () => void;
  onPlus: () => void;
}) {
  return (
    <div className="inline-flex items-center border border-ink/20">
      <button
        type="button"
        onClick={onMinus}
        aria-label="Decrease quantity"
        className="w-7 h-7 flex items-center justify-center text-ink hover:bg-maroon-deep hover:text-ivory transition-colors text-sm"
      >
        −
      </button>
      <span className="w-8 text-center text-xs font-semibold tabular-nums">{qty}</span>
      <button
        type="button"
        onClick={onPlus}
        aria-label="Increase quantity"
        className="w-7 h-7 flex items-center justify-center text-ink hover:bg-maroon-deep hover:text-ivory transition-colors text-sm"
      >
        +
      </button>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  valueClass = '',
}: {
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-baseline justify-between">
      <span className="text-sm text-ink/80">{label}</span>
      <span className={`text-sm font-semibold text-ink tabular-nums ${valueClass}`}>
        {value}
      </span>
    </div>
  );
}

function ListSkeleton() {
  return (
    <div className="p-4 space-y-3">
      {Array.from({ length: 2 }).map((_, i) => (
        <div key={i} className="flex gap-3">
          <div className="w-20 h-26 bg-bone animate-pulse" style={{ aspectRatio: '3 / 4' }} />
          <div className="flex-1 space-y-2 py-1">
            <div className="h-2.5 bg-bone w-1/3 animate-pulse" />
            <div className="h-3 bg-bone w-3/4 animate-pulse" />
            <div className="h-3 bg-bone w-1/4 animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}

function PaymentLogos() {
  return (
    <div className="flex items-center flex-wrap gap-2">
      <Tag label="VISA" />
      <Tag label="Mastercard" />
      <Tag label="Amex" />
      <Tag label="COD" />
      <Tag label="UPI" />
      <Tag label="RuPay" />
    </div>
  );
}

function Tag({ label }: { label: string }) {
  return (
    <span className="text-[10px] font-bold tracking-wide text-ink/70 border border-ink/15 px-2 py-1 bg-bone/40">
      {label}
    </span>
  );
}
