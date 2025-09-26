"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Plus, Edit, Trash2, Package, Star, Save, RefreshCw } from "lucide-react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image?: string
}

interface ProductManagerProps {
  storeId: "burger" | "sushi"
}

export function ProductManager({ storeId }: ProductManagerProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const { toast } = useToast()

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
  })

  useEffect(() => {
    loadProducts()
  }, [storeId])

  const loadProducts = () => {
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
      toast({
        title: "Erro",
        description: "Erro ao carregar produtos. Tente recarregar a página.",
        variant: "destructive",
      })
    }
  }

  const handleSaveProduct = async () => {
    setIsSaving(true)
    setSaveSuccess(false)

    try {
      if (!formData.name.trim()) {
        throw new Error("Nome do produto é obrigatório")
      }
      if (!formData.description.trim()) {
        throw new Error("Descrição é obrigatória")
      }
      if (!formData.price || Number.parseFloat(formData.price) <= 0) {
        throw new Error("Preço deve ser maior que zero")
      }
      if (!formData.category.trim()) {
        throw new Error("Categoria é obrigatória")
      }

      const productId = editingProduct?.id || `${storeId}-${Date.now()}`

      const productData: Product = {
        id: productId,
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number.parseFloat(formData.price),
        category: formData.category.trim(),
        image: formData.image.trim() || "/default-food-image.jpg",
      }

      console.log("[v0] Product data to save:", productData)

      let updatedProducts: Product[]
      if (editingProduct) {
        updatedProducts = products.map((p) => (p.id === editingProduct.id ? productData : p))
      } else {
        updatedProducts = [...products, productData]
      }

      localStorage.setItem(`products_${storeId}`, JSON.stringify(updatedProducts))
      setProducts(updatedProducts)

      console.log("[v0] Product saved successfully")
      setSaveSuccess(true)

      toast({
        title: "Sucesso",
        description: editingProduct ? "Produto atualizado com sucesso!" : "Produto criado com sucesso!",
      })

      // Reset form after successful save
      setTimeout(() => {
        resetForm()
      }, 1500)
    } catch (error) {
      console.error("[v0] Error saving product:", error)
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido ao salvar produto"
      toast({
        title: "Erro ao salvar",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      image: "",
    })
    setEditingProduct(null)
    setIsDialogOpen(false)
    setSaveSuccess(false)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleSaveProduct()
  }

  const handleEdit = (product: Product) => {
    console.log("[v0] Editing product:", product.name)
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image || "",
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (productId: string) => {
    if (confirm("Tem certeza que deseja excluir este produto?")) {
      try {
        const updatedProducts = products.filter((p) => p.id !== productId)
        setProducts(updatedProducts)
        localStorage.setItem(`products_${storeId}`, JSON.stringify(updatedProducts))

        toast({
          title: "Sucesso",
          description: "Produto excluído com sucesso!",
        })
      } catch (error) {
        console.error("[v0] Error deleting product:", error)
        toast({
          title: "Erro",
          description: "Erro ao excluir produto. Tente novamente.",
          variant: "destructive",
        })
      }
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Gerenciar Produtos</h2>
          <p className="text-muted-foreground">
            {products.length} produtos - {storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Novo Produto
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingProduct ? "Editar Produto" : "Novo Produto"}</DialogTitle>
              <DialogDescription>
                {editingProduct ? "Atualize as informações do produto." : "Adicione um novo produto ao cardápio."}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Nome do Produto</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                  required
                  placeholder="Ex: Burger Clássico"
                />
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                  required
                  placeholder="Descreva os ingredientes e características"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Preço (R$)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData((prev) => ({ ...prev, price: e.target.value }))}
                    required
                    placeholder="0.00"
                  />
                </div>

                <div>
                  <Label htmlFor="category">Categoria</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    required
                    placeholder="Ex: Hambúrgueres"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <Label>Imagem do Produto</Label>

                {formData.image && (
                  <div className="aspect-[4/3] w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                    <img
                      src={formData.image || "/default-food-image.jpg"}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = "/default-food-image.jpg"
                      }}
                    />
                  </div>
                )}

                <div>
                  <Label htmlFor="imageUrl">URL da imagem</Label>
                  <Input
                    id="imageUrl"
                    value={formData.image}
                    onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
                    placeholder="https://exemplo.com/imagem.jpg (opcional - deixe vazio para usar imagem padrão)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Dica: Use serviços como Imgur, Google Drive ou qualquer URL de imagem pública
                  </p>
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="submit"
                  className={`flex-1 transition-all duration-200 ${
                    saveSuccess ? "bg-green-500 hover:bg-green-600" : "bg-teal-500 hover:bg-teal-600"
                  } text-white`}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Salvando...
                    </>
                  ) : saveSuccess ? (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Salvo com Sucesso!
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      {editingProduct ? "Salvar e Atualizar" : "Salvar Produto"}
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={resetForm} disabled={isSaving}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <div className="aspect-[4/3] relative overflow-hidden bg-gray-100">
              <img
                src={product.image || "/default-food-image.jpg"}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-200 hover:scale-105"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  if (target.src !== "/default-food-image.jpg") {
                    target.src = "/default-food-image.jpg"
                  }
                }}
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded-full text-xs flex items-center gap-1">
                <Star className="w-3 h-3" />
                4.8
              </div>
            </div>

            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg leading-tight truncate">{product.name}</CardTitle>
                  <CardDescription className="text-sm mt-1 line-clamp-2">{product.description}</CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  {product.category}
                </Badge>
              </div>
            </CardHeader>

            <CardContent>
              <div className="flex items-center justify-between mb-3">
                <div className="text-xl font-bold text-teal-600">R$ {product.price.toFixed(2).replace(".", ",")}</div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(product)}
                  className="flex-1 hover:bg-teal-50 hover:border-teal-300 transition-colors"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Editar
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="px-3 text-red-500 hover:text-red-700 hover:bg-red-50 hover:border-red-300 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {products.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Nenhum produto encontrado</h3>
            <p className="text-muted-foreground mb-4">
              Ainda não há produtos cadastrados para {storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}.
            </p>
            <Button onClick={() => setIsDialogOpen(true)} className="bg-teal-500 hover:bg-teal-600 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Primeiro Produto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
