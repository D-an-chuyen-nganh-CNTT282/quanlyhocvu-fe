import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment'
import { ApiResponse } from '../responses/api.response';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiBaseUrl = `${environment.apiBaseUrl}/role`;

  constructor(private http: HttpClient, private tokenService: TokenService) {}
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }
  getRoles(): Observable<ApiResponse> {
    return this.http.get<ApiResponse>(`${this.apiBaseUrl}/get_roles`, { headers: this.getHeaders() });
  }
}
