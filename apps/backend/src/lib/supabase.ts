import { createClient } from '@supabase/supabase-js'

/**
 * Supabase client with SERVICE ROLE KEY
 * Use this for admin operations that bypass RLS
 */
export const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Supabase client with ANON KEY
 * Use this for operations that respect RLS policies
 */
export const supabaseAnon = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

/**
 * Test Supabase connection
 * Returns true if connection is successful
 */
export async function testSupabaseConnection(): Promise<boolean> {
  try {
    const { error } = await supabase.from('profiles').select('count').limit(1)
    if (error) {
      console.error('Supabase connection test failed:', error.message)
      return false
    }
    return true
  } catch (error) {
    console.error('Supabase connection error:', error)
    return false
  }
}
