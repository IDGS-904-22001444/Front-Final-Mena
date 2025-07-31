import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { Faq } from '../interfaces/faq';
import { FaqCreateRequest } from '../interfaces/faq-create-request';

@Injectable({
  providedIn: 'root',
})
export class FaqService {
  apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.apiUrl}/Faqs`);
  }

  getActiveFaqs(): Observable<Faq[]> {
    return this.http.get<Faq[]>(`${this.apiUrl}/Faqs`);
  }

  getFaq(id: number): Observable<Faq> {
    return this.http.get<Faq>(`${this.apiUrl}/Faqs/${id}`);
  }

  createFaq(faq: FaqCreateRequest): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${this.apiUrl}/Faqs`, faq);
  }

  updateFaq(id: number, faq: FaqCreateRequest): Observable<{ message: string }> {
    console.log('Updating FAQ - ID:', id, 'URL:', `${this.apiUrl}/Faqs/${id}`);
    return this.http.put<{ message: string }>(`${this.apiUrl}/Faqs/${id}`, faq);
  }

  deleteFaq(id: number): Observable<{ message: string }> {
    console.log('Deleting FAQ - ID:', id, 'URL:', `${this.apiUrl}/Faqs/${id}`);
    return this.http.delete<{ message: string }>(`${this.apiUrl}/Faqs/${id}`);
  }
}