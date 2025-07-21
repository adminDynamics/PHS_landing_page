"use client"

import { useAuth } from "@/hooks/useAuth"
import AdminPanel from "@/components/admin/AdminPanel"
import ConfigurationGuide from "@/components/admin/ConfigurationGuide"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ErrorBoundary from "@/components/admin/ErrorBoundary"

export default function AdminPage() {
  const { user, loading } = useAuth()
  const [configError, setConfigError] = useState<string | null>(null)
  const router = useRouter()

  // Verificar configuración de Supabase
  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      setConfigError("Variables de entorno de Supabase no configuradas")
      return
    }

    if (!supabaseUrl.startsWith("https://")) {
      setConfigError("URL de Supabase inválida")
      return
    }

    // Verificar que las variables no sean placeholder values
    if (supabaseUrl.includes("tu-proyecto") || supabaseAnonKey.includes("tu-clave")) {
      setConfigError("Variables de entorno contienen valores de ejemplo")
      return
    }

    setConfigError(null)
  }, [])

  // Redirigir a login si no está autenticado
  useEffect(() => {
    if (!loading && !user && !configError) {
      router.push("/login")
    }
  }, [user, loading, router, configError])

  // Si hay error de configuración, mostrar guía
  if (configError) {
    return <ConfigurationGuide />
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    )
  }

  // Si no hay usuario, mostrar loading mientras redirige
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo al login...</p>
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary>
      <AdminPanel />
    </ErrorBoundary>
  )
}
