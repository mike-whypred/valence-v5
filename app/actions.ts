'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { isDemo } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { demoEvents, demoPeople } from '@/lib/demo-data';
import { summarizeProfile } from '@/lib/ai';
import { isTimeZone, wallTimeToIso } from '@/lib/time';

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

// Hosting -------------------------------------------------------------------

const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // no 0/O or 1/I

function generateCode(length = 8) {
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('');
}

const blankToUndefined = (v: unknown) => (typeof v === 'string' && v.trim() === '' ? undefined : v);

const eventSchema = z
  .object({
    name: z.string().trim().min(3, 'Give the event a name').max(80),
    description: z.string().trim().max(400, 'Keep it under 400 characters').default(''),
    starts_local: z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/, 'Pick a date and time'),
    timezone: z.string().refine(isTimeZone, 'Pick a timezone'),
    location: z.string().trim().min(3, 'Add a venue or address').max(160),
    max_attendees: z.preprocess(
      blankToUndefined,
      z.coerce.number().int('Whole numbers only').min(2, 'At least 2').max(5000, 'Up to 5,000').optional(),
    ),
    cover_url: z.preprocess(blankToUndefined, z.url('Use a full https:// link').optional()),
    access_code: z.preprocess(
      (v) => (typeof v === 'string' ? v.trim().toUpperCase() || undefined : v),
      z
        .string()
        .regex(/^[A-Z0-9]{4,16}$/, '4 to 16 letters or numbers, no spaces')
        .optional(),
    ),
  })
  .transform(({ starts_local, ...rest }) => ({ ...rest, starts_at: wallTimeToIso(starts_local, rest.timezone) }))
  .refine((e) => new Date(e.starts_at) > new Date(), { message: 'Pick a time in the future', path: ['starts_local'] });

export async function createEvent(_: FormState, form: FormData): Promise<FormState> {
  const parsed = eventSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { fieldErrors: fieldErrors(parsed.error) };
  const { access_code, ...event } = parsed.data;

  let code = access_code ?? generateCode();
  if (!isDemo) {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    // A chosen code that is taken is the organizer's to fix; a generated one we retry.
    for (let attempt = 0; ; attempt++) {
      const { error } = await supabase
        .from('events')
        .insert({ ...event, access_code: code, organizer_id: user.id, max_attendees: event.max_attendees ?? null });
      if (!error) break;
      if (error.code !== '23505')
        return { error: 'We could not create the event. Check that your account can host events.' };
      if (access_code) return { fieldErrors: { access_code: 'Another event already uses this code' } };
      if (attempt >= 4) return { error: 'We could not generate a unique code. Please try again.' };
      code = generateCode();
    }
    revalidatePath('/host');
  }
  redirect(`/host?created=${code}`);
}
