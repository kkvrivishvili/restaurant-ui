'use client'

import { useState, useEffect, useCallback } from 'react'
import supabase from '@/utils/supabase'
import { type Database } from '@/types/supabase'
import { toast } from '@/components/ui/use-toast'

export type Product = Database['public']['Tables']['products']['Row'] & {
  category?: Database['public']['Tables']['categories']['Row']
  product_details?: Database['public']['Tables']['product_details']['Row']
  product_tags?: Array<Database['public']['Tables']['product_tags']['Row']>
}

export type Category = Database['public']['Tables']['categories']['Row']

export type Filters = {
  search: string
  category: string
  minPrice: number
  maxPrice: number
  isGlutenFree: boolean
  isDairyFree: boolean
  isVegan: boolean
  nutritional: {
    minCalories: number
    maxCalories: number
    minProtein: number
    maxProtein: number
    minCarbs: number
    maxCarbs: number
  }
}

export function useStore() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Cargar categorías
  const loadCategories = useCallback(async () => {
    try {
      console.log(' Cargando categorías...')
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true })
        .eq('is_active', true)

      if (error) throw error

      console.log(' Categorías cargadas:', data)
      setCategories(data)
      return true
    } catch (error) {
      console.error(' Error loading categories:', error)
      setError('Error al cargar las categorías')
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las categorías',
        variant: 'destructive',
      })
      return false
    }
  }, [])

  // Cargar productos con filtros
  const loadProducts = useCallback(async (filters?: Partial<Filters>) => {
    try {
      console.log(' Cargando productos con filtros:', filters)
      setLoading(true)
      setError(null)

      let query = supabase
        .from('products')
        .select(`
          *,
          category:categories(*),
          product_details(*),
          product_tags(*)
        `)
        .eq('is_active', true)

      // Aplicar filtros
      if (filters) {
        if (filters.category && filters.category !== 'all') {
          query = query.eq('category_id', filters.category)
        }

        if (filters.search) {
          query = query.ilike('title', `%${filters.search}%`)
        }

        if (filters.minPrice !== undefined) {
          query = query.gte('price', filters.minPrice)
        }

        if (filters.maxPrice !== undefined) {
          query = query.lte('price', filters.maxPrice)
        }
      }

      console.log(' Enviando consulta a Supabase...')
      const { data, error } = await query

      if (error) {
        console.error(' Error de Supabase:', error)
        throw error
      }

      if (!data) {
        console.log(' No se encontraron productos')
        setProducts([])
        return
      }

      console.log(' Datos recibidos de Supabase:', data)
      let filteredProducts = data as Product[]

      // Aplicar filtros adicionales que requieren procesamiento de JSON
      if (filters) {
        if (filters.isGlutenFree || filters.isDairyFree || filters.isVegan) {
          filteredProducts = filteredProducts.filter(product => {
            const dietaryInfo = product.product_details?.dietary_info as any
            if (!dietaryInfo) return false

            if (filters.isGlutenFree && !dietaryInfo.isGlutenFree) return false
            if (filters.isDairyFree && !dietaryInfo.isDairyFree) return false
            if (filters.isVegan && !dietaryInfo.isVegan) return false

            return true
          })
        }

        if (filters.nutritional) {
          const { minCalories, maxCalories, minProtein, maxProtein, minCarbs, maxCarbs } = filters.nutritional

          filteredProducts = filteredProducts.filter(product => {
            const nutritionalInfo = product.product_details?.nutritional_info as any
            if (!nutritionalInfo) return false

            if (minCalories && nutritionalInfo.calories < minCalories) return false
            if (maxCalories && nutritionalInfo.calories > maxCalories) return false
            if (minProtein && nutritionalInfo.protein < minProtein) return false
            if (maxProtein && nutritionalInfo.protein > maxProtein) return false
            if (minCarbs && nutritionalInfo.carbs < minCarbs) return false
            if (maxCarbs && nutritionalInfo.carbs > maxCarbs) return false

            return true
          })
        }
      }

      console.log(' Productos filtrados:', filteredProducts)
      setProducts(filteredProducts)
    } catch (error) {
      console.error(' Error loading products:', error)
      setError('Error al cargar los productos')
      toast({
        title: 'Error',
        description: 'No se pudieron cargar los productos',
        variant: 'destructive',
      })
      setProducts([])
    } finally {
      setLoading(false)
    }
  }, [])

  // Cargar datos iniciales
  useEffect(() => {
    const initializeStore = async () => {
      console.log(' Iniciando carga inicial de datos')
      await loadCategories()
      await loadProducts()
    }

    initializeStore()
  }, [loadCategories, loadProducts])

  return {
    products,
    categories,
    loading,
    error,
    loadProducts,
    loadCategories,
  }
}
