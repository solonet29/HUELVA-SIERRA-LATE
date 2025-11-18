const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
// The EVENTS_FILE path needs to be adjusted for the serverless environment
const EVENTS_FILE = path.resolve(process.cwd(), 'events', 'huelva-events.json');

app.use(cors());
app.use(express.json());

// Helper function to read events from the JSON file
const readEvents = () => {
  const data = fs.readFileSync(EVENTS_FILE, 'utf-8');
  return JSON.parse(data);
};

// Helper function to write events to the JSON file
const writeEvents = (events) => {
  fs.writeFileSync(EVENTS_FILE, JSON.stringify(events, null, 2), 'utf-8');
};

// GET /api/events - Get all events
app.get('/api/events', (req, res) => {
  try {
    const events = readEvents();
    res.json(events);
  } catch (error) {
    console.error('Error reading events file:', error);
    res.status(500).json({ message: 'Error reading events file' });
  }
});

// POST /api/events - Add a new event
app.post('/api/events', (req, res) => {
  try {
    const events = readEvents();
    const newEvent = { id: `evt-${new Date().getTime()}`, ...req.body };
    events.push(newEvent);
    writeEvents(events);
    res.status(201).json(newEvent);
  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ message: 'Error creating event' });
  }
});

// PUT /api/events/:id - Update an event
app.put('/api/events/:id', (req, res) => {
  try {
    const events = readEvents();
    const { id } = req.params;
    const eventIndex = events.findIndex(e => e.id === id);

    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const updatedEvent = { ...events[eventIndex], ...req.body };
    events[eventIndex] = updatedEvent;
    writeEvents(events);
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).json({ message: 'Error updating event' });
  }
});

// DELETE /api/events/:id - Delete an event
app.delete('/api/events/:id', (req, res) => {
  try {
    let events = readEvents();
    const { id } = req.params;
    const eventIndex = events.findIndex(e => e.id === id);

    if (eventIndex === -1) {
      return res.status(404).json({ message: 'Event not found' });
    }

    events = events.filter(e => e.id !== id);
    writeEvents(events);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting event:', error);
    res.status(500).json({ message: 'Error deleting event' });
  }
});

// Export the app for Vercel
module.exports = app;
