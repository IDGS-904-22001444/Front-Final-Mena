import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CustomerReviewService } from '../../services/customer-review.service';
import { CustomerReview, CustomerReviewCreateRequest } from '../../interfaces/customer-review';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-customer-reviews',
  standalone: true,
  imports: [FormsModule, CommonModule, MatIconModule, MatSnackBarModule],
  templateUrl: './customer-reviews.component.html',
  styleUrl: './customer-reviews.component.css'
})
export class CustomerReviewsComponent implements OnInit {
  reviews: CustomerReview[] = [];
  comment = '';
  rating = 5;
  clientId = '';
  isSubmitting = false;

  constructor(
    private reviewService: CustomerReviewService,
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    const user = this.authService.getUserDetail();
    this.clientId = user?.id || '';
    console.log('Cliente ID:', this.clientId); // Para debugging
    this.loadReviews();
  }

  loadReviews() {
    this.reviewService.getReviews().subscribe({
      next: (reviews) => {
        this.reviews = reviews;
        console.log('Reseñas cargadas:', reviews);
      },
      error: (error) => {
        console.error('Error loading reviews:', error);
        this.snackBar.open('Error al cargar las reseñas', 'Cerrar', {
          duration: 3000
        });
      }
    });
  }

  submitReview() {
    // Validaciones
    if (!this.comment.trim()) {
      this.snackBar.open('El comentario es requerido', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (!this.rating || this.rating < 1 || this.rating > 5) {
      this.snackBar.open('La calificación debe estar entre 1 y 5', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (!this.clientId) {
      this.snackBar.open('Error: Usuario no identificado', 'Cerrar', {
        duration: 3000
      });
      return;
    }

    if (this.isSubmitting) return;

    this.isSubmitting = true;

    const review: CustomerReviewCreateRequest = {
      clientId: this.clientId, // Asegurar que sea string
      comment: this.comment.trim(),
      rating: this.rating,
      createdAt: new Date().toISOString()
    };

    console.log('Datos a enviar:', review); // Para debugging

    this.reviewService.addReview(review).subscribe({
      next: (response) => {
        console.log('Respuesta del servidor:', response);
        this.snackBar.open('¡Reseña enviada exitosamente!', 'Cerrar', {
          duration: 3000
        });
        
        // Limpiar formulario
        this.comment = '';
        this.rating = 5;
        
        // Recargar reseñas
        this.loadReviews();
        this.isSubmitting = false;
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        let errorMessage = 'Error al enviar la reseña';
        
        if (error.error && error.error.message) {
          errorMessage = error.error.message;
        } else if (error.message) {
          errorMessage = error.message;
        }
        
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 3000
        });
        this.isSubmitting = false;
      }
    });
  }

  getRatingStars(rating: number): string[] {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(i <= rating ? 'star' : 'star_border');
    }
    return stars;
  }
}