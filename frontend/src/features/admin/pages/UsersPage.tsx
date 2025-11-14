import { useMemo, useState } from 'react';
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
  const [query, setQuery] = useState('');
  
  const { 
    data: users = [], 
    isLoading: loading, 
    isError,
    error: queryError,
    refetch 
  } = useAdminUsers(query); 
  
  const { updateRole } = useUpdateUserRole();
  const { banUser } = useBanUser();
  const { deleteUser } = useDeleteUser();

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null); 
  const [roleValue, setRoleValue] = useState<'USER' | 'MODERATOR' | 'ADMIN'>('USER');
  const [saving, setSaving] = useState(false); // Mantendremos 'saving' para deshabilitar botones
  const [modalError, setModalError] = useState<string | null>(null); 

  const columns = useMemo(() => [
    { key: 'nombre', title: 'Nombre', render: (u: AdminUser) => u.nombre ?? '—' },
    { key: 'email', title: 'Email', render: (u: AdminUser) => u.email },
    { key: 'rol', title: 'Rol', render: (u: AdminUser) => u.rol },
    { key: 'banned', title: 'Banned', render: (u: AdminUser) => u.banned ? 'Sí' : 'No' },
    {
      key: 'actions',
      title: 'Acciones',
      render: (u: AdminUser) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button className={`${btn.btn} ${btn.secondary}`} onClick={(e) => { e.stopPropagation(); setEditing(u); setRoleValue(u.rol); setModalError(null); }}>
            Editar
          </button>
          <button className={`${btn.btn} ${btn.danger}`} onClick={(e) => { e.stopPropagation(); setDeleting(u); setModalError(null); }}>
            Eliminar
          </button>
        </div>
      ),
      width: '180px',
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  const onSave = async () => {
    if (!editing) return;
    setSaving(true);
    setModalError(null); 
    try {
      if (roleValue !== editing.rol) {
        // ¡CORRECCIÓN! Convertimos el ID (number) a string
        await updateRole(editing.id.toString(), roleValue);
      }
      setEditing(null);
      await refetch();
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  const onToggleBan = async () => {
    if (!editing) return;
    setSaving(true);
    setModalError(null);
    try {
      // ¡CORRECCIÓN! Convertimos el ID (number) a string
      await banUser(editing.id.toString(), editing.banned ? 'unban' : 'banned via admin');
      await refetch();
      setEditing(null); 
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Error al banear/desbanear');
    } finally {
      setSaving(false);
    }
  };

  const onConfirmDelete = async () => {
    if (!deleting) return;
    setSaving(true);
    setModalError(null);
    try {
      // ¡CORRECCIÓN! Convertimos el ID (number) a string
      await deleteUser(deleting.id.toString());
      await refetch();
      setDeleting(null); 
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Error al eliminar usuario');
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout title="Usuarios">
      <PageTransition>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <SearchInput value={query} onChange={(v) => setQuery(v)} placeholder="Buscar usuarios..." />
          <button className={`${btn.btn} ${btn.primary}`} onClick={() => refetch()}>Refrescar</button>
        </div>

        {isError && <div style={{ color: '#b91c1c', background: '#fee2e2', border: '1px solid #fecaca', padding: 12, borderRadius: 8, marginBottom: 12 }}>Error cargando usuarios: {queryError?.message}</div>}

        <AdminTable
          columns={columns}
          data={users}
          loading={loading}
          emptyContent={<EmptyCard title={<><span>Conectando a la API</span></>}
            rows={[
              { icon: '👥', label: 'Usuarios', content: <div><div>Buscando usuarios...</div><div className="muted">Si no aparecen, revisa la consola (F12) por errores de API.</div></div> },
            ]}
          />}
          rowKey={(u: AdminUser) => u.id}
          onRowClick={(u: AdminUser) => { setEditing(u); setRoleValue(u.rol); setModalError(null); }}
        />

        {/* Modal de Edición */}
        <AdminModal
          open={!!editing}
          title={editing ? `Editar usuario — ${editing.email}` : undefined}
          onClose={() => setEditing(null)}
          onSave={onSave}
          // ¡CORRECCIÓN! Prop 'saving' eliminada. 
          // El modal no la acepta, pero deshabilitamos los botones internos.
        >
          {editing && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div>
                <label>Nombre</label>
                <div>{editing.nombre ?? '—'}</div>
              </div>
              <div>
                <label>Email</label>
                <div>{editing.email}</div>
              </div>
              <div>
                <label>Rol</label>
                <select value={roleValue} onChange={(e) => setRoleValue(e.target.value as 'USER' | 'MODERATOR' | 'ADMIN')} disabled={saving}>
                  <option value="USER">USER</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              {modalError && <div style={{ color: '#b91c1c', marginTop: 8 }}>{modalError}</div>}
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button onClick={onToggleBan} disabled={saving} className={`${btn.btn} ${btn.warning}`}>
                  {editing.banned ? 'Desbanear' : 'Banear'}
                </button>
              </div>
            </div>
          )}
        </AdminModal>

        {/* Modal de Confirmación de Borrado */}
        <AdminModal
          open={!!deleting}
          title="Confirmar Eliminación"
          onClose={() => setDeleting(null)}
          onSave={onConfirmDelete} // El botón 'Guardar' del modal ahora confirma el borrado
          // ¡CORRECCIÓN! Props 'saveText', 'saveClass' y 'saving' eliminadas.
        >
          {deleting && (
            <div>
              <p>¿Estás seguro de que quieres eliminar al usuario <strong>{deleting.email}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
              {modalError && <div style={{ color: '#b91c1c', marginTop: 8 }}>{modalError}</div>}
              {saving && <span>Eliminando...</span>}
            </div>
          )}
        </AdminModal>

      </PageTransition>
    </AdminLayout>
  );
}