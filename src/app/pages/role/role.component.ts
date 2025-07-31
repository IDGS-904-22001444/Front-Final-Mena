import { Component, inject } from '@angular/core';
import { RoleFormComponent } from '../../components/role-form/role-form.component';
import { RoleService } from '../../services/role.service';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { RoleListComponent } from '../../components/role-list/role-list.component';
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-role',
  imports: [
    RoleFormComponent,
    RoleListComponent,
    AsyncPipe,
    MatSelectModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    FormsModule,
    MatIconModule,
    MatSnackBarModule,
  ],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css',
})
export class RoleComponent {
  roleService = inject(RoleService);
  authService = inject(AuthService);
  selectedUser: string = '';
  selectedRole: string = '';
  errorMessage = '';
  role: RoleCreateRequest = {} as RoleCreateRequest;
  roles$ = this.roleService.getRoles();
  users$ = this.authService.getAll();
  snackBar = inject(MatSnackBar);

  createRole(role: RoleCreateRequest) {
    this.roleService.createRole(role).subscribe({
      next: (response: { message: string }) => {
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open('Rol creado exitosamente', 'Ok', {
          duration: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.errorMessage = error.error;
        }
      },
    });
  }

  deleteRole(id: string) {
    this.roleService.delete(id).subscribe({
      next: (response) => {
        this.roles$ = this.roleService.getRoles();
        this.snackBar.open('Rol eliminado exitosamente', 'Ok', {
          duration: 3000,
        });
      },
      error: (error: HttpErrorResponse) => {
        this.snackBar.open(error.message, 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  // ...existing code...
  assignRole() {
    console.log('Datos enviados:', {
      userId: this.selectedUser,
      roleId: this.selectedRole,
    });

    this.roleService
      .assignRole(this.selectedUser, this.selectedRole)
      .subscribe({
        next: (response) => {
          this.roles$ = this.roleService.getRoles();
          this.users$ = this.authService.getAll();
          this.snackBar.open('Rol asignado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.selectedUser = '';
          this.selectedRole = '';
        },
        error: (error: HttpErrorResponse) => {
          this.snackBar.open(error.message, 'Cerrar', {
            duration: 3000,
          });
        },
      });
  }
  // ...existing code...
}
