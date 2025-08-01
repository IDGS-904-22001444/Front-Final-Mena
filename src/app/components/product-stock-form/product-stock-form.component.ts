import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { ProductUpdateRequest } from '../../interfaces/product-update-request';
import { GeneralStatusService, GeneralStatus } from '../../services/general-status.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-product-stock-form',
  standalone: true,
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule,
    FormsModule, 
    MatIconModule,
    CommonModule
  ],
  templateUrl: './product-stock-form.component.html',
  styleUrls: ['./product-stock-form.component.css'],
})
export class ProductStockFormComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Input() errorMessage: string = '';
  @Output() updateProduct: EventEmitter<ProductUpdateRequest> = new EventEmitter<ProductUpdateRequest>();
  @Output() cancelEdit: EventEmitter<void> = new EventEmitter<void>();

  generalStatusService = inject(GeneralStatusService);
  generalStatuses$: Observable<GeneralStatus[]> = this.generalStatusService.getGeneralStatuses();
  
  updateData: ProductUpdateRequest = {
    id: '',
    stock: 0,
    status: 1
  };

  ngOnInit() {
    this.updateData = {
      id: this.product.productId.toString(),
      stock: this.product.stock,
      status: this.product.status
    };
  }

  onSubmit() {
    if (this.isFormValid()) {
      this.updateProduct.emit(this.updateData);
    }
  }

  onCancel() {
    this.cancelEdit.emit();
  }

  isFormValid(): boolean {
    return this.updateData.stock >= 0 && 
           this.updateData.status > 0 && 
           this.updateData.id !== '';
  }

  onStockInput(event: any) {
    const value = parseInt(event.target.value);
    if (isNaN(value) || value < 0) {
      this.updateData.stock = 0;
      event.target.value = '0';
    } else {
      this.updateData.stock = value;
    }
  }

  trackByStatusId(index: number, item: GeneralStatus): number {
    return item.id;
  }

  onStatusChange(event: any) {
    this.updateData.status = parseInt(event.target.value);
  }

  getProductName(): string {
    return this.product?.name || 'Producto sin nombre';
  }

  getProductPrice(): number {
    return this.product?.salePrice || 0;
  }

  getProductDescription(): string {
    return this.product?.description || 'Sin descripción disponible';
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }
}