import { createClient } from "@supabase/supabase-js"

// Verificar que las variables de entorno estén configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl) {
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseServiceRoleKey) {
  throw new Error("Missing env.SUPABASE_SERVICE_ROLE_KEY")
}

if (!supabaseUrl.startsWith("https://")) {
  throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL")
}

// Cliente admin con SERVICE_ROLE_KEY para operaciones administrativas
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})
