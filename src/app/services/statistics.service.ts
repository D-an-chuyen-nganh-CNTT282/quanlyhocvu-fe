import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TokenService } from './token.service';
import { StatisticsCount } from '../models/statistics.count';
import { StatisticsUpcoming } from '../models/statistics.upcoming';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  private apiUrl = `${environment.apiBaseUrl}/statistics`;
  constructor(private http: HttpClient, private tokenService: TokenService) { }
  private getHeaders(): HttpHeaders {
    const token = this.tokenService.getToken();
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });
  }

  getEntityCounts(): Observable<StatisticsCount> {
    return this.http.get<StatisticsCount>(
      `${this.apiUrl}/entity-counts`,
      { headers: this.getHeaders()}
    );
  }

  getUpcomingActivities(params: any): Observable<StatisticsUpcoming[]> {
    return this.http.get<StatisticsUpcoming[]>(`${this.apiUrl}/upcoming-activities`, { headers: this.getHeaders(), params  });
  }
}
