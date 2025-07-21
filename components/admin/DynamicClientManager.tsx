"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, type ImagenCliente } from "@/lib/supabase"
import { useAuth } from "@/hooks/useAuth"
import { Plus, Trash2, Edit3, X, Building2 } from "lucide-react"
import StudioImageEditor from "./StudioImageEditor"

interface DynamicClientManagerProps {
  onImageUpdated: (imagen: ImagenCliente) => void
  onImagePreview: (seccion: string, itemId: number, imageUrl: string) => void
  onImageDeleted: (seccion: string, itemId: number) => void
}

export default function DynamicClientManager({
  onImageUpdated,
  onImagePreview,
  onImageDeleted,
}: DynamicClientManagerProps) {
  const { user } = useAuth()
  const [clientes, setClientes] = useState<ImagenCliente[]>([])
  const [loading, setLoading] = useState(true)
  const [editingId, setEditingId] = useState<number | null>(null)

  useEffect(() => {
    if (user) {
      fetchClientes()
    }
  }, [user])

  const fetchClientes = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from("imagenes_cliente")
        .select("*")
        .eq("cliente_id", user.id)
        .eq("seccion", "clientes")
        .order("item_id", { ascending: true })

      if (error) throw error
      setClientes(data || [])
    } catch (error) {
      console.error("Error fetching clientes:", error)
    } finally {
      setLoading(false)
    }
  }

  const addNewCliente = async () => {
    if (!user) return

    try {
      // Encontrar el siguiente item_id disponible
      const maxItemId = clientes.length > 0 ? Math.max(...clientes.map((cliente) => cliente.item_id)) : 0
      const newItemId = maxItemId + 1

      // Crear entrada placeholder en la base de datos
      const placeholderData: Omit<ImagenCliente, "id"> = {
        cliente_id: user.id,
        seccion: "clientes",
        item_id: newItemId,
        imagen: "/placeholder.svg?height=100&width=200", // Placeholder temporal
      }

      const { data, error } = await supabase.from("imagenes_cliente").insert(placeholderData).select().single()

      if (error) throw error

      setClientes((prev) => [...prev, data])
      setEditingId(newItemId) // Abrir editor automáticamente
    } catch (error) {
      console.error("Error adding cliente:", error)
      alert("Error al agregar cliente")
    }
  }

  const deleteCliente = async (itemId: number) => {
    if (!user) return

    const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente?")
    if (!confirmDelete) return

    try {
      // Eliminar de la base de datos
      const { error } = await supabase
        .from("imagenes_cliente")
        .delete()
        .eq("cliente_id", user.id)
        .eq("seccion", "clientes")
        .eq("item_id", itemId)

      if (error) throw error

      // Eliminar archivo de storage si existe
      const fileName = `cliente_${user.id}/clientes_${itemId}`
      await supabase.storage.from("imagenes").remove([`${fileName}.jpg`, `${fileName}.png`, `${fileName}.webp`])

      setClientes((prev) => prev.filter((cliente) => cliente.item_id !== itemId))
      onImageDeleted("clientes", itemId)
    } catch (error) {
      console.error("Error deleting cliente:", error)
      alert("Error al eliminar cliente")
    }
  }

  const handleImageUpdated = (updatedImage: ImagenCliente) => {
    setClientes((prev) => {
      const index = prev.findIndex((cliente) => cliente.item_id === updatedImage.item_id)
      if (index >= 0) {
        const newClientes = [...prev]
        newClientes[index] = updatedImage
        return newClientes
      }
      return prev
    })

    onImageUpdated(updatedImage)
    setEditingId(null) // Cerrar editor después de guardar
  }

  const handleImageClick = (itemId: number) => {
    setEditingId(editingId === itemId ? null : itemId)
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
          <h3 className="font-medium text-white">Logos de Clientes</h3>
          <p className="text-xs text-gray-400">Gestiona los logos de empresas clientes</p>
        </div>
        <Button onClick={addNewCliente} size="sm" className="bg-teal-600 hover:bg-teal-700">
          <Plus className="h-4 w-4 mr-2" />
          Agregar Cliente
        </Button>
      </div>

      {/* Carrusel de Clientes */}
      {clientes.length > 0 && (
        <div className="bg-gray-700 rounded-lg p-4">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center">
            <Building2 className="h-4 w-4 mr-2" />
            Vista Previa del Carrusel
          </h4>
          <div className="flex space-x-4 overflow-x-auto pb-2">
            {clientes.map((cliente) => (
              <div
                key={cliente.item_id}
                className="flex-shrink-0 w-24 h-12 bg-gray-800 rounded border border-gray-600 flex items-center justify-center cursor-pointer hover:border-teal-400 transition-colors"
                onClick={() => handleImageClick(cliente.item_id)}
              >
                <img
                  src={cliente.imagen || "/placeholder.svg"}
                  alt={`Cliente ${cliente.item_id}`}
                  className="max-w-full max-h-full object-contain p-1"
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400 mt-2">Haz clic en cualquier logo para editarlo</p>
        </div>
      )}

      {/* Editor de Clientes */}
      <div className="grid gap-4 md:grid-cols-2">
        {clientes.map((cliente) => (
          <Card key={cliente.item_id} className="bg-gray-700 border-gray-600">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm text-white">Cliente {cliente.item_id}</CardTitle>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => setEditingId(editingId === cliente.item_id ? null : cliente.item_id)}
                    size="sm"
                    variant="ghost"
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                  >
                    {editingId === cliente.item_id ? <X className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
                  </Button>
                  <Button
                    onClick={() => deleteCliente(cliente.item_id)}
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
              {editingId === cliente.item_id ? (
                <StudioImageEditor
                  seccion="clientes"
                  itemId={cliente.item_id}
                  currentImage={cliente}
                  onImageUpdated={handleImageUpdated}
                  onImagePreview={onImagePreview}
                  title={`Cliente ${cliente.item_id}`}
                  description="Logo de empresa cliente"
                  size="200x100px"
                  aspectRatio="2:1"
                  maxSize="500KB"
                  formats={["PNG", "SVG"]}
                />
              ) : (
                <div
                  className="relative aspect-[2/1] bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed border-gray-600 cursor-pointer hover:border-teal-400 transition-colors group"
                  onClick={() => handleImageClick(cliente.item_id)}
                >
                  <img
                    src={cliente.imagen || "/placeholder.svg"}
                    alt={`Cliente ${cliente.item_id}`}
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
      {clientes.length === 0 && (
        <div className="text-center py-12 bg-gray-800 rounded-lg border-2 border-dashed border-gray-600">
          <Building2 className="h-12 w-12 text-gray-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-300 mb-2">No hay clientes</h3>
          <p className="text-gray-500 mb-4">Agrega el primer logo de cliente</p>
          <Button onClick={addNewCliente} className="bg-teal-600 hover:bg-teal-700">
            <Plus className="h-4 w-4 mr-2" />
            Agregar Primer Cliente
          </Button>
        </div>
      )}
    </div>
  )
}
