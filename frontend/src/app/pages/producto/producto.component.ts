import { Component, computed, inject, input, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed, toObservable } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { catchError, forkJoin, map, of, switchMap, tap } from 'rxjs';
import { ProductService } from '../../services/product.service';
import { CartService, describeError } from '../../services/cart.service';
import { Product } from '../../models/product.model';

type LoadStatus = 'loading' | 'ok' | 'not-found' | 'error';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
})
export class ProductoComponent {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);

  // Llega desde el parámetro ':id' de la ruta gracias a withComponentInputBinding().
  readonly id = input.required<string>();

  readonly product = signal<Product | null>(null);
  readonly related = signal<Product[]>([]);
  readonly status = signal<LoadStatus>('loading');
  readonly errorMessage = signal<string | null>(null);
  readonly quantity = signal(1);
  readonly justAdded = signal(false);
  readonly cartError = this.cart.error;

  readonly discountPercent = computed(() => {
    const product = this.product();
    if (!product?.compareAtPrice) {
      return 0;
    }
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  });

  readonly stars = computed(() => {
    const rating = Math.round(this.product()?.rating ?? 0);
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  });

  constructor() {
    // Cada vez que cambia el id (p. ej. al hacer clic en un relacionado) recargamos.
    toObservable(this.id)
      .pipe(
        tap(() => {
          this.status.set('loading');
          this.quantity.set(1);
          this.justAdded.set(false);
        }),
        switchMap((id) =>
          forkJoin({
            product: this.productService.getById(id),
            related: this.productService.getRelated(id).pipe(catchError(() => of([] as Product[]))),
          }).pipe(
            map((result) => ({ ok: true as const, ...result })),
            catchError((err: HttpErrorResponse) => of({ ok: false as const, err }))
          )
        ),
        takeUntilDestroyed()
      )
      .subscribe((result) => {
        if (result.ok) {
          this.product.set(result.product);
          this.related.set(result.related);
          this.status.set('ok');
          return;
        }
        this.product.set(null);
        this.related.set([]);
        if (result.err.status === 404) {
          this.status.set('not-found');
        } else {
          this.errorMessage.set(describeError(result.err));
          this.status.set('error');
        }
      });
  }

  increment(): void {
    this.quantity.update((q) => q + 1);
  }

  decrement(): void {
    this.quantity.update((q) => Math.max(1, q - 1));
  }

  addToCart(): void {
    const product = this.product();
    if (product) {
      this.cart.add(product, this.quantity());
      this.justAdded.set(true);
    }
  }
}
