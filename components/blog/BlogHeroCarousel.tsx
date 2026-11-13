'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { LuChevronLeft, LuChevronRight } from 'react-icons/lu';
import type { BlogPost } from '@/lib/blog';
import { navHref } from '@/lib/soft-launch';

/**
 * BlogHeroCarousel — Kalki-style rotating hero for the blog landing.
 *
 * Infinite loop implementation: posts are tiled three times in the
 * track. The cursor starts in the middle copy and auto-advances. When
 * it drifts out of the middle copy we transparently jump to the
 * equivalent position in the middle (without animation) so there is
 * always a neighbour peeking on both sides — no empty cream gutters,
 * no clone/real seams.
 */

const AUTOPLAY_MS = 6500;
const DESKTOP_SLIDE_WIDTH = 72; // % of viewport
const DESKTOP_GAP = 0.5; // % of viewport
const TRANSITION_MS = 700;
const GOLD_GRADIENT =
  'linear-gradient(135deg, #8A5A1F 0%, #C8923F 20%, #F2C99E 45%, #FFF2D6 50%, #F2C99E 55%, #C8923F 80%, #8A5A1F 100%)';

export default function BlogHeroCarousel({ posts }: { posts: BlogPost[] }) {
  const n = posts.length;

  // Track layout: three tiled copies of `posts` sit end-to-end. The
  // cursor lives in the middle copy (indices n..2n-1) and whenever it
  // steps out we snap back to the equivalent position in the middle.
  const tripled = useMemo(
    () => [...posts, ...posts, ...posts],
    [posts],
  );

  const [trackIdx, setTrackIdx] = useState(n); // start at first slide of middle copy
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [slideWidth, setSlideWidth] = useState(100);
  const snapTimer = useRef<number | null>(null);

  // Real-slide index (0..n-1) — used for dots + priority image.
  const realActive = ((trackIdx % n) + n) % n;

  useEffect(() => {
    const update = () => {
      setSlideWidth(window.innerWidth >= 768 ? DESKTOP_SLIDE_WIDTH : 100);
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  useEffect(() => {
    if (paused || n < 2) return;
    const id = window.setInterval(() => {
      setAnimate(true);
      setTrackIdx((i) => i + 1);
    }, AUTOPLAY_MS);
    return () => window.clearInterval(id);
  }, [paused, n]);

  // Re-centre the cursor in the middle copy when it drifts out. Wait
  // for the current transition to finish so the user still sees the
  // intended slide, then snap without animation.
  useEffect(() => {
    if (snapTimer.current) window.clearTimeout(snapTimer.current);
    if (trackIdx < n || trackIdx >= 2 * n) {
      snapTimer.current = window.setTimeout(() => {
        setAnimate(false);
        setTrackIdx(n + (((trackIdx % n) + n) % n));
      }, TRANSITION_MS + 20);
    }
    return () => {
      if (snapTimer.current) window.clearTimeout(snapTimer.current);
    };
  }, [trackIdx, n]);

  // Re-enable animation on the next frame after a snap so the next
  // auto-advance animates normally.
  useEffect(() => {
    if (animate) return;
    const raf = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(raf);
  }, [animate]);

  const next = () => {
    setAnimate(true);
    setTrackIdx((i) => i + 1);
  };
  const prev = () => {
    setAnimate(true);
    setTrackIdx((i) => i - 1);
  };
  const goTo = (realIndex: number) => {
    setAnimate(true);
    setTrackIdx(n + realIndex);
  };

  const gap = slideWidth === 100 ? 0 : DESKTOP_GAP;
  const centerOffset = (100 - slideWidth) / 2;
  const translateX = -trackIdx * (slideWidth + gap) + centerOffset;

  return (
    <section
      className="relative w-full h-[calc(80vh-10px)] min-h-[520px] md:min-h-[640px] max-h-[820px] bg-ivory overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-roledescription="carousel"
      aria-label="Featured stories"
    >
      <div
        className={`relative h-full flex items-stretch ${
          animate ? 'transition-transform ease-out' : ''
        }`}
        style={{
          transform: `translateX(${translateX}vw)`,
          columnGap: `${gap}vw`,
          transitionDuration: animate ? `${TRANSITION_MS}ms` : '0ms',
        }}
      >
        {tripled.map((post, i) => {
          const isActive = i === trackIdx;
          const href = isActive ? navHref(`/blog/${post.slug}`) : undefined;
          const realIdx = i % n;
          return (
            <div
              key={`${post.slug}-${i}`}
              className="shrink-0 h-full relative overflow-hidden rounded-sm"
              style={{ width: `${slideWidth}vw` }}
              aria-hidden={!isActive}
              onClick={() => {
                if (!isActive) goTo(realIdx);
              }}
              role={isActive ? undefined : 'button'}
            >
              <Image
                src={post.hero}
                alt=""
                fill
                priority={i === n} // first real slide in middle copy
                sizes="100vw"
                className="object-cover"
                style={{ objectPosition: '50% 30%' }}
              />
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(27,14,10,0.35) 0%, rgba(27,14,10,0.1) 35%, rgba(27,14,10,0.1) 55%, rgba(27,14,10,0.78) 100%)',
                }}
              />
              <SlideCopy post={post} href={href} />
            </div>
          );
        })}
      </div>

      {n > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous story"
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-black/60 text-ivory flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <LuChevronLeft size={22} strokeWidth={2} aria-hidden />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next story"
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-black/35 hover:bg-black/60 text-ivory flex items-center justify-center backdrop-blur-sm transition-colors"
          >
            <LuChevronRight size={22} strokeWidth={2} aria-hidden />
          </button>

          <div className="absolute bottom-6 md:bottom-8 inset-x-0 z-20 flex items-center justify-center gap-2">
            {posts.map((p, i) => (
              <button
                key={p.slug}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to story ${i + 1}`}
                aria-current={i === realActive}
                className={`h-[3px] rounded-full transition-all duration-300 ${
                  i === realActive
                    ? 'w-10 bg-gold'
                    : 'w-4 bg-ivory/40 hover:bg-ivory/70'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function SlideCopy({ post, href }: { post: BlogPost; href?: string }) {
  const body = (
    <div className="relative h-full max-w-[1100px] mx-auto px-6 md:px-10 flex flex-col items-center justify-end text-center pb-20 md:pb-24 text-ivory">
      <div className="flex items-center justify-center gap-x-4 gap-y-1 flex-wrap mb-5 text-[0.72rem] md:text-sm font-medium text-ivory/90">
        {[post.category, ...post.tags.slice(0, 2)].map((t, idx) => (
          <span key={`${t}-${idx}`} className="inline-flex items-center gap-4">
            {idx > 0 && (
              <span aria-hidden className="w-1 h-1 rounded-full bg-ivory/50" />
            )}
            <span className="capitalize">{t}</span>
          </span>
        ))}
      </div>

      <h2
        className="text-3xl md:text-5xl lg:text-[3.25rem] font-semibold leading-[1.1] max-w-3xl"
        style={{
          fontFamily:
            'var(--font-hero), "Italiana", Georgia, serif',
          backgroundImage: GOLD_GRADIENT,
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
          filter:
            'drop-shadow(0 2px 6px rgba(0,0,0,0.5)) drop-shadow(0 0 1px rgba(242,201,158,0.3))',
        }}
      >
        {post.title}
      </h2>

      <p className="mt-4 text-sm md:text-base text-ivory/80 max-w-xl leading-relaxed">
        {post.dek}
      </p>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="absolute inset-0 block" aria-label={`Read: ${post.title}`}>
        {body}
      </Link>
    );
  }
  return <div className="absolute inset-0 pointer-events-none">{body}</div>;
}
