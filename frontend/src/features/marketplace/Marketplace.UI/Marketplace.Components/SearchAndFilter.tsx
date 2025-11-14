import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// Tipos para las props del componente
interface SearchAndFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  onClearFilters?: () => void;
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
  hasResults?: boolean;
  totalResults?: number;
}

// Componente principal de búsqueda y filtros
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearchChange,
  onCategoryChange,
  onClearFilters,
  categories,
  selectedCategory,
  searchTerm,
  hasResults = true,
  totalResults = 0
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(event.target.value);
  };

  return (
    <div className="search-filter-container">
      <div className="search-filter-wrapper">
        
        <div className="search-input-container">
          <div className={`search-input-wrapper ${isSearchFocused ? 'search-input-focused' : ''}`}>
            <input
              type="text"
              placeholder="Buscar por título o descripción..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="search-input"
            />

            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="search-clear-btn"
                type="button"
                title="Limpiar búsqueda"
              >
                ×
              </button>
            )}
          </div>
        </div>

        <div className="category-select-container">
          <div className="category-select-wrapper">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              <option value="">Todas las categorías</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || selectedCategory) && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-200 border border-gray-300"
            type="button"
          >
            Limpiar filtros
          </button>
        )}
      </div>

      <div className="search-info">
        {(searchTerm || selectedCategory) && (
          <>
            {searchTerm && (
              <span className="search-results-text">
                Búsqueda: <strong>"{searchTerm}"</strong>
              </span>
            )}
            {selectedCategory && (
              <span className="category-results-text">
                Categoría: <strong>{selectedCategory}</strong>
              </span>
            )}
            {hasResults && totalResults > 0 && (
              <span className="results-count-text">
                {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
              </span>
            )}
          </>
        )}
        
        {!searchTerm && !selectedCategory && totalResults > 0 && (
          <span className="text-gray-500 text-xs">
            Mostrando {totalResults} publicaciones
          </span>
        )}
      </div>

      {/* Panel de "No hay resultados" eliminado de aquí - solo se muestra abajo en InfiniteFeed */}
    </div>
  );
};

export default SearchAndFilter;