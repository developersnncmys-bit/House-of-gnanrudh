import { Suspense } from 'react';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import ShopView from '@/components/shop/ShopView';
import { SOFT_LAUNCH } from '@/lib/soft-launch';

export const metadata: Metadata = {
  title: 'Shop · House Of GnanRudh',
  description:
    'Hand-woven heirloom sarees — Kanjeevaram, Banarasi, Mysore Silk, Mangalagiri, Pochampally, Gadwal, Patola, Fancy Sarees and Mixed Pattu drapes. Filter by collection, weave or price.',
};

/**
 * /shop — the catalogue.
 *
 * A single URL handles every category state via search params:
 *   ?tier=bridal | festive | everyday          (comma-separated multi)
 *   ?weave=Banarasi | Kanjivaram | ...        (comma-separated multi)
 *   ?bracket=under-5k | 5-15k | ...           (single price band)
 *   ?sale=1                                   (atelier sale)
 *   ?sort=price-asc | price-desc | name
 *   ?wishlist=1                               (wishlist mode)
 *   ?bag=1                                    (bag/cart mode)
 *
 * ShopView is a client component that uses `useSearchParams`, which requires
 * a Suspense boundary at the route entry.
 */
export default function ShopPage() {
  if (SOFT_LAUNCH) redirect('/home');
  return (
    <Suspense fallback={<div className="min-h-screen bg-ivory" />}>
      <ShopView />
    </Suspense>
  );
}
