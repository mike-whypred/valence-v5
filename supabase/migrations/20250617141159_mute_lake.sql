-- Database schema for Valence networking app

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector;

-- Users table (authentication handled by Supabase Auth)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  user_type TEXT CHECK (user_type IN ('user', 'admin')) DEFAULT 'user',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles table
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  job_title TEXT NOT NULL,
  company TEXT NOT NULL,
  industry TEXT NOT NULL,
  experience_years INTEGER NOT NULL,
  bio TEXT NOT NULL,
  skills TEXT[] DEFAULT '{}',
  networking_goals TEXT,
  profile_image_url TEXT,
  avatar_style TEXT,
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Events table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  event_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location TEXT NOT NULL,
  access_code TEXT UNIQUE NOT NULL,
  organizer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  max_attendees INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event attendees table
CREATE TABLE event_attendees (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(event_id, user_id)
);

-- Matches table
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user1_id UUID REFERENCES users(id) ON DELETE CASCADE,
  user2_id UUID REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID REFERENCES events(id) ON DELETE CASCADE,
  user1_bumped BOOLEAN DEFAULT FALSE,
  user2_bumped BOOLEAN DEFAULT FALSE,
  is_mutual BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user1_id, user2_id, event_id),
  CHECK (user1_id != user2_id)
);

-- Profile summaries table (for vector search)
CREATE TABLE profile_summaries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  summary_text TEXT NOT NULL,
  embedding VECTOR(1536), -- OpenAI ada-002 embedding dimension
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_events_access_code ON events(access_code);
CREATE INDEX idx_event_attendees_event_id ON event_attendees(event_id);
CREATE INDEX idx_event_attendees_user_id ON event_attendees(user_id);
CREATE INDEX idx_matches_user1_id ON matches(user1_id);
CREATE INDEX idx_matches_user2_id ON matches(user2_id);
CREATE INDEX idx_matches_event_id ON matches(event_id);
CREATE INDEX idx_profile_summaries_profile_id ON profile_summaries(profile_id);

-- Vector similarity search index
CREATE INDEX idx_profile_summaries_embedding ON profile_summaries 
USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_attendees ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE profile_summaries ENABLE ROW LEVEL SECURITY;

-- Users can read and update their own data
CREATE POLICY "Users can read own data" ON users
  FOR ALL USING (auth.uid() = id);

-- Profiles policies
CREATE POLICY "Users can read all profiles in their events" ON profiles
  FOR SELECT USING (
    user_id = auth.uid() OR
    EXISTS (
      SELECT 1 FROM event_attendees ea1, event_attendees ea2
      WHERE ea1.user_id = auth.uid() 
      AND ea2.user_id = profiles.user_id
      AND ea1.event_id = ea2.event_id
    )
  );

CREATE POLICY "Users can manage own profile" ON profiles
  FOR ALL USING (user_id = auth.uid());

-- Events policies
CREATE POLICY "Event organizers can manage their events" ON events
  FOR ALL USING (organizer_id = auth.uid());

CREATE POLICY "Users can read events they've joined" ON events
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM event_attendees 
      WHERE event_id = events.id AND user_id = auth.uid()
    )
  );

-- Event attendees policies
CREATE POLICY "Users can manage their event attendance" ON event_attendees
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Event organizers can see their event attendees" ON event_attendees
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = event_attendees.event_id 
      AND events.organizer_id = auth.uid()
    )
  );

-- Matches policies
CREATE POLICY "Users can see their own matches" ON matches
  FOR SELECT USING (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can create matches with themselves involved" ON matches
  FOR INSERT WITH CHECK (user1_id = auth.uid() OR user2_id = auth.uid());

CREATE POLICY "Users can update their own bump status" ON matches
  FOR UPDATE USING (
    (user1_id = auth.uid() AND user1_bumped = OLD.user1_bumped) OR
    (user2_id = auth.uid() AND user2_bumped = OLD.user2_bumped)
  );

-- Profile summaries policies
CREATE POLICY "Users can read summaries for profiles they can see" ON profile_summaries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = profile_summaries.profile_id
      AND (
        profiles.user_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM event_attendees ea1, event_attendees ea2
          WHERE ea1.user_id = auth.uid() 
          AND ea2.user_id = profiles.user_id
          AND ea1.event_id = ea2.event_id
        )
      )
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profile_summaries_updated_at BEFORE UPDATE ON profile_summaries
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update match mutual status
CREATE OR REPLACE FUNCTION update_match_mutual_status()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.user1_bumped = TRUE AND NEW.user2_bumped = TRUE THEN
    NEW.is_mutual = TRUE;
  END IF;
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_matches_mutual_status BEFORE UPDATE ON matches
  FOR EACH ROW EXECUTE FUNCTION update_match_mutual_status();