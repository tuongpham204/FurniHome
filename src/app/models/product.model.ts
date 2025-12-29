// product.model.ts

export interface ProductDimensions {
  depth: number;
  width: number;
  height: number;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  short_description: string;
  description: string;
  wood_type: string;
  finish: string;
  dimensions: ProductDimensions;
  price: number;
  discount_price?: number;
  weight: number;
  image_path: string;
  stock: number;
  sku: string;
  status: 'active' | 'inactive';
  featured: boolean;
  created_at: string;
  updated_at: string;
  tags: string[];
}

export interface ProductFilters {
  category?: string;
  wood_type?: string;
  finish?: string;
  min_price?: number;
  max_price?: number;
  featured?: boolean;
  search?: string;
}

export interface ProductResponse {
  products: Product[];
  total: number;
}
