import { Component, OnInit } from '@angular/core';
import { QuotationService } from '../../services/quotation.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { Observable } from 'rxjs';
import { Quotation } from '../../interfaces/quotation';

@Component({
  selector: 'app-quotations-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule
  ],
  templateUrl: './quotation-admin.component.html'
})
export class QuotationsAdminComponent implements OnInit {
  quotations$!: Observable<Quotation[]>;
  selectedQuotation: Quotation | null = null;

  constructor(
    private quotationService: QuotationService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.loadQuotations();
  }

  loadQuotations() {
    this.quotations$ = this.quotationService.getAllQuotations();
  }

  showQuotationDetails(quotation: Quotation) {
    this.selectedQuotation = quotation;
  }

  respondToQuotation(quotation: Quotation) {
  // Construir el mailto URL con los datos del cliente
  const subject = encodeURIComponent(`Respuesta a su cotización - ReptiTrack`);
  const body = encodeURIComponent(
    `Estimado/a ${quotation.firstName} ${quotation.lastName},\n\n` +
    `Gracias por su interés en ReptiTrack.\n\n` +
    `En respuesta a su solicitud sobre ${quotation.animalType}...\n\n` +
    `Saludos cordiales,\n` +
    `Equipo ReptiTrack`
  );
  
  // Abrir el cliente de correo en una nueva ventana/pestaña
  const mailtoUrl = `mailto:${quotation.email}?subject=${subject}&body=${body}`;
  window.open(mailtoUrl, '_blank');
}
}