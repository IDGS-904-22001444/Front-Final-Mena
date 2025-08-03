import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

import { PurchaseCreateRequest } from '../../interfaces/purchase-create-request';
import { PurchaseService } from '../../services/purchase.service';
import { Provider } from '../../interfaces/provider';
import { RawMaterial } from '../../interfaces/raw-material';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-purchase-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    CommonModule,
  ],
  templateUrl: './purchase-form.component.html',
  styleUrls: ['./purchase-form.component.css'],
})
export class PurchaseFormComponent implements OnInit {
  @Input() isEditing: boolean = false;
  @Input() errorMessage: string = '';
  @Input() localPurchase!: PurchaseCreateRequest;
  @Output() savePurchase = new EventEmitter<PurchaseCreateRequest>();
  @Output() cancelEdit = new EventEmitter<void>();

  providers$!: Observable<Provider[]>;
  rawMaterials$!: Observable<RawMaterial[]>;
  
  constructor(
    private purchaseService: PurchaseService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.providers$ = this.purchaseService.getProviders();
    this.rawMaterials$ = this.purchaseService.getRawMaterials();

    // Inicializar con valores por defecto si no hay valores previos
    if (!this.localPurchase) {
      this.localPurchase = {
        providerId: 0,
        adminId: '',
        purchaseDate: new Date().toISOString(),
        status: 1,
        total: 0,
        details: []
      };
    } else if (this.localPurchase.providerId) {
      // Asegurar que providerId sea un número
      this.localPurchase.providerId = Number(this.localPurchase.providerId);
    }

    // Si no hay adminId, intentar obtener del usuario autenticado
    if (!this.localPurchase.adminId) {
      const currentUser = this.authService.getUserDetail();
      if (currentUser) {
        this.localPurchase.adminId = currentUser.id;
      }
    }
  }

  addDetail() {
    this.localPurchase.details.push({
      rawMaterialId: 0,
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      status: 1
    });
  }

  removeDetail(index: number) {
    this.localPurchase.details.splice(index, 1);
    this.calculateTotal();
  }

  calculateDetailSubtotal(index: number) {
    const detail = this.localPurchase.details[index];
    if (detail.quantity && detail.unitPrice) {
      detail.subtotal = detail.quantity * detail.unitPrice;
      this.calculateTotal();
    }
  }

  calculateTotal() {
    this.localPurchase.total = this.localPurchase.details.reduce(
      (total, detail) => total + (detail.subtotal || 0),
      0
    );
  }

  handleProviderChange(value: string): void {
  if (value) {
    this.localPurchase.providerId = Number(value);
    console.log('Provider ID seleccionado:', this.localPurchase.providerId, 'tipo:', typeof this.localPurchase.providerId);
  }
}

  onProviderChange(event: any) {
  // Extraer el valor directamente del modelo
  console.log('Provider ID seleccionado (antes):', this.localPurchase.providerId);
  
  // Asegurar que sea un número
  if (this.localPurchase.providerId !== null && this.localPurchase.providerId !== undefined) {
    this.localPurchase.providerId = Number(this.localPurchase.providerId);
    console.log('Provider ID seleccionado (después):', this.localPurchase.providerId, 'tipo:', typeof this.localPurchase.providerId);
  }
}

onSubmit() {
  console.log('Datos de compra antes de enviar:', JSON.stringify(this.localPurchase, null, 2));
  
  // Validar el providerId
  if (this.localPurchase.providerId === null || this.localPurchase.providerId === undefined) {
    this.errorMessage = 'Debe seleccionar un proveedor';
    return;
  }
  
  // Asegurar que providerId sea un número
  this.localPurchase.providerId = Number(this.localPurchase.providerId);
  
  if (isNaN(this.localPurchase.providerId) || this.localPurchase.providerId === 0) {
    this.errorMessage = 'Debe seleccionar un proveedor válido';
    return;
  }
  
  // Validar detalles de la compra
  if (!this.localPurchase.details.length) {
    this.errorMessage = 'Debe agregar al menos un detalle de compra';
    return;
  }
  
  // Resto de validaciones y lógica del formulario...
  
  // Crear objeto para enviar
  const purchaseToSend = {
    ...this.localPurchase,
    providerId: Number(this.localPurchase.providerId),
    total: Number(this.localPurchase.total),
    details: this.localPurchase.details.map(detail => ({
      rawMaterialId: Number(detail.rawMaterialId),
      quantity: Number(detail.quantity),
      unitPrice: Number(detail.unitPrice),
      subtotal: Number(detail.subtotal),
      status: 1
    }))
  };
  
  console.log('Datos a enviar:', JSON.stringify(purchaseToSend, null, 2));
  this.savePurchase.emit(purchaseToSend);
}

  onCancel() {
    this.cancelEdit.emit();
  }
}