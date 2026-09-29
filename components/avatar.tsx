import Image from 'next/image';
import { cn, initials } from '@/lib/utils';

export function Avatar({
  src,
  first,
  last,
  size = 40,
  className,
  priority,
}: {
  src: string | null;
  first: string;
  last?: string;
  size?: number;
  className?: string;
  priority?: boolean;
}) {
  const radius = size >= 96 ? 'rounded-[28%]' : 'rounded-[30%]';
  if (!src) {
    return (
      <span
        style={{ width: size, height: size, fontSize: size * 0.36 }}
        className={cn(
          'bg-ember-soft text-ember inline-grid shrink-0 place-items-center self-start font-medium',
          radius,
          className,
        )}
        aria-hidden
      >
        {initials(first, last)}
      </span>
    );
  }
  return (
    <Image
      src={src}
      alt={`${first} ${last ?? ''}`.trim()}
      width={size}
      height={size}
      priority={priority}
      className={cn('aspect-square shrink-0 self-start object-cover', radius, className)}
    />
  );
}
