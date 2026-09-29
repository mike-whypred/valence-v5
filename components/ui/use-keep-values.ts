'use client';

import { startTransition, type FormEvent } from 'react';

/**
 * React resets uncontrolled fields after a form action runs. For forms that can fail validation,
 * submit through onSubmit instead so people keep what they typed.
 */
export function keepValues(action: (data: FormData) => void) {
  return (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    startTransition(() => action(data));
  };
}
