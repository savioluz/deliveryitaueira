"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Save, Phone, ImageIcon, Upload, Truck, DollarSign } from "lucide-react"

interface StoreSettingsProps {
  storeId: "burger" | "sushi"
}

export function StoreSettings({ storeId }: StoreSettingsProps) {
  const [settings, setSettings] = useState({
    nome: storeId === "burger" ? "Itaueira Burger Raiz" : "Itaueira Hot Sushi",
    whatsapp: storeId === "burger" ? "5589999999999" : "5589888888888",
    heroImage: "",
    deliveryEnabled: true,
    deliveryFee: 4.0,
    freeDeliveryMinimum: 0, // Always charge delivery fee
    quantityPricingEnabled: storeId === "sushi",
    quantityTier1Max: 9,
    quantityTier1Price: 3.5,
    quantityTier2Price: 3.0,
  })

  const [uploadLoading, setUploadLoading] = useState(false)

  useEffect(() => {
    const savedSettings = JSON.parse(localStorage.getItem(`settings_${storeId}`) || "{}")
    setSettings({
      nome: savedSettings.nome || (storeId === "burger" ? "Itaueira Burger Raiz" : "Itaueira Hot Sushi"),
      whatsapp: savedSettings.whatsapp || (storeId === "burger" ? "5589999999999" : "5589888888888"),
      heroImage: savedSettings.heroImage || "",
      deliveryEnabled: true,
      deliveryFee: savedSettings.deliveryFee || 4.0,
      freeDeliveryMinimum: 0, // Always charge delivery fee
      quantityPricingEnabled:
        savedSettings.quantityPricingEnabled !== undefined ? savedSettings.quantityPricingEnabled : storeId === "sushi",
      quantityTier1Max: savedSettings.quantityTier1Max || 9,
      quantityTier1Price: savedSettings.quantityTier1Price || 3.5,
      quantityTier2Price: savedSettings.quantityTier2Price || 3.0,
    })
  }, [storeId])

  const handleSave = () => {
    console.log("[v0] Saving settings for", storeId, ":", settings)
    localStorage.setItem(`settings_${storeId}`, JSON.stringify(settings))

    const savedSettings = JSON.parse(localStorage.getItem(`settings_${storeId}`) || "{}")
    console.log("[v0] Settings saved and verified:", savedSettings)

    alert(`Configurações do ${storeId === "burger" ? "Burger Raiz" : "Hot Sushi"} salvas com sucesso!`)
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
          Gerencie as configurações do {storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Phone className="w-5 h-5" />
            Configurações WhatsApp
          </CardTitle>
          <CardDescription>Configure o número do WhatsApp para receber pedidos</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="nome">Nome da Loja</Label>
            <Input
              id="nome"
              value={settings.nome}
              onChange={(e) => setSettings((prev) => ({ ...prev, nome: e.target.value }))}
              placeholder="Nome da loja"
            />
          </div>

          <div>
            <Label htmlFor="whatsapp">Número do WhatsApp</Label>
            <Input
              id="whatsapp"
              value={settings.whatsapp}
              onChange={(e) => setSettings((prev) => ({ ...prev, whatsapp: e.target.value }))}
              placeholder="5589999999999"
              helperText="Formato: código do país + DDD + número (ex: 5589999999999)"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Formato: código do país + DDD + número (ex: 5589999999999)
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Truck className="w-5 h-5" />
            Taxa de Entrega
          </CardTitle>
          <CardDescription>Configure o valor da taxa de entrega (sempre cobrada)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="deliveryFee">Taxa de Entrega (R$)</Label>
            <Input
              id="deliveryFee"
              type="number"
              step="0.50"
              min="0"
              value={settings.deliveryFee}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, deliveryFee: Number.parseFloat(e.target.value) || 4.0 }))
              }
              placeholder="4.00"
            />
            <p className="text-xs text-muted-foreground mt-1">Valor da taxa de entrega em reais (padrão: R$ 4,00)</p>
          </div>

          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium mb-1">Configuração atual:</p>
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
              Preços por Quantidade (Sushi)
            </CardTitle>
            <CardDescription>Configure preços diferenciados baseados na quantidade</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Ativar Preços por Quantidade</Label>
                <p className="text-sm text-muted-foreground">Preços diferentes baseados na quantidade de peças</p>
              </div>
              <Switch
                checked={settings.quantityPricingEnabled}
                onCheckedChange={(checked) => setSettings((prev) => ({ ...prev, quantityPricingEnabled: checked }))}
              />
            </div>

            {settings.quantityPricingEnabled && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="quantityTier1Max">Até quantas peças</Label>
                    <Input
                      id="quantityTier1Max"
                      type="number"
                      min="1"
                      value={settings.quantityTier1Max}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, quantityTier1Max: Number.parseInt(e.target.value) || 1 }))
                      }
                      placeholder="9"
                    />
                  </div>
                  <div>
                    <Label htmlFor="quantityTier1Price">Preço por peça (R$)</Label>
                    <Input
                      id="quantityTier1Price"
                      type="number"
                      step="0.10"
                      min="0"
                      value={settings.quantityTier1Price}
                      onChange={(e) =>
                        setSettings((prev) => ({ ...prev, quantityTier1Price: Number.parseFloat(e.target.value) || 0 }))
                      }
                      placeholder="3.50"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="quantityTier2Price">
                    Preço a partir de {settings.quantityTier1Max + 1} peças (R$)
                  </Label>
                  <Input
                    id="quantityTier2Price"
                    type="number"
                    step="0.10"
                    min="0"
                    value={settings.quantityTier2Price}
                    onChange={(e) =>
                      setSettings((prev) => ({ ...prev, quantityTier2Price: Number.parseFloat(e.target.value) || 0 }))
                    }
                    placeholder="3.00"
                  />
                </div>

                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-sm font-medium mb-1">Exemplo de preços:</p>
                  <p className="text-sm text-muted-foreground">
                    • Até {settings.quantityTier1Max} peças: R${" "}
                    {settings.quantityTier1Price.toFixed(2).replace(".", ",")} cada
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • A partir de {settings.quantityTier1Max + 1} peças: R${" "}
                    {settings.quantityTier2Price.toFixed(2).replace(".", ",")} cada
                  </p>
                </div>
              </>
            )}
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
        Salvar Todas as Configurações
      </Button>
    </div>
  )
}
