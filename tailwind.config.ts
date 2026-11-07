import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // ── Brand palette (official kit, 2026-06-15) ───────────────────
        // Tokens keep their existing names so every `bg-ink`,
        // `text-maroon`, `bg-ivory`, etc. across the codebase picks
        // up the new brand colours without any per-component edits.
        ivory: '#FDF6EC',        // Light cream — primary page background
        parchment: '#FDF6EC',    // Alias for ivory (kept for back-compat)
        bone: '#F9F9F9',         // Off-white — alt surface (cards on cream)
        ink: '#000000',          // Black — body text / icons on light
        ash: '#5D3E14',          // Espresso brown — rare accent
        whisper: '#6E5B4F',      // Quiet mid-tone, kept

        // Brand maroon scale — flipped from crimson to cream per brand
        // update. All three tokens aliased to the same value so the
        // former red-on-maroon-deep contrasts collapse into a flat cream.
        maroon: {
          DEFAULT: '#012d20',
          deep: '#042509',
          soft: '#05380d',
        },

        // Gold / bronze scale (warm accent)
        gold: {
          DEFAULT: '#E0AE6D',    // Tan
          deep: '#A66D23',       // Bronze
          soft: '#F2C99E',       // Lighter tan (derived for soft chips)
        },

        // Scarlet — nav hover accent. Reserved for the top nav row
        // (link hover + utility icon hover) so the pointer-feedback
        // reads as a distinct attention colour against the maroon
        // brand primary used for active state and CTAs.
        scarlet: '#a01804',

        // ── System / semantic (NOT in brand kit) ───────────────────────
        // Kept so success states remain visually distinct from the
        // brand maroon used by errors / cancellations. If the brand
        // ever adds a success colour, update these to match.
        peacock: '#1F5E3B',      // Deep emerald — success ("Order placed", "Authorised")
        indigo: '#1E1B3A',       // Cool dark accent — legacy, used by intro illustrations
      },
      fontFamily: {
        // Brand typography:
        //   display / serif → Italiana (Google Fonts)
        //   sans            → Raleway (Google Fonts)
        // `var(--font-display)` is the next/font variable registered in
        // app/layout.tsx; the quoted family name is a hard fallback if
        // the Next font pipeline hasn't loaded yet.
        display: ['var(--font-display)', '"Italiana"', 'Georgia', 'serif'],
        serif: ['var(--font-display)', '"Italiana"', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        widest: '0.3em',
        tightest: '-0.04em',
      },
      animation: {
        'shimmer': 'shimmer 8s ease-in-out infinite',
        'float': 'float 12s ease-in-out infinite',
        'fade-up': 'fadeUp 1.2s ease-out forwards',
        // Navbar icon micro-interactions
        'icon-bounce': 'iconBounce 0.55s cubic-bezier(.36,.07,.19,.97) both',
        'icon-heartbeat': 'iconHeartbeat 0.7s cubic-bezier(.4,0,.2,1) both',
        'badge-pop': 'badgePop 0.45s cubic-bezier(.34,1.56,.64,1) both',
        'menu-in': 'menuIn 0.18s cubic-bezier(.16,1,.3,1) both',
      },
      keyframes: {
        shimmer: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        // Bag — quick lift + tilt + settle. Reads as the bag being
        // tossed open when an item lands in it.
        iconBounce: {
          '0%':   { transform: 'translateY(0) rotate(0)' },
          '20%':  { transform: 'translateY(-4px) rotate(-8deg)' },
          '45%':  { transform: 'translateY(-2px) rotate(6deg)' },
          '70%':  { transform: 'translateY(-1px) rotate(-3deg)' },
          '100%': { transform: 'translateY(0) rotate(0)' },
        },
        // Heart — two soft beats. Used when an item is added to wishlist.
        iconHeartbeat: {
          '0%':   { transform: 'scale(1)' },
          '15%':  { transform: 'scale(1.22)' },
          '30%':  { transform: 'scale(1)' },
          '45%':  { transform: 'scale(1.16)' },
          '60%':  { transform: 'scale(1)' },
          '100%': { transform: 'scale(1)' },
        },
        // Badge — a confident overshoot when the count changes.
        badgePop: {
          '0%':   { transform: 'scale(0.4)', opacity: '0' },
          '60%':  { transform: 'scale(1.25)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        // Account dropdown — fade + soft drop from the trigger origin.
        menuIn: {
          '0%':   { opacity: '0', transform: 'translateY(-4px) scale(0.96)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
