import React from 'react'
import emailjs from "@emailjs/browser"
import { useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Phone, Mail, MapPin } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/styles/logo_slider.css";

const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

const Contacto = () => {
    const contactInfo = {
        telefono: "+54 11 4029-6806",
        email: "hspablososa@gmail.com",
        direccion: "Buenos Aires, Argentina",
        horarios: "Lunes a Viernes 9:00 - 18:00",
        tiempoRespuesta: "Respuesta en 24 horas",
        atencionPresencial: "Atención presencial con cita previa",
    }
    
    const form = useRef<HTMLFormElement>(null)

    const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault()
    
      if (!form.current) return
    
      emailjs.sendForm(
        serviceId,
        templateId,
        form.current,
        publicKey
      ).then(
        () => {
          alert('Mensaje enviado correctamente')
          form.current?.reset()
        },
        (error) => {
          alert('Ocurrió un error al enviar el mensaje')
          console.error(error)
        }
      )
    }   
    return (
        <div className="w-full max-w-6xl mx-auto px-2 sm:px-4 md:px-6">
            <div className="bg-white rounded-2xl shadow-2xl p-2 sm:p-4 md:p-8 lg:p-12 flex flex-col lg:flex-row gap-4 sm:gap-8 lg:gap-12 items-stretch">
                <div className="space-y-4 sm:space-y-8 w-full">
                    <div className="space-y-3 sm:space-y-6">
                        <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-6 bg-gray-50 rounded-xl">
                            <div className="bg-teal-100 p-2 sm:p-3 rounded-full">
                                <Phone className="h-6 w-6 text-teal-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Teléfono</h3>
                                <p className="text-gray-600">{contactInfo.telefono}</p>
                                <p className="text-sm text-gray-500">{contactInfo.horarios}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-6 bg-gray-50 rounded-xl">
                            <div className="bg-blue-100 p-2 sm:p-3 rounded-full">
                                <Mail className="h-6 w-6 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Email</h3>
                                <p className="text-gray-600">{contactInfo.email}</p>
                                <p className="text-sm text-gray-500">{contactInfo.tiempoRespuesta}</p>
                            </div>
                        </div>

                        <div className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-6 bg-gray-50 rounded-xl">
                            <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                                <MapPin className="h-6 w-6 text-green-600" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Oficina</h3>
                                <p className="text-gray-600">{contactInfo.direccion}</p>
                                <p className="text-sm text-gray-500">{contactInfo.atencionPresencial}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="w-full flex items-center justify-center">
                    <Card className="shadow-xl border-0 w-full">
                        <CardHeader>
                            <CardTitle className="text-xl sm:text-2xl">Solicitar Consulta</CardTitle>
                            <CardDescription className="text-base">
                                Completa el formulario y nos pondremos en contacto contigo
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form ref={form}  onSubmit={sendEmail} className="space-y-4 sm:space-y-6">
                                <div className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                                    <div className="space-y-2">
                                        <label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                                            Nombre *
                                        </label>
                                        <Input id="nombre" placeholder="Tu nombre completo" className="h-10 sm:h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="empresa" className="text-sm font-medium text-gray-700">
                                            Empresa *
                                        </label>
                                        <Input id="empresa" placeholder="Nombre de la empresa" className="h-10 sm:h-12" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="email" className="text-sm font-medium text-gray-700">
                                        Email *
                                    </label>
                                    <Input id="email" type="email" placeholder="tu@email.com" className="h-10 sm:h-12" />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                                        Teléfono
                                    </label>
                                    <Input id="telefono" placeholder="+54 11 1234-5678" className="h-10 sm:h-12" />
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
    )
}

export { Contacto }
