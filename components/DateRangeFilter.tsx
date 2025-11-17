import React from 'react';

interface DateRangeFilterProps {
  startDate: string | null;
  endDate: string | null;
  onDateChange: (start: string | null, end: string | null) => void;
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({ startDate, endDate, onDateChange }) => {

  const handlePresetClick = (preset: 'today' | 'weekend' | 'week') => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to start of day

    let start: Date = new Date(today);
    let end: Date = new Date(today);

    switch (preset) {
      case 'today':
        // Start and end are today
        break;
      case 'weekend':
        const dayOfWeek = today.getDay(); // Sunday = 0, Saturday = 6
        const daysUntilSaturday = (6 - dayOfWeek + 7) % 7;
        start.setDate(today.getDate() + daysUntilSaturday);
        end.setDate(start.getDate() + 1); // Sunday is one day after Saturday
        break;
      case 'week':
        end.setDate(today.getDate() + 6); // Today + next 6 days = 7 days total
        break;
    }

    onDateChange(start.toISOString().split('T')[0], end.toISOString().split('T')[0]);
  };
  
  const handleClear = () => {
    onDateChange(null, null);
  };

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label htmlFor="start-date" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Desde</label>
          <input
            type="date"
            id="start-date"
            value={startDate || ''}
            onChange={(e) => onDateChange(e.target.value, endDate)}
            className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-amber-400 focus:border-amber-400 text-sm"
          />
        </div>
        <div>
          <label htmlFor="end-date" className="block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Hasta</label>
          <input
            type="date"
            id="end-date"
            value={endDate || ''}
            onChange={(e) => onDateChange(startDate, e.target.value)}
            className="w-full p-2 bg-slate-100 dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-amber-400 focus:border-amber-400 text-sm"
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-2">
          <button onClick={() => handlePresetClick('today')} className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Hoy</button>
          <button onClick={() => handlePresetClick('weekend')} className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Fin de semana</button>
          <button onClick={() => handlePresetClick('week')} className="text-xs px-2 py-1 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">Próximos 7 días</button>
      </div>
       {(startDate || endDate) && (
        <button
          onClick={handleClear}
          className="w-full text-center p-2 rounded-md transition-colors text-sm text-amber-600 dark:text-amber-300 hover:bg-slate-200 dark:hover:bg-slate-700"
        >
          Limpiar Fechas
        </button>
      )}
    </div>
  );
};

export default DateRangeFilter;