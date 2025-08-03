import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Product } from '../../interfaces/product';
import { ProductCreateRequest } from '../../interfaces/product-create-request';
import { ProductUpdateRequest } from '../../interfaces/product-update-request';

@Component({
  selector: 'app-product-form',
    standalone: true, // Añadir esta línea
  imports: [
    MatFormFieldModule, 
    MatInputModule, 
    MatButtonModule, 
    MatSelectModule,
    FormsModule, 
    MatIconModule,
    CommonModule
  ],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit, OnChanges {
  @Input() errorMessage: string = '';
  @Input() isEditing: boolean = false;
  @Input() editingProduct: Product | null = null;
  
  @Output() addProduct = new EventEmitter<ProductCreateRequest>();
  @Output() updateProduct = new EventEmitter<{ id: number, product: ProductUpdateRequest }>();
  @Output() cancelEdit = new EventEmitter<void>();

  // Modelo del formulario
  formData = {
    name: '',
    description: '',
    salePrice: 0,
    stock: 0,
    status: 0
  };

  // Opciones de estado
  statusOptions = [
    { value: 0, label: 'Inactivo' },
    { value: 1, label: 'Activo' }
  ];

  ngOnInit() {
    this.initializeForm();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['editingProduct'] || changes['isEditing']) {
      this.initializeForm();
    }
  }

  /**
   * Inicializa el formulario basado en el modo (creación/edición)
   */
  private initializeForm() {
    if (this.isEditing && this.editingProduct) {
      // Modo edición: cargar datos del producto
      this.formData = {
        name: this.editingProduct.name,
        description: this.editingProduct.description,
        salePrice: this.editingProduct.salePrice,
        stock: this.editingProduct.stock,
        status: this.editingProduct.status
      };
    } else {
      // Modo creación: resetear formulario
      this.formData = {
        name: '',
        description: '',
        salePrice: 0,
        stock: 0,
        status: 1 // Por defecto activo
      };
    }
  }

  onSubmit() {
    if (this.isEditing && this.editingProduct) {
      // Modo edición
      this.updateProduct.emit({
        id: this.editingProduct.productId,
        product: { ...this.formData }
      });
    } else {
      // Modo creación
      this.addProduct.emit({ ...this.formData });
    }
  }

  onCancel() {
    this.cancelEdit.emit();
    this.resetForm();
  }

  resetForm() {
    this.formData = {
      name: '',
      description: '',
      salePrice: 0,
      stock: 0,
      status: 1
    };
  }

  isFormValid(): boolean {
    return !!(this.formData.name && 
             this.formData.description && 
             this.formData.salePrice >= 0 &&
             this.formData.stock >= 0);
  }
}