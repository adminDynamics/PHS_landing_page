import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "PHS - Prevención Higiene y Seguridad",
  description: "Consultora especializada en seguridad, higiene y protección ambiental",
  icons: {
    icon: "/images/phs-logo-main.png",
    shortcut: "/images/phs-logo-main.png",
    apple: "/images/phs-logo-main.png",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
