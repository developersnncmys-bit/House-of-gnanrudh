'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

/**
 * AnimatedSearchBar — typewriter placeholder mirroring the Kalki Fashion
 * search-bar pattern. The placeholder cycles through saree categories so
 * the visitor sees a live suggestion of what they could search for.
 *
 * Animation stops the moment the input gains focus or has a value, so the
 * typewriter never fights the user's own typing.
 *
 * Two visual variants:
 *   `drawer`  — default, used inside the slide-in search panel. Gray fill,
 *               thicker padding, underlined placeholder.
 *   `inline`  — nav-row variant. Cream fill (blends with nav), thinner
 *               padding, smaller text, subtle ink-tinted border.
 */

// Phrase mix is intentional: category names give a direct "what we
// sell" signal, trending/editorial phrases give a "what to shop for"
// prompt. Interleaved so neither style dominates the carousel.
//
// `withPrefix` controls whether the placeholder renders as
// `Search for <phrase>` (true, for category names) or just `<phrase>`
// alone (false, for conversational trending phrases that would read
// awkwardly with the prefix).
type Phrase = { text: string; withPrefix: boolean };

const PHRASES: Phrase[] = [
  { text: "what's trending", withPrefix: false },
  { text: 'Kanjeevaram sarees', withPrefix: true },
  { text: "what's trending for haldi", withPrefix: false },
  { text: 'Banarasi sarees', withPrefix: true },
  { text: "what's trending for weddings", withPrefix: false },
  { text: 'Mysore Silk', withPrefix: true },
  { text: "what's new this week", withPrefix: false },
  { text: 'Mangalagiri sarees', withPrefix: true },
  { text: 'Pochampally ikats', withPrefix: true },
  { text: 'bridal must-haves', withPrefix: false },
  { text: 'Gadwal sarees', withPrefix: true },
  { text: 'Patola sarees', withPrefix: true },
  { text: 'festive picks', withPrefix: false },
  { text: 'Fancy Sarees', withPrefix: true },
  { text: 'Mixed Pattu', withPrefix: true },
  { text: 'Bridal sarees', withPrefix: true },
  { text: 'Sale', withPrefix: true },
];

// Animation timings — short enough to feel alive, long enough to read.
const TYPE_MS = 70;
const ERASE_MS = 35;
const HOLD_MS = 1400;

export default function AnimatedSearchBar({
  autoFocus = false,
  variant = 'drawer',
}: {
  autoFocus?: boolean;
  variant?: 'drawer' | 'inline';
} = {}) {
  const isInline = variant === 'inline';
  const router = useRouter();
  const [value, setValue] = useState('');
  const [placeholder, setPlaceholder] = useState('');
  const phraseRef = useRef(0);
  const charRef = useRef(0);
  const phaseRef = useRef<'typing' | 'holding' | 'erasing'>('typing');
  const timerRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!autoFocus) return;
    const t = window.setTimeout(() => inputRef.current?.focus(), 320);
    return () => window.clearTimeout(t);
  }, [autoFocus]);

  // Pause the animation only once the user has typed something. Focus
  // alone shouldn't stop it — the panel autoFocuses the input on open,
  // and we still want the typewriter suggestion visible inside the
  // search box until the visitor starts typing.
  const shouldAnimate = value.length === 0;

  useEffect(() => {
    if (!shouldAnimate) {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    const tick = () => {
      const phrase = PHRASES[phraseRef.current].text;

      if (phaseRef.current === 'typing') {
        if (charRef.current < phrase.length) {
          charRef.current += 1;
          setPlaceholder(phrase.slice(0, charRef.current));
          timerRef.current = window.setTimeout(tick, TYPE_MS);
        } else {
          phaseRef.current = 'holding';
          timerRef.current = window.setTimeout(tick, HOLD_MS);
        }
      } else if (phaseRef.current === 'holding') {
        phaseRef.current = 'erasing';
        timerRef.current = window.setTimeout(tick, ERASE_MS);
      } else {
        if (charRef.current > 0) {
          charRef.current -= 1;
          setPlaceholder(phrase.slice(0, charRef.current));
          timerRef.current = window.setTimeout(tick, ERASE_MS);
        } else {
          phaseRef.current = 'typing';
          phraseRef.current = (phraseRef.current + 1) % PHRASES.length;
          timerRef.current = window.setTimeout(tick, 250);
        }
      }
    };

    tick();
    return () => {
      if (timerRef.current) {
        window.clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [shouldAnimate]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = value.trim();
    if (!q) return;
    const lower = q.toLowerCase();

    // Substring matching — shoppers type natural phrases ("bridal sarees",
    // "banarasi silk saree", "mysore silk for wedding"), not bare category
    // names. Walk ordered rules and route on the first hit.
    //
    // Order matters: more specific patterns FIRST so "mysore silk" wins
    // over "mysore", "mixed pattu" over "pattu", etc. Weaves are checked
    // before tiers so a query like "bridal banarasi" lands on the weave
    // (the category is usually what shoppers want to filter by first).
    const weaveMatchers: Array<[string, string]> = [
      ['mysore silk', 'Mysore Silk'],
      ['mixed pattu', 'Mixed Pattu Sarees'],
      ['kanchipuram', 'Kanjivaram'],
      ['kanjeevaram', 'Kanjivaram'],
      ['kanjivaram', 'Kanjivaram'],
      ['banarasi', 'Banarasi'],
      ['mangalagiri', 'Mangalagiri'],
      ['pochampally', 'Pochampally'],
      ['gadwal', 'Gadwal'],
      ['patola', 'Patola'],
      ['mysore', 'Mysore Silk'],
      ['fancy', 'Fancy Sarees'],
      ['pattu', 'Mixed Pattu Sarees'],
    ];
    for (const [pattern, weave] of weaveMatchers) {
      if (lower.includes(pattern)) {
        router.push(`/shop?weave=${encodeURIComponent(weave)}`);
        return;
      }
    }

    // Occasion routing — checked BEFORE the generic tier fallback so
    // that "haldi sarees" lands on the dedicated haldi edit, not a flat
    // bridal page. Each tuple is [keyword, tier, occasion] and routes
    // to `/shop?tier=<tier>&occasion=<occasion>`.
    const OCCASIONS: Array<[string, string, string]> = [
      ['haldi', 'bridal', 'haldi'],
      ['mehendi', 'bridal', 'mehendi'],
      ['sangeet', 'bridal', 'sangeet'],
      ['reception', 'bridal', 'reception'],
      ['engagement', 'bridal', 'engagement'],
      ['diwali', 'festive', 'diwali'],
      ['pongal', 'festive', 'pongal'],
      ['navratri', 'festive', 'navratri'],
      ['pooja', 'festive', 'pooja'],
      ['office', 'everyday', 'office'],
      ['casual', 'everyday', 'casual'],
      ['travel', 'everyday', 'travel'],
    ];
    for (const [keyword, tier, occasion] of OCCASIONS) {
      if (lower.includes(keyword)) {
        router.push(`/shop?tier=${tier}&occasion=${occasion}`);
        return;
      }
    }

    // Generic tier — only reached if no specific occasion matched. So
    // "bridal sarees" / "wedding silk" lands on the full bridal tier,
    // but "bridal haldi" routes to the haldi edit above (haldi wins).
    // `muhurtham` / `muhurtam` are the South Indian wedding core
    // ceremony words — map to the bridal tier since there's no
    // dedicated muhurtham occasion edit yet.
    if (
      lower.includes('bridal') ||
      lower.includes('wedding') ||
      lower.includes('muhurtham') ||
      lower.includes('muhurtam')
    ) {
      router.push('/shop?tier=bridal');
      return;
    }
    if (lower.includes('festive') || lower.includes('party')) {
      router.push('/shop?tier=festive');
      return;
    }
    if (lower.includes('everyday') || lower.includes('daily')) {
      router.push('/shop?tier=everyday');
      return;
    }

    // Transactional intents.
    if (lower.includes('sale') || lower.includes('discount') || lower.includes('offer')) {
      router.push('/shop?sale=1');
      return;
    }
    if (lower.includes('new') || lower.includes('arrival') || lower.includes('trending')) {
      router.push('/shop?sort=new');
      return;
    }

    // Fallback — pass the raw query through. The shop page can handle
    // free-text (or ignore it); we've at least kept the shopper on the
    // catalogue rather than a dead-end.
    router.push(`/shop?q=${encodeURIComponent(q)}`);
  };

  // Placeholder composition depends on the current phrase's `withPrefix`
  // flag: category names get the `Search for ` prefix, conversational
  // trending phrases stand alone (they'd read awkwardly with it).
  // Quotes removed in both cases — the typewriter cursor rhythm is
  // enough to mark the suggestion as a sample query.
  const currentPhrase = PHRASES[phraseRef.current];
  const displayPlaceholder = placeholder
    ? currentPhrase.withPrefix
      ? `Search for ${placeholder}`
      : placeholder
    : 'Search for sarees…';

  const submitButton = (
    <button
      type="submit"
      aria-label="Search"
      className={clsx(
        'shrink-0 flex items-center justify-center transition-colors',
        isInline
          ? 'w-10 bg-maroon-deep text-ivory hover:bg-maroon'
          : 'px-4 text-ink/70 hover:text-maroon',
      )}
    >
      <SearchIcon />
    </button>
  );

  return (
    <form
      role="search"
      onSubmit={onSubmit}
      className={clsx(
        'flex items-stretch transition-colors w-full',
        isInline
          ? 'bg-ivory border border-ink/15 hover:border-ink/30 focus-within:border-ink/50'
          : 'bg-transparent border-0',
      )}
    >
      {/* Drawer variant: magnifier sits to the LEFT of the input (Kalki
          pattern — the icon reads as a prefix rather than a submit CTA).
          Inline variant keeps the maroon CTA on the right. */}
      {!isInline && submitButton}
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={displayPlaceholder}
        aria-label="Search sarees"
        className={clsx(
          'flex-1 min-w-0 bg-transparent focus:outline-none',
          isInline
            ? 'pl-3 pr-2 py-2 text-[0.8rem] text-ink placeholder:text-ink/55 placeholder:font-medium placeholder:tracking-wide'
            : 'pr-3 py-3 text-base md:text-lg text-ink placeholder:text-ink/55 placeholder:font-semibold',
        )}
      />
      {isInline && submitButton}
    </form>
  );
}

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
