import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, map, retry } from 'rxjs/operators';
import { Purchase } from '../interfaces/purchase';
import { PurchaseCreateRequest } from '../interfaces/purchase-create-request';
import { PurchaseDetail } from '../interfaces/purchase-detail';
import { PurchaseDetailCreateRequest } from '../interfaces/purchase-detail-create-request';
import { Provider } from '../interfaces/provider';
import { RawMaterial } from '../interfaces/raw-material';

@Injectable({
  providedIn: 'root',
})
export class PurchaseService {
  private apiUrl = environment.apiUrl;
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) {}

  // Métodos para Purchases
  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/Purchases`, this.httpOptions).pipe(
      retry(1),
      tap(purchases => console.log('Purchases fetched:', purchases)),
      catchError(this.handleError)
    );
  }

  getPurchase(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/Purchases/${id}`, this.httpOptions).pipe(
      retry(1),
      tap(purchase => console.log('Purchase fetched:', purchase)),
      catchError(this.handleError)
    );
  }

  createPurchase(purchase: PurchaseCreateRequest): Observable<any> {
    console.log('Creating purchase:', JSON.stringify(purchase, null, 2));
    return this.http.post<any>(`${this.apiUrl}/Purchases`, purchase, this.httpOptions).pipe(
      retry(1),
      tap(response => console.log('Purchase created:', response)),
      catchError(this.handleError)
    );
  }

  updatePurchase(id: number, purchase: PurchaseCreateRequest): Observable<{ message: string }> {
    console.log(`Updating purchase ${id}:`, JSON.stringify(purchase, null, 2));
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/Purchases/${id}`, 
      purchase, 
      this.httpOptions
    ).pipe(
      retry(1),
      tap(response => console.log('Purchase updated:', response)),
      catchError(this.handleError)
    );
  }

  deletePurchase(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/Purchases/${id}`, 
      this.httpOptions
    ).pipe(
      retry(1),
      tap(response => console.log('Purchase deleted:', response)),
      catchError(this.handleError)
    );
  }

  // Métodos para PurchaseDetails
  getPurchaseDetails(): Observable<PurchaseDetail[]> {
    return this.http.get<PurchaseDetail[]>(
      `${this.apiUrl}/PurchaseDetails`, 
      this.httpOptions
    ).pipe(
      retry(1),
      tap(details => console.log('Purchase details fetched:', details)),
      catchError(this.handleError)
    );
  }

  getPurchaseDetail(id: number): Observable<PurchaseDetail> {
    return this.http.get<PurchaseDetail>(
      `${this.apiUrl}/PurchaseDetails/${id}`, 
      this.httpOptions
    ).pipe(
      retry(1),
      tap(detail => console.log('Purchase detail fetched:', detail)),
      catchError(this.handleError)
    );
  }

  createPurchaseDetail(detail: PurchaseDetailCreateRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(
      `${this.apiUrl}/PurchaseDetails`, 
      detail, 
      this.httpOptions
    ).pipe(
      retry(1),
      tap(response => console.log('Purchase detail created:', response)),
      catchError(this.handleError)
    );
  }

  updatePurchaseDetail(id: number, detail: PurchaseDetailCreateRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(
      `${this.apiUrl}/PurchaseDetails/${id}`, 
      detail, 
      this.httpOptions
    ).pipe(
      retry(1),
      tap(response => console.log('Purchase detail updated:', response)),
      catchError(this.handleError)
    );
  }

  deletePurchaseDetail(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(
      `${this.apiUrl}/PurchaseDetails/${id}`, 
      this.httpOptions
    ).pipe(
      retry(1),
      tap(response => console.log('Purchase detail deleted:', response)),
      catchError(this.handleError)
    );
  }

  // En purchase.service.ts
getProviders(): Observable<Provider[]> {
  return this.http.get<Provider[]>(`${this.apiUrl}/providers`).pipe(
    tap(providers => console.log('Providers sin procesar:', providers)),
    map(providers => providers.map(provider => ({
      ...provider,
      providerId: provider.id, // Aseguramos que providerId siempre tenga un valor
      id: provider.id
    }))),
    tap(providers => console.log('Providers procesados:', providers)),
    catchError(this.handleError)
  );
}
  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(`${this.apiUrl}/RawMaterials`, this.httpOptions).pipe(
      retry(1),
      tap(materials => console.log('Raw materials fetched:', materials)),
      catchError(this.handleError)
    );
  }

  private handleError(error: HttpErrorResponse) {
    console.error('Error detallado:', {
      error: error.error,
      status: error.status,
      statusText: error.statusText,
      url: error.url,
      message: error.message
    });

    let errorMessage = 'Ha ocurrido un error en la solicitud';

    if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor. Verifica tu conexión o que el backend esté ejecutándose.';
    } else if (error.status === 400) {
      errorMessage = 'Datos de compra inválidos';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    return throwError(() => ({ message: errorMessage, originalError: error }));
  }
}
