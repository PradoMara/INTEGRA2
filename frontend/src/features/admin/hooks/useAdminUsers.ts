import { useCallback, useEffect, useState } from 'react';
import type { AdminUser } from '../types/adminUser';

const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export function useAdminUsers(initialQuery = '') {
  const [query, setQuery] = useState(initialQuery);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (q = query) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE}/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Status ${res.status}`);
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message ?? 'Error fetching users');
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    query,
    setQuery,
    refetch: () => fetchUsers(query),
  };
}