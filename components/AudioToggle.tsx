'use client';

import { useAudio } from '@/components/AudioProvider';
import clsx from 'clsx';

export default function AudioToggle() {
  const { unlocked, muted, toggle } = useAudio();

  // Don't show the floating toggle until the user has passed the splash gate.
  if (!unlocked) return null;

  return (
    <button
      onClick={toggle}
      aria-label={muted ? 'Unmute ambient raag' : 'Mute ambient raag'}
      className="fixed bottom-6 right-6 z-50 group flex items-center justify-center w-12 h-12 bg-ink/85 backdrop-blur-md text-ivory border border-gold/40 rounded-full hover:border-gold transition-all"
    >
      <svg
        viewBox="0 0 28 28"
        className="w-6 h-6 text-gold-soft overflow-visible"
        aria-hidden="true"
      >
        {/* Speaker body: base + angled cone */}
        <path
          d="M3 10.5 H7 L12.5 6 V22 L7 17.5 H3 Z"
          fill="currentColor"
          fillOpacity="0.18"
          stroke="currentColor"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {/* Animated wave bars nested inside the sound region of the volume icon */}
        {[0, 1, 2, 3].map((i) => {
          const x = 15 + i * 2.4;
          const maxHeight = 11 - i * 0.6;
          return (
            <rect
              key={i}
              x={x}
              y={14 - maxHeight / 2}
              width="1.6"
              height={muted ? 1.4 : maxHeight}
              rx="0.8"
              fill="currentColor"
              className={clsx(
                'audio-bar',
                muted ? 'audio-bar--muted' : 'audio-bar--on',
              )}
              style={{
                transformOrigin: `${x + 0.8}px 14px`,
                animationDelay: `${i * 140}ms`,
              }}
            />
          );
        })}

        {/* Mute slash — shown only when muted */}
        {muted && (
          <line
            x1="4"
            y1="4"
            x2="24"
            y2="24"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        )}
      </svg>
    </button>
  );
}
