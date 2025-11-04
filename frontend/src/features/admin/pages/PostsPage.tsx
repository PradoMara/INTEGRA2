import { useMemo, useState } from 'react';
import AdminLayout from '../layout/AdminLayout';
import PageTransition from '../components/PageTransition';
import { AdminTable, AdminModal, SearchInput } from '../components';
import { useAdminProducts } from '../hooks/useAdminProducts';
import { useHideProduct } from '../hooks/useHideProduct';
import { useDeleteProduct } from '../hooks/useDeleteProduct';
import type { AdminProduct } from '../types/adminProduct';

export default function AdminPostsPage() {
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
      <PageTransition>
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
          loading={loading}
          onRowClick={(p: AdminProduct) => setSelected(p)}
        />

        <AdminModal
          open={!!selected}
          title={selected ? `Publicación — ${selected.title}` : undefined}
          onClose={() => setSelected(null)}
        >
          {selected && (
            <div style={{ display: 'grid', gap: 14 }}>
              {/* Encabezado con estado y precio */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, justifyContent: 'space-between' }}>
                <div style={{ display: 'grid', gap: 4 }}>
                  <div style={{ fontSize: 14, color: '#64748b' }}>Título</div>
                  <div style={{ fontSize: 16, fontWeight: 600 }}>{selected.title}</div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  {/* Badge de estado */}
                  <span
                    style={{
                      fontSize: 12,
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: 999,
                      border: '1px solid #cbd5e1',
                      background: (selected.status ?? 'published') === 'hidden' ? '#fffbeb' : '#ecfeff',
                      color: (selected.status ?? 'published') === 'hidden' ? '#92400e' : '#155e75',
                    }}
                  >
                    {(selected.status ?? 'published') === 'hidden' ? 'Oculta' : 'Publicada'}
                  </span>
                  {/* Precio */}
                  <span style={{ fontWeight: 700 }}>
                    {typeof selected.price === 'number'
                      ? new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP' }).format(selected.price)
                      : '—'}
                  </span>
                </div>
              </div>

              {/* Detalles en 2 columnas */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: 12,
                }}
              >
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Autor</div>
                  <div style={{ fontSize: 14 }}>{selected.author}</div>
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Categoría</div>
                  <div style={{ fontSize: 14 }}>{selected.categoryName ?? '—'}</div>
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>Creado</div>
                  <div style={{ fontSize: 14 }}>{selected.createdAt ? new Date(selected.createdAt).toLocaleString() : '—'}</div>
                </div>
                <div style={{ display: 'grid', gap: 6 }}>
                  <div style={{ fontSize: 12, color: '#64748b' }}>ID</div>
                  <div style={{ fontSize: 14 }}>{selected.id}</div>
                </div>
              </div>

              <hr style={{ border: 0, borderTop: '1px solid #e2e8f0', margin: '4px 0 0' }} />

              {/* Acciones */}
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button
                  onClick={() => onHide(selected.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #f59e0b',
                    background: '#fffbeb',
                    color: '#92400e',
                    fontWeight: 600,
                  }}
                >
                  Ocultar
                </button>
                <button
                  onClick={() => onDelete(selected.id)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 8,
                    border: '1px solid #ef4444',
                    background: '#fef2f2',
                    color: '#991b1b',
                    fontWeight: 700,
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          )}
        </AdminModal>
      </PageTransition>
    </AdminLayout>
  );
}
