import { createClient } from '@supabase/supabase-js'

const supabaseUrl ='https://thgmimizlgfwkrljldjq.supabase.co'
const supabaseKey ='sb_publishable_u1nlbK_KalLqY19IBySOqg_dVpUmdFn' 

export const supabase = createClient(supabaseUrl, supabaseKey)