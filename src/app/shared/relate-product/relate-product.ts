import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../service/product.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-relate-product',
  standalone: true,
  imports: [CommonModule, ProductCard],
  templateUrl: './relate-product.html',
})
export class RelateProduct implements OnInit {
  @Input() currentProductId!: string;
  @Input() category?: string;
  @Input() limit: number = 5;
  skeletons = Array.from({ length: 5 });

  relatedProducts: Product[] = [];
  loading = true;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    if (!this.currentProductId) {
      console.error('currentProductId is required');
      this.loading = false;
      return;
    }
    this.loadRelatedProducts();
  }

  loadRelatedProducts(): void {
    this.loading = true;

    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        let filtered = products.filter((p) => p.id !== this.currentProductId);

        if (this.category) {
          filtered = filtered.filter(
            (p) => p.category?.toLowerCase() === this.category?.toLowerCase()
          );
        }

        this.relatedProducts = this.shuffleArray(filtered).slice(0, this.limit);
        this.loading = false;
      },
      error: (err: Error) => {
        console.error('Error loading related products:', err);
        this.loading = false;
      },
    });
  }

  private shuffleArray(array: Product[]): Product[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }
}
