export interface Seat {
  tripSeatId: string;
  seatNumber: string;
  seatPosition: string;
  seatStatus: 'AVAILABLE' | 'TEMPORARILY_LOCKED' | 'BOOKED';
  seatFare: number;
  lockExpiryTime?: string;
}
