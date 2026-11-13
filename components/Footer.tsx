import Link from 'next/link';
import Image from 'next/image';
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
  FaWhatsapp,
  FaXTwitter,
} from 'react-icons/fa6';
import { LuMapPin, LuPhone, LuMail, LuArrowRight } from 'react-icons/lu';
import { navHref } from '@/lib/soft-launch';

const BOUTIQUE = {
  addressLine1: 'Shop No. 12, Trunk Road',
  addressLine2: 'Nellore, Andhra Pradesh 524001',
  mapsHref:
    'https://www.google.com/maps/search/?api=1&query=Shop+No.+12%2C+Trunk+Road%2C+Nellore%2C+Andhra+Pradesh+524001',
  phoneLabel: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  email: 'hello@houseofgnanrudh.com',
  hours: [
    { days: 'Monday – Saturday', time: '10:00 AM – 9:00 PM' },
    { days: 'Sunday', time: '11:00 AM – 8:00 PM' },
  ],
};

// Soft-launch helper — identical to a <Link>, but during the gated
// pre-launch it renders as an inert <span> with the same classes so
// the footer reads the same but nothing navigates. Flipping SOFT_LAUNCH
// restores navigation automatically.
function FooterLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const safe = navHref(href);
  if (safe) {
    return (
      <Link href={safe} className={className}>
        {children}
      </Link>
    );
  }
  return (
    <span className={`${className ?? ''} cursor-default`.trim()}>
      {children}
    </span>
  );
}

// Social icons — kept visible as brand decoration; href has been
// removed so each one renders as a static glyph (no navigation).
const socials: { label: string; icon: React.ReactNode }[] = [
  { label: 'Instagram', icon: <FaInstagram /> },
  { label: 'Facebook', icon: <FaFacebookF /> },
  { label: 'Pinterest', icon: <FaPinterestP /> },
  { label: 'YouTube', icon: <FaYoutube /> },
  { label: 'WhatsApp', icon: <FaWhatsapp /> },
  { label: 'X', icon: <FaXTwitter /> },
];

const linkCls =
  'text-sm text-ivory/70 hover:text-ivory transition-colors leading-relaxed';

function ColumnTitle({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-[0.78rem] font-bold tracking-[0.2em] uppercase text-ivory mb-5">
      {children}
    </h3>
  );
}

export default function Footer() {
  return (
    <footer className="bg-maroon-deep text-ivory">
      {/* The GnanRudh Circle — centred editorial newsletter band. Reads
          as a quiet letter from the house instead of a split marketing
          banner. Gold hairline + diamond ornament top and bottom, a
          single centred column with the headline, a short note, and an
          inline subscribe form. */}
      <div className="bg-bone text-ink border-b border-ink/10">
        <div className="max-w-[720px] mx-auto px-6 md:px-10 py-16 md:py-20 text-center">
          {/* Decorative rangoli ornament — slow 360° rotation + gentle
              breathing scale. Pauses when the user prefers reduced
              motion (see globals.css). */}
          <Image
            src="/homebanner/rangoli3.png"
            alt=""
            width={120}
            height={120}
            draggable={false}
            aria-hidden
            className="newsletter-rangoli mx-auto h-10 md:h-12 w-auto select-none mb-6"
          />

          <div className="text-[0.68rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-gold mb-5">
            The GnanRudh Circle
          </div>

          <h2
            className="text-3xl md:text-[2.75rem] lg:text-5xl leading-[1.05] mb-5"
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
            Be first to see new arrivals
          </h2>

          <p className="text-sm md:text-base text-ink/70 leading-relaxed max-w-md mx-auto mb-8">
            Festive drops, trunk shows and early previews — a quiet note
            from the house, once a month, never more.
          </p>

          <form
            className="max-w-[460px] mx-auto"
            onSubmit={(e) => e.preventDefault()}
          >
            {/* Minimal inline field — hairline border on top & bottom
                only, no card. Gold focus accent. */}
            <div className="flex items-center border-y border-ink/25 focus-within:border-gold transition-colors">
              <LuMail
                size={18}
                strokeWidth={1.5}
                className="ml-1 text-ink/45 shrink-0"
                aria-hidden
              />
              <input
                type="email"
                required
                placeholder="your@email.com"
                aria-label="Email address"
                className="newsletter-input flex-1 bg-transparent px-3 py-4 font-sans text-sm font-medium text-ink placeholder:font-normal placeholder:text-ink/40 outline-none text-center"
              />
              <button
                type="submit"
                aria-label="Subscribe"
                className="group inline-flex items-center gap-2 text-ink hover:text-maroon text-[0.7rem] md:text-[0.78rem] font-bold tracking-[0.25em] uppercase pl-3 pr-1 py-4 transition-colors"
              >
                Subscribe
                <LuArrowRight
                  size={16}
                  strokeWidth={2.25}
                  aria-hidden
                  className="transition-transform group-hover:translate-x-0.5"
                />
              </button>
            </div>
            <p className="mt-4 text-[0.7rem] md:text-xs text-ink/50 italic">
              No spam. Unsubscribe any time. We&apos;ll never share your email.
            </p>
          </form>

        </div>
      </div>

      <div className="max-w-[1720px] mx-auto px-6 md:px-10 lg:px-16 pt-12 md:pt-14 pb-5">
        {/* Brand mast — logo lockup + short house description, centered
            above the link grid. Reads as the footer's "signature line"
            before the dense linkage beneath. */}
        <div className="text-center max-w-2xl mx-auto pb-10 md:pb-12 border-b border-ivory/10 mb-10 md:mb-12">
          <Image
            src="/footer-logo.png"
            alt="House Of GnanRudh"
            width={320}
            height={320}
            className="mx-auto h-28 md:h-32 lg:h-36 w-auto select-none"
            draggable={false}
          />
          <p className="mt-4 text-sm md:text-base text-ivory/70 leading-relaxed">
            A house of heirloom silk sarees — Kanjeevaram, Banarasi, Mysore
            Silk, Mangalagiri, Pochampally, Gadwal, Patola and more. Each
            drape is hand-woven, hand-finished, and made to be passed on
            across generations. Shipped worldwide from India.
          </p>
        </div>

        {/* Link grid. Four content columns on the left, then a Client
            Care action column (Track Order / Store Locator / Contact),
            then socials & currency on the far right — Nalli pattern. */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-x-8 gap-y-10 pb-10 md:pb-12">
          <div>
            <ColumnTitle>Shop</ColumnTitle>
            <ul className="space-y-2.5">
              <li><FooterLink href="/shop" className={linkCls}>All Sarees</FooterLink></li>
              <li><FooterLink href="/shop?sort=new" className={linkCls}>New In</FooterLink></li>
              <li><FooterLink href="/shop?tier=bridal" className={linkCls}>Bridal</FooterLink></li>
              <li><FooterLink href="/shop?tier=festive" className={linkCls}>Festive</FooterLink></li>
              <li><FooterLink href="/shop?tier=everyday" className={linkCls}>Everyday</FooterLink></li>
              <li><FooterLink href="/bespoke" className={linkCls}>Bespoke</FooterLink></li>
              <li><FooterLink href="/shop?sale=1" className={linkCls}>Sale</FooterLink></li>
            </ul>
          </div>

          <div>
            <ColumnTitle>Weaves</ColumnTitle>
            <ul className="space-y-2.5">
              <li><FooterLink href="/shop?weave=Kanjivaram" className={linkCls}>Kanjeevaram</FooterLink></li>
              <li><FooterLink href="/shop?weave=Banarasi" className={linkCls}>Banarasi</FooterLink></li>
              <li><FooterLink href="/shop?weave=Mysore+Silk" className={linkCls}>Mysore Silk</FooterLink></li>
              <li><FooterLink href="/shop?weave=Mangalagiri" className={linkCls}>Mangalagiri</FooterLink></li>
              <li><FooterLink href="/shop?weave=Pochampally" className={linkCls}>Pochampally</FooterLink></li>
              <li><FooterLink href="/shop?weave=Gadwal" className={linkCls}>Gadwal</FooterLink></li>
              <li><FooterLink href="/shop?weave=Patola" className={linkCls}>Patola</FooterLink></li>
              <li><FooterLink href="/shop?weave=Fancy+Sarees" className={linkCls}>Fancy Sarees</FooterLink></li>
              <li><FooterLink href="/shop?weave=Mixed+Pattu+Sarees" className={linkCls}>Mixed Pattu Sarees</FooterLink></li>
            </ul>
          </div>

          <div>
            <ColumnTitle>Company</ColumnTitle>
            <ul className="space-y-2.5">
              <li><FooterLink href="/about" className={linkCls}>About Us</FooterLink></li>
              <li><FooterLink href="/blog" className={linkCls}>Blog</FooterLink></li>
              <li><FooterLink href="/account" className={linkCls}>My Account</FooterLink></li>
              <li><FooterLink href="/account/orders" className={linkCls}>My Orders</FooterLink></li>
            </ul>
          </div>

          <div>
            <ColumnTitle>Help &amp; Policies</ColumnTitle>
            <ul className="space-y-2.5">
              <li><FooterLink href="/shipping" className={linkCls}>Shipping Policy</FooterLink></li>
              <li><FooterLink href="/returns" className={linkCls}>Return &amp; Refund Policy</FooterLink></li>
              <li><FooterLink href="/care" className={linkCls}>Care Guide</FooterLink></li>
              <li><FooterLink href="/privacy" className={linkCls}>Privacy Policy</FooterLink></li>
              <li><FooterLink href="/terms" className={linkCls}>Terms &amp; Conditions</FooterLink></li>
              <li><FooterLink href="/contact" className={linkCls}>Contact Us</FooterLink></li>
            </ul>
          </div>

          {/* Visit the Boutique — real address, phone, email and hours,
              Nalli-style icon-led rows stacked vertically. */}
          <div className="col-span-2 md:col-span-2 lg:col-span-2">
            <ColumnTitle>Visit the Boutique</ColumnTitle>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-ivory/80">
                <LuMapPin size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
                <span className="text-sm leading-snug">
                  {BOUTIQUE.addressLine1}
                  <br />
                  {BOUTIQUE.addressLine2}
                  <br />
                  <a
                    href={BOUTIQUE.mapsHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-1 text-xs text-ivory/70 hover:text-ivory underline underline-offset-4 transition-colors"
                  >
                    Get directions
                  </a>
                </span>
              </li>
              <li>
                <a
                  href={BOUTIQUE.phoneHref}
                  className="flex items-center gap-3 text-ivory/80 hover:text-ivory transition-colors"
                >
                  <LuPhone size={18} strokeWidth={1.75} className="shrink-0" aria-hidden />
                  <span className="text-sm">{BOUTIQUE.phoneLabel}</span>
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${BOUTIQUE.email}`}
                  className="flex items-center gap-3 text-ivory/80 hover:text-ivory transition-colors"
                >
                  <LuMail size={18} strokeWidth={1.75} className="shrink-0" aria-hidden />
                  <span className="text-sm break-all">{BOUTIQUE.email}</span>
                </a>
              </li>
              <li className="pt-1 space-y-1.5">
                {BOUTIQUE.hours.map((h) => (
                  <div
                    key={h.days}
                    className="flex items-baseline justify-between gap-4 text-xs text-ivory/65"
                  >
                    <span>{h.days}</span>
                    <span className="tabular-nums">{h.time}</span>
                  </div>
                ))}
              </li>
            </ul>
          </div>

          {/* Socials column — icons only, no links. Wraps to a 4x2
              grid at the narrower footer width so six brands stay in
              their column instead of stretching across. */}
          <div className="col-span-2 md:col-span-2 lg:col-span-1">
            <ColumnTitle>Follow Us</ColumnTitle>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-4 max-w-[10rem] text-[1.35rem] text-ivory/80">
              {socials.map((s) => (
                <span
                  key={s.label}
                  aria-label={s.label}
                  className="inline-flex items-center justify-center cursor-default"
                >
                  {s.icon}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row — thin hairline, address left, copyright right.
            Minimal; no gold accents, no decorative flourishes. */}
        <div className="border-t border-ivory/15 pt-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-2 text-[0.72rem] text-ivory/55">
          <div>
            House Of GnanRudh Private Limited · Hand-woven in India · Shipping worldwide
          </div>
          <div>
            © {new Date().getFullYear()} House Of GnanRudh. All Rights Reserved. ·
            Developed by{' '}
            <a
              href="https://www.nakshatranamahacreations.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ivory/70 hover:text-ivory transition-colors underline underline-offset-2"
            >
              Nakshatra Namaha Creations
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
