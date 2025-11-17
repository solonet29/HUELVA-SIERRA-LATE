import React from 'react';
import { EventCategory } from '../types';

// Copied from EventCard.tsx for consistency
const categoryColors: Record<EventCategory, string> = {
  // FIX: Added missing PUEBLO_DESTACADO category to resolve TypeScript error.
  [EventCategory.PUEBLO_DESTACADO]: 'bg-teal-500 hover:bg-teal-600',
  [EventCategory.BELEN_VIVIENTE]: 'bg-green-500 hover:bg-green-600',
  [EventCategory.CAMPANILLEROS]: 'bg-yellow-500 hover:bg-yellow-600',
  [EventCategory.CABALGATA]: 'bg-purple-500 hover:bg-purple-600',
  [EventCategory.FIESTA]: 'bg-red-500 hover:bg-red-600',
  [EventCategory.MERCADO]: 'bg-blue-500 hover:bg-blue-600',
  [EventCategory.FERIA_GASTRONOMICA]: 'bg-orange-500 hover:bg-orange-600',
  [EventCategory.OTRO]: 'bg-gray-500 hover:bg-gray-600',
};

const unselectedClasses = 'bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300';

interface CategoryFilterProps {
  selectedCategories: string[];
  onCategoryToggle: (category: EventCategory) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ selectedCategories, onCategoryToggle }) => {
  const allCategories = Object.values(EventCategory);

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map(category => {
        const isSelected = selectedCategories.includes(category);
        return (
          <button
            key={category}
            onClick={() => onCategoryToggle(category)}
            className={`px-3 py-1 text-sm font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-50 dark:focus:ring-offset-slate-800 focus:ring-amber-400
              ${isSelected ? `${categoryColors[category]} text-white` : unselectedClasses}
            `}
          >
            {category}
          </button>
        );
      })}
    </div>
  );
};

export default CategoryFilter;