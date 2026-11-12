'use client';

import { useEffect, useState } from 'react';
import type { IconType } from 'react-icons';
import { LuTruck, LuGlobe, LuHand, LuShirt, LuRotateCcw } from 'react-icons/lu';

/**
 * PromoStrip — top-of-page rotating announcement strip mirroring the Kalki
 * Fashion pattern: dark bar, small icon on the left, single line of copy,
 * cycles every few seconds with a fade transition.
 */

type Msg = { icon: IconName; text: string };

const MESSAGES: Msg[] = [
  { icon: 'truck', text: 'Free shipping across India' },
  { icon: 'globe', text: 'Insured worldwide delivery' },
  { icon: 'hand', text: 'Hand-woven heirloom sarees' },
  { icon: 'shirt', text: 'Designer quality, hand-finished' },
];

const ROTATE_MS = 3200;
const FADE_MS = 320;

export default function PromoStrip() {
  const [idx, setIdx] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = window.setInterval(() => {
      // Fade out current, swap message, fade in
      setVisible(false);
      window.setTimeout(() => {
        setIdx((i) => (i + 1) % MESSAGES.length);
        setVisible(true);
      }, FADE_MS);
    }, ROTATE_MS);
    return () => window.clearInterval(interval);
  }, []);

  const current = MESSAGES[idx];

  return (
    <div className="bg-maroon-deep text-ivory">
      <div className="max-w-[1720px] mx-auto px-6 py-2 flex items-center justify-center gap-2.5 min-h-[36px]">
        <span
          className="text-white inline-flex transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
          aria-hidden
        >
          <Icon name={current.icon} />
        </span>
        <span
          className="text-[0.9rem] tracking-wide text-white transition-opacity duration-300"
          style={{ opacity: visible ? 1 : 0 }}
          role="status"
          aria-live="polite"
        >
          {current.text}
        </span>
      </div>
    </div>
  );
}

type IconName = 'truck' | 'globe' | 'hand' | 'shirt' | 'return';

// Lucide icons via react-icons. Kept behind the `IconName` indirection
// so the message list stays declarative and we can swap the icon set
// (Phosphor, Heroicons, etc.) in one place later.
const ICONS: Record<IconName, IconType> = {
  truck: LuTruck,
  globe: LuGlobe,
  hand: LuHand,
  shirt: LuShirt,
  return: LuRotateCcw,
};

function Icon({ name }: { name: IconName }) {
  const Cmp = ICONS[name];
  return <Cmp size={18} strokeWidth={1.8} aria-hidden />;
}
