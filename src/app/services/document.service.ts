import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpRequest } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Document } from '../interfaces/document';

@Injectable({
  providedIn: 'root',
})
export class DocumentService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  /**
   * Obtiene la lista de documentos
   */
  getDocuments(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/Documentacion/list`);
  }

  /**
   * Sube un archivo
   */
  uploadDocument(file: File): Observable<HttpEvent<any>> {
    const formData = new FormData();
    formData.append('File', file);

    const req = new HttpRequest('POST', `${this.apiUrl}/Documentacion/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });

    return this.http.request(req);
  }

  /**
   * Descarga un documento
   */
  downloadDocument(fileName: string): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/Documentacion/download/${fileName}`, {
      responseType: 'blob'
    });
  }

  /**
   * Elimina un documento
   */
  deleteDocument(fileName: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/Documentacion/delete/${fileName}`);
  }
}