Documentacion test pagina web 

-Problemas con el inicio de session con google, en dispositivos moviles al presionar iniciar session con google no pide password ni correo, accede de forma automatica.
(Error critico)

-momentos en el que hay bugs de scroll en el marketplace

-La zona lateral al momento de scrollear en algunas partes se baja y en otras partes esta estatico

- el sidebar es limitado en aglunas partes 

-bugs de fondo en la parte de chat

## Bugs Críticos Resueltos

### ✅ Bug Crítico #3: Condición de Carrera en Sistema de Mensajería (RESUELTO)
**Fecha**: 15 de noviembre de 2025
**Tipo**: Race Condition / Concurrencia
**Archivos**: ChatPage.tsx, server.js
**Documentación**: Ver `Docs/BugFixes/bug-critico-concurrencia-chat.md`

**Descripción**: 
- Mensajes duplicados aparecían en el chat por condición de carrera entre cliente y servidor
- Desincronización entre mensajes temporales y mensajes guardados en BD
- WebSocket emitía `new_message` causando duplicación en el array de mensajes

**Solución**:
- Implementada deduplicación basada en ID y clientTempId
- Agregado evento `message_sent` para sincronización correcta
- Reemplazo de mensajes temporales en lugar de duplicación
- Logs mejorados para debugging

### ✅ Bug de Prioridad Alta #1: API no devuelve error 404 en GET /api/users/profile (RESUELTO)
**Fecha**: 15 de noviembre de 2025
**Tipo**: Manejo incorrecto de errores HTTP
**Archivos**: Backend/routes/users.js
**Documentación**: Ver `Docs/BugFixes/bug-alta-prioridad-404-profile.md`

**Descripción**:
- Endpoint devolvía error 500 cuando usuario no existía en BD
- Token JWT válido pero userId no encontrado causaba TypeError
- Cliente recibía "Error interno del servidor" en lugar de "Usuario no encontrado"
- Acceso a propiedades de objeto null causaba crash

**Solución**:
- Implementado early return con validación antes de acceder a propiedades
- Respuesta 404 Not Found correcta cuando usuario no existe
- Prevención de TypeError mediante validación anticipada
- Formato de error consistente con el resto de la API
