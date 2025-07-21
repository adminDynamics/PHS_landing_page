"use client"

import { useState } from "react"
import { Upload } from "lucide-react"

interface SafeImageProps {
  src?: string
  alt: string
  className?: string
  fallbackText?: string
}

export default function SafeImage({ src, alt, className = "", fallbackText = "No hay imagen" }: SafeImageProps) {
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(true)

  const handleError = () => {
    setError(true)
    setLoading(false)
  }

  const handleLoad = () => {
    setError(false)
    setLoading(false)
  }

  if (!src || error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-400 ${className}`}>
        <div className="text-center">
          <Upload className="h-12 w-12 mx-auto mb-2" />
          <p className="text-sm">{error ? "Error al cargar imagen" : fallbackText}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
        </div>
      )}
      <img
        src={src || "/placeholder.svg"}
        alt={alt}
        className="w-full h-full object-cover"
        onError={handleError}
        onLoad={handleLoad}
        style={{ display: loading ? "none" : "block" }}
      />
    </div>
  )
}
