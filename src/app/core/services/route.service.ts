import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { RouteDTO, RouteCreateRequest, RouteStopDTO, RouteStopCreateRequest } from '../models/route';

@Injectable({
  providedIn: 'root'
})
export class RouteService {

  private apiUrl = '/api/routes';

  constructor(private http: HttpClient) { }

  // ==========================================================
  // ROUTE MANAGEMENT
  // ==========================================================

  getAllRoutes(): Observable<RouteDTO[]> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(res => res.data)
    );
  }

  createRoute(request: RouteCreateRequest): Observable<RouteDTO> {
    return this.http.post<any>(this.apiUrl, request).pipe(
      map(res => res.data)
    );
  }

  updateRoute(source: string, destination: string, request: RouteCreateRequest): Observable<RouteDTO> {
    return this.http.put<any>(`${this.apiUrl}?source=${source}&destination=${destination}`, request).pipe(
      map(res => res.data)
    );
  }

  deactivateRoute(source: string, destination: string): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/deactivate?source=${source}&destination=${destination}`, {}).pipe(
      map(res => res.data)
    );
  }

  // ==========================================================
  // ROUTE STOP MANAGEMENT
  // ==========================================================

  getRouteStops(source: string, destination: string): Observable<RouteStopDTO[]> {
    return this.http.get<any>(`${this.apiUrl}/${source}/${destination}/stops`).pipe(
      map(res => res.data)
    );
  }

  createRouteStop(source: string, destination: string, request: RouteStopCreateRequest): Observable<RouteStopDTO> {
    return this.http.post<any>(`${this.apiUrl}/${source}/${destination}/stops`, request).pipe(
      map(res => res.data)
    );
  }

  updateRouteStop(source: string, destination: string, stopName: string, request: RouteStopCreateRequest): Observable<RouteStopDTO> {
    return this.http.put<any>(`${this.apiUrl}/${source}/${destination}/stops/${stopName}`, request).pipe(
      map(res => res.data)
    );
  }

}
