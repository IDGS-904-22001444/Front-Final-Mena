import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { ProductionStartRequest } from '../interfaces/production-start-request';

@Injectable({
  providedIn: 'root'
})
export class ProductionService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  startProduction(request: ProductionStartRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/Production/start`, request).pipe(
      tap(response => console.log('Producción iniciada:', response)),
      catchError(this.handleError)
    );
  }

  // Manejador de errores común
  private handleError(error: any) {
    console.error('API Error:', {
      error: error.error,
      status: error.status,
      message: error.message,
      details: error.error?.errors
    });
    return throwError(() => error);
  }
}