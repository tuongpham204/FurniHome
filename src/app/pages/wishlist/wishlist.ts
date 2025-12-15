// wishlist.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from '../../service/wishlist.service';
import { CartService } from '../../service/cart.service';
import { Product } from '../../models/product.model';
import { RouterModule } from '@angular/router';
import { LucideAngularModule, Heart, ShoppingCart, Trash } from 'lucide-angular';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './wishlist.html',
})
export class Wishlist implements OnInit {
  wishlistItems: Product[] = [];
  Heart = Heart;
  ShoppingCart = ShoppingCart;
  Trash = Trash;

  constructor(
    private wishlistService: WishlistService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.wishlistService.wishlistItems$.subscribe(items => {
      this.wishlistItems = items;
      console.log('💖 Wishlist Items:', items);
      if (items.length > 0) {
        console.log('📸 First item image_path:', items[0].image_path);
        console.log('📦 First item full data:', items[0]);
      }
    });
  }

  removeFromWishlist(productId: string): void {
    if (confirm('Bạn có chắc muốn xóa sản phẩm này khỏi danh sách yêu thích?')) {
      this.wishlistService.removeFromWishlist(productId);
    }
  }

  clearWishlist(): void {
    if (confirm('Bạn có chắc muốn xóa toàn bộ danh sách yêu thích?')) {
      this.wishlistService.clearWishlist();
    }
  }

  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    alert('Đã thêm sản phẩm vào giỏ hàng!');
  }

  moveToCart(product: Product): void {
    this.cartService.addToCart(product);
    this.wishlistService.removeFromWishlist(product.id);
    alert('Đã chuyển sản phẩm vào giỏ hàng!');
  }

  addAllToCart(): void {
    if (this.wishlistItems.length === 0) return;
    
    if (confirm(`Bạn có chắc muốn thêm tất cả ${this.wishlistItems.length} sản phẩm vào giỏ hàng?`)) {
      this.wishlistItems.forEach(item => {
        this.cartService.addToCart(item);
      });
      alert('Đã thêm tất cả sản phẩm vào giỏ hàng!');
    }
  }

  get totalItems(): number {
    return this.wishlistService.getTotalItems();
  }

  get totalValue(): number {
    return this.wishlistItems.reduce((total, item) => total + item.price, 0);
  }

  // Handle image error
  onImageError(event: any): void {
    console.error('❌ Image failed to load:', event.target.src);
    event.target.style.display = 'none';
    // Show placeholder
    const parent = event.target.parentElement;
    if (parent) {
      parent.innerHTML = `
        <div class="w-full h-full flex items-center justify-center text-gray-400">
          <i class="fas fa-image text-4xl"></i>
        </div>
      `;
    }
  }

  // Handle image load success
  onImageLoad(event: any): void {
    console.log('✅ Image loaded successfully:', event.target.src);
  }
}