import Image from 'next/image';
import type { Metadata } from 'next';
import { CalendarBlankIcon, MapPinIcon, PlusIcon, SealCheckIcon } from '@phosphor-icons/react/ssr';
import { CopyButton } from '@/components/app/copy-button';
import { ButtonLink } from '@/components/ui/button';
import { OrganizerOnly } from '@/components/app/organizer-only';
import { getHostedEvents, getViewer } from '@/lib/data';
import { isDemo } from '@/lib/env';
import { formatEventDate } from '@/lib/utils';
import type { HostedEvent } from '@/lib/types';

export const metadata: Metadata = { title: 'Hosting' };

export default async function HostPage({ searchParams }: PageProps<'/host'>) {
  const viewer = (await getViewer())!;
  if (viewer.profile!.role !== 'organizer') return <OrganizerOnly />;

  const { created } = await searchParams;
  const events = await getHostedEvents();
  const createdCode = typeof created === 'string' ? created : null;
  const now = Date.now();
  const upcoming = events.filter((e) => new Date(e.starts_at).getTime() >= now);
  const past = events.filter((e) => new Date(e.starts_at).getTime() < now);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-10">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">Your events</h1>
          <p className="text-muted mt-3 max-w-[52ch]">
            Share the access code with your guests. They join, finish their profile, and Valence does the introductions.
          </p>
        </div>
        <ButtonLink href="/host/new" variant="ember">
          <PlusIcon weight="bold" className="size-4" /> New event
        </ButtonLink>
      </header>

      {createdCode && (
        <div role="status" className="bg-ember-soft flex flex-wrap items-center gap-x-6 gap-y-3 rounded-2xl px-6 py-5">
          <SealCheckIcon weight="fill" className="text-ember size-6" />
          <div className="min-w-0 flex-1">
            <p className="font-medium">Event created. Guests join with this code:</p>
            <p className="mt-1 font-mono text-2xl tracking-[0.15em]">{createdCode}</p>
            {isDemo && (
              <p className="text-muted mt-1 text-sm">
                Sample data mode does not save events, so it is not in the list below.
              </p>
            )}
          </div>
          <CopyButton value={`/events/join?code=${createdCode}`} label="Copy invite link" className="bg-surface" />
        </div>
      )}

      {events.length === 0 ? (
        <div className="bg-surface ring-line grid place-items-center rounded-2xl px-6 py-16 text-center ring-1">
          <h2 className="text-2xl font-semibold tracking-tight">No events yet</h2>
          <p className="text-muted mt-2 max-w-[42ch] text-sm">
            Create one and you get an access code to put in your invitation.
          </p>
          <ButtonLink href="/host/new" className="mt-6">
            Create an event
          </ButtonLink>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && <EventList title="Upcoming" events={upcoming} />}
          {past.length > 0 && <EventList title="Past" events={past} />}
        </>
      )}
    </div>
  );
}

function EventList({ title, events }: { title: string; events: HostedEvent[] }) {
  return (
    <section>
      <h2 className="text-muted text-sm font-medium">{title}</h2>
      <ul className="mt-4 grid grid-cols-[minmax(0,1fr)] gap-4">
        {events.map((e) => (
          <li key={e.id}>
            <HostedCard event={e} />
          </li>
        ))}
      </ul>
    </section>
  );
}

function HostedCard({ event: e }: { event: HostedEvent }) {
  const stats = [
    { label: 'joined', value: e.max_attendees ? `${e.attendee_count}/${e.max_attendees}` : String(e.attendee_count) },
    { label: 'profiles ready', value: String(e.profiles_ready) },
    { label: 'connections made', value: String(e.connections) },
  ];
  return (
    <article className="bg-surface ring-line grid overflow-hidden rounded-2xl ring-1 md:grid-cols-[16rem_1fr]">
      <div className="bg-sunken relative aspect-[16/9] md:aspect-auto">
        {e.cover_url && (
          <Image src={e.cover_url} alt="" fill sizes="(min-width: 768px) 256px, 100vw" className="object-cover" />
        )}
      </div>
      <div className="grid gap-6 p-6 md:p-7">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-xl font-semibold tracking-tight">{e.name}</h3>
            <ul className="text-muted mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
              <li className="flex items-center gap-1.5">
                <CalendarBlankIcon className="size-4 shrink-0" /> {formatEventDate(e.starts_at, e.timezone)}
              </li>
              <li className="flex min-w-0 items-center gap-1.5">
                <MapPinIcon className="size-4 shrink-0" /> {e.location}
              </li>
            </ul>
          </div>
          <div className="text-right">
            <p className="font-mono text-lg tracking-[0.15em]">{e.access_code}</p>
            <div className="mt-2 flex justify-end gap-2">
              <CopyButton value={e.access_code} label="Copy code" />
              <CopyButton value={`/events/join?code=${e.access_code}`} label="Copy link" />
            </div>
          </div>
        </div>
        <dl className="border-line flex flex-wrap gap-x-10 gap-y-4 border-t pt-5">
          {stats.map((s) => (
            <div key={s.label}>
              <dd className="tabular font-mono text-2xl font-medium">{s.value}</dd>
              <dt className="text-muted mt-1 text-xs">{s.label}</dt>
            </div>
          ))}
        </dl>
      </div>
    </article>
  );
}
