import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../interfaces/sale';
import { SaleListComponent } from '../../components/sale-list/sale-list.component';

@Component({
  selector: 'app-sales-admin',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    SaleListComponent
  ],
  templateUrl: './sales-admin.component.html',
  styleUrl: './sales-admin.component.css'
})
export class SalesAdminComponent implements OnInit {
  saleService = inject(SaleService);
  snackBar = inject(MatSnackBar);

  sales$!: Observable<Sale[]>;
  selectedSale: Sale | null = null;
  showSaleDetail = false;
  isLoadingDetail = false;

  ngOnInit() {
    this.loadSales();
  }

  loadSales() {
    this.sales$ = this.saleService.getAllSales();
  }

  editSale(sale: Sale) {
    // Implementar edición si es necesario
    console.log('Editar venta:', sale);
  }

  deleteSale(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta venta?')) {
      this.saleService.deleteSale(id).subscribe({
        next: () => {
          this.loadSales();
          this.snackBar.open('Venta eliminada exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open('Error al eliminar la venta', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }

  // Nuevo método para seleccionar y mostrar detalle
  onSaleSelected(saleId: number) {
    this.isLoadingDetail = true;
    this.saleService.getSale(saleId).subscribe({
      next: (detail) => {
        this.selectedSale = detail;
        this.showSaleDetail = true;
        this.isLoadingDetail = false;
      },
      error: () => {
        this.snackBar.open('Error al cargar el detalle de la venta', 'Cerrar', { duration: 3000 });
        this.isLoadingDetail = false;
      }
    });
  }

  // Métodos para estadísticas del admin
  getTotalSales(sales: Sale[] | null): number {
    return sales?.length || 0;
  }

  getTotalRevenue(sales: Sale[] | null): number {
    return sales?.reduce((total, sale) => total + sale.total, 0) || 0;
  }

  getCompletedSales(sales: Sale[] | null): number {
    return sales?.filter(s => s.status === 1).length || 0;
  }

  getPendingSales(sales: Sale[] | null): number {
    return sales?.filter(s => s.status === 0).length || 0;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }

  closeSaleDetail() {
    this.showSaleDetail = false;
    this.selectedSale = null;
  }
}