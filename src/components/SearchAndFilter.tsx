import React, { useState } from 'react';

// Tipos para las props del componente
interface SearchAndFilterProps {
  onSearchChange: (searchTerm: string) => void;
  onCategoryChange: (category: string) => void;
  categories: string[];
  selectedCategory: string;
  searchTerm: string;
  hasResults?: boolean; // Nueva prop para saber si hay resultados
  totalResults?: number; // Nueva prop para mostrar cantidad de resultados
}

// Componente principal de búsqueda y filtros
const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  onSearchChange,
  onCategoryChange,
  categories,
  selectedCategory,
  searchTerm,
  hasResults = true,
  totalResults = 0
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
            {/* Input de búsqueda */}
            <input
              type="text"
              placeholder="Buscar publicaciones..."
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
                ×
              </button>
            )}
          </div>
        </div>

        {/* Select de categorías */}
        <div className="category-select-container">
          <div className="category-select-wrapper">
            {/* Select de categorías */}
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="category-select"
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
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
        {(searchTerm || selectedCategory) && hasResults && totalResults > 0 && (
          <span className="results-count-text">
            {totalResults} resultado{totalResults !== 1 ? 's' : ''} encontrado{totalResults !== 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Mensaje de no resultados */}
      {(searchTerm || selectedCategory) && !hasResults && (
        <div className="no-results-container">
          <div className="no-results-message">
            <h3>No se encontraron resultados</h3>
            <p>
              {searchTerm && selectedCategory 
                ? `No hay publicaciones que coincidan con "${searchTerm}" en la categoría "${selectedCategory}"`
                : searchTerm
                ? `No hay publicaciones que coincidan con "${searchTerm}"`
                : `No hay publicaciones en la categoría "${selectedCategory}"`
              }
            </p>
            <div className="no-results-suggestions">
              <h4>Sugerencias:</h4>
              <ul>
                <li>Verifica la ortografía de las palabras</li>
                <li>Intenta con términos más generales</li>
                <li>Prueba con una categoría diferente</li>
                {(searchTerm || selectedCategory) && (
                  <li>
                    <button 
                      onClick={() => {
                        onSearchChange('');
                        onCategoryChange('');
                      }}
                      className="clear-filters-btn"
                    >
                      Limpiar todos los filtros
                    </button>
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAndFilter;