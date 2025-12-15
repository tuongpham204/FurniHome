// wishlist.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  public wishlistItems$: Observable<Product[]> = this.wishlistItemsSubject.asObservable();

  constructor() {
    this.loadWishlistFromStorage();
  }

  getWishlistItems(): Product[] {
    return this.wishlistItemsSubject.value;
  }

  addToWishlist(product: Product): void {
    const currentWishlist = this.wishlistItemsSubject.value;
    const existingItem = currentWishlist.find(item => item.id === product.id);

    if (!existingItem) {
      currentWishlist.push(product);
      this.wishlistItemsSubject.next([...currentWishlist]);
      this.saveWishlistToStorage();
    }
  }

  removeFromWishlist(productId: string): void {
    const currentWishlist = this.wishlistItemsSubject.value.filter(
      item => item.id !== productId
    );
    this.wishlistItemsSubject.next(currentWishlist);
    this.saveWishlistToStorage();
  }

  clearWishlist(): void {
    this.wishlistItemsSubject.next([]);
    this.saveWishlistToStorage();
  }

  isInWishlist(productId: string): boolean {
    return this.wishlistItemsSubject.value.some(item => item.id === productId);
  }

  getTotalItems(): number {
    return this.wishlistItemsSubject.value.length;
  }

  private saveWishlistToStorage(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlistItemsSubject.value));
  }

  private loadWishlistFromStorage(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        const wishlist = JSON.parse(savedWishlist);
        this.wishlistItemsSubject.next(wishlist);
      } catch (e) {
        console.error('Error loading wishlist from storage', e);
      }
    }
  }
}