import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/components/home/SectionHeader';
import VisionMission from '@/components/about/VisionMission';
import AnimatedStats from '@/components/about/AnimatedStats';
import { navHref } from '@/lib/soft-launch';

export const metadata: Metadata = {
  title: 'About Us · House Of GnanRudh',
  description:
    'House Of GnanRudh is a family-run saree house from Nellore, Andhra Pradesh — curating handloom silks and cottons from the looms of Kanchipuram, Varanasi, Pochampally and Dhaka, delivered worldwide.',
};

const founders: { name: string; role: string; quote: string }[] = [
  {
    name: 'Founder Name',
    role: 'Founder',
    quote:
      'A saree, well chosen, is a quiet act of love — for the hands that wove it and the woman who wears it.',
  },
  {
    name: 'Co-Founder Name',
    role: 'Co-Founder',
    quote:
      "We don't sell sarees. We help you find the one already waiting for you.",
  },
];

// Six handloom traditions we source from, matching the "6 Weaving
// Traditions" line in the stats block. All six have artwork in
// /public/Byweaves — Jamdani is mentioned in the Who We Are body
// since no tile artwork exists for it yet.
const weaves: { name: string; place: string; era: string; image: string }[] = [
  { name: 'Kanchipuram Silk', place: 'Kanchipuram · Tamil Nadu', era: 'since the Chola dynasty', image: '/Byweaves/kanjeevaram.webp' },
  { name: 'Banarasi', place: 'Varanasi · Uttar Pradesh', era: 'since the Mughal court', image: '/Byweaves/banarasi.webp' },
  { name: 'Pochampally', place: 'Bhoodan Pochampally · Telangana', era: 'a UNESCO-listed handloom', image: '/Byweaves/Pochampally.webp' },
  { name: 'Mysore Silk', place: 'Mysuru · Karnataka', era: 'since Tipu Sultan, 1780', image: '/Byweaves/Mysore%20silk.webp' },
  { name: 'Gadwal', place: 'Jogulamba Gadwal · Telangana', era: 'since the Krishnadevaraya court', image: '/Byweaves/Gadwal.webp' },
  { name: 'Mangalagiri', place: 'Mangalagiri · Andhra Pradesh', era: 'since the 15th century', image: '/Byweaves/mangalagiri.webp' },
];

// Headline numbers. Mirrors the reference site's stats row —
// "2,000+ Designs in Store · 6 Weaving Traditions · 100% Authentic
// Handloom" — reframed to read for an online storefront.
const stats: { value: string; label: string }[] = [
  { value: '2,000+', label: 'Designs in Store' },
  { value: '6', label: 'Weaving Traditions' },
  { value: '100%', label: 'Authentic Handloom' },
];

// Promises — reframed from the earlier atelier-centric list for an
// ecommerce storefront. Every rule is about what we do for the drape
// that arrives at the customer's door.
const values: { title: string; body: string }[] = [
  {
    title: 'Handpicked at the loom',
    body: 'We travel to Kanchipuram, Varanasi, Pochampally and Dhaka and choose every saree ourselves — no distributor, no middleman, no catalogue ordering.',
  },
  {
    title: 'Honestly priced',
    body: 'The zari grade and the exact thread weight of every saree are printed on the product page. What we pay the loom is reflected in what we charge you.',
  },
  {
    title: 'Shipped with care',
    body: 'Each order is inspected, folded in muslin, boxed in acid-free tissue and dispatched with insured, tracked, signature-on-delivery shipping — worldwide from India.',
  },
  {
    title: 'Cared for, for life',
    body: 'A House Of GnanRudh saree can be returned for pico, fall, blouse stitching or pallu restoration at cost — for the lifetime of the drape.',
  },
];

const timeline: { year: string; title: string; body: string }[] = [
  {
    year: '2025',
    title: 'The idea takes shape',
    body: 'The idea for House Of GnanRudh is born. The founding team begins researching India’s classical weaving traditions, visiting master weavers in Kanchipuram, Varanasi, Pochampally and Dhaka, and laying the groundwork for a saree house rooted in authenticity.',
  },
  {
    year: '2026',
    title: 'The house opens online',
    body: 'House Of GnanRudh goes live — bringing together hand-woven heirloom weaves under a single label and shipping them, insured and tracked, to drape-lovers across India and abroad.',
  },
];

export default function AboutPage() {
  const shopHref = navHref('/shop');
  return (
    <main className="bg-ivory text-ink">
      {/* Hero — mirrors components/home/Hero.tsx: full-bleed photo,
          metallic gold italic script headline, eyebrow + supporting copy.
          Headline taken verbatim from the brand's own site. */}
      <section className="relative w-full h-[calc(70vh-10px)] min-h-[420px] md:min-h-[520px] max-h-[740px] bg-[#1B0E0A] overflow-hidden">
        <Image
          src="/homebanner/banner5.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '50% 30%' }}
        />
        <div className="relative h-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-14 flex items-center justify-end">
          <div className="max-w-sm md:max-w-[min(32rem,42vw)] text-ivory">
            <span className="inline-block px-2.5 py-1 text-[0.6rem] font-bold uppercase tracking-wider rounded-sm mb-4 bg-gold text-ink">
              Our Story
            </span>
            <div className="text-[0.65rem] md:text-xs font-medium text-ivory/65 mb-2 uppercase tracking-[0.2em]">
              Nellore · Andhra Pradesh
            </div>
            <h1
              className="text-3xl md:text-4xl lg:text-5xl font-semibold leading-[1.05] mb-4"
              style={{
                fontFamily:
                  'var(--font-hero), "Italiana", Georgia, serif',
                backgroundImage:
                  'linear-gradient(135deg, #8A5A1F 0%, #C8923F 20%, #F2C99E 45%, #FFF2D6 50%, #F2C99E 55%, #C8923F 80%, #8A5A1F 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                filter:
                  'drop-shadow(0 2px 6px rgba(0,0,0,0.45)) drop-shadow(0 0 1px rgba(242,201,158,0.3))',
              }}
            >
              Woven with heritage, draped with love
            </h1>
            <p className="text-xs md:text-sm text-ivory/80 leading-relaxed">
              A family-run saree house from Nellore, Andhra Pradesh — curating
              handloom silks and cottons from the looms of India, delivered
              worldwide.
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are — editorial: centred intro, metallic-gold pull-quote,
          closing paragraph. Copy derived from the brand's own site with
          every physical-retail cue (walk-in, coffee, drape waiting)
          replaced with online-first language. */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
          <SectionHeader
            title="Who We Are"
            description="A family-run saree house curating handloom silks and cottons from across India, delivered to your door."
            showDividers={false}
          />

          <div className="max-w-[780px] mx-auto text-center">
            <p className="text-base md:text-[1.08rem] leading-[1.9] text-ink/80">
              House Of GnanRudh began with a simple belief: a saree is not
              bought, it is chosen. We travel to the weaving towns of
              Kanchipuram, Varanasi, Pochampally and Dhaka to bring home
              silks and cottons that feel as good as they look.
            </p>

            <div className="relative my-10 md:my-12">
              <span aria-hidden className="block mx-auto h-px w-16 bg-gold/70 mb-8" />
              <blockquote
                className="text-[2rem] md:text-[2.75rem] lg:text-[3rem] leading-[1.1]"
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
                &ldquo;Woven with heritage, draped with love.&rdquo;
              </blockquote>
              <span aria-hidden className="block mx-auto h-px w-16 bg-gold/70 mt-8" />
            </div>

            <p className="text-base md:text-[1.08rem] leading-[1.9] text-ink/80">
              Every piece is handpicked, authenticated and honestly priced
              — photographed in natural light, folded in muslin, and shipped
              with insured, tracked, signature-on-delivery dispatch from our
              Nellore studio to your door.
            </p>
          </div>
        </div>
      </section>

      {/* Stats — "2,000+ · 6 · 100%". Numerals count up from zero when
          the band scrolls into view (see AnimatedStats). Same white
          surface as the Who We Are section above so the two read as one
          continuous editorial moment. */}
      <section className="bg-white pb-12 md:pb-16">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10">
          <AnimatedStats stats={stats} />
        </div>
      </section>

      {/* Vision & Mission — dark wine panel, kept as-is. */}
      <VisionMission />

      {/* Founders' Note — a short italic metallic-gold quote per founder,
          attributed by name + role. No cards, no portrait placeholders —
          personality over product. */}
      <section className="bg-bone py-14 md:py-20">
        <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
          <SectionHeader
            title="Founders' Note"
            description="In their own words — the belief that shaped the house."
            showDividers={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-16 max-w-[1200px] mx-auto">
            {founders.map((f) => (
              <figure key={f.name} className="text-center">
                {/* Decorative opening mark — metallic gold, display face. */}
                <span
                  aria-hidden
                  className="block mx-auto leading-none text-5xl md:text-6xl mb-4"
                  style={{
                    fontFamily: 'var(--font-hero), "Italiana", Georgia, serif',
                    backgroundImage:
                      'linear-gradient(135deg, #8A5A1F 0%, #C8923F 50%, #8A5A1F 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  &ldquo;
                </span>

                <blockquote
                  className="text-xl md:text-2xl lg:text-[1.65rem] leading-[1.35] italic"
                  style={{
                    fontFamily: 'var(--font-hero), "Italiana", Georgia, serif',
                    fontWeight: 600,
                    backgroundImage:
                      'linear-gradient(135deg, #5A3610 0%, #8A5A1F 25%, #B07A2A 50%, #8A5A1F 75%, #5A3610 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  {f.quote}
                </blockquote>

                <span aria-hidden className="block mx-auto h-px w-10 bg-gold/60 mt-7 mb-5" />

                <figcaption>
                  <div className="font-display text-base md:text-lg font-semibold text-ink">
                    {f.name}
                  </div>
                  <div className="mt-1 text-[0.65rem] md:text-[0.7rem] tracking-[0.3em] uppercase text-maroon font-semibold">
                    {f.role}
                  </div>
                </figcaption>
              </figure>
            ))}
          </div>

          <p className="mt-10 text-center text-[0.7rem] text-ink/50 italic">
            Founder notes to follow.
          </p>
        </div>
      </section>

      {/* Six Weaves — editorial numbered list. Each row carries a big
          display numeral, the weave name + region, and a circular
          thumbnail on the right. Hairline dividers between rows read as
          an atlas index rather than a product grid. Jamdani (Dhaka) is
          called out in the Who We Are copy above. */}
      <section className="bg-ivory py-12 md:py-16">
        <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
          <SectionHeader
            title="Six Weaving Traditions"
            description="Each tradition has its own loom, its own thread count, its own grammar. We work with master families in every one of the regions below — plus the Jamdani weavers of Dhaka."
            showDividers={false}
          />

          <ol className="max-w-[900px] mx-auto divide-y divide-maroon/10 border-y border-maroon/10">
            {weaves.map((w, i) => {
              const href = navHref(`/shop?weave=${encodeURIComponent(w.name)}`);
              const inner = (
                <>
                  <div
                    className="font-display text-2xl md:text-4xl font-semibold text-maroon/80 tabular-nums leading-none shrink-0 w-10 md:w-16"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-display text-lg md:text-2xl font-semibold text-ink leading-tight">
                      {w.name}
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-ink/65">
                      {w.place}
                    </div>
                    <div className="mt-0.5 text-[0.7rem] md:text-xs italic text-ink/50">
                      {w.era}
                    </div>
                  </div>
                  <div className="relative shrink-0 w-14 h-14 md:w-20 md:h-20 rounded-full overflow-hidden bg-bone ring-1 ring-maroon/10">
                    <Image
                      src={w.image}
                      alt=""
                      fill
                      sizes="(max-width: 768px) 56px, 80px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                </>
              );
              const rowCls =
                'group flex items-center gap-5 md:gap-7 py-5 md:py-6';
              return href ? (
                <li key={w.name}>
                  <Link href={href} className={`${rowCls} hover:bg-white/60 -mx-4 px-4 transition-colors`}>
                    {inner}
                  </Link>
                </li>
              ) : (
                <li key={w.name} className={`${rowCls} cursor-default`}>
                  {inner}
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* What we promise — four rules of the house, reframed for the
          storefront. */}
      <section className="bg-bone py-12 md:py-16">
        <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
          <SectionHeader
            title="What We Stand For"
            description="Four rules of the house — what makes it onto the site, and what does not."
            showDividers={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 max-w-[1100px] mx-auto">
            {values.map((v, i) => (
              <div
                key={v.title}
                className="bg-white p-6 lg:p-7 rounded-sm shadow-[0_1px_0_rgba(77,0,21,0.06)]"
              >
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="font-display text-2xl font-semibold text-maroon tabular-nums">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="font-display text-base md:text-lg font-semibold text-ink">
                    {v.title}
                  </h3>
                </div>
                <p className="text-sm text-ink/75 leading-[1.8]">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey — chapter spread. With only two milestones the
          earlier vertical spine felt underused; this reads as two
          "chapters of the house" instead. Big metallic-gold year
          numerals anchor each column, with a chapter eyebrow, title and
          body below. Divided by a thin gold hairline on desktop. */}
      <section className="bg-ivory py-14 md:py-20">
        <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
          <SectionHeader
            title="Our Journey"
            description="Two chapters so far — the moments that built the house."
            showDividers={false}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-0 md:divide-x md:divide-maroon/15 max-w-[1100px] mx-auto">
            {timeline.map((t, i) => (
              <article
                key={t.year}
                className="md:px-10 lg:px-14 text-center md:text-left"
              >
                <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.3em] uppercase font-bold text-maroon">
                  Chapter {['I', 'II', 'III', 'IV'][i]}
                </div>
                <div
                  className="mt-3 text-[3.5rem] md:text-[4.5rem] lg:text-[5rem] leading-none tabular-nums"
                  style={{
                    fontFamily:
                      'var(--font-hero), "Italiana", Georgia, serif',
                    fontWeight: 700,
                    backgroundImage:
                      'linear-gradient(135deg, #5A3610 0%, #8A5A1F 25%, #B07A2A 50%, #8A5A1F 75%, #5A3610 100%)',
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  {t.year}
                </div>
                <span
                  aria-hidden
                  className="block mx-auto md:mx-0 h-px w-12 bg-gold/70 my-5 md:my-6"
                />
                <h3 className="font-display text-xl md:text-2xl lg:text-[1.65rem] font-semibold text-ink leading-tight">
                  {t.title}
                </h3>
                <p className="mt-4 text-sm md:text-base text-ink/75 leading-[1.85]">
                  {t.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA — straight to the shop. No physical-retail cue. */}
      <section className="bg-bone py-14 md:py-20">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-ink leading-tight">
            Begin with a single drape
          </h2>
          <p className="mt-4 text-sm md:text-base text-ink/70 leading-relaxed">
            Explore the weaves we've chosen this season — handpicked at the
            loom, delivered to your door.
          </p>
          <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
            {shopHref ? (
              <Link
                href={shopHref}
                className="inline-flex items-center bg-maroon-deep hover:bg-maroon text-ivory px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-sm transition-colors"
              >
                Shop the House
              </Link>
            ) : (
              <span className="inline-flex items-center bg-maroon-deep text-ivory px-7 py-3 text-xs font-bold uppercase tracking-[0.2em] rounded-sm cursor-default">
                Shop the House
              </span>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
