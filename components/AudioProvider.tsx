'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

type AudioContextValue = {
  /** Welcome gate has finished — the story is now exposed. */
  unlocked: boolean;
  muted: boolean;
  /** Attempt autoplay with a graceful fade-in; sets up first-gesture fallback if blocked. */
  startAudio: () => void;
  /** Called by AudioGate when its exit animation finishes. */
  markEntered: () => void;
  /** Toggle mute / restart audio if it was blocked. */
  toggle: () => void;
  setVolume: (v: number) => void;
};

const AudioCtx = createContext<AudioContextValue | null>(null);

const AUDIO_SRC = '/audio/raag-ambient.mp3';
const TARGET_VOLUME = 0.35;

export default function AudioProvider({ children }: { children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackArmedRef = useRef(false);
  const [unlocked, setUnlocked] = useState(false);
  // Start muted. The ambient raag no longer auto-plays — it waits for
  // the user to tap the speaker button in the nav (or the floating one).
  // Keeping `muted: true` initially means the icon reflects reality
  // (no sound) from the first paint, and the first click flips it to
  // playing+unmuted in one step via `toggle()`.
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const el = new Audio(AUDIO_SRC);
    el.loop = true;
    el.preload = 'auto';
    el.volume = 0.0;
    audioRef.current = el;

    const onError = () => {
      // Silent degrade — feature is optional.
    };
    el.addEventListener('error', onError);

    return () => {
      el.removeEventListener('error', onError);
      el.pause();
      audioRef.current = null;
    };
  }, []);

  const fadeTo = useCallback((target: number, ms = 1600) => {
    const el = audioRef.current;
    if (!el) return;
    const start = el.volume;
    const startedAt = performance.now();
    const step = (t: number) => {
      const cur = audioRef.current;
      if (!cur) return;
      const p = Math.min(1, (t - startedAt) / ms);
      cur.volume = start + (target - start) * p;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, []);

  const armFirstGestureFallback = useCallback(() => {
    if (fallbackArmedRef.current) return;
    fallbackArmedRef.current = true;
    const tryPlay = () => {
      const el = audioRef.current;
      if (!el) return;
      el.play()
        .then(() => {
          fadeTo(TARGET_VOLUME, 1400);
          setMuted(false);
        })
        .catch(() => {
          // Still blocked — leave it.
        });
      window.removeEventListener('pointerdown', tryPlay);
      window.removeEventListener('keydown', tryPlay);
      window.removeEventListener('touchstart', tryPlay);
    };
    window.addEventListener('pointerdown', tryPlay, { once: true });
    window.addEventListener('keydown', tryPlay, { once: true });
    window.addEventListener('touchstart', tryPlay, { once: true });
  }, [fadeTo]);

  const startAudio = useCallback(() => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = 0;
    el.play()
      .then(() => {
        fadeTo(TARGET_VOLUME, 2400);
        setMuted(false);
      })
      .catch(() => {
        // Autoplay blocked — start on the user's first interaction instead.
        armFirstGestureFallback();
      });
  }, [armFirstGestureFallback, fadeTo]);

  const markEntered = useCallback(() => {
    setUnlocked(true);
  }, []);

  const toggle = useCallback(() => {
    // Flip muted first so the icon always toggles on every click,
    // regardless of whether the audio file resolves. The playback call
    // is best-effort: if the mp3 is missing / autoplay-blocked / errors
    // out, the UI still reflects the user's intent correctly.
    const nextMuted = !muted;
    setMuted(nextMuted);
    const el = audioRef.current;
    if (!el) return;
    if (nextMuted) {
      fadeTo(0, 500);
      window.setTimeout(() => {
        const cur = audioRef.current;
        if (cur) cur.pause();
      }, 550);
    } else {
      el.play()
        .then(() => fadeTo(TARGET_VOLUME, 700))
        .catch(() => {
          // Playback failed — fine, icon already shows unmuted intent.
        });
    }
  }, [fadeTo, muted]);

  const setVolume = useCallback((v: number) => {
    const el = audioRef.current;
    if (!el) return;
    el.volume = Math.min(1, Math.max(0, v));
  }, []);

  const value = useMemo(
    () => ({ unlocked, muted, startAudio, markEntered, toggle, setVolume }),
    [unlocked, muted, startAudio, markEntered, toggle, setVolume],
  );

  return <AudioCtx.Provider value={value}>{children}</AudioCtx.Provider>;
}

export function useAudio() {
  const ctx = useContext(AudioCtx);
  if (!ctx) throw new Error('useAudio must be used inside AudioProvider');
  return ctx;
}
