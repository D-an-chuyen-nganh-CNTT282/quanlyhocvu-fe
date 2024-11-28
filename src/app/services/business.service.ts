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
export class BusinessService {
    private apiUrl = `${environment.apiBaseUrl}/business`;
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

    add(payload: any): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(this.apiUrl, payload, { headers: this.getHeaders() });
    }

    update(payload: any, userId: string): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(`${this.apiUrl}?id=${userId}`, payload, {
            headers: this.getHeaders()
        });
    }

    delete(id: string): Observable<ApiResponse> {
        return this.http.delete<ApiResponse>(`${this.apiUrl}?id=${id}`, { headers: this.getHeaders() });
    }
}
