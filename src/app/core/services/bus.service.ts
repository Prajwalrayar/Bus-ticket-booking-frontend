import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Bus } from '../models/bus';
import { Seat } from '../models/seat';


@Injectable({
  providedIn: 'root',
})
export class BusService {

  private apiUrl = '/api';

  constructor(
    private http: HttpClient
  ) { }


  // ==========================================================
  // SEARCH TRIPS
  // ==========================================================

  searchBuses(
    fromCity: string,
    toCity: string,
    travelDate?: string
  ): Observable<Bus[]> {

    let params = new HttpParams()
      .set('source', fromCity)
      .set('destination', toCity);


    if (travelDate) {

      params = params.set(
        'travelDate',
        travelDate
      );

    }


    return this.http.get<Bus[]>(
      `${this.apiUrl}/trips`,
      { params }
    );

  }


  // ==========================================================
  // GET TRIP BY ID
  // ==========================================================

  getTripById(
    tripId: string
  ): Observable<Bus> {

    return this.http.get<Bus>(
      `${this.apiUrl}/trips/${tripId}`
    );

  }


  // ==========================================================
  // GET SEATS BY TRIP ID
  // ==========================================================

  getSeatsByTripId(
    tripId: string
  ): Observable<Seat[]> {

    return this.http.get<Seat[]>(
      `${this.apiUrl}/tripSeats`,
      {
        params: {
          tripId
        }
      }
    );

  }

}