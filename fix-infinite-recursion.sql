-- Fix infinite recursion in event_attendees policies
-- Run this in your Supabase SQL Editor

-- First, let's see what policies exist and then fix them
-- Drop all policies on event_attendees to start fresh
DROP POLICY IF EXISTS "Users can manage own attendance" ON event_attendees;
DROP POLICY IF EXISTS "Users can view event attendees" ON event_attendees;
DROP POLICY IF EXISTS "Event coordinators can manage attendees" ON event_attendees;

-- Drop the problematic profiles policy that references event_attendees
DROP POLICY IF EXISTS "Users can read all profiles in their events" ON profiles;

-- Create simple, non-recursive policies for event_attendees
CREATE POLICY "Users can insert own attendance" ON event_attendees
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own attendance" ON event_attendees
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own attendance" ON event_attendees
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own attendance" ON event_attendees
  FOR DELETE USING (user_id = auth.uid());

-- Create a simple policy for profiles that doesn't reference event_attendees
CREATE POLICY "Users can read profiles for networking" ON profiles
  FOR SELECT USING (true); -- Allow reading all profiles for now

-- Alternative: If you want to restrict profile reading to event attendees only,
-- you can enable this later after testing:
-- CREATE POLICY "Users can read profiles in same events" ON profiles
--   FOR SELECT USING (
--     EXISTS (
--       SELECT 1 FROM event_attendees ea1, event_attendees ea2
--       WHERE ea1.user_id = auth.uid() 
--       AND ea2.user_id = profiles.user_id
--       AND ea1.event_id = ea2.event_id
--     )
--   ); 