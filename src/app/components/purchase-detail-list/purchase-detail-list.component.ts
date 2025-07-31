import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PurchaseDetail } from '../../interfaces/purchase-detail';

@Component({
  selector: 'app-purchase-detail-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './purchase-detail-list.component.html',
  styleUrl: './purchase-detail-list.component.css'
})
export class PurchaseDetailListComponent {
  @Input({ required: true }) purchaseDetails!: PurchaseDetail[] | null;
  @Output() editPurchaseDetail = new EventEmitter<PurchaseDetail>();
  @Output() deletePurchaseDetail = new EventEmitter<number>();

  edit(purchaseDetail: PurchaseDetail) {
    this.editPurchaseDetail.emit(purchaseDetail);
  }

  delete(id: number) {
    this.deletePurchaseDetail.emit(id);
  }

  trackByPurchaseDetailId(index: number, purchaseDetail: PurchaseDetail): number {
    return purchaseDetail.id;
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800';
      case 2: return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pendiente';
      case 1: return 'Completado';
      case 2: return 'Cancelado';
      default: return 'Desconocido';
    }
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }
}