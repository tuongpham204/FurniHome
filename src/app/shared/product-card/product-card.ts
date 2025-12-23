import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Product } from '../../models/product.model';
import { LucideAngularModule, Flame, TreeDeciduous, ShoppingCart, Heart } from 'lucide-angular';
import { RouterModule } from '@angular/router';
import { CartService } from '../../service/cart.service';
import { WishlistService } from '../../service/wishlist.service';

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

  constructor(private cartService: CartService, private wishlistService: WishlistService) {}

  ngOnInit(): void {}
  get discountPercentage(): number {
    if (this.product.discount_price && this.product.price > this.product.discount_price) {
      return Math.round(
        ((this.product.price - this.product.discount_price) / this.product.price) * 100
      );
    }
    return 0;
  }

  get displayPrice(): number {
    return this.product.discount_price || this.product.price;
  }

  get hasDiscount(): boolean {
    return (
      this.product.discount_price !== undefined && this.product.discount_price < this.product.price
    );
  }
  get formattedCategory(): string {
    return this.product.category.charAt(0).toUpperCase() + this.product.category.slice(1);
  }

  addToCart(product: Product, event: Event) {
    event.stopPropagation();
    this.cartService.addToCart(product);
  }

  toggleWishlist(product: Product, event: Event) {
    event.preventDefault();
    event.stopPropagation();

    this.isInWishlist
      ? this.wishlistService.removeFromWishlist(product.id)
      : this.wishlistService.addToWishlist(product);
  }

  get isInWishlist(): boolean {
    return this.wishlistService.isInWishlist(this.product.id);
  }
}
