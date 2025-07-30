import React from 'react'

const Clientes = () => {

    const logoImages = [
        { item_id: 1, imagen: "/images/clientes/clientes_1.png" },
        { item_id: 2, imagen: "/images/clientes/clientes_2.png" },
        { item_id: 3, imagen: "/images/clientes/clientes_3.png" },
        { item_id: 3, imagen: "/images/clientes/clientes_4.png" },
    ]
    
    return (
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
    )
}

export { Clientes }