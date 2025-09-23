# Guía de Estilos Globales Tailwind — Marketplace UCT

Esta guía indica cómo usar y validar los estilos globales definidos en la configuración Tailwind del proyecto. Sirve como referencia para desarrolladores y responsables de UI/UX, y como checklist previa a la entrega de producto.

---

## 1. Paleta de Colores

Los colores personalizados declarados en `tailwind.config.js` bajo `theme.extend.colors` son los ÚNICOS permitidos para componentes y layouts.  
**No uses valores hex ni nombres de color fuera de esta lista.**

| Nombre        | Uso sugerido             | Valor      | Clase Tailwind         |
|---------------|-------------------------|------------|------------------------|
| primary       | Principal, botones      | #2563eb    | bg-primary, text-primary, border-primary |
| secondary     | Secundario, íconos      | #64748b    | bg-secondary, text-secondary |
| accent        | Acentos (links, badges) | #a855f7    | bg-accent, text-accent |
| background    | Fondo de página         | #d4d8df    | bg-background          |
| surface       | Fondo cards/modals      | #f8fafc    | bg-surface             |
| muted         | Fondo inputs            | #f1f5f9    | bg-muted               |
| border        | Bordes y líneas         | #e2e8f0    | border-border          |
| error         | Errores/alertas         | #dc2626    | bg-error, text-error   |
| success       | Éxito/confirmación      | #16a34a    | bg-success, text-success |
| warning       | Advertencias            | #facc15    | bg-warning, text-warning |
| info          | Mensajes informativos   | #0ea5e9    | bg-info, text-info     |
| text-main     | Texto principal         | #1e293b    | text-text-main         |
| text-secondary| Texto secundario        | #64748b    | text-text-secondary    |
| text-muted    | Texto desactivado       | #94a3b8    | text-text-muted        |

---

## 2. Tipografía

- **Fuente principal:** `Inter`, `Arial`, `sans-serif`
  - Usa la clase `font-sans` para todo texto estándar.
- **Fuente monoespaciada:** `Fira Mono`, `Menlo`, `monospace`
  - Usa la clase `font-mono` para código o etiquetas técnicas.
- **Tamaños:**
  - Usa solo las clases de tamaño definidas (`text-xs`, `text-sm`, `text-md`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`, `text-4xl`, `text-display`).
- **Pesos:**  
  - Usa clases Tailwind estándar como `font-normal`, `font-bold`, etc.

---

## 3. Spacing (Espaciados)

- Utiliza los valores definidos en `theme.extend.spacing` (`xs`, `sm`, `md`, etc.), por ejemplo:
  - `p-md`, `py-lg`, `mt-xl`, `gap-2xl`
- No uses valores custom ni píxeles directos en clases utilitarias.
- Para layouts, utiliza:
  - Grillas (`grid`, `gap-*`)
  - Flexbox (`flex`, `justify-*`, `items-*`, etc.)

---

## 4. Bordes y Radios

- Usa las clases de border-radius personalizadas:
  - `rounded-sm` (4px), `rounded-md` (8px), `rounded-lg` (16px), `rounded-xl` (24px), `rounded-pill` (9999px)
- Bordes:  
  - Usa `border` y `border-border` para líneas y delimitaciones, nunca hex directo.

---

## 5. Sombras

- Utiliza solo las sombras custom:
  - `shadow-card-xs`, `shadow-card-sm`, `shadow-card-md`, `shadow-card-lg`, `shadow-card-xl`
- No uses clases de sombra por defecto de Tailwind si existe una custom equivalente.

---

## 6. Componentes Base y Ejemplos

### Botón primario
```jsx
<button className="bg-primary text-white border border-primary rounded-md px-lg py-sm shadow-card-xs hover:bg-primary/90 focus:ring-2 focus:ring-accent transition">
  Aceptar
</button>
```
### Input de formulario
```jsx
<input className="bg-muted text-text-main border border-border rounded-sm px-md py-sm focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-text-muted transition" placeholder="Ingrese texto" />
```
### Tarjeta
```jsx
<div className="bg-surface border border-border rounded-lg shadow-card-md p-lg">
  <h3 className="text-lg font-bold text-text-main">Título</h3>
  <p className="text-md text-text-secondary">Contenido de la tarjeta</p>
</div>
```

---

## 7. Estados y Accesibilidad

- Usa variantes Tailwind (`hover:`, `focus:`, `disabled:`, `active:`) para todos los estados interactivos.
- **Focus siempre visible**: Usa `focus:ring-*` para indicar foco en botones e inputs.
- **Contraste**: Verifica contraste suficiente entre fondo y texto, especialmente para errores y advertencias.
- **No uses** colores fuera de la paleta global.

---

## 8. Checklist de Validación

- [ ] Todos los colores y sombras usan clases declaradas en Tailwind, no hexas directos.
- [ ] Tipografía y tamaños solo usan clases globales.
- [ ] Espaciados y bordes sólo usan las clases custom.
- [ ] Todos los componentes tienen estados hover/focus/disabled visibles y accesibles.
- [ ] Componentes base (`Button`, `Input`, `Card`, etc.) usan solo utilidades globales.
- [ ] Sección de excepción documentada si hay razones para usar estilos fuera de la guía.
- [ ] Los componentes están listos para agregar animaciones y micro-interacciones (clases `transition`, `duration-*`, etc.).

---

## 9. Sugerencias para Animaciones y Micro-Ajustes

- Deja `transition` y `duration-150` en los elementos interactivos para facilitar la adición de animaciones suaves.
- Usa clases como `ease-in`, `ease-out`, `transition-colors`, etc.
- Señala en los comentarios dónde se requieren micro-interacciones personalizadas para que el responsable UI pueda intervenir fácilmente.

---

## 10. Colaboración y Workflow

- Antes de fusionar PRs, revisa que no haya estilos custom fuera de la configuración global.
- Si necesitas agregar una variante, discútelo con el responsable de UI y actualiza la configuración y la guía.
- Anota cualquier excepción o necesidad especial en el README del componente.

---

## 11. Recursos

- [TailwindCSS Docs](https://tailwindcss.com/docs/theme)
- [Guía de Estilos Visuales UCT](../guia-visual/guia-estilos-visual.md)

---
