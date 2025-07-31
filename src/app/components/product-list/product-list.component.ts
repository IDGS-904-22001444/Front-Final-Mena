import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';

@Component({
  selector: 'app-product-list',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent {
  @Input() products: Product[] | null = [];
  @Output() editProduct = new EventEmitter<Product>();
  @Output() deleteProduct = new EventEmitter<number>();


  onEdit(product: Product) {
    this.editProduct.emit(product);
  }

  async onDelete(id: number): Promise<void> {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar este producto? Esta acción no se puede deshacer.');
    if (confirmed) {
      this.deleteProduct.emit(id);
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }

  getStatusLabel(status: number): string {
    return status === 1 ? 'Activo' : 'Inactivo';
  }

  getStatusBadgeClass(status: number): string {
    return status === 1 
      ? 'bg-green-100 text-green-800' 
      : 'bg-red-100 text-red-800';
  }
}