# Dependencias del frontend

Fecha: 2025-10-21  
Fuente: frontend/package.json + salida de npm (resolutions presentadas)

Este documento lista todas las dependencias top-level instaladas en el frontend con la versión resuelta, un breve uso (qué hace en el proyecto) y una justificación concisa (por qué está instalada). Se incluyen tanto dependencias runtime como devDependencies, tal como aparecen en la extracción que proporcionaste.

---

## Dependencias (runtime / uso en la app)

### @tanstack/react-query — 5.90.2
- Uso: Librería para fetching/caching de datos en hooks (queries y mutations) dentro de la UI.
- Justificación: Gestiona estado asíncrono (fetch, cache, invalidation, retries) de forma robusta y reduce complejidad en fetches y sincronización con el servidor. Adecuada para aplicaciones con datos remotos frecuentes.
- Docs: https://tanstack.com/query

### react — 19.1.1
- Uso: Framework principal para construir componentes de la aplicación (.tsx).
- Justificación: Base del frontend; necesaria para cualquier componente y para el runtime React.
- Docs: https://reactjs.org

### react-dom — 19.1.1
- Uso: Renderizado de la app en el DOM (entrypoint, hydrate/renderRoot).
- Justificación: Complemento de React para interacción con el DOM en navegador.
- Docs: https://reactjs.org/docs/react-dom.html

### react-router-dom — 7.9.3
- Uso: Enrutamiento SPA (definición de rutas, navegación, params, rutas anidadas).
- Justificación: Biblioteca estándar para manejo de rutas en aplicaciones React; facilita navegación y layout por rutas.
- Docs: https://reactrouter.com/

---

## DevDependencies (herramientas de build, CSS y tipado)

### vite — 7.1.2
- Uso: Dev server y bundler (scripts `dev`, `build`, `preview`).
- Justificación: Herramienta moderna, rápida y utilizada para desarrollo y packaging en proyectos React con ES modules.
- Docs: https://vitejs.dev/

### @vitejs/plugin-react-swc — 4.0.0
- Uso: Plugin Vite para transformar JSX/TSX usando SWC (mejora velocidad de compilación).
- Justificación: Acelera transformaciones de React comparado con Babel; integración común con Vite.
- Docs: https://github.com/vitejs/vite/tree/main/packages/plugin-react-swc

### typescript — 5.8.3
- Uso: Tipado estático y checks para archivos `.ts`/`.tsx`.
- Justificación: Mejora seguridad de tipos, autocompletado y mantenimiento del código.
- Docs: https://www.typescriptlang.org/

### @types/react — 19.1.10
- Uso: Declaraciones de tipos TypeScript para React.
- Justificación: Necesario para que TypeScript entienda las APIs y tipos de React en el proyecto.
- Docs: https://www.npmjs.com/package/@types/react

### @types/react-dom — 19.1.7
- Uso: Declaraciones de tipos TypeScript para react-dom.
- Justificación: Soporte de tipado para las funciones de react-dom usadas en la app.
- Docs: https://www.npmjs.com/package/@types/react-dom

### tailwindcss — 4.1.15
- Uso: Framework de utilidades CSS (clases Tailwind usadas en los estilos).
- Justificación: Permite estilos rápidos y consistentes via utilidades; elegido por productividad y coherencia en UI.
- Docs: https://tailwindcss.com/

### postcss — 8.5.6
- Uso: Procesador de CSS para pipeline de build (necesario para Tailwind y plugins).
- Justificación: Requerido por Tailwind y por transformaciones de CSS en el build.
- Docs: https://postcss.org/

### autoprefixer — 10.4.21
- Uso: Plugin PostCSS para añadir prefijos vendor según compatibilidad de navegadores.
- Justificación: Garantiza compatibilidad CSS en distintos navegadores sin cambiar código fuente.
- Docs: https://github.com/postcss/autoprefixer

### @tailwindcss/postcss — 4.1.15
- Uso: Integración/compatibilidad entre Tailwind y PostCSS (plugin/helper).
- Justificación: Facilita el procesamiento de Tailwind dentro del pipeline PostCSS.
- Docs: https://www.npmjs.com/package/@tailwindcss/postcss

### @tailwindcss/vite — 4.1.14
- Uso: Plugin que integra Tailwind con Vite.
- Justificación: Conecta Tailwind al proceso de build de Vite y optimiza flujo de desarrollo.
- Docs: https://www.npmjs.com/package/@tailwindcss/vite

### @tailwindcss/postcss (notas)
- Nota: en algunos setups aparece tanto `@tailwindcss/postcss` como `@tailwindcss/vite` para asegurar integración completa entre Tailwind, PostCSS y Vite. Mantenerlos según la configuración de build actual.

### eslint — 9.33.0
- Uso: Linter para detectar errores estáticos y aplicar reglas de estilo.
- Justificación: Mantiene calidad y consistencia del código, se suele integrar en CI y hooks locales.
- Docs: https://eslint.org/

---

## Observaciones finales
- Las versiones mostradas arriba son las resueltas e instaladas según la salida que pegaste (resoluciones de npm).  
- El documento cumple exactamente con lo solicitado: lista completa de dependencias top-level instaladas en el frontend, versión resuelta, uso y justificación para cada una.
- Si necesitás que el archivo sea agregado al repositorio como `frontend/DEPENDENCIES.md`, puedo generar el patch/commit PR (si me das la orden y acceso) o darte el contenido listo para pegar.  