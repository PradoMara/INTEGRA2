## Layout con Header Reutilizable

Se creó el componente `PageLayout` en `src/presentation/components/PageLayout.tsx` que inyecta el `Header` global y deja un `<main>` para el contenido de cada página.

Ejemplo de uso en una página nueva:

```tsx
import PageLayout from '../presentation/components/PageLayout'

export default function DashboardPage() {
	return (
		<PageLayout>
			<h1>Dashboard</h1>
			{/* contenido específico */}
		</PageLayout>
	)
}
```

De esta manera el login puede seguir sin header (u otro layout) mientras el resto de páginas comparten el encabezado común.

# INTEGRA2
Repositorio del proyecto de Taller de integracion II, grupo 8 de la UCT
