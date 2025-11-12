import { notify } from '@/lib/toast';
const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export function useDeleteProduct() {
  const deleteProduct = async (id: string) => {
    try {
      if (BASE) {
        const res = await fetch(`${BASE}/admin/products/${encodeURIComponent(id)}`, {
          method: 'DELETE',
          credentials: 'include',
        });
        if (!res.ok) throw new Error(`Delete failed (${res.status})`);
        try {
          const out = await res.json();
          notify.success('Publicación eliminada');
          return out;
        } catch {
          notify.success('Publicación eliminada');
          return { id };
        }
      }

      // Fallback: eliminar post en MSW
      const res = await fetch(`/api/posts/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      try {
        const out = await res.json();
        notify.success('Publicación eliminada');
        return out;
      } catch {
        notify.success('Publicación eliminada');
        return { id };
      }
    } catch (e) {
      notify.error('No se pudo eliminar la publicación');
      throw e;
    }
  };

  return { deleteProduct };
}
