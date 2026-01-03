// checkout.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItem } from '../../service/cart.service';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './checkout.html',
})
export class Checkout implements OnInit {
  cartItems: CartItem[] = [];
  loadingCheckout: boolean = true;
  subtotal: number = 0;
  shipping: number = 0;
  tax: number = 0;
  discount: number = 0;
  total: number = 0;
  billing = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zip: '',
    country: '',
    newsletter: false,
    sameAddress: false,
  };

  constructor(
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(items => {
      this.cartItems = items;
      this.calculateTotals();
      this.loadingCheckout = false;
    });
  }
  calculateTotals(): void {
    this.subtotal = this.cartService.getSubtotal();
    this.shipping = this.subtotal > 1000 ? 0 : 49;
    this.tax = (this.subtotal - this.discount) * 0.08;
    this.total = this.subtotal - this.discount + this.shipping + this.tax;
  }
  get totalItems(): number {
    return this.cartService.getTotalItems();
  }
  getItemTotal(item: CartItem): number {
    return item.price * item.quantity;
  }
  onSubmit(): void {
    if (this.validateForm()) {
      
      alert(`Order placed successfully!\n\nTotal: $${this.total.toFixed(2)}\nItems: ${this.totalItems}`);
    } else {
      alert('Please fill in all required fields');
    }
  }
  validateForm(): boolean {
    return !!(
      this.billing.firstName &&
      this.billing.lastName &&
      this.billing.email &&
      this.billing.phone &&
      this.billing.address &&
      this.billing.city &&
      this.billing.country
    );
  }
}