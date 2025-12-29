
import { DailyItinerary, Participant, BookingInfo } from './types';

export const KRW_TO_TWD_RATE = 0.024; // 1 KRW = 0.024 TWD approx

export const DAY_COLORS = [
  '#3b82f6', // Blue
  '#ef4444', // Red
  '#10b981', // Green
  '#f59e0b', // Amber
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  { id: '1', name: 'You' },
  { id: '2', name: 'Alice' },
  { id: '3', name: 'Bob' },
];

export const MOCK_ITINERARY: DailyItinerary[] = [
  {
    id: 'd1',
    dayNumber: 1,
    date: '2024-05-10',
    locations: [
      { id: 'l1', name: 'Gimhae International Airport', time: '10:00', lat: 35.1795, lng: 128.9382 },
      { id: 'l2', name: 'Haeundae Beach', time: '14:00', lat: 35.1587, lng: 129.1604, description: 'Check-in and walk' },
      { id: 'l3', name: 'The Bay 101', time: '19:00', lat: 35.1557, lng: 129.1524, description: 'Dinner and Night View' }
    ]
  },
  {
    id: 'd2',
    dayNumber: 2,
    date: '2024-05-11',
    locations: [
      { id: 'l4', name: 'Gamcheon Culture Village', time: '10:00', lat: 35.0975, lng: 129.0106 },
      { id: 'l5', name: 'Jagalchi Market', time: '13:00', lat: 35.0968, lng: 129.0306 },
      { id: 'l6', name: 'Gwangalli Beach', time: '18:00', lat: 35.1532, lng: 129.1189 }
    ]
  }
];

export const MOCK_BOOKINGS: BookingInfo[] = [
  {
    type: 'flight',
    title: 'TPE -> PUS',
    details: 'Air Busan BX794 | Terminal 1',
    confirmationCode: 'ABC123XYZ',
    date: '2024-05-10 07:15'
  },
  {
    type: 'hotel',
    title: 'Fairfield by Marriott Busan',
    details: '1400 Haeundae-ro, Haeundae-gu',
    confirmationCode: 'RSV-887766',
    date: '2024-05-10 15:00'
  }
];
