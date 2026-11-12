/**
 * VisionMission — dark wine panel sitting between the lighter About
 * sections. Splits the single paragraph from the original brand kit
 * into two statements (Vision + Mission) so each gets its own weight
 * on the page, with metallic-gold numerals and eyebrows for structure.
 *
 * Kept on `bg-maroon-deep` on purpose — the dark break is the pacing
 * moment of the About page between the cream editorial sections above
 * and the atlas-style weave list below.
 */

const pillars: { numeral: string; eyebrow: string; title: string; body: string }[] = [
  {
    numeral: 'I',
    eyebrow: 'Our Vision',
    title: 'Heritage, preserved',
    body: 'To become a celebrated saree house that preserves the richness of Indian heritage while inspiring women to embrace elegance, culture, and confidence.',
  },
  {
    numeral: 'II',
    eyebrow: 'Our Mission',
    title: 'Craft, delivered',
    body: 'To offer premium sarees that blend timeless craftsmanship with modern sophistication — exquisite designs, exceptional quality and deep respect for the artisan behind every weave.',
  },
];

const GOLD_GRADIENT =
  'linear-gradient(135deg, #8A5A1F 0%, #C8923F 25%, #F2C99E 50%, #C8923F 75%, #8A5A1F 100%)';

export default function VisionMission() {
  return (
    <section className="relative bg-maroon-deep text-ivory overflow-hidden">
      <div className="relative max-w-[1720px] mx-auto px-6 lg:px-10 py-20 md:py-24 lg:py-28">
        {/* Section eyebrow + heading, centred. Replaces the earlier
            left-aligned single heading so the split columns below read
            as "pillars" of a shared idea. */}
        <div className="text-center max-w-2xl mx-auto mb-12 md:mb-16">
          <div className="inline-flex items-center gap-3 text-[0.65rem] md:text-[0.72rem] tracking-[0.32em] uppercase font-bold text-gold-soft">
            <span aria-hidden className="block h-px w-8 bg-gold/60" />
            The House Compass
            <span aria-hidden className="block h-px w-8 bg-gold/60" />
          </div>
          <h2
            className="mt-5 text-[2.25rem] md:text-[2.75rem] lg:text-[3.25rem] leading-[1.05]"
            style={{
              fontFamily: 'var(--font-hero), "Italiana", Georgia, serif',
              fontWeight: 500,
              backgroundImage: GOLD_GRADIENT,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
            }}
          >
            Vision &amp; Mission
          </h2>
        </div>

        {/* Two pillars side by side on md+, stacked on mobile. Centre
            vertical hairline divider only appears on the desktop
            layout. */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-0 md:divide-x md:divide-ivory/15 max-w-[1100px] mx-auto">
          {pillars.map((p) => (
            <div
              key={p.eyebrow}
              className="md:px-10 lg:px-14 text-center md:text-left"
            >
              <div
                aria-hidden
                className="text-5xl md:text-6xl leading-none mb-5"
                style={{
                  fontFamily: 'var(--font-hero), "Italiana", Georgia, serif',
                  fontWeight: 400,
                  backgroundImage: GOLD_GRADIENT,
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                {p.numeral}
              </div>
              <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.3em] uppercase font-bold text-gold-soft">
                {p.eyebrow}
              </div>
              <h3 className="mt-3 font-display text-2xl md:text-[1.75rem] lg:text-3xl font-semibold text-ivory leading-tight">
                {p.title}
              </h3>
              <span
                aria-hidden
                className="block mx-auto md:mx-0 h-px w-10 bg-gold/70 my-5"
              />
              <p className="text-[0.95rem] md:text-base leading-[1.85] text-ivory/85 font-normal">
                {p.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
