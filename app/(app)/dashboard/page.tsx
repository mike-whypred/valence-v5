import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowRightIcon, CalendarBlankIcon, KeyIcon, MapPinIcon, UsersThreeIcon } from '@phosphor-icons/react/ssr';
import { Avatar } from '@/components/avatar';
import { ButtonLink } from '@/components/ui/button';
import { getCandidates, getConnections, getMyEvents, getViewer } from '@/lib/data';
import { matchReasons } from '@/lib/matching';
import { fitPercent, formatEventDate } from '@/lib/utils';
import type { EventInfo } from '@/lib/types';

export const metadata: Metadata = { title: 'Overview' };

export default async function DashboardPage() {
  const viewer = (await getViewer())!;
  const me = viewer.profile!;
  const [events, candidates, connections] = await Promise.all([getMyEvents(), getCandidates(), getConnections()]);
  const next = events.find((e) => new Date(e.starts_at) > new Date()) ?? events[0];
  const connected = connections.filter((c) => c.status === 'connected');
  const waiting = connections.length - connected.length;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12">
      <header className="flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">Welcome back, {me.first_name}.</h1>
          <p className="text-muted mt-3">
            {candidates.length > 0
              ? `${candidates.length} people at your events look worth meeting.`
              : 'Join an event to see who is worth meeting.'}
          </p>
        </div>
        <dl className="flex gap-10 font-mono">
          <Stat label="to meet" value={candidates.length} />
          <Stat label="connected" value={connected.length} />
          <Stat label="events" value={events.length} />
        </dl>
      </header>

      <div className="grid grid-cols-[minmax(0,1fr)] gap-6 lg:grid-cols-12">
        <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6 lg:col-span-8">
          {next ? <NextEvent event={next} /> : <NoEvents />}

          {candidates.length > 0 && (
            <section className="bg-surface ring-line rounded-2xl p-6 ring-1 md:p-8">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold tracking-tight">Best fits right now</h2>
                <Link href="/matches" className="text-muted hover:text-ink inline-flex items-center gap-1 text-sm">
                  Open Discover <ArrowRightIcon className="size-3.5" />
                </Link>
              </div>
              <ul className="divide-line mt-4 divide-y">
                {candidates.slice(0, 3).map((c) => {
                  const reason = matchReasons(me, c)[0];
                  return (
                    <li key={c.id}>
                      <Link
                        href={`/matches?event=${c.event_id}`}
                        className="hover:bg-sunken -mx-3 flex items-center gap-4 rounded-xl px-3 py-4 transition-colors"
                      >
                        <Avatar src={c.avatar_url} first={c.first_name} last={c.last_name} size={48} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate font-medium">
                            {c.first_name} {c.last_name}
                            <span className="text-muted font-normal">
                              , {c.job_title} at {c.company}
                            </span>
                          </p>
                          {reason && <p className="text-muted mt-0.5 truncate text-sm">{reason}</p>}
                        </div>
                        <span className="text-ember tabular font-mono text-sm">{fitPercent(c.similarity)}%</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
        </div>

        <aside className="grid min-w-0 grid-cols-[minmax(0,1fr)] content-start gap-6 lg:col-span-4">
          <section className="bg-surface ring-line rounded-2xl p-6 ring-1">
            <h2 className="text-lg font-semibold tracking-tight">Connections</h2>
            {connected.length === 0 ? (
              <p className="text-muted mt-3 text-sm leading-relaxed">
                When someone you picked picks you back, they show up here.
              </p>
            ) : (
              <ul className="mt-4 grid gap-4">
                {connected.map((c) => (
                  <li key={c.profile.id} className="flex items-center gap-3">
                    <Avatar
                      src={c.profile.avatar_url}
                      first={c.profile.first_name}
                      last={c.profile.last_name}
                      size={40}
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {c.profile.first_name} {c.profile.last_name}
                      </p>
                      <p className="text-muted truncate text-xs">{c.event_name}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            {waiting > 0 && (
              <p className="border-line text-muted mt-5 border-t pt-4 text-sm">
                {waiting} {waiting === 1 ? 'person has' : 'people have'} not responded yet.
              </p>
            )}
            <Link
              href="/matches?view=connections"
              className="text-muted hover:text-ink mt-4 inline-flex items-center gap-1 text-sm"
            >
              All connections <ArrowRightIcon className="size-3.5" />
            </Link>
          </section>

          <section className="bg-ember-soft rounded-2xl p-6">
            <h2 className="text-lg font-semibold tracking-tight">How others see you</h2>
            <p className="text-ink/85 mt-3 text-sm leading-relaxed">
              {me.summary ?? 'Your summary appears here once your profile is saved with an OpenAI key configured.'}
            </p>
            <Link
              href="/profile/setup"
              className="text-ember mt-4 inline-flex items-center gap-1 text-sm font-medium hover:underline"
            >
              Edit profile <ArrowRightIcon className="size-3.5" />
            </Link>
          </section>
        </aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: number }) {
  return (
    <div>
      <dd className="tabular text-3xl font-medium tracking-tight">{value}</dd>
      <dt className="text-muted mt-1 text-xs">{label}</dt>
    </div>
  );
}

function NextEvent({ event }: { event: EventInfo }) {
  const spotsLeft = event.max_attendees ? event.max_attendees - event.attendee_count : null;
  return (
    <section className="group relative min-w-0 overflow-hidden rounded-2xl bg-[#111216]">
      {event.cover_url && (
        <Image
          src={event.cover_url}
          alt=""
          fill
          priority
          sizes="(min-width: 1024px) 700px, 100vw"
          className="ease-out-expo object-cover opacity-45 transition-transform duration-700 group-hover:scale-[1.02]"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
      <div className="relative flex min-h-80 flex-col justify-end gap-6 p-6 text-white md:p-8">
        <div>
          <p className="text-sm text-white/75">Next up</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-tight md:text-4xl">{event.name}</h2>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/85">
            <li className="flex min-w-0 items-start gap-1.5">
              <CalendarBlankIcon className="mt-0.5 size-4 shrink-0" />{' '}
              {formatEventDate(event.starts_at, event.timezone)}
            </li>
            <li className="flex min-w-0 items-start gap-1.5">
              <MapPinIcon className="mt-0.5 size-4 shrink-0" /> {event.location}
            </li>
            <li className="flex min-w-0 items-start gap-1.5">
              <UsersThreeIcon className="mt-0.5 size-4 shrink-0" /> {event.attendee_count} going
              {spotsLeft !== null && spotsLeft <= 10 ? `, ${spotsLeft} spots left` : ''}
            </li>
          </ul>
        </div>
        <ButtonLink href={`/matches?event=${event.id}`} variant="ember" className="self-start">
          See who is going
        </ButtonLink>
      </div>
    </section>
  );
}

function NoEvents() {
  return (
    <section className="bg-surface ring-line grid place-items-start gap-4 rounded-2xl p-8 ring-1 md:p-10">
      <span className="bg-ember-soft text-ember grid size-12 place-items-center rounded-2xl">
        <KeyIcon className="size-6" />
      </span>
      <div>
        <h2 className="text-2xl font-semibold tracking-tight">Join your first event</h2>
        <p className="text-muted mt-2 max-w-[48ch]">
          Your organizer sends an access code with the invite. Enter it and Valence starts matching you with the people
          in that room.
        </p>
      </div>
      <ButtonLink href="/events/join" variant="primary">
        Enter a code
      </ButtonLink>
    </section>
  );
}
