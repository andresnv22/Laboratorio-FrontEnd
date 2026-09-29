import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService, describeError } from '../../services/cart.service';
import { Product } from '../../models/product.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);

  readonly featured = signal<Product[]>([]);
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);

  constructor() {
    this.productService
      .getAll()
      .pipe(takeUntilDestroyed())
      .subscribe({
        next: (products) => {
          this.featured.set(products.slice(0, 4));
          this.loading.set(false);
        },
        error: (err: HttpErrorResponse) => {
          this.error.set(describeError(err));
          this.loading.set(false);
        },
      });
  }

  addToCart(product: Product): void {
    this.cart.add(product);
  }
}
