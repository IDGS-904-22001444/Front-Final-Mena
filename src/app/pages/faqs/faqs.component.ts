import { Component } from '@angular/core';
import { FaqClientViewComponent } from '../../components/faq-client-view/faq-client-view.component';

@Component({
  selector: 'app-faqs',
  standalone: true,
  imports: [FaqClientViewComponent],
  template: '<app-faq-client-view></app-faq-client-view>'
})
export class FaqsComponent {
  // Solo contiene el componente reutilizable
}