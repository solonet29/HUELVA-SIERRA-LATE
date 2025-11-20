const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Usar el puerto de la variable de entorno o 3000 por defecto
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  console.error('Error: La variable de entorno MONGO_URI no está definida.');
  process.exit(1); // Detiene la aplicación si no hay URI de conexión
}

// Middleware
app.use(cors()); // Habilita CORS para todas las rutas
app.use(express.json()); // Permite al servidor entender JSON

// ---- PARA PRODUCCIÓN ----
// Sirve los archivos estáticos de React generados en la carpeta 'dist'
app.use(express.static(path.join(__dirname, 'dist')));

let db;

// Conectar a MongoDB
MongoClient.connect(mongoUri)
  .then(client => {
    console.log('Conectado a la base de datos MongoDB');
    db = client.db('huelva-late-db'); // Corregido al nombre correcto de la base de datos
  })
  .catch(error => console.error('No se pudo conectar a MongoDB', error));

// Endpoint para obtener todos los eventos
app.get('/api/events', async (req, res) => {
  if (!db) {
    return res.status(500).json({ message: 'La conexión con la base de datos no está establecida.' });
  }
  const events = await db.collection('events').find().toArray(); // El nombre de la colección es 'events'
  res.json(events);
});

// ---- PARA PRODUCCIÓN ----
// Cualquier otra petición que no sea a la API, devuelve el index.html de React
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});