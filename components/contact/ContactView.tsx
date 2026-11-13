'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MOBILE_RE = /^[6-9]\d{9}$/;

type Subject =
  | 'general'
  | 'order'
  | 'bespoke'
  | 'returns'
  | 'press'
  | 'wholesale';

const SUBJECTS: { id: Subject; label: string }[] = [
  { id: 'general', label: 'General enquiry' },
  { id: 'order', label: 'Order help' },
  { id: 'bespoke', label: 'Bespoke commission' },
  { id: 'returns', label: 'Returns & exchange' },
  { id: 'press', label: 'Press & collaboration' },
  { id: 'wholesale', label: 'Wholesale enquiry' },
];

export default function ContactView() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [subject, setSubject] = useState<Subject>('general');
  const [message, setMessage] = useState('');
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const markTouched = (field: string) =>
    setTouched((t) => (t[field] ? t : { ...t, [field]: true }));

  const firstNameValid = firstName.trim().length >= 2;
  const lastNameValid = lastName.trim().length >= 1;
  const emailValid = EMAIL_RE.test(email.trim());
  const mobileValid = MOBILE_RE.test(mobile.trim());
  const messageValid = message.trim().length >= 10;

  const err = (field: string, hasValue: boolean, valid: boolean, msg: string) =>
    touched[field] && hasValue && !valid ? msg : '';

  const firstNameError = err('firstName', firstName.trim().length > 0, firstNameValid, 'Enter your first name (min 2 characters).');
  const lastNameError = err('lastName', lastName.trim().length > 0, lastNameValid, 'Enter your last name.');
  const emailError = err('email', email.trim().length > 0, emailValid, 'Enter a valid email address.');
  const mobileError = err('mobile', mobile.length > 0, mobileValid, 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9.');
  const messageError = err('message', message.trim().length > 0, messageValid, 'Tell us a bit more — at least 10 characters.');

  const formValid = useMemo(
    () => firstNameValid && lastNameValid && emailValid && mobileValid && messageValid,
    [firstNameValid, lastNameValid, emailValid, mobileValid, messageValid],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValid) {
      setTouched({
        firstName: true,
        lastName: true,
        email: true,
        mobile: true,
        message: true,
      });
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      const ref = `MSG-${Date.now().toString(36).slice(-5).toUpperCase()}-${Math.random().toString(36).slice(2, 5).toUpperCase()}`;
      setSubmittedRef(ref);
      setSubmitting(false);
    }, 700);
  };

  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setEmail('');
    setMobile('');
    setSubject('general');
    setMessage('');
    setTouched({});
    setSubmittedRef(null);
  };

  return (
    <main className="bg-white text-gray-900">
      {/* Editorial hero — matches the stores / about treatment. */}
      <section className="bg-ivory border-b border-gold-deep/15">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-10 py-12 md:py-16 text-center">
          <div className="text-[0.65rem] font-semibold tracking-[0.35em] uppercase text-gold-deep mb-3">
            We're listening
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold text-ink leading-[1.05] tracking-tight">
            Contact Us
          </h1>
          <p className="mt-4 max-w-xl mx-auto text-sm md:text-base text-ink/65 leading-relaxed">
            Order help, bespoke commissions, press, or just a question about a
            drape — our care team replies within one working day.
          </p>
        </div>
      </section>

      <section className="max-w-[1200px] mx-auto px-6 lg:px-10 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Form */}
          <div className="lg:col-span-7">
            {submittedRef ? (
              <SuccessPanel referenceId={submittedRef} onReset={resetForm} />
            ) : (
              <>
                <div className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-gold-deep mb-2">
                  Write to us
                </div>
                <h2 className="text-2xl md:text-[1.75rem] font-extrabold text-ink leading-tight mb-3 tracking-tight">
                  Send us a message
                </h2>
                <p className="text-sm text-ink/65 leading-relaxed mb-8">
                  Our care team replies within one working day — Monday to Saturday
                  10:00 AM – 9:00 PM, and Sunday 11:00 AM – 8:00 PM (IST).
                </p>

                <form
                  onSubmit={handleSubmit}
                  className="relative bg-white border border-ink/10 shadow-[0_18px_40px_-28px_rgba(0,0,0,0.2)] p-6 md:p-8 space-y-6"
                  noValidate
                >
                  {/* Hairline gold accent along the top edge. */}
                  <div
                    aria-hidden
                    className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-gold-deep/60 to-transparent"
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="firstName" required>First name</Label>
                      <input
                        id="firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        placeholder="Your first name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        onBlur={() => markTouched('firstName')}
                        aria-invalid={!!firstNameError}
                        className={fieldClass(!!firstNameError)}
                      />
                      <InlineError msg={firstNameError} />
                    </div>
                    <div>
                      <Label htmlFor="lastName" required>Last name</Label>
                      <input
                        id="lastName"
                        type="text"
                        required
                        autoComplete="family-name"
                        placeholder="Your last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        onBlur={() => markTouched('lastName')}
                        aria-invalid={!!lastNameError}
                        className={fieldClass(!!lastNameError)}
                      />
                      <InlineError msg={lastNameError} />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <Label htmlFor="email" required>Email</Label>
                      <input
                        id="email"
                        type="email"
                        required
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onBlur={() => markTouched('email')}
                        aria-invalid={!!emailError}
                        className={fieldClass(!!emailError)}
                      />
                      <InlineError msg={emailError} />
                    </div>
                    <div>
                      <Label htmlFor="mobile" required>Mobile number</Label>
                      <div
                        className={`flex border-b-2 transition-colors ${
                          mobileError
                            ? 'border-maroon-deep'
                            : 'border-ink/20 focus-within:border-gold-deep'
                        }`}
                      >
                        <span className="pr-3 py-3 text-sm font-semibold text-ink/70 select-none border-r border-ink/15 mr-3">
                          +91
                        </span>
                        <input
                          id="mobile"
                          type="tel"
                          required
                          inputMode="numeric"
                          maxLength={10}
                          autoComplete="tel-national"
                          placeholder="98765 43210"
                          value={mobile}
                          onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                          onBlur={() => markTouched('mobile')}
                          aria-invalid={!!mobileError}
                          className="w-full bg-transparent py-3 text-[0.95rem] text-ink placeholder:text-ink/35 focus:outline-none tabular-nums"
                        />
                      </div>
                      <InlineError msg={mobileError} />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject</Label>
                    <div className="relative">
                      <select
                        id="subject"
                        value={subject}
                        onChange={(e) => setSubject(e.target.value as Subject)}
                        className="w-full border-b-2 border-ink/20 focus:border-gold-deep bg-transparent py-3 pr-10 text-[0.95rem] text-ink focus:outline-none appearance-none cursor-pointer transition-colors"
                      >
                        {SUBJECTS.map((s) => (
                          <option key={s.id} value={s.id}>{s.label}</option>
                        ))}
                      </select>
                      <svg
                        aria-hidden
                        className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gold-deep"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message" required>Message</Label>
                    <textarea
                      id="message"
                      required
                      rows={5}
                      placeholder="Order number, weave you're interested in, dates — whatever helps us serve you faster."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onBlur={() => markTouched('message')}
                      aria-invalid={!!messageError}
                      className={`${fieldClass(!!messageError)} resize-y min-h-[140px] leading-relaxed`}
                    />
                    <InlineError msg={messageError} />
                  </div>

                  <div className="flex items-center justify-between gap-4 flex-wrap pt-2">
                    <p className="text-[0.7rem] text-ink/45 flex items-center gap-1.5">
                      <span className="text-maroon-deep">*</span>
                      Required fields
                    </p>
                    <button
                      type="submit"
                      disabled={submitting || !formValid}
                      className="inline-flex items-center justify-center gap-2 bg-ink text-white px-10 py-3.5 text-xs font-semibold tracking-[0.18em] uppercase hover:bg-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-ink"
                    >
                      {submitting ? 'Sending…' : 'Send Message'}
                      {!submitting && (
                        <svg
                          width="14"
                          height="14"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2.2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          aria-hidden
                        >
                          <line x1="5" y1="12" x2="19" y2="12" />
                          <polyline points="12 5 19 12 12 19" />
                        </svg>
                      )}
                    </button>
                  </div>
                </form>
              </>
            )}
          </div>

          {/* Sidebar */}
          <aside className="lg:col-span-5 space-y-4">
            <div className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-gold-deep mb-1">
              Other ways to reach us
            </div>

            <ContactCard
              icon={<IconMail />}
              title="Email"
              body="Care team — replies within one working day."
              action={{ href: 'mailto:hello@houseofgnanrudh.com', label: 'hello@houseofgnanrudh.com' }}
            />
            <ContactCard
              icon={<IconPhone />}
              title="Phone"
              body="Mon – Sat · 10:00 AM – 9:00 PM  ·  Sun · 11:00 AM – 8:00 PM (IST)"
              action={{ href: 'tel:+919876543210', label: '+91 98765 43210' }}
            />
            <ContactCard
              icon={<IconWhatsApp />}
              title="WhatsApp"
              body="Quick order help, dispatch updates and styling questions."
              action={{ href: 'https://wa.me/919876543210', label: 'Chat on WhatsApp', external: true }}
            />

            <div className="bg-bone border border-gold-deep/20 p-6">
              <div className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-gold-deep mb-2">
                Visit the boutique
              </div>
              <h3 className="text-lg font-extrabold text-ink mb-3 tracking-tight">
                Nellore Boutique
              </h3>
              <p className="text-sm text-ink/80 leading-relaxed">
                House Of GnanRudh<br />
                Shop No. 12, Trunk Road<br />
                Nellore, Andhra Pradesh 524001<br />
                India
              </p>
              <p className="mt-3 text-xs text-ink/60 leading-relaxed">
                Mon – Sat · 10:00 AM – 9:00 PM<br />
                Sun · 11:00 AM – 8:00 PM
              </p>
              <Link
                href="/stores"
                className="inline-flex items-center gap-1.5 mt-4 text-[0.7rem] font-semibold tracking-[0.14em] uppercase text-ink border-b border-gold-deep/40 hover:border-ink pb-0.5 transition-colors"
              >
                View on map
              </Link>
            </div>

            <div className="border border-ink/10 p-6">
              <div className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-gold-deep mb-2">
                Quick links
              </div>
              <h3 className="text-base font-extrabold text-ink mb-3 tracking-tight">
                Looking for help?
              </h3>
              <ul className="space-y-2.5 text-sm">
                <QuickLink href="/shipping">Shipping policy</QuickLink>
                <QuickLink href="/returns">Returns & exchange</QuickLink>
                <QuickLink href="/care">Saree care guide</QuickLink>
                <QuickLink href="/bespoke">Commission a bespoke saree</QuickLink>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}

function Label({
  htmlFor,
  required,
  children,
}: {
  htmlFor: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="block text-[0.65rem] font-bold text-ink/70 uppercase tracking-[0.2em] mb-2"
    >
      {children}
      {required && <span className="text-maroon-deep ml-0.5" aria-hidden>*</span>}
    </label>
  );
}

function fieldClass(invalid: boolean) {
  return `w-full border-b-2 ${
    invalid ? 'border-maroon-deep' : 'border-ink/20 focus:border-gold-deep'
  } bg-transparent py-3 text-[0.95rem] text-ink placeholder:text-ink/35 focus:outline-none transition-colors`;
}

function InlineError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return (
    <p className="mt-1.5 text-xs text-maroon-deep font-medium flex items-center gap-1" role="alert">
      <svg
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
      >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      {msg}
    </p>
  );
}

function ContactCard({
  icon,
  title,
  body,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  action: { href: string; label: string; external?: boolean };
}) {
  return (
    <div className="border border-ink/10 p-5 hover:border-gold-deep/40 transition-colors">
      <div className="flex items-start gap-4">
        <div className="shrink-0 w-10 h-10 rounded-full bg-bone flex items-center justify-center text-gold-deep">
          {icon}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-[0.7rem] font-bold text-ink uppercase tracking-[0.18em]">
            {title}
          </h3>
          <p className="text-xs text-ink/55 mt-1 leading-relaxed">{body}</p>
          <a
            href={action.href}
            target={action.external ? '_blank' : undefined}
            rel={action.external ? 'noopener noreferrer' : undefined}
            className="inline-block mt-2 text-sm font-semibold text-ink hover:text-gold-deep transition-colors break-all"
          >
            {action.label}
          </a>
        </div>
      </div>
    </div>
  );
}

function QuickLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <li>
      <Link
        href={href}
        className="inline-flex items-center gap-1 text-ink/75 hover:text-ink transition-colors group"
      >
        {children}
        <span
          aria-hidden
          className="text-gold-deep transition-transform group-hover:translate-x-1"
        >
          →
        </span>
      </Link>
    </li>
  );
}

function SuccessPanel({ referenceId, onReset }: { referenceId: string; onReset: () => void }) {
  return (
    <div className="border border-gold-deep/20 bg-bone p-10 text-center">
      <div className="mx-auto mb-5 w-14 h-14 rounded-full bg-peacock text-white flex items-center justify-center">
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
          <path d="M5 12.5 10 17.5 19.5 8" />
        </svg>
      </div>
      <div className="text-[0.6rem] font-semibold tracking-[0.3em] uppercase text-gold-deep mb-2">
        Received
      </div>
      <h2 className="text-xl md:text-2xl font-extrabold text-ink mb-2 tracking-tight">
        Thank you — message received
      </h2>
      <p className="text-sm text-ink/65 max-w-md mx-auto leading-relaxed">
        We&apos;ve sent you a confirmation by email. Our care team will reply within
        one working day.
      </p>
      <div className="mt-5 inline-block bg-white border border-ink/10 px-4 py-2 text-xs text-ink/70">
        Reference · <span className="font-bold text-ink tabular-nums">{referenceId}</span>
      </div>
      <div className="mt-6">
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-semibold tracking-[0.14em] uppercase text-ink border-b border-gold-deep/40 hover:border-ink pb-0.5 transition-colors"
        >
          Send another message
        </button>
      </div>
    </div>
  );
}

function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.4 2.1L7.9 9.8a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2.1Z" />
    </svg>
  );
}

function IconWhatsApp() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M20.5 3.5A10 10 0 0 0 3.7 16.1L2 22l6.1-1.6a10 10 0 0 0 4.8 1.2 10 10 0 0 0 7.6-18.1Zm-7.6 16h-.1a8.4 8.4 0 0 1-4.3-1.2l-.3-.2-3.6 1 1-3.5-.2-.3a8.3 8.3 0 1 1 7.5 4.2Zm4.6-6.2c-.3-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.2l-.8 1c-.2.2-.3.2-.6.1A6.8 6.8 0 0 1 9.4 11c-.3-.4.3-.4.7-1.3.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-1 2.3c0 1.4 1 2.7 1.2 2.9.1.2 2 3 4.8 4.2 1.8.7 2.5.8 3.3.7.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2 0-.1-.2-.2-.5-.4Z" />
    </svg>
  );
}
