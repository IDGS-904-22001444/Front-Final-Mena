import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { RawMaterial, RawMaterialCreateRequest, RawMaterialUpdateRequest } from '../interfaces/raw-material';

@Injectable({
  providedIn: 'root'
})
export class RawMaterialService {
  private apiUrl = `${environment.apiUrl}/RawMaterials`;

  constructor(private http: HttpClient) {}

  getRawMaterials(): Observable<RawMaterial[]> {
    return this.http.get<RawMaterial[]>(this.apiUrl);
  }

  getRawMaterial(id: number): Observable<RawMaterial> {
    return this.http.get<RawMaterial>(`${this.apiUrl}/${id}`);
  }

  createRawMaterial(material: RawMaterialCreateRequest): Observable<RawMaterial> {
    return this.http.post<RawMaterial>(this.apiUrl, material);
  }

  updateRawMaterial(id: number, material: RawMaterialUpdateRequest): Observable<RawMaterial> {
    return this.http.put<RawMaterial>(`${this.apiUrl}/${id}`, material);
  }

  deleteRawMaterial(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}