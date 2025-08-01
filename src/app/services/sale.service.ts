import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Sale } from '../interfaces/sale';
import { SaleCreateRequest } from '../interfaces/sale-create-request';

@Injectable({
  providedIn: 'root',
})
export class SaleService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  // Obtener todas las ventas (para admin)
  getAllSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales`);
  }

  // Obtener ventas de un cliente específico
  getClientSales(): Observable<Sale[]> {
    return this.http.get<Sale[]>(`${this.apiUrl}/Sales/my`);
  }

  // Obtener una venta específica
  getSale(id: number): Observable<Sale> {
    return this.http.get<Sale>(`${this.apiUrl}/Sales/${id}`);
  }

  // Crear una venta
  createSale(sale: SaleCreateRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/Sales`, sale);
  }

  // Actualizar una venta
  updateSale(id: number, sale: SaleCreateRequest): Observable<{ message: string }> {
    return this.http.put<{ message: string }>(`${this.apiUrl}/Sales/${id}`, sale);
  }

  // Eliminar una venta
  deleteSale(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/Sales/${id}`);
  }
}