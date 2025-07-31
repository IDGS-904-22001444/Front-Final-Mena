import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Product } from '../interfaces/product';
import { ProductCreateRequest } from '../interfaces/product-create-request';
import { ProductUpdateRequest } from '../interfaces/product-update-request';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl;

  /**
   * Obtiene todos los productos
   */
  getProducts = (): Observable<Product[]> =>
    this.http.get<Product[]>(`${this.apiUrl}/Products`);

  /**
   * Obtiene un producto por ID
   */
  getProduct = (id: number): Observable<Product> =>
    this.http.get<Product>(`${this.apiUrl}/Products/${id}`);

  /**
   * Crea un nuevo producto
   */
  createProduct = (product: ProductCreateRequest): Observable<{ message: string }> => {
    console.log('Creating product:', product);
    return this.http.post<{ message: string }>(`${this.apiUrl}/Products`, product);
  }

  /**
   * Actualiza un producto existente
   */
  updateProduct = (id: number, product: ProductUpdateRequest): Observable<{ message: string }> => {
    console.log('Updating product - ID:', id, 'Data:', product);
    return this.http.put<{ message: string }>(`${this.apiUrl}/Products/${id}`, product);
  }

  /**
   * Elimina un producto
   */
  deleteProduct = (id: number): Observable<{ message: string }> => {
    console.log('Deleting product - ID:', id);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/Products/${id}`);
  }
}