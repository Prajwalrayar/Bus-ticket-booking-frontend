import { Passenger } from "./passenger";

export interface Booking {

  id: number;

  userId: number | null;

  busId: number;

  fromCity: string;

  toCity: string;

  journeyDate: string;

  busName: string;

  seatNumbers: string[];

  passengers: Passenger[];

  totalAmount: number;

  status: 'CONFIRMED' | 'CANCELLED';

  bookingDate: string;

}