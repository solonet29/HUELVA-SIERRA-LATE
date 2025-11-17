import React from 'react';
import TownFilter from './TownFilter';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';
import DateRangeFilter from './DateRangeFilter';
import { EventCategory } from '../types';
import CollapsibleFilterSection from './CollapsibleFilterSection';

interface FilterSidebarProps {
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
  onFilterAndClose?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ 
    towns, 
    selectedTown, 
    onSelectTown, 
    searchQuery, 
    onSearchQueryChange,
    selectedCategories,
    onCategoryToggle,
    startDate,
    endDate,
    onDateChange,
    onFilterAndClose,
}) => {

  const handleSelectTownAndClose = (town: string) => {
    onSelectTown(town);
    onFilterAndClose?.();
  };

  const handleCategoryToggleAndClose = (category: EventCategory) => {
    onCategoryToggle(category);
    onFilterAndClose?.();
  };

  const townSelectHandler = onFilterAndClose ? handleSelectTownAndClose : onSelectTown;
  const categoryToggleHandler = onFilterAndClose ? handleCategoryToggleAndClose : onCategoryToggle;

  return (
    <div className="space-y-4 md:space-y-8">
      <CollapsibleFilterSection title="Buscar Evento">
        <SearchBar query={searchQuery} onQueryChange={onSearchQueryChange} />
      </CollapsibleFilterSection>
      <CollapsibleFilterSection title="Filtrar por Fecha">
        <DateRangeFilter 
          startDate={startDate}
          endDate={endDate}
          onDateChange={onDateChange}
        />
      </CollapsibleFilterSection>
      <CollapsibleFilterSection title="Categorías">
        <CategoryFilter 
          selectedCategories={selectedCategories}
          onCategoryToggle={categoryToggleHandler}
        />
      </CollapsibleFilterSection>
      <CollapsibleFilterSection title="Pueblos">
        <TownFilter towns={towns} selectedTown={selectedTown} onSelectTown={townSelectHandler} />
      </CollapsibleFilterSection>
    </div>
  );
};

export default FilterSidebar;