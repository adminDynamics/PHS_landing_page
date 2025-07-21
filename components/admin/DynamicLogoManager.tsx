"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, type ImagenCliente } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Plus, Trash2, Edit3, X } from "lucide-react"
import StudioImageEditor from "./StudioImageEditor"

interface DynamicLogoManagerProps {
  onImageUpdated: (imagen: ImagenCliente) => void
  onImagePreview: (seccion: string, itemId: number, imageUrl: string) => void
}

export default function DynamicLogoManager({ onImageUpdated, onImagePreview }: DynamicLogoManagerProps) {
  const { user } = useAuth()
  const [logos, setLogos] = useState<ImagenCliente[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      fetchLogos()
    }
  }, [user])

  const fetchLogos = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("imagenes_cliente")
        .select("*")
        .eq("cliente_id", user.id)
        .eq("seccion", "logos")
        .order("item_id", { ascending: true })

      if (error) throw error
      setLogos(data || [])
    } catch (error) {
      console.error("Error fetching logos:", error)
    } finally {
      setLoading(false)
    }
  }

  const addNewLogo = async () => {
    if (!user) return

    try {
      // Encontrar el siguiente item_id disponible
      const maxItemId = logos.length > 0 ? Math.max(...logos.map((logo) => logo.item_id)) : 0
      const newItemId = maxItemId + 1

      // Crear entrada placeholder en la base de datos
      const placeholderData: Omit<ImagenCliente, "id"> = {
        cliente_id: user.id,
        seccion: "logos",
        item_id: newItemId,
        imagen: "/placeholder.svg?height=100&width=200", // Placeholder temporal
      }

      const { data, error } = await supabase.from("imagenes_cliente").insert(placeholderData).select().single()

      if (error) throw error

      setLogos((prev) => [...prev, data])
      setEditingId(newItemId) // Abrir editor automáticamente
    } catch (error) {
      console.error("Error adding logo:", error)
      alert("Error al agregar logo")
    }
  }

  const deleteLogo = async (itemId: number) => {
    if (!user) return

    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este logo?")
    if (!confirmDelete) return

    try {
      // Eliminar de la base de datos
      const { error } = await supabase
        .from("imagenes_cliente")
        .delete()
        .eq("cliente_id", user.id)
        .eq("seccion", "logos")
        .eq("item_id", itemId)

      if (error) throw error

      // Eliminar archivo de storage si existe
      const fileName = `cliente_${user.id}/logos_${itemId}`
      await supabase.storage.from("imagenes").remove([`${fileName}.jpg`, `${fileName}.png`, `${fileName}.webp`])

      setLogos((prev) => prev.filter((logo) => logo.item_id !== itemId))
    } catch (error) {
      console.error("Error deleting logo:", error)
      alert("Error al eliminar logo")
    }
  }

  const handleImageUpdated = (updatedImage: ImagenCliente) => {
    setLogos((prev) => {
      const index = prev.findIndex((logo) => logo.item_id === updatedImage.item_id)
      if (index >= 0) {
        const newLogos = [...prev]
        newLogos[index] = updatedImage
        return newLogos
      }
      return prev
    })

    onImageUpdated(updatedImage)
    setEditingId(null) // Cerrar editor después de guardar
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
        <div>
          <h3 className="font-medium text-white">Company Logos</h3>
          <p className="text-xs text-gray-400">Gestiona los logos de empresas colaboradoras</p>
        </div>
        <Button onClick={addNewLogo} size="sm" className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Logo
        </Button>
      </div>

      {/* Logos Grid */}
      <div className="grid gap-4 md:grid-cols-2">
        {logos.map((logo) => (
          <Card key={logo.item_id} className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white">Logo {logo.item_id}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setEditingId(editingId === logo.item_id ? null : logo.item_id)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    {editingId === logo.item_id ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => deleteLogo(logo.item_id)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-red-400 hover:text-red-300"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {editingId === logo.item_id ? (
                <StudioImageEditor
                  seccion="logos"
                  itemId={logo.item_id}
                  currentImage={logo}
                  onImageUpdated={handleImageUpdated}
                  onImagePreview={onImagePreview}
                  title={`Logo ${logo.item_id}`}
                  description="Logo de empresa colaboradora"
                  size="200x100px"
                  aspectRatio="2:1"
                  maxSize="500KB"
                  formats={["PNG", "SVG"]}
                />
              ) : (
                <div
                  className="relative aspect-[2/1] bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 cursor-pointer hover:border-teal-400 transition-colors group"
                  onClick={() => setEditingId(logo.item_id)}
                >
                  <img
                    src={logo.imagen || "/placeholder.svg"}
                    alt={`Logo ${logo.item_id}`}
                    className="w-full h-full object-contain p-2"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="text-white text-center">
                      <Edit3 className="h-6 w-6 mx-auto mb-1" />
                      <p className="text-xs">Click para editar</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty State */}
      {logos.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
          <Plus className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No hay logos</h3>
          <p className="text-gray-500 mb-4">Agrega el primer logo de empresa colaboradora</p>
          <Button onClick={addNewLogo} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primer Logo
          </Button>
        </div>
      )}
    </div>
  )
}
