import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FaqService } from '../../services/faq.service';
import { FaqCreateRequest } from '../../interfaces/faq-create-request';
import { Faq } from '../../interfaces/faq';
import { FaqFormComponent } from '../../components/faq-form/faq-form.component';
import { FaqListComponent } from '../../components/faq-list/faq-list.component';

@Component({
  selector: 'app-faqs-admin',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    FaqFormComponent,
    FaqListComponent
  ],
  templateUrl: './faqs-admin.component.html',
  styleUrl: './faqs-admin.component.css'
})
export class FaqsAdminComponent implements OnInit {
  faqService = inject(FaqService);
  snackBar = inject(MatSnackBar);
  
  errorMessage = '';
  faq: FaqCreateRequest = {} as FaqCreateRequest;
  faqs$!: Observable<Faq[]>;
  isEditing = false;
  editingFaqId: number = 0;

  ngOnInit() {
    this.loadFaqs();
    this.initializeFaq();
  }

  loadFaqs() {
    this.faqs$ = this.faqService.getFaqs();
  }

  initializeFaq() {
    this.faq = {
      question: '',
      answer: '',
      status: 1 // Activo por defecto
    };
  }

  // Métodos para las estadísticas
  getTotalFaqs(faqs: Faq[] | null): number {
    return faqs?.length || 0;
  }

  getActiveFaqs(faqs: Faq[] | null): number {
    return faqs?.filter(f => f.status === 1).length || 0;
  }

  getInactiveFaqs(faqs: Faq[] | null): number {
    return faqs?.filter(f => f.status === 0).length || 0;
  }

  createFaq(faq: FaqCreateRequest) {
    this.faqService.createFaq(faq).subscribe({
      next: (response: { message: string }) => {
        this.loadFaqs();
        this.snackBar.open('Pregunta frecuente creada exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating FAQ:', error);
        if (error.status === 400) {
          this.errorMessage = error.error?.message || error.error || 'Error en la validación';
        } else {
          this.errorMessage = 'Error interno del servidor';
        }
        this.snackBar.open('Error al crear la pregunta frecuente: ' + this.errorMessage, 'Cerrar', {
          duration: 5000,
        });
      },
    });
  }

  updateFaq(faq: FaqCreateRequest) {
    this.faqService.updateFaq(this.editingFaqId, faq).subscribe({
      next: (response: { message: string }) => {
        this.loadFaqs();
        this.snackBar.open('Pregunta frecuente actualizada exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Error al actualizar la pregunta frecuente', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  editFaq(faq: Faq) {
    this.isEditing = true;
    this.editingFaqId = faq.id;
    this.faq = {
      question: faq.question,
      answer: faq.answer,
      status: faq.status
    };
  }

  deleteFaq(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta pregunta frecuente?')) {
      this.faqService.deleteFaq(id).subscribe({
        next: (response) => {
          this.loadFaqs();
          this.snackBar.open('Pregunta frecuente eliminada exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open('Error al eliminar la pregunta frecuente', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }

  saveFaq(faq: FaqCreateRequest) {
    this.errorMessage = '';
    if (this.isEditing) {
      this.updateFaq(faq);
    } else {
      this.createFaq(faq);
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.initializeFaq();
    this.isEditing = false;
    this.editingFaqId = 0;
    this.errorMessage = '';
  }
}