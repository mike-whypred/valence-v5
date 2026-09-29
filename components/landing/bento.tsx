import Image from 'next/image';
import { EyeSlashIcon, LockKeyIcon } from '@phosphor-icons/react/ssr';
import { Avatar } from '@/components/avatar';
import { Reveal } from '@/components/reveal';
import { demoViewerProfile as me, photo } from '@/lib/demo-data';

export function Bento() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-24 sm:px-6 md:py-32 lg:px-8">
      <Reveal>
        <h2 className="max-w-3xl text-4xl font-semibold tracking-tighter md:text-5xl">
          Matching that reads what you want, not just your job title.
        </h2>
      </Reveal>

      <div className="mt-14 grid gap-4 md:grid-cols-3 md:grid-rows-[auto_auto_auto]">
        {/* Summary: the thing matching actually uses */}
        <Reveal className="md:col-span-2 md:row-span-2">
          <div className="bg-ember-soft flex h-full flex-col gap-8 rounded-3xl p-8 md:p-12">
            <div>
              <h3 className="text-2xl font-semibold tracking-tight">A summary written for the room</h3>
              <p className="text-muted mt-2 max-w-[48ch]">
                We read your profile and write three plain sentences: who you are, what you are strongest at, who you
                are looking for.
              </p>
            </div>
            <figure className="bg-surface shadow-soft rounded-2xl p-6 md:p-8">
              <figcaption className="flex items-center gap-3">
                <Avatar src={me.avatar_url} first={me.first_name} last={me.last_name} size={44} />
                <div>
                  <p className="font-medium">
                    {me.first_name} {me.last_name}
                  </p>
                  <p className="text-muted text-sm">
                    {me.job_title}, {me.company}
                  </p>
                </div>
              </figcaption>
              <blockquote className="mt-5 text-lg leading-relaxed">{me.summary}</blockquote>
            </figure>
            <div className="mt-auto">
              <p className="text-sm font-medium">Matched on</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {['Payments', 'Risk modelling', 'Wants an ML advisor', 'Lender partnerships', 'Seed to Series A'].map(
                  (t) => (
                    <li key={t} className="bg-surface text-ink ring-ember/20 rounded-full px-3.5 py-1.5 text-sm ring-1">
                      {t}
                    </li>
                  ),
                )}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.06}>
          <div className="bg-surface ring-line flex h-full flex-col overflow-hidden rounded-3xl ring-1">
            <div className="relative aspect-[4/3]">
              <Image
                src={photo(1, 800, 600)}
                alt="Someone writing their profile on a laptop"
                fill
                sizes="(min-width: 768px) 30vw, 100vw"
                className="object-cover"
              />
            </div>
            <div className="p-7">
              <h3 className="text-lg font-semibold tracking-tight">Goals in your own words</h3>
              <p className="text-muted mt-1.5 text-sm leading-relaxed">
                &ldquo;Looking for an ML advisor&rdquo; finds the person who wrote &ldquo;open to advising.&rdquo;
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12}>
          <div className="ring-line flex h-full flex-col justify-between gap-8 rounded-3xl bg-[#17181c] p-7 text-[#ececef] ring-1">
            <EyeSlashIcon className="text-ember size-7" />
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Mutual, or nothing</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-[#ececef]/70">
                Nobody learns you were interested unless they were too. No cold requests, no inbox to clear.
              </p>
            </div>
          </div>
        </Reveal>

        <Reveal className="md:col-span-3">
          <div className="bg-surface ring-line grid items-center gap-6 rounded-3xl p-7 ring-1 md:grid-cols-[auto_1fr] md:gap-10 md:p-10">
            <LockKeyIcon className="text-ember size-8" />
            <div>
              <h3 className="text-lg font-semibold tracking-tight">Private to the room</h3>
              <p className="text-muted mt-1.5 max-w-[60ch] text-sm leading-relaxed">
                You only see people at events you joined, and only they can see you. Leave the event and you disappear
                from it.
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
