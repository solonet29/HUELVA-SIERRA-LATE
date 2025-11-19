const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const clientPromise = require('./db.cjs');

const { GoogleGenerativeAI } = require('@google/genai');
const app = express();
app.use(cors());
app.use(express.json());

const getDb = async () => {
  const client = await clientPromise;
  return client.db('huelva-late-db');
};

// GET /api/events - Get all events
app.get('/api/events', async (req, res) => {
  try {
    const db = await getDb();
    // Comprueba si la colección existe antes de consultarla
    const collections = await db.listCollections({ name: 'events' }).toArray();
    if (collections.length === 0) {
      // Si la colección no existe, devuelve un array vacío para evitar errores.
      return res.json([]);
    }
    const events = await db.collection('events').find({}).toArray(); // Ahora esta línea es más segura
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).json({ message: 'Error fetching events' });
  }
});

// POST /api/events - Add a new event
app.post('/api/events', async (req, res) => {
  try {
    const db = await getDb();
    const newEvent = req.body;
    const result = await db.collection('events').insertOne(newEvent);
    res.status(201).json({ ...newEvent, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// ENDPOINT para analizar texto y crear eventos con IA
app.post('/api/parse-events', async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'El texto es obligatorio.' });
    }

    // Usamos la API Key de forma segura desde el backend
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `
      Analiza el siguiente texto y extrae los eventos en un formato JSON. Cada evento debe tener: title, description, town, date (en formato YYYY-MM-DD), y category.
      Las categorías válidas son: "Pueblo Destacado", "Belén Viviente", "Campanilleros", "Cabalgata de Reyes", "Fiesta / Zambomba", "Mercado Navideño", "Feria Gastronómica", "Otro".
      Si no puedes determinar una categoría, usa "Otro". La fecha debe ser del año actual o el siguiente si corresponde (ej. Enero).
      Texto: "${text}"
      Responde únicamente con un array JSON de los eventos. Si no encuentras ninguno, responde con un array vacío [].
    `;

    const result = await model.generateContent(prompt);
    const responseText = await result.response.text();

    // Limpiar la respuesta para asegurarse de que es un JSON válido
    const jsonResponse = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const events = JSON.parse(jsonResponse);

    res.json(events);

  } catch (error) {
    console.error('Error procesando texto con Gemini:', error);
    res.status(500).json({ message: 'Error al procesar el texto con la IA.' });
  }
});

// NUEVO ENDPOINT para la IA de Gemini
app.post('/api/generate-description', async (req, res) => {
  try {
    const { title, town } = req.body;

    if (!title || !town) {
      return res.status(400).json({ message: 'El título y el pueblo son obligatorios.' });
    }

    // Usamos la API Key de forma segura desde el backend
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Crea una descripción atractiva y breve para un evento llamado "${title}" que tendrá lugar en ${town}, en la Sierra de Huelva. El tono debe ser cercano y sugerente, invitando a la gente a asistir. No incluyas la fecha ni el lugar, solo la descripción del evento.`;

    const result = await model.generateContent(prompt);
    const description = await result.response.text();

    res.json({ description });
  } catch (error) {
    console.error('Error generando la descripción con Gemini:', error);
    res.status(500).json({ message: 'Error al generar la descripción.' });
  }
});

// ENDPOINT para generar itinerario con IA
app.post('/api/generate-itinerary', async (req, res) => {
  try {
    const { event } = req.body;
    if (!event) {
      return res.status(400).json({ message: 'El evento es obligatorio.' });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

    const prompt = `Crea un plan de un día para visitar el pueblo de ${event.town} en la Sierra de Huelva, centrado en el evento "${event.title}". Sugiere un plan para la mañana, un lugar para almorzar comida típica, un plan para la tarde y un lugar para cenar. El tono debe ser el de un guía turístico local, cercano y amigable. Formatea la respuesta con títulos para cada sección (ej. **Mañana: Un Paseo con Historia**).`;

    const result = await model.generateContent(prompt);
    const itinerary = await result.response.text();

    res.json({ itinerary });

  } catch (error) {
    console.error('Error generando itinerario con Gemini:', error);
    res.status(500).json({ message: 'Error al generar el itinerario.' });
  }
});

// PUT /api/events/:id - Update an event
app.put('/api/events/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;
    const { _id, ...updatedEventData } = req.body;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const result = await db.collection('events').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedEventData }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json({ _id: id, ...updatedEventData });
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// DELETE /api/events/:id - Delete an event
app.delete('/api/events/:id', async (req, res) => {
  try {
    const db = await getDb();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid event ID' });
    }

    const result = await db.collection('events').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// Export the app for Vercel
module.exports = app;
