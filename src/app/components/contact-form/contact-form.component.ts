import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  styleUrls: ['./contact-form.component.css'],
  standalone: true,
  imports: [FormsModule]
})
export class ContactFormComponent {
  contact = {
    name: '',
    email: '',
    message: ''
  };
  success = false;

  sendEmail() {
    const subject = encodeURIComponent('Contacto desde ReptiTrack');
    const body = encodeURIComponent(
      `Nombre: ${this.contact.name}\nCorreo: ${this.contact.email}\nMensaje: ${this.contact.message}`
    );
    window.location.href = `mailto:reptytrack@gmail.com?subject=${subject}&body=${body}`;
    this.success = true;
    this.resetForm();
  }

  sendWhatsApp() {
    const phone = '524791014453';
    const text = encodeURIComponent(
      `Hola, soy ${this.contact.name} (${this.contact.email}). ${this.contact.message}`
    );
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
    this.success = true;
    this.resetForm();
  }

  sendTelegram() {
    const username = 'JED4';
    const text = encodeURIComponent(
      `Hola, soy ${this.contact.name} (${this.contact.email}). ${this.contact.message}`
    );
    window.open(`https://t.me/${username}?text=${text}`, '_blank');
    this.success = true;
    this.resetForm();
  }

  resetForm() {
    this.contact = { name: '', email: '', message: '' };
  }
}