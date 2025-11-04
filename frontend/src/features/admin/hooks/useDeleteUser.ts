const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

function _mockStorageKey() { return 'admin_users_mock_v1'; }

async function _delay<T>(value: T, ms = 300) {
  return new Promise<T>((resolve) => setTimeout(() => resolve(value), ms));
}

export function useDeleteUser() {
  const deleteUser = async (id: string) => {
    if (BASE) {
      const res = await fetch(`${BASE}/admin/users/${encodeURIComponent(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Delete failed (${res.status})`);
      return res.json();
    }

    // Fallback mock: localStorage
    const key = _mockStorageKey();
    const raw = localStorage.getItem(key);
    const list = raw ? JSON.parse(raw) : [];
    const newList = list.filter((u: any) => String(u.id) !== String(id));
    localStorage.setItem(key, JSON.stringify(newList));
    return _delay({ ok: true });
  };

  return { deleteUser };
}