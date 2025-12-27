import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product.model';
import { Review } from '../../shared/review/review';
import { CartService } from '../../service/cart.service';
import { WishlistService } from '../../service/wishlist.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import {
  LucideAngularModule,
  Minus,
  Plus,
  ShoppingCart,
  Truck,
  RotateCcw,
  Star,
  MessageCircle,
  Heart,
} from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Review],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  quantity = 1;

  activeTab: 'description' | 'specifications' = 'description';
  Minus = Minus;
  Plus = Plus;
  ShoppingCart = ShoppingCart;
  Star = Star;
  Heart = Heart;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        this.fetchProduct(id);
      } else {
        this.error = 'Invalid product ID';
        this.loading = false;
      }
    });
  }

  fetchProduct(id: string): void {
    this.loading = true;
    this.error = null;
    this.product = null;
    this.quantity = 1;

    this.productService.getProductById(id).subscribe({
      next: (product: Product) => {
        this.product = product;
        this.loading = false;
      },
      error: (err: Error) => {
        this.error = 'Product not found. Please try again.';
        this.loading = false;
      },
    });
  }

  get hasDiscount(): boolean {
    return this.product?.discount_price != null && this.product.discount_price < this.product.price;
  }

  get discountPercentage(): number {
    if (!this.hasDiscount || !this.product) return 0;
    return Math.round(
      ((this.product.price - this.product.discount_price!) / this.product.price) * 100
    );
  }

  get displayPrice(): number {
    if (!this.product) return 0;
    return this.hasDiscount ? this.product.discount_price! : this.product.price;
  }

  get inStock(): boolean {
    return this.product?.stock ? this.product.stock > 0 : false;
  }

  get totalPrice(): number {
    return this.displayPrice * this.quantity;
  }

  increaseQuantity(): void {
    if (this.product && this.quantity < this.product.stock) {
      this.quantity++;
    }
  }

  decreaseQuantity(): void {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }
  addToCart(product: Product): void {
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
    return this.wishlistService.isInWishlist(this.product!.id);
  }
  setTab(tab: 'description' | 'specifications'): void {
    this.activeTab = tab;
  }
}
