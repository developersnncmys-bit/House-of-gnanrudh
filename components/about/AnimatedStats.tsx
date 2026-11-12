'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * AnimatedStats — three headline numerals that count up from zero when
 * the band scrolls into view. Powers the "2,000+ · 6 · 100%" row on the
 * About page. Each stat parses its own numeric + suffix (+, %, …) so the
 * caller can pass a formatted display value without extra plumbing.
 */

type Stat = { value: string; label: string };

type ParsedStat = {
  target: number;
  prefix: string;
  suffix: string;
  decimals: number;
  grouping: boolean;
};

function parseStat(raw: string): ParsedStat {
  // Match leading non-digit characters (currency etc.), the numeric
  // portion (digits, commas, dot), and the trailing suffix (+, %, …).
  const match = raw.match(/^([^0-9-]*)(-?\d[\d,]*(?:\.\d+)?)(.*)$/);
  if (!match) {
    return { target: 0, prefix: '', suffix: raw, decimals: 0, grouping: false };
  }
  const [, prefix, numericRaw, suffix] = match;
  const grouping = numericRaw.includes(',');
  const normalised = numericRaw.replace(/,/g, '');
  const decimals = normalised.includes('.')
    ? normalised.split('.')[1]!.length
    : 0;
  return {
    target: parseFloat(normalised),
    prefix,
    suffix,
    decimals,
    grouping,
  };
}

function formatValue(n: number, parsed: ParsedStat): string {
  const body = parsed.grouping
    ? n.toLocaleString('en-IN', {
        minimumFractionDigits: parsed.decimals,
        maximumFractionDigits: parsed.decimals,
      })
    : n.toFixed(parsed.decimals);
  return `${parsed.prefix}${body}${parsed.suffix}`;
}

// easeOutCubic — settles smoothly on the target without overshoot.
const ease = (t: number) => 1 - Math.pow(1 - t, 3);

const DURATION_MS = 1600;

export default function AnimatedStats({ stats }: { stats: Stat[] }) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || started) return;
    if (
      typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    ) {
      setStarted(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setStarted(true);
            io.disconnect();
            break;
          }
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [started]);

  return (
    <div
      ref={rootRef}
      className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 text-center"
    >
      {stats.map((s) => (
        <StatItem key={s.label} stat={s} started={started} />
      ))}
    </div>
  );
}

function StatItem({ stat, started }: { stat: Stat; started: boolean }) {
  const parsed = useRef(parseStat(stat.value)).current;
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!started) return;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const elapsed = now - start;
      const t = Math.min(1, elapsed / DURATION_MS);
      setCurrent(parsed.target * ease(t));
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setCurrent(parsed.target);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, parsed]);

  return (
    <div>
      <div
        className="text-[2.75rem] md:text-[3.5rem] leading-none tabular-nums"
        style={{
          fontFamily: 'var(--font-hero), "Italiana", Georgia, serif',
          fontWeight: 700,
          backgroundImage:
            'linear-gradient(135deg, #5A3610 0%, #8A5A1F 25%, #B07A2A 50%, #8A5A1F 75%, #5A3610 100%)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          color: 'transparent',
        }}
      >
        {formatValue(current, parsed)}
      </div>
      <div className="mt-3 text-[0.72rem] md:text-[0.78rem] tracking-[0.25em] uppercase font-bold text-ink/80">
        {stat.label}
      </div>
    </div>
  );
}
