export enum EventCategory {
  PUEBLO_DESTACADO = "Pueblo Destacado",
  BELEN_VIVIENTE = "Belén Viviente",
  CAMPANILLEROS = "Campanilleros",
  CABALGATA = "Cabalgata de Reyes",
  FIESTA = "Fiesta / Zambomba",
  MERCADO = "Mercado Navideño",
  FERIA_GASTRONOMICA = "Feria Gastronómica",
  OTRO = "Otro",
}

export interface EventType {
  id: string;
  title: string;
  description: string;
  town: string;
  date: string; // YYYY-MM-DD
  category: EventCategory;
  imageUrl?: string;
  interestInfo?: string; // Información adicional sobre el pueblo, rutas, etc.
  sponsored?: boolean;
  externalUrl?: string;
}

// Types for change instructions
export type ChangeAction = 'CREATE' | 'UPDATE' | 'DELETE';

export interface ChangeInstruction {
  action: ChangeAction;
  data: Partial<EventType>;
}