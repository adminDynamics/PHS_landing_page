import React from 'react'
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/styles/logo_slider.css";

const Footer = () => {
  return (
      <footer className="relative z-10 bg-gray-900 text-center text-white py-12">
        <p>&copy; {new Date().getFullYear()} Prevención HS. Todos los derechos reservados.</p>
      </footer>
  )
}

export {Footer} 