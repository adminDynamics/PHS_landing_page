import { createClient } from "@supabase/supabase-js"

// Verificar que las variables de entorno estén configuradas
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  console.error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_URL")
}

if (!supabaseAnonKey) {
  console.error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
  throw new Error("Missing env.NEXT_PUBLIC_SUPABASE_ANON_KEY")
}

if (!supabaseUrl.startsWith("https://")) {
  console.error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL")
  throw new Error("NEXT_PUBLIC_SUPABASE_URL must be a valid HTTPS URL")
}

// Verificar que no sean valores de ejemplo
if (supabaseUrl.includes("tu-proyecto") || supabaseAnonKey.includes("tu-clave")) {
  console.error("Supabase environment variables contain example values")
  throw new Error("Supabase environment variables contain example values")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para TypeScript
export interface ImagenCliente {
  id?: string
  cliente_id: string
  seccion: string
  item_id: number
  imagen: string
  updated_at?: string
}
