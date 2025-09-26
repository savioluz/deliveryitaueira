"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Save, Phone, ImageIcon, Upload, Truck, DollarSign } from "lucide-react"

interface StoreSettingsProps {
  storeId: "burger" | "sushi"
}

const getHardcodedSettings = (storeId: string) => ({
  nome: storeId === "burger" ? "Itaueira Burger Raiz" : "Itaueira Hot Sushi",
  whatsapp: "86999482285", // Fixed WhatsApp number
  heroImage: "",
  deliveryEnabled: true,
  deliveryFee: 4.0, // Fixed delivery fee
  freeDeliveryMinimum: 0,
  quantityPricingEnabled: storeId === "sushi",
  quantityTier1Max: 9,
  quantityTier1Price: 3.5, // Fixed sushi price
  quantityTier2Price: 3.0,
})

export function StoreSettings({ storeId }: StoreSettingsProps) {
  const [settings, setSettings] = useState(getHardcodedSettings(storeId))
  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
    setSettings(getHardcodedSettings(storeId))
    console.log("[v0] Using hardcoded settings for", storeId, "- no localStorage dependency")
  }, [storeId])

  const handleSave = () => {
    console.log("[v0] Settings are hardcoded for", storeId, ":", settings)
    alert(`Configurações do ${storeId === "burger" ? "Burger Raiz" : "Hot Sushi"} são fixas no código!`)
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      alert("Por favor, selecione apenas arquivos de imagem.")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("A imagem deve ter no máximo 5MB.")
      return
    }

    setUploadLoading(true)

    const reader = new FileReader()
    reader.onload = (e) => {
      const base64String = e.target?.result as string
      setSettings((prev) => ({ ...prev, heroImage: base64String }))
      setUploadLoading(false)
    }
    reader.onerror = () => {
      alert("Erro ao carregar a imagem. Tente novamente.")
      setUploadLoading(false)
    }
    reader.readAsDataURL(file)
  }

  const predefinedImages = [
    {
      url: "/itaueira-burger-raiz-logo-updated.png",
      name: "Logo Oficial Burger Raiz",
      suitable: "burger",
    },
    {
      url: "/itaueira-burger-raiz-logo.png",
      name: "Logo Burger Raiz (Alternativa)",
      suitable: "burger",
    },
    {
      url: "/delicious-burger-with-cheese-lettuce-tomato.jpg",
      name: "Burger Clássico",
      suitable: "burger",
    },
    {
      url: "/bacon-cheeseburger-with-caramelized-onions.jpg",
      name: "Bacon Cheeseburger",
      suitable: "burger",
    },
    {
      url: "/burger-restaurant.png",
      name: "Ambiente Burger",
      suitable: "burger",
    },
    {
      url: "/itaueira-hot-sushi-logo.jpeg",
      name: "Logo Oficial Hot Sushi",
      suitable: "sushi",
    },
    {
      url: "/fresh-salmon-sushi-combo-platter.jpg",
      name: "Combo Sushi Salmão",
      suitable: "sushi",
    },
    {
      url: "/assorted-sushi-rolls-with-wasabi-ginger.jpg",
      name: "Sushi Variado",
      suitable: "sushi",
    },
    {
      url: "/bustling-sushi-restaurant.png",
      name: "Ambiente Sushi",
      suitable: "sushi",
    },
  ]

  const relevantImages = predefinedImages.filter((img) => img.suitable === storeId)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Configurações da Loja</h2>
        <p className="text-muted-foreground">
          Configurações fixas do {storeId === "burger" ? "Burger Raiz" : "Hot Sushi"} (hardcoded)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Configurações WhatsApp (Fixas)
          </CardTitle>
          <CardDescription>Número fixo: 86999482285 para receber pedidos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Loja (Fixo)</Label>
            <Input id="nome" value={settings.nome} disabled className="bg-muted" />
          </div>

          <div>
            <Label htmlFor="whatsapp">Número do WhatsApp (Fixo)</Label>
            <Input id="whatsapp" value={settings.whatsapp} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">Número fixo no código: 86999482285</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Taxa de Entrega (Fixa)
          </CardTitle>
          <CardDescription>Taxa fixa de R$ 4,00 sempre cobrada</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="deliveryFee">Taxa de Entrega (R$) - Fixa</Label>
            <Input id="deliveryFee" type="number" value={settings.deliveryFee} disabled className="bg-muted" />
            <p className="text-xs text-muted-foreground mt-1">Taxa fixa no código: R$ 4,00</p>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Configuração fixa:</p>
            <p className="text-sm text-muted-foreground">
              • Taxa de entrega sempre cobrada: R$ {settings.deliveryFee.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </CardContent>
      </Card>

      {storeId === "sushi" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Preços por Quantidade (Fixos)
            </CardTitle>
            <CardDescription>Preços fixos: R$ 3,50 até 9 peças, R$ 3,00 a partir de 10</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-1">Preços fixos no código:</p>
              <p className="text-sm text-muted-foreground">
                • Até {settings.quantityTier1Max} peças: R$ {settings.quantityTier1Price.toFixed(2).replace(".", ",")}{" "}
                cada
              </p>
              <p className="text-sm text-muted-foreground">
                • A partir de {settings.quantityTier1Max + 1} peças: R${" "}
                {settings.quantityTier2Price.toFixed(2).replace(".", ",")} cada
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="w-5 h-5" />
            Imagem da Tela Principal
          </CardTitle>
          <CardDescription>Configure a imagem de destaque da página principal</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Upload de Imagem</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploadLoading}
                className="flex-1"
              />
              <Button
                onClick={() => document.querySelector('input[type="file"]')?.click()}
                disabled={uploadLoading}
                variant="outline"
                size="sm"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploadLoading ? "Carregando..." : "Escolher"}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">Formatos aceitos: JPG, PNG, GIF. Tamanho máximo: 5MB</p>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Ou</span>
            </div>
          </div>

          <div>
            <Label htmlFor="heroImage">URL da Imagem</Label>
            <Input
              id="heroImage"
              value={settings.heroImage}
              onChange={(e) => setSettings((prev) => ({ ...prev, heroImage: e.target.value }))}
              placeholder="https://exemplo.com/imagem.jpg ou /caminho/para/imagem.jpg"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Cole a URL de uma imagem ou deixe vazio para usar o gradiente padrão
            </p>
          </div>

          {/* Preview da imagem atual */}
          {settings.heroImage && (
            <div className="space-y-2">
              <Label>Preview da Imagem</Label>
              <div className="w-full h-32 rounded-lg overflow-hidden border">
                <img
                  src={settings.heroImage || "/placeholder.svg"}
                  alt="Preview da imagem principal"
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = "/erro-carregar-imagem.png"
                  }}
                />
              </div>
            </div>
          )}

          {/* Imagens pré-definidas */}
          <div className="space-y-2">
            <Label>Ou escolha uma imagem pré-definida:</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {relevantImages.map((image, index) => (
                <div
                  key={index}
                  className={`cursor-pointer border-2 rounded-lg overflow-hidden transition-all ${
                    settings.heroImage === image.url
                      ? "border-teal-500 ring-2 ring-teal-500/20"
                      : "border-border hover:border-teal-300"
                  }`}
                  onClick={() => setSettings((prev) => ({ ...prev, heroImage: image.url }))}
                >
                  <img src={image.url || "/placeholder.svg"} alt={image.name} className="w-full h-20 object-cover" />
                  <div className="p-2 text-center">
                    <p className="text-xs font-medium">{image.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={() => setSettings((prev) => ({ ...prev, heroImage: "" }))}
            variant="outline"
            className="w-full"
          >
            Remover Imagem (usar gradiente padrão)
          </Button>
        </CardContent>
      </Card>

      <Button onClick={handleSave} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
        <Save className="w-4 h-4 mr-2" />
        Configurações são Fixas no Código
      </Button>
    </div>
  )
}
