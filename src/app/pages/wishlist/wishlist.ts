import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { WishlistService } from '../../service/wishlist.service';
import { CartService } from '../../service/cart.service';
import { ToastService } from '../../service/toast.service';
import { Product } from '../../models/product.model';
import { LucideAngularModule, Trash } from 'lucide-angular';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './wishlist.html',
})
export class Wishlist implements OnInit, OnDestroy {
  wishlistItems: Product[] = [];
  Trash = Trash;
  loading = false;
  private wishlistSub!: Subscription;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.wishlistSub = this.wishlistService.wishlistItems$.subscribe(
      (items) => (this.wishlistItems = items)
    );
  }

  ngOnDestroy(): void {
    this.wishlistSub?.unsubscribe();
  }

  removeFromWishlist(productId: string): void {
    const product = this.wishlistItems.find((item) => item.id === productId);
    this.wishlistService.removeFromWishlist(productId);

    if (product) {
      this.toastService.info(
        `${product.name} has been removed from your wishlist`,
        'Removed from wishlist'
      );
    }
  }

  clearWishlist(): void {
    const count = this.wishlistItems.length;
    this.wishlistService.clearWishlist();

    this.toastService.info(
      `All ${count} ${count === 1 ? 'item has' : 'items have'} been removed from your wishlist`,
      'Wishlist cleared'
    );
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
  }

  addAllToCart(): void {
    const count = this.wishlistItems.length;
    this.wishlistItems.forEach((item) => this.cartService.addToCart(item));

    this.toastService.success(
      `All ${count} ${count === 1 ? 'item has' : 'items have'} been added to your cart`,
      'Added to cart'
    );
  }

  get totalItems(): number {
    return this.wishlistItems.length;
  }

  get totalValue(): number {
    return this.wishlistItems.reduce((sum, item) => sum + item.price, 0);
  }
}
