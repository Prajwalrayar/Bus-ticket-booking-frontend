import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bus } from '../models/bus';
import { Seat } from '../models/seat';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root',
})
export class BusService {

  private apiUrl = '/api/trips';

  constructor(private http: HttpClient) {}

  searchBuses(fromCity: string, toCity: string, travelDate?: string): Observable<Bus[]> {

    let params = new HttpParams()
      .set('source', fromCity)
      .set('destination', toCity);

    if (travelDate) {
      params = params.set('travelDate', travelDate);
    }

    return this.http.get<ApiResponse<Bus[]>>(`${this.apiUrl}/search`, { params })
      .pipe(map(res => res.data));
  }


  getTripById(id: string): Observable<Bus> {

    return this.http.get<ApiResponse<Bus>>(`${this.apiUrl}/${id}`)
      .pipe(map(res => res.data));
  }


  getSeatsByTripId(
    tripId: string
  ): Observable<Seat[]> {

    return this.http.get<ApiResponse<Seat[]>>(`${this.apiUrl}/${tripId}/seats`)
      .pipe(map(res => res.data));
  }
}
