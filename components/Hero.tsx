import React from 'react';

const Hero: React.FC = () => {
    return (
        <div className="mb-6 md:mb-8 animate-fade-in">
            <a 
                href="http://www.turismohuelva.org/inicio/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block rounded-lg overflow-hidden shadow-lg hover:opacity-90 transition-opacity border border-slate-200 dark:border-slate-700"
                aria-label="Publicidad de Turismo Huelva"
            >
                <img 
                    src="https://solonet.es/wp-content/uploads/2025/10/BANNER-HUELVA.webp" 
                    alt="Publicidad de Huelva, la provincia que lo tiene todo." 
                    className="w-full h-auto object-cover"
                />
            </a>
        </div>
    );
};

export default Hero;