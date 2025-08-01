import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserMappingService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Obtiene el ID numérico del usuario basado en su GUID usando el endpoint del backend
   * @param userGuid GUID del usuario
   * @returns ID numérico para usar en las ventas
   */
  getNumericUserId(userGuid: string): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/Users/GetNumericId/${userGuid}`)
      .pipe(
        catchError(error => {
          console.error('Error getting numeric user ID:', error);
          // Fallback: crear un ID basado en hash del GUID
          return of(this.generateFallbackId(userGuid));
        })
      );
  }

  /**
   * Genera un ID numérico basado en el GUID como fallback
   */
  private generateFallbackId(guid: string): number {
    // Crear un hash simple del GUID y convertirlo a número
    let hash = 0;
    for (let i = 0; i < guid.length; i++) {
      const char = guid.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash) % 1000000; // Limitar a 6 dígitos
  }
}