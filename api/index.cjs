const express = require('express');
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const mongoUri = process.env.MONGODB_URI;

if (!mongoUri) {
  // En Vercel, las variables de entorno se gestionan en el dashboard.
  // Este error es más para el desarrollo local.
  throw new Error('La variable de entorno MONGODB_URI no está definida.');
}

// Middleware
app.use(cors());
app.use(express.json());

let db;
const client = new MongoClient(mongoUri);

async function connectToDb() {
  if (db) return db;
  await client.connect();
  db = client.db('huelva-late-db');
  return db;
}

app.get('/api/events', async (req, res) => {
  const database = await connectToDb();
  const events = await database.collection('events').find().toArray();
  res.status(200).json(events);
});

module.exports = app;