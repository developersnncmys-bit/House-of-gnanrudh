'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import BespokeInquiryForm from './BespokeInquiryForm';

const PROCESS_STEPS: { num: string; title: string; body: string }[] = [
  {
    num: '01',
    title: 'Share your vision',
    body: 'Tell us the occasion, the weave you have in mind, the colour palette and motifs that feel like you. Family heirloom references and bridal pictures are welcome — they help us understand your world.',
  },
  {
    num: '02',
    title: 'A conversation with our stylist',
    body: 'A House of GnanRudh stylist calls you within 48 hours to shape the design — fabric grade, silver-gold zari weight, border proportions and motif layout. You receive a quote and a signed design brief.',
  },
  {
    num: '03',
    title: 'Hand-woven in its native cluster',
    body: 'Your piece is set up on the pit-loom that knows it best — Kanchipuram for Kanjeevaram, Varanasi for Banarasi, Patan for Patola. 12–16 weeks for bridal grades, 8–10 for festive.',
  },
  {
    num: '04',
    title: 'Final finish & insured delivery',
    body: 'Every bespoke piece passes our five-step finish check at the Nellore atelier. We photograph the finished saree for your approval before it ships — insured, tracked, signature on delivery.',
  },
];

// Atelier commissions — three editorial vignettes, each with a story
// line about the brief the client gave us. Swap the source images for
// new photographs any time; the layout accepts any aspect ratio.
const GALLERY: { src: string; weave: string; title: string; story: string; season: string }[] = [
  {
    src: '/homebanner/Mayura%20kanjeevaram.webp',
    weave: 'Kanjeevaram',
    title: 'The Mayura Bridal',
    story: 'A temple-border Kanjeevaram in jamun silk and silver-gold zari, commissioned for a Hyderabad wedding — hand-loomed over 14 weeks in Kanchipuram.',
    season: 'Delivered · Winter 2026',
  },
  {
    src: '/homebanner/raktharani%20banarasi.webp',
    weave: 'Banarasi',
    title: 'Raktarani Reception',
    story: 'A deep-red Banarasi with meenakari kalga motifs across the pallu, woven on a Varanasi pit-loom in a 90/10 pure-silk warp.',
    season: 'Delivered · Autumn 2026',
  },
  {
    src: '/homebanner/Rasleela%20Patola.webp',
    weave: 'Patola',
    title: 'Rasleela Double-Ikat',
    story: 'A Patan Patola in an heirloom chokhta grid — 11 months on the loom, resist-dyed warp and weft, every motif meeting at the join.',
    season: 'Delivered · Summer 2026',
  },
];

// Signature weaves available on commission — mirrors the house's
// catalogue so clients know exactly what the atelier is set up to make.
const COMMISSIONABLE_WEAVES: { name: string; note: string }[] = [
  { name: 'Kanjeevaram', note: 'Pure mulberry silk · temple-border tradition' },
  { name: 'Banarasi', note: 'Pit-loom pure silk · Varanasi' },
  { name: 'Mysore Silk', note: 'Crepe silk · classic palette' },
  { name: 'Patola', note: 'Double-ikat · Patan heirloom' },
  { name: 'Mangalagiri', note: 'Hand-spun cotton · everyday grace' },
  { name: 'Pochampally', note: 'Telangana ikat · modern palette' },
  { name: 'Gadwal', note: 'Cotton body, silk pallu · signature join' },
  { name: 'Fancy Sarees', note: 'Contemporary blends · occasion-ready' },
  { name: 'Mixed Pattu', note: 'Festival-ready silk blends' },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: 'How long does a bespoke saree take?',
    a: 'At the House of GnanRudh atelier, bridal-grade Kanjeevaram and Banarasi pieces take 12–16 weeks on the loom. Festive sarees take 8–10 weeks. Patola, being a double-ikat weave, can take 6 months to a year depending on how dense the pattern is.',
  },
  {
    q: 'What does a bespoke piece cost?',
    a: 'Our bespoke commissions start at ₹35,000 for a festive weave and go up to ₹3,00,000 and beyond for a bridal piece in pure silver-gold zari. A 30% deposit confirms the commission; the balance is collected after you approve the finished-saree photographs.',
  },
  {
    q: 'Can I visit the atelier while my saree is being made?',
    a: 'Yes. Clients in Nellore are warmly welcome at our Trunk Road boutique by appointment. For everyone else we send progress photographs every two weeks, and you can request a live video walkthrough with the weaver at any stage.',
  },
  {
    q: 'Which weaves can the GnanRudh atelier commission?',
    a: 'We commission every weave the house carries — Kanjeevaram, Banarasi, Mysore Silk, Mangalagiri, Pochampally, Gadwal, Patola, our Fancy Sarees line and Mixed Pattu blends. Each piece is woven in its native cluster by weavers we have worked with for years.',
  },
  {
    q: 'Is the bespoke order refundable?',
    a: 'Up until weaving begins, the 30% deposit is fully refundable — no questions asked. Once the loom is set up for your piece, the deposit is non-refundable because every bespoke saree is one of a kind. The balance only moves after you have approved the finished-saree photographs.',
  },
  {
    q: 'Do you ship bespoke pieces worldwide?',
    a: 'Yes — insured, tracked and signature-on-delivery, from our Nellore atelier to your doorstep. Customs and duties are pre-paid by us for most countries. Delivery typically takes 7–10 working days after dispatch.',
  },
];

export default function BespokeView() {
  return (
    <div className="bg-white min-h-screen text-ink">
      {/* Breadcrumb */}
      <div className="border-b border-ink/10 bg-bone">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-3">
          <nav aria-label="Breadcrumb" className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon">
            <Link href="/" className="hover:text-maroon-deep">Home</Link>
            <span className="mx-1.5 text-ink/30">/</span>
            <span className="text-ink/70">Bespoke</span>
          </nav>
        </div>
      </div>

      {/* Hero — full-bleed photograph, no dark overlay. Text sits on the
          right with a drop-shadow on the gold headline for legibility
          over the darker right-hand region of the image. */}
      <section className="relative text-ivory overflow-hidden h-[calc(85vh-10px)] min-h-[470px] sm:min-h-[550px] md:min-h-[610px] max-h-[890px]">
        <Image
          src="/homebanner/bespoke.png"
          alt=""
          fill
          sizes="100vw"
          className="object-cover"
          style={{ objectPosition: '50% 22%' }}
          priority
        />

        <div className="relative max-w-[1720px] mx-auto px-6 md:px-10 lg:px-14 h-full flex items-center md:justify-end">
          <div className="max-w-lg md:max-w-[min(32rem,42vw)]">
            {/* Eyebrow — matches the Hero slides (same track + weight) */}
            <div
              className="text-xs md:text-sm font-medium text-ivory/80 mb-3 uppercase tracking-[0.2em]"
              style={{ filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.55))' }}
            >
              The GnanRudh Atelier · By Appointment
            </div>
            {/* Metallic-gold Italiana display headline — identical gradient
                treatment to the home Hero so the two banners read as one
                script-face family. */}
            <h1
              className="text-5xl md:text-7xl lg:text-7xl font-semibold leading-[1] mb-5"
              style={{
                fontFamily: 'var(--font-hero), "Italiana", Georgia, serif',
                backgroundImage:
                  'linear-gradient(135deg, #8A5A1F 0%, #C8923F 20%, #F2C99E 45%, #FFF2D6 50%, #F2C99E 55%, #C8923F 80%, #8A5A1F 100%)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: 'transparent',
                filter:
                  'drop-shadow(0 2px 6px rgba(0,0,0,0.55)) drop-shadow(0 0 1px rgba(242,201,158,0.3))',
              }}
            >
              A Saree Woven Only For You
            </h1>
            <p
              className="text-sm md:text-base text-ivory leading-relaxed mb-7 max-w-md"
              style={{ filter: 'drop-shadow(0 1px 4px rgba(0,0,0,0.65))' }}
            >
              A House of GnanRudh bespoke commission — your weave, your palette,
              your motifs, your zari. Woven on the pit-looms of its native
              cluster and finished at our Nellore atelier, 12–16 weeks from the
              first conversation to the piece in your hand.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <a
                href="#inquiry"
                className="inline-flex items-center bg-white hover:bg-ivory text-ink px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] rounded-sm transition-colors"
              >
                Start an inquiry
              </a>
              <a
                href="#process"
                className="inline-flex items-center border border-ivory/60 text-ivory px-6 sm:px-7 py-2.5 sm:py-3 text-xs sm:text-sm font-bold uppercase tracking-[0.18em] rounded-sm hover:bg-ivory/10 backdrop-blur-sm transition-colors"
              >
                How it works
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Stats band — three editorial stats on bone, promoted from the
          hero so they read as their own section. */}
      <section className="bg-bone border-y border-ink/10">
        <div className="max-w-[1720px] mx-auto px-6 md:px-10 lg:px-14 py-8 md:py-10 grid grid-cols-3 gap-6 md:gap-10">
          <StatEditorial label="Lead Time" value="12–16 wks" />
          <StatEditorial label="Starting At" value="₹35,000" />
          <StatEditorial label="Master Weavers" value="40+" />
        </div>
      </section>

      {/* Process */}
      <section id="process" className="bg-white border-t border-ink/10">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <div className="text-center mb-10 lg:mb-12">
            <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon mb-3">
              Our Process
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
              From First Conversation to the Pit-Loom
            </h2>
            <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-5" />
            <p className="mt-5 text-sm md:text-base text-ink/65 max-w-2xl mx-auto leading-relaxed">
              Four unhurried steps, led by a House of GnanRudh stylist and the
              weaver who will set up the loom for your piece. Clear quotes, no
              surprises, and progress photographs every two weeks.
            </p>
          </div>
          <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
            {PROCESS_STEPS.map((step) => (
              <li
                key={step.num}
                className="bg-bone border border-ink/10 p-6 lg:p-7 hover:border-ink/25 transition-colors"
              >
                <div className="font-display text-4xl md:text-5xl font-semibold text-maroon-deep mb-3 tabular-nums leading-none">
                  {step.num}
                </div>
                <span aria-hidden className="block h-px w-8 bg-gold/70 mb-4" />
                <h3 className="text-base md:text-lg font-bold text-ink mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-ink/70 leading-relaxed">
                  {step.body}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Gallery */}
      <section className="bg-bone border-t border-ink/10">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <div className="text-center mb-10 lg:mb-12">
            <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon mb-3">
              From the GnanRudh Atelier
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
              Recently Hand-Finished
            </h2>
            <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-5" />
            <p className="mt-5 text-sm md:text-base text-ink/65 max-w-2xl mx-auto leading-relaxed">
              A glimpse of the commissions our weavers have delivered this
              season — each one loomed to a client&apos;s brief, finished and
              quality-checked in Nellore before dispatch.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {GALLERY.map((item, i) => (
              <article
                key={item.src}
                className="group bg-white border border-ink/10 flex flex-col hover:border-ink/25 transition-colors"
              >
                {/* Portrait photograph with a small weave eyebrow pinned
                    to the top-left — no hover-overlay, the caption lives
                    on a clean pad below so each piece reads as an
                    editorial feature, not a product tile. */}
                <div className="relative aspect-[3/4] overflow-hidden bg-bone">
                  <Image
                    src={item.src}
                    alt={`${item.weave} bespoke commission`}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                    style={{ objectPosition: '50% 20%' }}
                  />
                  <div className="absolute top-4 left-4">
                    <span className="inline-block bg-ivory/95 backdrop-blur-sm text-ink text-[0.6rem] font-bold uppercase tracking-[0.25em] px-3 py-1.5">
                      No. {String(i + 1).padStart(2, '0')} · {item.weave}
                    </span>
                  </div>
                </div>
                {/* Editorial caption pad */}
                <div className="flex-1 flex flex-col px-6 py-6 md:px-7 md:py-7">
                  <h3 className="font-display text-xl md:text-2xl font-semibold text-ink leading-tight">
                    {item.title}
                  </h3>
                  <span aria-hidden className="block h-px w-8 bg-gold/70 my-4" />
                  <p className="text-sm text-ink/70 leading-relaxed">
                    {item.story}
                  </p>
                  <div className="mt-5 pt-4 border-t border-ink/10 flex items-center justify-between">
                    <span className="text-[0.65rem] font-bold tracking-[0.25em] uppercase text-ink/50">
                      {item.season}
                    </span>
                    <a
                      href="#inquiry"
                      className="text-[0.7rem] font-bold tracking-[0.25em] uppercase text-maroon hover:text-maroon-deep transition-colors inline-flex items-center gap-1.5"
                    >
                      Commission similar
                      <span aria-hidden className="transition-transform group-hover:translate-x-0.5">→</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Link
              href="/shop?sort=new"
              className="inline-flex items-center gap-2 text-[0.7rem] font-bold tracking-[0.25em] uppercase text-maroon hover:text-maroon-deep transition-colors"
            >
              See all sarees
              <span aria-hidden className="transition-transform duration-300 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Signature weaves we commission — a clear menu so clients know
          exactly which traditions the GnanRudh atelier is set up for. */}
      <section className="bg-white border-t border-ink/10">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <div className="text-center mb-10 lg:mb-12">
            <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon mb-3">
              Our House of Weaves
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
              Traditions We Commission
            </h2>
            <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-5" />
            <p className="mt-5 text-sm md:text-base text-ink/65 max-w-2xl mx-auto leading-relaxed">
              Every weave in the House of GnanRudh catalogue is available on
              commission. Each is loomed by the cluster that knows it best —
              Kanchipuram, Varanasi, Patan, Pochampally and beyond.
            </p>
          </div>
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-px bg-ink/10 border border-ink/10">
            {COMMISSIONABLE_WEAVES.map((w) => (
              <li
                key={w.name}
                className="bg-white px-5 py-5 lg:px-6 lg:py-6 hover:bg-bone/50 transition-colors"
              >
                <div className="font-display text-xl md:text-2xl font-semibold text-ink leading-tight">
                  {w.name}
                </div>
                <div className="mt-1.5 text-xs md:text-sm text-ink/60 leading-relaxed">
                  {w.note}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Inquiry form */}
      <section id="inquiry" className="bg-white border-t border-ink/10 scroll-mt-32">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon mb-3">
                Begin a Commission
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
                Tell the Atelier About Your Piece
              </h2>
              <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-5" />
              <p className="mt-5 text-sm md:text-base text-ink/65 leading-relaxed">
                A House of GnanRudh stylist will call you within 48 hours.
                There&apos;s no commitment until you have approved the design,
                the quote and the finished-saree photographs.
              </p>
            </div>
            <BespokeInquiryForm />
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="bg-bone border-t border-ink/10">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-14 lg:py-20">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-10">
              <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon mb-3">
                Good to Know
              </div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold text-ink leading-tight">
                Questions Our Clients Ask
              </h2>
              <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-5" />
            </div>
            <div className="bg-white border border-ink/15">
              {FAQS.map((f, i) => (
                <FaqRow key={i} q={f.q} a={f.a} defaultOpen={i === 0} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust strip */}
      <section className="bg-bone border-t border-ink/10">
        <div className="max-w-[1720px] mx-auto px-4 lg:px-8 py-8 grid grid-cols-2 md:grid-cols-4 gap-5">
          <Trust icon="hand" label="Hand-woven in native clusters" />
          <Trust icon="shield" label="Finished at the Nellore atelier" />
          <Trust icon="truck" label="Insured worldwide delivery" />
          <Trust icon="phone" label="Stylist support seven days a week" />
        </div>
      </section>
    </div>
  );
}

function StatEditorial({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-center">
      <div className="font-display text-2xl md:text-3xl lg:text-4xl font-semibold text-ink tabular-nums leading-none">
        {value}
      </div>
      <span aria-hidden className="block mx-auto h-px w-8 bg-gold/70 my-3" />
      <div className="text-[0.65rem] md:text-[0.7rem] font-bold tracking-[0.3em] uppercase text-maroon">
        {label}
      </div>
    </div>
  );
}

function Trust({ icon, label }: { icon: 'hand' | 'shield' | 'truck' | 'phone'; label: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-ink/75">
      <span className="w-11 h-11 rounded-full bg-white border border-gold/40 ring-1 ring-gold/20 flex items-center justify-center text-maroon-deep shrink-0">
        <Icon name={icon} />
      </span>
      <span className="font-semibold text-ink">{label}</span>
    </div>
  );
}

function Icon({ name }: { name: 'hand' | 'shield' | 'truck' | 'phone' }) {
  const c = {
    width: 18, height: 18, viewBox: '0 0 24 24', fill: 'none',
    stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const, 'aria-hidden': true,
  };
  switch (name) {
    case 'hand':
      return (<svg {...c}><path d="M9 11V5a2 2 0 1 1 4 0v6" /><path d="M13 11V4a2 2 0 1 1 4 0v9" /><path d="M17 13V7a2 2 0 1 1 4 0v9a6 6 0 0 1-6 6h-3a8 8 0 0 1-8-8v-2a2 2 0 1 1 4 0v2" /></svg>);
    case 'shield':
      return (<svg {...c}><path d="M12 3 4 6v6c0 5 4 8 8 9 4-1 8-4 8-9V6z" /></svg>);
    case 'truck':
      return (<svg {...c}><path d="M3 7h11v9H3zM14 11h4l3 3v2h-7z" /><circle cx="7" cy="18" r="1.6" /><circle cx="17.5" cy="18" r="1.6" /></svg>);
    case 'phone':
      return (<svg {...c}><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.79 19.79 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.96.34 1.9.66 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.32 1.85.54 2.81.66A2 2 0 0 1 22 16.92Z" /></svg>);
  }
}

function FaqRow({ q, a, defaultOpen = false }: { q: string; a: string; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-ink/10 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="w-full flex items-center justify-between py-5 px-6 text-left group"
      >
        <span className="text-sm md:text-base font-semibold text-ink group-hover:text-maroon-deep transition-colors pr-4">
          {q}
        </span>
        <span className={`text-2xl text-ink/40 transition-transform shrink-0 ${open ? 'rotate-45' : ''}`}>
          +
        </span>
      </button>
      {open && (
        <p className="pb-5 px-6 text-sm text-ink/75 leading-relaxed">{a}</p>
      )}
    </div>
  );
}

