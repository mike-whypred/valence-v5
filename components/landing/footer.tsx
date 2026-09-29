import Link from 'next/link';
import { Brand } from '@/components/brand';

export function Footer() {
  return (
    <footer className="border-line border-t">
      <div className="text-muted mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <Brand />
        <nav className="flex gap-6" aria-label="Footer">
          <Link href="#how" className="hover:text-ink">
            How it works
          </Link>
          <Link href="#organizers" className="hover:text-ink">
            For organizers
          </Link>
          <Link href="/auth/login" className="hover:text-ink">
            Sign in
          </Link>
        </nav>
        <p>&copy; {new Date().getFullYear()} Valence</p>
      </div>
    </footer>
  );
}
