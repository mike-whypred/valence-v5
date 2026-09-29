'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isDemo } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { demoEvents, demoPeople } from '@/lib/demo-data';
import { summarizeProfile } from '@/lib/ai';

export type FormState = { error?: string; fieldErrors?: Record<string, string> } | undefined;

function fieldErrors(error: z.ZodError) {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? 'form');
    out[key] ??= issue.message;
  }
  return out;
}

// Auth ----------------------------------------------------------------------

const credentials = z.object({
  email: z.email('Enter a valid email address'),
  password: z.string().min(8, 'Use at least 8 characters'),
});

export async function signIn(_: FormState, form: FormData): Promise<FormState> {
  const parsed = credentials.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  if (!isDemo) {
    const supabase = await createClient();
    const { error } = await supabase.auth.signInWithPassword(parsed.data);
    if (error) return { error: 'That email and password do not match an account.' };
  }
  redirect('/dashboard');
}

const signUpSchema = credentials.extend({
  first_name: z.string().trim().min(1, 'Required'),
  last_name: z.string().trim().min(1, 'Required'),
  role: z.enum(['member', 'organizer']),
});

export async function signUp(_: FormState, form: FormData): Promise<FormState> {
  const parsed = signUpSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  if (!isDemo) {
    const { email, password, ...meta } = parsed.data;
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: meta } });
    if (error) return { error: error.message };
    if (!data.session) return { error: 'Check your inbox to confirm your email, then sign in.' };
  }
  redirect('/profile/setup');
}

export async function signOut() {
  if (!isDemo) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  redirect('/');
}

// Profile -------------------------------------------------------------------

const profileSchema = z.object({
  job_title: z.string().trim().min(2, 'Add your role'),
  company: z.string().trim().min(1, 'Add where you work'),
  industry: z.string().trim().min(2, 'Add your industry'),
  experience_years: z.coerce.number().int().min(0, 'Must be 0 or more').max(70, 'That seems high'),
  location: z.string().trim().max(80).optional(),
  bio: z.string().trim().min(40, 'Write at least a couple of sentences (40+ characters)').max(800),
  networking_goals: z.string().trim().min(20, 'Say who you want to meet (20+ characters)').max(500),
  skills: z
    .string()
    .transform((s) =>
      s
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
    )
    .pipe(z.array(z.string().max(40)).min(2, 'Add at least two skills').max(12, 'Keep it to 12 skills')),
});

export async function saveProfile(_: FormState, form: FormData): Promise<FormState> {
  const parsed = profileSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  if (!isDemo) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const ai = await summarizeProfile(parsed.data).catch((err) => {
      console.error('profile summary failed', err);
      return null;
    });
    const { error } = await supabase
      .from('profiles')
      .update({
        ...parsed.data,
        location: parsed.data.location || null,
        completed: true,
        ...(ai?.summary ? { summary: ai.summary } : {}),
        ...(ai?.embedding ? { embedding: JSON.stringify(ai.embedding) } : {}),
      })
      .eq('id', user.id);
    if (error) return { error: 'We could not save your profile. Please try again.' };
  }
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

// Events --------------------------------------------------------------------

export type FoundEvent = {
  id: string;
  name: string;
  description: string;
  starts_at: string;
  timezone: string;
  location: string;
  organizer_name: string;
  attendee_count: number;
  max_attendees: number | null;
  cover_url: string | null;
  already_joined: boolean;
  code: string;
};

export type LookupState = { event?: FoundEvent; error?: string } | undefined;

export async function findEvent(_: LookupState, form: FormData): Promise<LookupState> {
  const code = String(form.get('code') ?? '')
    .trim()
    .toUpperCase();
  if (code.length < 4) return { error: 'Access codes are at least 4 characters.' };

  if (isDemo) {
    const e = demoEvents.find((x) => x.access_code === code);
    if (!e) return { error: `No event uses the code ${code}. Try FOUNDRY26 or CLINICML.` };
    return { event: { ...e, already_joined: e.id !== 'evt-clinic', code } };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('find_event_by_code', { code });
  if (error) return { error: 'Lookup failed. Please try again.' };
  const e = data?.[0];
  if (!e) return { error: `No event uses the code ${code}. Check your invitation.` };
  return { event: { ...e, code } };
}

export async function joinEvent(code: string) {
  let eventId: string;
  if (isDemo) {
    eventId = demoEvents.find((x) => x.access_code === code)?.id ?? demoEvents[0].id;
  } else {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc('join_event', { code });
    if (error)
      return { error: error.message === 'event is full' ? 'This event is full.' : 'Could not join this event.' };
    eventId = data as string;
  }
  revalidatePath('/', 'layout');
  redirect(`/matches?event=${eventId}`);
}

// Matching ------------------------------------------------------------------

export async function respond(targetId: string, eventId: string, interested: boolean) {
  if (isDemo) {
    const p = demoPeople.find((x) => x.id === targetId);
    return { mutual: interested && Boolean(p?.likes_you) };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('express_interest', {
    target: targetId,
    p_event: eventId,
    p_interested: interested,
  });
  if (error) return { mutual: false, error: 'Could not save that. Please try again.' };
  if (data) revalidatePath('/dashboard');
  return { mutual: Boolean(data) };
}
