"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"

const CLIENT_ID = "9b7d03ae-ca36-42d1-a46f-d908497dc0a7"

interface PublicImage {
  seccion: string
  item_id: number
  imagen: string
}

export function usePublicImages() {
  const [images, setImages] = useState<PublicImage[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchImages = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from("imagenes_cliente")
        .select("seccion, item_id, imagen")
        .eq("cliente_id", CLIENT_ID)

      if (error) throw error

      setImages(data || [])

      // 🔍 Verificar si la imagen contiene el nombre buscado
      if (data) {
        console.log("🟡 URLs obtenidas desde Supabase:")
        data.forEach((img) => console.log("   →", img.imagen))
      }
    } catch (err) {
      console.error("❌ Error fetching public images:", err)
      setError(err instanceof Error ? err.message : "Error desconocido")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchImages()
  }, [])

  const getImage = (seccion: string, itemId: number): string | undefined => {
    const image = images.find((img) => img.seccion === seccion && img.item_id === itemId)
    return image?.imagen
  }

  const getImagesBySection = (seccion: string): PublicImage[] => {
    return images.filter((img) => img.seccion === seccion)
  }

  const getImageByName = (seccion: string): string | undefined => {
    const found = images.find((img) => img.seccion === seccion)
    console.log(`🔵 Buscando imagen con seccion = "${seccion}", resultado:`, found?.imagen || "No encontrado")
    return found?.imagen
  }

  return {
    images,
    loading,
    error,
    getImage,
    getImagesBySection,
    getImageByName,
    refetch: fetchImages,
  }
}
