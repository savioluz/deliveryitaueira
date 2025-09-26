import type { ProductMetadata, ImageData } from "@/types/product"

class StorageManager {
  private dbName = "delivery_media"
  private dbVersion = 1
  private imageStoreName = "images"
  private dbCache: IDBDatabase | null = null

  // IndexedDB operations with improved error handling
  private async openDB(): Promise<IDBDatabase> {
    if (this.dbCache && this.dbCache.version === this.dbVersion) {
      return this.dbCache
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion)

      request.onerror = () => {
        console.error("[v0] IndexedDB error:", request.error)
        reject(new Error("Falha ao abrir banco de dados de imagens"))
      }

      request.onsuccess = () => {
        this.dbCache = request.result
        resolve(request.result)
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.imageStoreName)) {
          const store = db.createObjectStore(this.imageStoreName, { keyPath: "id" })
          store.createIndex("createdAt", "createdAt", { unique: false })
        }
      }
    })
  }

  async getImage(imageRef: string): Promise<Blob | undefined> {
    if (typeof window === "undefined") return undefined

    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.imageStoreName], "readonly")
      const store = transaction.objectStore(this.imageStoreName)

      return new Promise((resolve, reject) => {
        const request = store.get(imageRef)
        request.onerror = () => {
          console.error("[v0] Error getting image:", request.error)
          resolve(undefined)
        }
        request.onsuccess = () => {
          const result = request.result
          resolve(result ? result.blob : undefined)
        }
      })
    } catch (error) {
      console.error("[v0] Error accessing IndexedDB:", error)
      return undefined
    }
  }

  async setImage(imageRef: string, blob: Blob, meta: Partial<ImageData> = {}): Promise<void> {
    if (typeof window === "undefined") throw new Error("IndexedDB não disponível no servidor")

    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.imageStoreName], "readwrite")
      const store = transaction.objectStore(this.imageStoreName)

      const imageData: ImageData & { id: string } = {
        id: imageRef,
        blob,
        mime: blob.type || "image/jpeg",
        width: meta.width || 0,
        height: meta.height || 0,
        size: blob.size,
        createdAt: Date.now(),
        ...meta,
      }

      return new Promise((resolve, reject) => {
        const request = store.put(imageData)
        request.onerror = () => {
          console.error("[v0] Error saving image:", request.error)
          reject(new Error("Falha ao salvar imagem"))
        }
        request.onsuccess = () => {
          console.log("[v0] Image saved successfully:", imageRef, blob.size, "bytes")
          resolve()
        }
      })
    } catch (error) {
      console.error("[v0] Error saving image to IndexedDB:", error)
      throw new Error("Erro ao salvar imagem: " + error.message)
    }
  }

  async deleteImage(imageRef: string): Promise<void> {
    if (typeof window === "undefined") return

    try {
      const db = await this.openDB()
      const transaction = db.transaction([this.imageStoreName], "readwrite")
      const store = transaction.objectStore(this.imageStoreName)

      return new Promise((resolve) => {
        const request = store.delete(imageRef)
        request.onerror = () => {
          console.error("[v0] Error deleting image:", request.error)
          resolve() // Don't throw on delete errors
        }
        request.onsuccess = () => {
          console.log("[v0] Image deleted:", imageRef)
          resolve()
        }
      })
    } catch (error) {
      console.error("[v0] Error deleting image:", error)
    }
  }

  // localStorage operations with improved quota checking
  estimateLocalStorageBytes(): number {
    if (typeof window === "undefined") return 0

    let total = 0
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const value = localStorage.getItem(key) || ""
          total += (key.length + value.length) * 2 // UTF-16 uses 2 bytes per character
        }
      }
    } catch (error) {
      console.error("[v0] Error estimating localStorage size:", error)
    }
    return total
  }

  private ensureQuotaOrThrow(dataToSave: string): void {
    if (typeof window === "undefined") return

    const currentSize = this.estimateLocalStorageBytes()
    const newDataSize = dataToSave.length * 2
    const maxSize = 4 * 1024 * 1024 // 4MB conservative estimate

    console.log("[v0] Storage check:", {
      current: Math.round(currentSize / 1024) + "KB",
      adding: Math.round(newDataSize / 1024) + "KB",
      max: Math.round(maxSize / 1024) + "KB",
    })

    if (currentSize + newDataSize > maxSize) {
      throw new Error(
        `Espaço do navegador cheio. Atual: ${Math.round(currentSize / 1024)}KB, Máx: ${Math.round(maxSize / 1024)}KB. Imagens ficam no IndexedDB; reduza catálogo ou limpe backups.`,
      )
    }
  }

  getProducts(storeId: string): ProductMetadata[] {
    if (typeof window === "undefined") return []

    try {
      const key = `products_${storeId}`
      const data = localStorage.getItem(key)
      const products = data ? JSON.parse(data) : []

      console.log("[v0] Loaded products:", products.length, "items for", storeId)
      return products
    } catch (error) {
      console.error("[v0] Error getting products:", error)
      return []
    }
  }

  setProducts(storeId: string, products: ProductMetadata[]): void {
    if (typeof window === "undefined") return

    try {
      const key = `products_${storeId}`

      // Remove any base64 data before saving
      const cleanProducts = products.map((product) => {
        const clean = { ...product }
        delete (clean as any).image
        delete (clean as any).imageBase64
        return clean
      })

      const data = JSON.stringify(cleanProducts)

      // Check quota before saving
      this.ensureQuotaOrThrow(data)

      localStorage.setItem(key, data)
      console.log(
        "[v0] Products saved successfully:",
        cleanProducts.length,
        "items,",
        Math.round(data.length / 1024),
        "KB",
      )
    } catch (error) {
      console.error("[v0] Error saving products:", error)
      throw new Error("Erro ao salvar produtos: " + error.message)
    }
  }

  // Enhanced image compression with adaptive quality
  async compressImage(file: File, maxWidth = 1400): Promise<Blob> {
    return new Promise((resolve) => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")!
      const img = new Image()

      img.onload = () => {
        // Calculate new dimensions maintaining aspect ratio
        let { width, height } = img
        if (width > height && width > maxWidth) {
          height = (height * maxWidth) / width
          width = maxWidth
        } else if (height > maxWidth) {
          width = (width * maxWidth) / height
          height = maxWidth
        }

        canvas.width = width
        canvas.height = height

        // Draw image
        ctx.drawImage(img, 0, 0, width, height)

        // Compress with adaptive quality
        const tryCompress = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (blob && (blob.size <= 1.5 * 1024 * 1024 || quality <= 0.3)) {
                console.log("[v0] Image compressed:", {
                  original: Math.round(file.size / 1024) + "KB",
                  compressed: Math.round(blob.size / 1024) + "KB",
                  quality: quality,
                  dimensions: `${width}x${height}`,
                })
                resolve(blob)
              } else if (quality > 0.3) {
                tryCompress(quality - 0.1)
              } else {
                resolve(blob!)
              }
            },
            "image/jpeg",
            quality,
          )
        }

        tryCompress(0.8)
      }

      img.src = URL.createObjectURL(file)
    })
  }

  // Enhanced migration with better error handling
  async migrateOldProducts(storeId: string): Promise<boolean> {
    if (typeof window === "undefined") return false

    try {
      const products = this.getProducts(storeId)
      let migrated = false
      let migratedCount = 0

      for (const product of products) {
        const productAny = product as any

        // Check for old base64 images
        if (productAny.image && (productAny.image.startsWith("data:image/") || productAny.imageBase64)) {
          try {
            console.log("[v0] Migrating product image:", product.name)

            const base64Data = productAny.image || productAny.imageBase64
            const response = await fetch(base64Data)
            const blob = await response.blob()

            // Compress the migrated image
            const compressedBlob = await this.compressImage(new File([blob], "migrated.jpg", { type: blob.type }))

            // Save to IndexedDB
            const imageRef = `${storeId}_p_${product.id}`
            await this.setImage(imageRef, compressedBlob)

            // Update product metadata
            product.imageRef = imageRef
            delete productAny.image
            delete productAny.imageBase64

            migrated = true
            migratedCount++
          } catch (error) {
            console.error("[v0] Error migrating product:", product.name, error)
            // Continue with other products
          }
        }
      }

      if (migrated) {
        this.setProducts(storeId, products)
        console.log("[v0] Migration completed:", migratedCount, "images migrated for", storeId)
      }

      return migrated
    } catch (error) {
      console.error("[v0] Migration error:", error)
      return false
    }
  }

  // Utility to clean orphaned images
  async cleanOrphanedImages(storeId: string): Promise<number> {
    if (typeof window === "undefined") return 0

    try {
      const products = this.getProducts(storeId)
      const usedImageRefs = new Set(products.map((p) => p.imageRef).filter(Boolean))

      const db = await this.openDB()
      const transaction = db.transaction([this.imageStoreName], "readwrite")
      const store = transaction.objectStore(this.imageStoreName)

      return new Promise((resolve) => {
        let deletedCount = 0
        const request = store.openCursor()

        request.onsuccess = (event) => {
          const cursor = (event.target as IDBRequest).result
          if (cursor) {
            const imageRef = cursor.key as string
            if (imageRef.startsWith(`${storeId}_p_`) && !usedImageRefs.has(imageRef)) {
              cursor.delete()
              deletedCount++
              console.log("[v0] Deleted orphaned image:", imageRef)
            }
            cursor.continue()
          } else {
            console.log("[v0] Cleanup completed:", deletedCount, "orphaned images removed")
            resolve(deletedCount)
          }
        }

        request.onerror = () => {
          console.error("[v0] Error during cleanup:", request.error)
          resolve(0)
        }
      })
    } catch (error) {
      console.error("[v0] Error cleaning orphaned images:", error)
      return 0
    }
  }
}

export const storageManager = new StorageManager()
export type { ProductMetadata, ImageData }
