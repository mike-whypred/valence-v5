-- Fix RLS policies for profile creation
-- Run this in your Supabase SQL Editor

-- Drop the existing problematic policy
DROP POLICY IF EXISTS "Users can manage own profile" ON profiles;

-- Create separate policies for different operations
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Users can delete own profile" ON profiles
  FOR DELETE USING (user_id = auth.uid());

-- Also fix the users table policy if needed
DROP POLICY IF EXISTS "Users can read and update own data" ON users;

CREATE POLICY "Users can insert own data" ON users
  FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (id = auth.uid());

-- Keep the existing policy for reading profiles in events
-- (The "Users can read all profiles in their events" policy should remain as is) 