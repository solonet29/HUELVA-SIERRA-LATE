import React, { useEffect, useState } from 'react';
import { EventType, EventCategory } from '../types';
import { ICONS, IMAGE_PLACEHOLDER } from '../constants';
import InterestInfoModal from './InterestInfoModal';
import PlanMyDayModal from './PlanMyDayModal';

interface EventDetailProps {
  event: EventType;
  onBack: () => void;
  isLoggedIn: boolean;
  onEdit: () => void;
  onCategoryFilterClick: (category: EventCategory) => void;
  showToast: (message: string, icon: React.ReactNode) => void;
}

const categoryColors: Record<EventCategory, { bg: string, text: string, border: string }> = {
  [EventCategory.PUEBLO_DESTACADO]: { bg: 'bg-teal-100 dark:bg-teal-900/50', text: 'text-teal-800 dark:text-teal-300', border: 'border-teal-500' },
  [EventCategory.BELEN_VIVIENTE]: { bg: 'bg-green-100 dark:bg-green-900/50', text: 'text-green-800 dark:text-green-300', border: 'border-green-500' },
  [EventCategory.CAMPANILLEROS]: { bg: 'bg-yellow-100 dark:bg-yellow-900/50', text: 'text-yellow-800 dark:text-yellow-300', border: 'border-yellow-500' },
  [EventCategory.CABALGATA]: { bg: 'bg-purple-100 dark:bg-purple-900/50', text: 'text-purple-800 dark:text-purple-300', border: 'border-purple-500' },
  [EventCategory.FIESTA]: { bg: 'bg-red-100 dark:bg-red-900/50', text: 'text-red-800 dark:text-red-300', border: 'border-red-500' },
  [EventCategory.MERCADO]: { bg: 'bg-blue-100 dark:bg-blue-900/50', text: 'text-blue-800 dark:text-blue-300', border: 'border-blue-500' },
  [EventCategory.FERIA_GASTRONOMICA]: { bg: 'bg-orange-100 dark:bg-orange-900/50', text: 'text-orange-800 dark:text-orange-300', border: 'border-orange-500' },
  [EventCategory.OTRO]: { bg: 'bg-gray-200 dark:bg-gray-700/50', text: 'text-gray-800 dark:text-gray-300', border: 'border-gray-500' },
};

// Helper component to render formatted text with paragraphs, line breaks, and special styling
const FormattedText: React.FC<{ text: string }> = ({ text }) => {
  if (!text) return null;

  return (
    <>
      {text.split(/\n\s*\n/).map((block, index) => {
        const trimmedBlock = block.trim();
        if (!trimmedBlock) return null;

        const lines = trimmedBlock.split('\n');
        const firstLine = lines[0];
        const emojiRegex = /^\p{Emoji}/u;

        if (emojiRegex.test(firstLine)) {
          return (
            <div key={index} className="mt-6 first:mt-0">
              <h3 className="text-2xl font-bold text-amber-500 dark:text-amber-400 mb-3">
                {firstLine}
              </h3>
              {lines.length > 1 && (
                <p className="whitespace-pre-line">
                  {lines.slice(1).join('\n')}
                </p>
              )}
            </div>
          );
        }

        return (
          <p key={index} className="mt-4 first:mt-0 whitespace-pre-line">
            {trimmedBlock}
          </p>
        );
      })}
    </>
  );
};

const EventDetail: React.FC<EventDetailProps> = ({ event, onBack, isLoggedIn, onEdit, onCategoryFilterClick, showToast }) => {
  const { title, description, town, date, category, imageUrl, interestInfo } = event;
  const colors = categoryColors[category] || categoryColors[EventCategory.OTRO];
  const [isReading, setIsReading] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showPlanModal, setShowPlanModal] = useState(false);

  const isPuebloDestacado = category === EventCategory.PUEBLO_DESTACADO;

  const formattedDate = new Date(date + 'T00:00:00').toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(town + ', Huelva, España')}`;

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = IMAGE_PLACEHOLDER;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    return () => {
      window.speechSynthesis.cancel();
      setIsReading(false);
    };
  }, []);

  const handleToggleSpeech = () => {
    if (isReading) {
      window.speechSynthesis.cancel();
      setIsReading(false);
    } else {
      const textToRead = `${title}. ${description}`;
      const utterance = new SpeechSynthesisUtterance(textToRead);
      utterance.lang = 'es-ES';
      utterance.onend = () => setIsReading(false);
      utterance.onerror = () => setIsReading(false);
      window.speechSynthesis.speak(utterance);
      setIsReading(true);
    }
  };

  const handlePlanMyDayClick = () => {
    if (!navigator.onLine) {
      showToast("Necesitas conexión a internet para usar esta función.", ICONS.wifiOff);
      return;
    }
    setShowPlanModal(true);
  };

  const shareUrl = window.location.href;
  const shareText = `¡No te pierdas "${title}" en ${town}! Echa un vistazo a este evento de la Sierra de Aracena:`;
  
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`;
  const emailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(shareText + '\n\n' + shareUrl)}`;

  return (
    <>
      <div className="animate-fade-in max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <button onClick={onBack} className="flex items-center gap-2 text-amber-600 dark:text-amber-300 hover:text-amber-500 dark:hover:text-amber-200 font-bold transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Volver
            </button>
            {isLoggedIn && (
                <button 
                    onClick={onEdit}
                    className="flex items-center gap-2 bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-white font-bold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-500 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536l12.232-12.232z" /></svg>
                    Editar Evento
                </button>
            )}
        </div>

        <article className="bg-white dark:bg-slate-800 rounded-lg shadow-lg overflow-hidden border border-slate-200 dark:border-slate-700/50">
          <div className="w-full h-48 sm:h-64 bg-slate-100 dark:bg-black/20">
              <img 
                src={imageUrl || IMAGE_PLACEHOLDER} 
                alt={`Imagen de ${title}`} 
                className="w-full h-full object-cover" 
                onError={handleImageError}
              />
          </div>
          
          <div className={`p-6 sm:p-8 border-t-4 ${colors.border}`}>
            <button
                onClick={() => onCategoryFilterClick(category)}
                className={`inline-block px-3 py-1 text-xs font-semibold rounded-full mb-4 ${colors.bg} ${colors.text} transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-amber-400`}
            >
              {category}
            </button>
            <h1 className="text-3xl sm:text-4xl font-display text-orange-800 dark:text-amber-300 mb-4">{title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between flex-wrap gap-y-4 gap-x-8 text-slate-700 dark:text-slate-300 mb-6 border-y border-slate-200 dark:border-slate-700/50 py-4">
              <div className='flex flex-col sm:flex-row sm:items-center gap-x-8 gap-y-4'>
                  <div className="flex items-center gap-3">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 dark:text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span className="text-xl font-bold">{town}</span>
                  </div>
                  {!isPuebloDestacado && (
                    <div className="flex items-center gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-500 dark:text-amber-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span className="text-lg font-semibold capitalize">{formattedDate}</span>
                    </div>
                  )}
              </div>
              <div className="flex gap-2 flex-wrap">
                  <button
                     onClick={handlePlanMyDayClick}
                     className="flex items-center justify-center gap-2 bg-purple-100 dark:bg-purple-900/50 text-purple-800 dark:text-purple-300 font-bold py-2 px-4 rounded-md hover:bg-purple-200 dark:hover:bg-purple-900/80 transition-colors text-base"
                   >
                    {ICONS.magic}
                     <span>Planificar mi día</span>
                   </button>
                  {interestInfo && (
                       <button
                         onClick={() => setShowInfoModal(true)}
                         className="flex items-center justify-center gap-2 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-2 px-4 rounded-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors text-base"
                       >
                         {ICONS.map}
                         <span>Info del Pueblo</span>
                       </button>
                  )}
                  <a 
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 bg-sky-600 text-white font-bold py-2 px-4 rounded-md hover:bg-sky-500 transition-colors text-base"
                  >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10l6-3m0 0l-6-3m6 3V7" /></svg>
                      <span>Cómo llegar</span>
                  </a>
              </div>
            </div>
            
            <div className="text-slate-700 dark:text-slate-300 text-base sm:text-lg leading-relaxed mb-8">
              <FormattedText text={description} />
            </div>

            <div className="pt-6 border-t border-slate-200 dark:border-slate-700/50">
              <div className="flex justify-between items-center mb-3">
                <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Comparte este evento</h3>
                <button 
                  onClick={handleToggleSpeech} 
                  title={isReading ? 'Detener lectura' : 'Leer descripción'} 
                  className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-white transition-colors"
                >
                  {isReading ? ICONS.speakerOff : ICONS.speaker}
                </button>
              </div>
              <div className="flex items-center gap-4">
                <a href={twitterUrl} target="_blank" rel="noopener noreferrer" title="Compartir en X/Twitter" className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-white transition-colors">
                  {ICONS.twitter}
                </a>
                <a href={facebookUrl} target="_blank" rel="noopener noreferrer" title="Compartir en Facebook" className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-white transition-colors">
                  {ICONS.facebook}
                </a>
                <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" title="Compartir en WhatsApp" className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-white transition-colors">
                  {ICONS.whatsapp}
                </a>
                <a href={emailUrl} title="Compartir por Email" className="p-3 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-600 hover:text-white transition-colors">
                  {ICONS.email}
                </a>
              </div>
            </div>

          </div>
        </article>
      </div>

      {showInfoModal && interestInfo && (
        <InterestInfoModal
          town={town}
          content={interestInfo}
          onClose={() => setShowInfoModal(false)}
        />
      )}

      {showPlanModal && (
        <PlanMyDayModal
          event={event}
          onClose={() => setShowPlanModal(false)}
        />
      )}
    </>
  );
};

export default EventDetail;