import { Component, EventEmitter, Input, Output, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { PurchaseCreateRequest } from '../../interfaces/purchase-create-request';
import { PurchaseService } from '../../services/purchase.service';
import { Provider } from '../../interfaces/provider';
import { RawMaterial } from '../../interfaces/raw-material';
import { Observable } from 'rxjs';

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
    CommonModule
  ],
  templateUrl: './purchase-form.component.html',
  styleUrl: './purchase-form.component.css'
})
export class PurchaseFormComponent implements OnInit {
  @Input() purchase: PurchaseCreateRequest = {} as PurchaseCreateRequest;
  @Input() isEditing: boolean = false;
  @Input() errorMessage: string = '';
  @Output() savePurchase = new EventEmitter<PurchaseCreateRequest>();
  @Output() cancelEdit = new EventEmitter<void>();

  purchaseService = inject(PurchaseService);
  providers$!: Observable<Provider[]>;
  rawMaterials$!: Observable<RawMaterial[]>;

  ngOnInit() {
    this.providers$ = this.purchaseService.getProviders();
    this.rawMaterials$ = this.purchaseService.getRawMaterials();
    
    if (!this.purchase.status) {
      this.purchase.status = 0; // 0 = Pendiente
    }
    if (!this.purchase.details) {
      this.purchase.details = [];
    }
  }

  addDetail() {
    this.purchase.details.push({
      rawMaterialId: 0,
      quantity: 1,
      unitPrice: 0,
      subtotal: 0,
      status: 0
    });
  }

  removeDetail(index: number) {
    this.purchase.details.splice(index, 1);
    this.calculateTotal();
  }

  calculateDetailSubtotal(index: number) {
    const detail = this.purchase.details[index];
    if (detail.quantity && detail.unitPrice) {
      detail.subtotal = detail.quantity * detail.unitPrice;
    }
    this.calculateTotal();
  }

  calculateTotal() {
    this.purchase.total = this.purchase.details.reduce((total: number, detail: any) => total + detail.subtotal, 0);
  }

  onSubmit() {
    this.calculateTotal();
    this.savePurchase.emit(this.purchase);
  }

  onCancel() {
    this.cancelEdit.emit();
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Pendiente';
      case 1: return 'Completado';
      case 2: return 'Cancelado';
      default: return 'Desconocido';
    }
  }
}