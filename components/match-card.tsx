import { CheckIcon, MapPinIcon } from '@phosphor-icons/react/ssr';
import { Avatar } from '@/components/avatar';
import { cn, fitPercent } from '@/lib/utils';
import type { Candidate } from '@/lib/types';

export function MatchCard({
  person,
  reasons,
  shared = [],
  className,
  priority,
  hideFit,
}: {
  person: Candidate;
  reasons: string[];
  shared?: string[];
  className?: string;
  priority?: boolean;
  hideFit?: boolean;
}) {
  const sharedSet = new Set(shared.map((s) => s.toLowerCase()));
  return (
    <article
      className={cn(
        'bg-surface ring-line shadow-lift flex h-full flex-col gap-5 rounded-3xl p-6 text-left ring-1 sm:p-7',
        className,
      )}
    >
      <header className="flex items-start gap-4">
        <Avatar
          src={person.avatar_url}
          first={person.first_name}
          last={person.last_name}
          size={64}
          priority={priority}
        />
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold tracking-tight">
            {person.first_name} {person.last_name}
          </h3>
          <p className="text-muted truncate text-sm">
            {person.job_title}, {person.company}
          </p>
        </div>
        {!hideFit && (
          <p className="text-right font-mono leading-none">
            <span className="tabular text-ember block text-2xl font-medium">{fitPercent(person.similarity)}%</span>
            <span className="text-faint mt-1 block text-[11px]">fit</span>
          </p>
        )}
      </header>

      <p className="text-ink/85 text-[15px] leading-relaxed">{person.summary ?? person.bio}</p>

      {reasons.length > 0 && (
        <ul className="grid gap-2">
          {reasons.map((r) => (
            <li key={r} className="text-ink flex items-start gap-2.5 text-sm">
              <CheckIcon weight="bold" className="text-ember mt-0.5 size-4 shrink-0" />
              {r}
            </li>
          ))}
        </ul>
      )}

      <ul className="flex flex-wrap gap-1.5">
        {person.skills.slice(0, 5).map((s) => (
          <li
            key={s}
            className={cn(
              'rounded-full px-3 py-1 text-xs',
              sharedSet.has(s.toLowerCase()) ? 'bg-ember-soft text-ember' : 'bg-sunken text-muted',
            )}
          >
            {s}
          </li>
        ))}
      </ul>

      <footer className="border-line text-muted mt-auto flex items-center gap-1.5 border-t pt-4 text-xs">
        <MapPinIcon className="size-3.5" />
        <span className="truncate">
          {person.event_name}
          {person.location ? `, from ${person.location}` : ''}
        </span>
      </footer>
    </article>
  );
}
