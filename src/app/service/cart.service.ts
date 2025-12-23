import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';

export interface CartItem extends Product {
  quantity: number;
}

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartItemsSubject = new BehaviorSubject<CartItem[]>([]);
  public cartItems$: Observable<CartItem[]> = this.cartItemsSubject.asObservable();

  constructor(private toast: ToastService) {
    this.loadCartFromStorage();
  }

  getCartItems(): CartItem[] {
    return this.cartItemsSubject.value;
  }

  addToCart(product: Product): void {
    const currentCart = this.cartItemsSubject.value;
    const existingItem = currentCart.find(item => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += 1;
      this.toast.success(`${product.name} quantity increased`);
    } else {
      currentCart.push({ ...product, quantity: 1 });
      this.toast.success(`${product.name} added to cart`);
    }

    this.cartItemsSubject.next([...currentCart]);
    this.saveCartToStorage();
  }

  updateQuantity(productId: string, quantity: number): void {
    const currentCart = this.cartItemsSubject.value;
    const item = currentCart.find(i => i.id === productId);

    if (item && quantity > 0) {
      item.quantity = quantity;
      this.cartItemsSubject.next([...currentCart]);
      this.saveCartToStorage();
    }
  }

  increaseQuantity(productId: string): void {
    const item = this.getCartItems().find(i => i.id === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1);
    }
  }

  decreaseQuantity(productId: string): void {
    const item = this.getCartItems().find(i => i.id === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1);
    }
  }

  removeItem(productId: string): void {
    const item = this.cartItemsSubject.value.find(i => i.id === productId);

    this.cartItemsSubject.next(
      this.cartItemsSubject.value.filter(i => i.id !== productId)
    );
    this.saveCartToStorage();
  }

  clearCart(): void {
    this.cartItemsSubject.next([]);
    this.saveCartToStorage();
  }

  getTotalItems(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.quantity,
      0
    );
  }

  getSubtotal(): number {
    return this.cartItemsSubject.value.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  private saveCartToStorage(): void {
    localStorage.setItem('cart', JSON.stringify(this.cartItemsSubject.value));
  }

  private loadCartFromStorage(): void {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        this.cartItemsSubject.next(JSON.parse(savedCart));
      } catch {}
    }
  }
}
