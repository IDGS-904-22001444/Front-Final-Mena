import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
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

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  // Modelo del formulario
  formData = {
    name: '',
    description: '',
    salePrice: 0,
    stock: 0,
    status: 0,
    imageUrl: null as string | null
  };

  // Variables para la imagen
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  isImageUploading = false;

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
        status: this.editingProduct.status,
        imageUrl: this.editingProduct.imageUrl
      };
      this.imagePreview = this.editingProduct.imageUrl;
    } else {
      // Modo creación: resetear formulario
      this.formData = {
        name: '',
        description: '',
        salePrice: 0,
        stock: 0,
        status: 1, // Por defecto activo
        imageUrl: null
      };
      this.imagePreview = null;
    }
    this.selectedImage = null;
  }

  /**
   * Maneja la selección de archivo de imagen
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validar tipo de archivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona solo archivos de imagen.');
        return;
      }

      // Validar tamaño (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('La imagen debe ser menor a 5MB.');
        return;
      }

      this.selectedImage = file;
      this.createImagePreview(file);
    }
  }

  /**
   * Crea una vista previa de la imagen seleccionada y la convierte a base64
   */
  private createImagePreview(file: File) {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      this.imagePreview = e.target.result;
      // Convertir a base64 string para enviar al backend
      this.formData.imageUrl = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  /**
   * Elimina la imagen seleccionada
   */
  removeImage() {
    this.selectedImage = null;
    this.imagePreview = null;
    this.formData.imageUrl = null;
    if (this.fileInput) {
      this.fileInput.nativeElement.value = '';
    }
  }

  /**
   * Comprime la imagen si es necesario para reducir el tamaño
   */
  private compressImage(file: File): Promise<string> {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calcular nuevas dimensiones (máximo 800x600)
        const maxWidth = 800;
        const maxHeight = 600;
        let { width, height } = img;
        
        if (width > height) {
          if (width > maxWidth) {
            height = (height * maxWidth) / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = (width * maxHeight) / height;
            height = maxHeight;
          }
        }
        
        canvas.width = width;
        canvas.height = height;
        
        // Dibujar imagen redimensionada
        ctx?.drawImage(img, 0, 0, width, height);
        
        // Convertir a base64 con calidad 0.8
        const base64 = canvas.toDataURL('image/jpeg', 0.8);
        resolve(base64);
      };
      
      img.src = URL.createObjectURL(file);
    });
  }

  async onSubmit() {
    if (this.isFormValid()) {
      // Si hay una nueva imagen seleccionada, comprimirla y convertirla a base64
      if (this.selectedImage) {
        this.isImageUploading = true;
        try {
          const compressedImage = await this.compressImage(this.selectedImage);
          this.formData.imageUrl = compressedImage;
          console.log('Imagen procesada como base64:', compressedImage.substring(0, 100) + '...');
        } catch (error) {
          console.error('Error al procesar la imagen:', error);
          // Fallback: usar la imagen sin comprimir
          const reader = new FileReader();
          reader.onload = (e: any) => {
            this.formData.imageUrl = e.target.result;
          };
          reader.readAsDataURL(this.selectedImage);
        } finally {
          this.isImageUploading = false;
        }
      }

      // Log del objeto que se enviará al backend
      console.log('Datos del producto a enviar:', {
        ...this.formData,
        imageUrl: this.formData.imageUrl ? 'base64_string_here' : null
      });

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
      status: 1,
      imageUrl: null
    };
    this.selectedImage = null;
    this.imagePreview = null;
  }

  isFormValid(): boolean {
    return !!(this.formData.name && 
             this.formData.description && 
             this.formData.salePrice >= 0 &&
             this.formData.stock >= 0);
  }
}