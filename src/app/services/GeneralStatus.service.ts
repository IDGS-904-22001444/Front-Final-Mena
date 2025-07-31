import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

export interface GeneralStatus {
  id: number;
  statusName: string;
}

@Injectable({
  providedIn: 'root'
})
export class GeneralStatusService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Obtiene todos los estados generales
   */
  getGeneralStatuses(): Observable<GeneralStatus[]> {
    return this.http.get<GeneralStatus[]>(`${this.apiUrl}/GeneralStatuses`);
  }
}