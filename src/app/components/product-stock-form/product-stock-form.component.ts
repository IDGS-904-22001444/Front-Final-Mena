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
  styleUrl: './product-stock-form.component.css',
})
export class ProductStockFormComponent implements OnInit {
  @Input({ required: true }) product!: Product;
  @Input() errorMessage!: string;
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
      id: this.product.id,
      stock: this.product.stock,
      status: this.mapStatusToNumber(this.product.status)
    };
  }

  onSubmit() {
    this.updateProduct.emit(this.updateData);
  }

  onCancel() {
    this.cancelEdit.emit();
  }

  isFormValid(): boolean {
    return this.updateData.stock >= 0 && this.updateData.status > 0;
  }

  /**
   * Mapea el status string a número
   */
  private mapStatusToNumber(status: string): number {
    switch (status.toLowerCase()) {
      case 'activo':
        return 1;
      case 'no activo':
        return 2;
      default:
        return 1;
    }
  }

  /**
   * Solo permite números en el input de stock
   */
  onStockInput(event: any) {
    const value = event.target.value;
    if (value < 0) {
      this.updateData.stock = 0;
    }
  }
}