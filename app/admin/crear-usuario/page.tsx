"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/lib/supabase"
import { Loader2, Mail, Lock, AlertCircle, CheckCircle, ArrowLeft, UserPlus } from "lucide-react"
import Link from "next/link"

export default function CrearUsuarioPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const { user, loading: authLoading } = useAuth()
  const router = useRouter()

  // Verificar autenticación
  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  const validateForm = () => {
    if (!email || !password) {
      setMessage({ type: "error", text: "Todos los campos son requeridos" })
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      setMessage({ type: "error", text: "Formato de email inválido" })
      return false
    }

    if (password.length < 6) {
      setMessage({ type: "error", text: "La contraseña debe tener al menos 6 caracteres" })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (!validateForm()) {
      return
    }

    setLoading(true)

    try {
      // Obtener el token de sesión actual
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        setMessage({ type: "error", text: "Sesión expirada. Por favor, inicia sesión nuevamente." })
        setLoading(false)
        return
      }

      const response = await fetch("/api/crear-usuario", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: "success", text: "✅ Usuario creado con éxito" })
        setEmail("")
        setPassword("")
      } else {
        setMessage({ type: "error", text: data.error || "Error al crear usuario" })
      }
    } catch (error) {
      console.error("Error:", error)
      setMessage({ type: "error", text: "Error de conexión. Inténtalo de nuevo." })
    } finally {
      setLoading(false)
    }
  }

  // Mostrar loading si está verificando autenticación
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verificando permisos...</p>
        </div>
      </div>
    )
  }

  // Redirigir si no está autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirigiendo...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin" className="text-gray-500 hover:text-gray-700">
                <ArrowLeft className="h-6 w-6" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Crear Nuevo Usuario</h1>
                <p className="text-sm text-gray-600">Panel de administración - Gestión de usuarios</p>
              </div>
            </div>
            <div className="text-sm text-gray-600">Admin: {user.email}</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <div className="bg-teal-100 p-3 rounded-full w-16 h-16 mx-auto mb-4">
                <UserPlus className="h-10 w-10 text-teal-600" />
              </div>
              <CardTitle className="text-2xl">Crear Usuario</CardTitle>
              <CardDescription>
                Crea una nueva cuenta de cliente para acceder al panel de administración
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Email del Cliente *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="cliente@empresa.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                      disabled={loading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700">
                    Contraseña Temporal *
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 h-12"
                      required
                      minLength={6}
                      disabled={loading}
                    />
                  </div>
                  <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
                </div>

                {message && (
                  <div
                    className={`flex items-center gap-2 p-3 rounded-md ${
                      message.type === "success"
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    {message.type === "success" ? (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    ) : (
                      <AlertCircle className="h-4 w-4 text-red-600" />
                    )}
                    <p className={`text-sm ${message.type === "success" ? "text-green-700" : "text-red-700"}`}>
                      {message.text}
                    </p>
                  </div>
                )}

                <Button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 h-12" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creando usuario...
                    </>
                  ) : (
                    <>
                      <UserPlus className="mr-2 h-4 w-4" />
                      Crear Usuario
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-md">
                <h4 className="text-sm font-medium text-blue-900 mb-2">ℹ️ Información importante:</h4>
                <ul className="text-xs text-blue-800 space-y-1">
                  <li>• El usuario podrá iniciar sesión inmediatamente</li>
                  <li>• El email se confirmará automáticamente</li>
                  <li>• Comparte las credenciales de forma segura</li>
                  <li>• El cliente puede cambiar su contraseña después</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <div className="text-center mt-6">
            <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">
              ← Volver al panel de administración
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
