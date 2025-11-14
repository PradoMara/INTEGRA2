# Caso de Uso: Usuario — Marketplace UCT

## Actores
- **Usuario (Profesor/Estudiante):** Interactúa con el sistema para todas las acciones principales (registro, perfil, publicaciones, compras, historial, etc.).
- **Google OAuth 2.0:** Servicio externo para validación y autenticación institucional.

## Objetivo
Permitir que usuarios verificados puedan registrarse, iniciar sesión, gestionar su perfil, publicar y comprar productos/servicios, consultar historial y realizar operaciones seguras dentro del marketplace universitario.

## Casos de Uso Principales (según el diagrama .xml)
- **Registrarse:** Alta de usuario con validación institucional.
- **Iniciar sesión:** Acceso seguro mediante credencial institucional.
- **Configuración de perfil:** Gestión de datos personales y preferencias.
- **Cancelar venta activa:** Permite al usuario anular una transacción pendiente.
- **Consultar historial de ventas:** Visualización de compras y ventas previas.
- **Ver vista de ventas:** Muestra las publicaciones activas y pasadas.
- **Realizar compra:** Proceso de adquisición de productos o servicios.
- **Validar credencial:** Extensión de “Registrarse” para verificar autenticidad con Google OAuth.
- **Realizar publicación de venta:** Extensión de “Ver vista de ventas” para publicar un nuevo producto/servicio.

## Relaciones
- El **usuario** realiza todos los casos de uso descritos.
- **Google OAuth** se conecta al proceso de “Validar credencial”, que extiende al registro.
- El flujo de publicación y compra está integrado a la visualización y gestión del historial.

## Diagrama de casos de uso

- [Diagrama editable (.xml)](../Diagramas/caso-de-uso-usuarios.drawio.xml)

## Flujo típico (ejemplo)

1. El usuario se registra con correo institucional y valida credencial (Google OAuth).
2. Configura su perfil y preferencias.
3. Publica productos o servicios en “Ver vista de ventas”.
4. Consulta historial de ventas y compras.
5. Realiza compras o cancela ventas activas según corresponda.

## Consideraciones

- **Solo hay dos actores:** Usuario y Google OAuth.
- Todas las funciones de compra/venta, gestión y autenticación están cubiertas por estos actores.
- El administrador y otros usuarios no aparecen como actores directos en este diagrama; estarían en el diagrama de casos de uso de “Administrador”.

---
