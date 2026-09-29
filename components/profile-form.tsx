'use client';

import { useActionState, useRef, useState, type KeyboardEvent } from 'react';
import { XIcon } from '@phosphor-icons/react';
import { saveProfile, type FormState } from '@/app/actions';
import { MatchCard } from '@/components/match-card';
import { Button } from '@/components/ui/button';
import { keepValues } from '@/components/ui/use-keep-values';
import { Field, FormError, Input, Textarea } from '@/components/ui/field';
import type { Profile } from '@/lib/types';

type Draft = Pick<
  Profile,
  'job_title' | 'company' | 'industry' | 'experience_years' | 'location' | 'bio' | 'networking_goals' | 'skills'
>;

const SUGGESTED = ['Product strategy', 'Fundraising', 'Machine learning', 'Design', 'Sales', 'Hiring', 'Partnerships'];

export function ProfileForm({
  initial,
  person,
  editing,
}: {
  initial: Draft;
  person: Pick<Profile, 'first_name' | 'last_name' | 'avatar_url'>;
  editing: boolean;
}) {
  const [state, action, pending] = useActionState<FormState, FormData>(saveProfile, undefined);
  const [draft, setDraft] = useState<Draft>(initial);
  const [skills, setSkills] = useState<string[]>(initial.skills);
  const [skillInput, setSkillInput] = useState('');
  const skillRef = useRef<HTMLInputElement>(null);
  const fe = state?.fieldErrors ?? {};

  const addSkill = (raw: string) => {
    const s = raw.trim().replace(/,$/, '');
    if (s && !skills.some((x) => x.toLowerCase() === s.toLowerCase()) && skills.length < 12) setSkills([...skills, s]);
    setSkillInput('');
  };
  const onSkillKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addSkill(skillInput);
    } else if (e.key === 'Backspace' && !skillInput && skills.length) {
      setSkills(skills.slice(0, -1));
    }
  };

  const onInput = (e: React.FormEvent<HTMLFormElement>) => {
    const f = new FormData(e.currentTarget);
    setDraft((d) => ({
      ...d,
      job_title: String(f.get('job_title') ?? ''),
      company: String(f.get('company') ?? ''),
      industry: String(f.get('industry') ?? ''),
      experience_years: Number(f.get('experience_years') ?? 0),
      location: String(f.get('location') ?? ''),
      bio: String(f.get('bio') ?? ''),
      networking_goals: String(f.get('networking_goals') ?? ''),
    }));
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-12 lg:grid-cols-12">
      <form
        onSubmit={keepValues(action)}
        onInput={onInput}
        className="grid content-start gap-10 lg:col-span-7"
        noValidate
      >
        <FormError message={state?.error} />

        <fieldset className="grid gap-5">
          <legend className="mb-5 text-lg font-semibold tracking-tight">Where you work</legend>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Role" htmlFor="job_title" error={fe.job_title}>
              <Input
                id="job_title"
                name="job_title"
                defaultValue={initial.job_title}
                autoComplete="organization-title"
                invalid={!!fe.job_title}
              />
            </Field>
            <Field label="Company" htmlFor="company" error={fe.company}>
              <Input
                id="company"
                name="company"
                defaultValue={initial.company}
                autoComplete="organization"
                invalid={!!fe.company}
              />
            </Field>
            <Field label="Industry" htmlFor="industry" error={fe.industry}>
              <Input id="industry" name="industry" defaultValue={initial.industry} invalid={!!fe.industry} />
            </Field>
            <div className="grid grid-cols-[6rem_1fr] gap-4">
              <Field label="Years" htmlFor="experience_years" error={fe.experience_years}>
                <Input
                  id="experience_years"
                  name="experience_years"
                  type="number"
                  inputMode="numeric"
                  min={0}
                  max={70}
                  defaultValue={initial.experience_years || ''}
                  invalid={!!fe.experience_years}
                />
              </Field>
              <Field label="City" htmlFor="location" error={fe.location}>
                <Input
                  id="location"
                  name="location"
                  defaultValue={initial.location ?? ''}
                  autoComplete="address-level2"
                />
              </Field>
            </div>
          </div>
        </fieldset>

        <fieldset className="grid gap-5">
          <legend className="mb-5 text-lg font-semibold tracking-tight">What you bring</legend>
          <Field
            label="Background"
            htmlFor="bio"
            hint="Two or three sentences. What you work on, and what you have done before."
            error={fe.bio}
          >
            <Textarea
              id="bio"
              name="bio"
              defaultValue={initial.bio}
              rows={4}
              invalid={!!fe.bio}
              aria-describedby="bio-hint"
            />
          </Field>
          <Field
            label="Skills"
            htmlFor="skill-input"
            hint="Press Enter after each one. Two to twelve."
            error={fe.skills}
          >
            <div
              onClick={() => skillRef.current?.focus()}
              className="bg-surface ring-line focus-within:ring-ember flex min-h-12 flex-wrap items-center gap-1.5 rounded-xl px-2 py-2 ring-1 focus-within:ring-2"
            >
              {skills.map((s) => (
                <span key={s} className="bg-sunken inline-flex items-center gap-1 rounded-full py-1 pr-1 pl-3 text-sm">
                  {s}
                  <button
                    type="button"
                    onClick={() => setSkills(skills.filter((x) => x !== s))}
                    aria-label={`Remove ${s}`}
                    className="text-muted hover:bg-line hover:text-ink grid size-5 place-items-center rounded-full"
                  >
                    <XIcon className="size-3" />
                  </button>
                </span>
              ))}
              <input
                ref={skillRef}
                id="skill-input"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={onSkillKey}
                onBlur={() => skillInput && addSkill(skillInput)}
                className="min-w-32 flex-1 bg-transparent px-2 py-1 text-[15px] outline-none"
                aria-describedby="skill-input-hint"
              />
            </div>
            <input type="hidden" name="skills" value={skills.join(',')} />
          </Field>
          {skills.length < 3 && (
            <div className="-mt-2 flex flex-wrap gap-1.5">
              {SUGGESTED.filter((s) => !skills.includes(s))
                .slice(0, 5)
                .map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => addSkill(s)}
                    className="text-muted ring-line hover:text-ink hover:ring-ink/25 rounded-full px-3 py-1 text-sm ring-1"
                  >
                    + {s}
                  </button>
                ))}
            </div>
          )}
        </fieldset>

        <fieldset className="grid gap-5">
          <legend className="mb-5 text-lg font-semibold tracking-tight">Who you want to meet</legend>
          <Field
            label="Goals"
            htmlFor="networking_goals"
            hint="Be specific. “An ML advisor for credit models” matches better than “interesting people.”"
            error={fe.networking_goals}
          >
            <Textarea
              id="networking_goals"
              name="networking_goals"
              defaultValue={initial.networking_goals}
              rows={3}
              invalid={!!fe.networking_goals}
            />
          </Field>
        </fieldset>

        <div className="border-line flex flex-wrap items-center gap-4 border-t pt-8">
          <Button type="submit" variant="ember" size="lg" disabled={pending}>
            {pending ? 'Saving and summarizing' : editing ? 'Save changes' : 'Save profile'}
          </Button>
          <p className="text-muted text-sm">We write your summary when you save.</p>
        </div>
      </form>

      <aside className="lg:col-span-5">
        <div className="lg:sticky lg:top-28">
          <p className="text-muted mb-4 text-sm font-medium">How you appear to others</p>
          <MatchCard
            person={{
              ...draft,
              ...person,
              skills,
              id: 'preview',
              role: 'member',
              summary: draft.bio ? null : 'Your background shows here until your summary is written.',
              similarity: 0.84,
              event_id: '',
              event_name: 'Your next event',
              job_title: draft.job_title || 'Your role',
              company: draft.company || 'your company',
            }}
            hideFit
            reasons={
              draft.networking_goals
                ? [`${draft.networking_goals.slice(0, 90)}${draft.networking_goals.length > 90 ? '…' : ''}`]
                : []
            }
          />
        </div>
      </aside>
    </div>
  );
}
