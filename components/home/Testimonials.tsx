import Image from 'next/image';
import Link from 'next/link';
import { SAREES } from '@/lib/sarees';
import { navHref } from '@/lib/soft-launch';

type Review = {
  productId: string;
  customer: string;
  city: string;
  quote: string;
};

const reviews: Review[] = [
  {
    productId: 'banarasi-raktarani',
    customer: 'Priya M.',
    city: 'New Delhi',
    quote:
      'I find the designs supremely unique and the feel is so comfortable after wearing them. The pallu detail felt like a family heirloom I could pass on.',
  },
  {
    productId: 'kanjivaram-mayura',
    customer: 'Lakshmi I.',
    city: 'Chennai',
    quote:
      'They delivered my saree on time. The fit, fall and finish were perfect for the ceremony — I would recommend the house to anyone looking for petni-joined Kanjeevarams.',
  },
];

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

                  {/* RIGHT — large italic quote, centred vertically, with
                      the customer name + city below. No stars, no price,
                      no occasion chip — matches the Kalki Customer Stories
                      layout. */}
                  <div className="col-span-3 flex flex-col items-center justify-center text-center px-6 md:px-10 py-8 md:py-10">
                    <blockquote className="font-display italic text-sm md:text-base lg:text-lg text-ink leading-relaxed">
                      &ldquo;{r.quote}&rdquo;
                    </blockquote>
                    <div className="mt-6 md:mt-8 text-sm md:text-base font-semibold text-ink">
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
