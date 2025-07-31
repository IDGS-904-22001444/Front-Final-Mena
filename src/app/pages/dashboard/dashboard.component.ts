import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatIconModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);

  dashboardData = {
    totalClientes: 128,
    comprasPendientes: 8,
    productosDisponibles: 72,
    cotizacionesNuevas: 3
  };

  ngOnInit() {
    const userDetail = this.authService.getUserDetail();
    if (!userDetail || !userDetail.roles.includes('Admin')) {
      // Si no es admin, redirigir al home
      this.router.navigate(['/']);
    }
  }
}