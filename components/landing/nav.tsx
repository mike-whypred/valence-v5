import Link from 'next/link';
import { Brand } from '@/components/brand';
import { ButtonLink } from '@/components/ui/button';

export function LandingNav() {
  return (
    <header className="border-line/70 bg-canvas/80 sticky top-0 z-40 border-b backdrop-blur-xl">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main">
        <Brand />
        <div className="text-muted hidden items-center gap-8 text-sm md:flex">
          <Link href="#how" className="hover:text-ink transition-colors">
            How it works
          </Link>
          <Link href="#organizers" className="hover:text-ink transition-colors">
            For organizers
          </Link>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <ButtonLink href="/auth/login" variant="ghost" size="sm">
            Sign in
          </ButtonLink>
          <ButtonLink href="/auth/signup" variant="primary" size="sm">
            Get started
          </ButtonLink>
        </div>
      </nav>
    </header>
  );
}
