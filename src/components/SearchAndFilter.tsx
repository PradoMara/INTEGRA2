import React, { useState } from 'react';

// Tipos para las props del componente
interface SearchAndFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
}

// Componente principal de búsqueda y filtros
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearchChange,
  onCategoryChange,
  categories,
  selectedCategory,
  searchTerm
}) => {
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // Manejador para el cambio en la búsqueda
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(event.target.value);
  };

  // Manejador para el cambio de categoría
  const handleCategoryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onCategoryChange(event.target.value);
  };

  return (
    <div className="search-filter-container">
      {/* Contenedor principal de los controles */}
      <div className="search-filter-wrapper">
        
        {/* Barra de búsqueda */}
        <div className="search-input-container">
          <div className={`search-input-wrapper ${isSearchFocused ? 'search-input-focused' : ''}`}>
            {/* Icono de búsqueda */}
            <div className="search-icon">
              <svg 
                className="w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" 
                />
              </svg>
            </div>

            {/* Input de búsqueda */}
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
              className="search-input"
            />

            {/* Botón para limpiar búsqueda */}
            {searchTerm && (
              <button
                onClick={() => onSearchChange('')}
                className="search-clear-btn"
                type="button"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Select de categorías */}
        <div className="category-select-container">
          <div className="category-select-wrapper">
            {/* Icono de categoría */}
            <div className="category-icon">
              <svg 
                className="w-5 h-5 text-gray-400" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" 
                />
              </svg>
            </div>

            {/* Select de categorías */}
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

            {/* Icono de flecha */}
            <div className="category-arrow">
              <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Información de resultados */}
      <div className="search-info">
        {searchTerm && (
          <span className="search-results-text">
            Buscando: <strong>"{searchTerm}"</strong>
          </span>
        )}
        {selectedCategory && (
          <span className="category-results-text">
            Categoría: <strong>{selectedCategory}</strong>
          </span>
        )}
      </div>
    </div>
  );
};

export default SearchAndFilter;