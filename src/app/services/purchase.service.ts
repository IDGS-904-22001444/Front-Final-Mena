import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
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
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Métodos para Purchases
  getPurchases(): Observable<Purchase[]> {
    return this.http.get<Purchase[]>(`${this.apiUrl}/Purchases`);
  }

  getPurchase(id: number): Observable<Purchase> {
    return this.http.get<Purchase>(`${this.apiUrl}/Purchases/${id}`);
  }

  createPurchase(purchase: PurchaseCreateRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/Purchases`, purchase);
  }

  updatePurchase(id: number, purchase: PurchaseCreateRequest): Observable<{ message: string }> {
    console.log('Updating purchase - ID:', id, 'URL:', `${this.apiUrl}/Purchases/${id}`);
    return this.http.put<{ message: string }>(`${this.apiUrl}/Purchases/${id}`, purchase);
  }

  deletePurchase(id: number): Observable<{ message: string }> {
    console.log('Deleting purchase - ID:', id, 'URL:', `${this.apiUrl}/Purchases/${id}`);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/Purchases/${id}`);
  }

  // Métodos para PurchaseDetails
  getPurchaseDetails(): Observable<PurchaseDetail[]> {
    return this.http.get<PurchaseDetail[]>(`${this.apiUrl}/PurchaseDetails`);
  }

  getPurchaseDetail(id: number): Observable<PurchaseDetail> {
    return this.http.get<PurchaseDetail>(`${this.apiUrl}/PurchaseDetails/${id}`);
  }

  createPurchaseDetail(detail: PurchaseDetailCreateRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/PurchaseDetails`, detail);
  }

  updatePurchaseDetail(id: number, detail: PurchaseDetailCreateRequest): Observable<{ message: string }> {
    console.log('Updating purchase detail - ID:', id, 'URL:', `${this.apiUrl}/PurchaseDetails/${id}`);
    return this.http.put<{ message: string }>(`${this.apiUrl}/PurchaseDetails/${id}`, detail);
  }

  deletePurchaseDetail(id: number): Observable<{ message: string }> {
    console.log('Deleting purchase detail - ID:', id, 'URL:', `${this.apiUrl}/PurchaseDetails/${id}`);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/PurchaseDetails/${id}`);
  }

  // Métodos auxiliares para los formularios
  getProviders(): Observable<Provider[]> {
    return this.http.get<Provider[]>(`${this.apiUrl}/Providers`);
  }

  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(`${this.apiUrl}/RawMaterials`);
  }
}