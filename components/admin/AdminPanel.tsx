"use client"
import StudioLayout from "./StudioLayout"

// Configuración de secciones e imágenes
const SECCIONES_CONFIG = {
  hero: {
    title: "Sección Hero",
    description: "Imagen principal de fondo",
    items: [
      { id: 1, title: "Imagen de fondo principal", description: "Imagen que aparece detrás del título principal" },
    ],
  },
  logos: {
    title: "Logos de Empresas",
    description: "Logos que aparecen en la tira de empresas colaboradoras",
    items: [
      { id: 1, title: "Logo Empresa 1", description: "Primer logo en la tira" },
      { id: 2, title: "Logo Empresa 2", description: "Segundo logo en la tira" },
      { id: 3, title: "Logo Empresa 3", description: "Tercer logo en la tira" },
      { id: 4, title: "Logo Empresa 4", description: "Cuarto logo en la tira" },
      { id: 5, title: "Logo Empresa 5", description: "Quinto logo en la tira" },
      { id: 6, title: "Logo Empresa 6", description: "Sexto logo en la tira" },
    ],
  },
  about: {
    title: "Sección Nosotros",
    description: "Imágenes de la sección sobre nosotros",
    items: [{ id: 1, title: "Imagen principal", description: "Imagen que acompaña el texto sobre la empresa" }],
  },
  servicios: {
    title: "Servicios",
    description: "Imágenes relacionadas con los servicios",
    items: [
      { id: 1, title: "Imagen Seguridad Laboral", description: "Imagen para el servicio de seguridad laboral" },
      { id: 2, title: "Imagen Higiene Industrial", description: "Imagen para el servicio de higiene industrial" },
      { id: 3, title: "Imagen Medio Ambiente", description: "Imagen para el servicio de medio ambiente" },
    ],
  },
  novedades: {
    title: "Novedades",
    description: "Imágenes para las noticias y novedades",
    items: [
      { id: 1, title: "Novedad 1", description: "Imagen para la primera novedad" },
      { id: 2, title: "Novedad 2", description: "Imagen para la segunda novedad" },
      { id: 3, title: "Novedad 3", description: "Imagen para la tercera novedad" },
    ],
  },
}

export default function AdminPanel() {
  return <StudioLayout />
}
