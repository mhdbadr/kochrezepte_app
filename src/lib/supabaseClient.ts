/**
 * This file initializes the Supabase client using environment variables for the URL and anon key.
 * It exports a single instance of the Supabase client that can be imported and used throughout the app.
 */
import { createClient } from '@supabase/supabase-js';

// Get the Supabase URL and anon key from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create a single Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseKey);

