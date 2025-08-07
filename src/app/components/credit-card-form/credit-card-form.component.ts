import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

export interface CreditCardData {
  cardNumber: string;
  cardholderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

@Component({
  selector: 'app-credit-card-form',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './credit-card-form.component.html',
  styleUrl: './credit-card-form.component.css'
})
export class CreditCardFormComponent {
  @Output() cardSubmitted = new EventEmitter<CreditCardData>();
  @Output() cancelled = new EventEmitter<void>();

  cardData: CreditCardData = {
    cardNumber: '',
    cardholderName: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: ''
  };

  errors: { [key: string]: string } = {};
  isLoading = false;

  // Validación de número de tarjeta (16 dígitos)
  validateCardNumber(cardNumber: string): boolean {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    return /^\d{16}$/.test(cleanNumber);
  }

  // Validación de CVV (3-4 dígitos)
  validateCVV(cvv: string): boolean {
    return /^\d{3,4}$/.test(cvv);
  }

  // Validación de fecha de expiración
  validateExpiryDate(month: string, year: string): boolean {
    if (!month || !year) return false;
    
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    
    const expiryYear = parseInt(year);
    const expiryMonth = parseInt(month);
    
    if (expiryYear < currentYear) return false;
    if (expiryYear === currentYear && expiryMonth < currentMonth) return false;
    
    return true;
  }

  // Validación de nombre del titular
  validateCardholderName(name: string): boolean {
    return name.trim().length >= 3;
  }

  // Formatear número de tarjeta con espacios
  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\s/g, '');
    value = value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.cardData.cardNumber = value;
  }

  // Método para manejar cambios en el número de tarjeta
  onCardNumberChange(value: string): void {
    let formattedValue = value.replace(/\s/g, '');
    formattedValue = formattedValue.replace(/\D/g, '');
    formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 ');
    this.cardData.cardNumber = formattedValue;
  }

  // Validar todo el formulario
  validateForm(): boolean {
    this.errors = {};

    // Validar número de tarjeta
    if (!this.cardData.cardNumber) {
      this.errors['cardNumber'] = 'El número de tarjeta es requerido';
    } else if (!this.validateCardNumber(this.cardData.cardNumber)) {
      this.errors['cardNumber'] = 'El número de tarjeta debe tener 16 dígitos';
    }

    // Validar nombre del titular
    if (!this.cardData.cardholderName) {
      this.errors['cardholderName'] = 'El nombre del titular es requerido';
    } else if (!this.validateCardholderName(this.cardData.cardholderName)) {
      this.errors['cardholderName'] = 'El nombre debe tener al menos 3 caracteres';
    }

    // Validar mes de expiración
    if (!this.cardData.expiryMonth) {
      this.errors['expiryMonth'] = 'El mes de expiración es requerido';
    } else if (parseInt(this.cardData.expiryMonth) < 1 || parseInt(this.cardData.expiryMonth) > 12) {
      this.errors['expiryMonth'] = 'Mes inválido';
    }

    // Validar año de expiración
    if (!this.cardData.expiryYear) {
      this.errors['expiryYear'] = 'El año de expiración es requerido';
    }

    // Validar fecha de expiración completa
    if (this.cardData.expiryMonth && this.cardData.expiryYear) {
      if (!this.validateExpiryDate(this.cardData.expiryMonth, this.cardData.expiryYear)) {
        this.errors['expiryDate'] = 'La tarjeta ha expirado o expira muy pronto';
      }
    }

    // Validar CVV
    if (!this.cardData.cvv) {
      this.errors['cvv'] = 'El CVV es requerido';
    } else if (!this.validateCVV(this.cardData.cvv)) {
      this.errors['cvv'] = 'El CVV debe tener 3 o 4 dígitos';
    }

    return Object.keys(this.errors).length === 0;
  }

  onSubmit(): void {
    if (this.validateForm()) {
      this.isLoading = true;
      
      // Simular procesamiento de pago
      setTimeout(() => {
        this.isLoading = false;
        this.cardSubmitted.emit(this.cardData);
      }, 2000);
    }
  }

  onCancel(): void {
    this.cancelled.emit();
  }

  // Generar años para el select (actual + 10 años)
  getYears(): number[] {
    const currentYear = new Date().getFullYear();
    const years = [];
    for (let i = currentYear; i <= currentYear + 10; i++) {
      years.push(i);
    }
    return years;
  }

  // Generar meses para el select
  getMonths(): number[] {
    return Array.from({length: 12}, (_, i) => i + 1);
  }
}
