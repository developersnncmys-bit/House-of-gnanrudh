import type { Metadata, Viewport } from 'next';
import { Italiana, Raleway } from 'next/font/google';
import SmoothScroll from '@/components/SmoothScroll';
import AudioProvider from '@/components/AudioProvider';
import SiteShell from '@/components/SiteShell';
import Toaster from '@/components/shop/Toaster';
import { ShopProvider } from '@/lib/shop-store';
import { AuthProvider } from '@/lib/auth';
import './globals.css';

// ── Brand typography ─────────────────────────────────────────────────────
//
// Italiana — primary display / headline face. Tall, thin editorial
// serif with couture-poster proportions; used for every section
// heading and hero title across the site. Single-weight (400) — any
// font-semibold / font-bold applied to headings falls back to the
// browser's synthesised weight, which still reads cleanly on Italiana.
const display = Italiana({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

// Raleway — secondary body / UI face. Elegant geometric sans with tall
// x-height and refined thin-to-bold range; pairs cleanly with Black
// Mango's display serif. Ships every weight, so the full 300–700 ramp
// is loaded to honour existing font-medium / font-semibold utilities.
const sans = Raleway({
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

// Italiana (second binding) — reused as the home banner headline face
// so the Hero, Explore Collections and Bridal Edit titles all share
// one couture-serif voice. Separate `--font-hero` variable so banner
// headings can still be theme-switched independently of `--font-display`.
const hero = Italiana({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-hero',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'House Of GnanRudh — Heirloom Sarees, Hand-Woven',
  description:
    'A house of heirloom silk sarees — Kanjeevaram, Banarasi, Mysore Silk, Mangalagiri, Pochampally, Gadwal, Patola, Fancy Sarees and Mixed Pattu drapes. Hand-woven, hand-finished, shipped worldwide.',
};

export const viewport: Viewport = {
  // `width` and `initialScale` are required for mobile responsiveness.
  // When `viewport` is exported, Next.js generates the <meta name="viewport">
  // tag from ONLY the properties listed here — omitting these falls back to
  // the browser's default 980px layout viewport, which renders the desktop
  // layout on phones and breaks every breakpoint.
  width: 'device-width',
  initialScale: 1,
  themeColor: '#FDF6EC',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${hero.variable}`}
    >
      <body className="bg-ivory text-ink">
        <ShopProvider>
          <AuthProvider>
            <AudioProvider>
              <SmoothScroll>
                <SiteShell>{children}</SiteShell>
              </SmoothScroll>
            </AudioProvider>
            <Toaster />
          </AuthProvider>
        </ShopProvider>
      </body>
    </html>
  );
}
