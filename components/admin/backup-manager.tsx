"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Download, Upload, Database, AlertTriangle } from "lucide-react"

interface BackupManagerProps {
  storeId: "burger" | "sushi"
}

export function BackupManager({ storeId }: BackupManagerProps) {
  const [importData, setImportData] = useState("")

  const exportData = () => {
    const products = JSON.parse(localStorage.getItem(`products_${storeId}`) || "[]")
    const combos = JSON.parse(localStorage.getItem(`combos_${storeId}`) || "[]")
    const orders = JSON.parse(localStorage.getItem(`orders_${storeId}`) || "[]")
    const clients = JSON.parse(localStorage.getItem(`clients_${storeId}`) || "[]")
    const settings = JSON.parse(localStorage.getItem(`settings_${storeId}`) || "{}")

    const backupData = {
      storeId,
      timestamp: new Date().toISOString(),
      data: {
        products,
        combos,
        orders,
        clients,
        settings,
      },
    }

    const dataStr = JSON.stringify(backupData, null, 2)
    const dataBlob = new Blob([dataStr], { type: "application/json" })
    const url = URL.createObjectURL(dataBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = `backup_${storeId}_${new Date().toISOString().split("T")[0]}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const importDataFromFile = () => {
    try {
      const backupData = JSON.parse(importData)

      if (!backupData.data || backupData.storeId !== storeId) {
        alert("Arquivo de backup inválido ou de loja diferente!")
        return
      }

      if (
        confirm(
          `Tem certeza que deseja importar os dados? Isso substituirá todos os dados atuais do ${storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}.`,
        )
      ) {
        // Import all data
        if (backupData.data.products) {
          localStorage.setItem(`products_${storeId}`, JSON.stringify(backupData.data.products))
        }
        if (backupData.data.combos) {
          localStorage.setItem(`combos_${storeId}`, JSON.stringify(backupData.data.combos))
        }
        if (backupData.data.orders) {
          localStorage.setItem(`orders_${storeId}`, JSON.stringify(backupData.data.orders))
        }
        if (backupData.data.clients) {
          localStorage.setItem(`clients_${storeId}`, JSON.stringify(backupData.data.clients))
        }
        if (backupData.data.settings) {
          localStorage.setItem(`settings_${storeId}`, JSON.stringify(backupData.data.settings))
        }

        alert("Dados importados com sucesso! Recarregue a página para ver as alterações.")
        setImportData("")
      }
    } catch (error) {
      alert("Erro ao importar dados. Verifique se o arquivo JSON está válido.")
    }
  }

  const clearAllData = () => {
    if (
      confirm(
        `ATENÇÃO: Tem certeza que deseja apagar TODOS os dados do ${storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}? Esta ação não pode ser desfeita!`,
      )
    ) {
      if (confirm("Esta é sua última chance! Confirma que deseja apagar todos os dados?")) {
        localStorage.removeItem(`products_${storeId}`)
        localStorage.removeItem(`combos_${storeId}`)
        localStorage.removeItem(`orders_${storeId}`)
        localStorage.removeItem(`clients_${storeId}`)
        localStorage.removeItem(`settings_${storeId}`)

        alert("Todos os dados foram apagados! Recarregue a página.")
      }
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Backup e Restauração</h2>
        <p className="text-muted-foreground">
          Exporte e importe dados do {storeId === "burger" ? "Burger Raiz" : "Hot Sushi"}
        </p>
      </div>

      <div className="grid gap-6">
        {/* Export Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5" />
              Exportar Dados
            </CardTitle>
            <CardDescription>
              Baixe um arquivo JSON com todos os dados da loja (produtos, pedidos, clientes, configurações)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={exportData} className="w-full bg-teal-500 hover:bg-teal-600 text-white">
              <Download className="w-4 h-4 mr-2" />
              Exportar Backup
            </Button>
          </CardContent>
        </Card>

        {/* Import Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5" />
              Importar Dados
            </CardTitle>
            <CardDescription>Cole o conteúdo de um arquivo de backup JSON para restaurar os dados</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="import-data">Conteúdo do Backup JSON</Label>
              <textarea
                id="import-data"
                value={importData}
                onChange={(e) => setImportData(e.target.value)}
                placeholder="Cole aqui o conteúdo do arquivo JSON..."
                className="w-full h-32 p-3 border border-border rounded-md resize-none"
              />
            </div>
            <Button
              onClick={importDataFromFile}
              disabled={!importData.trim()}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white"
            >
              <Upload className="w-4 h-4 mr-2" />
              Importar Dados
            </Button>
          </CardContent>
        </Card>

        {/* Clear Data */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="w-5 h-5" />
              Zona de Perigo
            </CardTitle>
            <CardDescription>Ações irreversíveis que podem causar perda de dados</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={clearAllData} variant="destructive" className="w-full">
              <Database className="w-4 h-4 mr-2" />
              Apagar Todos os Dados
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
