import { Component, computed, inject, signal } from '@angular/core';
import { CurrencyPipe, DecimalPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { describeError } from '../../services/cart.service';
import { Product, ProductCategory } from '../../models/product.model';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DecimalPipe],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css',
})
export class CatalogoComponent {
  private readonly productService = inject(ProductService);

  readonly allProducts = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  readonly categories: ProductCategory[] = ['Bloques', 'Peluches', 'Vehículos', 'Juegos de mesa'];
  readonly selectedCategories = signal<Set<ProductCategory>>(new Set());
  readonly minPrice = signal<number | null>(null);
  readonly maxPrice = signal<number | null>(null);

  readonly filteredProducts = computed(() => {
    const selected = this.selectedCategories();
    const min = this.minPrice();
    const max = this.maxPrice();
    return this.allProducts().filter(
      (p) =>
        (selected.size === 0 || selected.has(p.category)) &&
        (min === null || p.price >= min) &&
        (max === null || p.price <= max)
    );
  });

  constructor() {
    this.productService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (products) => {
          this.allProducts.set(products);
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(describeError(err));
          this.loading.set(false);
        },
      });
  }

  toggleCategory(category: ProductCategory): void {
    const next = new Set(this.selectedCategories());
    if (next.has(category)) {
      next.delete(category);
    } else {
      next.add(category);
    }
    this.selectedCategories.set(next);
  }

  isSelected(category: ProductCategory): boolean {
    return this.selectedCategories().has(category);
  }

  setMinPrice(value: string): void {
    this.minPrice.set(parsePrice(value));
  }

  setMaxPrice(value: string): void {
    this.maxPrice.set(parsePrice(value));
  }
}

function parsePrice(value: string): number | null {
  const digits = value.replace(/\D/g, '');
  return digits ? Number(digits) : null;
}
