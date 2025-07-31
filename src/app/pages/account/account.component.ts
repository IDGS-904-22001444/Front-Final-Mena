import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  authService = inject(AuthService);
  accountDetail$ = this.authService.getDetail();

  getInitial(user: any): string {
  return user && user.fullName && user.fullName.length > 0
    ? user.fullName[0].toUpperCase()
    : '?';
}
}
