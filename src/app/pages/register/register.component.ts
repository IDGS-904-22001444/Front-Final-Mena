import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { ValidationError } from '../../interfaces/validation-error';

@Component({
  selector: 'app-register',
  imports: [
    MatInputModule,
    MatIconModule,
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    MatSnackBarModule,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent implements OnInit {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  fb = inject(FormBuilder);
  router = inject(Router);
  registerForm!: FormGroup;
  confirmPasswordHide: boolean = true;
  passwordHide: boolean = true;
  errors: ValidationError[] = []; // Inicializar como array vacío

  /**
   * Función trackBy para optimizar el rendimiento del *ngFor de errores
   * @param index - Índice del elemento
   * @param item - El objeto error
   * @returns Identificador único para el trackBy
   */
  trackByFn(index: number, item: ValidationError): any {
    return item.code || item.description || index;
  }

  /**
   * Método para registrar un nuevo usuario
   */
register(): void {
  // Limpiar errores previos
  this.errors = [];

  if (this.registerForm.valid) {
    // Mapear los datos del formulario al formato que espera el servidor
    const registerData = {
      EmailAddress: this.registerForm.value.email,
      Password: this.registerForm.value.password,
      FullName: this.registerForm.value.fullName,
      Roles: [] // Enviar como array vacío en lugar de string vacío
    };

    this.authService.register(registerData).subscribe({
      next: (response) => {
        console.log('Registro exitoso:', response);

        this.matSnackBar.open(response.message || 'Cuenta creada exitosamente', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          panelClass: ['success-snackbar']
        });
        
        this.router.navigate(['/login']);
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error en el registro:', err);
        
        if (err?.status === 400) {
          // Convertir los errores del servidor al formato esperado
          this.errors = this.processServerErrors(err.error);
          this.matSnackBar.open('Por favor, corrige los errores en el formulario', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            panelClass: ['error-snackbar']
          });
        } else {
          // Error genérico del servidor
          this.matSnackBar.open('Error del servidor. Inténtalo más tarde.', 'Cerrar', {
            duration: 5000,
            horizontalPosition: 'center',
            panelClass: ['error-snackbar']
          });
        }
      },
    });
  } else {
    // Formulario inválido
    this.matSnackBar.open('Por favor, completa todos los campos correctamente', 'Cerrar', {
      duration: 3000,
      horizontalPosition: 'center',
      panelClass: ['warning-snackbar']
    });
    
    // Marcar todos los campos como touched para mostrar errores
    this.markFormGroupTouched(this.registerForm);
  }
}


  /**
   * Procesa los errores del servidor y los convierte al formato esperado por el componente
   * @param serverError - Error del servidor
   * @returns Array de errores formateados
   */
  private processServerErrors(serverError: any): ValidationError[] {
    const errors: ValidationError[] = [];

    if (serverError && serverError.errors) {
      // Procesar los errores del formato del servidor
      Object.keys(serverError.errors).forEach((field) => {
        const fieldErrors = serverError.errors[field];
        if (Array.isArray(fieldErrors)) {
          fieldErrors.forEach((errorMessage) => {
            errors.push({
              description: errorMessage,
              code: field,
            });
          });
        }
      });
    } else if (serverError && serverError.message) {
      // Error simple con mensaje
      errors.push({
        description: serverError.message,
        code: 'general',
      });
    }

    return errors;
  }

  /**
   * Marca todos los campos del formulario como touched para mostrar errores de validación
   * @param formGroup - Grupo de formulario
   */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }

  /**
   * Inicialización del componente
   */
  ngOnInit(): void {
    // Inicializar el formulario con validaciones (sin el campo roles)
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        fullName: ['', [Validators.required, Validators.minLength(2)]],
        confirmPassword: ['', [Validators.required]],
      },
      {
        validators: this.passwordMatchValidator,
      }
    );
  }

  /**
   * Validador personalizado para verificar que las contraseñas coincidan
   * @param control - Control del formulario
   * @returns Error si las contraseñas no coinciden, null si coinciden
   */
  private passwordMatchValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;

    if (password && confirmPassword && password !== confirmPassword) {
      return { passwordMismatch: true };
    }
    return null;
  }

  /**
   * Getter para acceder fácilmente a los controles del formulario en el template
   */
  get formControls() {
    return this.registerForm.controls;
  }

  /**
   * Verifica si un campo específico tiene errores y ha sido tocado
   * @param fieldName - Nombre del campo
   * @returns true si el campo tiene errores y ha sido tocado
   */
  hasFieldError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo específico
   * @param fieldName - Nombre del campo
   * @returns Mensaje de error o string vacío
   */
  getFieldErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    
    if (field && field.errors && (field.dirty || field.touched)) {
      if (field.errors['required']) {
        return `${this.getFieldDisplayName(fieldName)} es requerido`;
      }
      if (field.errors['email']) {
        return 'Ingresa un correo electrónico válido';
      }
      if (field.errors['minlength']) {
        const minLength = field.errors['minlength'].requiredLength;
        return `${this.getFieldDisplayName(fieldName)} debe tener al menos ${minLength} caracteres`;
      }
    }
    
    return '';
  }

  /**
   * Obtiene el nombre de visualización para un campo
   * @param fieldName - Nombre del campo
   * @returns Nombre de visualización del campo
   */
  private getFieldDisplayName(fieldName: string): string {
    const displayNames: { [key: string]: string } = {
      email: 'El correo electrónico',
      password: 'La contraseña',
      fullName: 'El nombre completo',
      confirmPassword: 'La confirmación de contraseña'
    };
    
    return displayNames[fieldName] || fieldName;
  }
}