import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

const SHIPPING_THRESHOLD = 150_000;

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent {
  private readonly cart = inject(CartService);

  readonly items = this.cart.cartItems;
  readonly subtotal = this.cart.subtotal;

  readonly shipping = computed(() => (this.subtotal() >= SHIPPING_THRESHOLD || this.subtotal() === 0 ? 0 : 12900));
  readonly total = computed(() => this.subtotal() + this.shipping());

  increment(productId: string, currentQuantity: number): void {
    this.cart.updateQuantity(productId, currentQuantity + 1);
  }

  decrement(productId: string, currentQuantity: number): void {
    this.cart.updateQuantity(productId, currentQuantity - 1);
  }

  remove(productId: string): void {
    this.cart.remove(productId);
  }
}
