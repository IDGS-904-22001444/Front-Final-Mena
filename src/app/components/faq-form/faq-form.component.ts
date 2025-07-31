import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { FaqCreateRequest } from '../../interfaces/faq-create-request';

@Component({
  selector: 'app-faq-form',
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  templateUrl: './faq-form.component.html',
  styleUrl: './faq-form.component.css'
})
export class FaqFormComponent {
  @Input({ required: true }) faq!: FaqCreateRequest;
  @Input() errorMessage!: string;
  @Input() isEditing: boolean = false;
  @Output() saveFaq: EventEmitter<FaqCreateRequest> = new EventEmitter<FaqCreateRequest>();
  @Output() cancelEdit: EventEmitter<void> = new EventEmitter<void>();

  submit() {
    this.saveFaq.emit(this.faq);
  }

  cancel() {
    this.cancelEdit.emit();
  }

  getStatusText(status: number): string {
    switch (status) {
      case 0: return 'Inactiva';
      case 1: return 'Activa';
      default: return 'Desconocido';
    }
  }
}