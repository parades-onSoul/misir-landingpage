import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Ensure variables are present
if (!supabaseUrl || !supabaseKey) {
  // We can't throw here if we want the build to succeed without env vars present
  // but for runtime safety we'll check it.
  console.warn('Supabase env vars missing!')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '')
