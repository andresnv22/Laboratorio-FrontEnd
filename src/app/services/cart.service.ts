import { Injectable, computed, signal } from '@angular/core';
import { Product } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly items = signal<CartItem[]>([]);

  readonly cartItems = computed(() => this.items());

  readonly itemCount = computed(() =>
    this.items().reduce((total, item) => total + item.quantity, 0)
  );

  readonly subtotal = computed(() =>
    this.items().reduce((total, item) => total + item.product.price * item.quantity, 0)
  );

  add(product: Product, quantity = 1): void {
    const current = this.items();
    const existing = current.find((item) => item.product.id === product.id);
    if (existing) {
      this.items.set(
        current.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        )
      );
    } else {
      this.items.set([...current, { product, quantity }]);
    }
  }

  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.remove(productId);
      return;
    }
    this.items.set(
      this.items().map((item) => (item.product.id === productId ? { ...item, quantity } : item))
    );
  }

  remove(productId: string): void {
    this.items.set(this.items().filter((item) => item.product.id !== productId));
  }

  clear(): void {
    this.items.set([]);
  }
}
