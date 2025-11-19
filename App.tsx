import React, { useState, useEffect, useMemo, useRef } from 'react';
import { EventType, EventCategory, ChangeInstruction, ChangeAction } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import FilterSidebar from './components/FilterSidebar';
import EventList from './components/EventList';
import EventCalendar from './components/EventCalendar';
import EventDetail from './components/EventDetail';
import AddEventModal from './components/AddEventModal';
import EditEventModal from './components/EditEventModal';
import LoginModal from './components/LoginModal';
import ChangeRequestModal from './components/ChangeRequestModal';
import { TOWNS } from './constants';
import EventMapModal from './components/EventMapModal';
import Hero from './components/Hero';
import InstallPwaModal from './components/InstallPwaModal';
import Toast from './components/Toast';
import { ICONS } from './constants';
import FilterSidebarModal from './components/FilterSidebarModal';

const categoryMap: { [key: string]: EventCategory } = {
  "Pueblo Destacado": EventCategory.PUEBLO_DESTACADO,
  "Belén Viviente": EventCategory.BELEN_VIVIENTE,
  "Campanilleros": EventCategory.CAMPANILLEROS,
  "Cabalgata de Reyes": EventCategory.CABALGATA,
  "Fiesta / Zambomba": EventCategory.FIESTA,
  "Mercado Navideño": EventCategory.MERCADO,
  "Feria Gastronómica": EventCategory.FERIA_GASTRONOMICA,
  "Otro": EventCategory.OTRO,
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [events, setEvents] = useState<EventType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [view, setView] = useState<'list' | 'calendar'>('list');
  
  // Login and Admin State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Modals State
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);
  const [showChangeRequestModal, setShowChangeRequestModal] = useState<ChangeInstruction | null>(null);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showInstallPwaModal, setShowInstallPwaModal] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  
  // Filter State
  const [selectedTown, setSelectedTown] = useState<string>('Todos');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string | null, end: string | null }>({ start: null, end: null });

  // PWA Install Prompt
  const deferredPrompt = useRef<any>(null);
  const listWrapperRef = useRef<HTMLDivElement>(null);

  // Toast State
  const [toast, setToast] = useState<{ message: string; icon: React.ReactNode } | null>(null);

  const showToast = (message: string, icon: React.ReactNode) => {
    setToast({ message, icon });
  };
  
  // FIX: Moved filtering logic before useEffect hooks to resolve the "used before declaration" error.
  // --- FILTERING LOGIC ---

  const isAnyFilterActive = useMemo(() => {
    return selectedTown !== 'Todos' || searchQuery !== '' || selectedCategories.length > 0 || dateRange.start !== null || dateRange.end !== null;
  }, [selectedTown, searchQuery, selectedCategories, dateRange]);

  const activeFilterCount = useMemo(() => {
    return (
        (selectedTown !== 'Todos' ? 1 : 0) +
        (searchQuery ? 1 : 0) +
        selectedCategories.length +
        (dateRange.start || dateRange.end ? 1 : 0)
    );
  }, [selectedTown, searchQuery, selectedCategories, dateRange]);


  const filteredEvents = useMemo(() => {
    let eventsToFilter = events;

    // By search query
    if (searchQuery) {
      eventsToFilter = eventsToFilter.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
        event.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // By town
    if (selectedTown !== 'Todos') {
      eventsToFilter = eventsToFilter.filter(event => event.town === selectedTown);
    }

    // By category
    if (selectedCategories.length > 0) {
      eventsToFilter = eventsToFilter.filter(event => selectedCategories.includes(event.category));
    }
    
    // By date range
    if (dateRange.start || dateRange.end) {
        eventsToFilter = eventsToFilter.filter(event => {
            const eventDate = new Date(event.date + 'T00:00:00');
            const startDate = dateRange.start ? new Date(dateRange.start + 'T00:00:00') : null;
            const endDate = dateRange.end ? new Date(dateRange.end + 'T00:00:00') : null;
            if (startDate && eventDate < startDate) return false;
            if (endDate && eventDate > endDate) return false;
            return true;
        });
    }

    return eventsToFilter;
  }, [events, selectedTown, searchQuery, selectedCategories, dateRange]);

  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null;
    return events.find(event => event.id === selectedEventId);
  }, [selectedEventId, events]);

  // --- EFFECTS ---

  // Load and sort events on initial mount
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/events');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const rawEvents = await response.json();
        
        const initialEventsData: EventType[] = rawEvents.map((event: any) => ({
          ...event,
          category: categoryMap[event.category] || EventCategory.OTRO,
        }));

        const sponsored = initialEventsData.filter(e => e.sponsored);
        const regular = initialEventsData.filter(e => !e.sponsored);

        // Shuffle sponsored events for random order on each visit
        const shuffledSponsored = sponsored.sort(() => 0.5 - Math.random());
        
        // Sort regular events by date
        const sortedRegular = regular.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        
        setEvents([...shuffledSponsored, ...sortedRegular]);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        // Optionally, set an error state to show a message to the user
      }
    };

    fetchEvents();
  }, []);

  // Theme management effect
  useEffect(() => {
    const savedTheme = localStorage.getItem('sierra-navidad-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') {
      setTheme(savedTheme);
    }
  }, []);

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('sierra-navidad-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('sierra-navidad-theme', 'light');
    }
  }, [theme]);
  
  // PWA Install prompt listener
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      deferredPrompt.current = e;
      // Show the install modal only once per session, after a small delay
      if (!sessionStorage.getItem('pwa-install-prompted')) {
          setTimeout(() => {
              setShowInstallPwaModal(true);
              sessionStorage.setItem('pwa-install-prompted', 'true');
          }, 5000); // Show after 5 seconds
      }
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  // Scroll to top of list on filter or view change
  useEffect(() => {
    // When filters change, scroll to the top of the list so the user can see the new results.
    // This runs when filteredEvents or the view (list/calendar) changes.
    if (!selectedEventId && listWrapperRef.current) {
        // A small delay ensures the DOM has updated before we calculate positions.
        setTimeout(() => {
            if (listWrapperRef.current) {
                const header = document.querySelector('header');
                const headerHeight = header ? header.offsetHeight : 80; // Default height as a fallback
                const elementTopPosition = listWrapperRef.current.getBoundingClientRect().top + window.scrollY;
                
                window.scrollTo({
                    top: elementTopPosition - headerHeight - 16, // 1rem margin below sticky header
                    behavior: 'smooth',
                });
            }
        }, 50);
    }
  }, [view, filteredEvents]);


  // --- HANDLERS ---
  
  const handleSelectEvent = (eventId: string) => {
    setSelectedEventId(eventId);
    setView('list'); // Switch to list view to show details
    setShowMapModal(false);
  };
  
  const handleBackToList = () => {
    setSelectedEventId(null);
  };

  const handlePwaInstall = () => {
    setShowInstallPwaModal(false);
    if (deferredPrompt.current) {
        deferredPrompt.current.prompt();
        deferredPrompt.current.userChoice.then((choiceResult: { outcome: string }) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the A2HS prompt');
            }
            deferredPrompt.current = null;
        });
    }
  };
  
  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');
  
  const handleCategoryToggle = (category: EventCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const resetFilters = () => {
    setSelectedTown('Todos');
    setSearchQuery('');
    setSelectedCategories([]);
    setDateRange({ start: null, end: null });
  };
  
  const handleDateChange = (start: string | null, end: string | null) => {
    setDateRange({ start, end });
  };
  
  // Admin Handlers
    const handleLogin = (email: string, password: string) => {
      if (email === import.meta.env.VITE_ADMIN_EMAIL && password === import.meta.env.VITE_ADMIN_PASSWORD) {
        setIsLoggedIn(true);
        setShowLoginModal(false);
        setLoginError(null);
      showToast("Sesión iniciada correctamente", ICONS.eye);
    } else {
      setLoginError("Email o contraseña incorrectos.");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    showToast("Sesión cerrada", ICONS.logout);
  };

  const createChangeRequest = (action: ChangeAction, data: Partial<EventType>) => {
    const instruction: ChangeInstruction = { action, data };
    setShowChangeRequestModal(instruction);
  };
  
  const handleAddEvent = async (eventData: Omit<EventType, 'id'>) => {
    try {
      const response = await fetch('http://localhost:3001/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData),
      });

      if (!response.ok) {
        throw new Error('Failed to add event');
      }

      const newEvent = await response.json();
      setEvents(prev => [newEvent, ...prev]);
      setShowAddModal(false);
      showToast("Evento añadido correctamente", ICONS.check);

    } catch (error) {
      console.error('Error adding event:', error);
      showToast("Error al añadir el evento", ICONS.error);
    }
  };

  const handleUpdateEvent = (updatedEvent: EventType) => {
    setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
    setEditingEvent(null);
    createChangeRequest('UPDATE', updatedEvent);
  };
  
  const handleDeleteEvent = (eventId: string) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    setEditingEvent(null);
    createChangeRequest('DELETE', { id: eventId });
  };


  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen text-slate-800 dark:text-slate-200 font-sans">
      <Header
        view={view}
        setView={setView}
        isMapVisible={showMapModal}
        onMapClick={() => {
            setShowMapModal(true);
            setSelectedEventId(null);
        }}
        theme={theme}
        toggleTheme={toggleTheme}
      />
      
      <main className="container mx-auto px-4 relative">
        {!selectedEventId && <Hero />}
        
        {selectedEvent ? (
          <EventDetail
            event={selectedEvent}
            onBack={handleBackToList}
            isLoggedIn={isLoggedIn}
            onEdit={() => setEditingEvent(selectedEvent)}
            onCategoryFilterClick={(category) => {
                setSelectedEventId(null);
                setSelectedCategories([category]);
            }}
            showToast={showToast}
          />
        ) : (
          <div className="md:grid md:grid-cols-12 md:gap-8" ref={listWrapperRef}>
            <aside className="hidden md:block md:col-span-3 mb-8 md:mb-0">
              <div className="sticky top-28">
                <FilterSidebar
                  towns={TOWNS}
                  selectedTown={selectedTown}
                  onSelectTown={setSelectedTown}
                  searchQuery={searchQuery}
                  onSearchQueryChange={setSearchQuery}
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  startDate={dateRange.start}
                  endDate={dateRange.end}
                  onDateChange={handleDateChange}
                />
              </div>
            </aside>
            <div className="md:col-span-9">
               <div className="md:hidden mb-6">
                 <button 
                     onClick={() => setShowMobileFilters(true)}
                     className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold py-3 px-4 rounded-lg shadow border border-slate-200 dark:border-slate-700"
                 >
                     {ICONS.filter}
                     <span>Filtros</span>
                     {activeFilterCount > 0 && (
                         <span className="bg-amber-400 text-slate-900 text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">{activeFilterCount}</span>
                     )}
                 </button>
              </div>

              {view === 'list' && (
                <EventList
                  events={filteredEvents}
                  onSelectEvent={handleSelectEvent}
                  onResetFilters={resetFilters}
                  onCategoryFilterClick={(category) => setSelectedCategories([category])}
                  isAnyFilterActive={isAnyFilterActive}
                />
              )}
              {view === 'calendar' && (
                <EventCalendar events={filteredEvents} onSelectEvent={handleSelectEvent} />
              )}
            </div>
          </div>
        )}
      </main>
      
      <Footer
        isLoggedIn={isLoggedIn}
        onLoginClick={() => setShowLoginModal(true)}
        onLogoutClick={handleLogout}
        onAddEventClick={() => setShowAddModal(true)}
      />
      
      {/* --- MODALS & TOASTS --- */}
      {showLoginModal && <LoginModal onClose={() => setShowLoginModal(false)} onLogin={handleLogin} error={loginError} />}
      {showAddModal && <AddEventModal onClose={() => setShowAddModal(false)} onAddEvent={handleAddEvent} showToast={showToast} />}
      {editingEvent && <EditEventModal event={editingEvent} onClose={() => setEditingEvent(null)} onUpdate={handleUpdateEvent} onDelete={handleDeleteEvent} />}
      {showChangeRequestModal && <ChangeRequestModal instruction={showChangeRequestModal} onClose={() => setShowChangeRequestModal(null)} />}
      {showMapModal && <EventMapModal events={filteredEvents} onSelectEvent={handleSelectEvent} onClose={() => setShowMapModal(false)} />}
      {showInstallPwaModal && <InstallPwaModal onInstall={handlePwaInstall} onClose={() => setShowInstallPwaModal(false)} />}
      {toast && <Toast message={toast.message} icon={toast.icon} onClose={() => setToast(null)} />}
      {showMobileFilters && (
        <FilterSidebarModal
          onClose={() => setShowMobileFilters(false)}
          resultsCount={filteredEvents.length}
          towns={TOWNS}
          selectedTown={selectedTown}
          onSelectTown={setSelectedTown}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          startDate={dateRange.start}
          endDate={dateRange.end}
          onDateChange={handleDateChange}
        />
      )}
    </div>
  );
};

export default App;