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
export class IncomingDocumentService {
  private apiUrl = `${environment.apiBaseUrl}/incomingdocument`;
  constructor(private http: HttpClient, private tokenService: TokenService) { }

  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  private getHeadersNotContentType(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
  }

  getDocuments(params: any): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(
      `${this.apiUrl}`,
      { headers: this.getHeaders(), params }
    );
  }

  addDocument(formData: FormData, params: HttpParams): Observable<ApiResponse> {
    return this.http.post<ApiResponse>(this.apiUrl, formData, { headers: this.getHeadersNotContentType(), params });
  }

  updateDocument(formData: FormData, params: HttpParams): Observable<ApiResponse> {
    return this.http.put<ApiResponse>(`${this.apiUrl}`, formData, {
      headers: this.getHeadersNotContentType(),
      params
    });
  }

  deleteDocument(id: string): Observable<ApiResponse> {
    return this.http.delete<ApiResponse>(`${this.apiUrl}?id=${id}`, { headers: this.getHeaders() });
  }
}
