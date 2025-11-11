const BASE = import.meta.env.VITE_API_BASE_URL ?? '';

export function useBanUser() {
  const banUser = async (id: string, reason?: string) => {
    const res = await fetch(`${BASE}/admin/users/${encodeURIComponent(id)}/ban`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ reason }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || `Failed to ban/unban user (${res.status})`);
    }
    return res.json();
  };

  return { banUser };
}