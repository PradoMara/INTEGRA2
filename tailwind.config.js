/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        // Colores principales
        primary: "#2563eb",         // azul intenso
        secondary: "#64748b",       // gris azulado
        accent: "#a855f7",          // púrpura/acento
        // Fondo y superficie
        background: "#d4d8df",      // gris claro para fondo de la página
        surface: "#f8fafc",         // fondo para cards y modals
        // Grises neutrales
        muted: "#f1f5f9",           // gris muy claro (inputs)
        border: "#e2e8f0",          // bordes y líneas
        error: "#dc2626",           // rojo para errores
        success: "#16a34a",         // verde para éxito
        warning: "#facc15",         // amarillo para advertencias
        info: "#0ea5e9",            // azul claro para info
        // Textos
        "text-main": "#1e293b",     // texto principal
        "text-secondary": "#64748b",// texto secundario
        "text-muted": "#94a3b8",    // texto desactivado
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        mono: ["Fira Mono", "Menlo", "monospace"],
      },
      fontSize: {
        xs: '0.75rem',      // 12px
        sm: '0.875rem',     // 14px
        base: '1rem',       // 16px
        md: '1.125rem',     // 18px
        lg: '1.25rem',      // 20px
        xl: '1.5rem',       // 24px
        '2xl': '2rem',      // 32px
        '3xl': '2.5rem',    // 40px
        '4xl': '3rem',      // 48px
        display: '4rem',    // 64px
      },
      spacing: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
        '2xl': '40px',
        '3xl': '48px',
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        xl: '24px',
        pill: '9999px',
      },
      boxShadow: {
        // Sombras para cards y elementos elevados
        'card-xs': '0 1px 2px 0 rgba(60,72,88,0.08)',
        'card-sm': '0 2px 8px 0 rgba(60,72,88,0.10)',
        'card-md': '0 4px 16px 0 rgba(60,72,88,0.15)',
        'card-lg': '0 8px 32px 0 rgba(60,72,88,0.22)',
        'card-xl': '0 16px 48px 0 rgba(60,72,88,0.32)',
      },
    },
  },
  plugins: [],
}