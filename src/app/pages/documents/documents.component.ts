import { Component, inject, OnInit } from '@angular/core';
import { DocumentUploadComponent } from '../../components/documents-upload/documents-upload.component';
import { DocumentListComponent } from '../../components/documents-list/documents-list.component';
import { DocumentService } from '../../services/document.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AsyncPipe, CommonModule } from '@angular/common';
import { Observable } from 'rxjs';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-documents',
  imports: [
    DocumentUploadComponent,
    DocumentListComponent,
    AsyncPipe,
    MatSnackBarModule,
    CommonModule,
  ],
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css',
})
export class DocumentsComponent implements OnInit {
  documentService = inject(DocumentService);
  authService = inject(AuthService);
  snackBar = inject(MatSnackBar);

  documents$: Observable<string[]> = new Observable();
  isUploading = false;
  uploadProgress = 0;

  ngOnInit() {
    this.loadDocuments();
  }

  // Método para verificar si el usuario es administrador
  isAdmin(): boolean {
    const userDetail = this.authService.getUserDetail();
    return userDetail?.roles.includes('Admin') || false;
  }

  loadDocuments() {
    this.documents$ = this.documentService.getDocuments();
  }

  onFileSelected(file: File) {
    if (this.isAdmin()) {
      this.uploadDocument(file);
    }
  }

  uploadDocument(file: File) {
    if (!this.isAdmin()) return; // Solo admin puede subir
    
    this.isUploading = true;
    this.uploadProgress = 0;

    this.documentService.uploadDocument(file).subscribe({
      next: (event) => {
        if (event.type === HttpEventType.UploadProgress) {
          if (event.total) {
            this.uploadProgress = Math.round((100 * event.loaded) / event.total);
          }
        } else if (event.type === HttpEventType.Response) {
          this.isUploading = false;
          this.uploadProgress = 0;
          this.snackBar.open('Documento subido exitosamente', 'Cerrar', {
            duration: 3000,
            panelClass: ['success-snackbar']
          });
          this.loadDocuments();
        }
      },
      error: (error) => {
        console.error('Error uploading document:', error);
        this.isUploading = false;
        this.uploadProgress = 0;
        this.snackBar.open('Error al subir el documento', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
    });
  }

  downloadDocument(fileName: string) {
    this.documentService.downloadDocument(fileName).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        this.snackBar.open('Documento descargado exitosamente', 'Cerrar', {
          duration: 2000,
          panelClass: ['success-snackbar']
        });
      },
      error: (error) => {
        console.error('Error downloading document:', error);
        this.snackBar.open('Error al descargar el documento', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
    });
  }

  deleteDocument(fileName: string) {
    if (!this.isAdmin()) return; // Solo admin puede eliminar
    
    this.documentService.deleteDocument(fileName).subscribe({
      next: (response) => {
        this.snackBar.open('Documento eliminado exitosamente', 'Cerrar', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        this.loadDocuments(); // Recargar la lista después de eliminar
      },
      error: (error) => {
        console.error('Error deleting document:', error);
        this.snackBar.open('Error al eliminar el documento', 'Cerrar', {
          duration: 3000,
          panelClass: ['error-snackbar']
        });
      },
    });
  }
}