'use client';

import { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { ArrowCounterClockwiseIcon, HandshakeIcon, XIcon } from '@phosphor-icons/react';
import { MatchCard } from '@/components/match-card';
import { BackCard, SwipeCard, type Direction } from '@/components/swipe';
import { demoCandidates, demoViewerProfile } from '@/lib/demo-data';
import { matchReasons, sharedSkills } from '@/lib/matching';

const people = demoCandidates().slice(0, 4);

/** A working miniature of the Discover screen, built from the same components, running on sample data. */
export function HeroDeck() {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<Direction>('right');
  const [last, setLast] = useState<{ name: string; dir: Direction } | null>(null);

  const decide = (d: Direction) => {
    setDir(d);
    setLast({ name: people[index % people.length].first_name, dir: d });
    setIndex((i) => i + 1);
  };

  const at = (offset: number) => people[(index + offset) % people.length];
  const card = (p: (typeof people)[number], priority = false) => (
    <MatchCard
      person={p}
      reasons={matchReasons(demoViewerProfile, p)}
      shared={sharedSkills(demoViewerProfile, p)}
      priority={priority}
    />
  );

  return (
    <div className="w-full max-w-[400px]">
      <div className="relative h-[440px]">
        <BackCard depth={2}>{card(at(2))}</BackCard>
        <BackCard depth={1}>{card(at(1))}</BackCard>
        <AnimatePresence initial={false} custom={dir}>
          <SwipeCard key={index} onDecide={decide}>
            {card(at(0), index === 0)}
          </SwipeCard>
        </AnimatePresence>
      </div>
      <div className="mt-10 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => decide('left')}
          aria-label="Pass"
          className="bg-surface text-ink ring-line grid size-12 place-items-center rounded-full ring-1 transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <XIcon className="size-5" />
        </button>
        <button
          type="button"
          onClick={() => decide('right')}
          aria-label="Interested"
          className="bg-ember text-ember-ink shadow-soft grid size-14 place-items-center rounded-full transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <HandshakeIcon weight="fill" className="size-6" />
        </button>
        <button
          type="button"
          onClick={() => setIndex(0)}
          aria-label="Start over"
          className="bg-surface text-muted ring-line hover:text-ink grid size-12 place-items-center rounded-full ring-1 transition-transform hover:-translate-y-0.5 active:scale-95"
        >
          <ArrowCounterClockwiseIcon className="size-5" />
        </button>
      </div>
      <p className="sr-only" aria-live="polite">
        {last ? `${last.dir === 'right' ? 'Interested in' : 'Passed on'} ${last.name}` : ''}
      </p>
    </div>
  );
}
