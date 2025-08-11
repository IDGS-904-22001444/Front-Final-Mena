import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { QuotationService } from '../../services/quotation.service';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { QuotationRequest } from '../../interfaces/quotation-request';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-quotation-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './quotation-form.component.html'
})
export class QuotationFormComponent implements OnInit {
  quotationForm!: FormGroup;
  products: any[] = [];
  isLoadingProducts = false;

  constructor(
    private fb: FormBuilder,
    private quotationService: QuotationService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private http: HttpClient
  ) {
    this.initForm();
  }

  private initForm(): void {
    this.quotationForm = this.fb.group({
      productId: ['', [Validators.required]], // <-- Campo para el producto
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      country: ['', [Validators.required]],
      region: ['', [Validators.required]],
      company: ['', [Validators.required]],
      animalType: ['', [Validators.required]],
      needs: this.fb.group({
        terrariumMonitoring: [false],
        biologicalResearch: [false],
        zooOrAquarium: [false],
        naturalReserves: [false],
        other: [false]
      }),
      comments: ['', [Validators.required]],
      acceptsInfo: [false, [Validators.requiredTrue]]
    });
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoadingProducts = true;
    this.http.get<any[]>('https://localhost:5000/api/products').subscribe({
      next: (data) => {
        this.products = data;
        this.isLoadingProducts = false;
      },
      error: () => {
        this.products = [];
        this.isLoadingProducts = false;
      }
    });
  }

  onSubmit(): void {
    if (this.quotationForm.valid) {
      const formData = this.quotationForm.value;
      const needs = formData.needs || {};

      const request: QuotationRequest = {
        productId: formData.productId, // <-- Enviar el producto seleccionado
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        country: formData.country,
        region: formData.region,
        company: formData.company,
        animalType: formData.animalType,
        comments: formData.comments,
        needHabitatSystem: needs.terrariumMonitoring || false,
        needBiologyResearch: needs.biologicalResearch || false,
        needZoosAquariums: needs.zooOrAquarium || false,
        needNaturalReserves: needs.naturalReserves || false,
        needOther: needs.other || false,
        acceptsInfo: formData.acceptsInfo || false
      };

      this.quotationService.createQuotation(request).subscribe({
        next: (response) => {
          this.snackBar.open('Cotización enviada exitosamente', 'Cerrar', {
            duration: 3000
          });
          this.quotationForm.reset();
        },
        error: (error) => {
          this.snackBar.open('Error al enviar la cotización', 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  onAnimalTypeChange(event: any): void {
    const value = event.target.value;
    if (value === 'other') {
      this.quotationForm.addControl('otherAnimal', new FormControl('', Validators.required));
    } else {
      if (this.quotationForm.contains('otherAnimal')) {
        this.quotationForm.removeControl('otherAnimal');
      }
    }
  }
}