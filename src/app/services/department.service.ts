import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class DepartmentService {
  private apiUrl = `${environment.apiBaseUrl}/department`;
  constructor(private http: HttpClient, private tokenService: TokenService) { }
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getDepartment(pageSize: number, index: number): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}?pageSize=${pageSize}&index=${index}`,
      { headers: this.getHeaders() }
    );
  }
}
