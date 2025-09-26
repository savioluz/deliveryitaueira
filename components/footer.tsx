"use client"

import { Button } from "@/components/ui/button"
import { MessageCircle } from "lucide-react"

export function Footer() {
  const handleWhatsAppClick = () => {
    const whatsappUrl = `https://wa.me/5586999482285?text=Olá! Vi seu trabalho no sistema de delivery e gostaria de conversar.`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <footer className="bg-card border-t border-border mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Desenvolvido por{" "}
              <button
                onClick={handleWhatsAppClick}
                className="text-teal-500 hover:text-teal-600 font-medium underline-offset-4 hover:underline transition-colors"
              >
                Savio Luz
              </button>
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleWhatsAppClick}
              className="p-1 h-auto text-teal-500 hover:text-teal-600"
            >
              <MessageCircle className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
