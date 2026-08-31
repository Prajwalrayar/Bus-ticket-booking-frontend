import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Booking } from '../models/booking';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BookingService {
  private apiUrl = '/api/bookings';

  constructor(private http: HttpClient) { }

  createBooking(booking: Omit<Booking, 'bookingId'>): Observable<Booking> {
    return this.http.post<ApiResponse<Booking>>(this.apiUrl, booking)
      .pipe(map(res => res.data));
  }

  getBookingById(bookingId: string): Observable<Booking> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/${bookingId}`)
      .pipe(map(res => res.data));
  }

  getMyBookings(): Observable<Booking[]> {
    return this.http.get<ApiResponse<Booking[]>>(`${this.apiUrl}/my`)
      .pipe(map(res => res.data));
  }

  getBookingByReference(ref: string): Observable<Booking> {
    return this.http.get<ApiResponse<Booking>>(`${this.apiUrl}/reference/${ref}`)
      .pipe(map(res => res.data));
  }
}
