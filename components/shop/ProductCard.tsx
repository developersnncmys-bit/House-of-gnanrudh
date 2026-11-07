'use client';

import Image from 'next/image';
import Link from 'next/link';
import { SAREES, BADGE_LABEL, type BadgeKind, formatINR } from '@/lib/sarees';
import { getProductHero } from '@/lib/product-images';
import WishlistButton from '@/components/shop/WishlistButton';

type Saree = (typeof SAREES)[number];

const BADGE_CLASS: Record<BadgeKind, string> = {
  ready: 'bg-green-100 text-green-800 border border-green-200',
  fast: 'bg-orange-100 text-orange-800 border border-orange-200',
  last: 'bg-red-100 text-red-800 border border-red-200',
};

export default function ProductCard({
  saree,
  priority = false,
}: {
  saree: Saree;
  priority?: boolean;
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

        {discount > 0 && (
          <div className="absolute top-2 left-2 bg-[#082052] text-white px-2 py-0.5 text-[0.65rem] font-bold tracking-wide z-10">
            {discount}% OFF
          </div>
        )}

        <WishlistButton
          productId={saree.id}
          className="absolute top-2 right-2 w-8 h-8 z-10"
          size={14}
        />

        {badges.length > 0 && (
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
        <h3 className="text-sm text-gray-900 leading-snug line-clamp-2 mb-1.5 group-hover:text-[#082052] transition-colors">
          {saree.name}
        </h3>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-bold text-gray-900 tabular-nums">
            {formatINR(saree.price)}
          </span>
          {mrp && (
            <>
              <span className="text-xs text-gray-500 line-through tabular-nums">
                {formatINR(mrp)}
              </span>
              <span className="text-xs font-bold text-[#082052] tabular-nums">
                {discount}% OFF
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}
