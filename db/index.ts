import { createClient } from '@supabase/supabase-js'
import { Database } from '../types/database'

// Create a single supabase client for interacting with your database
const supabase = createClient<Database>(process.env.SUPABASE_URL, process.env.SUPABASE_KEY)

export default supabase
