import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useNavigate } from 'react-router-dom';
import { AdminRepository } from '../repositories/AdminRepository';
import type { BackendUser } from '../types/User';

const AdminDashboard = () => {
  const { user, logout } = useAuthStore((state: any) => ({
    user: state.user,
    logout: state.logout,
  }));
  const navigate = useNavigate();
  const [users, setUsers] = useState<BackendUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const adminRepo = new AdminRepository();
      const usersData = await adminRepo.getUsers();
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching users:', error);
      alert('Error al cargar usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleBanUser = async (userId: number, banned: boolean) => {
    try {
      const adminRepo = new AdminRepository();
      await adminRepo.banUser(userId, banned);
      alert(banned ? 'Usuario baneado' : 'Usuario desbaneado');
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error('Error banning user:', error);
      alert('Error al banear usuario');
    }
  };

  const handleDeleteUser = async (userId: number) => {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;
    
    try {
      const adminRepo = new AdminRepository();
      await adminRepo.deleteUser(userId);
      alert('Usuario eliminado');
      fetchUsers(); // Recargar lista
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Error al eliminar usuario');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1>Panel de Administración</h1>
          <p>¡Bienvenido, {user?.nombre}! Tienes acceso de administrador.</p>
        </div>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>

      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2>Gestión de Usuarios ({users.length} usuarios)</h2>
        
        {loading ? (
          <p>Cargando usuarios...</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f5f5f5' }}>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>ID</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Nombre</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Email</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Rol</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Estado</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Campus</th>
                <th style={{ padding: '10px', textAlign: 'left', border: '1px solid #ddd' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.id}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.nombre} {user.apellido}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.correo}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: user.role === 'Administrador' ? '#ffebee' : user.role === 'Vendedor' ? '#e3f2fd' : '#e8f5e8',
                      color: user.role === 'Administrador' ? '#c62828' : user.role === 'Vendedor' ? '#1565c0' : '#2e7d32'
                    }}>
                      {user.role}
                    </span>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <span style={{ 
                      padding: '4px 8px', 
                      borderRadius: '4px', 
                      background: user.estado === 'BANEADO' ? '#ffebee' : '#e8f5e8',
                      color: user.estado === 'BANEADO' ? '#c62828' : '#2e7d32'
                    }}>
                      {user.estado}
                    </span>
                  </td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>{user.campus || 'N/A'}</td>
                  <td style={{ padding: '10px', border: '1px solid #ddd' }}>
                    <button 
                      onClick={() => handleBanUser(user.id, user.estado !== 'BANEADO')}
                      style={{ 
                        marginRight: '8px', 
                        padding: '4px 8px',
                        background: user.estado === 'BANEADO' ? '#4caf50' : '#ff9800',
                        color: 'white'
                      }}
                    >
                      {user.estado === 'BANEADO' ? 'Desbanear' : 'Banear'}
                    </button>
                    <button 
                      onClick={() => handleDeleteUser(user.id)}
                      style={{ 
                        padding: '4px 8px', 
                        background: '#ff4444', 
                        color: 'white' 
                      }}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;