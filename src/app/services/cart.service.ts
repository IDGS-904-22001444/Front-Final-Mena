import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Product } from '../interfaces/product';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = environment.apiUrl;

  private cartSubject = new BehaviorSubject<CartItem[]>([]);
  public cart$ = this.cartSubject.asObservable();

  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.isLoadingSubject.asObservable();

  private errorSubject = new BehaviorSubject<string>('');
  public error$ = this.errorSubject.asObservable();

  private successSubject = new BehaviorSubject<string>('');
  public success$ = this.successSubject.asObservable();

  // Agregar producto al carrito
  addToCart(product: Product, quantity: number = 1): void {
    if (!product || quantity < 1) return;
    
    const currentCart = this.cartSubject.value;
    const existingItemIndex = currentCart.findIndex(item => item.product.productId === product.productId);
    
    if (existingItemIndex > -1) {
      currentCart[existingItemIndex].quantity += quantity;
    } else {
      currentCart.push({ product, quantity });
    }
    
    this.cartSubject.next([...currentCart]);
    this.setSuccess(`${product.name} agregado al carrito`);
  }

  // Remover producto del carrito
  removeFromCart(productId: number): void {
    const currentCart = this.cartSubject.value;
    const updatedCart = currentCart.filter(item => item.product.productId !== productId);
    this.cartSubject.next(updatedCart);
  }

  // Actualizar cantidad de un producto
  updateQuantity(productId: number, quantity: number): void {
    if (quantity < 1) {
      this.removeFromCart(productId);
      return;
    }
    
    const currentCart = this.cartSubject.value;
    const itemIndex = currentCart.findIndex(item => item.product.productId === productId);
    
    if (itemIndex > -1) {
      currentCart[itemIndex].quantity = quantity;
      this.cartSubject.next([...currentCart]);
    }
  }

  // Limpiar carrito
  clearCart(): void {
    this.cartSubject.next([]);
  }

  // Obtener total del carrito
  getCartTotal(): number {
    return this.cartSubject.value.reduce((sum, item) => sum + (item.product.salePrice * item.quantity), 0);
  }

  // Obtener cantidad total de items
  getItemsCount(): number {
    return this.cartSubject.value.reduce((sum, item) => sum + item.quantity, 0);
  }

  // Confirmar compra del carrito - SIMPLIFICADO PARA USAR GUID
  async confirmPurchase(): Promise<void> {
    const cart = this.cartSubject.value;
    if (cart.length === 0) return;

    this.setLoading(true);
    this.clearMessages();

    try {
      const user = this.authService.getUserDetail();
      if (!user?.id) {
        throw new Error('Usuario no identificado');
      }

      // Crear array de ventas individuales usando el GUID directamente
      const sales = cart.map(item => ({
        clientId: user.id, // Usar el GUID directamente
        productId: item.product.productId,
        quantity: item.quantity,
        saleDate: new Date().toISOString(),
        total: item.product.salePrice * item.quantity,
        status: item.product.status
      }));

      console.log('Datos de ventas del carrito a enviar:', sales);

      // Enviar cada venta individualmente
      const salePromises = sales.map(sale => 
        this.http.post(`${this.apiUrl}/Sales`, sale).toPromise()
      );

      await Promise.all(salePromises);
      
      this.setSuccess('¡Compra realizada exitosamente!');
      this.clearCart();
    } catch (error) {
      console.error('Error en confirmPurchase:', error);
      this.setError('Error al realizar la compra. Inténtalo de nuevo.');
    } finally {
      this.setLoading(false);
    }
  }

  // Métodos auxiliares para manejar estados
  private setLoading(loading: boolean): void {
    this.isLoadingSubject.next(loading);
  }

  private setError(error: string): void {
    this.errorSubject.next(error);
    setTimeout(() => this.errorSubject.next(''), 5000);
  }

  private setSuccess(success: string): void {
    this.successSubject.next(success);
    setTimeout(() => this.successSubject.next(''), 3000);
  }

  private clearMessages(): void {
    this.errorSubject.next('');
    this.successSubject.next('');
  }

  // Obtener estado actual del carrito
  getCurrentCart(): CartItem[] {
    return this.cartSubject.value;
  }
}