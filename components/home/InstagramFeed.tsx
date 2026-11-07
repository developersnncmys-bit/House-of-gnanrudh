import Image from 'next/image';
import Link from 'next/link';
import { LuInstagram } from 'react-icons/lu';
import { SAREES } from '@/lib/sarees';

type Post = {
  image: string;
  productId: string;
  category: string;
  caption: string;
};

/** Six posts — one shot per category. Pulled from the /bestsellers
 *  library so each tile reads as the category hero. */
const posts: Post[] = [
  {
    image: '/bestsellers/raktharani%20banarasi.webp',
    productId: 'banarasi-raktarani',
    category: 'Banarasi',
    caption: 'Raktarani Banarasi · woven for Diwali week.',
  },
  {
    image: '/bestsellers/Mayura%20kanjee.webp',
    productId: 'kanjivaram-mayura',
    category: 'Kanjeevaram',
    caption: 'Mayura peacock pallu · petni-joined.',
  },
  {
    image: '/bestsellers/Rasleela%20patola2.webp',
    productId: 'patola-rasleela',
    category: 'Patola',
    caption: 'Rasleela Patola · eleven months on the loom.',
  },
  {
    image: '/bestsellers/chandrika%20mysuru.webp',
    productId: 'mysore-chandrika',
    category: 'Mysore Silk',
    caption: 'Chandrika · moonlight ivory, KSIC tested.',
  },
  {
    image: '/bestsellers/katha%20baluchari.webp',
    productId: 'mixedpattu-katha',
    category: 'Mixed Pattu',
    caption: 'Katha Baluchari · story-woven pallu.',
  },
  {
    image: '/bestsellers/haldi%20paithani2.webp',
    productId: 'fancy-haldi',
    category: 'Festive',
    caption: 'Haldi Paithani · turmeric-gold for the ceremony.',
  },
  {
    image: '/newarrivals/sindhoori%20banarasi.webp',
    productId: 'banarasi-sindhoori',
    category: 'Banarasi',
    caption: 'Sindhoori Banarasi · morning-sun pink.',
  },
  {
    image: '/newarrivals/neelambari%20kanjivaram.webp',
    productId: 'kanjivaram-neelambari',
    category: 'Kanjeevaram',
    caption: 'Neelambari · deep-sky blue with temple border.',
  },
  {
    image: '/newarrivals/rangraj%20patola.webp',
    productId: 'patola-rangraj',
    category: 'Patola',
    caption: 'Rangraj · double-ikat court palette.',
  },
  {
    image: '/photos/pexels-manishjangid-28943670.webp',
    productId: 'pochampally-aakash',
    category: 'Pochampally',
    caption: 'Aakash · morning-sky ikat drape.',
  },
  {
    image: '/photos/pexels-manishjangid-28943594.webp',
    productId: 'mangalagiri-tulsi',
    category: 'Mangalagiri',
    caption: 'Tulsi · everyday cotton, temple-border weave.',
  },
  {
    image: '/photos/pexels-manishjangid-28943589.webp',
    productId: 'gadwal-konark',
    category: 'Gadwal',
    caption: 'Konark · silk body, cotton drape, zari pallu.',
  },
];

const INSTAGRAM_HANDLE = '@gnanrudh';
const INSTAGRAM_URL = 'https://instagram.com/gnanrudh';

export default function InstagramFeed() {
  return (
    <section className="instagram-section bg-bone py-10 md:py-14">
      <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
        {/* Heading — Nalli pattern: the Instagram handle itself is the
            title, with a short description below and a thin animated
            progress line that fills in time with the auto-scroll. */}
        <div className="mb-6 md:mb-8">
          <Link
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-2xl md:text-4xl font-semibold text-ink hover:text-maroon transition-colors inline-block"
          >
            {INSTAGRAM_HANDLE}
          </Link>
          <p className="mt-2 text-sm md:text-base text-ink/65 max-w-2xl">
            Follow us on Instagram for behind-the-loom glimpses, styling
            edits and weekly stories from the house.
          </p>
          {/* Progress line — fills left-to-right in sync with the
              marquee's 60s loop. Pauses on marquee hover via the
              parent-hover selector in globals.css. */}
          <div className="mt-5 h-px w-full bg-ink/10 overflow-hidden">
            <div className="instagram-progress h-full bg-maroon origin-left" />
          </div>
        </div>

        {/* Auto-scrolling single-row marquee — Nalli pattern. The track
            is rendered twice back-to-back and translated -50% over the
            animation duration, so the loop re-aligns seamlessly. The
            track pauses on hover so a visitor can read a caption they
            spotted mid-scroll. */}
        <div className="relative overflow-hidden -mx-6 lg:-mx-10">
          <div className="instagram-marquee flex gap-3 md:gap-4 w-max px-6 lg:px-10">
            {[...posts, ...posts].map((p, i) => {
              const product = SAREES.find((s) => s.id === p.productId);
              const href = product ? `/shop/${product.id}` : INSTAGRAM_URL;
              return (
                <Link
                  key={`${p.productId}-${i}`}
                  href={href}
                  className="relative group bg-bone shrink-0 w-[160px] sm:w-[200px] md:w-[240px] lg:w-[260px] aspect-[3/4] transition-all duration-300 hover:z-20 hover:scale-[1.04] hover:shadow-2xl hover:shadow-ink/40"
                >
                  <div className="absolute inset-0 overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.caption}
                      fill
                      sizes="(max-width: 640px) 46vw, (max-width: 1024px) 28vw, 260px"
                      className="object-cover transition-transform duration-500 group-hover:scale-110"
                    />

                    <span className="absolute top-3 left-3 bg-ivory/90 backdrop-blur-sm text-ink text-[0.6rem] font-bold uppercase tracking-[0.18em] px-2 py-1 rounded-sm">
                      {p.category}
                    </span>

                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    {/* Centred Instagram glyph on hover — Nalli-style
                        "this links to the feed" hint. Scales in from
                        90% so it reads as a reveal, not a pop. */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 scale-90 group-hover:scale-100 transition-all duration-300 pointer-events-none">
                      <LuInstagram
                        size={28}
                        strokeWidth={1.8}
                        className="text-white drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]"
                        aria-hidden
                      />
                    </div>
                    <div className="absolute bottom-0 inset-x-0 p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 pointer-events-none">
                      <div className="text-xs font-semibold text-ivory leading-snug line-clamp-2">
                        {p.caption}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

    </section>
  );
}
