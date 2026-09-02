import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OperatorDTO } from '../models/operator';
import { ApiResponse } from '../models/api-response';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class OperatorService {
  private apiUrl = '/api/operators';

  constructor(private http: HttpClient) {}

  getOperatorByCompanyName(companyName: string): Observable<OperatorDTO> {
    return this.http.get<ApiResponse<OperatorDTO>>(`${this.apiUrl}/${companyName}`).pipe(
      map(res => res.data)
    );
  }

  updateOperator(companyName: string, operator: OperatorDTO): Observable<OperatorDTO> {
    return this.http.put<ApiResponse<OperatorDTO>>(`${this.apiUrl}/${companyName}`, operator).pipe(
      map(res => res.data)
    );
  }
}
