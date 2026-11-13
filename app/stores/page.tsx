import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { PiStorefront, PiPhone, PiClock, PiMapPin } from 'react-icons/pi';
import { LuArrowUpRight } from 'react-icons/lu';

export const metadata: Metadata = {
  title: 'Our Stores · House Of GnanRudh',
  description:
    'Visit House Of GnanRudh — our flagship in Nellore and partner outlets across South India. Addresses, hours, direct phone lines, and directions.',
};

// Store roster. Keep metadata flat so the per-card renderer stays simple.
// When a new branch opens, just push an entry onto the array.
type Store = {
  id: string;
  city: string;
  name: string;
  tagline: string;
  image: string;
  address: string;
  phone: string;
  hours: string;
  tier: string;
  mapsQuery: string;
};

// TODO: replace the placeholder fields below with the real Nellore
// storefront details (address line, phone number, hours) before launch.
const STORES: Store[] = [
  {
    id: 'nellore',
    city: 'Nellore',
    name: 'House Of GnanRudh — Nellore',
    tagline: 'Our flagship atelier',
    image: '/homebanner/banner2.png',
    address: 'Shop No. 12, Trunk Road, Nellore, Andhra Pradesh 524001',
    phone: '+91 98765 43210',
    hours: 'Mon – Sat · 10:00 AM – 9:00 PM  ·  Sun · 11:00 AM – 8:00 PM',
    tier: 'Flagship · Bridal Suite · Heirloom Collection',
    mapsQuery: 'Shop+No+12+Trunk+Road+Nellore+Andhra+Pradesh+524001',
  },
];

export default function StoresPage() {
  return (
    <main className="bg-white text-ink">
      {/* Page header — editorial, no photograph. */}
      <section className="bg-ivory border-b border-gold-deep/15">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 md:py-16 text-center">
          <div className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-gold-deep mb-3">
            Visit us
          </div>
          <h1 className="font-display text-4xl md:text-5xl lg:text-[3.25rem] text-ink leading-[1.05]">
            Our Stores
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-ink/65 leading-relaxed">
            Walk through our aisles of hand-woven silks, meet the drape in
            person, and let our studio help you pick the one that chooses you.
          </p>
        </div>
      </section>

      {/* Store list — alternating layout; each store is a self-contained
          card with photograph, meta, and an embedded map. */}
      <section className="max-w-[1400px] mx-auto px-6 lg:px-10 py-14 md:py-16">
        <div className="flex flex-col gap-16 md:gap-20">
          {STORES.map((s, i) => (
            <StoreBlock key={s.id} store={s} index={i} />
          ))}
        </div>
      </section>

      {/* Closing CTA — appointment nudge. */}
      <section className="bg-ivory border-t border-gold-deep/15">
        <div className="max-w-[900px] mx-auto px-6 lg:px-10 py-14 md:py-16 text-center">
          <div className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-gold-deep mb-3">
            Private viewing
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-ink leading-tight mb-3 tracking-tight">
            Book an unhurried hour with our studio
          </h2>
          <p className="text-sm md:text-base text-ink/65 leading-relaxed mb-6 max-w-lg mx-auto">
            Tell us the occasion. We'll set aside pieces from the vault, pour
            you a cup of filter coffee, and walk you through the drapes at
            your pace.
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 bg-ink text-white px-8 py-3.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-black transition-colors"
          >
            Request appointment
            <LuArrowUpRight size={14} strokeWidth={2} aria-hidden />
          </Link>
        </div>
      </section>
    </main>
  );
}

function StoreBlock({ store, index }: { store: Store; index: number }) {
  // Alternate image ↔ info side on desktop so the roster reads as a
  // scroll of varied compositions instead of a single rigid grid.
  const flip = index % 2 === 1;
  const mapSrc = `https://www.google.com/maps?q=${store.mapsQuery}&output=embed`;
  const dirUrl = `https://www.google.com/maps/dir/?api=1&destination=${store.mapsQuery}`;

  return (
    <article className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch">
      {/* Left (or right on flip): hero photo */}
      <div
        className={`relative w-full aspect-[4/3] lg:aspect-auto overflow-hidden bg-bone ${
          flip ? 'lg:order-2' : ''
        }`}
      >
        <Image
          src={store.image}
          alt={`${store.name} storefront`}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-ink/70 via-ink/30 to-transparent px-6 py-5 text-white">
          <div className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-gold-soft mb-1">
            {store.tagline}
          </div>
          <div className="font-display text-2xl md:text-[1.75rem] leading-tight">
            {store.city}
          </div>
        </div>
      </div>

      {/* Info + map column */}
      <div className="flex flex-col">
        <div className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-gold-deep mb-2">
          Store details
        </div>
        <h3 className="text-2xl md:text-[1.9rem] font-extrabold text-ink leading-tight mb-5 tracking-tight">
          {store.name}
        </h3>

        <dl className="space-y-4 text-sm text-ink mb-5">
          <MetaRow icon={<PiMapPin size={18} aria-hidden />} label="Address">
            {store.address}
          </MetaRow>
          <MetaRow icon={<PiPhone size={18} aria-hidden />} label="Phone">
            <a
              href={`tel:${store.phone.replace(/\s+/g, '')}`}
              className="hover:text-gold-deep transition-colors"
            >
              {store.phone}
            </a>
          </MetaRow>
          <MetaRow icon={<PiClock size={18} aria-hidden />} label="Hours">
            {store.hours}
          </MetaRow>
          <MetaRow icon={<PiStorefront size={18} aria-hidden />} label="Format">
            {store.tier}
          </MetaRow>
        </dl>

        {/* Embedded map */}
        <div className="relative aspect-[16/9] w-full overflow-hidden bg-bone border border-ink/10 mb-5">
          <iframe
            src={mapSrc}
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title={`Map to ${store.name}`}
            className="absolute inset-0 w-full h-full border-0"
          />
        </div>

        {/* Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          <a
            href={dirUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 border border-ink text-ink py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] hover:bg-ink hover:text-white transition-colors"
          >
            Get Directions
            <LuArrowUpRight size={12} strokeWidth={2.2} aria-hidden />
          </a>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center border border-ink text-ink py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] hover:bg-ink hover:text-white transition-colors"
          >
            Book Appointment
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center bg-ink text-white py-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] hover:bg-black transition-colors"
          >
            View Collection
          </Link>
        </div>
      </div>
    </article>
  );
}

function MetaRow({
  icon,
  label,
  children,
}: {
  icon: React.ReactNode;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-gold-deep shrink-0 mt-0.5" aria-hidden>
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[0.65rem] font-bold tracking-[0.22em] uppercase text-ink/60 mb-1">
          {label}
        </dt>
        <dd className="text-[0.95rem] font-semibold text-ink leading-relaxed">{children}</dd>
      </div>
    </div>
  );
}
