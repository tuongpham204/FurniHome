import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';
import { Product } from '../models/product.model';
import { environment } from './../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly apiUrl = `${environment.apiUrl}/products`;

  constructor(private http: HttpClient) {}

  getAllProducts(): Observable<Product[]> {
    return this.http
      .get<Product[]>(this.apiUrl)
      .pipe(retry(1), timeout(5000), catchError(this.handleError));
  }

  getProductById(id: number): Observable<Product> {
    return this.http
      .get<Product>(`${this.apiUrl}/${id}`)
      .pipe(retry(1), timeout(5000), catchError(this.handleError));
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    const params = new HttpParams().set('category', category);

    return this.http
      .get<Product[]>(this.apiUrl, { params })
      .pipe(retry(1), timeout(5000), catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    console.error('ProductService error:', error);

    let message = 'Something went wrong. Please try again later.';
    if (error.error instanceof ErrorEvent) {
      message = error.error.message;
    }

    return throwError(() => new Error(message));
  }
}
