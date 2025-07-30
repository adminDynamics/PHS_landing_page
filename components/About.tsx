import React from 'react'

const About = () => {
    const aboutImage = "/images/about_1.png"

    return (
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
            <div className="w-full h-auto md:h-[500px] lg:h-[600px]">
                <img
                    src={aboutImage}
                    alt="Equipo profesional"
                    className="w-full h-full object-cover rounded-xl shadow-xl"
                />
            </div>
        </div>
    )
}

export { About }
