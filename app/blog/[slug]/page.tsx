import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  BLOG_POSTS,
  formatPublishDate,
  getPostBySlug,
  getRelatedPosts,
  type BlogBlock,
  type BlogPost,
} from '@/lib/blog';
import { navHref } from '@/lib/soft-launch';

const GOLD_GRADIENT =
  'linear-gradient(135deg, #8A5A1F 0%, #C8923F 20%, #F2C99E 45%, #FFF2D6 50%, #F2C99E 55%, #C8923F 80%, #8A5A1F 100%)';

type Params = { slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return BLOG_POSTS.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) {
    return { title: 'Story not found · House Of GnanRudh' };
  }
  return {
    title: `${post.title} · House Of GnanRudh`,
    description: post.dek,
    openGraph: {
      title: post.title,
      description: post.dek,
      images: [{ url: post.hero }],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const related = getRelatedPosts(slug, 3);
  const headings = post.body.filter((b) => b.type === 'h2');

  // Build prev / next by publish order (newest first in BLOG_POSTS already).
  const idx = BLOG_POSTS.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? BLOG_POSTS[idx - 1] : null;
  const next = idx < BLOG_POSTS.length - 1 ? BLOG_POSTS[idx + 1] : null;

  const blogHref = navHref('/blog');

  return (
    <main className="bg-ivory text-ink">
      <article>
        <PostHero post={post} blogHref={blogHref} />

        <section className="bg-ivory">
          <div className="max-w-[1720px] mx-auto px-6 lg:px-10 py-12 md:py-16 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-10 lg:gap-14">
            {/* Main article body */}
            <div className="max-w-[720px] mx-auto lg:mx-0 w-full">
              {headings.length > 1 && <TableOfContents headings={headings as { type: 'h2'; text: string }[]} />}
              <PostBody blocks={post.body} />

              <TagList tags={post.tags} />
              <PrevNextNav prev={prev} next={next} />
            </div>

            {/* Sticky sidebar — related + recent */}
            <aside className="lg:sticky lg:top-[200px] lg:self-start space-y-10">
              {related.length > 0 && (
                <div>
                  <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.3em] uppercase font-bold text-maroon mb-5">
                    Related Reads
                  </div>
                  <div className="space-y-4">
                    {related.map((r) => (
                      <SidebarCard key={r.slug} post={r} />
                    ))}
                  </div>
                </div>
              )}
              <div>
                <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.3em] uppercase font-bold text-maroon mb-5">
                  More From the Journal
                </div>
                <ol className="space-y-4">
                  {BLOG_POSTS.slice(0, 5).map((p, i) => (
                    <li key={p.slug} className="flex gap-3 items-start">
                      <span
                        className="font-display text-lg leading-none tabular-nums shrink-0 mt-0.5"
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
                      <PostLink
                        post={p}
                        className="group text-sm font-display font-semibold text-ink leading-snug hover:text-maroon-deep transition-colors line-clamp-2 flex-1"
                      >
                        {p.title}
                      </PostLink>
                    </li>
                  ))}
                </ol>
              </div>
            </aside>
          </div>
        </section>

        {/* You might also like — full-width grid at the end */}
        {related.length > 0 && (
          <section className="bg-bone py-14 md:py-20 border-t border-ink/5">
            <div className="max-w-[1720px] mx-auto px-6 lg:px-10">
              <div className="text-center mb-10">
                <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.3em] uppercase font-bold text-maroon mb-3">
                  You Might Also Like
                </div>
                <h2 className="font-display text-2xl md:text-3xl font-semibold text-ink">
                  Keep reading
                </h2>
                <span aria-hidden className="block mx-auto h-px w-10 bg-gold/70 mt-4" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 max-w-[1200px] mx-auto">
                {related.map((r) => (
                  <RelatedCard key={r.slug} post={r} />
                ))}
              </div>
            </div>
          </section>
        )}
      </article>
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

function PostHero({ post, blogHref }: { post: BlogPost; blogHref?: string }) {
  return (
    <section className="relative w-full h-[calc(70vh-10px)] min-h-[460px] md:min-h-[560px] max-h-[760px] bg-[#1B0E0A] overflow-hidden">
      <Image
        src={post.hero}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover"
        style={{ objectPosition: '50% 35%' }}
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(180deg, rgba(27,14,10,0.2) 0%, rgba(27,14,10,0.2) 40%, rgba(27,14,10,0.75) 100%)',
        }}
      />

      <div className="relative h-full max-w-[1720px] mx-auto px-6 md:px-10 lg:px-14 flex flex-col items-end justify-end pb-12 md:pb-16">
        <nav className="w-full max-w-3xl md:text-right text-[0.65rem] md:text-xs tracking-[0.2em] uppercase text-ivory/70 mb-5">
          {blogHref ? (
            <Link href={blogHref} className="hover:text-ivory transition-colors">
              The Journal
            </Link>
          ) : (
            <span className="cursor-default">The Journal</span>
          )}
          <span className="mx-2 text-ivory/40" aria-hidden>
            /
          </span>
          <span className="text-ivory">{post.category}</span>
        </nav>

        <div className="max-w-3xl text-ivory md:text-right">
          <h1
            className="text-3xl md:text-5xl lg:text-[3.25rem] font-semibold leading-[1.1] mb-5"
            style={{
              fontFamily:
                'var(--font-hero), "Italiana", Georgia, serif',
              backgroundImage: GOLD_GRADIENT,
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: 'transparent',
              filter:
                'drop-shadow(0 2px 6px rgba(0,0,0,0.5)) drop-shadow(0 0 1px rgba(242,201,158,0.3))',
            }}
          >
            {post.title}
          </h1>
          <p className="text-sm md:text-base text-ivory/85 leading-relaxed max-w-2xl mb-6 md:ml-auto">
            {post.dek}
          </p>
          <div className="flex items-center gap-4 text-xs md:text-sm text-ivory/70 md:justify-end">
            <span>{formatPublishDate(post.publishedAt)}</span>
            <span aria-hidden className="h-3 w-px bg-ivory/30" />
            <span>{post.readMinutes} min read</span>
          </div>
        </div>
      </div>
    </section>
  );
}

function TableOfContents({ headings }: { headings: { type: 'h2'; text: string }[] }) {
  return (
    <aside className="mb-10 md:mb-12 bg-white rounded-sm p-5 md:p-6 border border-ink/10">
      <div className="text-[0.62rem] md:text-[0.68rem] tracking-[0.3em] uppercase font-bold text-maroon mb-3">
        In this story
      </div>
      <ol className="space-y-1.5">
        {headings.map((h, i) => (
          <li key={i} className="text-sm text-ink/80 flex items-baseline gap-2">
            <span className="font-display text-maroon/70 tabular-nums shrink-0">
              {String(i + 1).padStart(2, '0')}
            </span>
            <a
              href={`#heading-${i}`}
              className="hover:text-maroon-deep hover:underline underline-offset-4 transition-colors"
            >
              {h.text.replace(/^\d+\.\s*/, '')}
            </a>
          </li>
        ))}
      </ol>
    </aside>
  );
}

function PostBody({ blocks }: { blocks: BlogBlock[] }) {
  let headingIdx = 0;
  return (
    <div className="prose-like">
      {blocks.map((b, i) => {
        if (b.type === 'p') {
          return (
            <p
              key={i}
              className="text-base md:text-[1.08rem] leading-[1.9] text-ink/85 mb-6 last:mb-0"
            >
              {b.text}
            </p>
          );
        }
        if (b.type === 'h2') {
          const anchor = `heading-${headingIdx++}`;
          return (
            <h2
              key={i}
              id={anchor}
              className="font-display text-2xl md:text-[1.8rem] font-semibold text-ink leading-tight mt-10 mb-5 scroll-mt-32"
            >
              {b.text}
            </h2>
          );
        }
        if (b.type === 'quote') {
          return (
            <blockquote
              key={i}
              className="my-10 md:my-12 text-center"
            >
              <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mb-6" />
              <p
                className="text-2xl md:text-[1.75rem] leading-[1.35] italic"
                style={{
                  fontFamily:
                    'var(--font-hero), "Italiana", Georgia, serif',
                  fontWeight: 600,
                  backgroundImage:
                    'linear-gradient(135deg, #5A3610 0%, #8A5A1F 25%, #B07A2A 50%, #8A5A1F 75%, #5A3610 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  color: 'transparent',
                }}
              >
                &ldquo;{b.text}&rdquo;
              </p>
              <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-6" />
            </blockquote>
          );
        }
        if (b.type === 'image') {
          return (
            <figure key={i} className="my-10">
              <div className="relative aspect-[16/9] overflow-hidden rounded-sm bg-bone">
                <Image
                  src={b.src}
                  alt={b.caption ?? ''}
                  fill
                  sizes="(max-width: 768px) 100vw, 720px"
                  className="object-cover"
                />
              </div>
              {b.caption && (
                <figcaption className="mt-3 text-xs md:text-sm text-ink/55 italic text-center">
                  {b.caption}
                </figcaption>
              )}
            </figure>
          );
        }
        return null;
      })}
    </div>
  );
}

function TagList({ tags }: { tags: string[] }) {
  return (
    <div className="mt-12 md:mt-14 pt-8 border-t border-ink/10">
      <div className="text-[0.62rem] md:text-[0.68rem] tracking-[0.3em] uppercase font-bold text-maroon mb-4">
        Tags
      </div>
      <div className="flex flex-wrap gap-2">
        {tags.map((t) => (
          <span
            key={t}
            className="inline-block px-3 py-1 text-xs font-semibold text-ink/70 bg-white border border-ink/10 rounded-full cursor-default"
          >
            #{t}
          </span>
        ))}
      </div>
    </div>
  );
}

function PrevNextNav({
  prev,
  next,
}: {
  prev: BlogPost | null;
  next: BlogPost | null;
}) {
  if (!prev && !next) return null;
  return (
    <nav className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
      {prev ? (
        <PostLink
          post={prev}
          className="group block bg-white rounded-sm p-5 md:p-6 border border-ink/10 hover:border-maroon-deep/60 transition-colors"
        >
          <div className="text-[0.6rem] tracking-[0.25em] uppercase font-bold text-maroon/70 mb-2">
            ← Previous
          </div>
          <div className="font-display text-sm md:text-base font-semibold text-ink group-hover:text-maroon-deep transition-colors leading-snug line-clamp-2">
            {prev.title}
          </div>
        </PostLink>
      ) : (
        <span />
      )}
      {next ? (
        <PostLink
          post={next}
          className="group block bg-white rounded-sm p-5 md:p-6 border border-ink/10 hover:border-maroon-deep/60 transition-colors md:text-right"
        >
          <div className="text-[0.6rem] tracking-[0.25em] uppercase font-bold text-maroon/70 mb-2">
            Next →
          </div>
          <div className="font-display text-sm md:text-base font-semibold text-ink group-hover:text-maroon-deep transition-colors leading-snug line-clamp-2">
            {next.title}
          </div>
        </PostLink>
      ) : (
        <span />
      )}
    </nav>
  );
}

function SidebarCard({ post }: { post: BlogPost }) {
  return (
    <PostLink
      post={post}
      className="group grid grid-cols-[88px_1fr] gap-3 bg-white rounded-sm overflow-hidden border border-ink/5 hover:border-maroon-deep/40 transition-colors"
    >
      <div className="relative aspect-square overflow-hidden bg-bone">
        <Image
          src={post.hero}
          alt=""
          fill
          sizes="88px"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="py-2 pr-3 flex flex-col justify-center min-w-0">
        <div className="text-[0.55rem] tracking-[0.22em] uppercase font-bold text-maroon mb-1">
          {post.category}
        </div>
        <div className="font-display text-sm font-semibold text-ink leading-tight group-hover:text-maroon-deep transition-colors line-clamp-2">
          {post.title}
        </div>
      </div>
    </PostLink>
  );
}

function RelatedCard({ post }: { post: BlogPost }) {
  return (
    <PostLink
      post={post}
      className="group block bg-white rounded-sm overflow-hidden shadow-[0_1px_3px_rgba(77,0,21,0.06)] hover:shadow-[0_8px_22px_rgba(77,0,21,0.12)] transition-shadow"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-bone">
        <Image
          src={post.hero}
          alt=""
          fill
          sizes="(max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      </div>
      <div className="p-5">
        <div className="text-[0.6rem] tracking-[0.25em] uppercase font-bold text-maroon mb-2">
          {post.category}
        </div>
        <h3 className="font-display text-base md:text-lg font-semibold text-ink leading-tight group-hover:text-maroon-deep transition-colors line-clamp-2">
          {post.title}
        </h3>
        <div className="mt-2 text-xs text-ink/50">
          {post.readMinutes} min read
        </div>
      </div>
    </PostLink>
  );
}
