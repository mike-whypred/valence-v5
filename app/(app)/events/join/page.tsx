import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';
import { JoinForm } from '@/components/app/join-form';
import { getMyEvents } from '@/lib/data';
import { formatEventDate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Events' };

export default async function JoinEventPage({ searchParams }: PageProps<'/events/join'>) {
  const { code } = await searchParams;
  const events = await getMyEvents();

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-16 lg:grid-cols-12 lg:gap-12">
      <section className="min-w-0 lg:col-span-7">
        <h1 className="text-4xl font-semibold tracking-tighter md:text-5xl">Join an event</h1>
        <p className="text-muted mt-3 max-w-[48ch]">
          Enter the code your organizer sent. You will only be matched with people in the same event.
        </p>
        <div className="mt-10">
          <JoinForm initialCode={typeof code === 'string' ? code : ''} />
        </div>
      </section>

      <aside className="min-w-0 lg:col-span-5">
        <h2 className="text-lg font-semibold tracking-tight">Your events</h2>
        {events.length === 0 ? (
          <p className="text-muted mt-3 text-sm">Events you join show up here.</p>
        ) : (
          <ul className="mt-4 grid gap-3">
            {events.map((e) => (
              <li key={e.id}>
                <Link
                  href={`/matches?event=${e.id}`}
                  className="bg-surface ring-line hover:shadow-soft flex items-center gap-4 rounded-2xl p-3 ring-1 transition-shadow"
                >
                  <div className="bg-sunken relative size-16 shrink-0 overflow-hidden rounded-xl">
                    {e.cover_url && <Image src={e.cover_url} alt="" fill sizes="64px" className="object-cover" />}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{e.name}</p>
                    <p className="text-muted truncate text-sm">{formatEventDate(e.starts_at, e.timezone)}</p>
                    <p className="text-faint text-xs">{e.attendee_count} going</p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </aside>
    </div>
  );
}
