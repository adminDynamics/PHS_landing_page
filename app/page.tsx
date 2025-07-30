"use client"

import { Button } from "@/components/ui/button"
import { Footer } from "@/components/Footer"
import { GoContactoButton } from "@/components/GoContactoButton"
import { Clientes } from "@/components/Clientes"
import { Contacto } from "@/components/Contacto"
import { About } from "@/components/About"
import Link from "next/link"
import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"

import ServicesTabs from "@/components/ServicesTabs"
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "../styles/logo_slider.css";

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
  const heroImage = "/images/hero_1.webp"
  const aboutImage = "/images/about_1.png"
  const logoImage = "/images/logo_phs.png"
  const logoImageBlanco = "/images/logo_phs_blanco.png"
  const logoImageBlancoXL = "/images/logo_phs_blanco_xl.png"


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

            <img src={heroImage} alt="Hero background" className="w-full h-full object-cover" />

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
        
        <section id="nosotros" className="relative z-10 py-24 bg-white overflow-hidden" style={{ marginTop: "100vh" }}
        >
          <About></About>
        </section>

        {/* Company Clients Section - Slider tipo "trusted by" */}
        <section className="relative z-10 py-8 bg-white border-t border-gray-100 overflow-hidden w-full">
          <Clientes></Clientes>
        </section>

        {/* Services Section - New Tabs Component */}
        <div className="relative z-10">
          <ServicesTabs />
        </div>

        <div className="relative z-10 bg-teal-400 h-px w-full"></div>

        {/* Botón que te lleva a contacto */}
        <section className="relative z-10 py-8 bg-white">
          <GoContactoButton></GoContactoButton>
        </section>

        <section id="contacto" className="relative z-10 py-24 bg-contact-gradient flex items-center justify-center min-h-[700px]">
          <Contacto></Contacto>
        </section>
      </main>

      <Footer></Footer>
    </div>
  )
}
