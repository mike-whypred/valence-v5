'use client';

import { useActionState, useState, useTransition } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { CalendarBlankIcon, MapPinIcon, UsersThreeIcon } from '@phosphor-icons/react';
import { findEvent, joinEvent, type LookupState } from '@/app/actions';
import { Button, ButtonLink } from '@/components/ui/button';
import { keepValues } from '@/components/ui/use-keep-values';
import { formatEventDate } from '@/lib/utils';

export function JoinForm({ initialCode = '' }: { initialCode?: string }) {
  const [state, lookup, searching] = useActionState<LookupState, FormData>(findEvent, undefined);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [joining, startJoin] = useTransition();
  const reduce = useReducedMotion();
  const event = state?.event;

  return (
    <div className="grid gap-6">
      <form onSubmit={keepValues(lookup)} className="grid gap-3">
        <label htmlFor="code" className="text-sm font-medium">
          Access code
        </label>
        <div className="flex flex-col gap-3 sm:flex-row">
          <input
            id="code"
            name="code"
            defaultValue={initialCode}
            required
            minLength={4}
            maxLength={16}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            placeholder="FOUNDRY26"
            aria-invalid={state?.error ? true : undefined}
            aria-describedby="code-help"
            className="bg-surface ring-line placeholder:text-faint/60 focus:ring-ember aria-[invalid=true]:ring-danger h-16 flex-1 rounded-xl px-5 font-mono text-2xl tracking-[0.2em] uppercase ring-1 focus:ring-2 focus:outline-none"
          />
          <Button type="submit" size="lg" disabled={searching} className="h-16 px-8">
            {searching ? 'Looking up' : 'Find event'}
          </Button>
        </div>
        <p
          id="code-help"
          className={state?.error ? 'text-danger text-sm' : 'text-muted text-sm'}
          role={state?.error ? 'alert' : undefined}
        >
          {state?.error ?? 'It is in the invitation email from your organizer.'}
        </p>
      </form>

      <AnimatePresence mode="wait">
        {searching && !event ? (
          <div key="skeleton" className="skeleton h-72 rounded-2xl" aria-hidden />
        ) : event ? (
          <motion.article
            key={event.id}
            initial={reduce ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-surface ring-line overflow-hidden rounded-2xl ring-1"
          >
            {event.cover_url && (
              <div className="relative aspect-[21/9]">
                <Image
                  src={event.cover_url}
                  alt=""
                  fill
                  sizes="(min-width: 768px) 640px, 100vw"
                  className="object-cover"
                />
              </div>
            )}
            <div className="grid gap-5 p-6 md:p-8">
              <div>
                <p className="text-muted text-sm">Hosted by {event.organizer_name}</p>
                <h2 className="mt-1 text-2xl font-semibold tracking-tight">{event.name}</h2>
                <p className="text-muted mt-2 leading-relaxed">{event.description}</p>
              </div>
              <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <CalendarBlankIcon className="text-ember size-4" /> {formatEventDate(event.starts_at, event.timezone)}
                </li>
                <li className="flex items-center gap-2">
                  <MapPinIcon className="text-ember size-4 shrink-0" /> {event.location}
                </li>
                <li className="flex items-center gap-2">
                  <UsersThreeIcon className="text-ember size-4" /> {event.attendee_count}
                  {event.max_attendees ? ` of ${event.max_attendees}` : ''} going
                </li>
              </ul>
              {event.already_joined ? (
                <ButtonLink href={`/matches?event=${event.id}`} variant="primary" className="justify-self-start">
                  You are in. See who is going
                </ButtonLink>
              ) : (
                <div className="grid gap-2">
                  <Button
                    variant="ember"
                    size="lg"
                    disabled={joining}
                    className="justify-self-start"
                    onClick={() =>
                      startJoin(async () => {
                        const res = await joinEvent(event.code);
                        if (res?.error) setJoinError(res.error);
                      })
                    }
                  >
                    {joining ? 'Joining' : 'Join event'}
                  </Button>
                  {joinError && (
                    <p role="alert" className="text-danger text-sm">
                      {joinError}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.article>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
