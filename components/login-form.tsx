'use client';

import { useActionState } from 'react';
import Link from 'next/link';
import { signIn, type FormState } from '@/app/actions';
import { Button } from '@/components/ui/button';
import { keepValues } from '@/components/ui/use-keep-values';
import { Field, FormError, Input } from '@/components/ui/field';
import { PasswordInput } from '@/components/password-input';

export function LoginForm({ demo }: { demo: boolean }) {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, undefined);
  const fe = state?.fieldErrors ?? {};
  return (
    <form onSubmit={keepValues(action)} className="grid gap-5" noValidate>
      <FormError message={state?.error} />
      <Field label="Email" htmlFor="email" error={fe.email}>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          required
          invalid={!!fe.email}
          defaultValue={demo ? 'tomas@keelrisk.com' : undefined}
        />
      </Field>
      <Field label="Password" htmlFor="password" error={fe.password}>
        <PasswordInput
          id="password"
          name="password"
          autoComplete="current-password"
          required
          invalid={!!fe.password}
          defaultValue={demo ? 'sample-password' : undefined}
        />
      </Field>
      <Button type="submit" size="lg" disabled={pending} className="mt-2 w-full">
        {pending ? 'Signing in' : 'Sign in'}
      </Button>
      <p className="text-muted text-center text-sm">
        New here?{' '}
        <Link href="/auth/signup" className="text-ink font-medium underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}
