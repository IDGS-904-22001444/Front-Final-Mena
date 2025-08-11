import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { QuotationRequest } from '../interfaces/quotation-request';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private apiUrl = `${environment.apiUrl}/QuotationRequests`;

  constructor(private http: HttpClient) {}

  createQuotation(quotation: QuotationRequest): Observable<any> {
  return this.http.post('https://localhost:5000/api/QuotationRequests', quotation);
}

  getAllQuotations(): Observable<QuotationRequest[]> {
    return this.http.get<QuotationRequest[]>(this.apiUrl);
  }

  updateQuotationStatus(id: number, status: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}