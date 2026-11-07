/**
 * SectionOrnament — heritage break between major page sections.
 *
 * Centred brand lotus motif (public/lotus.png) flanked by two thin
 * maroon rules. Reads as a chapter break — used sparingly so the page
 * still has rhythm without feeling busy.
 */
export default function SectionOrnament({
  size = 26,
  tone = 'wine',
}: {
  /** Height in px; the lotus art keeps its intrinsic aspect ratio. */
  size?: number;
  /** `wine` (default) for light page bgs; `cream` for dark sections. */
  tone?: 'wine' | 'cream';
}) {
  const ruleColor = tone === 'cream' ? 'bg-ivory/30' : 'bg-maroon/25';

  return (
    <div
      aria-hidden
      className="flex items-center justify-center gap-4 py-8 md:py-10 bg-ivory"
    >
      <span className={`h-px w-20 md:w-32 ${ruleColor}`} />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/lotus.png"
        alt=""
        aria-hidden
        draggable={false}
        style={{ height: size, width: 'auto' }}
        className="select-none"
      />
      <span className={`h-px w-20 md:w-32 ${ruleColor}`} />
    </div>
  );
}
