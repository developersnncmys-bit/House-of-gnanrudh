'use client';

import { useState } from 'react';

const WEAVES = [
  'Open to suggestions',
  'Kanjeevaram',
  'Banarasi',
  'Mysore Silk',
  'Mangalagiri',
  'Pochampally',
  'Gadwal',
  'Patola',
  'Fancy Sarees',
  'Mixed Pattu Sarees',
];

const OCCASIONS = [
  'Bridal',
  'Wedding guest',
  'Reception',
  'Engagement',
  'Festive',
  'Gift / heirloom',
  'Other',
];

const BUDGETS = [
  '₹35,000 – ₹75,000',
  '₹75,000 – ₹1,50,000',
  '₹1,50,000 – ₹3,00,000',
  'Above ₹3,00,000',
  'Open / not sure',
];

const TIMELINES = [
  'No fixed deadline',
  'Within 3 months',
  '3–6 months',
  '6 months or more',
];

type FormState = {
  name: string;
  email: string;
  phone: string;
  weave: string;
  occasion: string;
  budget: string;
  timeline: string;
  notes: string;
};

const EMPTY: FormState = {
  name: '',
  email: '',
  phone: '',
  weave: WEAVES[0],
  occasion: OCCASIONS[0],
  budget: BUDGETS[0],
  timeline: TIMELINES[0],
  notes: '',
};

type SubmitState =
  | { kind: 'idle' }
  | { kind: 'submitting' }
  | { kind: 'success'; ref: string }
  | { kind: 'error'; message: string };

const STORAGE_KEY = 'gnanrudh-bespoke-inquiries-v1';

type FieldKey = 'name' | 'email' | 'phone';

export default function BespokeInquiryForm() {
  const [form, setForm] = useState<FormState>(EMPTY);
  // Per-field touched tracking — fires on blur so each field surfaces
  // its validation error as soon as the user moves off it, instead of
  // waiting for the whole form to be submitted.
  const [touched, setTouched] = useState<Record<FieldKey, boolean>>({
    name: false,
    email: false,
    phone: false,
  });
  const [submit, setSubmit] = useState<SubmitState>({ kind: 'idle' });

  const errors = validate(form);
  const hasErrors = Object.values(errors).some(Boolean);
  const showError = (key: FieldKey) => (touched[key] ? errors[key] : undefined);

  const set = (patch: Partial<FormState>) => setForm((f) => ({ ...f, ...patch }));
  const markTouched = (key: FieldKey) =>
    setTouched((t) => (t[key] ? t : { ...t, [key]: true }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Mark every validated field touched so any outstanding errors surface.
    setTouched({ name: true, email: true, phone: true });
    if (hasErrors) {
      // Scroll the first invalid field into view
      const firstErrId = Object.entries(errors).find(([, v]) => v)?.[0];
      if (firstErrId) {
        document.getElementById(`bespoke-${firstErrId}`)?.focus();
      }
      return;
    }

    setSubmit({ kind: 'submitting' });
    try {
      // No backend yet — persist locally so the inquiry survives a reload
      // and the user has a visible reference number. Replace with a real
      // POST when the backend exists.
      const ref = generateRef();
      saveLocally({ ...form, ref, createdAt: Date.now() });
      await new Promise((r) => setTimeout(r, 600)); // brief delay so the spinner reads
      setSubmit({ kind: 'success', ref });
    } catch {
      setSubmit({
        kind: 'error',
        message: 'Something went wrong. Please try again or email hello@houseofgnanrudh.com.',
      });
    }
  };

  if (submit.kind === 'success') {
    return (
      <div className="bg-bone border border-ink/15 px-6 md:px-10 py-10 lg:py-14 text-center">
        <div
          aria-hidden
          className="mx-auto w-16 h-16 rounded-full bg-emerald-600 flex items-center justify-center shadow-[0_6px_24px_-8px_rgba(5,120,80,0.45)]"
        >
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M4 12.5 10 18 20 6" />
          </svg>
        </div>
        <div className="mt-6 text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon">
          Inquiry Received
        </div>
        <h3 className="mt-2 font-display text-2xl md:text-3xl font-semibold text-ink leading-tight">
          Thank you, {form.name.split(' ')[0]}
        </h3>
        <span aria-hidden className="block mx-auto h-px w-10 bg-gold/70 mt-5" />
        <p className="mt-5 text-sm md:text-base text-ink/70 max-w-md mx-auto leading-relaxed">
          A House of GnanRudh stylist will call{' '}
          <span className="font-semibold text-ink tabular-nums">{form.phone}</span>{' '}
          within 48 hours.
        </p>
        <div className="mt-6 inline-flex items-center gap-2 bg-white border border-ink/15 px-5 py-2.5 text-[0.7rem] font-bold tracking-[0.2em] uppercase text-ink/60">
          Ref · <span className="text-ink tabular-nums">{submit.ref}</span>
        </div>
        <div className="mt-7">
          <button
            type="button"
            onClick={() => {
              setForm(EMPTY);
              setTouched({ name: false, email: false, phone: false });
              setSubmit({ kind: 'idle' });
            }}
            className="text-[0.7rem] font-bold uppercase tracking-[0.25em] text-maroon hover:text-maroon-deep underline underline-offset-4"
          >
            Submit another inquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="bg-bone border border-ink/15 shadow-[0_8px_30px_-12px_rgba(77,0,21,0.08)]"
    >
      {/* Section — Your Details */}
      <fieldset className="px-6 md:px-10 pt-8 pb-6 border-b border-ink/10">
        <SectionLegend
          eyebrow="Step 01"
          title="Who Shall We Call?"
          caption="So our stylist can reach you within 48 hours."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <Field label="Your name" id="name" required error={showError('name')}>
            <input
              id="bespoke-name"
              type="text"
              value={form.name}
              onChange={(e) => set({ name: e.target.value })}
              onBlur={() => markTouched('name')}
              autoComplete="name"
              aria-invalid={!!showError('name')}
              className={inputClass(!!showError('name'))}
            />
          </Field>

          <Field label="Mobile number" id="phone" required error={showError('phone')}>
            <input
              id="bespoke-phone"
              type="tel"
              inputMode="numeric"
              maxLength={13}
              value={form.phone}
              onChange={(e) => set({ phone: e.target.value })}
              onBlur={() => markTouched('phone')}
              placeholder="98765 43210"
              autoComplete="tel-national"
              aria-invalid={!!showError('phone')}
              className={inputClass(!!showError('phone'))}
            />
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Email" id="email" required error={showError('email')}>
            <input
              id="bespoke-email"
              type="email"
              value={form.email}
              onChange={(e) => set({ email: e.target.value })}
              onBlur={() => markTouched('email')}
              autoComplete="email"
              placeholder="you@example.com"
              aria-invalid={!!showError('email')}
              className={inputClass(!!showError('email'))}
            />
          </Field>
        </div>
      </fieldset>

      {/* Section — Your Vision */}
      <fieldset className="px-6 md:px-10 pt-8 pb-6 border-b border-ink/10 bg-white">
        <SectionLegend
          eyebrow="Step 02"
          title="The Piece You Have in Mind"
          caption="Rough is fine — the stylist will refine the details with you on the call."
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          <Field label="Preferred weave" id="weave">
            <SelectShell>
              <select
                id="bespoke-weave"
                value={form.weave}
                onChange={(e) => set({ weave: e.target.value })}
                className={selectClass()}
              >
                {WEAVES.map((w) => <option key={w}>{w}</option>)}
              </select>
            </SelectShell>
          </Field>

          <Field label="Occasion" id="occasion">
            <SelectShell>
              <select
                id="bespoke-occasion"
                value={form.occasion}
                onChange={(e) => set({ occasion: e.target.value })}
                className={selectClass()}
              >
                {OCCASIONS.map((o) => <option key={o}>{o}</option>)}
              </select>
            </SelectShell>
          </Field>

          <Field label="Budget range" id="budget">
            <SelectShell>
              <select
                id="bespoke-budget"
                value={form.budget}
                onChange={(e) => set({ budget: e.target.value })}
                className={selectClass()}
              >
                {BUDGETS.map((b) => <option key={b}>{b}</option>)}
              </select>
            </SelectShell>
          </Field>

          <Field label="Timeline" id="timeline">
            <SelectShell>
              <select
                id="bespoke-timeline"
                value={form.timeline}
                onChange={(e) => set({ timeline: e.target.value })}
                className={selectClass()}
              >
                {TIMELINES.map((t) => <option key={t}>{t}</option>)}
              </select>
            </SelectShell>
          </Field>
        </div>

        <div className="mt-5">
          <Field label="Tell us more — motifs, colours, references" id="notes">
            <textarea
              id="bespoke-notes"
              value={form.notes}
              onChange={(e) => set({ notes: e.target.value })}
              rows={5}
              maxLength={1500}
              placeholder="A maroon Banarasi with kalga-bel motifs in pure silver-gold zari for my wedding in February…"
              className="w-full border border-ink/20 bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:border-ink focus:ring-2 focus:ring-gold/30 transition-colors resize-none"
            />
            <div className="text-[0.68rem] text-ink/45 text-right mt-1 tabular-nums">
              {form.notes.length}/1500
            </div>
          </Field>
        </div>
      </fieldset>

      {submit.kind === 'error' && (
        <div className="mx-6 md:mx-10 mt-6 border border-maroon-deep/30 bg-maroon-deep/5 text-maroon-deep text-sm p-4 flex items-start gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden className="mt-0.5 shrink-0">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 8v4M12 16h.01" />
          </svg>
          <span>{submit.message}</span>
        </div>
      )}

      {/* Submit footer */}
      <div className="px-6 md:px-10 py-6 flex items-center justify-between flex-wrap gap-4 bg-bone">
        <p className="text-[0.72rem] text-ink/55 leading-relaxed max-w-md">
          By submitting you agree to be contacted by a House of GnanRudh stylist.
          Your details are never shared with third parties.
        </p>
        <button
          type="submit"
          disabled={submit.kind === 'submitting'}
          className="inline-flex items-center gap-2 bg-ink text-white px-8 py-4 text-xs md:text-sm font-bold uppercase tracking-[0.2em] hover:bg-maroon-deep disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submit.kind === 'submitting' ? 'Sending…' : 'Submit Inquiry'}
          {submit.kind !== 'submitting' && <span aria-hidden>→</span>}
        </button>
      </div>
    </form>
  );
}

function SectionLegend({
  eyebrow,
  title,
  caption,
}: {
  eyebrow: string;
  title: string;
  caption: string;
}) {
  return (
    <legend className="block mb-0">
      <div className="text-[0.65rem] md:text-[0.72rem] tracking-[0.35em] uppercase font-bold text-maroon">
        {eyebrow}
      </div>
      <div className="mt-1.5 font-display text-xl md:text-2xl font-semibold text-ink leading-tight">
        {title}
      </div>
      <p className="mt-1 text-xs md:text-sm text-ink/60 leading-relaxed">
        {caption}
      </p>
      <span aria-hidden className="block h-px w-8 bg-gold/70 mt-3" />
    </legend>
  );
}

function SelectShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative">
      {children}
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
        className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink/50"
      >
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
  );
}

function Field({
  label,
  id,
  required,
  error,
  children,
}: {
  label: string;
  id: string;
  required?: boolean;
  error?: string | false;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        htmlFor={`bespoke-${id}`}
        className="block text-[0.65rem] font-bold text-ink/70 uppercase tracking-[0.2em] mb-2"
      >
        {label}
        {required && <span className="text-maroon ml-1">*</span>}
      </label>
      {children}
      {error && (
        <p className="text-[0.72rem] text-maroon-deep font-semibold mt-1.5 flex items-center gap-1">
          <span aria-hidden>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

function inputClass(error: boolean) {
  return `w-full border bg-white px-4 py-3 text-sm text-ink placeholder:text-ink/35 focus:outline-none focus:ring-2 transition-colors ${
    error
      ? 'border-maroon-deep focus:border-maroon-deep focus:ring-maroon-deep/20'
      : 'border-ink/20 focus:border-ink focus:ring-gold/30'
  }`;
}

function selectClass() {
  return 'w-full border border-ink/20 bg-white px-4 py-3 pr-10 text-sm text-ink focus:outline-none focus:border-ink focus:ring-2 focus:ring-gold/30 appearance-none cursor-pointer transition-colors';
}

function validate(f: FormState) {
  const errs: { name?: string; email?: string; phone?: string } = {};
  if (!f.name.trim()) errs.name = 'Please enter your name';
  if (!f.email.trim()) {
    errs.email = 'Please enter your email';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) {
    errs.email = 'Please enter a valid email';
  }
  if (!f.phone.trim()) {
    errs.phone = 'Please enter a mobile number';
  } else if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\D/g, '').replace(/^91/, ''))) {
    errs.phone = 'Enter a valid 10-digit mobile number starting with 6, 7, 8 or 9';
  }
  return errs;
}

function generateRef(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 5).toUpperCase();
  return `BSPK-${ts.slice(-5)}-${rand}`;
}

function saveLocally(record: FormState & { ref: string; createdAt: number }) {
  if (typeof window === 'undefined') return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const list = raw ? (JSON.parse(raw) as unknown[]) : [];
    if (Array.isArray(list)) {
      list.push(record);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    }
  } catch {
    /* quota / disabled — submission still considered successful */
  }
}
