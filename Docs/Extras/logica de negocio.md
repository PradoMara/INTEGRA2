# Planificacion de la Logica de Negocio — Marketplace UCT

Este documento describe como debe funcionar la logica central del marketplace universitario, alineado a los objetivos y estructura definidos para la plataforma.

---

## 1. Autenticacion y Usuarios

- El acceso se realiza con cuentas institucionales usando Google OAuth 2.0, permitiendo solo correos de la UCT.
- Se asignan roles (usuario, administrador) y se controla el estado de cada cuenta.
- Cada usuario debe registrar su campus y puede consultar su reputacion y actividad desde el perfil.

## 2. Publicaciones

- Los usuarios pueden crear, editar, eliminar y listar publicaciones.
- Es posible filtrar anuncios por categorias y subcategorias.
- Al eliminar una publicacion, esta queda oculta del feed pero se mantiene en la base de datos.
- Todos los anuncios deben cumplir reglas de formato y validacion, como precios correctos y datos obligatorios.

## 3. Transacciones y Reputacion

- Las transacciones requieren confirmacion tanto del comprador como del vendedor antes de darse por completadas.
- Al finalizar una operacion, ambas partes deben calificarse mutuamente.
- Las calificaciones afectan la reputacion y la visibilidad de los usuarios en el sistema.
- El perfil del usuario muestra su historial de publicaciones, compras, ventas y reputacion.

## 4. Mensajeria Interna

- Los usuarios pueden comunicarse directamente a traves de un sistema de mensajeria dentro de la plataforma.
- Se debe registrar el campus principal y los lugares preferidos para las entregas, visibles en el perfil y en los anuncios.

## 5. Moderacion y Reportes

- Es posible reportar tanto publicaciones como usuarios si se detecta actividad sospechosa o inapropiada.
- Los reportes llegan a un panel de administracion donde los moderadores pueden revisarlos y tomar acciones.
- El sistema incluye filtros para bloquear lenguaje ofensivo.

## 6. Comunidad y Foros

- Existe una seccion de foros tematicos y un foro general para la comunidad universitaria.
- Solo los usuarios verificados pueden participar.
- Se implementan herramientas automaticas y manuales para moderar el contenido.

## 7. Notificaciones y Paneles

- El sistema envia notificaciones internas sobre eventos importantes (mensajes, confirmaciones de transaccion, etc.).
- Cada usuario cuenta con un panel donde puede ver un resumen de su actividad y notificaciones.
- Los administradores disponen de un dashboard con metricas clave y acceso a la moderacion.

## 8. Modelo de Datos

- La base de datos incluye tablas para usuarios, publicaciones, transacciones, reportes, roles, estados, ubicaciones y seguidores.
- El diseno garantiza integridad y facilita la escalabilidad.

## 9. Separacion de Responsabilidades

- El frontend y el backend estan claramente separados.
- Se usan casos de uso e interfaces para mantener la logica desacoplada y facil de mantener o probar.

## 10. Pruebas y Validaciones

- Se realizan pruebas unitarias para los flujos criticos y pruebas de integracion para verificar la interaccion entre los modulos principales.

---

Esta logica de negocio busca ofrecer una experiencia segura, fluida y confiable, adaptada a las necesidades de la comunidad universitaria de la UCT.
