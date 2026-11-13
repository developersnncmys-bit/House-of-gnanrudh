'use client';

import { useState } from 'react';
import { WEAVE_STORIES } from './CategoryStory';

/**
 * CategoryWeaveIntro — Kalki/Pothys-style editorial header for a weave
 * landing page (Kanjeevaram, Banarasi, Mysore Silk, …). Mirrors the
 * NewArrivalsIntro layout — gold tracked eyebrow, large sans heading,
 * description paragraph, Read More toggle — but pulls the per-weave
 * copy from WEAVE_STORIES instead of a hard-coded block.
 *
 * Kept as its own component so changes to the New Arrivals intro
 * don't accidentally ripple into every weave page.
 */
export default function CategoryWeaveIntro({ weave }: { weave: string }) {
  const [expanded, setExpanded] = useState(false);
  const story = WEAVE_STORIES[weave];

  return (
    <section className="bg-ivory border-b border-gray-200">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-10 md:py-12 text-center">
        {/* Lotus ornament — same decorative glyph and sizing the
            NewArrivalsIntro uses so the two intro headers stay
            visually consistent. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/lotus.png"
          alt=""
          aria-hidden
          className="mx-auto mb-5 h-8 md:h-9 w-auto select-none"
          draggable={false}
        />
        <div className="text-[0.68rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-gold-deep mb-4">
          {story?.region ?? 'The House Collection'}
        </div>

        {/* role=heading escapes globals.css's `h1 { font-family: Italiana }`
            rule so font-extrabold actually renders bold (Italiana only
            ships at 400). Same technique as NewArrivalsIntro. */}
        <div
          role="heading"
          aria-level={1}
          className="font-sans text-xl md:text-2xl lg:text-[1.6rem] font-extrabold text-ink leading-tight tracking-tight"
        >
          {weave}
          {story?.tagline ? `: ${story.tagline}` : ''}
        </div>

        <p className="mt-3 text-xs md:text-sm text-ink/75 leading-relaxed max-w-[900px] mx-auto">
          {story?.body?.split('.').slice(0, 1).join('.')}
          {story?.body && story.body.split('.').length > 1 && '.'}
          {expanded && story?.body && (
            <>
              {' '}
              {story.body.split('.').slice(1).join('.').trim()}
            </>
          )}
          {!story && (
            <>
              A hand-woven edit from the House of GnanRudh — {weave}{' '}
              sarees drawn from our atelier&apos;s finest looms.
            </>
          )}
        </p>

        {story?.body && story.body.split('.').length > 2 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="mt-5 text-sm font-bold text-maroon-deep hover:text-maroon transition-colors underline underline-offset-4"
            aria-expanded={expanded}
          >
            {expanded ? 'Read Less' : 'Read More'}
          </button>
        )}
      </div>
    </section>
  );
}
