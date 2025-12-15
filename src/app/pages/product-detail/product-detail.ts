import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../service/cart.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  LucideAngularModule,
  Minus,
  Plus,
  ShoppingCart,
  Heart,
  Truck,
  RotateCcw,
  Star,
  MessageCircle,
} from 'lucide-angular';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './product-detail.html',
})
export class ProductDetail implements OnInit {
  product: Product | null = null;
  loading = true;
  error: string | null = null;
  quantity = 1;

  // Icons
  Minus = Minus;
  Plus = Plus;
  ShoppingCart = ShoppingCart;
  Heart = Heart;
  Truck = Truck;
  RotateCcw = RotateCcw;
  Star = Star;
  MessageCircle = MessageCircle;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cdr: ChangeDetectorRef,
    private cartService: CartService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id) {
        console.log('🆔 Loading product ID:', id);
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
        console.log('✅ Product loaded:', product.name);
        this.product = product;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: Error) => {
        console.error('❌ Error loading product:', err);
        this.error = 'Product not found. Please try again.';
        this.loading = false;
        this.cdr.detectChanges();
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
    this.snackBar.open(`${product.name} added to cart!`, 'Close', {
      duration: 2500,
      horizontalPosition: 'right',
      verticalPosition: 'top',
      panelClass: ['toast-success'],
    });
  }
}
