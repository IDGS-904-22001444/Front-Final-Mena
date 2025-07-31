import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule, MatButtonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  auhtService = inject(AuthService);
  router = inject(Router);

  // Configuración del carrusel - RUTAS ABSOLUTAS CORREGIDAS
  productImages = [
    {
      src: './assets/iguana.jpg',
      alt: 'Iguana en terrario ReptiTrack',
      title: 'Monitoreo para Iguanas',
      description: 'Sistema especializado para el cuidado óptimo de iguanas'
    },
    {
      src: './assets/terra.png',
      alt: 'Terrario con tecnología ReptiTrack',
      title: 'Terrario Inteligente',
      description: 'Control automatizado del ambiente completo'
    },
    {
      src: './assets/trepa.jpeg',
      alt: 'Reptil trepador en hábitat controlado',
      title: 'Especies Trepadoras',
      description: 'Diseñado para reptiles que requieren espacios verticales'
    },
    {
      src: './assets/iguana.jpg',
      alt: 'Sistema de alimentación automática',
      title: 'Alimentación Programada',
      description: 'Dispensador automático con horarios personalizables'
    },
    {
      src: './assets/terra.png',
      alt: 'Instalación completa ReptiTrack',
      title: 'Instalación Profesional',
      description: 'Setup completo listo para usar en minutos'
    }
  ];

  // Variables del carrusel
  currentImageIndex = 0;
  autoSlideInterval: any;

  ngOnInit() {
    // Verificar si el usuario está logueado y es admin
    const userDetail = this.auhtService.getUserDetail();
    if (userDetail && userDetail.roles.includes('Admin')) {
      // Redirigir automáticamente al dashboard si es admin
      this.router.navigate(['/dashboard']);
    } else {
      // Solo iniciar el carrusel si no es admin (para usuarios normales o no logueados)
      this.startAutoSlide();
    }
  }

  ngOnDestroy(): void {
    // Limpiar interval al destruir componente para evitar memory leaks
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
  }

  
  isAuthorizedClient(): boolean {
    const userDetail = this.auhtService.getUserDetail();
    return userDetail?.roles.includes('Cliente') || false;
  }

 isRegularUser(): boolean {
    const userDetail = this.auhtService.getUserDetail();
    
    if (!userDetail || !userDetail.roles || !Array.isArray(userDetail.roles)) {
      return false;
    }
    
    return !userDetail.roles.includes('Admin') && !userDetail.roles.includes('Cliente');
  }


  isUserLoggedIn(): boolean {
    return !!this.auhtService.getUserDetail();
  }

 
  isUserAdmin(): boolean {
    const userDetail = this.auhtService.getUserDetail();
    return userDetail?.roles.includes('Admin') || false;
  }

  nextImage(): void {
    this.currentImageIndex = (this.currentImageIndex + 1) % this.productImages.length;
  }

  prevImage(): void {
    this.currentImageIndex = this.currentImageIndex === 0 
      ? this.productImages.length - 1 
      : this.currentImageIndex - 1;
  }

  /**
   * Va directamente a una imagen específica
   * @param index - Índice de la imagen a mostrar
   */
  goToImage(index: number): void {
    if (index >= 0 && index < this.productImages.length) {
      this.currentImageIndex = index;
    }
  }

  startAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    
    this.autoSlideInterval = setInterval(() => {
      this.nextImage();
    }, 5000);
  }

  pauseAutoSlide(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
      this.autoSlideInterval = null;
    }
  }

  resumeAutoSlide(): void {
    if (!this.autoSlideInterval) {
      this.startAutoSlide();
    }
  }

  requestQuote(): void {
    const userDetail = this.auhtService.getUserDetail();
    
    if (userDetail) {
      alert('¡Gracias por tu interés! Nos pondremos en contacto contigo pronto.');
    } else {
      this.router.navigate(['/register']);
    }
  }

  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // ==================== MÉTODOS PARA CLIENTE AUTORIZADO ====================

  /**
   * Solicita cotización para un producto específico
   * @param productName - Nombre del producto
   * @param price - Precio del producto
   */
  requestProductQuote(productName: string, price: string): void {
    const userDetail = this.auhtService.getUserDetail();
    
    if (userDetail) {
      // Aquí podrías implementar lógica para enviar la cotización
      alert(`¡Gracias ${userDetail.fullName}! Cotización solicitada para ${productName} (${price}). Nos pondremos en contacto contigo pronto.`);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Contrata un servicio específico
   * @param serviceName - Nombre del servicio
   * @param price - Precio del servicio
   */
  requestService(serviceName: string, price: string): void {
    const userDetail = this.auhtService.getUserDetail();
    
    if (userDetail) {
      alert(`¡Gracias ${userDetail.fullName}! Solicitud de ${serviceName} (${price}) registrada. Te contactaremos para coordinar.`);
    } else {
      this.router.navigate(['/login']);
    }
  }

  /**
   * Abre chat en vivo (placeholder)
   */
  openLiveChat(): void {
    alert('Chat en vivo próximamente disponible. Por ahora puedes contactarnos al teléfono.');
  }

  /**
   * Simula llamada telefónica
   */
  makePhoneCall(): void {
    alert('Teléfono de contacto: +52 (55) 1234-5678\n¡Llámanos para atención personalizada!');
  }

  // ==================== MÉTODOS UTILITARIOS ====================

  /**
   * Obtiene el nombre completo del usuario actual
   */
  getUserFullName(): string {
    const userDetail = this.auhtService.getUserDetail();
    return userDetail?.fullName || 'Usuario';
  }

  /**
   * Maneja errores de carga de imágenes - VERSIÓN CORREGIDA
   * @param event - Evento de error de la imagen
   */
  onImageError(event: any): void {
    console.warn('Error cargando imagen:', event.target.src);
    // En lugar de usar placeholder externo, usar una imagen base64 simple
    event.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNjc3Mjg0Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlbiBObyBEaXNwb25pYmxlPC90ZXh0Pjwvc3ZnPg==';
  }

  /**
   * Obtiene la imagen actual del carrusel
   */
  getCurrentImage() {
    return this.productImages[this.currentImageIndex];
  }

  /**
   * Verifica si es la primera imagen
   */
  isFirstImage(): boolean {
    return this.currentImageIndex === 0;
  }

  /**
   * Verifica si es la última imagen
   */
  isLastImage(): boolean {
    return this.currentImageIndex === this.productImages.length - 1;
  }

  /**
   * Obtiene el color del badge según el rol
   * @param role - Rol del usuario
   * @returns Clases CSS para el badge
   */
  getRoleBadgeClass(role: string): string {
    switch (role) {
      case 'Admin':
        return 'bg-red-100 text-red-800';
      case 'Cliente':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  }

  /**
   * Formatea el precio para mostrar
   * @param price - Precio a formatear
   * @returns Precio formateado
   */
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }
}