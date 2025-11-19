require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { ObjectId } = require('mongodb');
const clientPromise = require('./api/db.cjs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const getDb = async () => {
  const client = await clientPromise;
  return client.db('huelva_late_events');
};

// GET /api/events - Get all events
app.get('/api/events', async (req, res) => {
  try {
    const db = await getDb();
    const events = await db.collection('eventos').find({}).toArray();
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
    const result = await db.collection('eventos').insertOne(newEvent);
    res.status(201).json({ ...newEvent, _id: result.insertedId });
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
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

    const result = await db.collection('eventos').updateOne(
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

    const result = await db.collection('eventos').deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
