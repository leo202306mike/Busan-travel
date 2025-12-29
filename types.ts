
export interface Location {
  id: string;
  name: string;
  time: string;
  lat: number;
  lng: number;
  description?: string;
}

export interface DailyItinerary {
  id: string;
  date: string;
  dayNumber: number;
  locations: Location[];
}

export interface Participant {
  id: string;
  name: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  currency: 'KRW' | 'TWD';
  paidById: string;
  participantIds: string[];
  date: string;
}

export interface BookingInfo {
  type: 'flight' | 'hotel' | 'other';
  title: string;
  details: string;
  confirmationCode?: string;
  date: string;
}

export enum Tab {
  ITINERARY = 'itinerary',
  EXPENSES = 'expenses',
  BOOKING = 'booking',
  MAP = 'map'
}
