import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Provider } from '../../interfaces/provider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-provider-list',
  standalone: true,
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './provider-list.component.html',
  styleUrl: './provider-list.component.css',
})
export class ProviderListComponent {
  @Input({ required: true }) providers!: Provider[] | null;
  @Output() editProvider: EventEmitter<Provider> = new EventEmitter<Provider>();
  @Output() deleteProvider: EventEmitter<number> = new EventEmitter<number>();

  ngOnInit() {
    console.log('=== PROVIDER LIST COMPONENT INIT ===');
    console.log('Providers received:', this.providers);
  }

  ngOnChanges() {
    console.log('=== PROVIDER LIST COMPONENT CHANGES ===');
    console.log('Providers updated:', this.providers);
    if (this.providers) {
      this.providers.forEach((p, index) => {
        console.log(`Provider ${index}:`, {
          id: p.id,
          idType: typeof p.id,
          hasId: p.hasOwnProperty('id'),
          keys: Object.keys(p)
        });
      });
    }
  }

  edit(provider: Provider) {
    console.log('=== EDIT BUTTON CLICKED ===');
    console.log('Provider object:', provider);
    console.log('Provider ID:', provider.id, 'Type:', typeof provider.id);
    console.log('Provider keys:', Object.keys(provider));
    
    if (provider && (provider.id !== undefined && provider.id !== null)) {
      this.editProvider.emit(provider);
    } else {
      console.error('Invalid provider for editing:', provider);
      alert('Error: Proveedor inválido para editar - ID no encontrado');
    }
  }

  delete(provider: Provider) {
    console.log('=== DELETE BUTTON CLICKED ===');
    console.log('Provider object:', provider);
    console.log('Provider ID:', provider.id, 'Type:', typeof provider.id);
    console.log('Provider keys:', Object.keys(provider));
    
    if (provider && (provider.id !== undefined && provider.id !== null)) {
      const providerId = Number(provider.id);
      console.log('Converted provider ID:', providerId, 'Type:', typeof providerId);
      
      if (!isNaN(providerId)) {
        this.deleteProvider.emit(providerId);
      } else {
        console.error('Invalid provider ID after conversion:', provider.id);
        alert('Error: ID de proveedor inválido');
      }
    } else {
      console.error('Invalid provider for deletion:', provider);
      alert('Error: Proveedor inválido para eliminar - ID no encontrado');
    }
  }

  getStatusText(status: number): string {
    return status === 1 ? 'Activo' : 'Inactivo';
  }

  getStatusClass(status: number): string {
    return status === 1 ? 'text-green-600 bg-green-100' : 'text-red-600 bg-red-100';
  }
}