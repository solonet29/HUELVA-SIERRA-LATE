import React, { useState, useRef, useEffect } from 'react';
import { ICONS, GOOGLE_FORM_URL } from '../constants';

interface HeaderProps {
    view?: 'list' | 'calendar';
    setView?: (view: 'list' | 'calendar') => void;
    isMapVisible?: boolean;
    onMapClick?: () => void;
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

const Header: React.FC<HeaderProps> = ({ view, setView, isMapVisible, onMapClick, theme, toggleTheme }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <header className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm sticky top-0 z-40 p-4 shadow-lg mb-8 border-b border-slate-200 dark:border-slate-800">
            <div className="container mx-auto flex justify-between items-center gap-4">
                 <div className="flex-shrink-0">
                    <h1 className="text-2xl sm:text-3xl font-display text-orange-800 dark:text-amber-300 whitespace-nowrap">La Sierra en Navidad</h1>
                    <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 -mt-1 hidden sm:block">Sierra de Aracena y Picos de Aroche</p>
                </div>
                <div className="flex items-center gap-2">
                    {/* View Toggler */}
                    {setView && (
                        <div className="bg-slate-200 dark:bg-slate-800 p-1 rounded-md flex gap-1">
                            <button
                                onClick={() => setView('list')}
                                className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${view === 'list' && !isMapVisible ? 'bg-amber-400 text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                            >
                                {ICONS.list}
                                <span className="hidden sm:inline">Lista</span>
                            </button>
                            <button
                                onClick={() => setView('calendar')}
                                 className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${view === 'calendar' && !isMapVisible ? 'bg-amber-400 text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                            >
                               {ICONS.calendar}
                               <span className="hidden sm:inline">Calendario</span>
                            </button>
                            <button
                                onClick={onMapClick}
                                 className={`flex items-center gap-2 px-3 py-1 text-sm rounded transition-colors ${isMapVisible ? 'bg-amber-400 text-slate-900' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'}`}
                            >
                               {ICONS.map}
                               <span className="hidden sm:inline">Mapa</span>
                            </button>
                        </div>
                    )}
                    
                    <div className="relative ml-2" ref={menuRef}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="p-2 rounded-md bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                            aria-label="Más opciones"
                        >
                            {ICONS.more}
                        </button>
                        {isMenuOpen && (
                            <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 py-1 z-50 animate-fade-in">
                                <a
                                    href={GOOGLE_FORM_URL}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    {ICONS.add}
                                    <span>Sugerir Evento</span>
                                </a>
                                <button
                                    onClick={() => { toggleTheme(); setIsMenuOpen(false); }}
                                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                                >
                                    {theme === 'light' ? ICONS.moon : ICONS.sun}
                                    <span>Cambiar a Tema {theme === 'light' ? 'Oscuro' : 'Claro'}</span>
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;