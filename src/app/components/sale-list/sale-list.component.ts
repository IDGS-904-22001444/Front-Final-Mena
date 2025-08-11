import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Sale } from '../../interfaces/sale';

@Component({
  selector: 'app-sale-list',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './sale-list.component.html',
  styleUrl: './sale-list.component.css'
})
export class SaleListComponent {
  @Input({ required: true }) sales!: Sale[] | null;
  @Input() isAdmin: boolean = false;
  @Input() selectedSaleId: number | null = null;
  @Output() saleSelected = new EventEmitter<number>();
  @Output() editSale = new EventEmitter<Sale>();
  @Output() deleteSale = new EventEmitter<number>();
  @Input() showSaleDetail: boolean = false;

  trackBySaleId(index: number, sale: Sale): number {
    return sale.id;
  }

  onSelectSale(saleId: number) {
    this.saleSelected.emit(saleId);
  }

  edit(sale: Sale) {
    this.editSale.emit(sale);
  }

  delete(id: number) {
    this.deleteSale.emit(id);
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
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}