'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const links = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/matches', label: 'Discover' },
  { href: '/events/join', label: 'Events' },
  { href: '/profile/setup', label: 'Profile' },
];

const hostLink = { href: '/host', label: 'Hosting' };

export function NavLinks({ organizer = false }: { organizer?: boolean }) {
  const pathname = usePathname();
  return (
    <nav aria-label="App" className="no-scrollbar -mx-1 flex items-center gap-1 overflow-x-auto">
      {(organizer ? [...links.slice(0, 3), hostLink, links[3]] : links).map((l) => {
        const active = pathname.startsWith(l.href);
        return (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active ? 'page' : undefined}
            className={cn(
              'rounded-full px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors',
              active ? 'bg-ink text-canvas' : 'text-muted hover:bg-sunken hover:text-ink',
            )}
          >
            {l.label}
          </Link>
        );
      })}
    </nav>
  );
}
