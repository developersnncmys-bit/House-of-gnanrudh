'use client';

/**
 * CategoryTrustBand — brand-aligned reassurance strip for the weave
 * category pages. Same three promises as the generic TrustBanner
 * (hand-crafted, premium quality, free shipping) but restyled to sit
 * inside the weave page's editorial surface: ivory ground, circular
 * gold-outline icons, Italiana-adjacent heading weight, hairline
 * maroon dividers between cells.
 *
 * Kept separate from TrustBanner so the plain grey version can keep
 * showing inside the original ShopView grid without regressing.
 */

type Cell = { title: string; body: string; icon: React.ReactNode };

export default function CategoryTrustBand() {
  const cells: Cell[] = [
    {
      title: 'Handcrafted',
      body: 'Hand-woven by master weavers on traditional looms.',
      icon: <HandIcon />,
    },
    {
      title: 'Premium Quality',
      body: 'Pure silk, real silver-gold zari, tested at the loom.',
      icon: <DiamondIcon />,
    },
    {
      title: 'Free Shipping',
      body: 'Insured delivery across India on every order.',
      icon: <TruckIcon />,
    },
  ];

  return (
    <section className="bg-bone border-y border-ink/10">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 md:py-7">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
          {cells.map((c) => (
            <article
              key={c.title}
              className="flex items-center justify-center gap-4 px-6 py-4 md:py-2"
            >
              <span className="text-gold-deep shrink-0">{c.icon}</span>
              <div className="min-w-0">
                <h3 className="text-[0.78rem] font-bold tracking-[0.14em] uppercase text-ink leading-none">
                  {c.title}
                </h3>
                <p className="text-xs text-ink/60 leading-snug mt-1.5">
                  {c.body}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function HandIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 11V5a2 2 0 1 1 4 0v6" />
      <path d="M13 11V4a2 2 0 1 1 4 0v9" />
      <path d="M17 13V7a2 2 0 1 1 4 0v9a6 6 0 0 1-6 6h-3a8 8 0 0 1-8-8v-2a2 2 0 1 1 4 0v2" />
    </svg>
  );
}

function DiamondIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 3h12l4 6-10 12L2 9l4-6Z" />
      <path d="M2 9h20" />
      <path d="m10 9 2 4 2-4" />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M3 7h11v9H3z" />
      <path d="M14 11h4l3 3v2h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17.5" cy="18" r="1.6" />
    </svg>
  );
}
