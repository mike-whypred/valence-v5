import 'server-only';
import { cache } from 'react';
import { isDemo } from '@/lib/env';
import { createClient } from '@/lib/supabase/server';
import { demoCandidates, demoConnections, demoEvents, demoJoinedEventIds, demoViewer } from '@/lib/demo-data';
import type { Candidate, Connection, EventInfo, Profile, Viewer } from '@/lib/types';

const PROFILE_COLUMNS =
  'id, first_name, last_name, job_title, company, industry, experience_years, location, bio, skills, networking_goals, avatar_url, role, summary, completed';

export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (isDemo) return demoViewer;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase.from('profiles').select(PROFILE_COLUMNS).eq('id', user.id).maybeSingle();
  const { completed, ...profile } = (data ?? {}) as Profile & { completed?: boolean };
  return {
    id: user.id,
    email: user.email ?? '',
    first_name: (user.user_metadata?.first_name as string) ?? profile.first_name ?? '',
    profile: data && completed ? (profile as Profile) : null,
  };
});

export async function getMyEvents(): Promise<EventInfo[]> {
  if (isDemo) return demoEvents.filter((e) => demoJoinedEventIds.includes(e.id));
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('events')
    .select(
      'id, name, description, starts_at, timezone, location, access_code, max_attendees, cover_url, organizer:profiles!events_organizer_id_fkey(first_name, last_name), event_attendees(count)',
    )
    .order('starts_at');
  if (error) throw error;
  return (data ?? []).map((e) => {
    const organizer = e.organizer as unknown as { first_name: string; last_name: string } | null;
    const counts = e.event_attendees as unknown as { count: number }[];
    return {
      id: e.id,
      name: e.name,
      description: e.description,
      starts_at: e.starts_at,
      timezone: e.timezone,
      location: e.location,
      access_code: e.access_code,
      max_attendees: e.max_attendees,
      cover_url: e.cover_url,
      organizer_name: organizer ? `${organizer.first_name} ${organizer.last_name}`.trim() : '',
      attendee_count: counts?.[0]?.count ?? 0,
    };
  });
}

export async function getCandidates(eventId?: string): Promise<Candidate[]> {
  if (isDemo) return demoCandidates(eventId);
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('match_candidates', { p_event: eventId ?? null, p_limit: 30 });
  if (error) throw error;
  return (data ?? []) as Candidate[];
}

export async function getConnections(): Promise<Connection[]> {
  if (isDemo) return demoConnections;
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('my_connections');
  if (error) throw error;
  return (data ?? []).map((row: Profile & { event_name: string; since: string; status: Connection['status'] }) => {
    const { event_name, since, status, ...profile } = row;
    return { profile, event_name, since, status };
  });
}
