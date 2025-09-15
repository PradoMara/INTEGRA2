# Planificación Semana 4 — Modularización por Features (Arquitectura Limpia)

Objetivo de la semana: migrar y organizar la app a una estructura modular por features, con separación clara por capas (domain, infrastructure, presentation), rutas por módulo y un punto de composición central del router. Todo el equipo (8 miembros) se enfocará en este objetivo.

---

## Estructura objetivo (por módulo)

Cada módulo debe respetar esta estructura base, siguiendo los principios de arquitectura limpia y sin dependencias circulares:

```
myModule/
 ├─ domain/           # Entidades y casos de uso (tipos, interfaces, lógica pura)
 │   ├─ entities/
 │   └─ usecases/
 ├─ infrastructure/   # Repositorios, API calls, mappers (implementan interfaces del domain)
 │   ├─ api/
 │   └─ repositories/
 ├─ presentation/
 │   ├─ pages/        # Vistas de React asociadas a rutas (una por ruta)
 │   └─ components/   # Componentes del módulo + estilos .module.css
 ├─ routes.ts         # Rutas del módulo (RouteObject[]), idealmente lazy
 └─ index.ts          # Re-export de lo que deba ser visible desde fuera del módulo
```

Reglas clave:
- domain no importa de infrastructure ni de presentation.
- infrastructure puede depender de domain (para implementar interfaces y tipos).
- presentation consume casos de uso y/o repos por inyección (evitar acoplar componentes a implementaciones concretas).
- routes.ts sólo compone páginas del módulo (presentation/pages) y provee loaders/actions si aplica.

---

## Router central y paths

Punto único de composición de rutas y layouts globales:

```
src/
  router/
    index.tsx   # useRoutes o createBrowserRouter: junta TODAS las rutas
    paths.ts    # constantes de paths (evitar strings duplicados)
  presentation/components/PageLayout.tsx
  features/
    auth/
      ...estructura de módulo...
    marketplace/
      ...estructura de módulo...
```

Ejemplo de `paths.ts`:
```ts
export const PATHS = {
  auth: {
    login: '/login',
  },
  app: {
    home: '/',
    crear: '/crear',
    misPublicaciones: '/mis-publicaciones',
    perfil: '/perfil',
  },
} as const
```

Ejemplo de `features/marketplace/routes.ts`:
```ts
import { lazy } from 'react'
import type { RouteObject } from 'react-router-dom'

const HomePage = lazy(() => import('./presentation/pages/HomePage'))
const CrearPublicacionPage = lazy(() => import('./presentation/pages/CrearPublicacionPage'))
const MisPublicacionesPage = lazy(() => import('./presentation/pages/MisPublicacionesPage'))
const PerfilPage = lazy(() => import('./presentation/pages/PerfilPage'))

export const marketplaceRoutes: RouteObject[] = [
  { path: '/', element: <HomePage /> },
  { path: '/crear', element: <CrearPublicacionPage /> },
  { path: '/mis-publicaciones', element: <MisPublicacionesPage /> },
  { path: '/perfil', element: <PerfilPage /> },
]
```

Ejemplo de composición en `router/index.tsx`:
```tsx
import { Suspense } from 'react'
import { RouteObject, useRoutes } from 'react-router-dom'
import PageLayout from '../presentation/components/PageLayout'
import { PATHS } from './paths'
import { marketplaceRoutes } from '../features/marketplace/routes'
import { authRoutes } from '../features/auth/routes'

const withLayout = (routes: RouteObject[]): RouteObject => ({
  element: (
    <PageLayout>
      <Suspense fallback={<div style={{ padding: 24 }}>Cargando…</div>} />
    </PageLayout>
  ),
  children: routes,
})

const routes: RouteObject[] = [
  { path: PATHS.auth.login, children: authRoutes }, // login sin header (o layout propio)
  withLayout(marketplaceRoutes),
  { path: '*', element: <div style={{ padding: 24 }}>404</div> },
]

export default function AppRoutes() {
  return useRoutes(routes)
}
```

Nota: para login sin Header, el módulo auth puede exponer su propia ruta con layout vacío/propio, o declararse fuera del wrapper `withLayout`.

---

## Convenciones y estándares

- Componentes y páginas: PascalCase (`LoginInstitutional.tsx`, `HomePage.tsx`).
- CSS Modules: `Componente.module.css` pegado al componente/página.
- Imports relativos dentro del módulo; desde fuera, usar `index.ts` del módulo.
- Tipos e interfaces exportados desde `domain`.
- Repositorios en `infrastructure/repositories` implementan interfaces del domain.
- Evitar `any`; mantener estricta la `tsconfig`.
- Rutas: usar `PATHS` para `<NavLink to={PATHS.app.crear}>` y navegación programática.
- Lazy loading en `routes.ts` (React.lazy + Suspense en el router central).
- Tests (cuando aplique):
  - domain: unit tests (pura lógica)
  - infrastructure: mocks de API
  - presentation: pruebas ligeras de render/props (opcional esta semana)

---

## Plan de trabajo — 8 miembros

Objetivo único: modularización. Todos contribuyen en paralelo por módulo/área con PRs pequeños y verificables.

- 1) Router & Layout owner
  - Crear `src/router/paths.ts` e `index.tsx`.
  - Integrar `PageLayout` con `Header` para rutas autenticadas.
  - Asegurar `login` queda fuera del layout global.

- 2) Módulo Auth
  - Crear `features/auth/` con `presentation/pages/LoginPage.tsx` (usa el login actual).
  - `routes.ts` del módulo (ruta `/login`).
  - Exponer `index.ts` con lo necesario.

- 3) Módulo Marketplace
  - Migrar páginas actuales (`HomePage`, `CrearPublicacionPage`, `MisPublicacionesPage`, `PerfilPage`) a `features/marketplace/presentation/pages/`.
  - `routes.ts` del módulo.

- 4) Infraestructura/API gateway
  - Mover `infrastructure/api/*` y `infrastructure/repositories/*` bajo features correspondientes (o `shared` si son transversales), respetando interfaces de domain.
  - Definir utilidades de fetch, manejo de errores y baseURL.

- 5) Domain curator
  - Revisar/crear `entities` y `usecases` por módulo; asegurar que `infrastructure` implementa interfaces del domain.

- 6) UI/Design System ligero
  - Revisar consistencia de CSS Modules, tokens básicos (espaciado, radios, sombras), botones y formularios comunes en `src/presentation/components/shared` (si aplica).

- 7) QA + Lint/Types
  - Ejecutar `npm run lint`, revisar errores de tipos al mover archivos.
  - Validar que no existan dependencias cruzadas prohibidas (domain → infra/presentation).

- 8) Integración & Documentación
  - Mantener este documento, registrar decisiones y dudas.
  - Verificar rutas funcionan y lazy loading no rompe navegación.

---


## Definición de Hecho (DoD)

- Compila y navega sin errores (dev y build).
- `eslint` y tipos en verde.
- Estructura por módulo creada (domain/infrastructure/presentation) y sin dependencias invertidas.
- Rutas declaradas por módulo y compuestas en el router central.
- Lazy loading aplicado en páginas.
- Documentación mínima en `routes.ts` e `index.ts` del módulo.

---

## Cómo crear un nuevo módulo (plantilla rápida)

1. Copiar estructura:
```
src/features/nuevoModulo/
  domain/{entities|usecases}
  infrastructure/{api|repositories}
  presentation/{pages,components}
  routes.ts
  index.ts
```
2. Definir entidades y casos de uso en `domain`.
3. Implementar repos en `infrastructure` (cumplen interfaces del domain).
4. Crear páginas y componentes de UI en `presentation`.
5. Exponer rutas en `routes.ts` (React.lazy recomendado).
6. Agregar rutas del módulo en `router/index.tsx`.

