import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';

// --- INSTRUCCIONES ---
// 1. Asegúrate de tener MongoDB instalado y corriendo.
// 2. Instala el driver de MongoDB para Node.js si no lo has hecho:
//    npm install mongodb
// 3. Configura tu cadena de conexión a MongoDB a continuación.
// 4. Ejecuta este script desde la raíz de tu proyecto:
//    node scripts/import-events.js

// --- CONFIGURACIÓN DE LA BASE DE DATOS ---

// Descomenta la línea que corresponda o añade la tuya.
// Conexión local (asegúrate de que MongoDB esté corriendo en tu máquina)
const uri = 'mongodb://localhost:27017'; 
// Conexión a un servidor remoto (reemplaza con tu connection string de MongoDB Atlas u otro proveedor)
// const uri = 'TU_CONNECTION_STRING_A_MONGODB_ATLAS';

const dbName = 'agenda-cultural-huelva';
const collectionName = 'events';
const jsonFilePath = path.resolve(process.cwd(), 'eventos_finales.json');

// --- SCRIPT DE IMPORTACIÓN ---

async function importEvents() {
  // Limpiar la URI de conexión de opciones no soportadas
  const url = new URL(uri);
  url.searchParams.delete('useNewUrlParser');
  url.searchParams.delete('useUnifiedTopology');
  const cleanedUri = url.toString();

  const client = new MongoClient(cleanedUri);

  try {
    // Conectar al servidor de MongoDB
    await client.connect();
    console.log('Conectado exitosamente a MongoDB.');

    const database = client.db(dbName);
    const collection = database.collection(collectionName);

    // Leer el archivo JSON
    console.log(`Leyendo eventos desde ${jsonFilePath}...`);
    const eventsData = JSON.parse(fs.readFileSync(jsonFilePath, 'utf-8'));

    if (!Array.isArray(eventsData)) {
      throw new Error('El archivo JSON no contiene un array de eventos.');
    }

    // Limpiar la colección existente para evitar duplicados
    console.log(`Limpiando la colección '${collectionName}'...`);
    await collection.deleteMany({});

    // Insertar los nuevos eventos
    console.log(`Insertando ${eventsData.length} eventos en la colección '${collectionName}'...`);
    const result = await collection.insertMany(eventsData);
    console.log(`${result.insertedCount} eventos han sido importados exitosamente.`);

  } catch (err) {
    console.error('Ha ocurrido un error durante el proceso de importación:', err);
  } finally {
    // Asegurarse de que el cliente se cierre al finalizar
    await client.close();
    console.log('Conexión a MongoDB cerrada.');
  }
}

importEvents();