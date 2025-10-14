# Diagramas de Flujo de Casos Principales — Marketplace UCT

Este documento presenta los diagramas de flujo formales y profesionales para los procesos clave del Marketplace UCT: login institucional, gestión de publicaciones (creación/edición/eliminación), visualización del feed y cierre de sesión. Cada gráfico se acompaña de una explicación que resume su lógica y propósito.

---

## 1. **Login Institucional**

### Explicación

El usuario accede al sistema y realiza el proceso de autenticación con su correo institucional. El sistema valida el dominio y, según corresponda, concede el acceso o muestra un error. Este flujo garantiza que sólo miembros verificados de la UCT pueden ingresar.

### Diagrama

```mermaid
flowchart LR
    Start([Inicio])
    Login["Usuario ingresa a la pantalla de login"]
    InputEmail["Usuario ingresa correo institucional"]
    ValidateDomain["Sistema valida dominio (@alu.uct.cl/@uct.cl)"]
    IsValid{¿Dominio válido?}
    Success["Acceso concedido: Mostrar panel principal"]
    Fail["Acceso denegado: Mostrar mensaje de error"]
    End([Fin])

    Start --> Login --> InputEmail --> ValidateDomain --> IsValid
    IsValid -- Sí --> Success --> End
    IsValid -- No --> Fail --> End
```

---

## 2. **Creación de Publicación**

### Explicación

El usuario accede al formulario para crear una nueva publicación, completa los datos requeridos y envía la solicitud. El sistema valida la información y, si todo es correcto, almacena la publicación; en caso contrario, informa el error y permite la corrección.

### Diagrama

```mermaid
flowchart LR
    Start([Inicio])
    CreatePub["Usuario selecciona 'Crear publicación'"]
    FillForm["Completa formulario (título, descripción, categoría, etc.)"]
    Submit["Envía publicación"]
    Validate["Sistema valida datos"]
    IsValid{¿Datos válidos?}
    Save["Guardar publicación en la base de datos"]
    Confirm["Mostrar confirmación al usuario"]
    Error["Mostrar mensaje de error y permitir corrección"]
    End([Fin])

    Start --> CreatePub --> FillForm --> Submit --> Validate --> IsValid
    IsValid -- Sí --> Save --> Confirm --> End
    IsValid -- No --> Error --> FillForm
```

---

## 3. **Edición/Eliminación de Publicación**

### Explicación

El usuario accede a sus publicaciones y elige editar o eliminar una. El sistema verifica los permisos y valida la acción. Si es válida, actualiza o elimina (oculta) la publicación y confirma el resultado; si no, muestra el error correspondiente.

### Diagrama

```mermaid
flowchart LR
    Start([Inicio])
    AccessPubs["Usuario accede a sus publicaciones"]
    SelectPub["Selecciona publicación"]
    ChooseAction{¿Editar o Eliminar?}
    Edit["Edita campos de la publicación"]
    Delete["Confirma eliminación"]
    SubmitAction["Envía acción"]
    ValidatePerm["Sistema valida permisos y datos"]
    IsValid{¿Acción válida?}
    Update["Actualiza publicación"]
    Hide["Oculta publicación (no elimina historial)"]
    Confirm["Mostrar confirmación"]
    Error["Mostrar mensaje de error"]
    End([Fin])

    Start --> AccessPubs --> SelectPub --> ChooseAction
    ChooseAction -- Editar --> Edit --> SubmitAction
    ChooseAction -- Eliminar --> Delete --> SubmitAction
    SubmitAction --> ValidatePerm --> IsValid
    IsValid -- Sí & Editar --> Update --> Confirm --> End
    IsValid -- Sí & Eliminar --> Hide --> Confirm --> End
    IsValid -- No --> Error --> End
```

---

## 4. **Visualización del Feed**

### Explicación

El usuario navega el feed principal, aplica filtros o realiza búsquedas. El sistema recupera y muestra las publicaciones activas, permitiendo que el usuario revise detalles o contacte al autor.

### Diagrama

```mermaid
flowchart LR
    Start([Inicio])
    OpenFeed["Usuario accede al feed principal"]
    FilterSearch["Selecciona filtros o realiza búsqueda"]
    Retrieve["Sistema recupera publicaciones activas"]
    List["Muestra listado filtrado"]
    Select["Usuario selecciona publicación"]
    Detail["Ver detalles / Contactar autor"]
    End([Fin])

    Start --> OpenFeed --> FilterSearch --> Retrieve --> List --> Select --> Detail --> End
```

---

## 5. **Logout (Cerrar Sesión)**

### Explicación

El usuario opta por cerrar sesión. El sistema invalida la sesión y redirige a la pantalla de inicio, asegurando la protección de la cuenta.

### Diagrama

```mermaid
flowchart LR
    Start([Inicio])
    ClickLogout["Usuario selecciona 'Cerrar sesión'"]
    Invalidate["Sistema invalida sesión"]
    Redirect["Redirige a pantalla de inicio"]
    End([Fin])

    Start --> ClickLogout --> Invalidate --> Redirect --> End
```
