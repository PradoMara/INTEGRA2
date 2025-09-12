/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",         // Azul principal (ajusta según tu branding)
        secondary: "#64748b",       // Gris/azul secundario
        accent: "#a855f7",          // Violeta para botones y detalles
        background: "#f7fafc",      // Fondo claro
        surface: "#ffffff",         // Cards/modal
        error: "#ef4444",           // Rojo para errores
      },
      fontFamily: {
        sans: ["Inter", "Arial", "sans-serif"],
        mono: ["Fira Mono", "monospace"],
      },
      spacing: {
        xs: "4px",
        sm: "8px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      borderRadius: {
        md: "8px",
        lg: "16px",
      },
    },
  },
  plugins: [],
}