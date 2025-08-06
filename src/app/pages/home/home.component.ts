import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ProductService } from '../../services/product.service';
import { Product } from '../../interfaces/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CartService, CartItem } from '../../services/cart.service';
import { CartComponent } from '../../pages/cart/cart.component';
import { Subject, takeUntil } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ContactFormComponent } from '../../components/contact-form/contact-form.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatButtonModule,
    FormsModule,
    CartComponent,
    ContactFormComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  auhtService = inject(AuthService);
  productService = inject(ProductService);
  cartService = inject(CartService);
  router = inject(Router);
  http = inject(HttpClient);

  products: Product[] = [];
  cartItemsCount = 0;

  productImages = [
    {
      src: './assets/iguana.jpg',
      alt: 'Iguana en terrario ReptiTrack',
      title: 'Monitoreo para Iguanas',
      description: 'Sistema especializado para el cuidado óptimo de iguanas',
    },
    {
      src: './assets/terra.png',
      alt: 'Terrario con tecnología ReptiTrack',
      title: 'Terrario Inteligente',
      description: 'Control automatizado del ambiente completo',
    },
    {
      src: './assets/trepa.jpeg',
      alt: 'Reptil trepador en hábitat controlado',
      title: 'Especies Trepadoras',
      description: 'Diseñado para reptiles que requieren espacios verticales',
    },
    {
      src: './assets/iguana.jpg',
      alt: 'Sistema de alimentación automática',
      title: 'Alimentación Programada',
      description: 'Dispensador automático con horarios personalizables',
    },
    {
      src: './assets/terra.png',
      alt: 'Instalación completa ReptiTrack',
      title: 'Instalación Profesional',
      description: 'Setup completo listo para usar en minutos',
    },
  ];

  currentImageIndex = 0;
  autoSlideInterval: any;
  showCartModal = false;
  showPurchaseModal = false;
  selectedProduct: Product | null = null;
  purchaseQuantity = 1;
  private destroy$ = new Subject<void>();

  ngOnInit() {
    const userDetail = this.auhtService.getUserDetail();
    if (userDetail && userDetail.roles.includes('Admin')) {
      this.router.navigate(['/dashboard']);
    } else {
      this.startAutoSlide();
    }

    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data.filter((p) => p.status === 1)),
      error: () => (this.products = []),
    });

    this.cartService.cart$.pipe(takeUntil(this.destroy$)).subscribe((cart) => {
      this.cartItemsCount = this.cartService.getItemsCount();
    });

    this.loadProducts();
  }

  ngOnDestroy(): void {
    if (this.autoSlideInterval) {
      clearInterval(this.autoSlideInterval);
    }
    this.destroy$.next();
    this.destroy$.complete();
  }

  // --- Carrito ---
  openCart() {
    this.showCartModal = true;
  }

  closeCart() {
    this.showCartModal = false;
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
      },
      error: () => {
        this.products = [];
      },
    });
  }
  addToCart(product: Product, quantity: number) {
    if (!product || quantity < 1) return;
    this.cartService.addToCart(product, quantity);
    this.closePurchaseModal();
  }

  // --- Modal de compra individual ---
  openPurchaseModal(product: Product) {
    this.selectedProduct = product;
    this.purchaseQuantity = 1;
    this.showPurchaseModal = true;
  }

  closePurchaseModal() {
    this.showPurchaseModal = false;
    this.selectedProduct = null;
  }

  // Confirmar compra individual - SIMPLIFICADO PARA USAR GUID
  async confirmPurchase() {
    if (!this.selectedProduct || this.selectedProduct.salePrice === undefined)
      return;

    const user = this.auhtService.getUserDetail();
    if (!user?.id) {
      alert('Error: Usuario no identificado');
      return;
    }

    try {
      // Usar el GUID directamente como clientId
      const body = {
        clientId: user.id, // Usar el GUID directamente
        productId: this.selectedProduct.productId,
        quantity: this.purchaseQuantity,
        saleDate: new Date().toISOString(),
        total: this.selectedProduct.salePrice * this.purchaseQuantity,
        status: this.selectedProduct.status,
      };

      console.log('Datos de venta a enviar:', body);

      await this.http.post(`${environment.apiUrl}/Sales`, body).toPromise();
      alert('¡Compra realizada exitosamente!');
      this.closePurchaseModal();
    } catch (error) {
      console.error('Error al realizar la compra:', error);
      alert('Error al realizar la compra');
    }
  }

  // --- Utilidades y UI ---
  isAuthorizedClient(): boolean {
    const userDetail = this.auhtService.getUserDetail();
    return userDetail?.roles.includes('Cliente') || false;
  }

  isRegularUser(): boolean {
    const userDetail = this.auhtService.getUserDetail();
    if (!userDetail || !userDetail.roles || !Array.isArray(userDetail.roles)) {
      return false;
    }
    return (
      !userDetail.roles.includes('Admin') &&
      !userDetail.roles.includes('Cliente')
    );
  }

  isUserLoggedIn(): boolean {
    return !!this.auhtService.getUserDetail();
  }

  isUserAdmin(): boolean {
    const userDetail = this.auhtService.getUserDetail();
    return userDetail?.roles.includes('Admin') || false;
  }

  productCarouselIndex = 0;

  nextProduct() {
    if (this.products.length > 0) {
      this.productCarouselIndex =
        (this.productCarouselIndex + 1) % this.products.length;
    }
  }

  prevProduct() {
    if (this.products.length > 0) {
      this.productCarouselIndex =
        (this.productCarouselIndex - 1 + this.products.length) %
        this.products.length;
    }
  }

  // Métodos del carrusel
  nextImage(): void {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.productImages.length;
  }

  prevImage(): void {
    this.currentImageIndex =
      this.currentImageIndex === 0
        ? this.productImages.length - 1
        : this.currentImageIndex - 1;
  }

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

  // Métodos de navegación
  goToRegister(): void {
    this.router.navigate(['/register']);
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  // Utilidades
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(price);
  }

  trackByProductId(index: number, item: CartItem): number {
    return item.product.productId;
  }

  userHasNoRole(): boolean {
    const userDetail = this.auhtService.getUserDetail();
    return !!userDetail && (!userDetail.roles || userDetail.roles.length === 0);
  }
}
