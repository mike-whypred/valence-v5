'use client';

import { useState, type ComponentProps } from 'react';
import { EyeIcon, EyeSlashIcon } from '@phosphor-icons/react';
import { Input } from '@/components/ui/field';

export function PasswordInput(props: ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Input {...props} type={show ? 'text' : 'password'} className="pr-12" />
      <button
        type="button"
        onClick={() => setShow((s) => !s)}
        aria-label={show ? 'Hide password' : 'Show password'}
        className="text-muted hover:text-ink absolute top-1/2 right-2 grid size-8 -translate-y-1/2 place-items-center rounded-lg"
      >
        {show ? <EyeSlashIcon className="size-[18px]" /> : <EyeIcon className="size-[18px]" />}
      </button>
    </div>
  );
}
