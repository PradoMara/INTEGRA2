import React, { useCallback,useState } from 'react'
import { Sidebar } from '@/features/shared/ui/Sidebar'
import SearchAndFilter from './Marketplace.Components/SearchAndFilter'
import InfiniteFeed from './Marketplace.Components/InfiniteFeed'
import Header from '@/features/shared/ui/Header'

// 🛑 SOLUCIÓN: Cambiar la ruta de alias (@/) a la ruta relativa (../)
// Antes: import { useCategories } from '@/features/marketplace/Marketplace.Hooks/useCategories'
// Antes: import { useDebounce } from '@/features/marketplace/Marketplace.Hooks/usePostsWithFilters' 

import { useCategories } from '../Marketplace.Hooks/useCategories' 
import { useDebounce } from '../Marketplace.Hooks/usePostsWithFilters' 

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [feedStats, setFeedStats] = useState<{ hasResults: boolean; totalResults: number }>({ hasResults: true, totalResults: 0 })


  // 1. Obtener categorías reales del backend
  const { categories, isLoading: isLoadingCategories, isError: isCategoriesError } = useCategories(); 

  // 2. Aplicar Debounce
  const debouncedSearchTerm = useDebounce(searchTerm, 500) 

  const handleSearchChange = useCallback((v: string) => setSearchTerm(v), [])
  const handleCategoryChange = useCallback((v: string) => setSelectedCategory(v), [])
  const handleClearFilters = useCallback(() => { setSearchTerm(''); setSelectedCategory('') }, [])
  const handleFeedStatsChange = useCallback((hasResults: boolean, totalResults: number) => setFeedStats({ hasResults, totalResults }), [])
  
  // Manejo de carga de categorías
  // 🛑 IMPORTANTE: Si categories no está listo, se usa un array vacío (por defecto del hook) para no romper el SearchAndFilter
  
  if (isLoadingCategories) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
              <p className="text-gray-600">Cargando filtros de categorías...</p>
          </div>
      )
  }
  
  if (isCategoriesError) {
      // Devolvemos un mensaje de error sin romper la navegación.
      console.error("Error al cargar la lista de categorías:", isCategoriesError);
  }

  return (
    <div className="min-h-screen bg-gray-50 grid grid-cols-1 lg:grid-cols-[260px_1fr]">
      <Sidebar active="marketplace" />

      <div className="min-w-0">
        
        <Header />
        <div className="sticky top-0 z-10 bg-white/70 backdrop-blur border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <SearchAndFilter
              searchTerm={searchTerm} 
              selectedCategory={selectedCategory}
              categories={categories} // ✅ Lista REAL (si no está lista, el hook devuelve [] para no fallar)
              onSearchChange={handleSearchChange}
              onCategoryChange={handleCategoryChange}
              onClearFilters={handleClearFilters}
              hasResults={feedStats.hasResults}
              totalResults={feedStats.totalResults}
            />
          </div>
        </div>

        <main className="py-6">
          <InfiniteFeed
            searchTerm={debouncedSearchTerm} // ✅ Usamos el debounced
            selectedCategoryName={selectedCategory} // ✅ Pasamos el NOMBRE de la categoría
            onStatsChange={handleFeedStatsChange}
          />
        </main>
      </div>
    </div>
  )
}