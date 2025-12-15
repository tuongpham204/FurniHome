import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule, ChevronLeft, ChevronRight } from 'lucide-angular';
import { ProductService } from '../../service/product.service';
import { Product } from '../../models/product.model';
import { finalize } from 'rxjs/operators';

interface Category {
  name: string;
  slug: string;
  count: number;
  image?: string;
}

@Component({
  selector: 'app-category',
  standalone: true,
  imports: [CommonModule, LucideAngularModule],
  templateUrl: './category-section.html',
})
export class CategorySection implements OnInit, OnDestroy {
  categories: Category[] = [];
  loading = true;
  error = '';

  // Carousel state
  currentSlide = 0;
  itemsPerSlide = 7;
  numSlides = 0;

  // Icons
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  constructor(
    private router: Router, 
    private productService: ProductService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.updateItemsPerSlide();
    window.addEventListener('resize', this.handleResize);
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.handleResize);
  }

  private handleResize = (): void => {
    this.updateItemsPerSlide();
  };

  /**
   * Load categories from API by extracting unique categories from products
   */
  loadCategories(): void {
    this.loading = true;
    this.error = '';
    console.log('Starting to load categories...');

    this.productService
      .getAllProducts()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges(); // Trigger change detection
          console.log('Loading finished. Categories:', this.categories.length);
        })
      )
      .subscribe({
        next: (products: Product[]) => {
          console.log('Products loaded:', products.length);
          const categoryMap = new Map<string, { count: number; firstImage: string }>();

          products.forEach((product) => {
            if (product.category && product.image_path) {
              if (!categoryMap.has(product.category)) {
                categoryMap.set(product.category, { count: 0, firstImage: product.image_path });
              }
              const current = categoryMap.get(product.category)!;
              current.count++;
            }
          });

          this.categories = Array.from(categoryMap.entries()).map(
            ([categorySlug, { count, firstImage }]) => ({
              name: this.formatCategoryName(categorySlug),
              slug: categorySlug,
              count: count,
              image: firstImage || 'assets/images/categories/default.png',
            })
          );

          this.categories.sort((a, b) => b.count - a.count);

          this.currentSlide = 0;
          this.updateItemsPerSlide();
        },
        error: (err) => {
          console.error('Subscribe error:', err);
          this.error = 'Không thể tải danh mục. Vui lòng thử lại sau.';
          this.cdr.detectChanges(); // Trigger change detection for error state
        },
      });
  }

  /**
   * Format category slug to display name
   */
  formatCategoryName(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Update items per slide based on screen size
   */
  updateItemsPerSlide(): void {
    const width = window.innerWidth;
    if (width < 640) {
      this.itemsPerSlide = 2;
    } else if (width < 768) {
      this.itemsPerSlide = 3;
    } else if (width < 1024) {
      this.itemsPerSlide = 4;
    } else if (width < 1280) {
      this.itemsPerSlide = 5;
    } else {
      this.itemsPerSlide = 7;
    }
    this.numSlides = this.getNumSlides();
    this.currentSlide = Math.min(this.currentSlide, Math.max(0, this.numSlides - 1));
  }

  /**
   * Get number of slides
   */
  getNumSlides(): number {
    return Math.max(1, Math.ceil(this.categories.length / this.itemsPerSlide));
  }

  /**
   * Get visible categories for current slide
   */
  getVisibleCategories(): Category[] {
    const startIndex = this.currentSlide * this.itemsPerSlide;
    const endIndex = startIndex + this.itemsPerSlide;
    return this.categories.slice(startIndex, endIndex);
  }

  /**
   * Get slide indicators array
   */
  getSlideIndicators(): number[] {
    return Array.from({ length: this.getNumSlides() }, (_, i) => i);
  }

  /**
   * Navigate to products page with category filter
   */
  selectCategory(category: Category): void {
    this.router.navigate(['/products'], {
      queryParams: { category: category.slug },
    });
  }

  /**
   * Carousel navigation
   */
  nextSlide(): void {
    if (this.currentSlide < this.numSlides - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0; // Loop back to first slide
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.numSlides - 1; // Loop to last slide
    }
  }

  /**
   * Go to specific slide
   */
  goToSlide(index: number): void {
    this.currentSlide = Math.max(0, Math.min(index, this.numSlides - 1));
  }

}