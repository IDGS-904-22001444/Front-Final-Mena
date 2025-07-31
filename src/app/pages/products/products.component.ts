import { Component, inject, OnInit } from '@angular/core';
import { ProductFormComponent } from '../../components/product-form/product-form.component';
import { ProductListComponent } from '../../components/product-list/product-list.component';
import { ProductService } from '../../services/product.service';
import { ProductCreateRequest } from '../../interfaces/product-create-request';
import { ProductUpdateRequest } from '../../interfaces/product-update-request';
import { Product } from '../../interfaces/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  imports: [
    ProductFormComponent,
    ProductListComponent,
    AsyncPipe,
    CommonModule,
    MatIconModule,
    MatButtonModule,
  ],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export class ProductsComponent implements OnInit {
  productService = inject(ProductService);
  snackBar = inject(MatSnackBar);

  errorMessage = '';
  isEditing = false;
  editingProduct: Product | null = null;

  products$: Observable<Product[]> = this.productService.getProducts();

  ngOnInit() {
    this.loadProducts();
  }

  loadProducts() {
    this.products$ = this.productService.getProducts();
  }

  createProduct(product: ProductCreateRequest) {
    this.snackBar.open('Creando producto... Por favor espera', '', { duration: 2000 });

    this.productService.createProduct(product).subscribe({
      next: (response) => {
        this.snackBar.open('¡Producto creado exitosamente!', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
        this.loadProducts();
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Error al crear el producto';
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] });
      },
    });
  }

  updateProduct(data: { id: number, product: ProductUpdateRequest }) {
    this.snackBar.open('Actualizando producto... Por favor espera', '', { duration: 2000 });

    this.productService.updateProduct(data.id, data.product).subscribe({
      next: (response) => {
        this.snackBar.open('¡Producto actualizado exitosamente!', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
        this.loadProducts();
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Error al actualizar el producto';
        this.snackBar.open(this.errorMessage, 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] });
      },
    });
  }

  async deleteProduct(id: number): Promise<void> {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.');
    if (confirmed) {
      this.snackBar.open('Eliminando producto... Por favor espera', '', { duration: 2000 });

      this.productService.deleteProduct(id).subscribe({
        next: (response) => {
          this.snackBar.open('¡Producto eliminado exitosamente!', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
          this.loadProducts();
        },
        error: (error: HttpErrorResponse) => {
          const msg = error.error?.message || 'No se pudo eliminar el producto. Inténtalo de nuevo.';
          this.snackBar.open(msg, 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] });
        },
      });
    }
  }

  editProduct(product: Product) {
    this.isEditing = true;
    this.editingProduct = { ...product };
    this.errorMessage = '';
  }

  cancelEdit() {
    this.resetForm();
  }

  private resetForm() {
    this.isEditing = false;
    this.editingProduct = null;
    this.errorMessage = '';
  }

  getProductCountByStatus(products: Product[] | null, status: number): number {
    if (!products) return 0;
    return products.filter(p => p.status === status).length;
  }

  getTotalStock(products: Product[] | null): number {
    if (!products) return 0;
    return products.reduce((total, product) => total + product.stock, 0);
  }
}