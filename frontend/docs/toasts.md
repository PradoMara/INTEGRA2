# Sistema Global de Toasts

El sistema de notificaciones usa `react-hot-toast` con un provider global y una utilidad/hook para disparar mensajes desde cualquier parte.

## Componentes
- `ToastProvider`: Monta el `<Toaster/>` con estilos y tema (insertado en `PageLayout`).
- `notify`: Utilidad en `src/lib/toast.ts` que expone `success`, `error`, `info`, `warning`, `promise`, `dismiss`.
- `useToast()`: Hook ligero que retorna las mismas funciones (`success`, `error`, etc.).

## Uso rápido
```ts
import { notify } from '@/lib/toast'
notify.success('Operación exitosa')
notify.error('Algo falló')
```
O bien:
```ts
import { useToast } from '@/hooks/useToast'
const { success, error } = useToast()
success('Perfil guardado')
error('No se pudo guardar')
```

## Ejemplos implementados
- Ocultar/eliminar publicación: `useHideProduct`, `useDeleteProduct` disparan `success` y `error`.
- Actualizar perfil: `useUpdateUser` dispara `success`/`error` según resultado.

## Convenciones de mensaje
- Cortos, en primera persona/acción directa: `Publicación eliminada`, `Perfil actualizado`, `Error al actualizar perfil`.
- Sin puntos finales salvo que sea frase más larga.

## Tests
Archivo: `src/lib/toast.test.tsx` valida que el wrapper `notify` no produce recursión y llama métodos base.

## Errores comunes
- Recursión: Evitar sobrescribir métodos de `toast` directamente (se resolvió creando objeto separado).
- Entorno de pruebas: Para probar UI del toast, mockear `react-hot-toast` o añadir polyfill de `matchMedia`.

## Próximos pasos (opcional)
- Añadir `notify.promise()` en mutaciones largas para feedback de loading.
- Centralizar catálogo de mensajes para i18n.

