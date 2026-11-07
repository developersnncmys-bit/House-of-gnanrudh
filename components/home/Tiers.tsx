import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/components/home/SectionHeader';
import WishlistButton from '@/components/shop/WishlistButton';
import ViewSimilarButton from '@/components/shop/ViewSimilarButton';
import { SAREES, formatINR, TIERS } from '@/lib/sarees';
import { navHref } from '@/lib/soft-launch';

// Hand-picked lineup for the "Featured Products" section. Four hero
// pieces across tiers so the grid reads as a curated edit rather than a
// catalog dump. Order matters — leading with Bridal sets the aspirational
// tone; everyday drops the entry price so the section doesn't feel
// out of reach.
const FEATURED_IDS = [
  'banarasi-raktarani',
  'kanjivaram-mayura',
  'patola-rasleela',
  'mangalagiri-tulsi',
];

export default function Tiers() {
  const items = FEATURED_IDS.map((id) => SAREES.find((s) => s.id === id)).filter(
    (s): s is (typeof SAREES)[number] => Boolean(s),
  );

  return (
    <section className="bg-white py-10 md:py-14">
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
        <SectionHeader
          title="Featured Products"
          description="A curated edit of our most-loved weaves — bridal heirlooms, festive silks and everyday drapes, hand-picked for every occasion in a woman's wardrobe."
          link={{ href: '/shop', label: 'View All' }}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {items.map((saree) => {
            const tier = TIERS[saree.tier];
            const discount =
              saree.mrp > saree.price
                ? Math.round(((saree.mrp - saree.price) / saree.mrp) * 100)
                : 0;
            const productHref = navHref(`/shop/${saree.id}`);
            const CardTag = productHref ? Link : 'span';
            const cardProps = productHref
              ? { href: productHref, className: 'group block bg-white rounded-sm overflow-hidden' }
              : { className: 'group block bg-white rounded-sm overflow-hidden cursor-default' };
            return (
              <CardTag
                key={saree.id}
                {...(cardProps as { href: string; className: string })}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-bone">
                  <Image
                    src={saree.image}
                    alt={saree.name}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-2.5 left-2.5 bg-ivory/95 no-pattern backdrop-blur-sm px-2 py-1 text-[0.65rem] font-semibold text-ink uppercase tracking-wide rounded-sm">
                    {tier.title}
                  </div>
                  {discount > 0 && (
                    <div className="absolute bottom-2.5 right-2.5 bg-maroon-deep text-ivory px-2 py-1 text-[0.65rem] font-bold rounded-sm">
                      {discount}% OFF
                    </div>
                  )}
                  <WishlistButton
                    productId={saree.id}
                    className="absolute top-2.5 right-2.5 w-9 h-9"
                    size={14}
                  />
                </div>
                <div className="p-3 md:p-3.5">
                  <div className="text-xs text-ink/55 font-medium mb-1">
                    {saree.weave}
                  </div>
                  <h3 className="text-base md:text-lg font-semibold text-ink leading-snug line-clamp-1 mb-2">
                    {saree.name}
                  </h3>
                  <div className="flex items-end justify-between gap-2">
                    <div className="flex items-baseline gap-2 min-w-0">
                      <span className="text-lg md:text-xl font-bold text-ink">
                        {formatINR(saree.price)}
                      </span>
                      {saree.mrp > saree.price && (
                        <span className="text-sm text-ink/45 line-through">
                          {formatINR(saree.mrp)}
                        </span>
                      )}
                    </div>
                    <ViewSimilarButton
                      productId={saree.id}
                      className="w-8 h-8 shrink-0 !bg-transparent !backdrop-blur-none"
                      size={16}
                    />
                  </div>
                </div>
              </CardTag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
