export interface Bus {
  tripId: string;
  travelDate: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
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
  rating: number;
}
