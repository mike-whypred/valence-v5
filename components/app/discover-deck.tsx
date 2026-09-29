'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeftIcon, ArrowRightIcon, HandshakeIcon, SealCheckIcon, XIcon } from '@phosphor-icons/react';
import { Avatar } from '@/components/avatar';
import { MatchCard } from '@/components/match-card';
import { BackCard, SwipeCard, type Direction } from '@/components/swipe';
import { buttonClass } from '@/components/ui/button';
import { respond } from '@/app/actions';
import type { Candidate, Profile } from '@/lib/types';

export type DeckItem = { person: Candidate; reasons: string[]; shared: string[] };

export function DiscoverDeck({
  items,
  me,
}: {
  items: DeckItem[];
  me: Pick<Profile, 'first_name' | 'last_name' | 'avatar_url'>;
}) {
  const [index, setIndex] = useState(0);
  const [dir, setDir] = useState<Direction>('right');
  const [mutual, setMutual] = useState<Candidate | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  const reduce = useReducedMotion();

  const current = items[index];

  const decide = useCallback(
    (d: Direction) => {
      if (!current || mutual) return;
      setDir(d);
      setError(null);
      setIndex((i) => i + 1);
      const person = current.person;
      startTransition(async () => {
        const res = await respond(person.id, person.event_id, d === 'right');
        if (res.error) setError(res.error);
        else if (res.mutual) setMutual(person);
      });
    },
    [current, mutual],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('input, textarea, select')) return;
      if (e.key === 'ArrowLeft') decide('left');
      if (e.key === 'ArrowRight') decide('right');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [decide]);

  const remaining = items.length - index;

  return (
    <div className="grid justify-items-center gap-14">
      <div className="relative h-[460px] w-full max-w-[420px]">
        {remaining === 0 ? (
          <Finished empty={items.length === 0} />
        ) : (
          <>
            {items[index + 2] && (
              <BackCard depth={2}>
                <MatchCard {...items[index + 2]} />
              </BackCard>
            )}
            {items[index + 1] && (
              <BackCard depth={1}>
                <MatchCard {...items[index + 1]} />
              </BackCard>
            )}
            <AnimatePresence initial={false} custom={dir}>
              <SwipeCard key={current.person.id} onDecide={decide}>
                <MatchCard {...current} priority={index === 0} />
              </SwipeCard>
            </AnimatePresence>
          </>
        )}

        <AnimatePresence>
          {mutual && (
            <motion.div
              role="dialog"
              aria-modal="false"
              aria-labelledby="mutual-title"
              className="bg-ink text-canvas shadow-lift absolute inset-0 z-10 grid place-items-center rounded-3xl p-8 text-center"
              initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.94 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: reduce ? 1 : 0.96 }}
              transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            >
              <div className="grid justify-items-center gap-6">
                <div className="flex -space-x-3">
                  <Avatar
                    src={me.avatar_url}
                    first={me.first_name}
                    last={me.last_name}
                    size={72}
                    className="ring-ink ring-4"
                  />
                  <Avatar
                    src={mutual.avatar_url}
                    first={mutual.first_name}
                    last={mutual.last_name}
                    size={72}
                    className="ring-ink ring-4"
                  />
                </div>
                <div>
                  <p className="text-ember inline-flex items-center gap-1.5 text-sm">
                    <SealCheckIcon weight="fill" className="size-4" /> Mutual
                  </p>
                  <h2 id="mutual-title" className="mt-2 text-3xl font-semibold tracking-tight">
                    You and {mutual.first_name} want to meet.
                  </h2>
                  <p className="text-canvas/70 mx-auto mt-3 max-w-[30ch] text-sm leading-relaxed">
                    We let {mutual.first_name} know too. Find each other at {mutual.event_name}.
                  </p>
                </div>
                <button type="button" autoFocus onClick={() => setMutual(null)} className={buttonClass('ember', 'md')}>
                  Keep going
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {remaining > 0 && (
        <div className="grid justify-items-center gap-4">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => decide('left')}
              disabled={!!mutual}
              className="bg-surface ring-line inline-flex h-14 items-center gap-2 rounded-full px-6 font-medium ring-1 transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              <XIcon className="size-5" /> Pass
            </button>
            <button
              type="button"
              onClick={() => decide('right')}
              disabled={!!mutual}
              className="bg-ember text-ember-ink shadow-soft inline-flex h-14 items-center gap-2 rounded-full px-7 font-medium transition-transform hover:-translate-y-0.5 active:scale-95 disabled:opacity-50"
            >
              <HandshakeIcon weight="fill" className="size-5" /> Interested
            </button>
          </div>
          <p className="text-faint hidden items-center gap-2 text-xs sm:flex">
            <kbd className="bg-sunken inline-grid size-6 place-items-center rounded-md">
              <ArrowLeftIcon className="size-3" />
            </kbd>
            <kbd className="bg-sunken inline-grid size-6 place-items-center rounded-md">
              <ArrowRightIcon className="size-3" />
            </kbd>
            or drag the card
          </p>
          {error && (
            <p role="alert" className="text-danger text-sm">
              {error}
            </p>
          )}
        </div>
      )}
      <p className="sr-only" aria-live="polite">
        {mutual
          ? `It is mutual with ${mutual.first_name}.`
          : current
            ? `Showing ${current.person.first_name}. ${remaining} left.`
            : ''}
      </p>
    </div>
  );
}

function Finished({ empty }: { empty: boolean }) {
  return (
    <div className="bg-surface ring-line grid h-full place-items-center rounded-3xl p-10 text-center ring-1">
      <div className="grid justify-items-center gap-4">
        <span className="bg-ember-soft text-ember grid size-14 place-items-center rounded-2xl">
          <SealCheckIcon className="size-7" />
        </span>
        <h2 className="text-2xl font-semibold tracking-tight">
          {empty ? 'Nobody to show yet.' : 'That is everyone for now.'}
        </h2>
        <p className="text-muted max-w-[30ch] text-sm leading-relaxed">
          {empty
            ? 'People appear here once they join and finish their profile. Check back closer to the event.'
            : 'New people appear here as they join your events. Anyone who picks you back shows up in Connections.'}
        </p>
        <Link href="/matches?view=connections" className={buttonClass('primary', 'md', 'mt-2')}>
          See connections
        </Link>
      </div>
    </div>
  );
}
