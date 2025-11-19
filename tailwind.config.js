module.exports = {
  darkMode: 'class',
  content: [
    "./index.html",
    "./*.{js,ts,jsx,tsx}", // Escanea archivos en la raíz como App.tsx
    "./components/**/*.{js,ts,jsx,tsx}", // Escanea archivos dentro de la carpeta de componentes
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
