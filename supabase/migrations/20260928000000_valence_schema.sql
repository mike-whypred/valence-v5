-- Valence schema v2
-- Replaces the original setup-database.sql + fix-*.sql scripts.
-- Changes from v1:
--   * profiles is keyed by auth.users.id; the duplicate public.users table and profile_summaries are folded in.
--   * Row-level security uses SECURITY DEFINER helpers, which removes the infinite-recursion
--     problem between profiles and event_attendees and the invalid OLD reference in the matches policy.
--   * Matching is real: match_candidates() ranks co-attendees by cosine similarity (pgvector).
--   * Mutual interest replaces the user1/user2 bump flags: one row per decision, a connection is two
--     reciprocal "interested" rows.

create extension if not exists vector;

-- Profiles ------------------------------------------------------------------

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  first_name text not null,
  last_name text not null,
  role text not null default 'member' check (role in ('member', 'organizer')),
  job_title text not null default '',
  company text not null default '',
  industry text not null default '',
  experience_years integer not null default 0 check (experience_years between 0 and 70),
  location text,
  bio text not null default '',
  skills text[] not null default '{}',
  networking_goals text not null default '',
  avatar_url text,
  summary text,
  embedding vector(1536),
  completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Events --------------------------------------------------------------------

create table public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  starts_at timestamptz not null,
  timezone text not null default 'UTC', -- IANA name, used to display local event time
  location text not null,
  access_code text not null unique check (access_code = upper(access_code)),
  organizer_id uuid not null references public.profiles (id) on delete cascade,
  max_attendees integer check (max_attendees > 0),
  cover_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.event_attendees (
  event_id uuid not null references public.events (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  joined_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
create index event_attendees_user_idx on public.event_attendees (user_id);

-- Interest decisions -------------------------------------------------------

create table public.interests (
  from_id uuid not null references public.profiles (id) on delete cascade,
  to_id uuid not null references public.profiles (id) on delete cascade,
  event_id uuid not null references public.events (id) on delete cascade,
  interested boolean not null,
  created_at timestamptz not null default now(),
  primary key (from_id, to_id),
  check (from_id <> to_id)
);
create index interests_to_idx on public.interests (to_id);

-- Helpers (SECURITY DEFINER so policies can use them without recursing) ------

create or replace function public.my_event_ids()
returns setof uuid
language sql stable security definer set search_path = public as $$
  select event_id from event_attendees where user_id = auth.uid();
$$;

create or replace function public.shares_event_with(other uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from event_attendees a
    join event_attendees b on a.event_id = b.event_id
    where a.user_id = auth.uid() and b.user_id = other
  );
$$;

-- Row-level security --------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_attendees enable row level security;
alter table public.interests enable row level security;

create policy "read own profile or co-attendees" on public.profiles
  for select using (id = auth.uid() or public.shares_event_with(id));
create policy "insert own profile" on public.profiles
  for insert with check (id = auth.uid());
create policy "update own profile" on public.profiles
  for update using (id = auth.uid()) with check (id = auth.uid());

create policy "read joined or organized events" on public.events
  for select using (organizer_id = auth.uid() or id in (select public.my_event_ids()));
create policy "organizers manage their events" on public.events
  for all using (organizer_id = auth.uid()) with check (
    organizer_id = auth.uid()
    and exists (select 1 from public.profiles where id = auth.uid() and role = 'organizer')
  );

create policy "read attendance in my events" on public.event_attendees
  for select using (user_id = auth.uid() or event_id in (select public.my_event_ids()));
create policy "leave events" on public.event_attendees
  for delete using (user_id = auth.uid());
-- Joining goes through join_event() so the access code and capacity are enforced.

create policy "read decisions involving me" on public.interests
  for select using (from_id = auth.uid() or (to_id = auth.uid() and interested));
-- Writes go through express_interest().

-- updated_at ----------------------------------------------------------------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();
create trigger events_touch before update on public.events
  for each row execute function public.touch_updated_at();

-- Create a profile row on signup from auth metadata ------------------------

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into profiles (id, first_name, last_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    case when new.raw_user_meta_data ->> 'role' = 'organizer' then 'organizer' else 'member' end
  );
  return new;
end;
$$;

create trigger on_auth_user_created after insert on auth.users
  for each row execute function public.handle_new_user();

-- RPC: look up an event by access code (callers are not attendees yet) ------

create or replace function public.find_event_by_code(code text)
returns table (
  id uuid, name text, description text, starts_at timestamptz, timezone text, location text,
  organizer_name text, attendee_count bigint, max_attendees integer, cover_url text, already_joined boolean
)
language sql stable security definer set search_path = public as $$
  select e.id, e.name, e.description, e.starts_at, e.timezone, e.location,
         trim(p.first_name || ' ' || p.last_name),
         (select count(*) from event_attendees a where a.event_id = e.id),
         e.max_attendees, e.cover_url,
         exists (select 1 from event_attendees a where a.event_id = e.id and a.user_id = auth.uid())
  from events e
  join profiles p on p.id = e.organizer_id
  where e.access_code = upper(trim(code))
    and auth.uid() is not null;
$$;

-- RPC: join an event with its access code -----------------------------------

create or replace function public.join_event(code text)
returns uuid
language plpgsql security definer set search_path = public as $$
declare
  evt events%rowtype;
  taken bigint;
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  select * into evt from events where access_code = upper(trim(code));
  if not found then raise exception 'unknown access code'; end if;
  select count(*) into taken from event_attendees where event_id = evt.id;
  if evt.max_attendees is not null and taken >= evt.max_attendees then
    raise exception 'event is full';
  end if;
  insert into event_attendees (event_id, user_id) values (evt.id, auth.uid())
  on conflict do nothing;
  return evt.id;
end;
$$;

-- RPC: ranked candidates among co-attendees ---------------------------------

create or replace function public.match_candidates(p_event uuid default null, p_limit integer default 20)
returns table (
  id uuid, first_name text, last_name text, job_title text, company text, industry text,
  experience_years integer, location text, bio text, skills text[], networking_goals text,
  avatar_url text, role text, summary text, event_id uuid, event_name text, similarity double precision
)
language sql stable security definer set search_path = public as $$
  with me as (
    select embedding from profiles where id = auth.uid()
  ),
  pool as (
    select distinct on (b.user_id) b.user_id, b.event_id
    from event_attendees a
    join event_attendees b on a.event_id = b.event_id and b.user_id <> a.user_id
    where a.user_id = auth.uid()
      and (p_event is null or a.event_id = p_event)
    order by b.user_id, b.joined_at desc
  )
  select p.id, p.first_name, p.last_name, p.job_title, p.company, p.industry,
         p.experience_years, p.location, p.bio, p.skills, p.networking_goals,
         p.avatar_url, p.role, p.summary, pool.event_id, e.name,
         coalesce(1 - (p.embedding <=> (select embedding from me)), 0)::double precision as similarity
  from pool
  join profiles p on p.id = pool.user_id and p.completed
  join events e on e.id = pool.event_id
  where not exists (select 1 from interests i where i.from_id = auth.uid() and i.to_id = p.id)
  order by similarity desc, p.created_at
  limit p_limit;
$$;

-- RPC: record interest, returns true when it is mutual ---------------------

create or replace function public.express_interest(target uuid, p_event uuid, p_interested boolean)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then raise exception 'not signed in'; end if;
  if not exists (
    select 1 from event_attendees a join event_attendees b on a.event_id = b.event_id
    where a.user_id = auth.uid() and b.user_id = target and a.event_id = p_event
  ) then
    raise exception 'you can only respond to people at your events';
  end if;

  insert into interests (from_id, to_id, event_id, interested)
  values (auth.uid(), target, p_event, p_interested)
  on conflict (from_id, to_id) do update set interested = excluded.interested, created_at = now();

  return p_interested and exists (
    select 1 from interests where from_id = target and to_id = auth.uid() and interested
  );
end;
$$;

-- View: my connections (mutual) and outgoing interest still waiting -------

create or replace function public.my_connections()
returns table (
  id uuid, first_name text, last_name text, job_title text, company text, industry text,
  experience_years integer, location text, bio text, skills text[], networking_goals text,
  avatar_url text, role text, summary text, event_name text, since timestamptz, status text
)
language sql stable security definer set search_path = public as $$
  select p.id, p.first_name, p.last_name, p.job_title, p.company, p.industry,
         p.experience_years, p.location, p.bio, p.skills, p.networking_goals,
         p.avatar_url, p.role, p.summary, e.name,
         greatest(mine.created_at, coalesce(theirs.created_at, mine.created_at)),
         case when theirs.interested then 'connected' else 'waiting' end
  from interests mine
  join profiles p on p.id = mine.to_id
  join events e on e.id = mine.event_id
  left join interests theirs on theirs.from_id = mine.to_id and theirs.to_id = mine.from_id
  where mine.from_id = auth.uid() and mine.interested
  order by 16 desc;
$$;

-- Vector index (add once you have a few thousand profiles):
-- create index profiles_embedding_idx on public.profiles using hnsw (embedding vector_cosine_ops);
