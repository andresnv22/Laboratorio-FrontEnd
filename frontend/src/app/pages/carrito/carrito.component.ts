import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService, describeError } from '../../services/cart.service';
import { OrderService } from '../../services/order.service';
import { Order } from '../../models/order.model';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, FormsModule],
  templateUrl: './carrito.component.html',
  styleUrl: './carrito.component.css',
})
export class CarritoComponent {
  private readonly cart = inject(CartService);
  private readonly orderService = inject(OrderService);

  readonly items = this.cart.cartItems;
  readonly subtotal = this.cart.subtotal;
  readonly shipping = this.cart.shipping;
  readonly total = this.cart.total;
  readonly cartError = this.cart.error;

  // Datos del formulario de checkout
  customer = { customerName: '', customerEmail: '', customerAddress: '' };

  readonly submitting = signal(false);
  readonly checkoutError = signal<string | null>(null);
  readonly lastOrder = signal<Order | null>(null);

  increment(productId: string, currentQuantity: number): void {
    this.cart.updateQuantity(productId, currentQuantity + 1);
  }

  decrement(productId: string, currentQuantity: number): void {
    this.cart.updateQuantity(productId, currentQuantity - 1);
  }

  remove(productId: string): void {
    this.cart.remove(productId);
  }

  checkout(form: NgForm): void {
    if (form.invalid || this.items().length === 0) {
      form.control.markAllAsTouched();
      return;
    }

    this.submitting.set(true);
    this.checkoutError.set(null);

    this.orderService.checkout(this.customer).subscribe({
      next: (order) => {
        this.lastOrder.set(order);
        this.submitting.set(false);
        form.resetForm();
        // El backend ya vació el carrito; traemos el estado nuevo.
        this.cart.reload();
      },
      error: (err: HttpErrorResponse) => {
        this.checkoutError.set(describeError(err));
        this.submitting.set(false);
      },
    });
  }
}
