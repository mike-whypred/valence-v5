import { SignOutIcon } from '@phosphor-icons/react/ssr';
import { Brand } from '@/components/brand';
import { Avatar } from '@/components/avatar';
import { NavLinks } from '@/components/app/nav-links';
import { signOut } from '@/app/actions';
import { isDemo } from '@/lib/env';
import type { Viewer } from '@/lib/types';

export function AppHeader({ viewer }: { viewer: Viewer }) {
  const p = viewer.profile;
  return (
    <header className="border-line/70 bg-canvas/85 sticky top-0 z-40 border-b backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Brand href="/dashboard" className="shrink-0" />
        <div className="hidden min-w-0 flex-1 justify-center md:flex">
          <NavLinks organizer={p?.role === 'organizer'} />
        </div>
        <div className="ml-auto flex shrink-0 items-center gap-2 md:ml-0">
          {isDemo && (
            <span
              title="Supabase is not configured, so the app is showing sample data."
              className="bg-ember-soft text-ember hidden rounded-full px-3 py-1 text-xs font-medium sm:inline"
            >
              Sample data
            </span>
          )}
          <Avatar
            src={p?.avatar_url ?? null}
            first={p?.first_name ?? viewer.first_name}
            last={p?.last_name}
            size={32}
          />
          <form action={signOut}>
            <button
              type="submit"
              aria-label="Sign out"
              title="Sign out"
              className="text-muted hover:bg-sunken hover:text-ink grid size-9 place-items-center rounded-full transition-colors"
            >
              <SignOutIcon className="size-[18px]" />
            </button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 pb-3 sm:px-6 md:hidden">
        <NavLinks organizer={p?.role === 'organizer'} />
      </div>
    </header>
  );
}
