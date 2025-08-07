import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RawMaterialService } from '../../services/raw-material.service';
import { RawMaterial, RawMaterialCreateRequest } from '../../interfaces/raw-material';

@Component({
  selector: 'app-raw-materials',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './raw-materials.component.html',
  styleUrls: ['./raw-materials.component.css']
})
export class RawMaterialsComponent implements OnInit {
  rawMaterials: RawMaterial[] = [];
  isEditing = false;
  editingId?: number;
  
  formData: RawMaterialCreateRequest = {
    name: '',
    description: '',
    unitOfMeasure: '',
    unitCost: 0,
    stock: 0,
    status: 1
  };

  constructor(
    private rawMaterialService: RawMaterialService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadMaterials();
  }

  loadMaterials(): void {
    this.rawMaterialService.getRawMaterials()
      .subscribe({
        next: (materials) => this.rawMaterials = materials,
        error: () => this.showError('Error al cargar materiales')
      });
  }

  onSubmit(): void {
    if (this.isEditing && this.editingId) {
      this.updateMaterial();
    } else {
      this.createMaterial();
    }
  }

  createMaterial(): void {
    this.rawMaterialService.createRawMaterial(this.formData)
      .subscribe({
        next: () => {
          this.showSuccess('Material creado con éxito');
          this.resetForm();
          this.loadMaterials();
        },
        error: () => this.showError('Error al crear material')
      });
  }

  updateMaterial(): void {
    if (!this.editingId) return;
    
    this.rawMaterialService.updateRawMaterial(this.editingId, this.formData)
      .subscribe({
        next: () => {
          this.showSuccess('Material actualizado con éxito');
          this.resetForm();
          this.loadMaterials();
        },
        error: () => this.showError('Error al actualizar material')
      });
  }

  deleteMaterial(id: number): void {
    if (confirm('¿Está seguro de eliminar este material?')) {
      this.rawMaterialService.deleteRawMaterial(id)
        .subscribe({
          next: () => {
            this.showSuccess('Material eliminado con éxito');
            this.loadMaterials();
          },
          error: () => this.showError('Error al eliminar material')
        });
    }
  }

  editMaterial(material: RawMaterial): void {
    this.isEditing = true;
    this.editingId = material.id;
    this.formData = {
      name: material.name,
      description: material.description,
      unitOfMeasure: material.unitOfMeasure,
      unitCost: material.unitCost,
      stock: material.stock,
      status: material.status
    };
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingId = undefined;
    this.formData = {
      name: '',
      description: '',
      unitOfMeasure: '',
      unitCost: 0,
      stock: 0,
      status: 1
    };
  }

  private showSuccess(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  private showError(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 3000 });
  }

  getStockColor(stock: number): string {
    if (stock <= 1) {
      return 'bg-red-50 border-red-200'; // Fondo rojo tenue para stock crítico (0-1)
    } else if (stock < 5) {
      return 'bg-orange-50 border-orange-200'; // Fondo naranja tenue para stock bajo (2-4)
    } else {
      return 'border-gray-200'; // Color normal para stock adecuado (5+)
    }
  }
}