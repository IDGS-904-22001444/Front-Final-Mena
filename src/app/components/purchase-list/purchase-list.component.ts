import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Purchase } from '../../interfaces/purchase';

@Component({
  selector: 'app-purchase-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './purchase-list.component.html',
  styleUrl: './purchase-list.component.css'
})
export class PurchaseListComponent {
  @Input({ required: true }) purchases!: Purchase[] | null;
  @Output() editPurchase = new EventEmitter<Purchase>();
  @Output() deletePurchase = new EventEmitter<number>();
  @Output() viewPurchaseDetails = new EventEmitter<Purchase>();

  // Método trackBy para optimizar el rendimiento de ngFor
  trackByPurchaseId(index: number, purchase: Purchase): number {
    return purchase.id;
  }

  edit(purchase: Purchase) {
    this.editPurchase.emit(purchase);
  }

  delete(id: number) {
    this.deletePurchase.emit(id);
  }

  viewDetails(purchase: Purchase) {
    this.viewPurchaseDetails.emit(purchase);
  }

  getStatusClass(status: number): string {
    switch (status) {
      case 1: return 'bg-green-100 text-green-800 border border-green-200'; // Completado
      case 2: return 'bg-red-100 text-red-800 border border-red-200';       // Cancelado
      default: return 'bg-yellow-100 text-yellow-800 border border-yellow-200'; // Pendiente
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}