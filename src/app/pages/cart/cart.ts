import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../service/cart.service';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { LucideAngularModule, Minus, Plus } from 'lucide-angular';
import { ToastService } from '../../service/toast.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule, LucideAngularModule],
  templateUrl: './cart.html',
})
export class Cart implements OnInit {
  cartItems: CartItem[] = [];
  loadingCart: boolean = true;
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  discount: number = 0;
  total: number = 0;

  Minus = Minus;
  Plus = Plus;

  constructor(private cartService: CartService, private toastService: ToastService) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe((items) => {
      this.cartItems = items;
      this.calculateTotals();
      this.loadingCart = false;
    });
  }

  increaseQuantity(productId: string): void {
    this.cartService.increaseQuantity(productId);
  }
  decreaseQuantity(productId: string): void {
    this.cartService.decreaseQuantity(productId);
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId);
    this.toastService.success('Product removed from cart', 'Removed', 2500);
  }

  clearCart(): void {
    this.cartService.clearCart();
    this.toastService.success('Cart cleared successfully', 'Cleared', 2500);
  }

  calculateTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.shipping = this.subtotal > 1000 ? 0 : 49;

    this.tax = (this.subtotal - this.discount) * 0.08;

    this.total = this.subtotal - this.discount + this.shipping + this.tax;
  }

  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }
}
