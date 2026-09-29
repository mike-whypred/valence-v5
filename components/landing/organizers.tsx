import Image from 'next/image';
import { CheckIcon } from '@phosphor-icons/react/ssr';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';
import { photo } from '@/lib/demo-data';

const points = [
  'One access code per event, with an optional attendee cap',
  'Guests set up their profile before they arrive',
  'Introductions stay inside your event',
];

export function Organizers() {
  return (
    <section id="organizers" className="border-line scroll-mt-20 border-t">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-16 lg:px-8">
        <Reveal className="lg:col-span-6">
          <div className="relative aspect-[5/4] overflow-hidden rounded-3xl">
            <Image
              src={photo(348, 1200, 960)}
              alt="A busy station concourse full of people moving past each other"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </Reveal>
        <Reveal delay={0.08} className="lg:col-span-6">
          <p className="text-ember text-xs font-medium tracking-[0.18em] uppercase">For organizers</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tighter md:text-5xl">
            A crowd is not a network. Give every guest a reason to talk.
          </h2>
          <p className="text-muted mt-5 max-w-[52ch] leading-relaxed">
            Create the event, share the code, and Valence handles the introductions.
          </p>
          <ul className="mt-8 grid gap-3">
            {points.map((p) => (
              <li key={p} className="flex items-start gap-3">
                <span className="bg-ember-soft mt-0.5 grid size-5 shrink-0 place-items-center rounded-full">
                  <CheckIcon weight="bold" className="text-ember size-3" />
                </span>
                {p}
              </li>
            ))}
          </ul>
          <ButtonLink href="/auth/signup?role=organizer" variant="primary" className="mt-10">
            Host an event
          </ButtonLink>
        </Reveal>
      </div>
    </section>
  );
}
