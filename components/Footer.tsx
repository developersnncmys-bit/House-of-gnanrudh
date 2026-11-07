import Link from 'next/link';
import {
  FaInstagram,
  FaFacebookF,
  FaPinterestP,
  FaYoutube,
  FaWhatsapp,
  FaXTwitter,
} from 'react-icons/fa6';
import { LuMapPin, LuPhone, LuMail } from 'react-icons/lu';
import { navHref } from '@/lib/soft-launch';

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
      <div className="max-w-[1720px] mx-auto px-6 md:px-10 lg:px-16 pt-12 md:pt-14 pb-5">
        {/* Brand mast — big wordmark + short house description, centered
            above the link grid. Reads as the footer's "signature line"
            before the dense linkage beneath. */}
        <div className="text-center max-w-2xl mx-auto pb-10 md:pb-12 border-b border-ivory/10 mb-10 md:mb-12">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl font-semibold tracking-tight text-ivory">
            House Of GnanRudh
          </h2>
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
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-x-8 gap-y-10 pb-10 md:pb-12">
          <div>
            <ColumnTitle>Shop</ColumnTitle>
            <ul className="space-y-2.5">
              <li><FooterLink href="/shop" className={linkCls}>All Sarees</FooterLink></li>
              <li><FooterLink href="/shop" className={linkCls}>New In</FooterLink></li>
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

          {/* Client Care — Nalli-style icon-led shortcuts stacked
              vertically. */}
          <div>
            <ColumnTitle>Reach Us</ColumnTitle>
            <ul className="space-y-4">
              <li>
                <FooterLink
                  href="/find-a-store"
                  className="group flex items-start gap-3 text-ivory/80 hover:text-ivory transition-colors"
                >
                  <LuMapPin size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
                  <span className="text-sm leading-tight">Find a Store</span>
                </FooterLink>
              </li>
              <li>
                <a
                  href="tel:+91XXXXXXXXXX"
                  className="group flex items-start gap-3 text-ivory/80 hover:text-ivory transition-colors"
                >
                  <LuPhone size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
                  <span className="text-sm leading-tight">
                    Chat with Us
                    <br />
                    <span className="text-xs text-ivory/55">+91 XXXXX XXXXX</span>
                  </span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:support@gnanrudh.com"
                  className="group flex items-start gap-3 text-ivory/80 hover:text-ivory transition-colors"
                >
                  <LuMail size={18} strokeWidth={1.75} className="mt-0.5 shrink-0" aria-hidden />
                  <span className="text-sm leading-tight break-all">
                    Email Us
                    <br />
                    <span className="text-xs text-ivory/55">support@gnanrudh.com</span>
                  </span>
                </a>
              </li>
            </ul>
          </div>

          {/* Socials column — icons only, no links. Kept as brand
              decoration after the hrefs were removed. */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <ColumnTitle>Follow Us</ColumnTitle>
            <div className="flex items-center gap-5 text-[1.35rem] text-ivory/80">
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
