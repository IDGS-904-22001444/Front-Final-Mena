import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Observable } from 'rxjs';
import { SaleService } from '../../services/sale.service';
import { Sale } from '../../interfaces/sale';
import { SaleListComponent } from '../../components/sale-list/sale-list.component';

@Component({
  selector: 'app-my-purchases',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    SaleListComponent
  ],
  templateUrl: './my-purchases.component.html',
  styleUrl: './my-purchases.component.css'
})
export class MyPurchasesComponent implements OnInit {
  saleService = inject(SaleService);
  
  myPurchases$!: Observable<Sale[]>;

  ngOnInit() {
    this.loadMyPurchases();
  }

  loadMyPurchases() {
    this.myPurchases$ = this.saleService.getClientSales();
  }

  // Métodos para estadísticas del cliente
  getTotalPurchases(purchases: Sale[] | null): number {
    return purchases?.length || 0;
  }

  getTotalSpent(purchases: Sale[] | null): number {
    return purchases?.reduce((total, purchase) => total + purchase.total, 0) || 0;
  }

  getCompletedPurchases(purchases: Sale[] | null): number {
    return purchases?.filter(p => p.status === 1).length || 0;
  }

  getPendingPurchases(purchases: Sale[] | null): number {
    return purchases?.filter(p => p.status === 0).length || 0;
  }

  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }
}