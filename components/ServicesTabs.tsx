"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Shield, Microscope, GraduationCap, FileText, Building, CheckCircle, ChevronDown } from "lucide-react"

const services = [
  {
    id: "realizacion_estudios",
    title: "Realización de Estudios",
    icon: Microscope,
    description: "Estudios técnicos especializados según normativas vigentes",
    content: {
      title: "Realización de Estudios",
      items: [
        "Estudios de carga de fuego, según Decreto 351/79",
        "Estudios de iluminación, según Resolución SRT 84/2012",
        "Estudios de ruido, según Resolución SRT 85/2012",
        "Estudios de estrés térmico, según Resolución SRT 30/23",
        "Estudios de puesta a tierra, según Resolución SRT 900/2015",
        "Estudios de ergonomía, según Resolución SRT 886/2015",
      ],
    },
  },
  {
    id: "relevamientos_generales",
    title: "Relevamientos Generales",
    icon: Shield,
    description: "Servicios integrales de higiene y seguridad laboral",
    content: {
      title: "Relevamientos Generales",
      items: [
        "Servicio de Higiene y Seguridad acorde a RES SRT 905/2015",
        "Procedimientos de trabajo seguro",
        "Relevamientos de equipos de protección personal",
        "Presentación ante ART de Relevamiento General de Riesgos Laborales (RGRL)",
        "Presentación ante ART de Relevamiento de Agentes de Riesgos (RAR)",
      ],
    },
  },
  {
    id: "respuesta_emergencias",
    title: "Respuesta a Emergencias",
    icon: FileText,
    description: "Planes y protocolos de emergencia y evacuación",
    content: {
      title: "Respuesta a Emergencias",
      items: [
        "Elaboración de Planos de evacuación",
        "Elaboración de protocolos de evacuación y actuación en caso de emergencias",
        "Capacitación de brigadistas y simulacros de emergencias",
      ],
    },
  },
  {
    id: "capacitaciones",
    title: "Capacitaciones",
    icon: GraduationCap,
    description: "Programas de formación y capacitación especializada",
    content: {
      title: "Capacitaciones",
      items: [
        "Plan de capacitación anual con temas básicos y específicos según actividad",
        "Capacitaciones en modalidad online o presencial",
      ],
    },
  },
  {
    id: "sistema_autoproteccion",
    title: "Sistema de Autoprotección",
    icon: Shield,
    description: "Sistemas integrales de autoprotección y defensa civil",
    content: {
      title: "Sistema de Autoprotección",
      items: [
        "Confección de informe del Sistema de Autoprotección Ley 5920/17 CABA y presentación ante Defensa Civil (plataforma TAT)",
        "Confección de simulacros virtuales de incendio y evacuación",
        "Elaboración de planos de evacuación según Ley de Autoprotección",
      ],
    },
  },
  {
    id: "construccion",
    title: "Construcción",
    icon: Building,
    description: "Gestión de seguridad en obras y construcción",
    content: {
      title: "Construcción",
      items: [
        "Gestión de seguridad acorde a Dec. 911/96",
        "Confección y presentación en ART de programas de Seguridad y Avisos de Obra (Res. 51/97, 35/98 y 319/99)",
        "Confección de análisis de tarea segura y permisos para trabajos especiales",
      ],
    },
  },
  {
    id: "asesoramiento_iso",
    title: "Asesoramiento Normas ISO",
    icon: CheckCircle,
    description: "Implementación y asesoramiento en normas ISO",
    content: {
      title: "Asesoramiento Normas ISO",
      items: [
        "ISO 9001:2015 Sistemas de gestión de calidad",
        "ISO 45001:2018 Sistemas de gestión de la seguridad y salud en el trabajo",
        "ISO 19011:2018 Directrices para la auditoría de sistemas de gestión",
      ],
    },
  },
]

export default function ServicesTabs() {
  const [activeTab, setActiveTab] = useState("realizacion_estudios")
  const [activeMobileIndex, setActiveMobileIndex] = useState<number | null>(0) // Primer servicio abierto en mobile

  const activeService = services.find((service) => service.id === activeTab)

  return (
    <section id="servicios" className="py-16 sm:py-20 bg-gradient-to-br from-gray-50 to-white">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 md:px-6 flex flex-col items-center justify-center">
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-gray-900 text-2xl sm:text-3xl md:text-4xl font-light tracking-[0.30em] uppercase mb-4 sm:mb-6">
            Nuestros Servicios
          </h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl sm:max-w-3xl mx-auto">
            Ofrecemos soluciones integrales en seguridad, higiene y medio ambiente para proteger a tu empresa y trabajadores
          </p>
        </div>

        {/* Desktop: igual que antes */}
        <div className="hidden lg:flex gap-6 min-h-[700px] h-full items-start justify-center w-full">
          {/* Sidebar */}
          <div className="w-80 xl:w-96 flex-shrink-0">
            <div className="space-y-2 sticky top-24">
              {services.map((service) => {
                const Icon = service.icon
                return (
                  <button
                    key={service.id}
                    onClick={() => setActiveTab(service.id)}
                    className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                      activeTab === service.id
                        ? "bg-teal-600 text-white shadow-lg"
                        : "bg-white hover:bg-gray-50 text-gray-700 shadow-sm border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-sm leading-tight break-words">{service.title}</h3>
                        <p className={`text-xs text-gray-600 leading-snug mt-1 break-words ${activeTab === service.id ? "text-teal-100" : ""}`}>
                          {service.description}
                        </p>
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 h-full max-w-3xl">
            <Card className="shadow-xl border-0 bg-white h-full min-h-[600px] max-h-[700px] px-4 py-6">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-3 mb-4">
                  {activeService && <activeService.icon className="h-8 w-8 text-teal-600" />}
                  <CardTitle className="text-2xl text-gray-900">{activeService?.content.title}</CardTitle>
                </div>
                <CardDescription className="text-base text-gray-600 leading-relaxed">{activeService?.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid gap-4">
                  {activeService?.content.items.map((item, index) => (
                    <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                      <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-600 leading-snug break-words">{item}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Mobile: acordeón */}
        <div className="lg:hidden w-full space-y-4">
          {services.map((service, idx) => {
            const isOpen = activeMobileIndex === idx
            const Icon = service.icon
            return (
              <div key={service.id} className="rounded-2xl shadow-md bg-white border border-gray-200">
                <button
                  onClick={() => setActiveMobileIndex(isOpen ? null : idx)}
                  className={`w-full flex items-center justify-between p-4 rounded-t-2xl transition-all group outline-none focus-visible:ring-2 focus-visible:ring-teal-600
                  ${isOpen ? "bg-teal-600 text-white" : "bg-white text-gray-900 hover:bg-gray-50"}`}
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className={`h-5 w-5 ${isOpen ? "text-white" : "text-teal-600"}`} />
                    <span className="font-semibold text-base">{service.title}</span>
                  </div>
                  <ChevronDown className={`h-5 w-5 transition-transform duration-300 ${isOpen ? "rotate-180" : ""} ${isOpen ? "text-white" : "text-gray-500"}`} />
                </button>
                {isOpen && (
                  <div className="p-4 pt-2 bg-gray-50 rounded-b-2xl">
                    <div className="text-sm text-gray-700 mb-3">{service.description}</div>
                    <div className="space-y-3">
                      {service.content.items.map((item, subidx) => (
                        <div key={subidx} className="flex items-start space-x-3">
                          <CheckCircle className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
