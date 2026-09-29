export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
export const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Without Supabase credentials the app runs on seeded sample data so every screen is reviewable. */
export const isDemo = !supabaseUrl || !supabaseAnonKey;
