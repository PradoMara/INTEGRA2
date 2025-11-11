import { useQuery } from '@tanstack/react-query';
import { getPublicationById } from '../ProductDetail.Repositories/publicationsService';
import type { Publication } from '../ProductDetail.Types/publication';

export function publicationKeys(id?: string) {
  return ['publication', id] as const;
}

type Options = {
  enabled?: boolean;
  initialData?: Publication;
};

export function usePublicationById(id?: string, options?: Options) {
  const { initialData } = options ?? {};
  // Si viene initialData desde la navegación, no disparamos fetch para evitar error
  const enabled = !!id && !initialData;
  return useQuery<Publication>({
    queryKey: publicationKeys(id),
    queryFn: () => getPublicationById(id!),
    enabled,
    initialData,
  });
}