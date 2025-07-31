import { Component, OnInit } from '@angular/core';
import { CustomerReviewService } from '../../services/customer-review.service';
import { CustomerReview } from '../../interfaces/customer-review';
import { CustomerReviewListComponent } from '../../components/customer-review-list/customer-review-list.component';

@Component({
  selector: 'app-customer-reviews-admin',
  standalone: true,
  imports: [CustomerReviewListComponent],
  templateUrl: './customer-reviews-admin.component.html',
  styleUrl: './customer-reviews-admin.component.css'
})
export class CustomerReviewsAdminComponent implements OnInit {
  reviews: CustomerReview[] = [];

  constructor(private reviewService: CustomerReviewService) {}

  ngOnInit() {
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getReviews().subscribe(reviews => this.reviews = reviews);
  }

  replyToReview({ review, reply }: { review: CustomerReview, reply: string }) {
    this.reviewService.replyToReview(review.id, reply).subscribe(() => {
      this.loadReviews();
    });
  }
}