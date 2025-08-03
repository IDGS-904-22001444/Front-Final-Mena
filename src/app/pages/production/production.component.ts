import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { ProductService } from '../../services/product.service';
import { ProductionService } from '../../services/production.service';
import { Product } from '../../interfaces/product';
import { ProductionStartRequest } from '../../interfaces/production-start-request';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-production',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './production.component.html',
  styleUrl: './production.component.css'
})
export class ProductionComponent implements OnInit {
  productService = inject(ProductService);
  productionService = inject(ProductionService);
  snackBar = inject(MatSnackBar);
  
  products$!: Observable<Product[]>;
  errorMessage: string = '';
  successMessage: string = '';
  
  productionData: ProductionStartRequest = {
    productId: 0,
    quantityToProduce: 1
  };
  
  ngOnInit(): void {
    this.loadProducts();
  }
  
  loadProducts(): void {
    this.products$ = this.productService.getProducts();
  }
  
  startProduction(): void {
    if (!this.isFormValid()) {
      return;
    }
    
    this.productionService.startProduction(this.productionData).subscribe({
      next: (response) => {
        this.successMessage = 'Producción iniciada exitosamente';
        this.snackBar.open(this.successMessage, 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'Error al iniciar la producción';
        this.snackBar.open(this.errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }
  
  isFormValid(): boolean {
    if (!this.productionData.productId) {
      this.errorMessage = 'Debe seleccionar un producto';
      return false;
    }
    
    if (!this.productionData.quantityToProduce || this.productionData.quantityToProduce <= 0) {
      this.errorMessage = 'La cantidad debe ser mayor a 0';
      return false;
    }
    
    return true;
  }
  
  resetForm(): void {
    this.productionData = {
      productId: 0,
      quantityToProduce: 1
    };
    this.errorMessage = '';
  }
}