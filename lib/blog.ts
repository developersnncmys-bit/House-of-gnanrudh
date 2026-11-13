/**
 * Blog data — sample long-reads written in the brand voice. Each post
 * carries a slug, headline, dek, hero image path, publish date, read
 * time, category, tags and body content (as structured blocks so we
 * don't need markdown parsing).
 *
 * Swap this for a CMS later — the shape is kept simple (plain blocks,
 * no nested refs) so a Sanity / Contentful adapter can map straight in.
 */

export type BlogBlock =
  | { type: 'p'; text: string }
  | { type: 'h2'; text: string }
  | { type: 'quote'; text: string }
  | { type: 'image'; src: string; caption?: string };

export type BlogPost = {
  slug: string;
  title: string;
  dek: string;
  hero: string;
  category: string;
  tags: string[];
  publishedAt: string; // ISO date
  readMinutes: number;
  featured?: boolean;
  body: BlogBlock[];
};

export const BLOG_CATEGORIES = [
  'The House Edit',
  'Bridal Diary',
  'Weave Stories',
  'Draping Guide',
  'Care & Keeping',
] as const;

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: 'six-silks-every-bride-should-own',
    title: 'The Six Silks Every Bride Should Own',
    dek: 'From the temple-border Kanjeevaram to the pit-loom Banarasi — a lifetime wardrobe begins with these six heirloom weaves.',
    hero: '/blog/bridal2.png',
    category: 'Bridal Diary',
    tags: ['bridal', 'kanjeevaram', 'banarasi', 'heirloom'],
    publishedAt: '2026-10-28',
    readMinutes: 7,
    featured: true,
    body: [
      {
        type: 'p',
        text: 'The old houses of South and North India still measure a trousseau not in pieces, but in weaves. A Kanjeevaram for the muhurtham. A Banarasi for the reception. A Paithani folded away for the daughter that comes. A saree is not bought — it is chosen, and then kept.',
      },
      {
        type: 'p',
        text: 'If you are building a bridal wardrobe from the ground up, these six silks cover a lifetime of occasion. Each one carries a different grammar of weave, a different region, a different silence folded into the pallu.',
      },
      { type: 'h2', text: '1. Temple-border Kanjeevaram' },
      {
        type: 'p',
        text: 'Woven on the triple-shuttle korvai loom of Kanchipuram, the temple-border Kanjeevaram is the signature piece — body, border and pallu each in a separate colour, joined by the hand-knotted petni. Pure silver-gold zari, heavy drape, built to carry a woman through the muhurtham and then through her daughter\'s muhurtham fifty years later.',
      },
      { type: 'h2', text: '2. Pit-loom Banarasi' },
      {
        type: 'p',
        text: 'Not every Banarasi is woven on the pit loom. The ones that are take four weavers, three months, and a drawing on graph paper that the master memorises. Look for the kadhwa jaal — a woven motif, not a printed one — and the slight unevenness at the selvedge that machine looms cannot fake.',
      },
      { type: 'h2', text: '3. Paithani for the reception' },
      {
        type: 'p',
        text: 'The parrot-green Paithani with the lotus pallu is the Deccan\'s answer to the Kanjeevaram. A single piece takes six months, and the weft silk is tapestry-woven by hand so the pallu feels like embroidery.',
      },
      {
        type: 'quote',
        text: 'A saree, well chosen, is a quiet act of love — for the hands that wove it, and the woman who wears it.',
      },
      { type: 'h2', text: '4. Patola for the sangeet' },
      {
        type: 'p',
        text: 'Double-ikat Patola from Patan is the only saree where both warp and weft are dyed before weaving. Each piece can take a year. If the weave on the inside matches the outside exactly, you are looking at the real thing.',
      },
      { type: 'h2', text: '5. Mysore Silk for the daytime' },
      {
        type: 'p',
        text: 'A lighter silk, but still a pure-silk crepe — perfect for the morning haldi or the quiet mehendi lunch. The Mysore Silk Weaving Factory still stamps its sarees with a certificate of silk purity. Keep the certificate.',
      },
      { type: 'h2', text: '6. Something hand-woven, every day' },
      {
        type: 'p',
        text: 'Finally — a drape that is not for the ceremony. A Mangalagiri cotton, a Pochampally ikat, a Gadwal with a silk border and a cotton body. The piece you reach for on the ordinary mornings. The piece that teaches you how to tie a saree before the big day.',
      },
    ],
  },
  {
    slug: 'spot-pure-zari',
    title: 'How to Spot Pure Zari: A House Guide',
    dek: 'Silver-gilt, tested, declared. A plain-language guide to the thread that separates a ₹40,000 saree from a ₹4,00,000 one.',
    hero: '/blog/zari2.png',
    category: 'Weave Stories',
    tags: ['zari', 'guide', 'authenticity'],
    publishedAt: '2026-10-21',
    readMinutes: 5,
    body: [
      {
        type: 'p',
        text: 'Pure zari is drawn silver wire, electroplated with 22k or 24k gold, then wound around a silk or cotton core. It is heavy. It tarnishes slowly. It does not peel. And — this is the part most buyers miss — every reputable loom will declare its exact composition in grams per metre.',
      },
      { type: 'h2', text: 'The burn test (do not do this)' },
      {
        type: 'p',
        text: 'You will read on the internet that you can burn a strand of zari and smell for silver. Please do not. You will ruin a piece worth more than the test is worth, and you will not learn anything a receipt would not tell you honestly.',
      },
      { type: 'h2', text: 'What to ask the house' },
      {
        type: 'p',
        text: 'Instead: ask for the zari grade (22k, 24k, tested or imitation), the exact thread weight in grams, and the name of the artisan who wove the piece. A house that will not tell you is a house that does not know.',
      },
    ],
  },
  {
    slug: 'nivi-drape-101',
    title: 'Saree Draping 101: The Nivi Style',
    dek: 'Six and a half yards, seven pleats, one pallu. The most-worn drape in India, broken down step by step.',
    hero: '/blog/nivi-style2.png',
    category: 'Draping Guide',
    tags: ['draping', 'nivi', 'beginner'],
    publishedAt: '2026-10-14',
    readMinutes: 6,
    body: [
      {
        type: 'p',
        text: 'The Nivi — the Andhra-origin drape that became India\'s default — is the easiest classical drape to learn. All you need is a fitted petticoat, a well-stitched blouse, and about eight safety pins. Oh, and a saree.',
      },
      { type: 'h2', text: 'Step one: tuck the plain end' },
      {
        type: 'p',
        text: 'With the pallu over your left shoulder, tuck the plain end into the petticoat at your navel. Go around once — the hem should just clear the floor.',
      },
      { type: 'h2', text: 'Step two: pleat the pallu' },
      {
        type: 'p',
        text: 'Make five to seven even pleats of the pallu (depending on how wide your pallu border is), pin at the shoulder, and let the rest fall to your knees.',
      },
      { type: 'h2', text: 'Step three: the seven centre pleats' },
      {
        type: 'p',
        text: 'Finally, make seven even pleats at the front, aligned at the navel, and tuck them in. Done. Walk once to check the fall.',
      },
    ],
  },
  {
    slug: 'kanchipuram-triple-shuttle',
    title: 'The Loom That Shapes Kanchipuram',
    dek: 'Inside the triple-shuttle korvai — the 400-year-old mechanism behind every real Kanjeevaram.',
    hero: '/blog/kanjeevaram2.png',
    category: 'Weave Stories',
    tags: ['kanjeevaram', 'loom', 'korvai'],
    publishedAt: '2026-10-07',
    readMinutes: 8,
    body: [
      {
        type: 'p',
        text: 'The korvai loom is why a Kanjeevaram body comes in one colour and its border in another — and why the join holds for eighty years. Three shuttles. Two weavers. One hand-knotted petni holding it all together.',
      },
      { type: 'h2', text: 'What korvai means' },
      {
        type: 'p',
        text: 'Korvai (கோர்வை) is Tamil for "joining". The loom runs the body silk on the centre shuttle and two border silks on the side shuttles. The border and body are not stitched afterwards — they are interlocked at the loom, warp by warp, by the second weaver who sits beside the master.',
      },
      { type: 'h2', text: 'Why it matters' },
      {
        type: 'p',
        text: 'A power-loom Kanjeevaram cannot do this. It can print a border onto the body, or weave the border separately and attach it later, but the join will always be the weak point. A korvai piece has no weak point. The border and body share the same petni knot — pull one, and the other holds.',
      },
    ],
  },
  {
    slug: 'diwali-edit-2026',
    title: 'The Diwali Edit: Our Six Picks for 2026',
    dek: 'Six sarees from the house for the six nights of the festive — from the muhurtham-grade Kanjeevaram to the Monday-office Mangalagiri.',
    hero: '/Ocassions/Haldi.png',
    category: 'The House Edit',
    tags: ['diwali', 'festive', 'edit'],
    publishedAt: '2026-09-30',
    readMinutes: 4,
    body: [
      {
        type: 'p',
        text: 'Diwali is not one day. It is five, sometimes six — Dhanteras, Chhoti Diwali, Lakshmi Pooja, Govardhan, Bhai Dooj, and the Monday after, when you have to walk back into the office in something that still feels festive.',
      },
      { type: 'h2', text: '1. For Dhanteras: a quiet Mysore Silk' },
      {
        type: 'p',
        text: 'A single-colour Mysore Silk with a gold temple border. Easy to drape, pure-silk soft, and the gold does the heavy lifting.',
      },
      { type: 'h2', text: '2. For Lakshmi Pooja: the Kanjeevaram' },
      {
        type: 'p',
        text: 'Red body, mustard border, temple-border zari pallu. The piece every photographer at the pooja will remember.',
      },
    ],
  },
  {
    slug: 'caring-for-heirloom-silk',
    title: 'Caring for Your Heirloom Silk',
    dek: 'A pre-dry-clean checklist, how often to fold-change, and why your silk saree should never see a hanger.',
    hero: '/product/Explore-kanjeevaram.webp',
    category: 'Care & Keeping',
    tags: ['care', 'storage', 'silk'],
    publishedAt: '2026-09-23',
    readMinutes: 6,
    body: [
      {
        type: 'p',
        text: 'A heirloom silk is not a garment, it is an object with a lifespan. Treat it well and it will outlive you. Treat it badly and it will fold-crease, zari-tarnish and silk-rot within a decade.',
      },
      { type: 'h2', text: 'Never hang a silk saree' },
      {
        type: 'p',
        text: 'Gravity is the enemy. Fold the saree in thirds, wrap in muslin, and keep flat in a wooden or cardboard chest. Change the fold every three months so the creases do not become permanent breaks.',
      },
      { type: 'h2', text: 'The pre-dry-clean rule' },
      {
        type: 'p',
        text: 'Before you send any silk to the dry cleaner, photograph it from both sides. Mark the zari. Note the thread colour. If it comes back different, you have evidence.',
      },
    ],
  },
  {
    slug: 'pochampally-ikat-story',
    title: 'The Story Behind Pochampally Ikat',
    dek: 'Why a weave from a single village in Telangana became the first Indian handloom with UNESCO heritage status.',
    hero: '/blog/pochampally2.png',
    category: 'Weave Stories',
    tags: ['pochampally', 'ikat', 'telangana'],
    publishedAt: '2026-09-16',
    readMinutes: 5,
    body: [
      {
        type: 'p',
        text: 'Bhoodan Pochampally, a village of 2,000 households in Telangana, weaves nearly all of India\'s single and double ikat. In 2005, UNESCO added the Pochampally Ikat weave to its list of intangible cultural heritage — the first Indian handloom to be so recognised.',
      },
      { type: 'h2', text: 'Ikat before the loom' },
      {
        type: 'p',
        text: 'Ikat is the art of dyeing the thread before weaving — tying tight bundles with cotton string to resist the dye, then untying and re-tying for each colour. By the time the weaver sits at the loom, the pattern is already in the yarn. A mistake in the dyeing cannot be undone at the loom.',
      },
    ],
  },
  {
    slug: 'mangalagiri-cotton-wardrobe',
    title: 'Why Every Cotton Wardrobe Needs a Mangalagiri',
    dek: 'Hand-woven, breathable, and under five thousand. The entry-point for anyone starting their handloom journey.',
    hero: '/product/Explore-baluchari.webp',
    category: 'The House Edit',
    tags: ['mangalagiri', 'cotton', 'everyday'],
    publishedAt: '2026-09-09',
    readMinutes: 4,
    body: [
      {
        type: 'p',
        text: 'Mangalagiri is a town in Andhra Pradesh, about an hour from Vijayawada, where the looms have been running for six hundred years. The town weaves one of the most honest cottons in the country — pit-loom, pure-cotton body, zari temple border.',
      },
      { type: 'h2', text: 'Why cotton, why now' },
      {
        type: 'p',
        text: 'A hand-woven cotton breathes in ways power-loom poly-cotton never will. For the daily — the office, the pickup from school, the quiet afternoon errand — nothing drapes as kindly as a Mangalagiri.',
      },
    ],
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

export function getRelatedPosts(slug: string, limit = 3): BlogPost[] {
  const current = getPostBySlug(slug);
  if (!current) return [];
  return BLOG_POSTS.filter(
    (p) => p.slug !== slug && p.category === current.category,
  )
    .slice(0, limit)
    .concat(
      BLOG_POSTS.filter(
        (p) => p.slug !== slug && p.category !== current.category,
      ).slice(0, limit),
    )
    .slice(0, limit);
}

export function formatPublishDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
