"use client"

import { useState, useEffect } from "react"
import type { ImagenCliente } from "@/lib/supabase"
import { Monitor, Tablet, Smartphone, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface LivePreviewProps {
  mode: "desktop" | "tablet" | "mobile"
  previewImages: Record<string, string>
  savedImages: ImagenCliente[]
}

export default function LivePreview({ mode, previewImages, savedImages }: LivePreviewProps) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    // Ajustar escala según el modo
    switch (mode) {
      case "desktop":
        setScale(0.7)
        break
      case "tablet":
        setScale(0.8)
        break
      case "mobile":
        setScale(0.9)
        break
    }
  }, [mode])

  const getImageUrl = (seccion: string, itemId: number): string => {
    const key = `${seccion}-${itemId}`
    const previewUrl = previewImages[key]
    if (previewUrl) return previewUrl

    const savedImage = savedImages.find((img) => img.seccion === seccion && img.item_id === itemId)
    return savedImage?.imagen || ""
  }

  const getContainerClass = () => {
    switch (mode) {
      case "desktop":
        return "w-full max-w-none"
      case "tablet":
        return "w-[768px] mx-auto"
      case "mobile":
        return "w-[375px] mx-auto"
      default:
        return "w-full"
    }
  }

  const logoImage = getImageUrl("logo", 1)
  const heroImage = getImageUrl("hero", 1)
  const aboutImage = getImageUrl("about", 1)

  return (
    <div className="h-full bg-gray-900 relative">
      {/* Preview Header */}
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {mode === "desktop" && <Monitor className="h-4 w-4 text-teal-400" />}
            {mode === "tablet" && <Tablet className="h-4 w-4 text-teal-400" />}
            {mode === "mobile" && <Smartphone className="h-4 w-4 text-teal-400" />}
            <span className="text-sm font-medium capitalize">{mode} Preview</span>
          </div>
          <div className="text-xs text-gray-400">
            {mode === "desktop" && "1920px"}
            {mode === "tablet" && "768px"}
            {mode === "mobile" && "375px"}
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => window.open("/", "_blank")}
          className="text-gray-400 hover:text-white"
        >
          <ExternalLink className="h-4 w-4 mr-2" />
          Ver sitio real
        </Button>
      </div>

      {/* Preview Content */}
      <div className="h-[calc(100%-61px)] overflow-auto bg-gray-100">
        <div
          className={`${getContainerClass()} transition-all duration-300`}
          style={{ transform: `scale(${scale})`, transformOrigin: "top center" }}
        >
          {/* Mini Landing Page Preview */}
          <div className="bg-white min-h-screen">
            {/* Header Preview */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
              <div className="container mx-auto px-4 md:px-6">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <img src={logoImage || "/placeholder.svg"} alt="Logo" className="h-10 w-auto object-contain" />
                  </div>
                  <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
                    <span className="text-gray-700">Nosotros</span>
                    <span className="text-gray-700">Servicios</span>
                    <span className="text-gray-700">Visión</span>
                    <button className="bg-teal-600 text-white rounded-full px-6 py-2">Contacto</button>
                  </nav>
                </div>
              </div>
            </header>

            {/* Hero Section Preview */}
            <section className="relative h-96 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 z-0">
                {heroImage ? (
                  <img
                    src={heroImage || "/placeholder.svg"}
                    alt="Hero background"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"></div>
                )}
                <div className="absolute inset-0 bg-black/40"></div>
              </div>

              <div className="relative z-10 text-center text-white px-4">
                <h1 className="text-4xl md:text-6xl font-bold mb-4">PREVENCIÓN HS</h1>
                <p className="text-lg md:text-xl text-gray-600 leading-loose mb-6">Consultora de Higiene y Seguridad</p>
                <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 px-6 py-2 rounded-full">
                  Ver más
                </button>
              </div>
            </section>

            {/* Company Clients Preview */}
            <section className="py-8 bg-white border-t border-gray-100">
              <div className="flex justify-center items-center space-x-8 overflow-hidden">
                {(() => {
                  const clientImages = savedImages.filter((img) => img.seccion === "clientes")
                  const previewClients = Object.entries(previewImages)
                    .filter(([key]) => key.startsWith("clientes-"))
                    .map(([key, url]) => ({
                      item_id: Number.parseInt(key.split("-")[1]),
                      imagen: url,
                    }))

                  // Combinar clientes guardados con previews
                  const allClients = [...clientImages]
                  previewClients.forEach((preview) => {
                    const existingIndex = allClients.findIndex((client) => client.item_id === preview.item_id)
                    if (existingIndex >= 0) {
                      allClients[existingIndex] = { ...allClients[existingIndex], imagen: preview.imagen }
                    } else {
                      allClients.push({
                        ...preview,
                        cliente_id: '0', // valor por defecto como string
                        seccion: "clientes"
                      })
                    }
                  })

                  // Ordenar por item_id
                  allClients.sort((a, b) => a.item_id - b.item_id)

                  if (allClients.length > 0) {
                    return allClients.map((client) => (
                      <div
                        key={`client-${client.item_id}`}
                        className="flex-shrink-0 h-12 w-24 flex items-center justify-center"
                      >
                        <img
                          src={client.imagen || "/placeholder.svg"}
                          alt={`Cliente ${client.item_id}`}
                          className="max-h-full max-w-full object-contain grayscale"
                        />
                      </div>
                    ))
                  } else {
                    // Fallback clients
                    return [
                      { name: "YPF", color: "blue" },
                      { name: "TECHINT", color: "red" },
                      { name: "ARCELOR", color: "orange" },
                      { name: "TENARIS", color: "green" },
                      { name: "DOW", color: "purple" },
                      { name: "BUNGE", color: "yellow" },
                    ].map((company, index) => (
                      <div
                        key={`fallback-${index}`}
                        className="flex-shrink-0 h-12 w-24 flex items-center justify-center"
                      >
                        <div className={`bg-${company.color}-600 text-white px-3 py-1 rounded text-xs font-bold`}>
                          {company.name}
                        </div>
                      </div>
                    ))
                  }
                })()}
              </div>
              <div className="text-center mt-4">
                <p className="text-sm text-gray-600 leading-loose font-medium">Empresas que confían en nosotros</p>
              </div>
            </section>

            {/* Services Preview */}
            <section className="py-16 bg-gray-50">
              <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                  <h2 className="text-gray-900 text-3xl md:text-4xl font-light tracking-[0.35em] uppercase mb-4">Nuestros Servicios</h2>
                </div>
                <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
                  {[1, 2, 3].map((id) => {
                    const serviceImage = getImageUrl("servicios", id)
                    const titles = ["Seguridad Laboral", "Higiene Industrial", "Medio Ambiente"]
                    return (
                      <div key={id} className="bg-white rounded-lg shadow-lg overflow-hidden">
                        <div className="h-48 bg-gray-200">
                          {serviceImage ? (
                            <img
                              src={serviceImage || "/placeholder.svg"}
                              alt={titles[id - 1]}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              <div className="text-center">
                                <div className="w-12 h-12 bg-gray-300 rounded-full mx-auto mb-2"></div>
                                <p className="text-sm">{titles[id - 1]}</p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{titles[id - 1]}</h3>
                          <p className="text-sm text-gray-600 leading-loose">Descripción del servicio...</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* About Section Preview */}
            <section className="py-16 bg-white">
              <div className="container mx-auto px-4">
                <div className="grid gap-8 lg:grid-cols-2 items-center max-w-4xl mx-auto">
                  <div className="relative">
                    <div className="aspect-square bg-gray-200 rounded-2xl overflow-hidden">
                      {aboutImage ? (
                        <img
                          src={aboutImage || "/placeholder.svg"}
                          alt="About us"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <div className="text-center">
                            <div className="w-16 h-16 bg-gray-300 rounded-full mx-auto mb-4"></div>
                            <p>Imagen del equipo</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-gray-900 text-3xl md:text-4xl font-light tracking-[0.35em] uppercase">Sobre Nosotros</h2>
                    <p className="text-base text-gray-600 leading-loose">
                      Con más de 15 años de experiencia en el sector, nuestro equipo se dedica a garantizar el
                      cumplimiento normativo y la protección integral de empresas.
                    </p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
