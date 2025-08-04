import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';
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
  @Input() localPurchase: PurchaseCreateRequest = {
    providerId: null,
    adminId: '',
    purchaseDate: new Date().toISOString(),
    total: 0,
    status: 1,
    details: []
  };
  
  @Output() savePurchase = new EventEmitter<PurchaseCreateRequest>();
  @Output() cancelEdit = new EventEmitter<void>();

  providers$!: Observable<Provider[]>;
  rawMaterials$!: Observable<RawMaterial[]>;

  constructor(
    private purchaseService: PurchaseService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.providers$ = this.purchaseService.getProviders().pipe(
      tap((providers: Provider[]) => console.log('Proveedores originales:', providers)),
      map((providers: Provider[]) => providers.map((provider: Provider) => ({
        ...provider,
        id: provider.id
      }))),
      tap((providers: Provider[]) => console.log('Proveedores procesados:', providers))
    );
    
    this.rawMaterials$ = this.purchaseService.getRawMaterials();

    if (!this.localPurchase.adminId) {
      const currentUser = this.authService.getUserDetail();
      if (currentUser) {
        this.localPurchase.adminId = currentUser.id;
      }
    }
  }

 // En purchase-form.component.ts
onProviderChange(event: Event): void {
  const select = event.target as HTMLSelectElement;
  const selectedValue = select.value;
  
  console.log('Valor seleccionado:', selectedValue);
  
  if (selectedValue) {
    const providerId = parseInt(selectedValue, 10);
    if (!isNaN(providerId)) {
      this.localPurchase.providerId = providerId;
      console.log('Provider seleccionado:', {
        valorOriginal: selectedValue,
        providerId: this.localPurchase.providerId,
        tipo: typeof this.localPurchase.providerId
      });
    } else {
      console.error('Error convirtiendo providerId:', selectedValue);
    }
  } else {
    this.localPurchase.providerId = null;
  }
}

  addDetail(): void {
    this.localPurchase.details.push({
      rawMaterialId: 0,
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      status: 1
    });
  }

  removeDetail(index: number): void {
    this.localPurchase.details.splice(index, 1);
    this.calculateTotal();
  }

  calculateDetailSubtotal(index: number): void {
    const detail = this.localPurchase.details[index];
    if (detail && detail.quantity && detail.unitPrice) {
      detail.subtotal = Number(detail.quantity) * Number(detail.unitPrice);
      this.calculateTotal();
    }
  }

  calculateTotal(): void {
    this.localPurchase.total = this.localPurchase.details.reduce(
      (sum, detail) => sum + (Number(detail.subtotal) || 0),
      0
    );
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const purchaseToSend = this.preparePurchaseData();
    console.log('Datos a enviar:', purchaseToSend);
    this.savePurchase.emit(purchaseToSend);
  }

 private validateForm(): boolean {
  const providerId = Number(this.localPurchase.providerId);
  
  if (!providerId || isNaN(providerId)) {
    console.error('Provider ID inválido:', this.localPurchase.providerId);
    this.errorMessage = 'Debe seleccionar un proveedor válido';
    return false;
  }

  if (!this.localPurchase.details.length) {
    this.errorMessage = 'Debe agregar al menos un detalle de compra';
    return false;
  }

    if (!this.localPurchase.details.every(detail => 
      detail.rawMaterialId && detail.quantity > 0 && detail.unitPrice > 0)) {
      this.errorMessage = 'Todos los detalles deben estar completos y tener valores válidos';
      return false;
    }

    return true;
  }

  private preparePurchaseData(): PurchaseCreateRequest {
    return {
      providerId: Number(this.localPurchase.providerId),
      adminId: this.localPurchase.adminId,
      purchaseDate: new Date().toISOString(),
      total: Number(this.localPurchase.total),
      status: 1,
      details: this.localPurchase.details.map(detail => ({
        rawMaterialId: Number(detail.rawMaterialId),
        quantity: Number(detail.quantity),
        unitPrice: Number(detail.unitPrice),
        subtotal: Number(detail.subtotal),
        status: 1
      }))
    };
  }

  onCancel(): void {
    this.cancelEdit.emit();
  }
}