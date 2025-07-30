import React from 'react'
import { Button } from "@/components/ui/button"

const GoContactoButton = () => {
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

    return (
        <div className="text-center mt-12">
            <Button
                className="bg-white hover:bg-gray-50 text-teal-600 border-2 border-teal-600 px-8 py-3 rounded-full text-lg font-medium transition-colors"
                onClick={() => scrollToElementWithOffset("contacto", -80)}
            >
                Quiero Contactarme
            </Button>
        </div>
    )
}

export {GoContactoButton}