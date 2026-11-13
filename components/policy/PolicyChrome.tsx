import Link from 'next/link';

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1 1 .3 1.9.6 2.8a2 2 0 0 1-.4 2.1L7.9 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.8.6A2 2 0 0 1 22 16.9Z" />
    </svg>
  );
}

function FormIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 4h12l4 4v12a0 0 0 0 1 0 0H4Z" />
      <path d="M16 4v4h4" />
      <path d="M8 13h8M8 17h5" />
    </svg>
  );
}

export function PolicyHeader({
  title,
  breadcrumb,
  updated = '12 November 2026',
}: {
  title: string;
  breadcrumb: string;
  updated?: string;
}) {
  return (
    <header className="border-b border-ink/10 bg-bone">
      <div className="max-w-[1100px] mx-auto px-6 lg:px-10 pt-16 pb-12 md:pt-20 md:pb-14 text-center">
        <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon">
          {breadcrumb}
        </div>
        <h1 className="mt-3 font-display text-3xl md:text-4xl lg:text-5xl font-semibold text-ink leading-tight">
          {title}
        </h1>
        <span aria-hidden className="block mx-auto h-px w-12 bg-gold/70 mt-5" />
        <p className="mt-4 text-[0.72rem] tracking-[0.2em] uppercase font-semibold text-ink/55">
          Last updated · {updated}
        </p>
      </div>
    </header>
  );
}

export function PolicyBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10 first:mt-0">
      <h2 className="text-sm md:text-[0.95rem] font-bold text-ink border-b border-ink/15 pb-2.5 mb-5 uppercase tracking-[0.12em]">
        {title}
      </h2>
      <div className="text-sm text-ink/80 leading-relaxed">{children}</div>
    </section>
  );
}

export function PolicyTable({
  head,
  rows,
}: {
  head: string[];
  rows: (readonly string[])[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border border-ink/15">
        <thead className="bg-bone">
          <tr>
            {head.map((h) => (
              <th
                key={h}
                className="text-left px-4 py-3 text-[0.7rem] font-bold uppercase tracking-[0.12em] text-ink border-b border-ink/15"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-ink/10 last:border-b-0">
              {r.map((cell, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 align-top ${
                    j === 0 ? 'font-semibold text-ink' : 'text-ink/75'
                  }`}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function PolicyContactStrip({
  title = 'Still have a question?',
  subtitle = 'Our care team replies within one working day.',
}: {
  title?: string;
  subtitle?: string;
} = {}) {
  return (
    <div className="mt-12 bg-bone border border-ink/15">
      {/* Head row — title + eyebrow */}
      <div className="px-6 md:px-8 pt-7 pb-5 border-b border-ink/10 text-center">
        <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon">
          Need a hand?
        </div>
        <h3 className="mt-2 font-display text-xl md:text-2xl font-semibold text-ink leading-tight">
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-ink/65 max-w-md mx-auto leading-relaxed">
          {subtitle}
        </p>
        <span aria-hidden className="block mx-auto h-px w-10 bg-gold/70 mt-4" />
      </div>

      {/* Contact rows — three action cards side by side */}
      <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-ink/10">
        <a
          href="mailto:hello@houseofgnanrudh.com"
          className="group flex flex-col items-center text-center px-5 py-6 hover:bg-white transition-colors"
        >
          <span aria-hidden className="w-11 h-11 rounded-full bg-white border border-ink/15 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-white group-hover:border-ink transition-colors">
            <MailIcon />
          </span>
          <div className="mt-3 text-[0.65rem] tracking-[0.25em] uppercase font-bold text-ink/55">
            Email us
          </div>
          <div className="mt-1 text-sm font-semibold text-ink group-hover:text-maroon-deep transition-colors break-all">
            hello@houseofgnanrudh.com
          </div>
        </a>

        <a
          href="tel:+919876543210"
          className="group flex flex-col items-center text-center px-5 py-6 hover:bg-white transition-colors"
        >
          <span aria-hidden className="w-11 h-11 rounded-full bg-white border border-ink/15 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-white group-hover:border-ink transition-colors">
            <PhoneIcon />
          </span>
          <div className="mt-3 text-[0.65rem] tracking-[0.25em] uppercase font-bold text-ink/55">
            Call us
          </div>
          <div className="mt-1 text-sm font-semibold text-ink group-hover:text-maroon-deep transition-colors tabular-nums">
            +91 98765 43210
          </div>
        </a>

        <Link
          href="/contact"
          className="group flex flex-col items-center text-center px-5 py-6 hover:bg-white transition-colors"
        >
          <span aria-hidden className="w-11 h-11 rounded-full bg-white border border-ink/15 flex items-center justify-center text-ink group-hover:bg-ink group-hover:text-white group-hover:border-ink transition-colors">
            <FormIcon />
          </span>
          <div className="mt-3 text-[0.65rem] tracking-[0.25em] uppercase font-bold text-ink/55">
            Write to us
          </div>
          <div className="mt-1 text-sm font-semibold text-ink group-hover:text-maroon-deep transition-colors">
            Open contact form →
          </div>
        </Link>
      </div>

      {/* Business hours strip */}
      <div className="border-t border-ink/10 px-6 md:px-8 py-3.5 text-center bg-white">
        <span className="text-[0.7rem] font-bold tracking-[0.2em] uppercase text-ink/55">
          Business Hours ·
        </span>{' '}
        <span className="text-[0.75rem] text-ink/75">
          Mon – Sat · 10:00 AM – 9:00 PM &nbsp;·&nbsp; Sun · 11:00 AM – 8:00 PM (IST)
        </span>
      </div>
    </div>
  );
}
