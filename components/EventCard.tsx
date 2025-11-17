import React from 'react';
import { EventType, EventCategory } from '../types';
import { IMAGE_PLACEHOLDER } from '../constants';

const categoryColors: Record<EventCategory, string> = {
  [EventCategory.PUEBLO_DESTACADO]: 'bg-teal-500',
  [EventCategory.BELEN_VIVIENTE]: 'bg-green-500',
  [EventCategory.CAMPANILLEROS]: 'bg-yellow-500',
  [EventCategory.CABALGATA]: 'bg-purple-500',
  [EventCategory.FIESTA]: 'bg-red-500',
  [EventCategory.MERCADO]: 'bg-blue-500',
  [EventCategory.FERIA_GASTRONOMICA]: 'bg-orange-500',
  [EventCategory.OTRO]: 'bg-gray-500',
};

interface EventCardProps {
  event: EventType;
  onSelectEvent: (eventId: string) => void;
  onCategoryFilterClick: (category: EventCategory) => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onSelectEvent, onCategoryFilterClick }) => {
  const { id, title, description, town, date, category, imageUrl, sponsored, externalUrl } = event;

  const isPuebloDestacado = category === EventCategory.PUEBLO_DESTACADO;

  const eventDate = new Date(date + 'T00:00:00');
  const formattedDate = eventDate.toLocaleDateString('es-ES', {
    day: 'numeric',
    month: 'long',
  });
  const weekday = eventDate.toLocaleDateString('es-ES', { weekday: 'long' });

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = IMAGE_PLACEHOLDER;
  };

  const cardContent = (
    <article className="bg-white dark:bg-slate-800 md:rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row group transition-all duration-300 hover:shadow-2xl border border-slate-200 dark:border-slate-700/50 h-full">
      <div className="md:w-2/5 flex-shrink-0 h-56 md:h-auto flex items-center justify-center bg-slate-100 dark:bg-slate-900/50 md:rounded-l-lg">
        <img
            src={imageUrl || IMAGE_PLACEHOLDER}
            alt={`Imagen para ${title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={handleImageError}
            loading="lazy"
        />
      </div>
      <div className="p-6 flex flex-col justify-between flex-grow">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
             {externalUrl ? (
                <span className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full text-white ${categoryColors[category]}`}>
                  Publicidad
                </span>
              ) : (
                <button
                    onClick={(e) => { e.stopPropagation(); onCategoryFilterClick(category); }}
                    className={`inline-block px-2 py-0.5 text-xs font-semibold rounded-full text-white ${categoryColors[category]} transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-amber-400`}
                >
                  {category}
                </button>
            )}
            {sponsored && (
                <span className="flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/50 px-2 py-0.5 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span>Destacado</span>
                </span>
            )}
          </div>
          <h2 className="text-2xl font-display text-orange-800 dark:text-amber-300 mb-2">{title}</h2>
          <p className="text-slate-600 dark:text-slate-400 line-clamp-2 mb-4">{isPuebloDestacado ? `Descubre ${town}, uno de los pueblos con más encanto de la Sierra.` : description}</p>
        </div>
        <div className="mt-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-slate-700 dark:text-slate-300">
            <p className="font-bold text-lg">{town}</p>
            {!isPuebloDestacado && !externalUrl && <p className="text-sm capitalize">{weekday}, {formattedDate}</p>}
          </div>
          <div className="flex items-center gap-2">
            {externalUrl ? (
              <span className="bg-amber-400 text-slate-900 font-bold py-2 px-6 rounded-md flex items-center gap-2">
                  Visitar
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </span>
            ) : (
              <button
                onClick={() => onSelectEvent(id)}
                className="bg-amber-400 text-slate-900 font-bold py-2 px-6 rounded-md hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors whitespace-nowrap"
              >
                {isPuebloDestacado ? 'Descubrir Pueblo' : 'Ver Detalles'}
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );

  if (externalUrl) {
    return (
      <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
        {cardContent}
      </a>
    );
  }

  return cardContent;
};

export default EventCard;