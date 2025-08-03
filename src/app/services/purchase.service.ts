import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
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

  constructor(private http: HttpClient) {}

  // Métodos para Purchases
  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/Purchases`).pipe(
      tap(purchases => console.log('Purchases fetched:', purchases)),
      catchError(this.handleError)
    );
  }

  getPurchase(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/Purchases/${id}`).pipe(
      tap(purchase => console.log('Purchase fetched:', purchase)),
      catchError(this.handleError)
    );
  }

  createPurchase(purchase: PurchaseCreateRequest): Observable<any> {
    console.log('Creating purchase:', JSON.stringify(purchase, null, 2));
    
    return this.http.post<any>(`${this.apiUrl}/Purchases`, purchase).pipe(
      tap(response => console.log('Purchase created:', response)),
      catchError(this.handleError)
    );
  }

  updatePurchase(id: number, purchase: PurchaseCreateRequest): Observable<{ message: string }> {
    console.log(`Updating purchase ${id}:`, JSON.stringify(purchase, null, 2));
    
    return this.http.put<{ message: string }>(`${this.apiUrl}/Purchases/${id}`, purchase).pipe(
      tap(response => console.log('Purchase updated:', response)),
      catchError(this.handleError)
    );
  }

  deletePurchase(id: number): Observable<{ message: string }> {
    console.log(`Deleting purchase ${id}`);
    
    return this.http.delete<{ message: string }>(`${this.apiUrl}/Purchases/${id}`).pipe(
      tap(response => console.log('Purchase deleted:', response)),
      catchError(this.handleError)
    );
  }

  // Métodos para PurchaseDetails
  getPurchaseDetails(): Observable<PurchaseDetail[]> {
    return this.http.get<PurchaseDetail[]>(`${this.apiUrl}/PurchaseDetails`).pipe(
      tap(details => console.log('Purchase details fetched:', details)),
      catchError(this.handleError)
    );
  }

  getPurchaseDetail(id: number): Observable<PurchaseDetail> {
    return this.http.get<PurchaseDetail>(`${this.apiUrl}/PurchaseDetails/${id}`).pipe(
      tap(detail => console.log('Purchase detail fetched:', detail)),
      catchError(this.handleError)
    );
  }

  createPurchaseDetail(detail: PurchaseDetailCreateRequest): Observable<{ message: string }> {
    console.log('Creating purchase detail:', JSON.stringify(detail, null, 2));
    
    return this.http.post<{ message: string }>(`${this.apiUrl}/PurchaseDetails`, detail).pipe(
      tap(response => console.log('Purchase detail created:', response)),
      catchError(this.handleError)
    );
  }

  updatePurchaseDetail(id: number, detail: PurchaseDetailCreateRequest): Observable<{ message: string }> {
    console.log(`Updating purchase detail ${id}:`, JSON.stringify(detail, null, 2));
    
    return this.http.put<{ message: string }>(`${this.apiUrl}/PurchaseDetails/${id}`, detail).pipe(
      tap(response => console.log('Purchase detail updated:', response)),
      catchError(this.handleError)
    );
  }

  deletePurchaseDetail(id: number): Observable<{ message: string }> {
    console.log(`Deleting purchase detail ${id}`);
    
    return this.http.delete<{ message: string }>(`${this.apiUrl}/PurchaseDetails/${id}`).pipe(
      tap(response => console.log('Purchase detail deleted:', response)),
      catchError(this.handleError)
    );
  }

  // Métodos auxiliares para los formularios
  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/Providers`).pipe(
      tap(providers => console.log('Providers fetched:', providers)),
      catchError(this.handleError)
    );
  }

  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(`${this.apiUrl}/RawMaterials`).pipe(
      tap(materials => console.log('Raw materials fetched:', materials)),
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