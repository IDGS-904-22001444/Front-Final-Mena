import { Component, OnInit } from '@angular/core';
import { CustomerReviewService } from '../../services/customer-review.service';
import { CustomerReview } from '../../interfaces/customer-review';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './customer-reviews.component.html',
  styleUrl: './customer-reviews.component.css'
})
export class CustomerReviewsComponent implements OnInit {
  reviews: CustomerReview[] = [];
  comment = '';
  rating = 5;
  clientId = 0;

  constructor(
    private reviewService: CustomerReviewService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const user = this.authService.getUserDetail();
    this.clientId = user?.id ? +user.id : 0;
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getReviews().subscribe(reviews => this.reviews = reviews);
  }

  submitReview() {
  if (!this.comment.trim() || !this.rating || !this.clientId) return;
  const review = {
    clientId: this.clientId,
    comment: this.comment,
    rating: this.rating
  };
  this.reviewService.addReview(review).subscribe(() => {
    this.comment = '';
    this.rating = 5;
    this.loadReviews();
  });
}
}