import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';

export function Closing() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 md:pb-32 lg:px-8">
      <Reveal>
        <div className="bg-surface ring-line relative overflow-hidden rounded-3xl px-8 py-16 ring-1 md:px-16 md:py-24">
          <div
            aria-hidden
            className="bg-ember/15 pointer-events-none absolute -top-40 -right-40 size-[28rem] rounded-full blur-3xl"
          />
          <div className="relative grid items-end gap-10 md:grid-cols-[1fr_auto]">
            <h2 className="max-w-2xl text-4xl font-semibold tracking-tighter md:text-6xl">
              Your next event is already on the calendar.
            </h2>
            <ButtonLink href="/auth/signup" variant="ember" size="lg" className="group">
              Get started
              <ArrowRightIcon weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5" />
            </ButtonLink>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
