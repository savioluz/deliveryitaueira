"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Brand } from "@/app/page"

interface BrandSelectorProps {
  selectedBrand: Brand
  onBrandChange: (brand: Brand) => void
}

export function BrandSelector({ selectedBrand, onBrandChange }: BrandSelectorProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          selectedBrand === "burger" ? "ring-2 ring-teal-500 bg-teal-500/5" : "hover:bg-muted/50"
        }`}
        onClick={() => onBrandChange("burger")}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🍔</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Itaueira Burger Raiz</h3>
                <p className="text-sm text-muted-foreground">Hambúrgueres artesanais</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Entrega 30-40min
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ⭐ 4.8
                  </Badge>
                </div>
              </div>
            </div>
            {selectedBrand === "burger" && (
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card
        className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
          selectedBrand === "sushi" ? "ring-2 ring-teal-500 bg-teal-500/5" : "hover:bg-muted/50"
        }`}
        onClick={() => onBrandChange("sushi")}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-2xl">🍣</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">Itaueira Hot Sushi</h3>
                <p className="text-sm text-muted-foreground">Sushi fresco e saboroso</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary" className="text-xs">
                    Entrega 35-45min
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    ⭐ 4.9
                  </Badge>
                </div>
              </div>
            </div>
            {selectedBrand === "sushi" && (
              <div className="w-6 h-6 bg-teal-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
