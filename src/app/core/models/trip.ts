export interface TripSearchRequest {
  source: string;
  destination: string;
  travelDate?: string; // YYYY-MM-DD
  busType?: string;
  minPrice?: number;
  maxPrice?: number;
  departureStart?: string; // HH:mm:ss
  departureEnd?: string; // HH:mm:ss
}

export interface TripDTO {
  tripId: string;
  travelDate: string; // YYYY-MM-DD
  departureTime: string; // HH:mm:ss
  arrivalTime: string; // HH:mm:ss
  baseFare: number;
  isCancelled: boolean;
  cancellationReason: string;
  source: string;
  destination: string;
  busRegistrationNumber: string;
  busType: string;
  amenities: string[];
  operatorName: string;
  totalSeats: number;
  availableSeats: number;
}

export type StopType = 'BOARDING' | 'DROPPING' | 'BOTH';

export interface RouteStopDTO {
  routeStopId: string;
  stopName: string;
  stopSequence: number;
  stopType: StopType;
  distanceFromSourceKm: number;
  source: string;
  destination: string;
}
