import { useMemo, useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { AdminTable, AdminModal, SearchInput } from '../components';
import { useAdminUsers } from '../hooks/useAdminUsers';
import { useUpdateUserRole } from '../hooks/useUpdateUserRole';
import { useBanUser } from '../hooks/useBanUser';
import { useDeleteUser } from '../hooks/useDeleteUser';
import type { AdminUser } from '../types/adminUser';
import PageTransition from '../components/PageTransition';
import EmptyCard from '../components/EmptyCard';
import btn from '../components/AdminButtons.module.css';

export default function UsersPage() {
  const { users, loading, error, query, setQuery, refetch } = useAdminUsers('');
  const { updateRole } = useUpdateUserRole();
  const { banUser } = useBanUser();
  const { deleteUser } = useDeleteUser();

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [roleValue, setRoleValue] = useState<string>('');
  const [saving, setSaving] = useState(false);

  // if using local mock storage, ensure initial list exists
  useEffect(() => {
    // nothing for now
  }, []);

  const columns = useMemo(() => [
    { key: 'name', title: 'Nombre', render: (u: AdminUser) => u.name ?? '—' },
    { key: 'email', title: 'Email', render: (u: AdminUser) => u.email },
    { key: 'role', title: 'Rol', render: (u: AdminUser) => u.role },
    { key: 'banned', title: 'Banned', render: (u: AdminUser) => u.banned ? 'Sí' : 'No' },
    {
      key: 'actions',
      title: 'Acciones',
      render: (u: AdminUser) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`${btn.btn} ${btn.secondary}`} onClick={(e) => { e.stopPropagation(); setEditing(u); setRoleValue(u.role); }}>
            Editar
          </button>
          <button className={`${btn.btn} ${btn.danger}`} onClick={(e) => { e.stopPropagation(); onDelete(u.id); }}>
            Eliminar
          </button>
        </div>
      ),
      width: '180px',
    },
  ], []);

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    try {
      if (roleValue !== editing.role) {
        await updateRole(editing.id, roleValue);
      }
      setEditing(null);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const onToggleBan = async () => {
    if (!editing) return;
    try {
      await banUser(editing.id, editing.banned ? 'unban' : 'banned via admin');
      await refetch();
      setEditing(null);
    } catch (err) {
      console.error(err);
      alert('Error al banear/desbanear');
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm('Confirmar eliminación de usuario?')) return;
    try {
      await deleteUser(id);
      await refetch();
    } catch (err) {
      console.error(err);
      alert('Error al eliminar usuario');
    }
  };

  return (
    <AdminLayout title="Usuarios">
      <PageTransition>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <SearchInput value={query} onChange={(v) => setQuery(v)} placeholder="Buscar usuarios..." />
          <button className={`${btn.btn} ${btn.primary}`} onClick={() => refetch()}>Buscar</button>
        </div>

  {error && <div style={{ color: '#b91c1c', background: '#fee2e2', border: '1px solid #fecaca', padding: 12, borderRadius: 8, marginBottom: 12 }}>Error cargando usuarios: {error}</div>}

        <AdminTable
          columns={columns}
          data={users}
          loading={loading}
          emptyContent={<EmptyCard title={<><span>Ejemplo visual sin datos</span></>}
            rows={[
              { icon: '👥', label: 'Usuarios', content: <div><div>Aún no hay usuarios registrados</div><div className="muted">Los datos aparecerán al conectar la API.</div></div> },
              { icon: '🧾', label: 'Publicaciones', content: <div><div>En esta sección verás el total de publicaciones.</div><div className="muted">Estado: Sin datos disponibles.</div></div> },
              { icon: '⚠️', label: 'Reportes', content: <div><div>Reportes de usuarios aparecerán aquí.</div><div className="muted">Estado: Pendiente integración.</div></div> },
            ]}
          />}
          rowKey={(u: any) => u.id}
          onRowClick={(u: AdminUser) => { setEditing(u); setRoleValue(u.role); }}
        />

        <AdminModal
          open={!!editing}
          title={editing ? `Editar usuario — ${editing.email}` : undefined}
          onClose={() => setEditing(null)}
          onSave={onSave}
        >
          {editing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label>Nombre</label>
                <div>{editing.name ?? '—'}</div>
              </div>
              <div>
                <label>Email</label>
                <div>{editing.email}</div>
              </div>
              <div>
                <label>Rol</label>
                <select value={roleValue} onChange={(e) => setRoleValue(e.target.value)}>
                  <option value="user">user</option>
                  <option value="moderator">moderator</option>
                  <option value="admin">admin</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={onToggleBan}>{editing.banned ? 'Desbanear' : 'Banear'}</button>
                <div style={{ marginLeft: 'auto' }}>
                  {saving && <span>Guardando...</span>}
                </div>
              </div>
            </div>
          )}
        </AdminModal>
      </PageTransition>
    </AdminLayout>
  );
}