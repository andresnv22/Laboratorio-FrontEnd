import { Component, computed, inject, input, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
})
export class ProductoComponent {
  private readonly productService = inject(ProductService);
  private readonly cart = inject(CartService);

  // Bound from the ':id' route param via withComponentInputBinding().
  readonly id = input.required<string>();

  readonly quantity = signal(1);

  readonly product = computed(() => this.productService.getById(this.id()));
  readonly related = computed(() => this.productService.getRelated(this.id()));

  readonly discountPercent = computed(() => {
    const product = this.product();
    if (!product?.compareAtPrice) {
      return 0;
    }
    return Math.round((1 - product.price / product.compareAtPrice) * 100);
  });

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
    }
  }
}
