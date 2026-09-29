import Link from 'next/link';
import type { Metadata } from 'next';
import { KeyIcon } from '@phosphor-icons/react/ssr';
import { Avatar } from '@/components/avatar';
import { ButtonLink } from '@/components/ui/button';
import { DiscoverDeck } from '@/components/app/discover-deck';
import { getCandidates, getConnections, getMyEvents, getViewer } from '@/lib/data';
import { matchReasons, sharedSkills } from '@/lib/matching';
import { cn } from '@/lib/utils';
import type { Connection } from '@/lib/types';

export const metadata: Metadata = { title: 'Discover' };

const since = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' });

export default async function MatchesPage({ searchParams }: PageProps<'/matches'>) {
  const params = await searchParams;
  const view = params.view === 'connections' ? 'connections' : 'discover';
  const eventId = typeof params.event === 'string' ? params.event : undefined;

  const viewer = (await getViewer())!;
  const me = viewer.profile!;
  const [events, candidates, connections] = await Promise.all([
    getMyEvents(),
    view === 'discover' ? getCandidates(eventId) : Promise.resolve([]),
    view === 'connections' ? getConnections() : Promise.resolve([]),
  ]);

  const tab = (v: string, label: string) => (
    <Link
      href={v === 'discover' ? `/matches${eventId ? `?event=${eventId}` : ''}` : '/matches?view=connections'}
      aria-current={view === v ? 'page' : undefined}
      className={cn(
        'rounded-full px-4 py-2 text-sm transition-colors',
        view === v ? 'bg-surface text-ink shadow-soft ring-line font-medium ring-1' : 'text-muted hover:text-ink',
      )}
    >
      {label}
    </Link>
  );

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">
          {view === 'discover' ? 'Who to meet' : 'Your connections'}
        </h1>
        <nav aria-label="Matches view" className="bg-sunken flex gap-1 rounded-full p-1">
          {tab('discover', 'Discover')}
          {tab('connections', 'Connections')}
        </nav>
      </header>

      {view === 'discover' ? (
        events.length === 0 ? (
          <Empty />
        ) : (
          <div className="grid grid-cols-[minmax(0,1fr)] gap-10 lg:grid-cols-12 lg:gap-12">
            <aside className="min-w-0 lg:col-span-4">
              <h2 className="text-muted text-sm font-medium">Event</h2>
              <ul className="no-scrollbar mt-3 flex gap-2 overflow-x-auto lg:grid lg:overflow-visible">
                <EventPill href="/matches" active={!eventId} label="All my events" />
                {events.map((e) => (
                  <EventPill key={e.id} href={`/matches?event=${e.id}`} active={eventId === e.id} label={e.name} />
                ))}
              </ul>
              <p className="text-muted mt-8 hidden max-w-[34ch] text-sm leading-relaxed lg:block">
                Ranked by how closely each person&apos;s profile and goals match yours. They only find out you were
                interested if they pick you too.
              </p>
            </aside>
            <div className="min-w-0 lg:col-span-8">
              <DiscoverDeck
                key={eventId ?? 'all'}
                me={me}
                items={candidates.map((c) => ({
                  person: c,
                  reasons: matchReasons(me, c),
                  shared: sharedSkills(me, c),
                }))}
              />
            </div>
          </div>
        )
      ) : (
        <Connections items={connections} />
      )}
    </div>
  );
}

function EventPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return (
    <li className="shrink-0">
      <Link
        href={href}
        aria-current={active ? 'page' : undefined}
        className={cn(
          'block rounded-full px-4 py-2 text-sm whitespace-nowrap transition-colors lg:rounded-xl lg:px-4 lg:py-3',
          active ? 'bg-ink text-canvas' : 'bg-surface text-ink ring-line hover:ring-ink/25 ring-1',
        )}
      >
        {label}
      </Link>
    </li>
  );
}

function Connections({ items }: { items: Connection[] }) {
  if (items.length === 0) {
    return (
      <div className="bg-surface ring-line rounded-2xl p-10 text-center ring-1">
        <h2 className="text-xl font-semibold tracking-tight">No connections yet</h2>
        <p className="text-muted mx-auto mt-2 max-w-[40ch] text-sm">
          Mark people as interesting in Discover. When they pick you back, they appear here.
        </p>
        <ButtonLink href="/matches" className="mt-6">
          Open Discover
        </ButtonLink>
      </div>
    );
  }
  return (
    <ul className="grid grid-cols-[minmax(0,1fr)] gap-4 md:grid-cols-2">
      {items.map(({ profile: p, event_name, since: at, status }) => (
        <li key={p.id} className="bg-surface ring-line flex gap-4 rounded-2xl p-6 ring-1">
          <Avatar src={p.avatar_url} first={p.first_name} last={p.last_name} size={56} />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {p.first_name} {p.last_name}
                </p>
                <p className="text-muted truncate text-sm">
                  {p.job_title}, {p.company}
                </p>
              </div>
              <span
                className={cn(
                  'shrink-0 rounded-full px-2.5 py-1 text-xs font-medium',
                  status === 'connected' ? 'bg-ember-soft text-ember' : 'bg-sunken text-muted',
                )}
              >
                {status === 'connected' ? 'Connected' : 'Waiting'}
              </span>
            </div>
            <p className="text-ink/80 mt-3 line-clamp-2 text-sm leading-relaxed">{p.summary ?? p.bio}</p>
            <p className="text-faint mt-3 text-xs">
              {event_name}, {since.format(new Date(at))}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function Empty() {
  return (
    <div className="bg-surface ring-line grid place-items-center rounded-2xl px-6 py-16 text-center ring-1">
      <span className="bg-ember-soft text-ember grid size-14 place-items-center rounded-2xl">
        <KeyIcon className="size-7" />
      </span>
      <h2 className="mt-5 text-2xl font-semibold tracking-tight">Matching starts at an event</h2>
      <p className="text-muted mt-2 max-w-[40ch] text-sm">
        Enter the access code from your invitation and we will line up the people worth meeting.
      </p>
      <ButtonLink href="/events/join" className="mt-6">
        Enter a code
      </ButtonLink>
    </div>
  );
}
