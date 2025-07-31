import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development';
import { Observable } from 'rxjs';
import { CustomerReview } from '../interfaces/customer-review';

@Injectable({ providedIn: 'root' })
export class CustomerReviewService {
  private apiUrl = environment.apiUrl + '/CustomerReviews';

  constructor(private http: HttpClient) {}

  getReviews(): Observable<CustomerReview[]> {
    return this.http.get<CustomerReview[]>(this.apiUrl);
  }

addReview(review: { clientId: number; comment: string; rating: number }): Observable<CustomerReview> {
  return this.http.post<CustomerReview>(this.apiUrl, review);
}


replyToReview(id: number, reply: string): Observable<any> {
  return this.http.put(`${this.apiUrl}/${id}/reply`, { reply });
}
}