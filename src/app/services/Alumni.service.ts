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
export class AlumniService {
    private apiUrl = `${environment.apiBaseUrl}/alumni`;
    constructor(private http: HttpClient, private tokenService: TokenService) { }
    private getHeaders(): HttpHeaders {
        const token = this.tokenService.getToken();
        return new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        });
    }

    private headersNotContentType = new HttpHeaders({
        Authorization: `Bearer ${this.tokenService.getToken()}`
    });

    get(params: any): Observable<ApiResponse> {
        return this.http.get<ApiResponse>(
            `${this.apiUrl}`,
            { headers: this.getHeaders(), params }
        );
    }

    add(formData: any): Observable<ApiResponse> {
        return this.http.post<ApiResponse>(this.apiUrl, formData, { headers: this.getHeaders() });
    }

    update(formData: any, id: string): Observable<ApiResponse> {
        return this.http.put<ApiResponse>(`${this.apiUrl}?id=${id}`, formData, {
            headers: this.getHeaders(),
        });
    }
}