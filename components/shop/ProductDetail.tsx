'use client';

import Link from 'next/link';
import { useState } from 'react';
import { SAREES, BADGE_LABEL, getColorways } from '@/lib/sarees';
import { getColorwayGallery } from '@/lib/product-images';
import { useRecentlyViewed } from '@/lib/recently-viewed';
import ProductGallery from './ProductGallery';
import ProductInfo from './ProductInfo';
import ProductAccordion from './ProductAccordion';
import ProductRail from './ProductRail';
import ProductReviews from './ProductReviews';
import StickyBuyBar from './StickyBuyBar';

type Saree = (typeof SAREES)[number];

export default function ProductDetail({ saree }: { saree: Saree }) {
  const { mrp, badges } = saree;
  // The detail page shows at most ONE pill above the price — pick the
  // most urgent ribbon (last > fast > ready) when several apply.
  const badge =
    badges.find((b) => b === 'last') ??
    badges.find((b) => b === 'fast') ??
    badges.find((b) => b === 'ready');
  const badgeLabel = badge ? BADGE_LABEL[badge] : undefined;

  // Recently-viewed: push current id, read the rest from storage.
  const recentIds = useRecentlyViewed(saree.id);

  // Similar = same weave OR same tier, excluding the current piece.
  const similarIds = SAREES
    .filter((s) => s.id !== saree.id && (s.weave === saree.weave || s.tier === saree.tier))
    .slice(0, 8)
    .map((s) => s.id);

  // Deterministic numbers derived from the id so the page is stable on reload
  // without needing a backend yet.
  const seed = saree.id.split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  const viewers = 30 + (seed % 80);
  const deliveryDate = computeDeliveryDate(5 + (seed % 5));

  // Color state is owned HERE (not in ProductInfo) so the gallery on the
  // left can react to colour changes — picking a swatch swaps the
  // thumbnails to images of sarees in that colour.
  const colorways = getColorways(saree);
  const [colorId, setColorId] = useState(colorways[0]?.id ?? '');
  const galleryImages = getColorwayGallery(saree, colorId);

  return (
    <div className="bg-white min-h-screen text-gray-900">
      {/* Breadcrumb */}
      <div className="border-b border-gray-200">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-3 text-xs text-gray-500">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 flex-wrap">
            <Link href="/" className="hover:text-gray-900">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-gray-900">All Sarees</Link>
            <span>/</span>
            <Link
              href={`/shop?weave=${encodeURIComponent(saree.weave)}`}
              className="hover:text-gray-900"
            >
              {saree.weave}
            </Link>
            <span>/</span>
            <span className="text-gray-900 font-semibold" aria-current="page">{saree.name}</span>
          </nav>
        </div>
      </div>

      {/* Main grid: gallery + info */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-6 lg:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_1fr] gap-8 lg:gap-14">
          <ProductGallery
            key={colorId}
            images={galleryImages}
            alt={saree.name}
          />
          <ProductInfo
            saree={saree}
            mrp={mrp}
            badge={badgeLabel}
            viewers={viewers}
            deliveryDate={deliveryDate}
            colorId={colorId}
            onColorChange={setColorId}
          />
        </div>
      </div>

      {/* The House Promise — full-width editorial trust band */}
      <GalleryTrustRow />

      {/* Long-form details */}
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-10 md:py-14">
        <ProductAccordion saree={saree} />
      </div>

      {/* Similar products */}
      {similarIds.length > 0 && <ProductRail title="Similar Products" ids={similarIds} />}

      {/* Recently viewed */}
      {recentIds.length > 0 && <ProductRail title="Recently Viewed" ids={recentIds} />}

      {/* Customer reviews */}
      <ProductReviews productId={saree.id} productName={saree.name} />

      {/* Sticky bottom bar */}
      <StickyBuyBar saree={saree} mrp={mrp} />
    </div>
  );
}

function GalleryTrustRow() {
  const items: { icon: 'return' | 'star' | 'truck'; title: string; caption: string }[] = [
    {
      icon: 'return',
      title: '48 Hr Exchange',
      caption: 'Easy returns within two days of delivery',
    },
    {
      icon: 'star',
      title: 'Assured Quality',
      caption: 'Five-step inspection before every dispatch',
    },
    {
      icon: 'truck',
      title: 'Free Shipping',
      caption: 'Insured & tracked across India',
    },
  ];
  return (
    <section className="bg-bone/60 border-y border-ink/10">
      <div className="max-w-[1200px] mx-auto px-6 md:px-10 py-10 md:py-12">
        <div className="text-center mb-8 md:mb-10">
          <GoldOrnament />
          <div className="mt-3 text-[0.62rem] md:text-[0.68rem] tracking-[0.38em] uppercase font-bold text-gold-deep">
            The House Promise
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-y-10 sm:divide-x divide-ink/10">
          {items.map((it) => (
            <div
              key={it.title}
              className="flex flex-col items-center text-center px-4 md:px-8"
            >
              <span className="w-10 h-10 md:w-11 md:h-11 flex items-center justify-center rounded-full bg-white ring-1 ring-gold-deep/50 text-maroon-deep shadow-[0_1px_2px_rgba(77,0,21,0.05)]">
                <TrustIcon name={it.icon} />
              </span>
              <h3 className="mt-3 font-display font-bold text-[0.85rem] md:text-[0.9rem] text-ink leading-none">
                {it.title}
              </h3>
              <div className="mt-2.5 flex items-center gap-2" aria-hidden>
                <span className="h-px w-5 bg-gold/70" />
                <span className="w-1 h-1 rotate-45 bg-gold-deep" />
                <span className="h-px w-5 bg-gold/70" />
              </div>
              <p className="mt-1.5 text-[0.66rem] md:text-[0.7rem] text-ink/65 leading-relaxed max-w-[220px]">
                {it.caption}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GoldOrnament() {
  return (
    <div className="flex items-center justify-center gap-2" aria-hidden>
      <span
        className="h-px w-16"
        style={{
          backgroundImage:
            'linear-gradient(90deg, transparent 0%, #A66D23 100%)',
        }}
      />
      <span className="w-1.5 h-1.5 rotate-45 bg-gold-deep" />
      <span
        className="h-px w-16"
        style={{
          backgroundImage:
            'linear-gradient(90deg, #A66D23 0%, transparent 100%)',
        }}
      />
    </div>
  );
}

function TrustIcon({ name }: { name: 'return' | 'star' | 'truck' }) {
  const c = {
    width: 18,
    height: 18,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.6,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (name) {
    case 'return':
      return (
        <svg {...c}>
          <path d="M3 12a9 9 0 1 0 3-6.7" />
          <path d="M3 4v5h5" />
        </svg>
      );
    case 'star':
      return (
        <svg {...c}>
          <path d="m12 2 2.9 6.9L22 10l-5.5 4.8L18.2 22 12 18.3 5.8 22l1.7-7.2L2 10l7.1-1.1L12 2Z" />
        </svg>
      );
    case 'truck':
      return (
        <svg {...c}>
          <path d="M3 7h11v9H3zM14 11h4l3 3v2h-7z" />
          <circle cx="7" cy="18" r="1.6" />
          <circle cx="17.5" cy="18" r="1.6" />
        </svg>
      );
  }
}

function computeDeliveryDate(daysFromNow: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  const weekday = d.toLocaleDateString('en-IN', { weekday: 'long' });
  const day = d.getDate();
  const month = d.toLocaleDateString('en-IN', { month: 'short' });
  const year = d.getFullYear();
  return `${weekday}, ${day} ${month} ${year}`;
}
