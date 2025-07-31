import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule, MatIconModule, CommonModule],
  standalone: true,
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  newPassword: string = '';
  currentPassword: string = '';
  showCurrentPassword = false;
  showNewPassword = false;
  authService = inject(AuthService);
  router = inject(Router);
  snackBar = inject(MatSnackBar);

  toggleCurrentPasswordVisibility() {
    this.showCurrentPassword = !this.showCurrentPassword;
  }

  toggleNewPasswordVisibility() {
    this.showNewPassword = !this.showNewPassword;
  }

  hasMinLength(): boolean {
    return this.newPassword.length >= 6;
  }

  hasLowerCase(): boolean {
    return /[a-z]/.test(this.newPassword);
  }

  hasUpperCase(): boolean {
    return /[A-Z]/.test(this.newPassword);
  }

  hasNumber(): boolean {
    return /\d/.test(this.newPassword);
  }

  hasSpecialCharacter(password: string = this.newPassword): boolean {
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    return specialCharRegex.test(password);
  }

  arePasswordsDifferent(): boolean {
    if (!this.currentPassword || !this.newPassword) return true;
    return this.currentPassword.trim() !== this.newPassword.trim();
  }

  isNewPasswordValid(): boolean {
    return this.validatePasswordStrength(this.newPassword);
  }

  private validatePasswordStrength(password: string): boolean {
    if (!password || password.length < 6) return false;
    
    const hasLowerCase = /[a-z]/.test(password);
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = this.hasSpecialCharacter(password);
    
    return hasLowerCase && hasUpperCase && hasNumber && hasSpecialChar;
  }

  getPasswordValidationMessages(): string[] {
    const messages: string[] = [];
    
    if (!this.newPassword) return messages;
    
    if (this.newPassword.length < 6) {
      messages.push('Mínimo 6 caracteres');
    }
    
    if (!this.hasLowerCase()) {
      messages.push('Al menos una letra minúscula');
    }
    
    if (!this.hasUpperCase()) {
      messages.push('Al menos una letra mayúscula');
    }
    
    if (!this.hasNumber()) {
      messages.push('Al menos un número');
    }
    
    if (!this.hasSpecialCharacter()) {
      messages.push('Al menos un carácter especial (!@#$%^&*)');
    }

    if (!this.arePasswordsDifferent()) {
      messages.push('La nueva contraseña debe ser diferente a la actual');
    }
    
    return messages;
  }

  canSubmit(): boolean {
    return this.currentPassword.trim() !== '' && 
           this.newPassword.trim() !== '' && 
           this.isNewPasswordValid() &&
           this.arePasswordsDifferent();
  }

  changePassword() {
    if (!this.canSubmit()) {
      const validationMessages = this.getPasswordValidationMessages();
      const errorMessage = validationMessages.length > 0 
        ? `Errores encontrados: ${validationMessages.join(', ')}`
        : 'Por favor, completa todos los campos correctamente.';
      
      this.snackBar.open(errorMessage, 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] });
      return;
    }

    if (this.currentPassword.trim() === this.newPassword.trim()) {
      this.snackBar.open('La nueva contraseña debe ser diferente a la contraseña actual.', 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] });
      return;
    }

    const userEmail = this.authService.getUserDetail()?.email;
    if (!userEmail) {
      this.snackBar.open('No se pudo obtener el email del usuario', 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] });
      return;
    }

    this.snackBar.open('Cambiando contraseña... Por favor espera', '', { duration: 2000 });

    this.authService
      .changePassword({
        email: userEmail,
        newPassword: this.newPassword,
        currentPassword: this.currentPassword
      })
      .subscribe({
        next: (response) => {
          if (response.isSuccess) {
            this.snackBar.open('¡Contraseña actualizada! Serás redirigido al login.', 'Cerrar', { duration: 3000, panelClass: ['success-snackbar'] });
            
            this.currentPassword = '';
            this.newPassword = '';
            
            setTimeout(() => {
              this.authService.logout();
              this.router.navigate(['/login']);
            }, 2000);
          } else {
            this.snackBar.open(response.message, 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] });
          }
        },
        error: (error: HttpErrorResponse) => {
          const errorMessage = error.error?.message || 'Error al cambiar la contraseña. Intenta nuevamente.';
          this.snackBar.open(errorMessage, 'Cerrar', { duration: 4000, panelClass: ['error-snackbar'] });
        }
      });
  }
}