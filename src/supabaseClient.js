import { createClient } from '@supabase/supabase-js';
import { SUPABASE_FALLBACK } from './supabase.config';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || SUPABASE_FALLBACK.url;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || SUPABASE_FALLBACK.anonKey;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);


