import type { ComponentProps, ReactNode } from 'react';
import { cn } from '@/lib/utils';

const control =
  'w-full rounded-xl bg-surface px-4 text-[15px] text-ink ring-1 ring-line transition-shadow placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-ember aria-[invalid=true]:ring-danger';

export function Field({
  label,
  htmlFor,
  hint,
  error,
  children,
  className,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('grid gap-2', className)}>
      <label htmlFor={htmlFor} className="text-ink text-sm font-medium">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${htmlFor}-error`} className="text-danger text-sm">
          {error}
        </p>
      ) : hint ? (
        <p id={`${htmlFor}-hint`} className="text-muted text-sm">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

export function Input({ className, invalid, ...props }: ComponentProps<'input'> & { invalid?: boolean }) {
  return <input aria-invalid={invalid || undefined} className={cn(control, 'h-12', className)} {...props} />;
}

export function Textarea({ className, invalid, ...props }: ComponentProps<'textarea'> & { invalid?: boolean }) {
  return (
    <textarea
      aria-invalid={invalid || undefined}
      className={cn(control, 'min-h-28 resize-y py-3 leading-relaxed', className)}
      {...props}
    />
  );
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="bg-danger/10 text-danger rounded-xl px-4 py-3 text-sm">
      {message}
    </p>
  );
}
