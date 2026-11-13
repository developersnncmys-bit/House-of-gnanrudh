import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import SectionHeader from '@/components/home/SectionHeader';
import BlogHeroCarousel from '@/components/blog/BlogHeroCarousel';
import {
  BLOG_CATEGORIES,
  BLOG_POSTS,
  formatPublishDate,
  type BlogPost,
} from '@/lib/blog';
import { navHref } from '@/lib/soft-launch';

export const metadata: Metadata = {
  title: 'The Journal · House Of GnanRudh',
  description:
    'Long-reads on handloom weaves, bridal wardrobes, draping guides and care — from the house that curates them.',
};

const GOLD_GRADIENT =
  'linear-gradient(135deg, #8A5A1F 0%, #C8923F 20%, #F2C99E 45%, #FFF2D6 50%, #F2C99E 55%, #C8923F 80%, #8A5A1F 100%)';

export default function BlogPage() {
  // Carousel takes the first featured post + the next two most recent so
  // the hero always rotates through a fresh trio of stories.
  const featured = BLOG_POSTS.find((p) => p.featured) ?? BLOG_POSTS[0];
  const heroSlides = [
    featured,
    ...BLOG_POSTS.filter((p) => p.slug !== featured.slug).slice(0, 2),
  ];
  const rest = BLOG_POSTS.filter((p) => p.slug !== featured.slug);
  const [latest, ...moreStories] = rest;
  const editGrid = moreStories.slice(0, 6);
  const recent = BLOG_POSTS.slice(0, 5);

  return (
    <main className="bg-ivory text-ink">
      <BlogHeroCarousel posts={heroSlides} />

      {/* Category nav — centred editorial strip. Small gold eyebrow on
          top, category titles in a row below with an animated gold
          underline on hover. Reads as a journal's section navigator
          rather than a pill-chip filter. */}
      <section className="bg-ivory border-b border-ink/10">
        <div className="max-w-[1720px] mx-auto px-6 lg:px-10 py-8 md:py-10 text-center">
          <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon mb-4">
            Browse by Category
          </div>
          <div className="flex items-center justify-center gap-6 md:gap-10 lg:gap-14 flex-wrap">
            {BLOG_CATEGORIES.map((c, i) => (
              <div key={c} className="flex items-center gap-6 md:gap-10 lg:gap-14">
                <span className="group relative inline-block text-sm md:text-[0.95rem] font-semibold text-ink/80 hover:text-maroon-deep transition-colors cursor-default whitespace-nowrap">
                  {c}
                  <span
                    aria-hidden
                    className="absolute left-0 right-0 -bottom-1.5 h-px origin-center scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                    style={{
                      backgroundImage:
                        'linear-gradient(90deg, #8A5A1F 0%, #C8923F 50%, #8A5A1F 100%)',
                    }}
                  />
                </span>
                {i < BLOG_CATEGORIES.length - 1 && (
                  <span
                    aria-hidden
                    className="hidden md:inline-block w-1 h-1 rounded-full bg-maroon/40"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Stories — three equal vertical cards on desktop, stacking
          cleanly down on mobile. Replaces the earlier mixed big-hero +
          sidebar layout which left dead space at the bottom of the
          sidebar column. */}
      <section className="bg-white py-12 md:py-16">
        <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
          <SectionHeader
            title="Latest Stories"
            description="Fresh writing from the house — on weaves, brides, and the way a saree finds its wearer."
            showDividers={false}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-[1300px] mx-auto">
            {[latest, ...editGrid.slice(0, 2)].map((p) => (
              <VerticalCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      {/* The House Edit — 3-column grid of the rest of the posts. */}
      <section className="bg-bone py-12 md:py-16">
        <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
          <SectionHeader
            title="The House Edit"
            description="Weave stories, bridal diaries and care guides — curated reads from the editors of the house."
            showDividers={false}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-[1300px] mx-auto">
            {editGrid.slice(2).concat(moreStories.slice(6)).map((p) => (
              <VerticalCard key={p.slug} post={p} />
            ))}
          </div>
        </div>
      </section>

      {/* Closing band — centred editorial letter from the Journal + a
          horizontal strip of top reads below. Reads as one cohesive
          moment instead of two disconnected sidebars. */}
      <section className="bg-ivory py-16 md:py-24">
        <div className="max-w-[720px] mx-auto px-6 text-center">
          <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon mb-4">
            Keep Reading
          </div>
          <h2
            className="text-3xl md:text-[2.5rem] lg:text-5xl leading-[1.1] mb-5"
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
            Written for the woman who keeps her sarees.
          </h2>
          <p className="text-sm md:text-base text-ink/70 leading-relaxed max-w-lg mx-auto mb-7">
            The Journal lands in your inbox once a month — one long-read,
            one short note, and the pieces we fell in love with that season.
            Nothing else.
          </p>
          <a
            href="#circle"
            className="inline-flex items-center gap-2 bg-maroon-deep hover:bg-maroon text-ivory px-7 py-3.5 text-xs font-bold uppercase tracking-[0.25em] rounded-sm transition-colors"
          >
            Join the Circle
            <span aria-hidden>→</span>
          </a>
          <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-16 md:mt-20" />
        </div>

        {/* Top reads — horizontal row of three story cards below the
            newsletter CTA. Visually ties the closing band to the rest of
            the page (uses the same VerticalCard treatment as above but
            with three slimmer, numbered cards). */}
        <div className="max-w-[1300px] mx-auto px-6 lg:px-10 mt-14 md:mt-16">
          <div className="text-center mb-8">
            <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon">
              Top Reads
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {recent.slice(0, 3).map((p, i) => (
              <PostLink
                key={p.slug}
                post={p}
                className="group grid grid-cols-[48px_1fr] md:grid-cols-[64px_1fr] items-start gap-4 md:gap-5 bg-white rounded-sm p-5 md:p-6 shadow-[0_1px_3px_rgba(77,0,21,0.06)] hover:shadow-[0_8px_22px_rgba(77,0,21,0.1)] transition-shadow"
              >
                <span
                  className="font-display text-3xl md:text-[2.5rem] leading-none tabular-nums shrink-0"
                  style={{
                    backgroundImage: GOLD_GRADIENT,
                    WebkitBackgroundClip: 'text',
                    backgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    color: 'transparent',
                  }}
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div className="min-w-0">
                  <div className="text-[0.6rem] tracking-[0.25em] uppercase font-bold text-maroon mb-1.5">
                    {p.category}
                  </div>
                  <div className="font-display text-base md:text-lg font-semibold text-ink leading-snug group-hover:text-maroon-deep transition-colors line-clamp-2">
                    {p.title}
                  </div>
                  <div className="mt-2 text-[0.7rem] text-ink/50">
                    {p.readMinutes} min read
                  </div>
                </div>
              </PostLink>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

/* ─── Sub-components ──────────────────────────────────────────────── */

function PostLink({
  post,
  className,
  children,
}: {
  post: BlogPost;
  className?: string;
  children: React.ReactNode;
}) {
  const href = navHref(`/blog/${post.slug}`);
  if (href) {
    return (
      <Link href={href} className={className}>
        {children}
      </Link>
    );
  }
  return <span className={`${className ?? ''} cursor-default`}>{children}</span>;
}

function VerticalCard({ post }: { post: BlogPost }) {
  return (
    <PostLink
      post={post}
      className="group block bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(77,0,21,0.06)] hover:shadow-[0_10px_24px_rgba(77,0,21,0.12)] transition-shadow"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        <Image
          src={post.hero}
          alt=""
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5 md:p-6">
        <div className="text-[0.6rem] tracking-[0.25em] uppercase font-bold text-maroon mb-2">
          {post.category}
        </div>
        <h3 className="font-display text-base md:text-lg font-semibold text-ink leading-snug group-hover:text-maroon-deep transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="mt-2 text-sm text-ink/60 leading-relaxed line-clamp-2">
          {post.dek}
        </p>
        <div className="mt-3 text-xs text-ink/50">
          {formatPublishDate(post.publishedAt)} · {post.readMinutes} min read
        </div>
      </div>
    </PostLink>
  );
}
