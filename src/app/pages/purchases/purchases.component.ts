import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PurchaseService } from '../../services/purchase.service';
import { PurchaseCreateRequest } from '../../interfaces/purchase-create-request';
import { Purchase } from '../../interfaces/purchase';
import { PurchaseFormComponent } from '../../components/purchase-form/purchase-form.component';
import { PurchaseListComponent } from '../../components/purchase-list/purchase-list.component';
import { PurchaseDetailViewComponent } from '../../components/purchase-detail-view/purchase-detail-view.component';

@Component({
  selector: 'app-purchases',
  standalone: true,
  imports: [
    CommonModule,
    AsyncPipe,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    PurchaseFormComponent,
    PurchaseListComponent,
    PurchaseDetailViewComponent
  ],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.css'
})
export class PurchasesComponent implements OnInit {
  purchaseService = inject(PurchaseService);
  snackBar = inject(MatSnackBar);
  
  errorMessage = '';
  localPurchase: PurchaseCreateRequest = {
    providerId: 0,
    adminId: 'd492f02f-0c0f-4817-a327-40dba81726ec', // ID del admin por defecto
    purchaseDate: new Date().toISOString(),
    total: 0,
    status: 0,
    details: []
  };
  
  purchases$!: Observable<Purchase[]>;
  isEditing = false;
  editingPurchaseId: number = 0;
  selectedPurchase: Purchase | null = null;
  showPurchaseDetails = false;

  ngOnInit() {
    this.loadPurchases();
    this.initializePurchase();
  }

  loadPurchases() {
    this.purchases$ = this.purchaseService.getPurchases();
  }

  initializePurchase() {
    this.localPurchase = {
      providerId: 0,
      adminId: 'd492f02f-0c0f-4817-a327-40dba81726ec', // ID del admin por defecto
      purchaseDate: new Date().toISOString(),
      total: 0,
      status: 0,
      details: []
    };
  }

  // Métodos para las estadísticas
  getTotalPurchases(purchases: Purchase[] | null): number {
    return purchases?.length || 0;
  }

  getPendingPurchases(purchases: Purchase[] | null): number {
    return purchases?.filter(p => p.status === 0).length || 0;
  }

  getCompletedPurchases(purchases: Purchase[] | null): number {
    return purchases?.filter(p => p.status === 1).length || 0;
  }

  createPurchase(purchase: PurchaseCreateRequest) {
    console.log('Iniciando creación de compra:', purchase);

    this.purchaseService.createPurchase(purchase).subscribe({
      next: (response) => {
        console.log('Compra creada exitosamente:', response);
        this.snackBar.open('Compra creada con éxito', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadPurchases();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error detallado:', {
          status: error.status,
          message: error.message,
          errors: error.error?.errors
        });
        
        let errorMessage = 'Error al crear la compra';
        
        if (error.error?.errors) {
          const validationErrors = Object.values(error.error.errors).flat();
          errorMessage = validationErrors.join('\n');
        }
        
        this.errorMessage = errorMessage;
        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });
      }
    });
  }

  updatePurchase(purchase: PurchaseCreateRequest) {
    this.purchaseService.updatePurchase(this.editingPurchaseId, purchase).subscribe({
      next: (response: { message: string }) => {
        this.loadPurchases();
        this.snackBar.open('Compra actualizada exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open('Error al actualizar la compra', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  editPurchase(purchase: Purchase) {
    this.isEditing = true;
    this.editingPurchaseId = purchase.id;
    this.localPurchase = {
      providerId: purchase.providerId,
      adminId: purchase.adminId,
      purchaseDate: purchase.purchaseDate,
      total: purchase.total,
      status: purchase.status,
      details: [] // Los detalles se pueden cargar por separado si es necesario
    };
  }

  deletePurchase(id: number) {
    if (confirm('¿Estás seguro de que quieres eliminar esta compra?')) {
      this.purchaseService.deletePurchase(id).subscribe({
        next: (response) => {
          this.loadPurchases();
          this.snackBar.open('Compra eliminada exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open('Error al eliminar la compra', 'Cerrar', {
            duration: 3000,
          });
        },
      });
    }
  }

  savePurchase(purchase: PurchaseCreateRequest) {
    this.errorMessage = '';
    if (this.isEditing) {
      this.updatePurchase(purchase);
    } else {
      this.createPurchase(purchase);
    }
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.initializePurchase();
    this.isEditing = false;
    this.editingPurchaseId = 0;
    this.errorMessage = '';
  }

  // Métodos para manejar la visualización de detalles
  viewPurchaseDetails(purchase: Purchase) {
    this.selectedPurchase = purchase;
    this.showPurchaseDetails = true;
  }

  closePurchaseDetails() {
    this.showPurchaseDetails = false;
    this.selectedPurchase = null;
  }

  editFromDetails(purchase: Purchase) {
    this.closePurchaseDetails();
    this.editPurchase(purchase);
  }
}