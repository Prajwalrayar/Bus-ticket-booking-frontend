import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Bus } from '../models/bus';
import { Seat } from '../models/seat';

@Injectable({
  providedIn: 'root',
})
export class BusService {

  private  apiUrl = 'http://localhost:3000/buses';

  private seatApiUrl = 'http://localhost:3000/seats';

  constructor(private http: HttpClient) {}

  searchBuses(fromCity: string,toCity: string): Observable<Bus[]> {

    const params = new HttpParams()
      .set('fromCity', fromCity)
      .set('toCity', toCity);

    return this.http.get<Bus[]>(this.apiUrl,{ params });
  }


  // ==========================================================
  // GET BUS BY ID
  // ==========================================================

  getBusById(id: number): Observable<Bus> {

    return this.http.get<Bus>(
      `${this.apiUrl}/${id}`
    );

  }


  // ==========================================================
  // GET SEATS BY BUS ID
  // ==========================================================

  getSeatsByBusId(
    busId: number
  ): Observable<Seat[]> {

    const params = new HttpParams()
      .set('busId', busId);

    return this.http.get<Seat[]>(
      this.seatApiUrl,
      { params }
    );

  }
}
