"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/useAuth"
import { useRouter } from "next/navigation"
import { supabase, type ImagenCliente } from "@/lib/supabase"
import {
  LogOut,
  Settings,
  Eye,
  Undo,
  Monitor,
  Tablet,
  Smartphone,
  UserPlus,
  ImageIcon,
  Type,
  Layout,
  Building2,
  Crown,
} from "lucide-react"
import Link from "next/link"
import StudioImageEditor from "./StudioImageEditor"
import LivePreview from "./LivePreview"
import DynamicClientManager from "./DynamicClientManager"
import MainLogoEditor from "./MainLogoEditor"

// Configuración de secciones con información de tamaños
const SECCIONES_CONFIG = {
  logo: {
    title: "Logo Principal",
    description: "Logo principal del sitio web",
    icon: Crown,
    items: [
      {
        id: 1,
        title: "Logo Principal",
        description: "Logo que aparece en el header del sitio",
        size: "200x80px",
        aspectRatio: "5:2",
        maxSize: "500KB",
        formats: ["PNG", "SVG"],
      },
    ],
  },
  hero: {
    title: "Hero Section",
    description: "Imagen principal de fondo",
    icon: Layout,
    items: [
      {
        id: 1,
        title: "Background Image",
        description: "Imagen de fondo principal",
        size: "1920x1080px",
        aspectRatio: "16:9",
        maxSize: "2MB",
        formats: ["JPG", "PNG", "WebP"],
      },
    ],
  },
  clientes: {
    title: "Clientes",
    description: "Logos de empresas clientes",
    icon: Building2,
    items: [],
  },
  servicios: {
    title: "Services",
    description: "Imágenes de servicios",
    icon: ImageIcon,
    items: [
      {
        id: 1,
        title: "Seguridad Laboral",
        description: "Imagen del servicio",
        size: "400x300px",
        aspectRatio: "4:3",
        maxSize: "1MB",
        formats: ["JPG", "PNG"],
      },
      {
        id: 2,
        title: "Higiene Industrial",
        description: "Imagen del servicio",
        size: "400x300px",
        aspectRatio: "4:3",
        maxSize: "1MB",
        formats: ["JPG", "PNG"],
      },
      {
        id: 3,
        title: "Medio Ambiente",
        description: "Imagen del servicio",
        size: "400x300px",
        aspectRatio: "4:3",
        maxSize: "1MB",
        formats: ["JPG", "PNG"],
      },
    ],
  },
  about: {
    title: "About Us",
    description: "Imágenes de la sección nosotros",
    icon: Type,
    items: [
      {
        id: 1,
        title: "Team Image",
        description: "Imagen del equipo",
        size: "600x600px",
        aspectRatio: "1:1",
        maxSize: "1.5MB",
        formats: ["JPG", "PNG"],
      },
    ],
  },
}

export default function StudioLayout() {
  const { user, signOut } = useAuth()
  const router = useRouter()
  const [imagenes, setImagenes] = useState<ImagenCliente[]>([])
  const [loading, setLoading] = useState(true)
  const [previewMode, setPreviewMode] = useState<"desktop" | "tablet" | "mobile">("desktop")
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)
  const [previewImages, setPreviewImages] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user) {
      fetchImagenes()
    }
  }, [user])

  const fetchImagenes = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("imagenes_cliente")
        .select("*")
        .eq("cliente_id", user.id)
        .order("seccion", { ascending: true })
        .order("item_id", { ascending: true })

      if (error) throw error
      setImagenes(data || [])
    } catch (error) {
      console.error("Error fetching images:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleImagePreview = (seccion: string, itemId: number, imageUrl: string) => {
    const key = `${seccion}-${itemId}`
    setPreviewImages((prev) => ({ ...prev, [key]: imageUrl }))
    setHasUnsavedChanges(true)
  }

  const handleImageUpdated = (updatedImage: ImagenCliente) => {
    setImagenes((prev) => {
      const index = prev.findIndex(
        (img) => img.seccion === updatedImage.seccion && img.item_id === updatedImage.item_id,
      )

      if (index >= 0) {
        const newImages = [...prev]
        newImages[index] = updatedImage
        return newImages
      } else {
        return [...prev, updatedImage]
      }
    })

    // Limpiar preview después de guardar
    const key = `${updatedImage.seccion}-${updatedImage.item_id}`
    setPreviewImages((prev) => {
      const newPrev = { ...prev }
      delete newPrev[key]
      return newPrev
    })
    setHasUnsavedChanges(false)
  }

  const handleImageDeleted = (seccion: string, itemId: number) => {
    setImagenes((prev) => prev.filter((img) => !(img.seccion === seccion && img.item_id === itemId)))

    // Limpiar preview si existe
    const key = `${seccion}-${itemId}`
    setPreviewImages((prev) => {
      const newPrev = { ...prev }
      delete newPrev[key]
      return newPrev
    })
  }

  const getImageForSection = (seccion: string, itemId: number): ImagenCliente | undefined => {
    return imagenes.find((img) => img.seccion === seccion && img.item_id === itemId)
  }

  const getPreviewImageForSection = (seccion: string, itemId: number): string | undefined => {
    const key = `${seccion}-${itemId}`
    return previewImages[key] || getImageForSection(seccion, itemId)?.imagen
  }

  const handleSignOut = async () => {
    if (hasUnsavedChanges) {
      const confirm = window.confirm("Tienes cambios sin guardar. ¿Estás seguro de que quieres salir?")
      if (!confirm) return
    }
    await signOut()
    router.push("/login")
  }

  const clearPreview = () => {
    setPreviewImages({})
    setHasUnsavedChanges(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-400 mx-auto mb-4"></div>
          <p className="text-gray-300">Cargando Studio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Top Bar */}
      <header className="bg-gray-800 border-b border-gray-700 sticky top-0 z-50">
        <div className="px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Settings className="h-6 w-6 text-teal-400" />
                <h1 className="text-xl font-bold">PHS Studio</h1>
              </div>
              <div className="h-6 w-px bg-gray-600"></div>
              <span className="text-sm text-gray-400">Visual Editor</span>
            </div>

            {/* Preview Controls */}
            <div className="flex items-center space-x-2">
              <div className="flex items-center bg-gray-700 rounded-lg p-1">
                <Button
                  variant={previewMode === "desktop" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("desktop")}
                  className="h-8 w-8 p-0"
                >
                  <Monitor className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === "tablet" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("tablet")}
                  className="h-8 w-8 p-0"
                >
                  <Tablet className="h-4 w-4" />
                </Button>
                <Button
                  variant={previewMode === "mobile" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPreviewMode("mobile")}
                  className="h-8 w-8 p-0"
                >
                  <Smartphone className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-3">
              {hasUnsavedChanges && (
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-sm text-orange-400">Cambios sin guardar</span>
                  <Button onClick={clearPreview} variant="ghost" size="sm">
                    <Undo className="h-4 w-4 mr-1" />
                    Descartar
                  </Button>
                </div>
              )}

              <Link href="/admin/crear-usuario">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 bg-transparent"
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Crear Usuario
                </Button>
              </Link>

              <div className="h-6 w-px bg-gray-600"></div>

              <span className="text-sm text-gray-400">{user?.email}</span>
              <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <LogOut className="h-4 w-4 mr-2" />
                Salir
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex h-[calc(100vh-73px)]">
        {/* Left Panel - Editor */}
        <div className="w-80 bg-gray-800 border-r border-gray-700 overflow-y-auto">
          <div className="p-4">
            <div className="flex items-center space-x-2 mb-6">
              <Eye className="h-5 w-5 text-teal-400" />
              <h2 className="text-lg font-semibold">Content Editor</h2>
            </div>

            <Tabs defaultValue="logo" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="logo" className="text-xs">
                  Logo
                </TabsTrigger>
                <TabsTrigger value="hero" className="text-xs">
                  Hero
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-2 bg-gray-700">
                <TabsTrigger value="clientes" className="text-xs">
                  Clientes
                </TabsTrigger>
                <TabsTrigger value="servicios" className="text-xs">
                  Services
                </TabsTrigger>
              </TabsList>
              <TabsList className="grid w-full grid-cols-1 bg-gray-700">
                <TabsTrigger value="about" className="text-xs">
                  About
                </TabsTrigger>
              </TabsList>

              {Object.entries(SECCIONES_CONFIG).map(([seccionKey, seccionConfig]) => {
                if (seccionKey === "clientes") {
                  return (
                    <TabsContent key="clientes" value="clientes" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                          <Building2 className="h-5 w-5 text-teal-400" />
                          <div>
                            <h3 className="font-medium">Clientes</h3>
                            <p className="text-xs text-gray-400">Gestiona logos de empresas clientes</p>
                          </div>
                        </div>

                        <DynamicClientManager
                          onImageUpdated={handleImageUpdated}
                          onImagePreview={handleImagePreview}
                          onImageDeleted={handleImageDeleted}
                        />
                      </div>
                    </TabsContent>
                  )
                }

                if (seccionKey === "logo") {
                  return (
                    <TabsContent key="logo" value="logo" className="space-y-4">
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                          <Crown className="h-5 w-5 text-teal-400" />
                          <div>
                            <h3 className="font-medium">Logo Principal</h3>
                            <p className="text-xs text-gray-400">Logo principal del sitio web</p>
                          </div>
                        </div>

                        <MainLogoEditor
                          currentImage={getImageForSection("logo", 1)}
                          onImageUpdated={handleImageUpdated}
                          onImagePreview={handleImagePreview}
                        />
                      </div>
                    </TabsContent>
                  )
                }

                return (
                  <TabsContent key={seccionKey} value={seccionKey} className="space-y-4">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3 p-3 bg-gray-700 rounded-lg">
                        <seccionConfig.icon className="h-5 w-5 text-teal-400" />
                        <div>
                          <h3 className="font-medium">{seccionConfig.title}</h3>
                          <p className="text-xs text-gray-400">{seccionConfig.description}</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        {seccionConfig.items.map((item) => (
                          <StudioImageEditor
                            key={`${seccionKey}-${item.id}`}
                            seccion={seccionKey}
                            itemId={item.id}
                            currentImage={getImageForSection(seccionKey, item.id)}
                            onImageUpdated={handleImageUpdated}
                            onImagePreview={handleImagePreview}
                            title={item.title}
                            description={item.description}
                            size={item.size}
                            aspectRatio={item.aspectRatio}
                            maxSize={item.maxSize}
                            formats={item.formats}
                          />
                        ))}
                      </div>
                    </div>
                  </TabsContent>
                )
              })}
            </Tabs>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="flex-1 bg-gray-900">
          <LivePreview mode={previewMode} previewImages={previewImages} savedImages={imagenes} />
        </div>
      </div>
    </div>
  )
}
