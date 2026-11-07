'use client';

import clsx from 'clsx';
import { useShop } from '@/lib/shop-store';
import { WISHLIST_DISABLED } from '@/lib/soft-launch';

type Variant = 'icon' | 'pill';

export default function WishlistButton({
  productId,
  variant = 'icon',
  className = '',
  size = 15,
}: {
  productId: string;
  variant?: Variant;
  className?: string;
  size?: number;
}) {
  const { inWishlist, toggleWishlist, hydrated } = useShop();
  // Visual "saved" state is forced empty while the wishlist is gated so
  // previously-stored items don't render as filled hearts on tiles.
  const saved = !WISHLIST_DISABLED && hydrated && inWishlist(productId);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (WISHLIST_DISABLED) return;
    toggleWishlist(productId);
  };

  if (variant === 'pill') {
    return (
      <button
        type="button"
        onClick={handle}
        aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
        aria-pressed={saved}
        className={clsx(
          'inline-flex items-center justify-center gap-2 border px-5 py-3.5 text-xs font-bold uppercase tracking-wider rounded-sm transition-colors',
          saved
            ? 'border-maroon bg-maroon text-ivory hover:bg-maroon/85'
            : 'border-ink/30 text-ink hover:border-ink',
          className,
        )}
      >
        <HeartIcon size={14} filled={saved} />
        {saved ? 'Saved' : 'Save'}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handle}
      aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
      aria-pressed={saved}
      data-saved={saved ? 'true' : 'false'}
      className={clsx(
        'flex items-center justify-center rounded-full backdrop-blur-sm transition-all',
        saved
          ? 'bg-maroon text-ivory'
          : 'bg-ivory/95 text-ink hover:text-maroon',
        className,
      )}
    >
      <HeartIcon size={size} filled={saved} />
    </button>
  );
}

function HeartIcon({ size = 15, filled = false }: { size?: number; filled?: boolean }) {
  return (
    <svg
      width={size}
      height={size}
      // Shifted viewBox centers the heart's visual mass (~11, 13) inside
      // the circular button — a standard "0 0 24 24" left the icon
      // sitting low-and-left in the container.
      viewBox="-1 1 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M20.8 6.6a5.5 5.5 0 0 0-9-1.7l-.8.8-.8-.8a5.5 5.5 0 1 0-7.8 7.8l8.6 8.5 8.6-8.5a5.5 5.5 0 0 0 1.2-6.1Z" />
    </svg>
  );
}
