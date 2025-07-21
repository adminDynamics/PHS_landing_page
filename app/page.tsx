"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, CheckCircle, Phone, Mail, MapPin, Menu, X } from "lucide-react"
import Link from "next/link"
import { useState, useEffect } from "react"
import { usePublicImages } from "@/hooks/usePublicImages"
import ServicesTabs from "@/components/ServicesTabs"
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/logo_slider.css";

// Datos estáticos de contacto
const contactInfo = {
  telefono: "+54 11 1234-5678",
  email: "info@prevencionhs.com",
  direccion: "Buenos Aires, Argentina",
  horarios: "Lunes a Viernes 9:00 - 18:00",
  tiempoRespuesta: "Respuesta en 24 horas",
  atencionPresencial: "Atención presencial con cita previa",
}

function scrollToElementWithOffset(id: string, offset = 0, duration = 800) {
  const target = document.getElementById(id)
  if (!target) return

  const startY = window.scrollY
  const endY = target.getBoundingClientRect().top + startY + offset
  const distance = endY - startY
  let startTime: number | null = null

  function step(currentTime: number) {
    if (startTime === null) startTime = currentTime
    const progress = currentTime - startTime
    const easeInOut = (t: number) => 0.5 * (1 - Math.cos(Math.PI * t)) // easeInOut function
    const percent = Math.min(progress / duration, 1)
    window.scrollTo(0, startY + distance * easeInOut(percent))

    if (progress < duration) {
      window.requestAnimationFrame(step)
    }
  }

  window.requestAnimationFrame(step)
}

export default function SafetyConsultingLanding() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const { getImage,getImageByName, getImagesBySection, loading: imagesLoading } = usePublicImages()
  const [isNavbarDark, setIsNavbarDark] = useState(true);

  useEffect(() => {
    setIsVisible(true)
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight - 80) {
        setIsNavbarDark(false);
      } else {
        setIsNavbarDark(true);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Obtener imágenes de la base de datos
  const heroImage = getImage("hero", 1)
  const aboutImage = getImage("about", 1)
  const logoImages = getImagesBySection("clientes")
  const logoImage = getImage("logo_phs",1)
  const logoImageBlanco = getImage("logo_phs_blanco",1)
  const logoImageBlancoXL = getImage("logo_phs_blanco_xl",1)


  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header - Liquid Glass Effect */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${isNavbarDark ? "bg-white/10" : "bg-white"} backdrop-blur-md border-b border-white/20`}>
  <div className="container mx-auto px-4 md:px-6">
    <div className="flex h-16 items-center justify-center relative">
      {/* Logo */}
      <div className="absolute left-4 md:left-6 flex items-center space-x-2">
        {isNavbarDark ? (
          <img
            src={logoImageBlanco || "/placeholder.svg"}
            alt="PHS Logo Blanco"
            className="h-10 w-auto object-contain transition-all duration-300"
          />
        ) : (
          <img
            src={logoImage || "/placeholder.svg"}
            alt="PHS Logo"
            className="h-10 w-auto object-contain transition-all duration-300"
          />
        )}
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
        <Link href="#nosotros" className={isNavbarDark ? "text-white/90 hover:text-white transition-colors" : "text-gray-800 hover:text-gray-900 transition-colors"}>
          Nosotros
        </Link>
        <Link href="#servicios" className={isNavbarDark ? "text-white/90 hover:text-white transition-colors" : "text-gray-800 hover:text-gray-900 transition-colors"}>
          Servicios
        </Link>
        <Link href="#contacto" className={isNavbarDark ? "text-white/90 hover:text-white transition-colors" : "text-gray-800 hover:text-gray-900 transition-colors"}>
          <Button className={isNavbarDark ? "bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full px-6 backdrop-blur-sm" : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-full px-6 backdrop-blur-sm"}>
            Contacto
          </Button>
        </Link>
      </nav>

      {/* Mobile Menu Button */}
      <button className="md:hidden absolute right-4 p-2 text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </button>
    </div>

    {/* Mobile Navigation */}
    {isMenuOpen && (
      <div className="md:hidden py-4 border-t border-white/20">
        <nav className="flex flex-col space-y-4 items-center">
          <Link href="#nosotros" className={isNavbarDark ? "text-white/90 hover:text-white transition-colors" : "text-gray-800 hover:text-gray-900 transition-colors"}>
            Nosotros
          </Link>
          <Link href="#servicios" className={isNavbarDark ? "text-white/90 hover:text-white transition-colors" : "text-gray-800 hover:text-gray-900 transition-colors"}>
            Servicios
          </Link>
          <Link href="#contacto" className={isNavbarDark ? "text-white/90 hover:text-white transition-colors" : "text-gray-800 hover:text-gray-900 transition-colors"}>
            <Button className={isNavbarDark ? "bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-full w-fit backdrop-blur-sm" : "bg-gray-200 hover:bg-gray-300 text-gray-800 border border-gray-300 rounded-full w-fit backdrop-blur-sm"}>
              Contacto
            </Button>
          </Link>
        </nav>
      </div>
    )}
  </div>
</header>

      <main className="flex-1">
        {/* Hero Section with Background Image - Fixed */}
        <section className="fixed top-0 left-0 right-0 h-screen flex items-center justify-center overflow-hidden z-0">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            {heroImage && !imagesLoading ? (
              <img src={heroImage || "/placeholder.svg"} alt="Hero background" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-teal-900"></div>
            )}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
            <div
              className={`transition-all duration-1000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
            >
              <div className="mb-6 animate-fade-in-up">
          <img
              src={logoImageBlancoXL || "/placeholder.svg"}
              alt="Logo Prevención HS"
              className="mx-auto mb-8 w-[400px] md:w-[500px] lg:w-[600px]"
            />
              </div>
              
                <Button
                  size="lg"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 rounded-full px-8 py-3 text-lg font-medium transition-all duration-300"
                  onClick={() => scrollToElementWithOffset("nosotros", -80)}
                >
                  Conoce PHS
                </Button>
              
            </div>
          </div>
        </section>

        {/* About Section - Updated with full-width image */}
        <section
  id="nosotros"
  className="relative z-10 py-24 bg-white overflow-hidden"
  style={{ marginTop: "100vh" }}
>
  <div className="grid lg:grid-cols-2 items-center gap-12 max-w-7xl mx-auto px-4">
    
    {/* Text Section - LEFT */}
    <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 space-y-8 px-4">
      <div>
        <h2 className="text-gray-900 text-3xl md:text-4xl font-light tracking-[0.35em] uppercase">Sobre Nosotros</h2>
        <div className="w-12 h-[2px] bg-gray-400 mx-auto lg:mx-0 mt-3 mb-6" />
      </div>

      <p className="text-gray-600 text-lg leading-loose">
      Somos una empresa argentina especializada en servicios externos de Higiene y Seguridad en el trabajo desde el año 2015. 
      </p>

      <p className="text-gray-600 text-lg leading-loose">
      Nuestro enfoque profesional se basa en la mejora continua y en la implementación de medidas correctivas y preventivas, ajustadas al marco legal vigente y a los requerimientos específicos de cada organización. 
      </p>

      <p className="text-gray-600 text-lg leading-loose">
      A través de una planificación de tareas y cronograma anual de auditorías, estudios técnicos, mediciones ambientales y análisis de riesgos, buscamos minimizar la exposición a peligros laborales y garantizar condiciones de trabajo seguras.
  
      </p>

      {/* Firma o nombre */}
      <div className="mt-10">
        <div className="flex flex-col items-center lg:items-start space-y-2">
          {/* Firma como texto o imagen */}
          <p className="text-xl font-semibold text-gray-900">Pablo Sosa</p>
          <p className="text-sm text-gray-500">CEO de Prevención HS</p>
        </div>
      </div>
    </div>

   {/* Image Section - RIGHT */}
<div className="w-full h-full">
  {aboutImage ? (
    <img
      src={aboutImage}
      alt="Equipo profesional"
      className="w-full h-[600px] object-cover rounded-xl shadow-xl"
    />
  ) : (
    <div className="w-full h-[600px] bg-gradient-to-br from-teal-100 to-teal-200 flex items-center justify-center text-teal-600 rounded-xl">
      <div className="text-center">
        <Users className="h-24 w-24 mx-auto mb-4" />
        <p className="text-lg font-medium">Equipo de profesionales</p>
      </div>
    </div>
  )}
</div>
  </div>
</section>

        

       {/* Company Clients Section - Slider tipo "trusted by" */}
{logoImages.length > 0 && (
  <section className="relative z-10 py-8 bg-white border-t border-gray-100 overflow-hidden w-full">
    <div className="w-screen overflow-hidden">
      <div className="text-center mt-2 mb-6">
        <p className="text-sm text-gray-500 font-medium">Nuestra cartera de clientes</p>
      </div>

      <div className="logo-marquee">
        <div className="logo-track">
          {[...logoImages, ...logoImages, ...logoImages].map((logo, idx) => (
            <img
              key={`logo-slide-${idx}`}
              src={logo.imagen || "/placeholder.svg"}
              alt={`Logo ${logo.item_id}`}
              className="h-12 w-auto mx-6"
            />
          ))}
        </div>
      </div>
    </div>
  </section>
)}

     
        {/* Services Section - New Tabs Component */}
        <div className="relative z-10">
          <ServicesTabs />
        </div>

        {/* Separator Line */}
        <div className="relative z-10 bg-teal-400 h-px w-full"></div>


        {/* Botón que te lleva a contacto */}
        <section className="relative z-10 py-8 bg-white">
        <div className="text-center mt-12"> 
        <Button
                  className="bg-white hover:bg-gray-50 text-teal-600 border-2 border-teal-600 px-8 py-3 rounded-full text-lg font-medium transition-colors"
                  onClick={() => scrollToElementWithOffset("contacto", -80)}
                >
                  Quiero Contactarme
        </Button>
        </div>
        </section>

        
        
        {/* Testimonials Section */}
        {/* <section className="relative z-10 py-24 bg-white">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                La Opinión De <span className=" text-teal-600">Nuestros Clientes</span>
              </h2>
            </div>
            <div className="max-w-6xl mx-auto relative">
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 px-4 md:px-16">
                
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.457a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.382-2.457a1 1 0 00-1.175 0l-3.382 2.457c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">10 Feb, 2023</span>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore. Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore. Lorem Ipsum Dolor Sit Amet.
                  </p>
                  <div className="flex items-center space-x-3 mt-auto">
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Ray Robertson" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Ray Robertson</h4>
                      <p className="text-sm text-gray-600">CEO Company</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 flex flex-col justify-between">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.967a1 1 0 00.95.69h4.175c.969 0 1.371 1.24.588 1.81l-3.382 2.457a1 1 0 00-.364 1.118l1.287 3.966c.3.921-.755 1.688-1.54 1.118l-3.382-2.457a1 1 0 00-1.175 0l-3.382 2.457c-.784.57-1.838-.197-1.54-1.118l1.287-3.966a1 1 0 00-.364-1.118L2.05 9.394c-.783-.57-.38-1.81.588-1.81h4.175a1 1 0 00.95-.69l1.286-3.967z"/></svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500">10 Feb, 2023</span>
                  </div>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore. Lorem Ipsum Dolor Sit Amet, Consectetur Adipisicing Elit, Sed Do Eiusmod Tempor Incididunt Ut Labore. Lorem Ipsum Dolor Sit Amet.
                  </p>
                  <div className="flex items-center space-x-3 mt-auto">
                    <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="Sherl" className="w-12 h-12 rounded-full object-cover border-2 border-white shadow" />
                    <div>
                      <h4 className="font-semibold text-gray-900">Sherl</h4>
                      <p className="text-sm text-gray-600">CEO Company</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-center mt-12">
                <Button
                  className="bg-white hover:bg-gray-50 text-teal-600 border-2 border-teal-600 px-8 py-3 rounded-full text-lg font-medium transition-colors"
                  onClick={() => document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" })}
                >
                  Quiero Contactarme
                </Button>
              </div>
            </div>
          </div>
        </section>  */}

        {/* Contact Section */}
        <section id="contacto" className="relative z-10 py-24 bg-contact-gradient flex items-center justify-center min-h-[700px]">
          <div className="w-full max-w-6xl mx-auto px-4 md:px-6">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 flex flex-col lg:flex-row gap-12 items-stretch">
              <div className="space-y-8 w-full">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                    <div className="bg-teal-100 p-3 rounded-full">
                      <Phone className="h-6 w-6 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Teléfono</h3>
                      <p className="text-gray-600">{contactInfo.telefono}</p>
                      <p className="text-sm text-gray-500">{contactInfo.horarios}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                    <div className="bg-blue-100 p-3 rounded-full">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Email</h3>
                      <p className="text-gray-600">{contactInfo.email}</p>
                      <p className="text-sm text-gray-500">{contactInfo.tiempoRespuesta}</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4 p-6 bg-gray-50 rounded-xl">
                    <div className="bg-green-100 p-3 rounded-full">
                      <MapPin className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">Oficina</h3>
                      <p className="text-gray-600">{contactInfo.direccion}</p>
                      <p className="text-sm text-gray-500">{contactInfo.atencionPresencial}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex items-center justify-center">
                <Card className="shadow-xl border-0 w-full">
                  <CardHeader>
                    <CardTitle className="text-2xl">Solicitar Consulta</CardTitle>
                    <CardDescription className="text-base">
                      Completa el formulario y nos pondremos en contacto contigo
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form className="space-y-6">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                          <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                            Nombre *
                          </label>
                          <Input id="nombre" placeholder="Tu nombre completo" className="h-12" />
                        </div>
                        <div className="space-y-2">
                          <label htmlFor="empresa" className="text-sm font-medium text-gray-700">
                            Empresa *
                          </label>
                          <Input id="empresa" placeholder="Nombre de la empresa" className="h-12" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="text-sm font-medium text-gray-700">
                          Email *
                        </label>
                        <Input id="email" type="email" placeholder="tu@email.com" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                          Teléfono
                        </label>
                        <Input id="telefono" placeholder="+54 11 1234-5678" className="h-12" />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="mensaje" className="text-sm font-medium text-gray-700">
                          Mensaje *
                        </label>
                        <Textarea
                          id="mensaje"
                          placeholder="Cuéntanos sobre tus necesidades de seguridad e higiene..."
                          rows={4}
                          className="resize-none"
                        />
                      </div>
                      <Button
                        type="submit"
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-lg rounded-full"
                      >
                        Enviar Consulta
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-gray-900 text-center text-white py-12">
        <p>&copy; {new Date().getFullYear()} Prevención HS. Todos los derechos reservados.</p>
      </footer>
    </div>
  )
}
