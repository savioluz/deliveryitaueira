"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Star } from "lucide-react"

import { useProductImage } from "@/hooks/use-product-image"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
  imageRef?: string
}

interface ProductGridProps {
  storeId: "burger" | "sushi"
  onAddToCart: (product: Product) => void
}

export function ProductGrid({ storeId, onAddToCart }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")

  useEffect(() => {
    try {
      const savedProducts = localStorage.getItem(`products_${storeId}`)
      if (savedProducts) {
        const parsedProducts = JSON.parse(savedProducts)
        setProducts(parsedProducts)
      } else {
        setProducts([])
      }
    } catch (error) {
      console.error("[v0] Error loading products:", error)
      setProducts([])
    }
  }, [storeId])

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "all") return true
    return product.category === selectedCategory
  })

  const categories = ["all", ...Array.from(new Set(products.map((p) => p.category)))]

  return (
    <div className="space-y-6">
      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(category)}
            className={`whitespace-nowrap ${
              selectedCategory === category ? "bg-teal-500 hover:bg-teal-600 text-white" : ""
            }`}
          >
            {category === "all" ? "Todos" : category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onAddToCart={onAddToCart} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhum produto encontrado nesta categoria.</p>
        </div>
      )}
    </div>
  )
}

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product) => void }) {
  const { imageUrl, loading } = useProductImage(product)

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer group"
      onClick={() => onAddToCart(product)}
    >
      <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
        {loading ? (
          <div className="w-full h-full bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="text-gray-400">Carregando...</div>
          </div>
        ) : (
          <img
            src={imageUrl || "/default-food-image.jpg"}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              const target = e.target as HTMLImageElement
              if (target.src !== "/default-food-image.jpg") {
                target.src = "/default-food-image.jpg"
              }
            }}
          />
        )}
        <Badge className="absolute top-3 left-3 bg-black/80 text-white border-0">
          <Star className="w-3 h-3 mr-1" />
          4.8
        </Badge>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg leading-tight truncate">{product.name}</CardTitle>
            <CardDescription className="text-sm mt-1 line-clamp-2">{product.description}</CardDescription>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-2">
          <Badge variant="outline" className="text-xs">
            <Clock className="w-3 h-3 mr-1" />
            25min
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {product.category}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-teal-600">R$ {product.price.toFixed(2).replace(".", ",")}</div>
          <div className="bg-teal-500 text-white px-3 py-2 rounded-lg text-sm font-medium group-hover:bg-teal-600 transition-colors duration-200">
            <Plus className="w-4 h-4 inline mr-1" />
            Adicionar
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
