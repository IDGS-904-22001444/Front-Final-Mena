import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ProductMaterial, ProductMaterialCreateRequest, Product, RawMaterial } from '../interfaces/product-material';

@Injectable({
  providedIn: 'root'
})
export class ProductMaterialService {
  private apiUrl = `${environment.apiUrl}/ProductMaterials`;
  private productsUrl = `${environment.apiUrl}/Products`;
  private materialsUrl = `${environment.apiUrl}/RawMaterials`;

  constructor(private http: HttpClient) {}

  getProductMaterials(): Observable<ProductMaterial[]> {
    return this.http.get<ProductMaterial[]>(this.apiUrl);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(this.productsUrl);
  }

  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(this.materialsUrl);
  }

  createProductMaterial(material: ProductMaterialCreateRequest): Observable<ProductMaterial> {
    return this.http.post<ProductMaterial>(this.apiUrl, material);
  }

  deleteProductMaterial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}