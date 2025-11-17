
import React from 'react';

interface TownFilterProps {
  towns: string[];
  selectedTown: string;
  onSelectTown: (town: string) => void;
}

const TownFilter: React.FC<TownFilterProps> = ({ towns, selectedTown, onSelectTown }) => {
  const allTowns = ['Todos', ...towns];

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-2 md:max-h-[calc(70vh-150px)]">
      {allTowns.map(town => {
        if (town === '---SEPARATOR---') {
          return (
            <div key="separator" className="py-2 px-2">
              <hr className="border-t border-slate-200 dark:border-slate-700" />
            </div>
          );
        }

        return (
          <button
            key={town}
            onClick={() => onSelectTown(town)}
            className={`w-full text-left p-2 rounded-md transition-colors text-base ${
              selectedTown === town
                ? 'bg-amber-400 text-slate-900 font-bold'
                : 'text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
            }`}
          >
            {town}
          </button>
        );
      })}
    </div>
  );
};

export default TownFilter;