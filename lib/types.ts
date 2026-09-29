export type Role = 'member' | 'organizer';

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  job_title: string;
  company: string;
  industry: string;
  experience_years: number;
  location: string | null;
  bio: string;
  skills: string[];
  networking_goals: string;
  avatar_url: string | null;
  role: Role;
  summary: string | null;
}

export interface EventInfo {
  id: string;
  name: string;
  description: string;
  starts_at: string;
  timezone: string;
  location: string;
  access_code: string;
  organizer_name: string;
  attendee_count: number;
  max_attendees: number | null;
  cover_url: string | null;
}

export interface Candidate extends Profile {
  similarity: number;
  event_id: string;
  event_name: string;
}

export interface Connection {
  profile: Profile;
  event_name: string;
  since: string;
  status: 'connected' | 'waiting';
}

export interface Viewer {
  id: string;
  email: string;
  first_name: string;
  profile: Profile | null;
}
