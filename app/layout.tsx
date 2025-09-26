import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Footer } from "@/components/footer"
import "./globals.css"
import { Suspense } from "react"

export const metadata: Metadata = {
  title: "Itaueira Delivery - Burger Raiz & Hot Sushi",
  description: "Sistema de delivery para Itaueira Burger Raiz e Itaueira Hot Sushi",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable} flex flex-col min-h-screen`}>
        <main className="flex-1">
          <Suspense>{children}</Suspense>
        </main>
        <Footer />
      </body>
    </html>
  )
}
