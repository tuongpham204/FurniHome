// product-card.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { LucideAngularModule, Flame, TreeDeciduous, ShoppingCart, Heart } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { WishlistService } from '../../service/wishlist.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, RouterModule],
  templateUrl: './product-card.html',
})
export class ProductCard implements OnInit {
  @Input() product!: Product;

  Flame = Flame;
  TreeDeciduous = TreeDeciduous;
  ShoppingCart = ShoppingCart;
  Heart = Heart;

  constructor(
    private cartService: CartService,
    private wishlistService: WishlistService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    console.log('🎴 ProductCard loaded with product:', this.product);
  }

  // Tính % giảm giá
  get discountPercentage(): number {
    if (this.product.discount_price && this.product.price > this.product.discount_price) {
      return Math.round(
        ((this.product.price - this.product.discount_price) / this.product.price) * 100
      );
    }
    return 0;
  }

  // Lấy giá hiển thị
  get displayPrice(): number {
    return this.product.discount_price || this.product.price;
  }

  // Check có giảm giá không
  get hasDiscount(): boolean {
    return (
      this.product.discount_price !== undefined && this.product.discount_price < this.product.price
    );
  }

  // Format category name
  get formattedCategory(): string {
    return this.product.category.charAt(0).toUpperCase() + this.product.category.slice(1);
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.snackBar.open(`${product.name} added to cart!`, 'Close', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-success'],
    });
  }

  // Toggle Wishlist - Sử dụng logic từ service
  toggleWishlist(product: Product, event?: Event): void {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const isCurrentlyInWishlist = this.isInWishlist;

    if (isCurrentlyInWishlist) {
      this.wishlistService.removeFromWishlist(product.id);
      this.snackBar.open(`${product.name} removed from wishlist!`, 'Close', {
        duration: 2500,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['toast-warning'],
      });
    } else {
      this.wishlistService.addToWishlist(product);
      this.snackBar.open(`${product.name} added to wishlist!`, 'Close', {
        duration: 2500,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['toast-success'],
      });
    }
  }

  // Getter để check wishlist
  get isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }
}