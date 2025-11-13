import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

// Interfaz de respuesta de la API (basada en products.js)
interface CategoryResponse {
    id: number;
    nombre: string;
    categoriaPadreId: number | null;
    subcategorias: { id: number; nombre: string }[];
}

interface CategoriesApiResponse {
    ok: boolean;
    categories: CategoryResponse[];
}

export const useCategories = () => {
    const fetchCategories = async (): Promise<CategoryResponse[]> => {
        try {
            const url = '/api/products/categories/list'; 
            const response = await fetch(url);
            
            if (!response.ok) {
                console.warn(`Advertencia al obtener categorías: ${response.statusText}`);
                return []; // Devolver array vacío en caso de error
            }
            
            const apiResponse: CategoriesApiResponse = await response.json();
            return apiResponse.categories || [];
        } catch (error) {
            console.warn('Error al obtener categorías:', error);
            return []; // Devolver array vacío en caso de error
        }
    };

    const { data, isLoading, isError } = useQuery<CategoryResponse[], Error>({
        queryKey: ['categories'],
        queryFn: fetchCategories,
        staleTime: 1000 * 60 * 60 * 24, // Cachear 24 horas
        enabled: true,
        retry: 1, // Reintentar solo 1 vez
    });

    const categoryNames = useMemo(() => {
        // Devuelve solo los nombres para el componente SearchAndFilter
        return data?.map(cat => cat.nombre) ?? []; 
    }, [data]);

    return {
        categories: categoryNames, 
        isLoading,
        isError,
    };
};