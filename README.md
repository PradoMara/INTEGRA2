=======
# INTEGRA2
## Entorno y credenciales (seguro)

1) Crea tu archivo `.env` a partir de `.env.example`:

	- Copia `.env.example` a `.env` y completa `VITE_GOOGLE_CLIENT_ID`.
	- Opcional: ajusta `VITE_ALLOWED_EMAIL_DOMAINS` (coma-separado).

2) Seguridad: `.env` ya está ignorado en `.gitignore` y no se debe subir. No subas archivos como `client_secret*.json` al repo.

3) Rotación: si algún secreto fue subido accidentalmente, rota/regenéralo en Google Cloud Console y elimina el archivo del repo (y del historial si procede).

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

##
#
>>>>>>> origin/devs

## Enlace en README

[Diagrama de Secuencia: Publicar y Moderar](./docs/diagramas/diagrama-secuencia-publicar-moderar.md)

[Diagrama de Secuencia: Chat y Notificación](./docs/diagramas/diagrama-secuencia-chat-notificacion.md)

[Diagrama Casos de uso: Usuarios](./Docs/Diagramas/caso-de-uso-usuarios.drawio.xml)

[Diagrama Casos de uso: Admin](./Docs/Diagramas/caso-de-uso-admin.drawio.xml)

[Diagrama arquitectura](./Docs/Diagramas/diagrama-arquitectura-sistema.md)

[Diagrama arquitectura flujo de datos](./Docs/Diagramas/arquitectura_flujo-de-datos.md)