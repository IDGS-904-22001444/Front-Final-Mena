import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Quotation } from '../interfaces/quotation';
import { QuotationRequest } from '../interfaces/quotation-request';

@Injectable({
  providedIn: 'root'
})
export class QuotationService {
  private apiUrl = `${environment.apiUrl}/QuotationRequests`;

  constructor(private http: HttpClient) {}

  createQuotation(quotation: QuotationRequest): Observable<any> {
    return this.http.post(this.apiUrl, quotation);
  }

  getAllQuotations(): Observable<Quotation[]> {
    return this.http.get<Quotation[]>(this.apiUrl);
  }

  updateQuotationStatus(id: number, status: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/status`, { status });
  }
}