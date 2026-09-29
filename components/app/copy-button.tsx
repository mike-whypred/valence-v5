'use client';

import { useState } from 'react';
import { CheckIcon, CopyIcon } from '@phosphor-icons/react';
import { cn } from '@/lib/utils';

export function CopyButton({ value, label, className }: { value: string; label: string; className?: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={async () => {
        const text = value.startsWith('/') ? `${window.location.origin}${value}` : value;
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 1600);
      }}
      className={cn(
        'text-muted ring-line hover:text-ink hover:ring-ink/25 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm ring-1 transition-colors active:scale-[0.98]',
        className,
      )}
    >
      {copied ? <CheckIcon weight="bold" className="text-ember size-3.5" /> : <CopyIcon className="size-3.5" />}
      <span aria-live="polite">{copied ? 'Copied' : label}</span>
    </button>
  );
}
