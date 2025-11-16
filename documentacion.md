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
