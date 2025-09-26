export type Product = {
  id: string
  storeId: "burger" | "sushi"
  name: string
  description: string
  price: number
  category: string
  imageRef?: string // blob em IndexedDB
  imageUrl?: string // opcional (externa)
  updatedAt: number
}

export type ProductMetadata = Product

export interface ImageData {
  blob: Blob
  mime: string
  width: number
  height: number
  size: number
  createdAt: number
}
