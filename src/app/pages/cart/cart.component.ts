import { Component, Input, Output, EventEmitter, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { CartService, CartItem } from '../../services/cart.service';
import { CreditCardFormComponent, CreditCardData } from '../../components/credit-card-form/credit-card-form.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, MatIconModule, MatButtonModule, FormsModule, CreditCardFormComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  @Input() showModal: boolean = false;
  @Output() closeModal = new EventEmitter<void>();

  cartService = inject(CartService);
  
  cart: CartItem[] = [];
  isLoading = false;
  cartError = '';
  cartSuccess = '';
  showPaymentForm = false;
  
  private destroy$ = new Subject<void>();

  ngOnInit() {
    // Suscribirse a los observables del servicio
    this.cartService.cart$
      .pipe(takeUntil(this.destroy$))
      .subscribe(cart => this.cart = cart);

    this.cartService.isLoading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => this.isLoading = loading);

    this.cartService.error$
      .pipe(takeUntil(this.destroy$))
      .subscribe(error => this.cartError = error);

    this.cartService.success$
      .pipe(takeUntil(this.destroy$))
      .subscribe(success => this.cartSuccess = success);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Métodos del carrito
  removeFromCart(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  updateQuantity(productId: number, quantity: number): void {
    this.cartService.updateQuantity(productId, quantity);
  }

  onQuantityChange(productId: number, event: Event): void {
    const target = event.target as HTMLInputElement;
    const quantity = parseInt(target.value, 10);
    if (!isNaN(quantity) && quantity > 0) {
      this.cartService.updateQuantity(productId, quantity);
    }
  }

  clearCart(): void {
    this.cartService.clearCart();
  }

  async confirmPurchase() {
    this.showPaymentForm = true;
  }

  onCardSubmitted(cardData: CreditCardData) {
    this.processPayment(cardData);
  }

  onPaymentCancelled() {
    this.showPaymentForm = false;
  }

  async processPayment(cardData: CreditCardData) {
    this.isLoading = true;
    try {
      // Aquí normalmente enviarías los datos de la tarjeta a tu backend
      // Por ahora simulamos el procesamiento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      await this.cartService.confirmPurchase();
      
      // Mostrar alerta de éxito
      Swal.fire({
        icon: 'success',
        title: '¡Pago procesado con éxito!',
        text: 'Tu compra ha sido confirmada. En breve recibirás un correo electrónico con los detalles.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#059669',
        showConfirmButton: true,
        timer: 3000,
        timerProgressBar: true
      });
      
      this.cartSuccess = 'Compra realizada con éxito';
      this.cart = [];
      this.showPaymentForm = false;
      this.closeCart();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el pago',
        text: 'Hubo un problema al procesar tu pago. Por favor, verifica los datos de tu tarjeta e intenta nuevamente.',
        confirmButtonText: 'Cerrar',
        confirmButtonColor: '#DC2626'
      });
      this.cartError = 'Error al procesar el pago';
      console.error(error);
    } finally {
      this.isLoading = false;
    }
  }

  closeCart(): void {
    this.closeModal.emit();
  }

  // Utilidades
  formatPrice(price: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(price);
  }

  getCartTotal(): number {
    return this.cartService.getCartTotal();
  }

  getItemsCount(): number {
    return this.cartService.getItemsCount();
  }

  // FUNCIÓN TRACKBY QUE FALTABA
  trackByProductId(index: number, item: CartItem): number {
    return item.product.productId;
  }
}