import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { ProviderCreateRequest } from '../../interfaces/provider-create-request';

@Component({
  selector: 'app-provider-form',
  imports: [MatFormFieldModule, MatInputModule, MatButtonModule, MatSelectModule, FormsModule],
  templateUrl: './provider-form.component.html',
  styleUrl: './provider-form.component.css',
})
export class ProviderFormComponent {
  @Input({ required: true }) provider!: ProviderCreateRequest;
  @Input() errorMessage!: string;
  @Input() isEditing: boolean = false;
  @Output() addProvider: EventEmitter<ProviderCreateRequest> = new EventEmitter<ProviderCreateRequest>();
  @Output() updateProvider: EventEmitter<ProviderCreateRequest> = new EventEmitter<ProviderCreateRequest>();

  submit() {
    console.log('Form submitted:', this.provider, 'isEditing:', this.isEditing);
    
    if (this.isEditing) {
      this.updateProvider.emit(this.provider);
    } else {
      this.addProvider.emit(this.provider);
    }
  }
}