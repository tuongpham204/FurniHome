import { Component, OnInit, OnDestroy } from '@angular/core';
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

  currentSlide = 0;
  itemsPerSlide = 7;
  numSlides = 0;

  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;

  constructor(private router: Router, private productService: ProductService) {}

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

  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.productService
      .getAllProducts()
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (products: Product[]) => {
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
          this.error = 'Unable to load categories. Please try again later.';
        },
      });
  }

  formatCategoryName(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

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

  getNumSlides(): number {
    return Math.max(1, Math.ceil(this.categories.length / this.itemsPerSlide));
  }

  getVisibleCategories(): Category[] {
    const startIndex = this.currentSlide * this.itemsPerSlide;
    const endIndex = startIndex + this.itemsPerSlide;
    return this.categories.slice(startIndex, endIndex);
  }

  getSlideIndicators(): number[] {
    return Array.from({ length: this.getNumSlides() }, (_, i) => i);
  }

  selectCategory(category: Category): void {
    this.router.navigate(['/products'], {
      queryParams: { category: category.slug },
    });
  }

  nextSlide(): void {
    if (this.currentSlide < this.numSlides - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }
  }

  prevSlide(): void {
    if (this.currentSlide > 0) {
      this.currentSlide--;
    } else {
      this.currentSlide = this.numSlides - 1;
    }
  }

  goToSlide(index: number): void {
    this.currentSlide = Math.max(0, Math.min(index, this.numSlides - 1));
  }
}
