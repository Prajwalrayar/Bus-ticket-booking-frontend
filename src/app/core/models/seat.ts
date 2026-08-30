export interface Seat {

  id: number;

  busId: number;

  seatNumber: string;

  status: 'AVAILABLE' | 'OCCUPIED';

}