import Link from 'next/link';
import { cn } from '@/lib/utils';

/** Two overlapping rings: a shared bond. Simple geometric mark, used as logo and favicon. */
export function Mark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={cn('size-6', className)}>
      <circle cx="12" cy="16" r="8.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="20" cy="16" r="8.5" fill="none" stroke="var(--ember)" strokeWidth="2.5" />
    </svg>
  );
}

export function Brand({ href = '/', className }: { href?: string; className?: string }) {
  return (
    <Link href={href} className={cn('inline-flex items-center gap-2 font-semibold tracking-tight', className)}>
      <Mark />
      <span className="text-[17px]">Valence</span>
    </Link>
  );
}
