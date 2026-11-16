import Image from 'next/image';
import Link from 'next/link';
import { SAREES } from '@/lib/sarees';
import { navHref } from '@/lib/soft-launch';

type Review = {
  productId: string;
  customer: string;
  city: string;
  quote: string;
  /** 1–5. Defaults to 5 if omitted. */
  rating?: number;
};

const reviews: Review[] = [
  {
    productId: 'banarasi-raktarani',
    customer: 'Priya M.',
    city: 'New Delhi',
    rating: 5,
    quote:
      'I find the designs supremely unique and the feel is so comfortable after wearing them. The pallu detail felt like a family heirloom I could pass on.',
  },
  {
    productId: 'kanjivaram-mayura',
    customer: 'Lakshmi I.',
    city: 'Chennai',
    rating: 5,
    quote:
      'They delivered my saree on time. The fit, fall and finish were perfect for the ceremony — I would recommend the house to anyone looking for petni-joined Kanjeevarams.',
  },
];

// Inline star — filled gold-deep for the rated portion, hollow-ish
// ivory for the remainder. 5 glyphs are always rendered so the row
// width stays stable regardless of the score.
function StarRow({ rating = 5 }: { rating?: number }) {
  const full = Math.round(Math.max(0, Math.min(5, rating)));
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${full} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill={i < full ? '#A66D23' : 'none'}
          stroke="#A66D23"
          strokeWidth="1.6"
          strokeLinejoin="round"
          aria-hidden
        >
          <path d="m12 2.5 2.9 6.2 6.8.6-5.1 4.6 1.5 6.7L12 17.3 5.9 20.6l1.5-6.7-5.1-4.6 6.8-.6Z" />
        </svg>
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="bg-white pt-10 md:pt-14 pb-12 md:pb-16">
      <div className="max-w-[1480px] mx-auto px-6 lg:px-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="flex justify-center mb-3">
            <Image
              src="/lotus.png"
              alt=""
              width={160}
              height={160}
              className="h-7 sm:h-8 md:h-9 w-auto select-none"
              draggable={false}
              aria-hidden
            />
          </div>
          <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
            Customer Stories
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {reviews.map((r) => {
            const product = SAREES.find((s) => s.id === r.productId);
            if (!product) return null;
            const productHref = navHref(`/shop/${product.id}`);
            return (
              <article
                key={r.customer + r.productId}
                className="group bg-white border border-ink/10 overflow-hidden"
              >
                <div className="grid grid-cols-5">
                  {/* LEFT — tall product photo with the "VIEW PRODUCT"
                      button overlaid at the bottom of the frame. */}
                  <div className="col-span-2 relative aspect-[3/4] bg-bone">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      sizes="(max-width: 768px) 40vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* VIEW PRODUCT — hidden by default, fades + slides
                        in from the bottom on hover of the parent card. */}
                    <div className="absolute inset-x-4 bottom-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                      {productHref ? (
                        <Link
                          href={productHref}
                          className="block w-full text-center bg-ivory text-ink px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] hover:bg-maroon-deep hover:text-ivory transition-colors"
                        >
                          View Product
                        </Link>
                      ) : (
                        <span className="block w-full text-center bg-ivory text-ink px-4 py-3 text-xs font-bold uppercase tracking-[0.18em] cursor-default">
                          View Product
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT — large italic quote, centred vertically; gold
                      star rating sits just above the reviewer's name so the
                      rating reads as a signature alongside the attribution. */}
                  <div className="col-span-3 flex flex-col items-center justify-center text-center px-6 md:px-10 py-8 md:py-10">
                    <blockquote className="font-display font-bold text-sm md:text-base lg:text-lg text-ink leading-relaxed">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 md:mt-8 mb-2">
                      <StarRow rating={r.rating} />
                    </div>
                    <div className="text-sm md:text-base font-semibold text-ink">
                      {r.customer}
                    </div>
                    <div className="mt-1 text-xs md:text-sm text-ink/60">
                      {r.city}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
