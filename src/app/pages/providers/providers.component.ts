import { Component, inject } from '@angular/core';
import { ProviderFormComponent } from '../../components/provider-form/provider-form.component';
import { ProviderListComponent } from '../../components/provider-list/provider-list.component';
import { ProviderService } from '../../services/provider.service';
import { ProviderCreateRequest } from '../../interfaces/provider-create-request';
import { Provider } from '../../interfaces/provider';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-providers',
  imports: [
    ProviderFormComponent,
    ProviderListComponent,
    AsyncPipe,
    MatSnackBarModule,
  ],
  templateUrl: './providers.component.html',
  styleUrl: './providers.component.css',
})
export class ProvidersComponent {
  providerService = inject(ProviderService);
  snackBar = inject(MatSnackBar);
  
  errorMessage = '';
  isEditing = false;
  editingProviderId: number | null = null;
  
  provider: ProviderCreateRequest = {
    name: '',
    phone: '',
    email: '',
    address: '',
    contactPerson: '',
    status: 1
  };
  
  providers$: Observable<Provider[]> = this.providerService.getProviders();

  createProvider(provider: ProviderCreateRequest) {
    console.log('Creating provider:', provider);
    this.providerService.createProvider(provider).subscribe({
      next: (response) => {
        console.log('Create response:', response);
        this.providers$ = this.providerService.getProviders();
        this.snackBar.open('Proveedor creado exitosamente', 'Cerrar', {
          duration: 3000,
        });
        this.resetForm();
      },
      error: (error: HttpErrorResponse) => {
        console.error('Error creating provider:', error);
        if (error.status === 400) {
          this.errorMessage = error.error?.message || error.error || 'Error al crear proveedor';
        }
        this.snackBar.open('Error al crear proveedor', 'Cerrar', {
          duration: 3000,
        });
      },
    });
  }

  updateProvider(provider: ProviderCreateRequest) {
    console.log('=== UPDATE PROVIDER ===');
    console.log('editingProviderId:', this.editingProviderId);
    console.log('provider data:', provider);

    if (this.editingProviderId !== null && !isNaN(this.editingProviderId)) {
      console.log('Updating provider ID:', this.editingProviderId, 'with data:', provider);
      
      this.providerService.updateProvider(this.editingProviderId, provider).subscribe({
        next: (response) => {
          console.log('Update response:', response);
          this.providers$ = this.providerService.getProviders();
          this.snackBar.open('Proveedor actualizado exitosamente', 'Cerrar', {
            duration: 3000,
          });
          this.resetForm();
        },
        error: (error: HttpErrorResponse) => {
          console.error('Update error:', error);
          this.snackBar.open('Error al actualizar proveedor', 'Cerrar', {
            duration: 5000,
          });
        },
      });
    } else {
      console.error('Invalid editing provider ID:', this.editingProviderId);
      this.snackBar.open('Error: No se encontró el ID del proveedor a editar', 'Cerrar', {
        duration: 3000,
      });
    }
  }

  editProvider(provider: Provider) {
    console.log('=== EDIT PROVIDER ===');
    console.log('Full provider object:', provider);
    console.log('Provider ID received:', provider.id, 'Type:', typeof provider.id);
    
    // Verificaciones de seguridad
    if (!provider || provider.id === undefined || provider.id === null) {
      console.error('Invalid provider or provider ID:', provider);
      this.snackBar.open('Error: Proveedor inválido', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    // Convertir el ID a número y validar
    const providerId = Number(provider.id);
    if (isNaN(providerId)) {
      console.error('Provider ID is not a valid number:', provider.id);
      this.snackBar.open('Error: ID de proveedor inválido', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    // Establecer modo de edición
    this.isEditing = true;
    this.editingProviderId = providerId;
    
    console.log('editingProviderId set to:', this.editingProviderId);
    
    // Cargar datos del proveedor en el formulario
    this.provider = {
      name: provider.name || '',
      phone: provider.phone || '',
      email: provider.email || '',
      address: provider.address || '',
      contactPerson: provider.contactPerson || '',
      status: provider.status || 1
    };
    
    this.errorMessage = '';
    
    // Scroll al formulario para que el usuario vea que está editando
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteProvider(id: number) {
    console.log('=== DELETE PROVIDER ===');
    console.log('ID received:', id, 'Type:', typeof id);
    
    // Verificaciones de seguridad
    if (id === undefined || id === null) {
      console.error('Provider ID is undefined or null:', id);
      this.snackBar.open('Error: ID de proveedor no válido', 'Cerrar', {
        duration: 3000,
      });
      return;
    }

    // Convertir a número y validar
    const providerId = Number(id);
    if (isNaN(providerId)) {
      console.error('Provider ID is not a valid number:', id);
      this.snackBar.open('Error: ID de proveedor inválido', 'Cerrar', {
        duration: 3000,
      });
      return;
    }
    
    console.log('Converted ID:', providerId, 'Type:', typeof providerId);
    
    // Confirmar eliminación
    if (confirm('¿Estás seguro de que quieres eliminar este proveedor?')) {
      this.providerService.deleteProvider(providerId).subscribe({
        next: (response) => {
          console.log('Delete response:', response);
          this.providers$ = this.providerService.getProviders();
          this.snackBar.open('Proveedor eliminado exitosamente', 'Cerrar', {
            duration: 3000,
          });
        },
        error: (error: HttpErrorResponse) => {
          console.error('Delete error:', error);
          console.error('Error details:', {
            status: error.status,
            message: error.message,
            url: error.url,
            error: error.error
          });
          
          let errorMessage = 'Error al eliminar proveedor';
          if (error.status === 404) {
            errorMessage = 'Proveedor no encontrado';
          } else if (error.status === 400) {
            errorMessage = 'Solicitud inválida';
          }
          
          this.snackBar.open(errorMessage, 'Cerrar', {
            duration: 5000,
          });
        },
      });
    }
  }

  resetForm() {
    console.log('Resetting form');
    this.provider = {
      name: '',
      phone: '',
      email: '',
      address: '',
      contactPerson: '',
      status: 1
    };
    this.isEditing = false;
    this.editingProviderId = null;
    this.errorMessage = '';
  }
}