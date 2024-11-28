import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpParams,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiResponse } from '../responses/api.response';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class ActivityService {
  private apiUrl = `${environment.apiBaseUrl}/activities`;
  constructor(private http: HttpClient, private tokenService: TokenService) { }
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  get(params: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}`,
      { headers: this.getHeaders(), params }
    );
  }

    add(body: any): Observable<ApiResponse> {
      return this.http.post<ApiResponse>(this.apiUrl, body, { headers: this.getHeaders() });
    }

    update(id: string, body: any): Observable<ApiResponse> {
      return this.http.put<ApiResponse>(`${this.apiUrl}?id=${id}`, body, {
        headers: this.getHeaders(),
      });
    }

    delete(id: string): Observable<ApiResponse> {
      return this.http.delete<ApiResponse>(`${this.apiUrl}?id=${id}`, { headers: this.getHeaders() });
    }

}
