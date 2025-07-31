import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CustomerReview } from '../../interfaces/customer-review';

@Component({
  selector: 'app-customer-review-reply-form',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './customer-review-reply-form.component.html',
  styleUrl: './customer-review-reply-form.component.css'
})
export class CustomerReviewReplyFormComponent {
  @Input() review!: CustomerReview;
  @Output() reply = new EventEmitter<string>();
  @Output() cancel = new EventEmitter<void>();
  replyText = '';

  sendReply() {
    if (this.replyText.trim()) {
      this.reply.emit(this.replyText);
      this.replyText = '';
    }
  }
}