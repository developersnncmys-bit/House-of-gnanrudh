import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/components/home/SectionHeader';
import { navHref } from '@/lib/soft-launch';

/**
 * CraftStory — bridal collection section.
 *   • Shared SectionHeader sits ABOVE the banner (lotus + title +
 *     description) so the section reads like every other home block.
 *   • Below it, a full-bleed landscape photo carries a short promo
 *     tagline on the right plus a Shop Now CTA.
 */

type Feature = {
  headline: string;
  subhead: string;
  ctaLabel: string;
  ctaHref: string;
  image: string;
  // Mobile-specific crop. Rendered via <picture><source media="(max-width:
  // 767px)"> so phones download ONLY this file and desktops download
  // ONLY `image`. Falls back to `image` when omitted.
  mobileImage?: string;
  imagePosition?: string;
  mobileImagePosition?: string;
};

const feature: Feature = {
  headline: 'Heirloom Bridal Silks',
  subhead: 'Curated drapes for the bride and her moment.',
  ctaLabel: 'Shop Now',
  ctaHref: '/shop?tier=bridal',
  image: '/homebanner/banner3.webp',
  mobileImage: '/homebanner/mob-bridal.webp',
  imagePosition: '85% 40%',
  mobileImagePosition: '50% 30%',
};

// Four bridal-occasion sub-edits, mirrored on the Kalki "Wedding
// Wardrobe" pattern — portrait card per occasion with the title and
// SHOP NOW CTA overlaid at the bottom over a soft gradient veil.
type Occasion = {
  title: string;
  href: string;
  image: string;
  imagePosition?: string;
};

const occasions: Occasion[] = [
  {
    title: 'Haldi Hues',
    href: '/shop?tier=bridal&occasion=haldi',
    image: '/ocassions/Haldi.png',
    imagePosition: '50% 30%',
  },
  {
    title: 'Mehendi Moments',
    href: '/shop?tier=bridal&occasion=mehendi',
    image: '/ocassions/Mehendi.png',
    imagePosition: '50% 25%',
  },
  {
    title: 'Wedding Day',
    href: '/shop?tier=bridal',
    image: '/ocassions/bridal.png',
    imagePosition: '50% 20%',
  },
  {
    title: 'The Reception',
    href: '/shop?tier=bridal&occasion=reception',
    image: '/product/banarasi.webp',
    imagePosition: '50% 25%',
  },
];

export default function CraftStory() {
  const ctaHref = navHref(feature.ctaHref);
  return (
    <section className="bg-ivory">
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10 pt-10 md:pt-14">
        <SectionHeader
          title="The Bridal Edit"
          description="Heirloom silks, woven to remember — temple-border Kanjeevarams, pit-loom Banarasis and double-ikat Patolas for the day you keep."
          ornament="/homebanner/mangala.png"
          ornamentClassName="h-12 sm:h-14 md:h-16 w-auto select-none"
          dividerClassName="translate-y-[9px]"
        />
      </div>

      <div className="relative w-full min-h-[640px] md:min-h-[calc(95vh+30px)] overflow-hidden">
        {/* Art-directed hero — phones get mob-bridal.webp (portrait
            crop), desktops get banner3.webp (landscape). The native
            <picture> element lets the browser pick exactly one; Next's
            <Image> can't do art direction (only width-based srcset). */}
        <picture>
          {feature.mobileImage && (
            <source
              media="(max-width: 767px)"
              srcSet={feature.mobileImage}
            />
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={feature.image}
            alt=""
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-full object-cover [object-position:var(--obj-pos-mobile)] md:[object-position:var(--obj-pos)]"
            style={
              {
                '--obj-pos': feature.imagePosition ?? '50% 50%',
                '--obj-pos-mobile':
                  feature.mobileImagePosition ??
                  feature.imagePosition ??
                  '50% 50%',
              } as React.CSSProperties
            }
          />
        </picture>

        {/* Dark gradient on the right so the copy is always readable
            regardless of what sits under it in the photograph. Desktop
            only — on mobile the image shows through un-dimmed. */}
        <div className="hidden md:block absolute inset-0 bg-gradient-to-l from-ink/70 via-ink/10 to-transparent" />

        {/* Mobile-only wash behind the bottom-aligned text block.
            Opaque near the bottom, fading to transparent as it rises,
            so the headline + CTA stay legible against any photograph. */}
        <div
          className="md:hidden absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
          style={{
            background:
              'linear-gradient(0deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0.15) 75%, transparent 100%)',
          }}
        />

        <div className="relative z-10 min-h-[640px] md:min-h-[calc(95vh+30px)] flex items-end md:items-center justify-center md:justify-end">
          <div className="w-full md:w-3/5 lg:w-1/2 px-6 md:px-12 lg:px-20 pt-6 pb-10 md:py-14 text-ivory flex flex-col items-center text-center md:translate-y-6 lg:translate-y-10">
            <h3
              className="font-bold text-3xl md:text-7xl lg:text-7xl leading-[1.05] tracking-tight"
              style={{
                fontFamily:
                  'var(--font-hero), "Italiana", Georgia, serif',
                // Metallic-gold text — multi-stop gradient from bronze to
                // champagne to bronze, clipped to the glyphs. Drop-shadow
                // adds the subtle sheen a flat colour can't.
                backgroundImage:
                  'linear-gradient(135deg, #8A5A1F 0%, #C8923F 20%, #F2C99E 45%, #FFF2D6 50%, #F2C99E 55%, #C8923F 80%, #8A5A1F 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                filter:
                  'drop-shadow(0 2px 6px rgba(0,0,0,0.45)) drop-shadow(0 0 1px rgba(242,201,158,0.3))',
              }}
            >
              {feature.headline}
            </h3>

            <p className="mt-2 md:mt-4 text-xs md:text-base text-ivory/90 leading-relaxed max-w-md">
              {feature.subhead}
            </p>

            {ctaHref ? (
              <Link
                href={ctaHref}
                className="inline-flex items-center justify-center mt-4 md:mt-7 bg-white text-ink px-6 py-2 md:px-10 md:py-3.5 text-[0.7rem] md:text-sm font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] hover:bg-gold hover:text-ink transition-colors"
              >
                {feature.ctaLabel}
              </Link>
            ) : (
              <span className="inline-flex items-center justify-center mt-4 md:mt-7 bg-white text-ink px-6 py-2 md:px-10 md:py-3.5 text-[0.7rem] md:text-sm font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] cursor-default">
                {feature.ctaLabel}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Four occasion sub-edits beneath the main banner. Each tile is
          a portrait photograph with the occasion title + SHOP NOW chip
          overlaid at the bottom over a dark gradient veil. Mirrors the
          Kalki "Wedding Wardrobe" cards. */}
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10 py-10 md:py-14">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {occasions.map((o) => {
            const href = navHref(o.href);
            const inner = (
              <>
                <Image
                  src={o.image}
                  alt={o.title}
                  fill
                  sizes="(max-width: 768px) 50vw, 25vw"
                  style={{ objectPosition: o.imagePosition }}
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Dark gradient veil — stronger at the bottom so the
                    title + CTA stay legible on any photo underneath. */}
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent pointer-events-none" />
                <div className="absolute inset-x-0 bottom-0 p-3 md:p-7 flex flex-col items-center text-center">
                  <h3 className="font-display text-xl md:text-2xl lg:text-3xl font-semibold text-ivory leading-tight">
                    {o.title}
                  </h3>
                  <span className="inline-flex items-center justify-center mt-2.5 md:mt-4 bg-white text-ink px-4 py-1.5 md:px-8 md:py-3 text-[0.65rem] md:text-xs font-bold uppercase tracking-[0.15em] md:tracking-[0.2em] group-hover:bg-gold group-hover:text-ink transition-colors">
                    Shop Now
                  </span>
                </div>
              </>
            );
            return href ? (
              <Link
                key={o.title}
                href={href}
                className="group relative block aspect-[2/3] overflow-hidden bg-bone"
              >
                {inner}
              </Link>
            ) : (
              <span
                key={o.title}
                className="group relative block aspect-[2/3] overflow-hidden bg-bone cursor-default"
              >
                {inner}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
}
