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

  // Simulamos algunos datos de publicaciones para demostrar la funcionalidad
  const mockPosts = [
    { id: 1, title: 'iPhone 13 Pro Max', category: 'Electrónicos', content: 'Vendo iPhone en excelente estado' },
    { id: 2, title: 'Libro de Matemáticas', category: 'Libros y Materiales', content: 'Libro universitario de cálculo' },
    { id: 3, title: 'Zapatillas Nike', category: 'Ropa y Accesorios', content: 'Zapatillas deportivas nuevas' },
    { id: 4, title: 'Bicicleta de montaña', category: 'Deportes', content: 'Bicicleta en perfecto estado' },
    { id: 5, title: 'Sofá cama', category: 'Hogar y Jardín', content: 'Sofá cama muy cómodo' },
  ];

  // Función para filtrar publicaciones basada en búsqueda y categoría
  const getFilteredPosts = useCallback(() => {
    let filtered = mockPosts;

    // Filtrar por categoría
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(post => 
        post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        post.content.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [searchTerm, selectedCategory]);

  // Calcular si hay resultados y cuántos
  const filteredPosts = getFilteredPosts();
  const hasResults = filteredPosts.length > 0;
  const totalResults = filteredPosts.length;

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
        hasResults={hasResults}
        totalResults={totalResults}
      />
      
      <main>
        {/* Solo mostrar el feed si hay resultados o no hay filtros activos */}
        {(hasResults || (!searchTerm && !selectedCategory)) && (
          <VirtualizedFeed />
        )}
      </main>
    </div>
  )
}

export default App