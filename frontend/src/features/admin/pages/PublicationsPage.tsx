import { useMemo, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { AdminTable, AdminModal, SearchInput } from '../components';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useHideProduct } from '../hooks/useHideProduct';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import type { AdminProduct } from '../types/adminProduct';

export default function PublicationsPage() {
  const { products, loading, error, query, setQuery, refetch } = useAdminProducts('');
  const { hideProduct } = useHideProduct();
  const { deleteProduct } = useDeleteProduct();

  const [selected, setSelected] = useState<AdminProduct | null>(null);
  const [saving, setSaving] = useState(false);

  const columns = useMemo(() => [
    { key: 'title', title: 'Título', render: (p: AdminProduct) => p.title },
    { key: 'author', title: 'Autor', render: (p: AdminProduct) => p.author },
    { key: 'category', title: 'Categoría', render: (p: AdminProduct) => p.categoryName ?? '—' },
    { key: 'price', title: 'Precio', render: (p: AdminProduct) => typeof p.price === 'number' ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(p.price) : '—' },
    { key: 'status', title: 'Estado', render: (p: AdminProduct) => p.status ?? 'published' },
    { key: 'createdAt', title: 'Creado', render: (p: AdminProduct) => p.createdAt ? new Date(p.createdAt).toLocaleString() : '—' },
    {
      key: 'actions',
      title: 'Acciones',
      render: (p: AdminProduct) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={(e) => { e.stopPropagation(); onHide(p.id); }}>Ocultar</button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(p.id); }} style={{ color: 'red' }}>Eliminar</button>
        </div>
      ),
      width: '180px',
    },
  ], []);

  const onHide = async (id: string) => {
    try {
      setSaving(true);
      await hideProduct(id);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Error al ocultar publicación');
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Confirmar eliminación de publicación?')) return;
    try {
      await deleteProduct(id);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar publicación');
    }
  };

  return (
    <AdminLayout title="Publicaciones">
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        <SearchInput value={query} onChange={(v) => setQuery(v)} placeholder="Buscar publicaciones..." />
        <button onClick={() => refetch()}>Buscar</button>
        {saving && <span style={{ marginLeft: 'auto' }}>Guardando...</span>}
      </div>

      {error && <div style={{ color: 'red' }}>{error}</div>}

      <AdminTable
        columns={columns}
        data={products}
        rowKey={(p: any) => p.id}
        onRowClick={(p: AdminProduct) => setSelected(p)}
      />

      <AdminModal
        open={!!selected}
        title={selected ? `Publicación — ${selected.title}` : undefined}
        onClose={() => setSelected(null)}
      >
        {selected && (
          <div style={{ display: 'grid', gap: 8 }}>
            <div><strong>Título:</strong> {selected.title}</div>
            <div><strong>Autor:</strong> {selected.author}</div>
            <div><strong>Categoría:</strong> {selected.categoryName ?? '—'}</div>
            <div><strong>Estado:</strong> {selected.status ?? 'published'}</div>
            <div><strong>Precio:</strong> {typeof selected.price === 'number' ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(selected.price) : '—'}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
              <button onClick={() => onHide(selected.id)}>Ocultar</button>
              <button onClick={() => onDelete(selected.id)} style={{ color: 'red' }}>Eliminar</button>
            </div>
          </div>
        )}
      </AdminModal>
    </AdminLayout>
  );
}
