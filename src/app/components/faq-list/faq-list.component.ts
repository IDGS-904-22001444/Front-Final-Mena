import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Faq } from '../../interfaces/faq';

@Component({
  selector: 'app-faq-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './faq-list.component.html',
  styleUrl: './faq-list.component.css'
})
export class FaqListComponent {
  @Input({ required: true }) faqs!: Faq[] | null;
  @Input() isAdmin: boolean = false;
  @Output() editFaq = new EventEmitter<Faq>();
  @Output() deleteFaq = new EventEmitter<number>();

  trackByFaqId(index: number, faq: Faq): number {
    return faq.id;
  }

  edit(faq: Faq) {
    this.editFaq.emit(faq);
  }

  delete(id: number) {
    this.deleteFaq.emit(id);
  }

  truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  }
}