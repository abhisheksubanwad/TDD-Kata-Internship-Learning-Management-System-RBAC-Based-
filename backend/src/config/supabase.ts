import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

console.log(
  "SUPABASE SERVICE KEY LENGTH:",
  process.env.SUPABASE_SERVICE_ROLE_KEY?.length
);


export const supabase = createClient(
  supabaseUrl,
  supabaseServiceKey,
  {
    auth: {
      persistSession: false,
    },
  }
);
