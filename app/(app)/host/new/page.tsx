import Link from 'next/link';
import type { Metadata } from 'next';
import { ArrowLeftIcon } from '@phosphor-icons/react/ssr';
import { EventForm } from '@/components/app/event-form';
import { OrganizerOnly } from '@/components/app/organizer-only';
import { getViewer } from '@/lib/data';

export const metadata: Metadata = { title: 'New event' };

export default async function NewEventPage() {
  const viewer = (await getViewer())!;
  if (viewer.profile!.role !== 'organizer') return <OrganizerOnly />;

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12">
      <div className="min-w-0 lg:col-span-7">
        <Link href="/host" className="text-muted hover:text-ink inline-flex items-center gap-1.5 text-sm">
          <ArrowLeftIcon className="size-3.5" /> Your events
        </Link>
        <h1 className="mt-4 text-4xl font-semibold tracking-tighter md:text-5xl">New event</h1>
        <p className="text-muted mt-3 max-w-[52ch]">
          You get an access code to put in your invitation. Only people with the code can join or be matched.
        </p>
        <div className="mt-12">
          <EventForm />
        </div>
      </div>
      <aside className="min-w-0 lg:col-span-5 lg:pt-44">
        <div className="bg-ember-soft rounded-2xl p-6 lg:sticky lg:top-28">
          <h2 className="font-semibold tracking-tight">Getting guests matched</h2>
          <ul className="text-ink/85 mt-4 grid gap-3 text-sm leading-relaxed">
            <li>Send the code a week ahead so guests finish their profiles before they arrive.</li>
            <li>Matching improves with specific goals. Ask guests who they hope to meet in your invite.</li>
            <li>After the event, the connection count shows how many pairs chose each other.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
