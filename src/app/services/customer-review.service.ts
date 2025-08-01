import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { CustomerReview, CustomerReviewCreateRequest } from '../interfaces/customer-review';

@Injectable({ providedIn: 'root' })
export class CustomerReviewService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  getReviews(): Observable<CustomerReview[]> {
    return this.http.get<CustomerReview[]>(`${this.apiUrl}/CustomerReviews`);
  }

  // Corregir el tipo de parámetro para addReview
  addReview(review: CustomerReviewCreateRequest): Observable<CustomerReview> {
    console.log('Enviando reseña:', review); // Para debugging
    return this.http.post<CustomerReview>(`${this.apiUrl}/CustomerReviews`, review);
  }

  replyToReview(id: number, reply: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/CustomerReviews/${id}/reply`, { reply });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/CustomerReviews/${reviewId}`);
  }
}