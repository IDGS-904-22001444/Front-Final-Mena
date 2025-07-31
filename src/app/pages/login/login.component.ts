import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatIconModule, ReactiveFormsModule, RouterLink, MatSnackBarModule, CommonModule],
  standalone: true,
  providers: [AuthService],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  AuthService = inject(AuthService);
  matSnackbar = inject(MatSnackBar);
  router = inject(Router);
  hide = true;
  form!: FormGroup;
  fb = inject(FormBuilder);

  login(){
    this.AuthService.login(this.form.value).subscribe({
      next: (response) => {
        this.matSnackbar.open(response.message,'Close',{
          duration: 5000,
          horizontalPosition: 'center'
        })
        
        // Verificar el rol después del login y redirigir apropiadamente
        const userDetail = this.AuthService.getUserDetail();
        if (userDetail && userDetail.roles.includes('Admin')) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        this.matSnackbar.open(error.error.message,'Close',{
          duration: 5000,
          horizontalPosition: 'center'
        })
      }
    });
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
}
