interface ImageBlob {
  blob: Blob
  mime: string
  size: number
  width: number
  height: number
  createdAt: number
}

class ImageStorageManager {
  private dbName = "delivery_media"
  private storeName = "images"
  private db: IDBDatabase | null = null

  async init(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName)
        }
      }
    })
  }

  async setImage(imageRef: string, imageData: ImageBlob): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)
      const request = store.put(imageData, imageRef)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getImage(imageRef: string): Promise<ImageBlob | null> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly")
      const store = transaction.objectStore(this.storeName)
      const request = store.get(imageRef)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result || null)
    })
  }

  async deleteImage(imageRef: string): Promise<void> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readwrite")
      const store = transaction.objectStore(this.storeName)
      const request = store.delete(imageRef)

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve()
    })
  }

  async getAllKeys(): Promise<string[]> {
    if (!this.db) await this.init()

    return new Promise((resolve, reject) => {
      const transaction = this.db!.transaction([this.storeName], "readonly")
      const store = transaction.objectStore(this.storeName)
      const request = store.getAllKeys()

      request.onerror = () => reject(request.error)
      request.onsuccess = () => resolve(request.result as string[])
    })
  }
}

export const imageStorage = new ImageStorageManager()

// Image compression utility
export async function compressImage(
  file: File,
  options: {
    maxSide: number
    targetMaxBytes: number
    quality?: number
  },
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()

    img.onload = () => {
      try {
        // Calculate new dimensions
        let { width, height } = img
        const maxSide = options.maxSide

        if (width > maxSide || height > maxSide) {
          if (width > height) {
            height = (height * maxSide) / width
            width = maxSide
          } else {
            width = (width * maxSide) / height
            height = maxSide
          }
        }

        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx!.drawImage(img, 0, 0, width, height)

        const tryCompress = (quality: number) => {
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error("Failed to compress image"))
                return
              }

              if (blob.size <= options.targetMaxBytes || quality <= 0.1) {
                resolve(blob)
              } else {
                // Try with lower quality
                tryCompress(quality - 0.1)
              }
            },
            file.type === "image/png" ? "image/jpeg" : file.type,
            quality,
          )
        }

        tryCompress(options.quality || 0.8)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}

// Get image dimensions
export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve({ width: img.width, height: img.height })
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = URL.createObjectURL(file)
  })
}
