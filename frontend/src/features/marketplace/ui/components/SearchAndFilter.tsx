import React, { useEffect, useMemo, useRef, useState } from "react";

type Option = { value: string; label: string };

type Props = {
  initialSearch?: string;
  initialCategory?: string;
  categories?: Option[];
  sorts?: Option[];
  onSearchChange?: (q: string) => void;
  onCategoryChange?: (categoryId: string) => void;
  onSortChange?: (sortBy: string) => void;
  className?: string;
};

export default function SearchAndFilter({
  initialSearch = "",
  initialCategory = "",
  categories = [],
  sorts = [
    { value: "relevance", label: "Relevancia" },
    { value: "newest", label: "Más recientes" },
    { value: "price_asc", label: "Precio ↑" },
    { value: "price_desc", label: "Precio ↓" },
  ],
  onSearchChange,
  onCategoryChange,
  onSortChange,
  className = "",
}: Props) {
  const [query, setQuery] = useState<string>(initialSearch);
  const [category, setCategory] = useState<string>(initialCategory);
  const [sortBy, setSortBy] = useState<string>(sorts[0]?.value ?? "");
  const debounceRef = useRef<number | null>(null);

  // keep local state in sync if parent changes initial props
  useEffect(() => setQuery(initialSearch ?? ""), [initialSearch]);
  useEffect(() => setCategory(initialCategory ?? ""), [initialCategory]);

  // if sorts prop changes ensure current sort is valid, otherwise pick default
  useEffect(() => {
    const defaultSort = sorts[0]?.value ?? "";
    const found = sorts.some((s) => s.value === sortBy);
    if (!found) setSortBy(defaultSort);
  }, [sorts, sortBy]);

  // expose categories with a default "Todas"
  const categoryOptions = useMemo(() => [{ value: "", label: "Todas" }, ...categories], [categories]);

  // Debounced search: call onSearchChange after 350ms of inactivity
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = window.setTimeout(() => {
      onSearchChange?.(query.trim());
      debounceRef.current = null;
    }, 350);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [query, onSearchChange]);

  // category & sort emit immediately
  useEffect(() => {
    onCategoryChange?.(category);
  }, [category, onCategoryChange]);

  useEffect(() => {
    onSortChange?.(sortBy);
  }, [sortBy, onSortChange]);

  const clearAll = () => {
    // clear timers to avoid stale callbacks
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    setQuery("");
    setCategory("");
    const defaultSort = sorts[0]?.value ?? "";
    setSortBy(defaultSort);

    // emit cleared values immediately
    onSearchChange?.("");
    onCategoryChange?.("");
    onSortChange?.(defaultSort);
  };

  const onKeyDownSearch: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "Enter") {
      // trigger immediate search on Enter
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      onSearchChange?.(query.trim());
    }
  };

  return (
    <div className={`search-and-filter w-full ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        <label htmlFor="market-search" className="sr-only">
          Buscar
        </label>
        <input
          id="market-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={onKeyDownSearch}
          placeholder="Buscar productos, servicios, títulos..."
          className="flex-1 rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Buscar en el marketplace"
        />

        <label htmlFor="market-category" className="sr-only">
          Categoría
        </label>
        <select
          id="market-category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Filtrar por categoría"
        >
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <label htmlFor="market-sort" className="sr-only">
          Ordenar
        </label>
        <select
          id="market-sort"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400"
          aria-label="Ordenar resultados"
        >
          {sorts.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>

        <button
          type="button"
          onClick={clearAll}
          className="rounded-md border px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100"
          aria-label="Limpiar filtros"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
}