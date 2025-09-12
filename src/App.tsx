import { useState, useEffect, useCallback, useRef } from 'react'
import VirtualizedFeed from './components/InfiniteFeed'
import SearchAndFilter from './components/SearchAndFilter'

function App() {
  // Estado para la búsqueda y filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  
  // Categorías de ejemplo para el marketplace
  const categories = [
    'Electrónicos',
    'Libros y Materiales',
    'Ropa y Accesorios',
    'Deportes',
    'Hogar y Jardín',
    'Vehículos',
    'Servicios'
  ];

  // Manejadores de eventos
  const handleSearchChange = useCallback((newSearchTerm: string) => {
    setSearchTerm(newSearchTerm);
    // Aquí se podría implementar debounce para optimizar las búsquedas
  }, []);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setSelectedCategory(newCategory);
    // Aquí se aplicaría el filtro por categoría
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Marketplace UCT</h1>
          <p className="text-gray-600">Feed optimizado con virtualización</p>
        </div>
      </header>
      
      {/* Componente de búsqueda y filtros */}
      <SearchAndFilter
        searchTerm={searchTerm}
        selectedCategory={selectedCategory}
        categories={categories}
        onSearchChange={handleSearchChange}
        onCategoryChange={handleCategoryChange}
      />
      
      <main>
        <VirtualizedFeed />
      </main>
    </div>
  )
}

export default App