import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { PurchaseService } from '../../services/purchase.service';
import { ProductService } from '../../services/product.service';
import { QuotationService } from '../../services/quotation.service';
import { SaleService } from '../../services/sale.service';
import { NgChartsModule } from 'ng2-charts';
import { ChartOptions, ChartType, ChartData, ChartDataset, ChartConfiguration } from 'chart.js';

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
  comprasRecientes: any[] = [];
  cotizacionesPorTipo: { tipo: string, cantidad: number }[] = [];

  public userFullName: string = '';

  // Gráfica de barras (ventas a clientes)
  barChartLabels: string[] = [];
  barChartData: ChartData<'bar'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Ventas',
        backgroundColor: 'rgba(34, 197, 94, 0.8)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 2
      }
    ]
  };
  barChartOptions: ChartOptions<'bar'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Ventas a Clientes por Día del Mes'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  // Gráfica lineal (compras a proveedores)
  lineChartLabels: string[] = [];
  lineChartData: ChartData<'line'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        label: 'Compras a Proveedores',
        backgroundColor: 'rgba(245, 158, 66, 0.2)',
        borderColor: 'rgba(245, 158, 66, 1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };
  lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      },
      title: {
        display: true,
        text: 'Total de Compras a Proveedores por Día'
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + value;
          }
        }
      }
    }
  };

  // Gráfica de dona (cotizaciones por tipo de reptil)
  doughnutChartLabels: string[] = [];
  doughnutChartData: ChartData<'doughnut'> = {
    labels: [],
    datasets: [
      { 
        data: [], 
        backgroundColor: [
          '#F59E42', 
          '#FBBF24', 
          '#F87171', 
          '#34D399', 
          '#60A5FA',
          '#A78BFA',
          '#FB7185',
          '#FCD34D'
        ],
        borderWidth: 2,
        borderColor: '#ffffff'
      }
    ]
  };
  doughnutChartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'right'
      },
      title: {
        display: true,
        text: 'Distribución por Tipo de Reptil'
      }
    }
  };

  constructor(
    private authService: AuthService,
    private purchaseService: PurchaseService,
    private productService: ProductService,
    private quotationService: QuotationService,
    private saleService: SaleService,
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

    // Ventas a clientes
    this.saleService.getAllSales().subscribe((sales) => {
      // Ventas del mes actual
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const ventasMes = sales.filter((s: any) => {
        const fecha = new Date(s.saleDate);
        return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
      });

      // Gráfica de barras: ventas por día del mes actual
      const diasVentas: { [dia: string]: number } = {};
      ventasMes.forEach((venta: any) => {
        const fecha = new Date(venta.saleDate);
        const dia = fecha.getDate().toString();
        diasVentas[dia] = (diasVentas[dia] || 0) + 1;
      });
      this.barChartLabels = Object.keys(diasVentas).sort((a, b) => +a - +b);
      this.barChartData = {
        labels: this.barChartLabels,
        datasets: [
          { 
            data: this.barChartLabels.map(dia => diasVentas[dia]), 
            label: 'Ventas',
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2
          }
        ]
      };

      // Ventas recientes para la tabla
      this.ventasRecientes = sales
        .sort((a: any, b: any) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
        .slice(0, 10);
    });

    // Compras a proveedores
    this.purchaseService.getPurchases().subscribe((purchases) => {
      this.dashboardData.comprasPendientes = purchases.filter(
        (p: any) => p.status === 0
      ).length;

      // Compras del mes actual
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const comprasMes = purchases.filter((p: any) => {
        const fecha = new Date(p.purchaseDate);
        return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
      });
      this.ventasMensuales = comprasMes.length;
      this.ventasRecientes = comprasMes.slice(0, 5);
      
      // Compras recientes para la tabla
      this.comprasRecientes = purchases
        .sort((a: any, b: any) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime())
        .slice(0, 10);

      // Gráfica lineal: total de compras por día del mes actual
      const diasCompras: { [dia: string]: number } = {};
      comprasMes.forEach((compra: any) => {
        const fecha = new Date(compra.purchaseDate);
        const dia = fecha.getDate().toString();
        diasCompras[dia] = (diasCompras[dia] || 0) + compra.total;
      });
      this.lineChartLabels = Object.keys(diasCompras).sort((a, b) => +a - +b);
      this.lineChartData = {
        labels: this.lineChartLabels,
        datasets: [
          { 
            data: this.lineChartLabels.map(dia => diasCompras[dia]), 
            label: 'Compras a Proveedores',
            backgroundColor: 'rgba(245, 158, 66, 0.2)',
            borderColor: 'rgba(245, 158, 66, 1)',
            borderWidth: 3,
            fill: true,
            tension: 0.4
          }
        ]
      };
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
            backgroundColor: [
              '#F59E42', 
              '#FBBF24', 
              '#F87171', 
              '#34D399', 
              '#60A5FA',
              '#A78BFA',
              '#FB7185',
              '#FCD34D'
            ],
            borderWidth: 2,
            borderColor: '#ffffff'
          }
        ]
      };
    });
  }
}