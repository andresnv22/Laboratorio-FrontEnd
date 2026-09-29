import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_URL } from '../config/api.config';
import { ApiProduct, Product, toProduct } from '../models/product.model';

export interface ProductFilters {
  category?: string;
  search?: string;
}

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_URL}/products`;

  getAll(filters: ProductFilters = {}): Observable<Product[]> {
    let params = new HttpParams();
    if (filters.category) params = params.set('category', filters.category);
    if (filters.search) params = params.set('search', filters.search);

    return this.http
      .get<ApiProduct[]>(this.baseUrl, { params })
      .pipe(map((list) => list.map(toProduct)));
  }

  getById(id: string): Observable<Product> {
    return this.http.get<ApiProduct>(`${this.baseUrl}/${encodeURIComponent(id)}`).pipe(map(toProduct));
  }

  getRelated(id: string): Observable<Product[]> {
    return this.http
      .get<ApiProduct[]>(`${this.baseUrl}/${encodeURIComponent(id)}/related`)
      .pipe(map((list) => list.map(toProduct)));
  }
}
