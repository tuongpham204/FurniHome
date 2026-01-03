import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product.model';
import { Review } from '../../shared/review/review';
import { CartService } from '../../service/cart.service';
import { WishlistService } from '../../service/wishlist.service';
import { RelateProduct } from '../../shared/relate-product/relate-product';
import {
  LucideAngularModule,
  Minus,
  Plus,
  ShoppingCart,
  Star,
  Heart,
  Check,
  Truck,
  RefreshCw,
} from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Review, RelateProduct],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  quantity = 1;

  tabs = [
    { id: 'description', label: 'Description' },
    { id: 'specifications', label: 'Specifications' },
    { id: 'reviews', label: 'Reviews (127)' },
  ];

  activeTab: 'description' | 'specifications' | 'reviews' = 'description';

  Minus = Minus;
  Plus = Plus;
  ShoppingCart = ShoppingCart;
  Star = Star;
  Heart = Heart;
  Check = Check;
  Truck = Truck;
  RefreshCw = RefreshCw;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService,
    private wishlistService: WishlistService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = Number(params['id']);
      if (!id) {
        this.error = 'Invalid product ID';
        this.loading = false;
        this.cdr.detectChanges();
        return;
      }
      this.fetchProduct(id);
    });
  }

  fetchProduct(id: number): void {
    this.loading = true;
    this.error = null;

    this.productService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        setTimeout(() => {
          this.loading = false;
          this.cdr.detectChanges();
          this.forceReflow();
        }, 100);
      },
      error: () => {
        this.error =
          "Sorry, we couldn't find this product. It may have been removed or is temporarily unavailable.";
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private forceReflow(): void {
    const element = document.querySelector('.max-w-6xl');
    if (element) {
      void element.clientHeight;
    }
  }

  onImageLoad(event: Event): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
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

  addToCart(): void {
    if (!this.product) return;
    this.cartService.addToCart(this.product);

    // Optional: Show success message
    const button = document.querySelector('button[aria-label="Add to Cart"]');
    if (button) {
      const originalText = button.textContent;
      button.innerHTML = '✓ Added to Cart';
      button.classList.add('bg-green-600');

      setTimeout(() => {
        button.textContent = originalText;
        button.classList.remove('bg-green-600');
      }, 2000);
    }
  }

  toggleWishlist(event: Event) {
    if (!this.product) return;

    event.preventDefault();
    event.stopPropagation();

    if (this.isInWishlist) {
      this.wishlistService.removeFromWishlist(this.product.id);
    } else {
      this.wishlistService.addToWishlist(this.product);
    }
  }

  get isInWishlist(): boolean {
    return this.product ? this.wishlistService.isInWishlist(this.product.id) : false;
  }

  setTab(tab: 'description' | 'specifications' | 'reviews'): void {
    this.activeTab = tab;
  }
}
