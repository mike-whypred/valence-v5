import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Simplified profile creation for debugging
export const createProfileSimple = async (profileData: any) => {
  try {
    console.log('🚀 Starting simple profile creation...');
    
    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      console.error('❌ Auth error:', authError);
      return { data: null, error: authError || new Error('User not authenticated') };
    }

    console.log('✅ User authenticated:', user.id, user.email);

    // Prepare profile data
    const profileToInsert = {
      user_id: user.id,
      job_title: profileData.job_title,
      company: profileData.company,
      industry: profileData.industry,
      experience_years: profileData.experience_years,
      bio: profileData.bio,
      skills: profileData.skills || [],
      networking_goals: profileData.networking_goals,
      profile_image_url: profileData.profile_image_url,
      location: profileData.location
    };

    console.log('📝 Profile data to insert:', profileToInsert);

    // Try to insert directly into profiles table
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileToInsert])
      .select()
      .single();
    
    if (error) {
      console.error('❌ Profile creation error:', error);
      return { data: null, error };
    }

    console.log('✅ Profile created successfully:', data);
    return { data, error: null };
  } catch (err) {
    console.error('💥 Unexpected error:', err);
    return { data: null, error: err as Error };
  }
}; 