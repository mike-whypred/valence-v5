# Valence

AI introductions for professional events. Attendees write a short profile, join an event with an access code, and
Valence ranks the other people in that room by how well their profiles and goals fit. Interest is only revealed when it
is mutual.

## Run it

```bash
npm install
npm run dev
```

With no environment variables the app runs on **sample data**: every screen works, sign-in accepts anything, and
you are signed in as a sample user. Try the access codes `FOUNDRY26`, `GREENLEDGER` or `CLINICML` on `/events/join`.

## Connect real services

1. Create a Supabase project with the `vector` extension available.
2. Run `supabase/migrations/20260928000000_valence_schema.sql` (SQL editor or `supabase db push`).
3. Copy `.env.example` to `.env.local` and fill in:

| Variable | Used for |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Auth and data. Leave empty for sample data. |
| `OPENAI_API_KEY` | Profile summaries and embeddings. Optional; without it profiles save but rank equally. |
| `OPENAI_SUMMARY_MODEL` | Summary model, defaults to `gpt-4o-mini`. |

Organizers are created by choosing "Hosting events" at sign-up. Events are inserted directly in Supabase for now (there
is no organizer UI yet); `access_code` must be uppercase.

## How matching works

- On save, the profile (role, skills, background, goals) is embedded with `text-embedding-3-small` and stored on
  `profiles.embedding`. A three-sentence summary is generated for display.
- `match_candidates()` returns co-attendees you have not responded to, ordered by cosine similarity.
- `express_interest()` records a decision and returns `true` when the other person already said yes.
- `lib/matching.ts` turns shared skills, industry and goal topics into the plain-language reasons shown on each card.

## Stack

Next.js 16 (App Router, Server Actions, `proxy.ts`), React 19, Tailwind CSS 4, Motion, Phosphor icons, Geist,
Supabase (`@supabase/ssr`, Postgres + pgvector + RLS), OpenAI.

## Layout

```
app/
  page.tsx                 landing
  auth/login, auth/signup  sign in / sign up (server actions)
  profile/setup            onboarding and profile editing, with a live card preview
  (app)/dashboard          overview
  (app)/matches            Discover deck and Connections (?view=connections)
  (app)/events/join        access-code lookup and join
  actions.ts               all server actions
components/                UI; landing/ and app/ hold page-specific pieces
lib/                       data access, sample data, matching reasons, AI helper
proxy.ts                   Supabase session refresh and route protection
supabase/migrations/       schema, RLS and RPC functions
```
