'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import clsx from 'clsx';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';

/**
 * Hero — promotional campaign banner carousel. Each slide is a themed
 * poster (Festive New Arrivals, Bridal, Banarasi, Patola, Mysore Silk)
 * rather than a product spotlight. Text alternates left/right side so
 * no two consecutive slides sit identically — gives the carousel a
 * rhythm instead of looking like the same layout re-coloured.
 */

type Slide = {
  id: string;
  image: string;
  objectPosition?: string;
  // Alternates across the array so each neighbour differs.
  textSide: 'left' | 'right';
  eyebrow: string;
  headline: string;
  supporting: string;
  ctaLabel: string;
  ctaHref: string;
  // Optional accent chip above the eyebrow (e.g. "New", "Limited").
  badge?: { label: string; tone: 'maroon' | 'gold' };
};

const SLIDES: Slide[] = [
  {
    id: 'festive-new-arrivals',
    image: '/homebanner/banner1.png',
    objectPosition: '50% 25%',
    textSide: 'right',
    eyebrow: 'Festive',
    headline: 'New Arrivals',
    supporting:
      'Over 200 handwoven heirloom pieces added this season — kanjeevarams, banarasis, patolas and more.',
    ctaLabel: 'Shop New',
    ctaHref: '/shop?sort=new',
    badge: { label: 'Just In', tone: 'gold' },
  },
  {
    id: 'bridal-edit',
    image: '/homebanner/banner2.png',
    objectPosition: '50% 22%',
    textSide: 'right',
    eyebrow: 'Wedding Season',
    headline: 'The Bridal Edit',
    supporting:
      'Temple-border kanjeevarams and pit-loom banarasis — heirloom silks, woven for the day you remember.',
    ctaLabel: 'Shop Bridal',
    ctaHref: '/shop?tier=bridal',
    badge: { label: 'Signature', tone: 'gold' },
  },
];

const DEFAULT_OBJECT_POSITION = '50% 25%';

export default function Hero() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setActive((a) => (a + 1) % SLIDES.length);
    }, 7000);
    return () => clearInterval(id);
  }, []);

  const next = () => setActive((a) => (a + 1) % SLIDES.length);
  const prev = () =>
    setActive((a) => (a - 1 + SLIDES.length) % SLIDES.length);

  return (
    <section className="relative w-full h-[calc(85vh-10px)] min-h-[470px] sm:min-h-[550px] md:min-h-[610px] max-h-[890px] bg-[#1B0E0A] overflow-hidden">
      {SLIDES.map((slide, i) => {
        const isLeft = slide.textSide === 'left';
        return (
          <div
            key={slide.id}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: i === active ? 1 : 0,
              pointerEvents: i === active ? 'auto' : 'none',
            }}
            aria-hidden={i !== active}
          >
            {/* Full-bleed background image. */}
            <Image
              src={slide.image}
              alt=""
              fill
              priority={i === 0}
              sizes="100vw"
              className="object-cover"
              style={{
                objectPosition:
                  slide.objectPosition ?? DEFAULT_OBJECT_POSITION,
              }}
            />

            {/* Darkening gradient on the text side. Keeps the text
                legible on whichever half it lands, lets the image breathe
                on the other half. Flipped per slide via `isLeft`. */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: isLeft
                  ? 'linear-gradient(90deg, rgba(27,14,10,0.82) 0%, rgba(27,14,10,0.55) 30%, rgba(27,14,10,0.15) 55%, transparent 72%)'
                  : 'linear-gradient(90deg, transparent 28%, rgba(27,14,10,0.15) 45%, rgba(27,14,10,0.55) 70%, rgba(27,14,10,0.82) 100%)',
              }}
            />

            {/* Small-screen blanket: on mobile the image sits behind the
                text (no side split), so a flat dark wash guarantees
                readable copy regardless of the photo. */}
            <div className="md:hidden absolute inset-0 bg-[#1B0E0A]/70 pointer-events-none" />

            {/* Text panel — aligned by `isLeft`. On mobile always
                centre-left so copy doesn't get cramped. */}
            <div
              className={clsx(
                'relative h-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-14 flex items-center',
                isLeft ? 'justify-start' : 'md:justify-end justify-start',
              )}
            >
              <div className="max-w-lg md:max-w-[min(32rem,38vw)] text-ivory">
                {slide.badge && (
                  <span
                    className={clsx(
                      'inline-block px-3 py-1.5 text-[0.65rem] font-bold uppercase tracking-wider rounded-sm mb-5',
                      slide.badge.tone === 'gold'
                        ? 'bg-gold text-ink'
                        : 'bg-maroon text-ivory',
                    )}
                  >
                    {slide.badge.label}
                  </span>
                )}
                <div className="text-xs md:text-sm font-medium text-ivory/65 mb-3 uppercase tracking-[0.2em]">
                  {slide.eyebrow}
                </div>
                <h1
                  className="text-5xl md:text-7xl lg:text-7xl font-semibold leading-[1] mb-5"
                  style={{
                    fontFamily:
                      'var(--font-hero), "Italiana", Georgia, serif',
                    // Metallic-gold text — multi-stop diagonal gradient
                    // from bronze → champagne → bronze, clipped to the
                    // glyphs. Same treatment used on the Bridal Edit
                    // headline in CraftStory so the brand reads
                    // consistent across both script-face headings.
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
                  {slide.headline}
                </h1>
                <p className="text-sm md:text-base text-ivory/80 leading-relaxed mb-7 max-w-md">
                  {slide.supporting}
                </p>
                <Link
                  href={slide.ctaHref}
                  className="inline-flex items-center bg-white hover:bg-ivory text-ink px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] rounded-sm transition-colors"
                >
                  {slide.ctaLabel}
                </Link>
              </div>
            </div>
          </div>
        );
      })}

      {/* Slide arrows — paired bottom-right. Dark translucent circles. */}

      <div className="absolute bottom-6 right-6 lg:bottom-8 lg:right-8 z-10 hidden md:flex items-center gap-2">
        <button
          onClick={prev}
          className="bg-black/35 hover:bg-black/55 text-ivory w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
          aria-label="Previous slide"
        >
          <LuChevronLeft size={22} strokeWidth={2} aria-hidden />
        </button>
        <button
          onClick={next}
          className="bg-black/35 hover:bg-black/55 text-ivory w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-sm transition-colors"
          aria-label="Next slide"
        >
          <LuChevronRight size={22} strokeWidth={2} aria-hidden />
        </button>
      </div>
    </section>
  );
}

