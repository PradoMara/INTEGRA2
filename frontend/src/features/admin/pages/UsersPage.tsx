// frontend/src/features/admin/pages/UsersPage.tsx - CORREGIDO
import { useMemo, useState, useEffect } from 'react';
import AdminLayout from '../layout/AdminLayout';
import { AdminTable, AdminModal, SearchInput } from '../components';
import { useAdminUsers } from '../hooks/useAdminUsers'; // Usamos el hook original
import { useUpdateUserRole } from '../hooks/useUpdateUserRole';
import { useBanUser } from '../hooks/useBanUser';
import { useDeleteUser } from '../hooks/useDeleteUser';
import type { AdminUser } from '../types/adminUser';
import PageTransition from '../components/PageTransition';
import EmptyCard from '../components/EmptyCard';
import btn from '../components/AdminButtons.module.css';

export default function UsersPage() {
  const [query, setQuery] = useState('');
  
  // Hook para la consulta - ahora usa la estructura completa
  const { 
    data: usersResponse, 
    isLoading: loading, 
    isError,
    error: queryError,
    refetch 
  } = useAdminUsers(query);

  // Extraer usuarios de la respuesta
  const users = useMemo(() => {
    if (!usersResponse) {
      console.log('📭 usersResponse es null/undefined');
      return [];
    }
    
    console.log('📦 Estructura de usersResponse:', usersResponse);
    
    // La API devuelve { total: number, users: AdminUser[] }
    if (usersResponse.users && Array.isArray(usersResponse.users)) {
      console.log(`✅ ${usersResponse.users.length} usuarios cargados`);
      return usersResponse.users;
    }
    
    console.log('❌ Estructura inesperada:', usersResponse);
    return [];
  }, [usersResponse]);

  // Hooks de Mutación
  const { mutate: banUser, isLoading: banLoading } = useBanUser();
  const { mutate: updateRole } = useUpdateUserRole();
  const { mutate: deleteUser, isLoading: deleteLoading } = useDeleteUser();

  const [editing, setEditing] = useState<AdminUser | null>(null);
  const [deleting, setDeleting] = useState<AdminUser | null>(null); 
  const [roleValue, setRoleValue] = useState<'USER' | 'MODERATOR' | 'ADMIN'>('USER');
  const [modalError, setModalError] = useState<string | null>(null); 

  // Sincronizar el estado editing cuando los datos cambian
  useEffect(() => {
    if (editing && users.length > 0) {
      const updatedUser = users.find(u => u.id === editing.id);
      if (updatedUser && updatedUser.banned !== editing.banned) {
        console.log('🔄 Sincronizando editing:', { 
          id: editing.id,
          email: editing.email,
          antiguo: editing.banned, 
          nuevo: updatedUser.banned 
        });
        setEditing(updatedUser);
      }
    }
  }, [users, editing?.id]);

  const columns = useMemo(() => [
    { key: 'nombre', title: 'Nombre', render: (u: AdminUser) => u.nombre ?? '—' },
    { key: 'email', title: 'Email', render: (u: AdminUser) => u.email },
    { key: 'rol', title: 'Rol', render: (u: AdminUser) => u.rol },
    { 
      key: 'banned', 
      title: 'Banned', 
      render: (u: AdminUser) => (
        <span style={{ 
          color: u.banned ? '#dc2626' : '#16a34a',
          fontWeight: 'bold',
          padding: '4px 8px',
          borderRadius: '4px',
          backgroundColor: u.banned ? '#fef2f2' : '#f0fdf4',
          border: `1px solid ${u.banned ? '#fecaca' : '#bbf7d0'}`
        }}>
          {u.banned ? 'SÍ' : 'NO'}
        </span>
      )
    },
    {
      key: 'actions',
      title: 'Acciones',
      render: (u: AdminUser) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <button 
            className={`${btn.btn} ${btn.secondary}`} 
            onClick={(e) => { 
              e.stopPropagation(); 
              setEditing(u); 
              setRoleValue(u.rol); 
              setModalError(null); 
            }}
          >
            Editar
          </button>
          <button 
            className={`${btn.btn} ${btn.danger}`} 
            onClick={(e) => { 
              e.stopPropagation(); 
              setDeleting(u); 
              setModalError(null); 
            }}
          >
            Eliminar
          </button>
        </div>
      ),
      width: '180px',
    },
  ], []);

  // Función para guardar cambios de rol
  const onSave = async () => {
    if (!editing) return;
    setModalError(null); 
    try {
      if (roleValue !== editing.rol) {
        if (!editing.id) throw new Error("ID de usuario no disponible.");
        await updateRole({ id: editing.id.toString(), newRole: roleValue }); 
      }
      setEditing(null);
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Error al guardar');
    }
  };

  // Función para Banear / Desbanear
  const onToggleBan = async () => {
    if (!editing || banLoading) return; 
    setModalError(null);
    try {
      if (!editing.id) throw new Error("ID de usuario no disponible.");

      console.log(`🚀 Solicitando ban/unban: ${editing.id}, de ${editing.banned} a ${!editing.banned}`);
      
      await banUser({ 
        userId: editing.id.toString(),
        banned: !editing.banned
      }); 
      
      console.log('✅ Solicitud de ban/unban enviada correctamente');
      
    } catch (err: any) {
      console.error('❌ Error en onToggleBan:', err);
      setModalError(err.message || 'Error al banear/desbanear');
    }
  };

  // Función para confirmar la eliminación
  const onConfirmDelete = async () => {
    if (!deleting || deleteLoading) return; 
    setModalError(null);
    try {
      if (!deleting.id) throw new Error("ID de usuario no disponible.");
      await deleteUser(deleting.id.toString());
      setDeleting(null); 
    } catch (err: any) {
      console.error(err);
      setModalError(err.message || 'Error al eliminar usuario');
    }
  };

  return (
    <AdminLayout title="Usuarios">
      <PageTransition>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <SearchInput value={query} onChange={(v) => setQuery(v)} placeholder="Buscar usuarios..." />
          <button className={`${btn.btn} ${btn.primary}`} onClick={() => refetch()}>
            Refrescar
          </button>
        </div>

        {isError && (
          <div style={{ 
            color: '#b91c1c', 
            background: '#fee2e2', 
            border: '1px solid #fecaca', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 12 
          }}>
            Error cargando usuarios: {queryError?.message}
          </div>
        )}

        <AdminTable
          columns={columns}
          data={users}
          loading={loading}
          emptyContent={
            <EmptyCard 
              title="No hay usuarios"
              rows={[
                { 
                  icon: '👥', 
                  label: 'Usuarios', 
                  content: 'No se encontraron usuarios que coincidan con la búsqueda.'
                },
              ]}
            />
          }
          rowKey={(u: AdminUser) => u.id}
          onRowClick={(u: AdminUser) => { 
            setEditing(u); 
            setRoleValue(u.rol); 
            setModalError(null); 
          }}
        />

        {/* Modal de Edición */}
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
                <div>{editing.nombre ?? '—'}</div>
              </div>
              <div>
                <label>Email</label>
                <div>{editing.email}</div>
              </div>
              <div>
                <label>Rol</label>
                <select 
                  value={roleValue} 
                  onChange={(e) => setRoleValue(e.target.value as 'USER' | 'MODERATOR' | 'ADMIN')} 
                >
                  <option value="USER">USER</option>
                  <option value="MODERATOR">MODERATOR</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>
              
              <div>
                <label>Estado de Baneo</label>
                <div style={{ 
                  color: editing.banned ? '#dc2626' : '#16a34a',
                  fontWeight: 'bold',
                  padding: '8px',
                  borderRadius: '4px',
                  backgroundColor: editing.banned ? '#fef2f2' : '#f0fdf4',
                  border: `1px solid ${editing.banned ? '#fecaca' : '#bbf7d0'}`
                }}>
                  {editing.banned ? '🚫 USUARIO BANEADO' : '✅ USUARIO ACTIVO'}
                </div>
              </div>
              
              {modalError && (
                <div style={{ color: '#b91c1c', marginTop: 8 }}>
                  {modalError}
                </div>
              )}
              
              <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <button 
                  onClick={onToggleBan} 
                  disabled={banLoading}
                  className={`${btn.btn} ${editing.banned ? btn.success : btn.warning}`}
                >
                  {banLoading ? 'Procesando...' : editing.banned ? 'Desbanear' : 'Banear'}
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
          onSave={onConfirmDelete}
        >
          {deleting && (
            <div>
              <p>¿Estás seguro de eliminar a <strong>{deleting.email}</strong>?</p>
              <p>Esta acción no se puede deshacer.</p>
              {modalError && (
                <div style={{ color: '#b91c1c', marginTop: 8 }}>
                  {modalError}
                </div>
              )}
            </div>
          )}
        </AdminModal>
      </PageTransition>
    </AdminLayout>
  );
}