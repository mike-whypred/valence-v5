import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string, userData: { first_name: string; last_name: string; user_type: 'user' | 'admin' }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  });
  return { data, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user }, error } = await supabase.auth.getUser();
  return { user, error };
};

// Profile functions
export const createProfile = async (profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) => {
  try {
    console.log('Starting profile creation...');
    
    // First, get the current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('Auth error:', authError);
      return { data: null, error: authError || new Error('User not authenticated') };
    }

    console.log('User authenticated:', user.id);

    // Create user record in our users table
    console.log('Creating user record...');
    const { error: userError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email!,
        first_name: user.user_metadata?.first_name || '',
        last_name: user.user_metadata?.last_name || '',
        user_type: user.user_metadata?.user_type || 'user'
      });

    if (userError) {
      console.error('Error creating user record:', userError);
      return { data: null, error: userError };
    }

    console.log('User record created/updated successfully');

    // Create profile
    console.log('Creating profile with data:', profileData);
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating profile:', error);
      return { data: null, error };
    }

    console.log('Profile created successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('Unexpected error in createProfile:', err);
    return { data: null, error: err as Error };
  }
};

export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .single();
  return { data, error };
};

export const updateProfile = async (profileId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', profileId)
    .select()
    .single();
  return { data, error };
};

// Dicebear avatar generation
export const generateAvatar = (seed: string, style: string = 'avataaars') => {
  return `https://api.dicebear.com/7.x/${style}/svg?seed=${encodeURIComponent(seed)}`;
};

// Database Types
export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  user_type: 'user' | 'admin';
  created_at: string;
  updated_at: string;
}

export interface Profile {
  id: string;
  user_id: string;
  job_title: string;
  company: string;
  industry: string;
  experience_years: number;
  bio: string;
  skills: string[];
  networking_goals: string;
  profile_image_url?: string;
  avatar_style?: string;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  description: string;
  event_date: string;
  location: string;
  access_code: string;
  organizer_id: string;
  max_attendees?: number;
  created_at: string;
  updated_at: string;
}

export interface EventAttendee {
  id: string;
  event_id: string;
  user_id: string;
  joined_at: string;
}

export interface Match {
  id: string;
  user1_id: string;
  user2_id: string;
  event_id: string;
  user1_bumped: boolean;
  user2_bumped: boolean;
  is_mutual: boolean;
  created_at: string;
}

export interface ProfileSummary {
  id: string;
  profile_id: string;
  summary_text: string;
  embedding: number[];
  created_at: string;
  updated_at: string;
}