'use client';

import { useActionState, useEffect, useMemo, useState } from 'react';
import { createEvent, type FormState } from '@/app/actions';
import { Button, ButtonLink } from '@/components/ui/button';
import { Field, FormError, Input, Textarea } from '@/components/ui/field';
import { keepValues } from '@/components/ui/use-keep-values';

function tomorrowAt(hour: number) {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(hour, 0, 0, 0);
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:00`;
}

export function EventForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(createEvent, undefined);
  const [timezone, setTimezone] = useState('UTC');
  const [startsAt, setStartsAt] = useState('');
  const zones = useMemo(
    () => (typeof Intl.supportedValuesOf === 'function' ? Intl.supportedValuesOf('timeZone') : ['UTC']),
    [],
  );
  const fe = state?.fieldErrors ?? {};

  // Browser-only defaults, set after mount so server and client render the same markup.
  useEffect(() => {
    setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC');
    setStartsAt(tomorrowAt(18));
  }, []);

  return (
    <form onSubmit={keepValues(action)} className="grid gap-10" noValidate>
      <FormError message={state?.error} />

      <fieldset className="grid gap-5">
        <legend className="mb-5 text-lg font-semibold tracking-tight">The event</legend>
        <Field label="Name" htmlFor="name" error={fe.name}>
          <Input id="name" name="name" placeholder="Lending Product Circle" invalid={!!fe.name} />
        </Field>
        <Field
          label="Description"
          htmlFor="description"
          hint="One or two sentences guests see before they join."
          error={fe.description}
        >
          <Textarea id="description" name="description" rows={3} invalid={!!fe.description} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-5 text-lg font-semibold tracking-tight">When and where</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Starts" htmlFor="starts_local" error={fe.starts_local}>
            <Input
              id="starts_local"
              name="starts_local"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              invalid={!!fe.starts_local}
            />
          </Field>
          <Field label="Timezone" htmlFor="timezone" hint="Guests see the time in this zone." error={fe.timezone}>
            <select
              id="timezone"
              name="timezone"
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="bg-surface ring-line focus:ring-ember h-12 w-full rounded-xl px-4 text-[15px] ring-1 focus:ring-2 focus:outline-none"
            >
              {(zones.includes(timezone) ? zones : [timezone, ...zones]).map((z) => (
                <option key={z} value={z}>
                  {z.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Venue" htmlFor="location" error={fe.location}>
          <Input id="location" name="location" placeholder="44 Tehama St, San Francisco" invalid={!!fe.location} />
        </Field>
      </fieldset>

      <fieldset className="grid gap-5">
        <legend className="mb-5 text-lg font-semibold tracking-tight">Access</legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label="Access code"
            htmlFor="access_code"
            hint="Leave blank and we will generate one."
            error={fe.access_code}
          >
            <Input
              id="access_code"
              name="access_code"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={16}
              className="font-mono tracking-[0.12em] uppercase"
              invalid={!!fe.access_code}
            />
          </Field>
          <Field label="Guest limit" htmlFor="max_attendees" hint="Optional." error={fe.max_attendees}>
            <Input
              id="max_attendees"
              name="max_attendees"
              type="number"
              inputMode="numeric"
              min={2}
              invalid={!!fe.max_attendees}
            />
          </Field>
        </div>
        <Field
          label="Cover image link"
          htmlFor="cover_url"
          hint="Optional. Shown on the join screen and dashboard."
          error={fe.cover_url}
        >
          <Input id="cover_url" name="cover_url" type="url" placeholder="https://" invalid={!!fe.cover_url} />
        </Field>
      </fieldset>

      <div className="border-line flex flex-wrap items-center gap-3 border-t pt-8">
        <Button type="submit" variant="ember" size="lg" disabled={pending}>
          {pending ? 'Creating' : 'Create event'}
        </Button>
        <ButtonLink href="/host" variant="ghost" size="lg">
          Cancel
        </ButtonLink>
      </div>
    </form>
  );
}
