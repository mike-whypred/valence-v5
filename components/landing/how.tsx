import Image from 'next/image';
import { Reveal } from '@/components/reveal';
import { photo } from '@/lib/demo-data';

const steps = [
  {
    title: 'Write a real profile',
    body: 'Your role, what you are good at, and who you want to meet. Valence turns it into a short summary other attendees can read in ten seconds.',
  },
  {
    title: 'Enter your event code',
    body: 'Organizers hand out an access code with the invite. Once you are in, matching runs only against people in that room.',
  },
  {
    title: 'Meet on mutual interest',
    body: 'Mark who you would like to meet. When they pick you too, you are both told, with a line on why the match makes sense.',
  },
];

export function How() {
  return (
    <section
      id="how"
      className="mx-auto grid max-w-7xl scroll-mt-20 gap-12 px-4 py-24 sm:px-6 md:py-32 lg:grid-cols-12 lg:gap-16 lg:px-8"
    >
      <div className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <h2 className="text-4xl font-semibold tracking-tighter md:text-5xl">
            Three minutes of setup. A better evening.
          </h2>
          <div className="relative mt-10 aspect-[4/3] overflow-hidden rounded-3xl">
            <Image
              src={photo(192, 1000, 750)}
              alt="People talking at long tables in a bright hall"
              fill
              sizes="(min-width: 1024px) 38vw, 100vw"
              className="object-cover grayscale"
            />
          </div>
        </div>
      </div>

      <ol className="grid gap-4 lg:col-span-7 lg:pt-2">
        {steps.map((s, i) => (
          <Reveal
            as="li"
            key={s.title}
            delay={i * 0.06}
            className="bg-surface ring-line rounded-3xl p-8 ring-1 md:p-10"
          >
            <h3 className="text-2xl font-semibold tracking-tight">{s.title}</h3>
            <p className="text-muted mt-3 max-w-[52ch] leading-relaxed">{s.body}</p>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
