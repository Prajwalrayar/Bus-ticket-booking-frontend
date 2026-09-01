import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TripDTO, TripSearchRequest, RouteStopDTO } from '../models/trip';
import { ApiResponse } from '../models/api-response';

@Injectable({
  providedIn: 'root'
})
export class TripService {
  private apiUrl = '/api/trips';

  constructor(private http: HttpClient) {}

  searchTrips(request: TripSearchRequest): Observable<ApiResponse<TripDTO[]>> {
    let params = new HttpParams()
      .set('source', request.source)
      .set('destination', request.destination);

    if (request.travelDate) {
      params = params.set('travelDate', request.travelDate);
    }
    if (request.busType) {
      params = params.set('busType', request.busType);
    }
    if (request.minPrice) {
      params = params.set('minPrice', request.minPrice.toString());
    }
    if (request.maxPrice) {
      params = params.set('maxPrice', request.maxPrice.toString());
    }
    if (request.departureStart) {
      params = params.set('departureStart', request.departureStart);
    }
    if (request.departureEnd) {
      params = params.set('departureEnd', request.departureEnd);
    }

    return this.http.get<ApiResponse<TripDTO[]>>(`${this.apiUrl}/search`, { params });
  }

  getTripById(tripId: string): Observable<ApiResponse<TripDTO>> {
    return this.http.get<ApiResponse<TripDTO>>(`${this.apiUrl}/${tripId}`);
  }

  getRouteStops(source: string, destination: string): Observable<ApiResponse<RouteStopDTO[]>> {
    return this.http.get<ApiResponse<RouteStopDTO[]>>(`/api/routes/${source}/${destination}/stops`);
  }
}
