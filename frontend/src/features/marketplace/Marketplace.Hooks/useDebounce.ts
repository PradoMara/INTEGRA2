import { useState, useEffect } from 'react';

// Hook simple para "retrasar" la actualización de un valor
// (ej. esperar a que el usuario termine de escribir)
export function useDebounce(value: string, delay: number): string {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // 1. Configura un temporizador
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 2. Limpia el temporizador si el valor cambia (antes de que se cumpla el delay)
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Solo se re-ejecuta si el valor o el delay cambian

  // Devuelve el valor "retrasado"
  return debouncedValue;
}