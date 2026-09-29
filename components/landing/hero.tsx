import Image from 'next/image';
import { ArrowRightIcon } from '@phosphor-icons/react/ssr';
import { ButtonLink } from '@/components/ui/button';
import { Reveal } from '@/components/reveal';
import { HeroDeck } from '@/components/landing/hero-deck';
import { photo } from '@/lib/demo-data';

export function Hero() {
  return (
    <section className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 pt-10 pb-20 sm:px-6 lg:min-h-[calc(100dvh-4rem)] lg:grid-cols-12 lg:gap-8 lg:px-8 lg:pt-8 lg:pb-16">
      <div className="lg:col-span-7 lg:pr-10">
        <Reveal>
          <h1 className="text-[2.6rem] leading-[1.02] font-semibold tracking-tighter sm:text-6xl xl:text-7xl">
            Know who to meet before you arrive.
          </h1>
        </Reveal>
        <Reveal delay={0.08}>
          <p className="text-muted mt-6 max-w-[34rem] text-lg leading-relaxed">
            Valence reads every attendee&apos;s profile and goals, then introduces you to the few people where the
            interest is mutual.
          </p>
        </Reveal>
        <Reveal delay={0.16} className="mt-9 flex flex-wrap gap-3">
          <ButtonLink href="/auth/signup" variant="ember" size="lg" className="group">
            Get started
            <ArrowRightIcon weight="bold" className="size-4 transition-transform group-hover:translate-x-0.5" />
          </ButtonLink>
          <ButtonLink href="/events/join" variant="secondary" size="lg">
            Join with a code
          </ButtonLink>
        </Reveal>
      </div>

      <div className="relative lg:col-span-5">
        <div className="absolute inset-y-6 right-0 hidden w-[82%] overflow-hidden rounded-3xl lg:block">
          <Image
            src={photo(378, 1100, 1300)}
            alt="Three people talking by a window overlooking the city"
            fill
            priority
            sizes="(min-width: 1024px) 40vw, 0px"
            className="object-cover grayscale"
          />
          <div className="from-canvas/60 via-canvas/10 absolute inset-0 bg-gradient-to-r to-transparent" />
        </div>
        <Reveal delay={0.2} className="relative flex justify-center lg:justify-start lg:py-14">
          <HeroDeck />
        </Reveal>
      </div>
    </section>
  );
}
