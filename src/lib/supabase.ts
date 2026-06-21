import { createClient } from "@supabase/supabase-js";

/**
 * Supabase client for all database and storage operations.
 * If running on the server, it attempts to use the SUPABASE_SERVICE_ROLE_KEY
 * to bypass RLS for administrative tasks (since auth is not set up in MVP).
 * If running on the client (or service role key is not defined), it falls back to
 * the NEXT_PUBLIC_SUPABASE_ANON_KEY.
 */
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-please-set-env.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key";

export const supabase = createClient(supabaseUrl, supabaseKey);
