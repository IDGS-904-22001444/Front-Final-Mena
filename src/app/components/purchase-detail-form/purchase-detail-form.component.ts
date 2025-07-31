import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PurchaseDetailCreateRequest } from '../../interfaces/purchase-detail-create-request';

@Component({
  selector: 'app-purchase-detail-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './purchase-detail-form.component.html',
  styleUrl: './purchase-detail-form.component.css'
})
export class PurchaseDetailFormComponent implements OnInit {
  @Input() purchaseDetail: PurchaseDetailCreateRequest = {} as PurchaseDetailCreateRequest;
  @Input() isEditing: boolean = false;
  @Input() errorMessage: string = '';
  @Output() savePurchaseDetail = new EventEmitter<PurchaseDetailCreateRequest>();
  @Output() cancelEdit = new EventEmitter<void>();

  ngOnInit() {
    if (!this.purchaseDetail.status) {
      this.purchaseDetail.status = 0; // 0 = Pendiente
    }
  }

  calculateSubtotal() {
    if (this.purchaseDetail.quantity && this.purchaseDetail.unitPrice) {
      this.purchaseDetail.subtotal = this.purchaseDetail.quantity * this.purchaseDetail.unitPrice;
    }
  }

  onSubmit() {
    this.calculateSubtotal();
    this.savePurchaseDetail.emit(this.purchaseDetail);
  }

  onCancel() {
    this.cancelEdit.emit();
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pendiente';
      case 1: return 'Completado';
      case 2: return 'Cancelado';
      default: return 'Desconocido';
    }
  }
}