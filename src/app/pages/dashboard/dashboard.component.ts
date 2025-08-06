import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PurchaseService } from '../../services/purchase.service';
import { ProductService } from '../../services/product.service';
import { QuotationService } from '../../services/quotation.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData, ChartDataset } from 'chart.js';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule, NgChartsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent implements OnInit {
  dashboardData = {
    totalClientes: 0,
    comprasPendientes: 0,
    productosDisponibles: 0,
    cotizacionesNuevas: 0,
  };

  ventasMensuales: number = 0;
  ventasRecientes: any[] = [];
  cotizacionesPorTipo: { tipo: string, cantidad: number }[] = [];

  public userFullName: string = '';

  // Gráfica de barras (ventas mensuales)
  barChartLabels: string[] = [];
  barChartData: ChartDataset<'bar'>[] = [
    { data: [], label: 'Ventas' }
  ];
  barChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  // Gráfica de dona (cotizaciones por tipo de reptil)
  doughnutChartLabels: string[] = [];
  doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      { data: [], backgroundColor: ['#F59E42', '#FBBF24', '#F87171', '#34D399', '#60A5FA'] }
    ]
  };
  doughnutChartOptions: ChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    }
  };

  constructor(
    private authService: AuthService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private quotationService: QuotationService,
    private router: Router
  ) {}

  ngOnInit() {
    const userDetail = this.authService.getUserDetail();
    if (!userDetail || !userDetail.roles.includes('Admin')) {
      this.router.navigate(['/']);
      return;
    }
    this.userFullName = userDetail.fullName;
    this.loadDashboardData();
  }

  goTo(path: string) {
    this.router.navigate([path]);
  }

  loadDashboardData() {
    // Total de clientes
    this.authService.getAll().subscribe((users) => {
      this.dashboardData.totalClientes = users.filter(
        (u: any) => u.roles && u.roles.includes('Cliente')
      ).length;
    });

    // Compras pendientes y ventas mensuales/recientes
    this.purchaseService.getPurchases().subscribe((purchases) => {
      this.dashboardData.comprasPendientes = purchases.filter(
        (p: any) => p.status === 0
      ).length;

      // Ventas mensuales y recientes
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const ventasMes = purchases.filter((p: any) => {
        const fecha = new Date(p.purchaseDate);
        return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
      });
      this.ventasMensuales = ventasMes.length;
      this.ventasRecientes = ventasMes.slice(0, 5);

      // Gráfica de barras: ventas por día del mes actual
      const dias: { [dia: string]: number } = {};
      ventasMes.forEach((venta: any) => {
        const fecha = new Date(venta.purchaseDate);
        const dia = fecha.getDate().toString();
        dias[dia] = (dias[dia] || 0) + 1;
      });
      this.barChartLabels = Object.keys(dias).sort((a, b) => +a - +b);
      this.barChartData = [
        { data: this.barChartLabels.map(dia => dias[dia]), label: 'Ventas' }
      ];
    });

    // Productos disponibles
    this.productService.getProducts().subscribe((products) => {
      this.dashboardData.productosDisponibles = products.filter(
        (p: any) => p.status === 1
      ).length;
    });

    // Cotizaciones nuevas y por tipo de reptil
    this.quotationService.getAllQuotations().subscribe((quotations) => {
      this.dashboardData.cotizacionesNuevas = quotations.filter(
        (q: any) => q.status === 1
      ).length;

      // Agrupar cotizaciones por tipo de reptil
      const agrupadas: { [tipo: string]: number } = {};
      quotations.forEach((q: any) => {
        const tipo = q.reptileType || 'Sin especificar';
        agrupadas[tipo] = (agrupadas[tipo] || 0) + 1;
      });
      this.cotizacionesPorTipo = Object.entries(agrupadas).map(([tipo, cantidad]) => ({ tipo, cantidad }));

      // Actualizar gráfica de dona
      this.doughnutChartLabels = this.cotizacionesPorTipo.map(item => item.tipo);
      this.doughnutChartData = {
        labels: this.doughnutChartLabels,
        datasets: [
          {
            data: this.cotizacionesPorTipo.map(item => item.cantidad),
            backgroundColor: ['#F59E42', '#FBBF24', '#F87171', '#34D399', '#60A5FA']
          }
        ]
      };
    });
  }
}