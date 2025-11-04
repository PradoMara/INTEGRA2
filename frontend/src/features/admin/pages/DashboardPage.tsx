import AdminLayout from '../layout/AdminLayout';
import StatCard from '../components/StatCard';
import { useAdminUsers } from '../hooks/useAdminUsers';
import PageTransition from '../components/PageTransition';
import EmptyCard from '../components/EmptyCard';
import StatusBadge from '../components/StatusBadge';

export default function AdminDashboardPage() {
  const { users, loading, error } = useAdminUsers('');

  return (
    <AdminLayout title="Dashboard">
      <PageTransition>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
          <StatCard title="Usuarios" value={loading ? '...' : users.length} subtitle={error ? 'Error cargando' : 'Total registrados'} />
          <StatCard title="Publicaciones" value={'—'} subtitle="Total publicadas" />
          <StatCard title="Reportes" value={'—'} subtitle="Pendientes" variant="negative" />
          <StatCard title="Activos hoy" value={'—'} subtitle="Usuarios activos" variant="positive" />
        </div>

        <div style={{ marginTop: 24 }}>
          <h3 style={{ marginBottom: 12 }}>Estado del sistema</h3>
          <EmptyCard
            rows={[
              { icon: '🟢', label: 'API', content: <StatusBadge status={error ? 'err' : 'ok'} label={error ? 'Error' : 'Activa'} /> },
              { icon: '🗄️', label: 'Base de datos', content: <StatusBadge status={'ok'} label={'Conectada'} /> },
              { icon: '⏳', label: 'Datos', content: <StatusBadge status={loading ? 'warn' : 'ok'} label={loading ? 'Cargando' : 'Disponibles'} /> },
            ]}
          />
        </div>
      </PageTransition>
    </AdminLayout>
  );
}
