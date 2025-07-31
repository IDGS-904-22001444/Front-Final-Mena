import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-document-list',
  imports: [MatButtonModule, MatIconModule, CommonModule],
  templateUrl: './documents-list.component.html',
  styleUrl: './documents-list.component.css',
})
export class DocumentListComponent {
  @Input() documents: string[] | null = [];
  @Input() isAdmin: boolean = false;
  @Output() downloadDocument = new EventEmitter<string>();
  @Output() deleteDocument = new EventEmitter<string>();

  onDownload(fileName: string) {
    this.downloadDocument.emit(fileName);
  }

  onDelete(fileName: string) {
    if (confirm(`¿Estás seguro de que deseas eliminar el archivo "${fileName}"?`)) {
      this.deleteDocument.emit(fileName);
    }
  }

  getFileIcon(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'picture_as_pdf';
      case 'doc':
      case 'docx':
        return 'description';
      case 'xls':
      case 'xlsx':
        return 'table_chart';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'image';
      default:
        return 'insert_drive_file';
    }
  }

  getFileColor(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'text-red-600';
      case 'doc':
      case 'docx':
        return 'text-blue-600';
      case 'xls':
      case 'xlsx':
        return 'text-green-600';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'text-purple-600';
      default:
        return 'text-gray-600';
    }
  }

  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toUpperCase() || 'FILE';
  }

  getBadgeColor(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return 'bg-red-100 text-red-800';
      case 'doc':
      case 'docx':
        return 'bg-blue-100 text-blue-800';
      case 'xls':
      case 'xlsx':
        return 'bg-green-100 text-green-800';
      case 'jpg':
      case 'jpeg':
      case 'png':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }
}