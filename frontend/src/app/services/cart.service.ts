import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../config/api.config';
import { ApiProduct, Product, toProduct } from '../models/product.model';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface ApiCart {
  items: { productId: string; quantity: number; product: ApiProduct }[];
  subtotal: number;
  shipping: number;
  total: number;
}

interface CartState {
  items: CartItem[];
  subtotal: number;
  shipping: number;
  total: number;
}

const EMPTY_CART: CartState = { items: [], subtotal: 0, shipping: 0, total: 0 };

// El carrito vive en MongoDB. Este servicio guarda la última respuesta del
// backend en un signal, así el header, el carrito y el producto se actualizan solos.
@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${API_URL}/cart`;

  private readonly state = signal<CartState>(EMPTY_CART);

  readonly cartItems = computed(() => this.state().items);
  readonly subtotal = computed(() => this.state().subtotal);
  readonly shipping = computed(() => this.state().shipping);
  readonly total = computed(() => this.state().total);
  readonly itemCount = computed(() =>
    this.state().items.reduce((sum, item) => sum + item.quantity, 0)
  );

  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  constructor() {
    this.reload();
  }

  reload(): void {
    this.run(this.http.get<ApiCart>(this.baseUrl));
  }

  add(product: Product, quantity = 1): void {
    this.run(this.http.post<ApiCart>(`${this.baseUrl}/items`, { productId: product.id, quantity }));
  }

  updateQuantity(productId: string, quantity: number): void {
    this.run(
      this.http.patch<ApiCart>(`${this.baseUrl}/items/${encodeURIComponent(productId)}`, { quantity })
    );
  }

  remove(productId: string): void {
    this.run(this.http.delete<ApiCart>(`${this.baseUrl}/items/${encodeURIComponent(productId)}`));
  }

  private run(request: Observable<ApiCart>): void {
    this.loading.set(true);
    request.subscribe({
      next: (cart) => {
        this.state.set({
          items: cart.items.map((item) => ({ product: toProduct(item.product), quantity: item.quantity })),
          subtotal: cart.subtotal,
          shipping: cart.shipping,
          total: cart.total,
        });
        this.error.set(null);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.error.set(describeError(err));
        this.loading.set(false);
      },
    });
  }
}

export function describeError(err: HttpErrorResponse): string {
  // Nuestro backend siempre responde los errores como { error: "..." }.
  const backendMessage: string | undefined = err.error?.error;
  if (backendMessage) {
    return backendMessage;
  }
  // Sin ese cuerpo, la respuesta no vino del backend: el navegador no llegó (0)
  // o el proxy de `ng serve` no lo encontró (5xx vacío).
  if (err.status === 0 || err.status >= 500) {
    return 'No se pudo conectar con el servidor. ¿Está corriendo el backend en http://localhost:3000?';
  }
  return 'Ocurrió un error inesperado. Intenta de nuevo.';
}
