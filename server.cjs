// Carga las variables de entorno desde el archivo .env para el desarrollo local
require('dotenv').config();

// Importa la aplicación Express desde el archivo de la API principal.
// Este es el mismo archivo que usa Vercel para producción.
const app = require('./api/index.cjs');

// Define el puerto para el servidor de desarrollo local.
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
