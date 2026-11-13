import Image from 'next/image';
import Link from 'next/link';
import { SAREES } from '@/lib/sarees';
import { navHref } from '@/lib/soft-launch';
import SectionHeader from '@/components/home/SectionHeader';

type Bucket = {
  label: string;
  sub: string;
  tagline: string;
  href: string;
  sampleId: string;
  image?: string;
};

// Four price-band tiles. Each card is a dark wooden frame around a
// model photograph with a small cream ornament + italic tagline
// overlaid at the bottom.
const buckets: Bucket[] = [
  {
    label: 'Everyday Drapes',
    sub: 'Under ₹5,000',
    tagline: 'Beauty That Feels as Good as It Looks.',
    href: '/shop?maxPrice=5000',
    sampleId: 'mangalagiri-tulsi',
  },
  {
    label: 'Light Festive',
    sub: 'Under ₹10,000',
    tagline: 'Experience the Royal Feel of Silk.',
    href: '/shop?maxPrice=10000',
    sampleId: 'banarasi-saanjh',
  },
  {
    label: 'Festive Picks',
    sub: 'Under ₹25,000',
    tagline: 'Where Heritage Meets Elegance.',
    href: '/shop?maxPrice=25000',
    sampleId: 'fancy-haldi',
    image: '/images/c5.webp',
  },
  {
    label: 'Bridal · Heirloom',
    sub: '₹25,000 & Above',
    tagline: 'Beautiful Weaves, Beautiful Heirlooms.',
    href: '/shop?minPrice=25000',
    sampleId: 'banarasi-raktarani',
  },
];

// Small cream decorative mark that sits at the bottom of each card,
// just above the tagline — a quiet bloom glyph so the frame reads as
// an altar doorway rather than a plain photo.
function ArchOrnament() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="w-5 h-5 text-ivory/90 mx-auto"
      fill="currentColor"
    >
      <path d="M12 2.5c.8 1.9 1 3.1.6 4.3 1.2-.5 2.4-.5 4.3.3-1.5.6-2.5 1.2-3 2.3 1.3.1 2.4.6 3.6 2.1-1.6-.1-2.9.1-3.8.9.9.8 1.5 1.9 1.6 3.6-1.3-1.1-2.5-1.7-3.6-1.6-.1 1.2-.6 2.4-2.1 3.6-.1-1.6-.5-2.7-1.4-3.6-.9.8-2 1.3-3.6 1.4.9-1.2 1.4-2.4 1.3-3.6-1.2-.1-2.3-.6-3.4-1.9 1.6-.1 2.7-.5 3.4-1.4-.8-.9-1.2-2-1.2-3.5 1.2 1.1 2.3 1.5 3.4 1.3-.2-1.1 0-2.2.6-3.2.7.9 1.3 2.1 1.9 3.3Z" />
      <circle cx="12" cy="12" r="1.3" />
    </svg>
  );
}

export default function ShopByPrice() {
  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
        <SectionHeader
          title="Shop by Price"
          description="From everyday cotton drapes to heirloom bridal silks — a curated price edit for every occasion and every budget."
          link={{ href: '/shop?sort=new', label: 'View All' }}
          showDividers={false}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-5 md:gap-6 pt-2">
          {buckets.map((b) => {
            const sample = SAREES.find((s) => s.id === b.sampleId);
            const bucketHref = navHref(b.href);
            const BucketTag = bucketHref ? Link : 'span';
            const bucketProps = bucketHref
              ? {
                  href: bucketHref,
                  className: 'group block text-center',
                }
              : {
                  className: 'group block text-center cursor-default',
                };
            return (
              <BucketTag
                key={b.label}
                {...(bucketProps as { href: string; className: string })}
              >
                {/* Rectangular wooden frame — deep mahogany gradient
                    around the saree photo with inner + outer shadow for
                    depth. Slight rounded corners keep it feeling premium. */}
                <div
                  className="relative aspect-[2/3] p-[6px] md:p-[8px] rounded-sm transition-transform duration-500 group-hover:-translate-y-1"
                  style={{
                    background:
                      'linear-gradient(145deg, #5a361f 0%, #2d1810 50%, #4a2918 100%)',
                    boxShadow:
                      'inset 0 -2px 10px rgba(0,0,0,0.35), 0 10px 24px rgba(42,22,16,0.25)',
                  }}
                >
                  {/* Inner photo — a hairline of dark wood stays visible
                      around the saree as the "matting". */}
                  <div className="relative w-full h-full overflow-hidden bg-bone rounded-sm">
                    {(b.image || sample) && (
                      <Image
                        src={b.image ?? sample!.image}
                        alt={sample?.name ?? b.label}
                        fill
                        sizes="(max-width: 768px) 46vw, 22vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    )}

                    {/* Dark gradient so the cream tagline reads against
                        any photo underneath. Stronger at the bottom
                        where the ornament + tagline sit. */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/10 to-transparent pointer-events-none" />

                    {/* Ornament + italic tagline — cream, centered at the
                        bottom of the card. */}
                    <div className="absolute inset-x-0 bottom-5 md:bottom-7 px-4 flex flex-col items-center gap-2">
                      <ArchOrnament />
                      <p className="font-display italic text-[0.78rem] md:text-sm text-ivory leading-snug max-w-[80%]">
                        {b.tagline}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Category title sits BELOW the frame, with the price
                    band as a quieter sub-line. */}
                <h3 className="font-display text-base md:text-lg font-bold text-ink uppercase tracking-[0.18em] mt-4 group-hover:text-maroon transition-colors">
                  {b.label}
                </h3>
                <div className="mt-1 text-xs md:text-sm text-ink/60">
                  {b.sub}
                </div>
              </BucketTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
