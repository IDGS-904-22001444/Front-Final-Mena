import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatChipsModule } from '@angular/material/chips';
import { Purchase } from '../../interfaces/purchase';
import { PurchaseDetail } from '../../interfaces/purchase-detail';
import { PurchaseService } from '../../services/purchase.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-purchase-detail-view',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatChipsModule
  ],
  templateUrl: './purchase-detail-view.component.html',
  styleUrl: './purchase-detail-view.component.css'
})
export class PurchaseDetailViewComponent implements OnInit {
  @Input() purchase!: Purchase;
  @Output() close = new EventEmitter<void>();
  @Output() editPurchase = new EventEmitter<Purchase>();

  purchaseDetails$!: Observable<PurchaseDetail[]>;
  isLoading = false;

  constructor(private purchaseService: PurchaseService) {}

  ngOnInit() {
    if (this.purchase) {
      this.loadPurchaseDetails();
    }
  }

  loadPurchaseDetails() {
    this.isLoading = true;
    // Usar el método específico para obtener detalles por purchaseId
    this.purchaseDetails$ = this.purchaseService.getPurchaseDetailsByPurchaseId(this.purchase.id);
    this.isLoading = false;
  }

  onClose() {
    this.close.emit();
  }

  onEdit() {
    this.editPurchase.emit(this.purchase);
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800 border border-green-200';
      case 2: return 'bg-red-100 text-red-800 border border-red-200';
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
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

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  calculateTotal(details: PurchaseDetail[]): number {
    return details.reduce((total, detail) => total + detail.subtotal, 0);
  }
}
