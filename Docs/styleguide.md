# Guía de Estilos - Marketplace UCT

## Paleta de Colores

- **Primario**: Azul (#1E3A8A)
- **Secundario**: Blanco (#FFFFFF)
- **Fondo**: Gris claro (#F3F4F6)
- **Texto**: Gris oscuro (#374151)
- **Enlaces**: Azul claro (#3B82F6)

## Tipografía

- **Fuente principal**: Inter, sans-serif
- **Tamaños**:
  - Títulos: 24px (font-weight: 700)
  - Subtítulos: 18px (font-weight: 600)
  - Texto normal: 16px (font-weight: 400)
  - Texto pequeño: 14px (font-weight: 300)

## Componentes Reutilizables

### Botones

```css
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  color: #FFFFFF;
  background-color: #1E3A8A;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #3B82F6;
}

.btn:disabled {
  background-color: #9CA3AF;
  cursor: not-allowed;
}
```

### Tarjetas

```css
.card {
  background-color: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #374151;
}

.card-content {
  font-size: 16px;
  color: #4B5563;
}
```

### Enlaces

```css
a {
  color: #3B82F6;
  text-decoration: none;
  font-weight: 500;
}

a:hover {
  color: #2563EB;
}
```

## Espaciado

- **Margen**: Usar múltiplos de 8px (8px, 16px, 24px, etc.)
- **Padding**: Usar múltiplos de 8px

## Breakpoints Responsivos

- **Móvil**: Hasta 640px
- **Tablet**: 641px a 1024px
- **Escritorio**: 1025px en adelante

## Convenciones

- Usar clases de Tailwind CSS para estilos rápidos.
- Mantener los estilos específicos en archivos `.module.css` junto al componente.
- Documentar cualquier estilo personalizado en esta guía.

---

Esta guía debe ser actualizada conforme se agreguen nuevos componentes o estilos al proyecto.