"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { supabase, type ImagenCliente } from "@/lib/supabase"
import { Upload, X, Loader2, ImageIcon, Info, Check } from "lucide-react"
import SafeImage from "./SafeImage"

interface StudioImageEditorProps {
  seccion: string
  itemId: number
  currentImage?: ImagenCliente
  onImageUpdated: (imagen: ImagenCliente) => void
  onImagePreview: (seccion: string, itemId: number, imageUrl: string) => void
  title: string
  description?: string
  size: string
  aspectRatio: string
  maxSize: string
  formats: string[]
}

export default function StudioImageEditor({
  seccion,
  itemId,
  currentImage,
  onImageUpdated,
  onImagePreview,
  title,
  description,
  size,
  aspectRatio,
  maxSize,
  formats,
}: StudioImageEditorProps) {
  const [uploading, setUploading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (file: File) => {
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    // Validar tamaño
    const maxSizeBytes = Number.parseFloat(maxSize) * (maxSize.includes("KB") ? 1024 : 1024 * 1024)
    if (file.size > maxSizeBytes) {
      alert(`El archivo debe ser menor a ${maxSize}`)
      return
    }

    setSelectedFile(file)

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onImagePreview(seccion, itemId, result)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const uploadImage = async () => {
    if (!selectedFile) return

    setUploading(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) throw new Error("Usuario no autenticado")

      const fileExt = selectedFile.name.split(".").pop()
      const fileName = `cliente_${user.id}/${seccion}_${itemId}.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("imagenes").upload(fileName, selectedFile, {
        upsert: true,
      })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("imagenes").getPublicUrl(fileName)

      const imagenData: Omit<ImagenCliente, "id"> = {
        cliente_id: user.id,
        seccion,
        item_id: itemId,
        imagen: publicUrl,
      }

      const { data, error: dbError } = await supabase
        .from("imagenes_cliente")
        .upsert(imagenData, {
          onConflict: "cliente_id,seccion,item_id",
        })
        .select()
        .single()

      if (dbError) throw dbError

      onImageUpdated(data)
      setSelectedFile(null)
      setPreview(null)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error al subir la imagen. Inténtalo de nuevo.")
    } finally {
      setUploading(false)
    }
  }

  const cancelUpload = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <Card className="bg-gray-700 border-gray-600 overflow-hidden">
      <CardContent className="p-4 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h4 className="font-medium text-white">{title}</h4>
          {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>

        {/* Image Specs */}
        <div className="bg-gray-800 rounded-lg p-3 space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <Info className="h-3 w-3 text-blue-400" />
            <span className="text-blue-400 font-medium">Especificaciones</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <div>
              <span className="text-gray-500">Tamaño:</span> {size}
            </div>
            <div>
              <span className="text-gray-500">Ratio:</span> {aspectRatio}
            </div>
            <div>
              <span className="text-gray-500">Max:</span> {maxSize}
            </div>
            <div>
              <span className="text-gray-500">Formato:</span> {formats.join(", ")}
            </div>
          </div>
        </div>

        {/* Image Preview */}
        <div
          className={`relative aspect-video bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed transition-colors ${
            dragOver ? "border-teal-400 bg-teal-400/10" : "border-gray-600"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <SafeImage src={preview} alt="Preview" className="aspect-video" />
          ) : currentImage?.imagen ? (
            <SafeImage src={currentImage.imagen} alt={`${seccion} ${itemId}`} className="aspect-video" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <ImageIcon className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Arrastra una imagen aquí</p>
                <p className="text-xs">o haz clic para seleccionar</p>
              </div>
            </div>
          )}

          {dragOver && (
            <div className="absolute inset-0 bg-teal-400/20 flex items-center justify-center">
              <div className="text-center text-teal-400">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Suelta la imagen aquí</p>
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-2">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files?.[0] && handleFileSelect(e.target.files[0])}
            className="hidden"
          />

          {!selectedFile ? (
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full bg-gray-600 border-gray-500 text-white hover:bg-gray-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              {currentImage ? "Cambiar imagen" : "Subir imagen"}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button onClick={uploadImage} disabled={uploading} className="flex-1 bg-teal-600 hover:bg-teal-700">
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Guardar
                  </>
                )}
              </Button>
              <Button
                onClick={cancelUpload}
                variant="outline"
                disabled={uploading}
                className="bg-gray-600 border-gray-500 hover:bg-gray-500"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Status */}
        {currentImage && (
          <div className="text-xs text-gray-500 pt-2 border-t border-gray-600">
            <p>Actualizado: {new Date(currentImage.updated_at || "").toLocaleString("es-ES")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
