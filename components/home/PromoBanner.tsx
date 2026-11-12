'use client';

import Image from 'next/image';
import Link from 'next/link';
import { navHref } from '@/lib/soft-launch';

/**
 * PromoBanner — Pothys sale-banner layout:
 *   [ model photo ]  [ dark centre panel with heading + CTA ]  [ model photo ]
 *
 * The centre panel carries the section's heading + description + call
 * to action — nothing lives above or below this strip. Flanked by two
 * full-bleed model photographs so the whole band reads as a single
 * promotional banner, not a card grid.
 */

const leftImage = '/bg-explore.png';
const rightImage = '/bg-explore.png';

const promo = {
  eyebrow: 'The House Collection',
  headline: 'Explore Collections',
  description:
    'Celebrate tradition with our exquisite range of sarees — from everyday drapes to heirloom silks, hand-woven for every occasion in a woman’s wardrobe.',
  ctaLabel: 'Explore Now',
  ctaHref: '/shop',
};

export default function PromoBanner() {
  const ctaHref = navHref(promo.ctaHref);

  return (
    <section className="bg-white py-8 md:py-12">
      {/* Full-bleed grid — no max-width container so the flanking
          model photos run edge-to-edge with the viewport. The centre
          maroon panel's own padding handles its internal breathing room. */}
      <div className="grid md:grid-cols-[1fr_1.4fr_1fr] min-h-[420px] md:min-h-[500px] lg:min-h-[560px] overflow-hidden">
          {/* LEFT — arch background with model photograph laid on top,
              anchored at the bottom so she stands inside the mihrab
              cut-out. Hidden on mobile so the centre panel owns the
              viewport width. */}
          <div className="relative hidden md:block">
            <Image
              src={leftImage}
              alt=""
              fill
              sizes="(max-width: 768px) 0vw, 28vw"
              className="object-cover"
              style={{ objectPosition: '50% 0%' }}
            />
            {/* Model is wrapped in a smaller, bottom-anchored box so
                the figure shrinks (h-[80%]) while still touching the
                bottom edge of the panel. */}
            <div className="absolute inset-x-0 bottom-0 h-[80%] pointer-events-none">
              <Image
                src="/homebanner/women1.png"
                alt=""
                fill
                sizes="(max-width: 768px) 0vw, 22vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>

          {/* CENTRE — image-backed panel carrying the heading, copy
              and CTA. The bg-behind photograph fills the panel and
              the text stacks over it. */}
          <div className="relative text-ivory flex flex-col items-center justify-center text-center px-6 md:px-10 py-16 md:py-20 overflow-hidden">
            <Image
              src="/homebanner/bg-behind.png"
              alt=""
              fill
              sizes="(max-width: 768px) 100vw, 44vw"
              className="object-cover"
              priority={false}
            />
            <div className="relative w-full max-w-md">
              <h2
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-[1.05]"
                style={{
                  fontFamily:
                    'var(--font-hero), "Italiana", Georgia, serif',
                  // Metallic-gold text — same multi-stop gradient used on
                  // the Hero banner + Bridal Edit headings so the three
                  // script headlines read as one visual set.
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
                {promo.headline}
              </h2>

              <p className="mt-5 text-sm md:text-base text-ivory/85 leading-relaxed">
                {promo.description}
              </p>
            </div>

            {/* CTA — sharp-cornered white rectangle under the copy. */}
            {ctaHref ? (
              <Link
                href={ctaHref}
                className="relative mt-8 inline-flex items-center justify-center bg-white text-ink px-10 py-3.5 text-xs md:text-sm font-bold uppercase tracking-[0.2em] hover:bg-gold hover:text-ink transition-colors"
              >
                {promo.ctaLabel}
              </Link>
            ) : (
              <span className="relative mt-8 inline-flex items-center justify-center bg-white text-ink px-10 py-3.5 text-xs md:text-sm font-bold uppercase tracking-[0.2em] cursor-default">
                {promo.ctaLabel}
              </span>
            )}
          </div>

          {/* RIGHT — mirror arch + model, same recipe as the left. */}
          <div className="relative hidden md:block">
            <Image
              src={rightImage}
              alt=""
              fill
              sizes="(max-width: 768px) 0vw, 28vw"
              className="object-cover"
              style={{ objectPosition: '50% 0%' }}
            />
            <div className="absolute inset-x-0 bottom-0 h-[80%] pointer-events-none">
              <Image
                src="/homebanner/women2.png"
                alt=""
                fill
                sizes="(max-width: 768px) 0vw, 22vw"
                className="object-contain object-bottom"
              />
            </div>
          </div>
        </div>
    </section>
  );
}
