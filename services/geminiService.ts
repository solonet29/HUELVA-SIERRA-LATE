import { GoogleGenAI, Type } from "@google/genai";
import { EventType, EventCategory } from '../types';

// FIX: Per coding guidelines, initialize GoogleGenAI without type assertion.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const parseEventsFromText = async (text: string): Promise<Omit<EventType, 'id'>[] | null> => {
  // FIX: Per coding guidelines, the API key is assumed to be present in the environment.
  // The check has been removed.

  // FIX: Separated system instruction from the user prompt for clarity and best practices.
  const systemInstruction = `
    Eres un asistente experto en extraer información de eventos a partir de texto.
    Analiza el siguiente texto y extrae todos los eventos que encuentres.
    Devuelve los eventos como un array JSON que se ajuste al esquema proporcionado.
    Las fechas deben estar en formato YYYY-MM-DD. Si no puedes determinar una fecha exacta, omite el evento.
    Asigna la categoría más apropiada de la lista: "${Object.values(EventCategory).join('", "')}".
    El campo 'town' debe ser uno de los pueblos de la Sierra de Aracena.
  `;
    
  const prompt = `
    Texto de entrada:
    ---
    ${text}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: {
                type: Type.STRING,
                description: "El nombre del evento.",
              },
              description: {
                type: Type.STRING,
                description: "Una breve descripción del evento.",
              },
              town: {
                type: Type.STRING,
                description: "El pueblo donde tiene lugar el evento.",
              },
              date: {
                type: Type.STRING,
                description: "La fecha del evento en formato YYYY-MM-DD.",
              },
              category: {
                type: Type.STRING,
                description: "La categoría del evento.",
                enum: Object.values(EventCategory),
              },
            },
            required: ['title', 'description', 'town', 'date', 'category'],
          },
        },
      },
    });

    // FIX: Use response.text to get the JSON string as per documentation.
    const jsonString = response.text.trim();
    if (jsonString) {
      const parsedEvents = JSON.parse(jsonString);
      return parsedEvents as Omit<EventType, 'id'>[];
    }
    return [];
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    // FIX: Removed alert. Error is handled gracefully in the UI.
    return null;
  }
};

export const generateItinerary = async (event: EventType): Promise<string | null> => {
  const systemInstruction = `
    Eres un guía turístico amigable y entusiasta, experto en la Sierra de Aracena y su gastronomía.
    Tu tarea es crear un plan de un día completo, agradable y realista para un visitante.
    El plan debe girar en torno al evento principal proporcionado.
    Utiliza la "Información de Interés" para sugerir otras actividades como rutas de senderismo o visitas a monumentos.
    Importante: Incluye una sección llamada 'Dónde Comer' con una sugerencia de restaurante local, y otra sección llamada 'Dónde Alojarse' con una sugerencia de casa rural o alojamiento con encanto en la zona.
    Haz hincapié en que son solo sugerencias y el usuario debería verificar la disponibilidad y las reseñas.
    Organiza el plan con títulos claros para diferentes momentos del día (p. ej., 'Por la mañana', 'Hora de comer', 'Tarde de evento', 'Dónde Alojarse').
    Usa un tono cercano y atractivo. La respuesta debe ser solo el plan, sin introducciones ni despedidas.
    Formatea los títulos de las secciones con asteriscos, por ejemplo: **Por la mañana:**
  `;

  const prompt = `
    Crea un plan de un día en ${event.town}.

    Evento principal:
    - Título: ${event.title}
    - Descripción: ${event.description}
    - Fecha: ${event.date}

    Información de Interés sobre ${event.town}:
    ---
    ${event.interestInfo || 'No hay información adicional sobre este pueblo.'}
    ---
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
      },
    });
    
    return response.text;
  } catch (error) {
    console.error("Error generating itinerary with Gemini API:", error);
    return null;
  }
};