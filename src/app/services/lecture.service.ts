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
export class LectureService {
  private apiUrl = `${environment.apiBaseUrl}/lecturer`;
  constructor(private http: HttpClient, private tokenService: TokenService) { }
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getLectures(params: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}`,
      { headers: this.getHeaders(), params }
    );
  }

  addLecture(payload: any): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, payload, { headers: this.getHeaders() });
  }

  updateLecture(payload: any, userId: string): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}?id=${userId}`, payload, {
      headers: this.getHeaders()
    });
  }

  deleteLecture(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}?id=${id}`, { headers: this.getHeaders() });
  }
}
