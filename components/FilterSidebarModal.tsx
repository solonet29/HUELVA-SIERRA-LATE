import React from 'react';
import FilterSidebar from './FilterSidebar';
import { ICONS } from '../constants';
import { EventCategory } from '../types';

interface FilterSidebarModalProps {
    onClose: () => void;
    resultsCount: number;
    // All the props for FilterSidebar
    towns: string[];
    selectedTown: string;
    onSelectTown: (town: string) => void;
    searchQuery: string;
    onSearchQueryChange: (query: string) => void;
    selectedCategories: string[];
    onCategoryToggle: (category: EventCategory) => void;
    startDate: string | null;
    endDate: string | null;
    onDateChange: (start: string | null, end: string | null) => void;
}

const FilterSidebarModal: React.FC<FilterSidebarModalProps> = (props) => {
    const { onClose, resultsCount, ...filterProps } = props;

    const getButtonText = () => {
        if (resultsCount === 1) {
            return `Mostrar (1) Resultado`;
        }
        return `Mostrar (${resultsCount}) Resultados`;
    };

    return (
        <div className="fixed inset-0 bg-black/70 flex flex-col z-50 backdrop-blur-sm md:hidden animate-fade-in">
            <div className="bg-white dark:bg-slate-900 flex-1 flex flex-col max-h-full">
                <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-2xl font-display text-orange-800 dark:text-amber-300">Filtros</h2>
                    <button onClick={onClose} className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white">
                        {ICONS.close}
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto p-4">
                    <FilterSidebar {...filterProps} onFilterAndClose={onClose} />
                </div>
                <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <button 
                        onClick={onClose} 
                        className="w-full bg-amber-400 text-slate-900 font-bold py-3 px-6 rounded-md hover:bg-amber-500 dark:hover:bg-amber-300 transition-colors"
                    >
                        {getButtonText()}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterSidebarModal;