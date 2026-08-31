import { BookingSeat } from './booking-seat';

export interface Booking {

  bookingId: string;

  bookingReference: string;

  bookingStatus: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'EXPIRED';

  totalSeats: number;

  baseFareTotal: number;

  discountAmount: number;

  taxAmount: number;

  insuranceAmount: number;

  totalAmount: number;

  createdAt: string;

  boardingPointName: string;

  droppingPointName: string;

  userId: string;

  tripId: string;

  bookingSeats: BookingSeat[];

}
