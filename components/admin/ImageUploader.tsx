"use client"

import { type ChangeEvent, useCallback, useState } from "react"

interface ImageUploaderProps {
  onChange: (file: File) => void
  seccion: string
  itemId: string | number
  currentImage?: { imagen: string } | null
}

const ImageUploader = ({ onChange, seccion, itemId, currentImage }: ImageUploaderProps) => {
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      onChange(file)

      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    },
    [onChange],
  )

  const handleClearPreview = () => {
    setPreview(null)
  }

  return (
    <div>
      {/* Imagen actual o preview */}
      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
        {preview ? (
          <SafeImage src={preview} alt="Preview" className="aspect-video" fallbackText="Error en preview" />
        ) : (
          <SafeImage
            src={currentImage?.imagen}
            alt={`${seccion} ${itemId}`}
            className="aspect-video"
            fallbackText="No hay imagen"
          />
        )}
      </div>

      <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={handleImageChange} />
      <div className="flex justify-between mt-2">
        <label
          htmlFor="image-upload"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 cursor-pointer"
        >
          Subir Imagen
        </label>
        {preview && (
          <button onClick={handleClearPreview} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-700">
            Quitar Preview
          </button>
        )}
      </div>
    </div>
  )
}

export default ImageUploader
import SafeImage from "./SafeImage"
