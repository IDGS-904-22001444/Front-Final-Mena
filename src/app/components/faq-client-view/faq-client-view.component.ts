import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FaqService } from '../../services/faq.service';
import { Faq } from '../../interfaces/faq';

@Component({
  selector: 'app-faq-client-view',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatExpansionModule,
    FormsModule
  ],
  templateUrl: './faq-client-view.component.html',
  styleUrl: './faq-client-view.component.css'
})
export class FaqClientViewComponent implements OnInit {
  faqService = inject(FaqService);
  faqs$!: Observable<Faq[]>;
  searchTerm = '';

  ngOnInit() {
    this.loadActiveFaqs();
  }

  loadActiveFaqs() {
    this.faqs$ = this.faqService.getActiveFaqs();
  }

  filterFaqs(faqs: Faq[] | null): Faq[] {
    if (!faqs || !this.searchTerm) {
      return faqs || [];
    }
    
    return faqs.filter(faq => 
      faq.question.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  clearSearch() {
    this.searchTerm = '';
  }
}