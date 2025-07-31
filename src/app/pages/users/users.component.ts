import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { UserDetail } from '../../interfaces/user-detail';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    AsyncPipe, 
    CommonModule, 
    MatIconModule, 
    MatButtonModule, 
    MatSnackBarModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css',
})
export class UsersComponent {
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);
  router = inject(Router);
  user$ = this.authService.getAll();

  /**
   * Editar usuario - navegar a una página de edición
   */
  editUser(user: UserDetail) {
    console.log('Editing user:', user);
    // Navegar a la página de cuenta para editar
    this.router.navigate(['/account', user.id]);
  }

  /**
   * Eliminar usuario
   */
  deleteUser(user: UserDetail) {
    // Verificar que no se elimine a sí mismo
    const currentUser = this.authService.getUserDetail();
    if (currentUser && currentUser.id === user.id) {
      this.snackBar.open('No puedes eliminar tu propia cuenta', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    // Confirmar eliminación
    if (confirm(`¿Estás seguro de que quieres eliminar al usuario "${user.fullName}"?`)) {
      this.authService.deleteUser(user.id).subscribe({
        next: (response) => {
          console.log('User deleted successfully:', response);
          this.snackBar.open('Usuario eliminado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          // Recargar la lista de usuarios
          this.user$ = this.authService.getAll();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Error deleting user:', error);
          let errorMessage = 'Error al eliminar usuario';
          if (error.status === 404) {
            errorMessage = 'Usuario no encontrado';
          } else if (error.status === 403) {
            errorMessage = 'No tienes permisos para eliminar este usuario';
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
          });
        },
      });
    }
  }

  /**
   * Verificar si el usuario actual puede eliminar a otro usuario
   */
  canDeleteUser(user: UserDetail): boolean {
    const currentUser = this.authService.getUserDetail();
    
    // No puede eliminar su propia cuenta
    if (currentUser && currentUser.id === user.id) {
      return false;
    }
    
    // Solo admin puede eliminar usuarios
    return currentUser?.roles.includes('Admin') || false;
  }

  /**
   * Verificar si el usuario actual puede editar a otro usuario
   */
  canEditUser(user: UserDetail): boolean {
    const currentUser = this.authService.getUserDetail();
    
    // Puede editar su propia cuenta o si es admin
    return (currentUser && currentUser.id === user.id) || 
           (currentUser?.roles.includes('Admin') || false);
  }
}