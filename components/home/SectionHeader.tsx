import Image from 'next/image';
import Link from 'next/link';
import { navHref } from '@/lib/soft-launch';

type SectionHeaderProps = {
  title: string;
  description?: string;
  link?: { href: string; label: string };
  className?: string;
  /** Override the default lotus ornament. Pass a path under `/public`. */
  ornament?: string;
  /** Hairline rules flanking the ornament. Defaults to true. */
  showDividers?: boolean;
};

export default function SectionHeader({
  title,
  description,
  link,
  className = 'mb-6 md:mb-8',
  ornament = '/lotus.png',
  showDividers = true,
}: SectionHeaderProps) {
  return (
    <div className={`text-center ${className}`}>
      <div className="flex items-center justify-center gap-3 md:gap-4 mb-3">
        {showDividers && (
          <span className="h-px w-10 sm:w-14 md:w-20 bg-[#D1001F]" aria-hidden />
        )}
        <Image
          src={ornament}
          alt=""
          width={160}
          height={160}
          className="h-7 sm:h-8 md:h-9 w-auto select-none"
          draggable={false}
          aria-hidden
        />
        {showDividers && (
          <span className="h-px w-10 sm:w-14 md:w-20 bg-[#D1001F]" aria-hidden />
        )}
      </div>
      <h2 className="font-display text-3xl md:text-4xl font-bold text-ink leading-tight">
        {title}
      </h2>
      {description && (
        <p className="mt-2 text-sm md:text-base text-ink/70 leading-relaxed max-w-2xl mx-auto">
          {description}
        </p>
      )}
      {link && (
        navHref(link.href) ? (
          <Link
            href={link.href}
            className="inline-block mt-3 text-sm font-semibold text-ink hover:text-maroon transition-colors underline underline-offset-4"
          >
            {link.label}
          </Link>
        ) : (
          <span className="inline-block mt-3 text-sm font-semibold text-ink underline underline-offset-4 cursor-default">
            {link.label}
          </span>
        )
      )}
    </div>
  );
}
