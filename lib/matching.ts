import type { Profile } from '@/lib/types';

// Plain-language reasons shown next to a match. Vector similarity ranks people;
// these explain the ranking in terms a person can check for themselves.

const GOAL_TOPICS: Record<string, RegExp> = {
  mentorship: /\bmentor/i,
  advising: /\badvis/i,
  hiring: /\bhir(e|ing)\b|founding (product|engineer)/i,
  fundraising: /\bfundrais|\braise\b|investor/i,
  partnerships: /\bpartner/i,
  customers: /\bdesign partner|customer|lender/i,
};

function topics(text: string) {
  return new Set(
    Object.entries(GOAL_TOPICS)
      .filter(([, re]) => re.test(text))
      .map(([k]) => k),
  );
}

const norm = (s: string) => s.trim().toLowerCase();

export function sharedSkills(a: Profile, b: Profile) {
  const mine = new Set(a.skills.map(norm));
  return b.skills.filter((s) => mine.has(norm(s)));
}

export function matchReasons(me: Profile, them: Profile): string[] {
  const reasons: string[] = [];
  const skills = sharedSkills(me, them);
  if (skills.length) reasons.push(`You both work on ${skills.slice(0, 2).join(' and ').toLowerCase()}`);

  const theirText = `${them.networking_goals} ${them.bio}`;
  const overlap = [...topics(me.networking_goals)].filter((t) => topics(theirText).has(t));
  if (overlap.includes('advising') || overlap.includes('mentorship')) {
    reasons.push(`${them.first_name} is open to advising, which you asked for`);
  } else if (overlap.includes('customers') || overlap.includes('partnerships')) {
    reasons.push(`Your goals line up on partnerships`);
  } else if (overlap.includes('fundraising')) {
    reasons.push(`You are both thinking about fundraising`);
  }

  if (norm(me.industry) === norm(them.industry)) reasons.push(`Same industry: ${them.industry}`);
  return reasons.slice(0, 3);
}
