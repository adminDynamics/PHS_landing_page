"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { supabase, type ImagenCliente } from "@/lib/supabase"
import { Upload, X, Loader2, Crown, Info, Check } from "lucide-react"
import SafeImage from "./SafeImage"

interface MainLogoEditorProps {
  currentImage?: ImagenCliente
  onImageUpdated: (imagen: ImagenCliente) => void
  onImagePreview: (seccion: string, itemId: number, imageUrl: string) => void
}

export default function MainLogoEditor({ currentImage, onImageUpdated, onImagePreview }: MainLogoEditorProps) {
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

    // Validar tamaño (500KB)
    if (file.size > 500 * 1024) {
      alert("El archivo debe ser menor a 500KB")
      return
    }

    setSelectedFile(file)

    // Crear preview
    const reader = new FileReader()
    reader.onload = (e) => {
      const result = e.target?.result as string
      setPreview(result)
      onImagePreview("logo", 1, result)
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
      const fileName = `cliente_${user.id}/logo_1.${fileExt}`

      const { error: uploadError } = await supabase.storage.from("imagenes").upload(fileName, selectedFile, {
        upsert: true,
      })

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("imagenes").getPublicUrl(fileName)

      const imagenData: Omit<ImagenCliente, "id"> = {
        cliente_id: user.id,
        seccion: "logo",
        item_id: 1,
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
      console.error("Error uploading logo:", error)
      alert("Error al subir el logo. Inténtalo de nuevo.")
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
      <CardHeader className="pb-3">
        <CardTitle className="text-white flex items-center">
          <Crown className="h-5 w-5 mr-2 text-yellow-400" />
          Logo Principal del Sitio
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Logo Specs */}
        <div className="bg-gray-800 rounded-lg p-3 space-y-2">
          <div className="flex items-center space-x-2 text-xs">
            <Info className="h-3 w-3 text-blue-400" />
            <span className="text-blue-400 font-medium">Especificaciones del Logo</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-gray-300">
            <div>
              <span className="text-gray-500">Tamaño:</span> 200x80px
            </div>
            <div>
              <span className="text-gray-500">Ratio:</span> 5:2
            </div>
            <div>
              <span className="text-gray-500">Max:</span> 500KB
            </div>
            <div>
              <span className="text-gray-500">Formato:</span> PNG, SVG
            </div>
          </div>
          <div className="text-xs text-gray-400 pt-1 border-t border-gray-700">
            <p>• Fondo transparente recomendado</p>
            <p>• Aparecerá en el header del sitio</p>
          </div>
        </div>

        {/* Logo Preview */}
        <div
          className={`relative aspect-[5/2] bg-gray-800 rounded-lg overflow-hidden border-2 border-dashed transition-colors ${
            dragOver ? "border-teal-400 bg-teal-400/10" : "border-gray-600"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {preview ? (
            <SafeImage src={preview} alt="Logo Preview" className="aspect-[5/2]" />
          ) : currentImage?.imagen ? (
            <SafeImage src={currentImage.imagen} alt="Logo Principal" className="aspect-[5/2]" />
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <div className="text-center">
                <Crown className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm">Arrastra el logo aquí</p>
                <p className="text-xs">o haz clic para seleccionar</p>
              </div>
            </div>
          )}

          {dragOver && (
            <div className="absolute inset-0 bg-teal-400/20 flex items-center justify-center">
              <div className="text-center text-teal-400">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="font-medium">Suelta el logo aquí</p>
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
              {currentImage ? "Cambiar logo" : "Subir logo"}
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
                    Guardar Logo
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
            <p>Logo actualizado: {new Date(currentImage.updated_at || "").toLocaleString("es-ES")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
