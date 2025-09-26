"use client"

import { useState, useEffect, useRef } from "react"
import { storageManager } from "@/lib/storage"

interface Product {
  imageRef?: string
  imageUrl?: string
  name?: string
  image?: string
}

// Simple in-memory cache for object URLs
const imageCache = new Map<string, string>()

export function useProductImage(product: Product) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const objectUrlRef = useRef<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadImage = async () => {
      try {
        setLoading(true)
        setError(null)

        if (!product) {
          if (isMounted) {
            setImageUrl("/default-food-image.jpg")
            setLoading(false)
          }
          return
        }

        // If product has external URL, use it directly (legacy support)
        if (product.imageUrl || product.image) {
          if (isMounted) {
            setImageUrl(product.imageUrl || product.image || "/default-food-image.jpg")
            setLoading(false)
          }
          return
        }

        // If product has image reference, load from IndexedDB
        if (product.imageRef) {
          // Check cache first
          const cachedUrl = imageCache.get(product.imageRef)
          if (cachedUrl) {
            if (isMounted) {
              setImageUrl(cachedUrl)
              setLoading(false)
            }
            return
          }

          const blob = await storageManager.getImage(product.imageRef)
          if (blob && isMounted) {
            const objectUrl = URL.createObjectURL(blob)
            objectUrlRef.current = objectUrl
            imageCache.set(product.imageRef, objectUrl)
            setImageUrl(objectUrl)
          } else if (isMounted) {
            setImageUrl("/default-food-image.jpg")
          }
        } else if (isMounted) {
          setImageUrl("/default-food-image.jpg")
        }
      } catch (err) {
        console.error("[v0] Error loading product image:", product.name, err)
        if (isMounted) {
          setError("Erro ao carregar imagem")
          setImageUrl("/default-food-image.jpg")
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadImage()

    // Cleanup function
    return () => {
      isMounted = false
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current)
        objectUrlRef.current = null
      }
    }
  }, [product, product?.imageRef, product?.imageUrl, product?.image])

  return { imageUrl, loading, error }
}
