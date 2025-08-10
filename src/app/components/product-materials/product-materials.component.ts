import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { ProductMaterialService } from '../../services/product-material.service';
import {
  ProductMaterial,
  ProductMaterialCreateRequest,
  Product,
  RawMaterial,
} from '../../interfaces/product-material';
import { RawMaterialsComponent } from '../raw-materials/raw-materials.component';

@Component({
  selector: 'app-product-materials',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    RawMaterialsComponent,
  ],
  templateUrl: './product-materials.component.html',
  styleUrls: ['./product-materials.component.css'],
})
export class ProductMaterialsComponent implements OnInit {
  activeTab: 'assignments' | 'materials' = 'assignments';
  productMaterials: ProductMaterial[] = [];
  products: Product[] = [];
  rawMaterials: RawMaterial[] = [];
  groupedMaterials: { [productId: number]: ProductMaterial[] } = {};
  filteredProducts: Product[] = [];


  formData: ProductMaterialCreateRequest = {
    productId: 0,
    rawMaterialId: 0,
    requiredQuantity: 0,
    status: 1,
  };

  constructor(
    private productMaterialService: ProductMaterialService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
  this.productMaterialService.getProductMaterials().subscribe({
    next: (data) => {
      this.productMaterials = data;
      this.groupMaterialsByProduct();
    },
    error: (error) => this.showError('Error al cargar asignaciones'),
  });

  this.productMaterialService.getProducts().subscribe({
    next: (data) => {
      this.products = data;
      this.filteredProducts = this.products.filter(p => !!p);
    },
    error: (error) => this.showError('Error al cargar productos'),
  });

  this.productMaterialService.getRawMaterials().subscribe({
    next: (data) => (this.rawMaterials = data),
    error: (error) => this.showError('Error al cargar materiales'),
  });
}

  groupMaterialsByProduct(): void {
    this.groupedMaterials = {};
    for (const material of this.productMaterials) {
      const pid = material.product?.productId ?? material.productId;
      if (!this.groupedMaterials[pid]) {
        this.groupedMaterials[pid] = [];
      }
      this.groupedMaterials[pid].push(material);
    }
  }

  onSubmit(): void {
    this.productMaterialService.createProductMaterial(this.formData).subscribe({
      next: () => {
        this.showSuccess('Material asignado correctamente');
        this.resetForm();
        this.loadData();
      },
      error: (error) => this.showError('Error al asignar material'),
    });
  }

  deleteProductMaterial(id: number): void {
    if (confirm('¿Estás seguro de eliminar esta asignación?')) {
      this.productMaterialService.deleteProductMaterial(id).subscribe({
        next: () => {
          this.showSuccess('Asignación eliminada');
          this.loadData();
        },
        error: (error) => this.showError('Error al eliminar'),
      });
    }
  }

  resetForm(): void {
    this.formData = {
      productId: 0,
      rawMaterialId: 0,
      requiredQuantity: 0,
      status: 1,
    };
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }
}
