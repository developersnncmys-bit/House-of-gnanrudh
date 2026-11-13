import Link from 'next/link';

// Shared chrome for /privacy, /terms and any future legal page.
// Matches the /shipping, /returns, /care look: white body with a light
// gray header strip (breadcrumb + title + last-updated). Two-column
// layout below on desktop — sticky table of contents on the left,
// long-form sections on the right.

export type LegalSection = {
  id: string;   // anchor / TOC slug
  title: string;
  body: React.ReactNode;
};

export default function LegalShell({
  title,
  lastUpdated,
  intro,
  sections,
}: {
  title: string;
  lastUpdated: string;
  intro: React.ReactNode;
  sections: LegalSection[];
}) {
  return (
    <main className="bg-white text-ink min-h-screen">
      {/* Editorial header — bone band with centred eyebrow, display
          title, gold hairline, and last-updated chip. Mirrors the
          Kalki-style redesign of <PolicyHeader>. */}
      <header className="border-b border-ink/10 bg-bone">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 pt-16 pb-12 md:pt-20 md:pb-14 text-center">
          <nav
            aria-label="Breadcrumb"
            className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon"
          >
            <Link href="/" className="hover:text-maroon-deep">Home</Link>
            <span className="mx-1.5 text-ink/30">/</span>
            <span className="text-ink/70">{title}</span>
          </nav>
          <h1 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-ink leading-tight">
            {title}
          </h1>
          <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-5" />
          <p className="mt-4 text-[0.72rem] tracking-[0.2em] uppercase font-semibold text-ink/55">
            Last updated · {lastUpdated}
          </p>
        </div>
      </header>

      <section className="max-w-[1100px] mx-auto px-6 lg:px-10 py-12 md:py-16">
        {intro && (
          <div className="text-sm md:text-base text-ink/75 leading-relaxed max-w-[68ch] mb-10">
            {intro}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-10 md:gap-14">
          {/* TOC */}
          <aside className="hidden md:block">
            <div className="sticky top-[200px]">
              <div className="text-[0.7rem] font-bold text-ink/55 mb-4 uppercase tracking-[0.2em]">
                On this page
              </div>
              <ul className="space-y-2 border-l border-ink/15 pl-4">
                {sections.map((s) => (
                  <li key={s.id}>
                    <a
                      href={`#${s.id}`}
                      className="text-sm text-ink/70 hover:text-maroon-deep transition-colors"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Body */}
          <article className="max-w-[68ch]">
            {sections.map((s, i) => (
              <section
                key={s.id}
                id={s.id}
                className={i > 0 ? 'mt-10 pt-10 border-t border-ink/10' : ''}
              >
                <h2 className="text-lg md:text-xl font-bold text-ink mb-4 scroll-mt-[200px]">
                  {s.title}
                </h2>
                <div className="text-sm text-ink/80 leading-relaxed space-y-3">
                  {s.body}
                </div>
              </section>
            ))}

            <div className="mt-12 pt-6 border-t border-ink/10 text-xs text-ink/60 leading-relaxed">
              Questions? Email{' '}
              <a
                href="mailto:hello@houseofgnanrudh.com"
                className="underline underline-offset-2 text-ink hover:text-maroon-deep font-semibold"
              >
                hello@houseofgnanrudh.com
              </a>{' '}
              or call{' '}
              <a
                href="tel:+919876543210"
                className="underline underline-offset-2 text-ink hover:text-maroon-deep font-semibold tabular-nums"
              >
                +91 98765 43210
              </a>{' '}
              (Monday – Saturday · 10:00 AM – 9:00 PM · Sunday · 11:00 AM – 8:00 PM (IST)).
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
