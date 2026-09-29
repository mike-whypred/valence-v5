'use client';

import { useActionState, useState } from 'react';
import Link from 'next/link';
import { signUp, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { keepValues } from '@/components/ui/use-keep-values';
import { Field, FormError, Input } from '@/components/ui/field';
import { PasswordInput } from '@/components/password-input';
import { cn } from '@/lib/utils';

const roles = [
  { value: 'member', label: 'Attending events' },
  { value: 'organizer', label: 'Hosting events' },
] as const;

export function SignupForm({ initialRole }: { initialRole: 'member' | 'organizer' }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signUp, undefined);
  const [role, setRole] = useState(initialRole);
  const fe = state?.fieldErrors ?? {};
  return (
    <form onSubmit={keepValues(action)} className="grid gap-5" noValidate>
      <FormError message={state?.error} />
      <fieldset className="grid gap-2">
        <legend className="mb-2 text-sm font-medium">I am mostly</legend>
        <div className="bg-sunken grid grid-cols-2 gap-1 rounded-full p-1">
          {roles.map((r) => (
            <label
              key={r.value}
              className={cn(
                'has-[:focus-visible]:outline-ember cursor-pointer rounded-full px-3 py-2 text-center text-sm transition-colors has-[:focus-visible]:outline-2',
                role === r.value ? 'bg-surface text-ink shadow-soft font-medium' : 'text-muted hover:text-ink',
              )}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>
      <div className="grid grid-cols-2 gap-4">
        <Field label="First name" htmlFor="first_name" error={fe.first_name}>
          <Input id="first_name" name="first_name" autoComplete="given-name" required invalid={!!fe.first_name} />
        </Field>
        <Field label="Last name" htmlFor="last_name" error={fe.last_name}>
          <Input id="last_name" name="last_name" autoComplete="family-name" required invalid={!!fe.last_name} />
        </Field>
      </div>
      <Field label="Work email" htmlFor="email" error={fe.email}>
        <Input id="email" name="email" type="email" autoComplete="email" required invalid={!!fe.email} />
      </Field>
      <Field label="Password" htmlFor="password" hint="At least 8 characters." error={fe.password}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="new-password"
          required
          minLength={8}
          invalid={!!fe.password}
        />
      </Field>
      <Button type="submit" variant="ember" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? 'Creating account' : 'Create account'}
      </Button>
      <p className="text-muted text-center text-sm">
        Already have an account?{' '}
        <Link href="/auth/login" className="text-ink font-medium underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
