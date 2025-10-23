import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { usePublicationById } from '../hooks/publications/usePublicationById';
import { PublicationDetails } from './components/detail/PublicationDetails';
import type { Publication } from '../types/publication';

export const PublicationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const state = location.state as { publication?: Publication } | null;
  const initialData = state?.publication;

  const { data, isLoading, isError } = usePublicationById(id, {
    enabled: !!id,           // consulta si hay id (si USE_MOCKS devolverá fixture)
    initialData,             // si venís desde el listado con state, evita refetch inmediato
  });

  if (isLoading && !data) return <main className="container mx-auto p-6">Cargando...</main>;
  if (isError || !data) return <main className="container mx-auto p-6 text-red-600">No se pudo cargar la publicación.</main>;

  return (
    <main className="container mx-auto p-6">
      <PublicationDetails
        publication={data}
        onBuy={(pubId) => {
          // TODO: integrar flujo de compra
          console.log('Comprar publicación', pubId);
        }}
      />
    </main>
  );
};