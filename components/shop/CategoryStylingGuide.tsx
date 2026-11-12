'use client';

/**
 * CategoryStylingGuide — editorial styling notes scoped to a specific
 * weave (Kanjeevaram, Banarasi, …). Lives only on the weave category
 * pages, so the content can be opinionated about that specific drape.
 *
 * Replaces the generic ExpertTips grid of grey cards with a left-rail
 * editorial header + a horizontal row of numbered notes carrying a
 * hairline maroon divider between each. No boxes, no icons — reads as
 * a style column from the house.
 */

type Tip = { title: string; body: string };

// Four weave-aware styling notes. The {weave} token is interpolated
// into each copy block at render time; no per-weave data table needed
// because the guidance generalises cleanly across silks + cottons.
const TIP_TEMPLATES: Tip[] = [
  {
    title: 'Blouse Pairing',
    body:
      'Pick up the darkest thread in the {weave} border for the blouse ground — the pallu reads richer when the shoulders echo its edge.',
  },
  {
    title: 'Jewellery',
    body:
      'Temple gold for weddings, uncut polki for receptions, a single kundan jhumka for an everyday {weave}. Let the zari do the talking.',
  },
  {
    title: 'The Drape',
    body:
      '{weave} sits best in the classic Nivi drape — seven even pleats, a knife-pleat pallu, and a petticoat stiff enough to hold the border straight.',
  },
  {
    title: 'When to Wear',
    body:
      'A {weave} is at home at weddings, poojas and festive evenings. For brunch or office, dress it down with a half-sleeve blouse and minimal gold.',
  },
];

export default function CategoryStylingGuide({ weave }: { weave: string }) {
  const tips = TIP_TEMPLATES.map((t) => ({
    ...t,
    body: t.body.replaceAll('{weave}', weave),
  }));

  return (
    <section className="bg-ivory border-t border-maroon-deep/10">
      <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
        {/* Section header — centred, Italiana display face with a gold
            hairline rule beneath the eyebrow. Mirrors the quiet
            editorial voice of the home page rails. */}
        <div className="text-center max-w-2xl mx-auto mb-10 lg:mb-14">
          <div className="inline-flex items-center gap-3 text-gold-deep mb-4">
            <span className="block h-px w-10 bg-gold-deep/60" aria-hidden />
            <span className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold">
              Styling Notes
            </span>
            <span className="block h-px w-10 bg-gold-deep/60" aria-hidden />
          </div>
          <h2
            className="text-[1.9rem] md:text-[2.4rem] lg:text-[2.75rem] leading-[1.05] text-ink"
            style={{
              fontFamily: 'var(--font-hero), "Italiana", Georgia, serif',
              fontWeight: 600,
            }}
          >
            Wearing your {weave}
          </h2>
          <p className="mt-3 text-sm md:text-base text-ink/65 leading-relaxed">
            Four quick notes from the atelier — how to pair, pleat and place
            a {weave} so it carries as beautifully as it was woven.
          </p>
        </div>

        {/* Numbered notes — four columns on desktop, stacked on mobile.
            Each column is separated by a gold hairline on the left, so
            the row reads as a single editorial spread instead of four
            disconnected cards. */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
          {tips.map((t, i) => (
            <article
              key={t.title}
              className={`relative px-6 lg:px-8 py-6 lg:py-4 ${
                i > 0 ? 'md:border-l md:border-maroon-deep/10' : ''
              }`}
            >
              <div className="flex items-baseline gap-3 mb-3">
                <span
                  className="font-sans text-xl md:text-2xl font-bold tabular-nums text-maroon-deep/30"
                  aria-hidden
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="text-base md:text-lg font-bold text-ink tracking-tight">
                  {t.title}
                </h3>
              </div>
              <p className="text-sm text-ink/70 leading-relaxed">
                {t.body}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
