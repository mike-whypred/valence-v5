import type { Candidate, Connection, EventInfo, Profile, Viewer } from '@/lib/types';

// Sample data used when Supabase is not configured. Names, companies and events are fictional.

const portrait = (set: 'men' | 'women', n: number) => `https://randomuser.me/api/portraits/${set}/${n}.jpg`;
export const photo = (id: number, w: number, h: number) => `https://picsum.photos/id/${id}/${w}/${h}`;

export const demoViewerProfile: Profile = {
  id: 'demo-viewer',
  first_name: 'Tomás',
  last_name: 'Ferreira',
  job_title: 'Head of Product',
  company: 'Keel Risk',
  industry: 'Fintech',
  experience_years: 9,
  location: 'San Francisco, CA',
  bio: 'I lead product at a small team building credit-risk models for independent lenders. Before that I ran payments onboarding at a marketplace.',
  skills: ['Product strategy', 'Payments', 'Risk modelling', 'SQL', 'Go-to-market'],
  networking_goals:
    'Looking for design partners among lenders, an ML advisor for our risk models, and founders a year or two ahead of us on fundraising.',
  avatar_url: portrait('men', 85),
  role: 'member',
  summary:
    'Product leader in fintech with nine years across payments and credit risk. Strongest on turning model output into lender-facing workflows. Wants design partners, an ML advisor, and candid fundraising advice.',
};

export const demoViewer: Viewer = {
  id: demoViewerProfile.id,
  email: 'tomas@keelrisk.com',
  first_name: demoViewerProfile.first_name,
  profile: demoViewerProfile,
};

export const demoEvents: EventInfo[] = [
  {
    id: 'evt-foundry',
    name: 'Applied AI Founders Dinner',
    description:
      'Sixty founders and operators shipping AI into regulated industries. Long tables, no panels, three courses.',
    starts_at: '2026-10-14T18:30:00-07:00',
    timezone: 'America/Los_Angeles',
    location: 'The Pearl, 601 19th St, San Francisco',
    access_code: 'FOUNDRY26',
    organizer_name: 'Harbor & Pine',
    attendee_count: 58,
    max_attendees: 64,
    cover_url: photo(195, 1200, 800),
  },
  {
    id: 'evt-ledger',
    name: 'Climate x Fintech Breakfast',
    description: 'A standing breakfast for people moving capital toward climate projects. Coffee at 8, done by 10.',
    starts_at: '2026-10-22T08:00:00-04:00',
    timezone: 'America/New_York',
    location: 'Brooklyn Navy Yard, Building 77',
    access_code: 'GREENLEDGER',
    organizer_name: 'Tidewater Collective',
    attendee_count: 37,
    max_attendees: 50,
    cover_url: photo(42, 1200, 800),
  },
  {
    id: 'evt-clinic',
    name: 'Healthcare ML Roundtable',
    description: 'Clinicians, researchers and product teams comparing notes on deploying models in hospitals.',
    starts_at: '2026-11-05T17:00:00-08:00',
    timezone: 'America/Los_Angeles',
    location: 'Mission Bay Conference Center, San Francisco',
    access_code: 'CLINICML',
    organizer_name: 'Aster Health',
    attendee_count: 44,
    max_attendees: 80,
    cover_url: photo(180, 1200, 800),
  },
];

/** Events the demo viewer has already joined. */
export const demoJoinedEventIds = ['evt-foundry', 'evt-ledger'];

type DemoPerson = Profile & { event_id: string; similarity: number; likes_you: boolean };

const person = (p: Omit<DemoPerson, 'role' | 'summary'> & { summary?: string }): DemoPerson => ({
  role: 'member',
  summary: p.summary ?? null,
  ...p,
});

export const demoPeople: DemoPerson[] = [
  person({
    id: 'p-amara',
    first_name: 'Amara',
    last_name: 'Okafor',
    job_title: 'Head of Partnerships',
    company: 'Tessellate Payments',
    industry: 'Fintech',
    experience_years: 11,
    location: 'Oakland, CA',
    bio: 'I build lending and card partnerships for a payments infrastructure company. Previously underwriting at a community bank.',
    skills: ['Partnerships', 'Payments', 'Underwriting', 'Negotiation'],
    networking_goals:
      'Meeting risk and data teams who could plug into our lender network. Always happy to mentor first-time PMs.',
    avatar_url: portrait('women', 44),
    event_id: 'evt-foundry',
    similarity: 0.87,
    likes_you: true,
    summary:
      'Partnerships lead with an underwriting background. Connects fintech products to lender networks and mentors early product managers.',
  }),
  person({
    id: 'p-kenji',
    first_name: 'Kenji',
    last_name: 'Watanabe',
    job_title: 'Staff ML Engineer',
    company: 'Corvid Labs',
    industry: 'AI infrastructure',
    experience_years: 12,
    location: 'San Francisco, CA',
    bio: 'I train and evaluate tabular models for fraud and credit. Lately mostly calibration, drift monitoring and model governance.',
    skills: ['Machine learning', 'Risk modelling', 'Python', 'Model governance'],
    networking_goals:
      'Open to advising one or two early teams working on credit or fraud models. Curious about product roles.',
    avatar_url: portrait('men', 32),
    event_id: 'evt-foundry',
    similarity: 0.82,
    likes_you: true,
    summary:
      'Senior ML engineer focused on credit and fraud models, calibration and governance. Open to advising early fintech teams.',
  }),
  person({
    id: 'p-lucia',
    first_name: 'Lucía',
    last_name: 'Márquez',
    job_title: 'Founder',
    company: 'Fieldnote',
    industry: 'Climate data',
    experience_years: 7,
    location: 'Brooklyn, NY',
    bio: 'Fieldnote turns satellite and soil data into loan-ready risk scores for regenerative farms. We closed our seed in March.',
    skills: ['Fundraising', 'Remote sensing', 'Go-to-market', 'Agriculture'],
    networking_goals:
      'Want to talk to lenders and anyone who has sold risk models into banks. Hiring a founding product person.',
    avatar_url: portrait('women', 65),
    event_id: 'evt-ledger',
    similarity: 0.79,
    likes_you: false,
  }),
  person({
    id: 'p-ingrid',
    first_name: 'Ingrid',
    last_name: 'Solberg',
    job_title: 'Clinical AI Researcher',
    company: 'Aster Health',
    industry: 'Healthcare',
    experience_years: 8,
    location: 'Seattle, WA',
    bio: 'Physician turned researcher. I study how risk scores change clinical decisions once they show up in a workflow.',
    skills: ['Clinical research', 'Human factors', 'Machine learning', 'Statistics'],
    networking_goals:
      'Looking for product people who have shipped risk scores to non-technical users. Happy to swap notes on explainability.',
    avatar_url: portrait('women', 90),
    event_id: 'evt-foundry',
    similarity: 0.71,
    likes_you: false,
  }),
  person({
    id: 'p-rohan',
    first_name: 'Rohan',
    last_name: 'Kapoor',
    job_title: 'Product Manager',
    company: 'Quire',
    industry: 'Fintech',
    experience_years: 4,
    location: 'San Jose, CA',
    bio: 'PM on small-business lending. Moved from data science to product two years ago and still learning the craft.',
    skills: ['Product strategy', 'SQL', 'Experimentation', 'Lending'],
    networking_goals: 'Looking for a mentor who has run product at an early-stage fintech.',
    avatar_url: portrait('men', 22),
    event_id: 'evt-foundry',
    similarity: 0.68,
    likes_you: true,
  }),
];

export const demoConnections: Connection[] = [
  {
    profile: person({
      id: 'p-samuel',
      first_name: 'Samuel',
      last_name: 'Mensah',
      job_title: 'VP Engineering',
      company: 'Ledgerly',
      industry: 'Fintech',
      experience_years: 15,
      location: 'Austin, TX',
      bio: 'Engineering lead for an accounting platform used by small businesses across the US.',
      skills: ['Engineering leadership', 'Payments', 'Hiring'],
      networking_goals: 'Meeting founders in lending.',
      avatar_url: portrait('men', 75),
      event_id: 'evt-ledger',
      similarity: 0.76,
      likes_you: true,
    }),
    event_name: 'Climate x Fintech Breakfast',
    since: '2026-09-19T09:12:00-04:00',
    status: 'connected',
  },
  {
    profile: person({
      id: 'p-nadia',
      first_name: 'Nadia',
      last_name: 'Haddad',
      job_title: 'Design Director',
      company: 'Parallel Studio',
      industry: 'Design',
      experience_years: 10,
      location: 'San Francisco, CA',
      bio: 'I run a small studio that designs internal tools for banks and insurers.',
      skills: ['Product design', 'Research', 'Design systems'],
      networking_goals: 'Finding fintech teams who care about the underwriter experience.',
      avatar_url: portrait('women', 12),
      event_id: 'evt-foundry',
      similarity: 0.73,
      likes_you: true,
    }),
    event_name: 'Applied AI Founders Dinner',
    since: '2026-09-24T20:41:00-07:00',
    status: 'connected',
  },
  {
    profile: person({
      id: 'p-daniel',
      first_name: 'Daniel',
      last_name: 'Hoffmann',
      job_title: 'Principal',
      company: 'Brightline Ventures',
      industry: 'Venture capital',
      experience_years: 6,
      location: 'New York, NY',
      bio: 'Seed and Series A investor in fintech infrastructure.',
      skills: ['Fundraising', 'Market sizing'],
      networking_goals: 'Meeting founders before they raise.',
      avatar_url: portrait('men', 46),
      event_id: 'evt-ledger',
      similarity: 0.64,
      likes_you: false,
    }),
    event_name: 'Climate x Fintech Breakfast',
    since: '2026-09-26T08:30:00-04:00',
    status: 'waiting',
  },
];

export function demoCandidates(eventId?: string): Candidate[] {
  const events = new Map(demoEvents.map((e) => [e.id, e.name]));
  return demoPeople
    .filter((p) => (eventId ? p.event_id === eventId : demoJoinedEventIds.includes(p.event_id)))
    .sort((a, b) => b.similarity - a.similarity)
    .map(({ likes_you: _ignored, ...p }) => ({ ...p, event_name: events.get(p.event_id) ?? '' }));
}
