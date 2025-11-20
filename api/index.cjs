const { MongoClient } = require('mongodb');
require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  throw new Error('La variable de entorno MONGODB_URI no está definida.');
}

// Cache de la conexión a la base de datos para reutilizarla entre ejecuciones
let cachedDb = null;
const client = new MongoClient(mongoUri);

async function connectToDb() {
  // Si la conexión ya está cacheada, la devolvemos
  if (cachedDb) {
    console.log('Usando conexión de DB cacheada');
    return cachedDb;
  }
  // Si no, creamos una nueva conexión
  console.log('Creando nueva conexión a la DB');
  await client.connect();
  const db = client.db('huelva-late-db');
  cachedDb = db; // La guardamos en caché para la próxima vez
  return db;
}

/**
 * El handler para la función serverless de Vercel.
 * @param {import('@vercel/node').VercelRequest} req - La petición entrante.
 * @param {import('@vercel/node').VercelResponse} res - La respuesta a enviar.
 */
module.exports = async (req, res) => {
  try {
    const database = await connectToDb();
    console.log('Consultando la colección de eventos...');
    const events = await database.collection('events').find().toArray();
    console.log(`Encontrados ${events.length} eventos.`);
    // Permitimos CORS y establecemos el tipo de contenido
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(events);
  } catch (error) {
    console.error('ERROR FATAL en la función serverless:', error);
    res.status(500).json({ message: 'Error al conectar o consultar la base de datos.', error: error.message });
  }
};