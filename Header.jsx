import React, { useState } from 'react';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <header className="bg-white dark:bg-slate-800 shadow-md sticky top-0 z-50 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo y Título */}
                    <div className="flex-shrink-0 flex items-center">
                        <img className="h-8 w-auto" src="/icons/icon-192.svg" alt="Logo Agenda Cultural Huelva" />
                        <span className="ml-3 text-lg sm:text-xl font-display font-bold text-blue-800 dark:text-orange-400 whitespace-nowrap">
                            Huelva Cultural
                        </span>
                    </div>

                    {/* Navegación para pantallas grandes (md y superior) */}
                    <nav className="hidden md:flex items-center space-x-8">
                        <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Inicio</a>
                        <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Pueblos</a>
                        <a href="#" className="text-slate-600 dark:text-slate-300 hover:text-orange-500 dark:hover:text-orange-400 transition-colors">Acerca de</a>
                    </nav>

                    {/* Botón de Menú Hamburguesa para móviles */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700 focus:outline-none"
                        >
                            <span className="sr-only">Abrir menú principal</span>
                            {isMenuOpen ? (
                                // Icono de 'X' para cerrar
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            ) : (
                                // Icono de hamburguesa
                                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Menú desplegable para móviles */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                    <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Inicio</a>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Pueblos</a>
                        <a href="#" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">Acerca de</a>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Header;