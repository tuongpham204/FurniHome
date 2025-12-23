import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { ProductCard } from '../../shared/product-card/product-card';
import { Product } from '../../models/product.model';
import { LucideAngularModule, Search } from 'lucide-angular';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCard, LucideAngularModule],
  templateUrl: './product-page.html',
})
export class ProductPage implements OnInit {
  products: Product[] = [];
  filteredProducts: Product[] = [];

  loading = true;
  error = '';

  selectedCategory: string = 'All';
  searchText: string = '';


  pageSize = 10;
  currentPage = 1;
  totalCount = 0;
  totalPages = 0;
  totalPagesArray: number[] = [];

 
  readonly Search = Search;

  categories: string[] = ['All', 'Chair', 'Table', 'Sofa', 'Bed', 'Lamp'];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.loading = true;
    this.error = '';

    this.productService.getAllProducts().subscribe({
      next: (products: Product[]) => {
        this.products = products;
        this.loading = false;
        this.applyFilters();
      },
      error: (err: Error) => {
        console.error(err);
        this.error = 'Unable to load products.';
        this.loading = false;
      },
    });
  }

  onCategorySelected(category: string): void {
    this.selectedCategory = category;
    this.currentPage = 1;
    this.applyFilters();
  }

  onSearch(): void {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters(): void {
    let result = [...this.products];
    if (this.selectedCategory !== 'All') {
      result = result.filter(
        (p) => p.category?.toLowerCase() === this.selectedCategory.toLowerCase()
      );
    }
    if (this.searchText.trim()) {
      const keyword = this.searchText.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(keyword) ||
          p.category?.toLowerCase().includes(keyword)
      );
    }

    this.totalCount = result.length;
    this.generatePagination();

    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    this.filteredProducts = result.slice(start, end);
  }
  generatePagination(): void {
    this.totalPages = Math.ceil(this.totalCount / this.pageSize);
    this.totalPagesArray = Array.from({ length: this.totalPages }, (_, i) => i + 1);
  }

  changePage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.applyFilters();
  }
}
