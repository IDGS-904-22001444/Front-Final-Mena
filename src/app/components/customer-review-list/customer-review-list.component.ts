import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomerReview } from '../../interfaces/customer-review';
import { CustomerReviewReplyFormComponent } from '../customer-review-reply-form/customer-review-reply-form.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-customer-review-list',
  standalone: true,
  imports: [CommonModule, CustomerReviewReplyFormComponent, MatIconModule],
  templateUrl: './customer-review-list.component.html',
  styleUrl: './customer-review-list.component.css'
})
export class CustomerReviewListComponent {
  @Input() reviews: CustomerReview[] = [];
  @Output() replyToReview = new EventEmitter<{ review: CustomerReview, reply: string }>();

  selectedReview: CustomerReview | null = null;

  selectReview(review: CustomerReview) {
    this.selectedReview = review;
  }

  onReply(reply: string) {
    if (this.selectedReview) {
      this.replyToReview.emit({ review: this.selectedReview, reply });
      this.selectedReview = null;
    }
  }

  getRatingStars(rating: number): string[] {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(i <= rating ? 'star' : 'star_border');
  }
  return stars;
}
}
