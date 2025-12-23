import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlistItemsSubject = new BehaviorSubject<Product[]>([]);
  public wishlistItems$: Observable<Product[]> =
    this.wishlistItemsSubject.asObservable();

  constructor(private toast: ToastService) {
    this.loadWishlistFromStorage();
  }

  addToWishlist(product: Product): void {
    const currentWishlist = this.wishlistItemsSubject.value;
    const exists = currentWishlist.find(item => item.id === product.id);

    if (!exists) {
      currentWishlist.push(product);
      this.wishlistItemsSubject.next([...currentWishlist]);
      this.saveWishlistToStorage();
      this.toast.success(`${product.name} added to wishlist`);
    }
  }

 removeFromWishlist(productId: string): void {
  const item = this.wishlistItemsSubject.value.find(i => i.id === productId);
    this.wishlistItemsSubject.next(
      this.wishlistItemsSubject.value.filter(i => i.id !== productId)
    );
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
    localStorage.setItem(
      'wishlist',
      JSON.stringify(this.wishlistItemsSubject.value)
    );
  }

  private loadWishlistFromStorage(): void {
    const savedWishlist = localStorage.getItem('wishlist');
    if (savedWishlist) {
      try {
        this.wishlistItemsSubject.next(JSON.parse(savedWishlist));
      } catch {}
    }
  }
}
