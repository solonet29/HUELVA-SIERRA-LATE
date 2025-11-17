import React, { useEffect, useRef, useState, useMemo } from 'react';
import { EventType } from '../types';
import { townCoordinates } from '../data/townCoordinates';

// Leaflet is loaded from a script in index.html, so we declare it here to satisfy TypeScript
declare const L: any;

interface EventMapProps {
    events: EventType[];
    onSelectEvent: (eventId: string) => void;
}

const EventMap: React.FC<EventMapProps> = ({ events, onSelectEvent }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const mapRef = useRef<any | null>(null);
    const markersRef = useRef<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    
    const eventsForMap = useMemo(() => events.filter(e => !e.externalUrl), [events]);

    // Initialize map effect
    useEffect(() => {
        if (mapContainerRef.current && !mapRef.current) {
            // Initialize map WITHOUT setting a view. The second effect will handle it.
            const map = L.map(mapContainerRef.current, {
                scrollWheelZoom: true 
            });

            const tileLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: 'abcd',
                maxZoom: 20
            });

            tileLayer.on('loading', () => setIsLoading(true));
            tileLayer.on('load', () => setIsLoading(false));
            tileLayer.on('tileerror', () => {
                setIsLoading(false);
            });

            tileLayer.addTo(map);
            
            mapRef.current = map;
        }
    }, []); // Runs only once to create the map instance

    // This effect is now responsible for resizing and positioning the map
    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        // We wait a bit for the modal to be laid out,
        // then tell Leaflet to check its container size, and *then* we set the view.
        const timer = setTimeout(() => {
            map.invalidateSize(); // Recalculate container size

            markersRef.current.forEach(marker => marker.remove());
            markersRef.current = [];

            const markerBounds: [number, number][] = [];

            eventsForMap.forEach(event => {
                const coords = townCoordinates[event.town];
                if (coords) {
                    const popupContent = `
                        <div class="p-1 text-slate-800">
                            <h3 class="font-display text-lg text-slate-800 mb-1">${event.title}</h3>
                            <p class="text-sm text-slate-600 font-bold mb-2">${event.town}</p>
                            <button id="popup-btn-${event.id}" class="w-full bg-amber-400 text-slate-900 text-xs font-bold py-1 px-2 rounded hover:bg-amber-300 transition-colors">
                                Ver Detalles
                            </button>
                        </div>
                    `;

                    const marker = L.marker(coords).addTo(map).bindPopup(popupContent);

                    marker.on('popupopen', () => {
                        const button = document.getElementById(`popup-btn-${event.id}`);
                        if (button) {
                            button.onclick = () => onSelectEvent(event.id);
                        }
                    });

                    markersRef.current.push(marker);
                    markerBounds.push(coords);
                }
            });

            if (markerBounds.length > 1) { // fitBounds is better for more than one point
                map.fitBounds(markerBounds, { padding: [50, 50], maxZoom: 14 });
            } else if (markerBounds.length === 1) { // For a single point, setView provides a better experience
                map.setView(markerBounds[0], 13); // Zoom level 13 for a single town
            } else {
                // If no events, center on the whole region
                map.setView([37.9, -6.7], 9);
            }
        }, 150); // A small delay is still needed for rendering within the modal

        return () => clearTimeout(timer);

    }, [eventsForMap, onSelectEvent]);

    return (
        <div className="h-full w-full relative">
            {/* The map container is always present */}
            <div ref={mapContainerRef} className="h-full w-full bg-slate-200" />
            
            {/* Loading spinner overlay */}
            {isLoading && (
                 <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-[1001] pointer-events-none animate-fade-in">
                    <div className="text-center p-4">
                         <svg className="animate-spin h-10 w-10 text-amber-500 mx-auto" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <p className="text-slate-600 mt-4 text-lg font-display">Cargando mapa...</p>
                    </div>
                </div>
            )}
            
            {/* "No events" overlay */}
            {!isLoading && eventsForMap.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center bg-white/50 z-[1000] pointer-events-none animate-fade-in">
                    <div className="text-center p-4 bg-white/80 rounded-lg shadow-2xl">
                        <h3 className="text-xl font-bold text-slate-600 font-display">No hay eventos que mostrar</h3>
                        <p className="text-slate-500 mt-1">Prueba a seleccionar otros filtros.</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventMap;